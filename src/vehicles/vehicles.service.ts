import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StorageService } from '../storage/storage.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>,
    private readonly storageService: StorageService,
  ) {}

  create(dto: CreateVehicleDto) {
    return this.vehicleModel.create(dto);
  }

  async findAll() {
    const vehicles = await this.vehicleModel.find().sort({ createdAt: -1 }).exec();
    return Promise.all(vehicles.map((vehicle) => this.withImageUrls(vehicle)));
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');
    return this.withImageUrls(vehicle);
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');
    return this.withImageUrls(vehicle);
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');

    const imageKeys = await Promise.all(files.map((file) => this.storageService.uploadVehicleImage(file)));
    vehicle.images.push(...imageKeys);
    await vehicle.save();
    return this.withImageUrls(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');
    return { message: 'Vehiculo eliminado' };
  }

  private async withImageUrls(vehicle: VehicleDocument) {
    const object = vehicle.toObject();
    return {
      ...object,
      imageKeys: object.images,
      images: await this.storageService.getPublicUrls(object.images ?? []),
    };
  }
}

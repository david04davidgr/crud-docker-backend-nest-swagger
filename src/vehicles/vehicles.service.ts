import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(@InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>) {}

  create(dto: CreateVehicleDto) {
    return this.vehicleModel.create(dto);
  }

  findAll() {
    return this.vehicleModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');
    return vehicle;
  }

  async remove(id: string) {
    const vehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!vehicle) throw new NotFoundException('Vehiculo no encontrado');
    return { message: 'Vehiculo eliminado' };
  }
}

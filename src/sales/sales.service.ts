import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle, VehicleDocument } from '../vehicles/schemas/vehicle.schema';
import { CheckoutDto } from './dto/checkout.dto';
import { Sale, SaleDocument } from './schemas/sale.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  findAll() {
    return this.saleModel.find().sort({ createdAt: -1 }).exec();
  }

  async checkout(clientId: string, dto: CheckoutDto) {
    const items = [];
    let total = 0;

    for (const item of dto.items) {
      const vehicle = await this.vehicleModel.findById(item.vehicleId).exec();
      if (!vehicle) throw new NotFoundException(`Vehiculo ${item.vehicleId} no encontrado`);
      if (vehicle.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${vehicle.brand} ${vehicle.model}. Disponible: ${vehicle.stock}`,
        );
      }

      vehicle.stock -= item.quantity;
      await vehicle.save();

      const subtotal = vehicle.price * item.quantity;
      total += subtotal;
      items.push({
        vehicleId: vehicle._id,
        brand: vehicle.brand,
        model: vehicle.model,
        unitPrice: vehicle.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    return this.saleModel.create({
      clientId: new Types.ObjectId(clientId),
      items,
      total,
    });
  }
}

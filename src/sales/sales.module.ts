import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}

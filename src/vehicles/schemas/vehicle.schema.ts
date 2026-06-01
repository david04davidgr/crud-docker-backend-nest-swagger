import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, trim: true })
  brand!: string;

  @Prop({ required: true, trim: true })
  model!: string;

  @Prop({ required: true, min: 1900 })
  year!: number;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock!: number;

  @Prop({ trim: true, default: '' })
  description!: string;

  @Prop({ trim: true, default: '' })
  imageUrl!: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

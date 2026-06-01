import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SaleDocument = HydratedDocument<Sale>;

@Schema({ _id: false })
export class SaleItem {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicleId!: Types.ObjectId;

  @Prop({ required: true })
  brand!: string;

  @Prop({ required: true })
  model!: string;

  @Prop({ required: true, min: 0 })
  unitPrice!: number;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  subtotal!: number;
}

const SaleItemSchema = SchemaFactory.createForClass(SaleItem);

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId!: Types.ObjectId;

  @Prop({ type: [SaleItemSchema], required: true })
  items!: SaleItem[];

  @Prop({ required: true, min: 0 })
  total!: number;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

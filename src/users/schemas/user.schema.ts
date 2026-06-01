import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../auth/roles/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, minlength: 6 })
  password!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, enum: Role, default: Role.CLIENTE })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

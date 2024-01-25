import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: String, enum: Role }] })
  roles: Role[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurant' }] })
  restaurants: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurant' }] })
  favoriteRestaurants: Types.ObjectId[];

  @Prop({ required: true })
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

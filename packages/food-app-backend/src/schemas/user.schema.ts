import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // Should be asinged by default by mongoose but typescript complains
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: String, enum: Role }] })
  roles: Role[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurant' }] })
  restaurants: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

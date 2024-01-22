import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Restaurant } from './restaurant.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId | Restaurant;

  @Prop({ required: true })
  reservationDate: Date;

  @Prop({ required: true })
  numberOfPeople: number;

  @Prop()
  additionalNotes: string;

  @Prop({ default: false })
  isCancelled: boolean;

  @Prop({ default: false })
  isConfirmed: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type RestaurantDocument = HydratedDocument<RestaurantRating>;

@Schema()
export class RestaurantRating {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, max: 5, min: 1 })
  rating: number;

  @Prop({ default: '' })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RestaurantRatingSchema =
  SchemaFactory.createForClass(RestaurantRating);

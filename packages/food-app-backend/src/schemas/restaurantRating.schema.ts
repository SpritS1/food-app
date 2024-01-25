import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Restaurant } from './restaurant.schema';

export type RestaurantDocument = HydratedDocument<RestaurantRating>;

@Schema()
export class RestaurantRating {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Restaurant;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, max: 10, min: 1 })
  rating: number;

  @Prop({ default: '' })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RestaurantRatingSchema =
  SchemaFactory.createForClass(RestaurantRating);

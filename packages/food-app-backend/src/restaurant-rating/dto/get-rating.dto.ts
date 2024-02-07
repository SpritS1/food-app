import { Types } from 'mongoose';
import { Restaurant } from 'src/schemas/restaurant.schema';

export type RestaurantRatingDTO = {
  _id: Types.ObjectId;
  user_name: string;
  rating: number;
  comment: string;
  createdAt: Date;
  restaurant: Restaurant;
  ownerReply: string;
};

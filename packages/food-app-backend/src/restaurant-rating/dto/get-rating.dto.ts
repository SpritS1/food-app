import { Types } from 'mongoose';

export type RestaurantRatingDTO = {
  _id: Types.ObjectId;
  user_name: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

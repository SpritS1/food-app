import { Restaurant } from "./restaurant";

export type RestaurantRating = {
  _id: string;
  user_name: string;
  rating: number;
  comment: string;
  createdAt: Date;
  restaurant: Restaurant;
  ownerReply?: string;
};

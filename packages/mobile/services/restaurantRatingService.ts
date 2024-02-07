import axios from "axios";
import { CreateRestaurantRatingDto } from "../dto/restaurantRating/create-restaurant-rating.dto";
import { RestaurantRating } from "../models/restaurantRatings";

export const addRestaurantRating = async (
  rating: CreateRestaurantRatingDto
) => {
  const res = await axios.post("/restaurant-rating", rating);
};

export const getResutaurantRatings = async (restaurantId: string) => {
  const res = await axios.get<RestaurantRating[]>(
    `/restaurant-rating/${restaurantId}`
  );

  return res.data;
};

export const updateRestaurantRating = async (rating: RestaurantRating) => {
  await axios.patch(`/restaurant-rating/${rating._id}`, rating);
};

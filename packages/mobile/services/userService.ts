import axios from "axios";
import { Reservation } from "../models/reservation";
import { RestaurantRating } from "../models/restaurantRatings";

export const getUserReservations = async (userId: string) => {
  const response = await axios.get<Reservation[]>(
    `/users/${userId}/reservations`
  );
  return response.data;
};

export const getOwnerReservations = async (userId: string) => {
  const response = await axios.get<Reservation[]>(
    `/users/${userId}/owner-reservations`
  );
  return response.data;
};

export const getUserReviews = async (userId: string) => {
  const response = await axios.get<RestaurantRating[]>(
    `/users/${userId}/reviews`
  );
  return response.data;
};

import axios from "axios";
import { Reservation } from "../models/reservation";

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

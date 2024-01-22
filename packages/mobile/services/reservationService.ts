import axios from "axios";
import { CreateReservationDto } from "../dto/reservation/createReservationDTO";

export const createReservation = async (reservation: CreateReservationDto) => {
  await axios.post("/reservation", reservation);
};

export const cancelReservation = async (reservationId: string) => {
  await axios.patch(`/reservation/${reservationId}`, {
    isCancelled: true,
  });
};

export const confirmReservation = async (reservationId: string) => {
  await axios.patch(`/reservation/${reservationId}`, {
    isConfirmed: true,
  });
};

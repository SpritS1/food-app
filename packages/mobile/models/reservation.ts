import { Restaurant } from "./restaurant";

export type Reservation = {
  _id: string;
  user: string;
  restaurant: Restaurant;
  reservationDate: Date;
  numberOfPeople: number;
  additionalNotes: string;
  isConfirmed: boolean;
  isCancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateReservationDto {
  user: string;
  restaurant: string;
  reservationDate: Date;
  numberOfPeople: number;
  additionalNotes: string;
}

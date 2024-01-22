import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  restaurant: string;

  @IsDate()
  @IsNotEmpty()
  reservationDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfPeople: number;

  @IsString()
  additionalNotes: string;
}

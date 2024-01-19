import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Schema, Types } from 'mongoose';

export class CreateRestaurantRatingDto {
  @IsNotEmpty()
  restaurantId: Schema.Types.ObjectId;

  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsString()
  comment: string;
}

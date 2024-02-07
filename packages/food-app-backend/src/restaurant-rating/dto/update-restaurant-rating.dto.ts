import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantRatingDto } from './create-restaurant-rating.dto';
import { IsString } from 'class-validator';

export class UpdateRestaurantRatingDto extends PartialType(
  CreateRestaurantRatingDto,
) {
  @IsString()
  ownerReply: string;
}

import { PartialType } from "@nestjs/mapped-types";
import { CreateRestaurantDto } from "../../../food-app-backend/src/restaurant/dto/create-restaurant.dto";

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}

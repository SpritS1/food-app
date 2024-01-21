import { CuisineDTO } from "../../shared/src/dtos/CuisineDTO";
import { DaysOfWeek } from "../enums/daysOfWeek.enum";

export type Restaurant = {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  cuisine: CuisineDTO;
  owner: string;
  images: string[];
  ratingInfo: {
    averageRating: number;
    ratingsCount: number;
  };
  openingHours: Record<DaysOfWeek, { open: Date; close: Date }>;
};

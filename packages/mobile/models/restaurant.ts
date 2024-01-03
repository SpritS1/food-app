import { CuisineDTO } from "../../shared/src/dtos/CuisineDTO";

export type Restaurant = {
  _id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  cuisine: CuisineDTO;
  owner: string;
  images: string[];
};

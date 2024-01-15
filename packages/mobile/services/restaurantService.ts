import axios from "axios";
import { Restaurant } from "../models/restaurant";

export const fetchRestaurants = async (
  name: string,
  city: string,
  cuisine: string
) => {
  const response = await axios.get<Restaurant[]>(
    `/restaurant?name=${name}&city=${city}&cuisine=${cuisine}`
  );
  return response.data;
};

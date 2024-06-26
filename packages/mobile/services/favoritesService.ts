import axios from "axios";
import { Restaurant } from "../models/restaurant";

export const fetchFavorites = async (userId: string) => {
  try {
    const response = await axios.get<Restaurant[]>(
      `/users/${userId}/favorites`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

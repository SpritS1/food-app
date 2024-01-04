import { useQuery } from "react-query";
import { Restaurant } from "../models/restaurant";
import axios from "axios";

const fetchRestaurantData = async (
  restaurandId?: string
): Promise<Restaurant> => {
  try {
    if (!restaurandId) throw new Error("No restaurant id provided");

    const response = await axios.get(`/restaurant/${restaurandId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred fetching owned restaurants");
  }
};

const useRestaurant = (id: string) => {
  const queryResult = useQuery<Restaurant>("restaurant", () =>
    fetchRestaurantData(id)
  );

  return { ...queryResult };
};

export default useRestaurant;

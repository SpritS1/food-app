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

export const removeRestaurant = async (id: string) => {
  await axios.delete(`/restaurant/${id}`);
};

export const addImage = async ({
  restaurantId,
  image,
}: {
  restaurantId: string;
  image: any;
}) => {
  const formData = new FormData();
  formData.append("newImage", {
    uri: image.uri,
    name: image.fileName,
    type: image.type,
  } as any);

  await axios.post(`/restaurant/${restaurantId}/addImage`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const removeImage = async ({
  restaurantId,
  imageIndex,
}: {
  restaurantId: string;
  imageIndex: number;
}) => {
  await axios.delete(`/restaurant/${restaurantId}/image/${imageIndex}`);
};

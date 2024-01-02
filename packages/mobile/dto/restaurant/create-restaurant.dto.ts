import { ImagePickerAsset } from "expo-image-picker/build/ImagePicker.types";

export interface CreateRestaurantDto {
  name: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  cuisine: string;
  mainImage: ImagePickerAsset;
}

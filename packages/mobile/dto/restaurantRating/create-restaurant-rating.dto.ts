export interface CreateRestaurantRatingDto {
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
}

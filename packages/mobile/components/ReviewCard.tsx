import React from "react";
import { Stack, XStack, YStack, Text } from "tamagui";
import { RestaurantRating } from "../models/restaurantRatings";
import dayjs from "dayjs";

type Props = { review: RestaurantRating; showRestaurantName?: boolean };

const ReviewCard = ({ review, showRestaurantName }: Props) => {
  return (
    <Stack
      key={review._id}
      backgroundColor="$background"
      padding="$4"
      borderRadius={"$4"}
      space
    >
      <XStack justifyContent="space-between" width="100%">
        <YStack>
          <Text fontSize={"$6"}>
            {showRestaurantName ? review.restaurant.name : review.user_name}
          </Text>
          <Text fontSize={"$4"} color={"$color11"}>
            {dayjs(review.createdAt).format("DD-MM-YYYY")}
          </Text>
        </YStack>
        <Text fontSize={"$8"} color="orange">
          {review.rating}
          <Text color="$color">/</Text>
          <Text fontSize={"$6"} color="$color">
            10
          </Text>
        </Text>
      </XStack>
      <Text>{review.comment}</Text>
    </Stack>
  );
};

export default ReviewCard;

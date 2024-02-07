import React from "react";
import { Stack, XStack, YStack, Text } from "tamagui";
import { RestaurantRating } from "../models/restaurantRatings";
import dayjs from "dayjs";
import { Alert, TouchableOpacity } from "react-native";
import { updateRestaurantRating } from "../services/restaurantRatingService";
import { useMutation } from "react-query";
import Divider from "./Divider";

type Props = {
  review: RestaurantRating;
  showRestaurantName?: boolean;
  ownerView?: boolean;
  refetchData?: () => void;
};

const ReviewCard = ({
  review,
  showRestaurantName,
  ownerView,
  refetchData,
}: Props) => {
  const mutation = useMutation((review: RestaurantRating) =>
    updateRestaurantRating(review)
  );

  const handleCardPress = () => {
    if (ownerView) {
      Alert.prompt(
        "Reply to Review",
        "Enter your response:",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: review.ownerReply ? "Update" : "Reply",
            onPress: async (response) => {
              const updatedReview: RestaurantRating = {
                ...review,
                ownerReply: response,
              };

              await mutation.mutateAsync(updatedReview);
              refetchData?.();
            },
          },
        ],
        "plain-text",
        ""
      );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleCardPress}
      disabled={!ownerView}
    >
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

        <Stack space="$2">
          <Text fontSize={"$5"} color={"$color11"}>
            User review:
          </Text>
          <Text>{review.comment}</Text>
        </Stack>

        {review.ownerReply && (
          <Stack space>
            <Divider />

            <Stack space="$2">
              <Text fontSize={"$5"} color={"$color11"}>
                Owner's reply:
              </Text>
              <Text>{review.ownerReply}</Text>
            </Stack>
          </Stack>
        )}
      </Stack>
    </TouchableOpacity>
  );
};

export default ReviewCard;

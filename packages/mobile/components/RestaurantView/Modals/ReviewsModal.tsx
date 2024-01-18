import React from "react";
import { Modal } from "react-native";
import { useQuery } from "react-query";
import { getResutaurantRatings } from "../../../services/restaurantRatingService";
import { ScrollView, Stack, XStack, YStack } from "tamagui";
import { Text } from "tamagui";
import dayjs from "dayjs";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess: () => void;
  restaurantId: string;
};

const ReviewsModal = ({
  visible,
  onHide,
  onAddSuccess,
  restaurantId,
}: Props) => {
  const query = useQuery(["restaurant reviews", restaurantId], () =>
    getResutaurantRatings(restaurantId)
  );
  return (
    <Modal
      presentationStyle="pageSheet"
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <Stack
        height={"100%"}
        backgroundColor="$backgroundStrong"
        padding="$4"
        space="$4"
      >
        <Text fontSize={"$8"} textAlign="center">
          Reviews
        </Text>

        <ScrollView>
          {query.data &&
            query.data.map((review) => (
              <Stack
                key={review._id}
                backgroundColor="$background"
                padding="$4"
                borderRadius={"$4"}
                space
              >
                <XStack justifyContent="space-between" width="100%">
                  <YStack>
                    <Text fontSize={"$6"}>{review.user_name}</Text>
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
            ))}
        </ScrollView>
      </Stack>
    </Modal>
  );
};

export default ReviewsModal;

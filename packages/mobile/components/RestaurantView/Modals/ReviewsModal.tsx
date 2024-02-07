import React, { useEffect } from "react";
import { Modal } from "react-native";
import { useQuery } from "react-query";
import { getResutaurantRatings } from "../../../services/restaurantRatingService";
import { ScrollView, Stack, XStack, YStack } from "tamagui";
import { Text } from "tamagui";
import dayjs from "dayjs";
import ReviewCard from "../../ReviewCard";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess: () => void;
  restaurantId: string;
  ownerView: boolean;
};

const ReviewsModal = ({
  visible,
  onHide,
  onAddSuccess,
  restaurantId,
  ownerView,
}: Props) => {
  const query = useQuery(["restaurant reviews", restaurantId], () =>
    getResutaurantRatings(restaurantId)
  );

  useEffect(() => {
    if (visible) query.refetch();
  }, [visible]);

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

        <ScrollView space>
          {query.data &&
            query.data.map((review) => (
              <ReviewCard
                review={review}
                key={review._id}
                ownerView={ownerView}
                refetchData={query.refetch}
              />
            ))}
        </ScrollView>
      </Stack>
    </Modal>
  );
};

export default ReviewsModal;

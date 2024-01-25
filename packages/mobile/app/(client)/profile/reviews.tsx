import React from "react";
import { ScrollView, Stack, Text } from "tamagui";
import ReviewCard from "../../../components/ReviewCard";
import { useQuery } from "react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { getUserReviews } from "../../../services/userService";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const reviews = (props: Props) => {
  const auth = useAuth();
  const query = useQuery(["user-reviews", auth.userData?.userId], () =>
    getUserReviews(auth.userData?.userId || "")
  );

  return (
    <SafeAreaView>
      <Stack padding="$4" space>
        <Text fontSize="$6">Your reviews</Text>
        <ScrollView space>
          {query.data?.map((review) => (
            <ReviewCard review={review} key={review._id} showRestaurantName />
          ))}
        </ScrollView>
      </Stack>
    </SafeAreaView>
  );
};

export default reviews;

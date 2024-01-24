import React from "react";
import { Image, Stack, Text, XStack, YStack } from "tamagui";
import { Restaurant } from "../../models/restaurant";
import { TouchableOpacity } from "react-native";
import FavButton from "./FavButton";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
  onFavRemove?: () => void;
  isFavourite?: boolean;
};

const ClientRestaurantCard = ({
  restaurant,
  onPress,
  isFavourite,
  onFavRemove,
}: Props) => {
  const auth = useAuth();
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <YStack
        backgroundColor="$background"
        space
        padding="$4"
        borderRadius="$4"
      >
        <Stack position="relative">
          {auth.userData?.userId && (
            <FavButton
              restaurantId={restaurant._id}
              isFavourite={isFavourite}
              onFavRemove={onFavRemove}
            />
          )}

          <Image
            source={{
              uri:
                restaurant.images.length > 0
                  ? `${process.env.EXPO_PUBLIC_API_URL}${restaurant.images[0]}`
                  : require("../../assets/images/no_photo.jpg"),
              height: 200,
            }}
            borderRadius="$4"
          />
        </Stack>
        <XStack>
          <YStack space="$2" flex={1}>
            <Text fontSize={"$8"} fontWeight={"700"}>
              {restaurant.name}
            </Text>
            <Text>
              {restaurant.city}{" "}
              {restaurant.address ? `,${restaurant.address}` : ""}
            </Text>
          </YStack>
          <Stack alignItems="center" space="$2">
            <Stack
              backgroundColor="$orange9"
              borderRadius="$4"
              paddingHorizontal="$2"
              paddingVertical="$1"
            >
              <Text textAlign="center" fontSize={"$8"}>
                {restaurant.ratingInfo.ratingsCount == 0
                  ? "-"
                  : restaurant.ratingInfo.averageRating}
              </Text>
            </Stack>

            <YStack space="$1">
              <Text fontSize="$1">Outstanding</Text>
              <Text alignSelf="flex-end" color={"$gray10"} fontSize="$1">
                ({restaurant.ratingInfo.ratingsCount})
              </Text>
            </YStack>
          </Stack>
        </XStack>
      </YStack>
    </TouchableOpacity>
  );
};

export default ClientRestaurantCard;

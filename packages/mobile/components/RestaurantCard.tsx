import React from "react";
import { TouchableOpacity } from "react-native";
import { Image, Stack, Text, XStack } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";
import { Restaurant } from "../models/restaurant";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

const RestaurantCard = React.forwardRef<TouchableOpacity, Props>(
  ({ restaurant, onPress }, ref) => {
    const images = restaurant.images;

    return (
      <TouchableOpacity ref={ref} activeOpacity={0.7} onPress={onPress}>
        <Stack
          backgroundColor="$background"
          borderRadius="$8"
          padding="$4"
          flexDirection="row"
          space
        >
          <Image
            source={{
              uri:
                images.length > 0
                  ? `${process.env.EXPO_PUBLIC_API_URL}${restaurant.images[0]}`
                  : require("../assets/images/no_photo.jpg"),
              width: 100,
              height: 100,
            }}
            borderRadius={"$8"}
          />
          <Stack space="$2" flex={1}>
            <Text fontSize={"$7"} ellipse>
              {restaurant.name}
            </Text>
            <Text>
              {`${restaurant?.city}${
                restaurant?.address ? `, ${restaurant.address}` : ""
              }`}
            </Text>
            {/* <Text>
              Visible <FontAwesome5 name="eye" />
            </Text> */}
          </Stack>
        </Stack>
      </TouchableOpacity>
    );
  }
);

export default RestaurantCard;

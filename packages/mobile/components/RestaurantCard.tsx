import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Stack, Text } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";
import { Restaurant } from "../models/restaurant";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

const RestaurantCard = React.forwardRef<TouchableOpacity, Props>(
  ({ restaurant, onPress }, ref) => {
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
              uri: require("../assets/demoImages/restaurant_profile.jpg"),
              width: 100,
              height: 100,
            }}
            borderRadius={"$8"}
          />
          <Stack space="$2">
            <Text fontSize={"$8"}>{restaurant.name}</Text>
            <Text>{restaurant.address}</Text>
            <Text>
              Visible <FontAwesome5 name="eye" />
            </Text>
          </Stack>
        </Stack>
      </TouchableOpacity>
    );
  }
);

export default RestaurantCard;

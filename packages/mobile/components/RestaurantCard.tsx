import { StyleSheet } from "react-native";
import React from "react";
import { Restaurant } from "../models/restaurant";
import { Image, Stack, Text } from "tamagui";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = { restaurant: Restaurant; onPress?: () => void };

const RestaurantCard = ({ restaurant, onPress }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
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
};

export default RestaurantCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "orange",
    borderRadius: 8,
    padding: 16,
    width: "100%",
  },
});

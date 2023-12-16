import { View, Text } from "react-native";
import React from "react";
import { Stack } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = { iconName: string; text: string; iconSize: number };

const RestaurantDetail = ({ iconName, text, iconSize }: Props) => {
  return (
    <Stack flexDirection="row" space="$2" alignItems="center">
      <Stack
        backgroundColor="$orange5"
        padding="$2"
        width={"$2"}
        borderRadius={"$2"}
        justifyContent="center"
        alignItems="center"
      >
        <FontAwesome5 name={iconName} size={iconSize} color="orange" />
      </Stack>
      <Text>{text}</Text>
    </Stack>
  );
};

export default RestaurantDetail;

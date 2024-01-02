import React from "react";
import { Stack, Text } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {
  iconName: string;
  text: string | undefined;
};

const InfoItem = ({ iconName, text }: Props) => (
  <Stack flexDirection="row" space="$2" alignItems="center">
    <Stack
      backgroundColor="$orange5"
      padding="$2"
      width={"$2"}
      borderRadius={"$2"}
      justifyContent="center"
      alignItems="center"
    >
      <FontAwesome5 name={iconName} size={16} color="orange" />
    </Stack>
    <Text>{text}</Text>
  </Stack>
);

export default InfoItem;

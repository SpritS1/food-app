import { TouchableOpacity } from "react-native";
import React from "react";
import { Stack, Text } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = { text: string; icon: string; onPress?: () => void };

const MenuItem = ({ text, icon, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Stack flexDirection="row" space="$4" alignItems="center" width={"100%"}>
        <Stack width={30} justifyContent="center" alignItems="center">
          <FontAwesome5 name={icon} color="hsl(11, 0%, 70%)" size={20} />
        </Stack>
        <Text fontSize={"$6"}>{text}</Text>
      </Stack>
    </TouchableOpacity>
  );
};

export default MenuItem;

import { View, Text } from "react-native";
import React from "react";
import { Button } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = { icon?: string; onPress: () => void; text: string; value: any };

const ModalSelectButton = ({ icon, onPress, text, value }: Props) => {
  return (
    <Button
      icon={icon ? <FontAwesome5 name={icon} size={16} /> : undefined}
      variant="outlined"
      borderColor={value ? "$orange10" : undefined}
      onPress={onPress}
    >
      {value || text}
    </Button>
  );
};

export default ModalSelectButton;

import { View, Text } from "react-native";
import React from "react";
import { Button } from "tamagui";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {
  icon?: string;
  onPress: () => void;
  defaultText: string;
  valueDisplay: string;
  isValueSet: boolean;
};

const ModalSelectButton = ({
  icon,
  onPress,
  defaultText,
  valueDisplay,
  isValueSet,
}: Props) => {
  return (
    <Button
      icon={icon ? <FontAwesome5 name={icon} size={16} /> : undefined}
      variant="outlined"
      borderColor={isValueSet ? "$orange10" : undefined}
      onPress={onPress}
    >
      {isValueSet ? valueDisplay : defaultText}
    </Button>
  );
};

export default ModalSelectButton;

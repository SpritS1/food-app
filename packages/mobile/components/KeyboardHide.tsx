import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

type Props = { children: React.ReactNode };

const KeyboardHide = (props: Props) => {
  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      {props.children}
    </TouchableWithoutFeedback>
  );
};

export default KeyboardHide;

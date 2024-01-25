import { StyleSheet } from "react-native";
import React from "react";
import { Text, YStack } from "tamagui";

type Props = {};

const SplashScreen = (props: Props) => {
  return (
    <YStack
      backgroundColor={"orange"}
      alignItems="center"
      justifyContent="center"
      height={"100%"}
    >
      <Text color={"white"}>Food Explorer</Text>
    </YStack>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});

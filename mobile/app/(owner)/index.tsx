import { SafeAreaView } from "react-native";
import React from "react";
import { YStack, Text } from "tamagui";

export default function OwnerHomeScreen() {
  return (
    <SafeAreaView>
      <YStack padding="$4" space="$4">
        <Text fontSize="$8">Witaj!</Text>
      </YStack>
    </SafeAreaView>
  );
}

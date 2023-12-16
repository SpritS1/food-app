import { SafeAreaView } from "react-native";
import React from "react";
import { YStack, Text } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";

export default function OwnerHomeScreen() {
  const auth = useAuth();

  return (
    <SafeAreaView>
      <YStack padding="$4" space="$4">
        <Text fontSize="$8">Witaj {auth.userData?.email}!</Text>
      </YStack>
    </SafeAreaView>
  );
}

import { SafeAreaView } from "react-native";
import React from "react";
import { YStack, Text, Button } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import { getUserReservations } from "../../services/userService";
import { router } from "expo-router";
import { LogOut } from "@tamagui/lucide-icons";

export default function OwnerHomeScreen() {
  const auth = useAuth();
  const query = useQuery(
    ["home-page-reservations", auth.userData?.userId],
    () => getUserReservations(auth.userData?.userId || "")
  );

  const handleLogout = async () => {
    await auth.logout();
    router.replace("/");
  };

  return (
    <SafeAreaView>
      <YStack padding="$4" space="$4" height="100%">
        <Text fontSize="$9">
          Hello {auth.userData?.name || auth.userData?.email}!
        </Text>

        {query.data && (
          <YStack space>
            {/* <Text fontSize="$7">Reservations</Text> */}
            {query.data.some(
              (reservation) =>
                !reservation.isCancelled && !reservation.isConfirmed
            ) ? (
              <Text fontSize="$5">You have new reservations to confirm!</Text>
            ) : (
              <Text fontSize="$5">
                You have no new reservations to confirm.
              </Text>
            )}
          </YStack>
        )}

        <Button
          hoverTheme
          pressTheme
          onPress={handleLogout}
          icon={LogOut}
          size="$5"
          marginTop="auto"
        >
          Change account type
        </Button>
      </YStack>
    </SafeAreaView>
  );
}

import { SafeAreaView } from "react-native";
import React from "react";
import { YStack, Text } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import { getUserReservations } from "../../services/userService";

export default function OwnerHomeScreen() {
  const auth = useAuth();
  const query = useQuery(
    ["home-page-reservations", auth.userData?.userId],
    () => getUserReservations(auth.userData?.userId || "")
  );

  return (
    <SafeAreaView>
      <YStack padding="$4" space="$4">
        <Text fontSize="$9">
          Hello {auth.userData?.name || auth.userData?.email}!
        </Text>

        {query.data && (
          <YStack space>
            <Text fontSize="$7">Reservations</Text>
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
      </YStack>
    </SafeAreaView>
  );
}

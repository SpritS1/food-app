import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { Reservation } from "../models/reservation";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import {
  cancelReservation,
  confirmReservation,
} from "../services/reservationService";
import Divider from "./Divider";

type Props = {
  reservation: Reservation;
  refetchData?: () => void;
  ownerView?: boolean;
};

const getBgColor = (isCancelled: boolean, isConfirmed: boolean) => {
  if (isCancelled) return "$red5";
  if (isConfirmed) return "$green5";
  return "$background";
};

const getText = (isCancelled: boolean, isConfirmed: boolean) => {
  if (isCancelled) return "Cancelled";
  if (isConfirmed) return "Confirmed";
  return "Awaiting confirmation";
};

const ReservationCard = ({ reservation, refetchData, ownerView }: Props) => {
  const cancelMutation = useMutation((reservationId: string) =>
    cancelReservation(reservationId)
  );

  const confirmMutation = useMutation((reservationId: string) =>
    confirmReservation(reservationId)
  );

  const handleCardPress = () => {
    if (ownerView) {
      if (reservation.isConfirmed) {
        Alert.alert(
          "Reservation Options",
          "Choose an action",
          [
            {
              text: "Cancel Reservation",
              onPress: async () => {
                await cancelMutation.mutateAsync(reservation._id);
                refetchData?.();
              },
            },
            {
              isPreferred: true,
              text: "Close",
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
        return;
      }

      Alert.alert(
        "Reservation Options",
        "Choose an action",
        [
          {
            text: "Confirm Reservation",
            isPreferred: true,
            onPress: async () => {
              await confirmMutation.mutateAsync(reservation._id);
              refetchData?.();
            },
          },
          {
            text: "Cancel Reservation",
            onPress: async () => {
              await cancelMutation.mutateAsync(reservation._id);
              refetchData?.();
            },
          },
          {
            isPreferred: true,
            text: "Close",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
      return;
    }

    Alert.alert(
      "Reservation Options",
      "Choose an action",
      [
        {
          text: "Cancel Reservation",
          onPress: async () => {
            await cancelMutation.mutateAsync(reservation._id);
            refetchData?.();
          },
        },
        {
          text: "Close",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleCardPress}
      disabled={reservation.isCancelled}
    >
      <YStack
        backgroundColor={getBgColor(
          reservation.isCancelled,
          reservation.isConfirmed
        )}
        borderRadius="$8"
        padding="$4"
        space
      >
        <XStack space justifyContent="space-between" flex={1}>
          <YStack space="$2">
            <Text fontSize={"$5"}>{reservation.restaurant.city}</Text>
          </YStack>
          <Text>{dayjs(reservation.reservationDate).format("DD/MM/YYYY")}</Text>
        </XStack>
        <XStack space justifyContent="space-between" flex={1}>
          <Text>Number of guests: {reservation.numberOfPeople}</Text>
          <Text>
            {getText(reservation.isCancelled, reservation.isConfirmed)}
          </Text>
        </XStack>

        {reservation.additionalNotes && (
          <YStack space="$2">
            <Text fontSize="$5">Additional Notes</Text>
            <Text>{reservation.additionalNotes}</Text>
          </YStack>
        )}
      </YStack>
    </TouchableOpacity>
  );
};

export default ReservationCard;

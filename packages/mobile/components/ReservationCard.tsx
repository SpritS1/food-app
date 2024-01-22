import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { Reservation } from "../models/reservation";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import { cancelReservation } from "../services/reservationService";

type Props = { reservation: Reservation; refetchData: () => void };

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

const ReservationCard = ({ reservation, refetchData }: Props) => {
  const mutation = useMutation((reservationId: string) =>
    cancelReservation(reservationId)
  );

  const handleCardPress = () => {
    Alert.alert(
      "Reservation Options",
      "Choose an action",
      [
        {
          text: "Cancel Reservation",
          onPress: async () => {
            await mutation.mutateAsync(reservation._id);
            refetchData();
          },
        },
        // {
        //   text: "View Details",
        //   onPress: () => console.log("View Details pressed"),
        // },
        {
          isPreferred: true,
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
          <Text fontSize={"$6"}>{reservation.restaurant.name}</Text>
          <Text>{dayjs(reservation.reservationDate).format("DD/MM/YYYY")}</Text>
        </XStack>
        <XStack space justifyContent="space-between" flex={1}>
          <Text>Number of guests: {reservation.numberOfPeople}</Text>
          <Text>
            {getText(reservation.isCancelled, reservation.isConfirmed)}
          </Text>
        </XStack>
      </YStack>
    </TouchableOpacity>
  );
};

export default ReservationCard;

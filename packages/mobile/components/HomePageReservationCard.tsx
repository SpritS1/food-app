import React from "react";
import { Reservation } from "../models/reservation";
import { YStack, Text } from "tamagui";
import dayjs from "dayjs";

type Props = { reservation: Reservation };

const HomePageReservationCard = ({ reservation }: Props) => {
  return (
    <YStack
      backgroundColor={"$background"}
      borderRadius="$8"
      padding="$4"
      space="$2"
    >
      <Text fontSize={"$6"}>{reservation.restaurant.name}</Text>
      <Text>
        {dayjs(reservation.reservationDate).format("DD-MM-YYYY, HH:mm")}
      </Text>
    </YStack>
  );
};

export default HomePageReservationCard;

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, ScrollView, Spinner, Button, Stack } from "tamagui";
import { getUserReservations } from "../../services/userService";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { Reservation } from "../../models/reservation";
import ReservationCard from "../../components/ReservationCard";
import { Link } from "expo-router";

type Props = {};

const Bookings = (props: Props) => {
  const auth = useAuth();
  const query = useQuery(
    ["reservations", auth.userData?.userId],
    () => getUserReservations(auth.userData?.userId || ""),
    {
      enabled: !!auth.userData?.userId,
    }
  );

  return (
    <SafeAreaView>
      <ScrollView space padding="$4">
        <Text fontSize={"$8"}>Your reservations</Text>

        {auth.userData?.userId ? (
          query.isLoading ? (
            <Spinner />
          ) : (
            query.data?.map((reservation: Reservation) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                refetchData={query.refetch}
              />
            ))
          )
        ) : (
          <Stack
            height={"100%"}
            padding="$4"
            space
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$8" textAlign="center">
              You must be logged in to view your reservations
            </Text>
            <Link href="/sign-in" asChild>
              <Button>Sign in</Button>
            </Link>
          </Stack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookings;

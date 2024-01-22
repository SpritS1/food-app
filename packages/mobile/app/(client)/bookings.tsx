import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, ScrollView, Spinner } from "tamagui";
import { getUserReservations } from "../../services/userService";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { Reservation } from "../../models/reservation";
import ReservationCard from "../../components/ReservationCard";

type Props = {};

const Bookings = (props: Props) => {
  const auth = useAuth();
  const query = useQuery(["reservations", auth.userData?.userId], () =>
    getUserReservations(auth.userData?.userId || "")
  );

  return (
    <SafeAreaView>
      <ScrollView space padding="$4">
        <Text fontSize={"$8"}>Your reservations</Text>
        {query.isLoading ? (
          <Spinner />
        ) : (
          query.data?.map((reservation: Reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              refetchData={query.refetch}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookings;

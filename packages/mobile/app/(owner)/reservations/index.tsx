import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "tamagui";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "react-query";
import { getOwnerReservations } from "../../../services/userService";
import ReservationCard from "../../../components/ReservationCard";

type Props = {};

const index = (props: Props) => {
  const auth = useAuth();
  const query = useQuery(["reservations", auth.userData?.userId], () =>
    getOwnerReservations(auth.userData?.userId || "")
  );

  return (
    <SafeAreaView>
      <ScrollView space padding="$4">
        <Text fontSize={"$8"}>Reservations</Text>
        {query.data?.map((reservation) => (
          <ReservationCard
            key={reservation._id}
            reservation={reservation}
            refetchData={query.refetch}
            ownerView
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

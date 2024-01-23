import { SafeAreaView, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import { YStack, Text, Button, XStack, ScrollView } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Restaurant } from "../../models/restaurant";
import ClientRestaurantCard from "../../components/ClientRestaurantCard/ClientRestaurantCard";
import { useQuery } from "react-query";
import { fetchFavorites } from "../../services/favoritesService";
import { getUserReservations } from "../../services/userService";
import dayjs from "dayjs";
import ReservationCard from "../../components/ReservationCard";
import HomePageReservationCard from "../../components/HomePageReservationCard";

export default function ClientHomeScreen() {
  const auth = useAuth();

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  const favoritesQuery = useQuery(["favorites", auth.userData?.userId], () =>
    fetchFavorites(auth.userData?.userId || "")
  );

  const reservationsQuery = useQuery(
    ["reservations", auth.userData?.userId],
    () => getUserReservations(auth.userData?.userId || "")
  );

  const [recentlyViewed, setRecentlyViewed] = useState<Restaurant[]>([]);

  const clearRecentlyViewed = async () => {
    setRecentlyViewed([]);
    await AsyncStorage.removeItem("recentlyViewedRestaurants");
  };

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      const recentlyViewedString = await AsyncStorage.getItem(
        "recentlyViewedRestaurants"
      );
      const recentlyViewedArray = recentlyViewedString
        ? JSON.parse(recentlyViewedString)
        : [];
      setRecentlyViewed(recentlyViewedArray);
    };

    loadRecentlyViewed();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <SafeAreaView>
        <YStack padding="$4" space="$4">
          <Text fontSize="$7">Hello {auth.userData?.name}</Text>
          <Text fontSize="$8" fontWeight={"600"}>
            Let's find you something to eat!
          </Text>

          <Link href="/(client)/search">
            <Button color="orange">Find restaurants</Button>
          </Link>

          {reservationsQuery.data?.some(
            (reservation) =>
              reservation.isConfirmed &&
              !reservation.isCancelled &&
              dayjs(reservation.reservationDate).diff(dayjs(), "day") < 3
          ) && (
            <YStack space>
              <Text fontSize="$6">You have upcoming reservations!</Text>

              <ScrollView space horizontal>
                {reservationsQuery.data
                  ?.filter((reservation) => {
                    return (
                      reservation.isConfirmed &&
                      !reservation.isCancelled &&
                      dayjs(reservation.reservationDate).diff(dayjs(), "day") <
                        3
                    );
                  })
                  .map((reservation) => (
                    <Link href="/(client)/bookings">
                      <HomePageReservationCard
                        key={reservation._id}
                        reservation={reservation}
                      />
                    </Link>
                  ))}
              </ScrollView>
            </YStack>
          )}

          {recentlyViewed.length > 0 && (
            <YStack space>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$6">Recently viewed</Text>
                <Button size="$3" onPress={clearRecentlyViewed}>
                  Clear
                </Button>
              </XStack>

              <ScrollView space horizontal>
                {recentlyViewed.map((restaurant) => (
                  <Link
                    href={`/(client)/search/${restaurant._id}`}
                    key={restaurant._id}
                    asChild
                  >
                    <ClientRestaurantCard
                      key={restaurant._id}
                      restaurant={restaurant}
                      isFavourite={favoritesQuery.data?.some(
                        (fav) => fav._id === restaurant._id
                      )}
                    />
                  </Link>
                ))}
              </ScrollView>
            </YStack>
          )}
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

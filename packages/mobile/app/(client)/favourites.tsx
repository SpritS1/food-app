import React from "react";
import { useQuery } from "react-query";
import { fetchFavorites } from "../../services/favoritesService";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button, ScrollView, Stack, Text } from "tamagui";
import ClientRestaurantCard from "../../components/ClientRestaurantCard/ClientRestaurantCard";

type Props = {};

const favourites = (props: Props) => {
  const auth = useAuth();

  const favoritesQuery = useQuery(
    ["favorites", auth.userData?.userId],
    () => fetchFavorites(auth.userData?.userId || ""),
    {
      enabled: !!auth.userData?.userId,
    }
  );

  if (!auth.userData?.userId) {
    return (
      <SafeAreaView>
        <Stack padding="$4" space>
          <Text fontSize={"$8"}>Favourites</Text>

          <Stack
            justifyContent="center"
            alignItems="center"
            height={"100%"}
            space
          >
            <Text fontSize="$8" textAlign="center">
              You must be logged in to view your favourites
            </Text>
            <Link href="/sign-in" asChild>
              <Button>Sign in</Button>
            </Link>
          </Stack>
        </Stack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {favoritesQuery.data && favoritesQuery.data.length === 0 && (
        <Stack justifyContent="center" alignItems="center" height={"100%"}>
          <Text fontSize="$8" textAlign="center">
            You have no favourites yet 😞
          </Text>
        </Stack>
      )}

      <ScrollView space padding="$4">
        {favoritesQuery.data?.map((restaurant) => (
          <Link
            href={`/(client)/search/${restaurant._id}`}
            key={restaurant._id}
            asChild
          >
            <ClientRestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              isFavourite
              onFavRemove={favoritesQuery.refetch}
            />
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default favourites;

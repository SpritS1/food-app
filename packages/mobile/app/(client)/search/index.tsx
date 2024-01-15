import React, { useState } from "react";
import { Input, ScrollView, Stack, Text, XStack, YStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import axios from "axios";
import { Restaurant } from "../../../models/restaurant";
import ModalSelectButton from "../../../components/ModalSelectButton";
import useModal from "../../../hooks/useModal";
import SearchLocationModal from "../../../components/SearchLocationModal";
import { Link } from "expo-router";
import ClientRestaurantCard from "../../../components/ClientRestaurantCard/ClientRestaurantCard";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchFavorites } from "../../../services/favoritesService";
import { fetchRestaurants } from "../../../services/restaurantService";

type Props = {};

const search = (props: Props) => {
  const auth = useAuth();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [cuisine, setCuisine] = useState("");

  const cityModal = useModal();

  const searchingDisbaled = !name && !city && !cuisine;

  const restaurantsQuery = useQuery(
    ["restaurants", name, city, cuisine],
    () => fetchRestaurants(name, city, cuisine),
    {
      enabled: !searchingDisbaled,
    }
  );

  const favoritesQuery = useQuery(["favorites", auth.userData?.userId], () =>
    fetchFavorites(auth.userData?.userId || "")
  );

  return (
    <SafeAreaView>
      <SearchLocationModal
        visible={cityModal.visible}
        onHide={cityModal.hideModal}
        onSelect={setCity}
      />

      <Stack height={"100%"} padding="$4" space>
        <YStack space>
          <Input
            placeholder="Restaurant name..."
            color="orange"
            value={name}
            onChangeText={setName}
          />
          <XStack>
            <ModalSelectButton
              defaultText="City"
              valueDisplay={city}
              isValueSet={Boolean(city)}
              onPress={cityModal.showModal}
            />
          </XStack>
        </YStack>

        {searchingDisbaled && (
          <Text fontSize={"$6"} textAlign="center">
            Write some details about restaurant you're looking for!
          </Text>
        )}

        <ScrollView space>
          {restaurantsQuery.data?.map((restaurant) => (
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
      </Stack>
    </SafeAreaView>
  );
};

export default search;

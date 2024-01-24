import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  ScrollView,
  Stack,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import ModalSelectButton from "../../../components/ModalSelectButton";
import useModal from "../../../hooks/useModal";
import SearchLocationModal from "../../../components/SearchLocationModal";
import { Link } from "expo-router";
import ClientRestaurantCard from "../../../components/ClientRestaurantCard/ClientRestaurantCard";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchFavorites } from "../../../services/favoritesService";
import { fetchRestaurants } from "../../../services/restaurantService";
import SearchCuisineModal from "../../../components/SearchCuisineModal";
import { CuisineDTO } from "../../../../shared/src/dtos/CuisineDTO";
import { Restaurant } from "../../../models/restaurant";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const search = (props: Props) => {
  const auth = useAuth();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [cuisine, setCuisine] = useState<CuisineDTO | null>(null);

  const cityModal = useModal();
  const cuisineModal = useModal();

  const searchingDisbaled = !name && !city && !cuisine;

  const restaurantsQuery = useQuery(
    ["restaurants", name, city, cuisine],
    () => fetchRestaurants(name, city, cuisine?.name || ""),
    {
      enabled: !searchingDisbaled,
    }
  );

  const favoritesQuery = useQuery(
    ["favorites", auth.userData?.userId],
    () => fetchFavorites(auth.userData?.userId || ""),
    {
      enabled: !!auth.userData?.userId,
    }
  );

  const [recentlyViewed, setRecentlyViewed] = useState<Restaurant[]>([]);

  const handleRestaurantPress = async (restaurant: Restaurant) => {
    const isAlreadyViewed = recentlyViewed.some(
      (viewedRestaurant) => viewedRestaurant._id === restaurant._id
    );

    if (!isAlreadyViewed) {
      const updatedRecentlyViewed = [restaurant, ...recentlyViewed];
      setRecentlyViewed(updatedRecentlyViewed);

      await AsyncStorage.setItem(
        "recentlyViewedRestaurants",
        JSON.stringify(updatedRecentlyViewed)
      );
    }
  };

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
    <SafeAreaView>
      <SearchLocationModal
        visible={cityModal.visible}
        onHide={cityModal.hideModal}
        onSelect={setCity}
      />

      <SearchCuisineModal
        visible={cuisineModal.visible}
        onHide={cuisineModal.hideModal}
        onSelect={setCuisine}
      />

      <Stack height={"100%"} padding="$4" space>
        <YStack space>
          <Input
            placeholder="Restaurant name..."
            color="orange"
            value={name}
            onChangeText={setName}
          />
          <XStack space>
            <ModalSelectButton
              defaultText="City"
              valueDisplay={city}
              isValueSet={Boolean(city)}
              onPress={cityModal.showModal}
            />

            <ModalSelectButton
              defaultText="Cuisine"
              valueDisplay={cuisine?.name || ""}
              isValueSet={Boolean(cuisine)}
              onPress={cuisineModal.showModal}
            />
          </XStack>
        </YStack>

        {recentlyViewed.length > 0 && searchingDisbaled && (
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

        <ScrollView space>
          {restaurantsQuery.data?.map((restaurant) => (
            <Link
              href={`/(client)/search/${restaurant._id}`}
              key={restaurant._id}
              asChild
              onPress={() => handleRestaurantPress(restaurant)}
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

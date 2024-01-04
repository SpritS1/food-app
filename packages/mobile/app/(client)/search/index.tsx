import React, { useState } from "react";
import { Input, ScrollView, Stack, Text, XStack, YStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import axios from "axios";
import { Restaurant } from "../../../models/restaurant";
import RestaurantCard from "../../../components/RestaurantCard";
import ModalSelectButton from "../../../components/ModalSelectButton";
import useModal from "../../../hooks/useModal";
import SearchLocationModal from "../../../components/SearchLocationModal";
import { Link } from "expo-router";

type Props = {};

const fetchRestaurants = async (
  name: string,
  city: string,
  cuisine: string
) => {
  const response = await axios.get<Restaurant[]>(
    `/restaurant?name=${name}&city=${city}&cuisine=${cuisine}`
  );
  return response.data;
};

const search = (props: Props) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [cuisine, setCuisine] = useState("");

  const cityModal = useModal();

  const searchingDisbaled = !name && !city && !cuisine;

  const { data, isLoading, error, refetch } = useQuery(
    ["restaurants", name, city, cuisine],
    () => fetchRestaurants(name, city, cuisine),
    {
      enabled: !searchingDisbaled,
    }
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
          {data?.map((restaurant) => (
            <Link
              href={`/(client)/search/${restaurant._id}`}
              key={restaurant._id}
              asChild
            >
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            </Link>
          ))}
        </ScrollView>
      </Stack>
    </SafeAreaView>
  );
};

export default search;

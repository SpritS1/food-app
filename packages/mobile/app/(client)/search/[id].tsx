import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "tamagui";
import useRestaurant from "../../../hooks/useRestaurant";
import RestaurantView from "../../../components/RestaurantView/RestaurantView";
import { StatusBar } from "expo-status-bar";

type Props = {};

const restaurant = (props: Props) => {
  const { id } = useLocalSearchParams();

  const { data, isLoading, error } = useRestaurant(id as string);

  return (
    <>
      <StatusBar style="light" />
      {data ? (
        <RestaurantView restaurant={data} />
      ) : (
        <Text>Restaurant not found</Text>
      )}
    </>
  );
};

export default restaurant;

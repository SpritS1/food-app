import React, { useEffect } from "react";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Spinner, Stack, Text } from "tamagui";
import useRestaurant from "../../../hooks/useRestaurant";
import RestaurantView from "../../../components/RestaurantView/RestaurantView";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {};

const restaurant = (props: Props) => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error } = useRestaurant(id as string);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerBackVisible: false,
      header: () => (
        <Stack
          space="$4"
          paddingBottom="$2"
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
          backgroundColor="$orange5"
          paddingTop={insets.top}
          paddingLeft="$4"
          paddingRight="$4"
        >
          <Stack flexDirection="row" alignItems="center" space="$4">
            <Link href="/(client)/search" asChild>
              <Stack padding="$2">
                <FontAwesome5 name="chevron-left" size={24} color="white" />
              </Stack>
            </Link>
          </Stack>
        </Stack>
      ),
    });
  }, [navigation]);

  return (
    <>
      <StatusBar style="light" />
      {isLoading ? (
        <Spinner />
      ) : data ? (
        <RestaurantView restaurant={data} />
      ) : (
        <Text>Restaurant not found</Text>
      )}
    </>
  );
};

export default restaurant;

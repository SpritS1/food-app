import {
  Dimensions,
  Pressable,
  StyleSheet,
  Touchable,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
  Button,
  Image,
  ScrollView,
  Spinner,
  Stack,
  Text,
  Theme,
  YStack,
} from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divide } from "@tamagui/lucide-icons";
import { Restaurant } from "../../../models/restaurant";
import axios from "axios";
import { useQuery } from "react-query";

type Props = {};

const fetchRestaurantData = async (
  restaurandId?: string
): Promise<Restaurant> => {
  try {
    if (!restaurandId) throw new Error("No restaurant id provided");

    const response = await axios.get(`/restaurant/${restaurandId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred fetching owned restaurants");
  }
};

const RestaurantDetails = (props: Props) => {
  const { restaurant } = useLocalSearchParams();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery<Restaurant>("restaurant", () =>
    fetchRestaurantData(restaurant as string)
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerBackVisible: false,
      // headerStyle: {
      //   backgroundColor: "yellow",
      // },
      header: () => (
        <Stack
          space="$4"
          paddingBottom="$4"
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
          backgroundColor="$orange5"
          paddingTop={insets.top}
          paddingLeft="$4"
          paddingRight="$4"
        >
          <Stack flexDirection="row" alignItems="center" space="$4">
            <TouchableOpacity onPress={handleBackClick}>
              <FontAwesome5 name="chevron-left" size={24} color="white" />
            </TouchableOpacity>

            <Text fontSize="$8">{data?.name}</Text>
          </Stack>

          <Pressable>
            <FontAwesome5 name="ellipsis-h" size={24} color="white" />
          </Pressable>
        </Stack>
      ),
    });
  }, [navigation]);

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) return <Spinner size="large" theme="orange" />;

  return (
    <Theme name="dark">
      <ScrollView position="relative">
        <Image
          source={{
            uri: require("../../../assets/demoImages/restaurant_profile.jpg"),
            // width: 100,
            height: 300,
          }}
        />
        <Stack backgroundColor={"$background"} padding="$4" space="$4">
          <Text fontSize="$8">{data?.name}</Text>
          <Stack flexDirection="row" space="$2" alignItems="center">
            <Stack
              backgroundColor="$orange5"
              padding="$2"
              width={"$2"}
              borderRadius={"$2"}
              justifyContent="center"
              alignItems="center"
            >
              <FontAwesome5 name="map-marker-alt" size={16} color="orange" />
            </Stack>
            <Text>{data?.address}</Text>
          </Stack>

          <Stack flexDirection="row" space="$2" alignItems="center">
            <Stack
              backgroundColor="$orange5"
              padding="$2"
              width={"$2"}
              borderRadius={"$2"}
              justifyContent="center"
              alignItems="center"
            >
              <FontAwesome5 name="utensils" size={16} color="orange" />
            </Stack>
            <Text>{data?.cuisine.join(", ")}</Text>
          </Stack>

          <Stack flexDirection="row" space="$2" alignItems="center">
            <Stack
              backgroundColor="$orange5"
              padding="$2"
              width={"$2"}
              borderRadius={"$2"}
              justifyContent="center"
              alignItems="center"
            >
              <FontAwesome5 name="money-bill" size={12} color="orange" />
            </Stack>
            <Text>Average price 85 $</Text>
          </Stack>

          <Stack></Stack>
        </Stack>
      </ScrollView>

      <Button position="fixed" bottom="$4" theme={"orange"} alignSelf="center">
        Book a table
      </Button>
    </Theme>
  );
};

export default RestaurantDetails;

const styles = StyleSheet.create({});

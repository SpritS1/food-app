import React from "react";
import {
  Button,
  Image,
  ScrollView,
  Spinner,
  Stack,
  Text,
  Theme,
} from "tamagui";
import { Dimensions } from "react-native";
import InfoItem from "./InfoItem";
import Divider from "../Divider";
import { Restaurant } from "../../models/restaurant";

type Props = { restaurant: Restaurant; ownerView?: boolean };

const RestaurantView = ({ restaurant, ownerView }: Props) => {
  return (
    <Theme name="dark">
      <ScrollView position="relative">
        <ScrollView horizontal maxHeight={250}>
          {restaurant?.images.map((image, index) => (
            <Image
              key={index}
              source={{
                uri: `${process.env.EXPO_PUBLIC_API_URL}${image}`,
                width:
                  restaurant.images.length === 1
                    ? Dimensions.get("window").width
                    : Dimensions.get("window").width * 0.85,
                height: 250,
              }}
            />
          ))}
        </ScrollView>

        <Stack backgroundColor={"$background"} padding="$4" space="$4">
          <Text fontSize="$9">{restaurant?.name}</Text>

          <InfoItem text={`${restaurant?.city}`} iconName="map-marker-alt" />
          <InfoItem text={restaurant?.cuisine.name} iconName="utensils" />
          <InfoItem text={"Average price 85 $"} iconName="money-bill" />

          <Divider />

          <Stack space="$2">
            <Text fontSize="$6" fontWeight="bold">
              About
            </Text>
            <Text>{restaurant?.description}</Text>
          </Stack>

          <Divider />

          <Stack space="$4">
            <Text fontSize="$6" fontWeight="bold">
              Contact
            </Text>
            <InfoItem text={restaurant?.phone} iconName="phone" />
            <InfoItem text={restaurant?.email} iconName="envelope" />
          </Stack>
        </Stack>
      </ScrollView>

      {!ownerView && (
        <Button position="absolute" bottom="$4" right="$4" theme={"orange"}>
          Book a table
        </Button>
      )}
    </Theme>
  );
};

export default RestaurantView;

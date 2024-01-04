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
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Restaurant } from "../../../models/restaurant";
import axios from "axios";
import { useQuery } from "react-query";
import EditRestaurantModal from "../../../components/RestaurantEdit/EditRestaurantModal";
import { Dimensions } from "react-native";
import Divider from "../../../components/Divider";
import InfoItem from "../../../components/RestaurantView/InfoItem";
import useRestaurant from "../../../hooks/useRestaurant";
import RestaurantView from "../../../components/RestaurantView/RestaurantView";

type Props = {};

const RestaurantDetails = (props: Props) => {
  const { restaurant } = useLocalSearchParams();

  const { data, isLoading, error } = useRestaurant(restaurant as string);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [editModalVisible, setEditModalVisible] = React.useState(false);

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
            <TouchableOpacity onPress={handleBackClick}>
              <Stack padding="$2">
                <FontAwesome5 name="chevron-left" size={24} color="white" />
              </Stack>
            </TouchableOpacity>
          </Stack>

          <TouchableOpacity onPress={handleEditClick}>
            <Stack padding="$2">
              <FontAwesome5 name="ellipsis-h" size={24} color="white" />
            </Stack>
          </TouchableOpacity>
        </Stack>
      ),
    });
  }, [navigation]);

  const handleBackClick = () => {
    router.back();
  };

  const handleEditClick = () => {
    setEditModalVisible(true);
  };

  if (isLoading) return <Spinner size="large" theme="orange" />;

  return (
    <>
      {data && (
        <EditRestaurantModal
          restaurantName={data?.name}
          imageUrl={`${process.env.EXPO_PUBLIC_API_URL}${data?.images[0]}`}
          visible={editModalVisible}
          onHide={() => setEditModalVisible(false)}
        />
      )}

      {data ? (
        <RestaurantView restaurant={data} ownerView />
      ) : (
        <Text>Restaurant not found</Text>
      )}
    </>
  );
};

export default RestaurantDetails;

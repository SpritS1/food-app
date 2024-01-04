import React, { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Restaurant } from "../../../models/restaurant";
import {
  Button,
  ScrollView,
  Spinner,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import RestaurantCard from "../../../components/RestaurantCard";
import { useAuth } from "../../../contexts/AuthContext";
import { Plus } from "@tamagui/lucide-icons";
import AddRestaurantModal from "../../../components/AddRestaurantModal";
import { RefreshControl } from "react-native";

type Props = {};

const fetchOwnedRestaurants = async (
  userId?: string
): Promise<Restaurant[]> => {
  try {
    if (!userId) throw new Error("No user id provided");

    const response = await axios.get(`/users/${userId}/restaurants`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred fetching owned restaurants");
  }
};

const restaurants = (props: Props) => {
  const auth = useAuth();
  const [addModalVisible, setAddModalVisible] = React.useState(false);

  const { data, isLoading, error, refetch } = useQuery<Restaurant[]>(
    "ownedRestaurants",
    () => fetchOwnedRestaurants(auth.userData?.userId)
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading) return <Spinner size="large" theme="orange" />;

  return (
    <>
      <SafeAreaView>
        <YStack padding="$4" space="$4">
          <XStack alignItems="center" space="$4" justifyContent="space-between">
            <Text fontSize="$8">Your restaurants</Text>
            <Button
              iconAfter={Plus}
              size="$2"
              theme="orange"
              onPress={() => setAddModalVisible(true)}
            >
              Add restaurant
            </Button>
          </XStack>

          <ScrollView
            padding="$4"
            space="$4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {data?.map((restaurant) => (
              <Link
                href={`/(owner)/restaurants/${restaurant._id}`}
                key={restaurant._id}
                asChild
              >
                <RestaurantCard restaurant={restaurant} />
              </Link>
            ))}
          </ScrollView>
        </YStack>
      </SafeAreaView>

      <AddRestaurantModal
        visible={addModalVisible}
        onHide={() => setAddModalVisible(false)}
        onAddSuccess={() => refetch()}
      />
    </>
  );
};

export default restaurants;

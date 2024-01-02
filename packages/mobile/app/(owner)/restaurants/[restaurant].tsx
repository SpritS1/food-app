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

  const [editModalVisible, setEditModalVisible] = React.useState(false);

  const { data, isLoading, error } = useQuery<Restaurant>("restaurant", () =>
    fetchRestaurantData(restaurant as string)
  );

  useEffect(() => {
    console.log(`Restaurant details: ${data}`);
  }, [data]);

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

      <Theme name="dark">
        <ScrollView position="relative">
          <ScrollView horizontal maxHeight={250}>
            {data?.images.map((image, index) => (
              <Image
                key={index}
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_URL}${image}`,
                  width:
                    data.images.length === 1
                      ? Dimensions.get("window").width
                      : Dimensions.get("window").width * 0.85,
                  height: 250,
                }}
              />
            ))}
          </ScrollView>

          <Stack backgroundColor={"$background"} padding="$4" space="$4">
            <Text fontSize="$9">{data?.name}</Text>

            <InfoItem text={data?.address} iconName="map-marker-alt" />
            <InfoItem text={data?.cuisine.join(", ")} iconName="utensils" />
            <InfoItem text={"Average price 85 $"} iconName="money-bill" />

            <Divider />

            <Stack space="$2">
              <Text fontSize="$6" fontWeight="bold">
                About
              </Text>
              <Text>{data?.description}</Text>
            </Stack>

            <Divider />

            <Stack space="$4">
              <Text fontSize="$6" fontWeight="bold">
                Contact
              </Text>
              <InfoItem text={data?.phone} iconName="phone" />
              <InfoItem text={data?.email} iconName="envelope" />
            </Stack>
          </Stack>
        </ScrollView>

        <Button position="absolute" bottom="$4" right="$4" theme={"orange"}>
          Book a table
        </Button>
      </Theme>
    </>
  );
};

export default RestaurantDetails;

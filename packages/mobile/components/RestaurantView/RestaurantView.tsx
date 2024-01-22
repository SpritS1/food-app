import React from "react";
import {
  Button,
  Image,
  ScrollView,
  Stack,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { Dimensions } from "react-native";
import InfoItem from "./InfoItem";
import Divider from "../Divider";
import { Restaurant } from "../../models/restaurant";
import { FontAwesome5 } from "@expo/vector-icons";
import useModal from "../../hooks/useModal";
import AddReviewModal from "./Modals/AddReviewModal";
import ReviewsModal from "./Modals/ReviewsModal";
import dayjs from "dayjs";
import Section from "./Section";
import CreateReservationModal from "./Modals/CreateReservationModal";

type Props = { restaurant: Restaurant; ownerView?: boolean };

const RestaurantView = ({ restaurant, ownerView }: Props) => {
  const {
    visible: addModalVisible,
    hideModal: hideAddModal,
    showModal: showAddModal,
  } = useModal();

  const {
    visible: reviewsModalVisible,
    hideModal: hideReviewsModal,
    showModal: showReviewsModal,
  } = useModal();

  const reservationModal = useModal();

  return (
    <>
      <ReviewsModal
        onAddSuccess={hideReviewsModal}
        onHide={hideReviewsModal}
        visible={reviewsModalVisible}
        restaurantId={restaurant._id}
      />

      <AddReviewModal
        onAddSuccess={hideAddModal}
        onHide={hideAddModal}
        visible={addModalVisible}
        restaurantId={restaurant._id}
      />

      <CreateReservationModal
        onHide={reservationModal.hideModal}
        visible={reservationModal.visible}
        restaurant={restaurant}
      />

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

            <Section title="About">
              <Text>{restaurant?.description}</Text>
            </Section>

            <Divider />

            <Section title="Contact">
              <InfoItem text={restaurant?.phone} iconName="phone" />
              <InfoItem text={restaurant?.email} iconName="envelope" />
            </Section>

            <Divider />

            <Section title="Reviews">
              <XStack space>
                <XStack
                  backgroundColor="$orange5"
                  padding="$2"
                  borderRadius={"$2"}
                  justifyContent="center"
                  alignItems="center"
                  space="$2"
                >
                  <FontAwesome5 name="star" size="20" color="orange" />
                  <Text fontSize={"$8"}>
                    {restaurant?.ratingInfo?.ratingsCount == 0
                      ? "-"
                      : restaurant.ratingInfo.averageRating}
                  </Text>
                </XStack>

                <YStack justifyContent="center" space="$1">
                  <Text fontSize={"$3"}>Awesome</Text>
                  <Text fontSize={"$2"} color="$color11">
                    {restaurant?.ratingInfo?.ratingsCount} reviews
                  </Text>
                </YStack>
              </XStack>

              <XStack space>
                <Button
                  flex={1}
                  variant="outlined"
                  icon={<FontAwesome5 name="pen" />}
                  onPress={showAddModal}
                  disabled={ownerView}
                >
                  Write a review
                </Button>
                <Button
                  flex={1}
                  icon={<FontAwesome5 name="book" />}
                  variant="outlined"
                  onPress={showReviewsModal}
                >
                  Read the reviews
                </Button>
              </XStack>
            </Section>

            {restaurant.openingHours && (
              <Stack space>
                <Divider />

                <Section title="Opening hours">
                  {Object.entries(restaurant.openingHours).map(
                    ([day, hours]) => (
                      <Text key={day}>
                        {day}: {dayjs(hours.open).format("HH:mm")} -{" "}
                        {dayjs(hours.close).format("HH:mm")}
                      </Text>
                    )
                  )}
                </Section>
              </Stack>
            )}
          </Stack>
        </ScrollView>

        {!ownerView && (
          <Button
            onPress={reservationModal.showModal}
            position="absolute"
            bottom="$4"
            right="$4"
            theme={"orange"}
          >
            Book a table
          </Button>
        )}
      </Theme>
    </>
  );
};

export default RestaurantView;

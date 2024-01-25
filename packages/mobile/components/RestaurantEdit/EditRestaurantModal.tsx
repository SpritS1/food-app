import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Image, ScrollView, Stack, Text, YStack, Button } from "tamagui";
import MenuItem from "./MenuItem";
import useModal from "../../hooks/useModal";
import EditDataModal from "./EditDataModal";
import { Restaurant } from "../../models/restaurant";
import EditOpeningHoursModal from "./EditOpeningHoursModal";
import { useMutation } from "react-query";
import { removeRestaurant } from "../../services/restaurantService";
import { router } from "expo-router";
import ManageImages from "./ManageImages";

type Props = {
  visible: boolean;
  onHide: () => void;
  restaurant: Restaurant;
  onEditSuccess: () => void;
};

const EditRestaurantModal = ({
  visible,
  onHide,
  restaurant,
  onEditSuccess,
}: Props) => {
  const {
    visible: editDataVisible,
    hideModal: hideEditData,
    showModal: showEditData,
  } = useModal();

  const hoursModal = useModal();

  const imagesModal = useModal();

  const removeMutation = useMutation(removeRestaurant);

  const handleDeletePress = async () => {
    await removeMutation.mutateAsync(restaurant._id);
    router.push("/(owner)/restaurants");
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <>
        <BlurView style={styles.blurView} tint="dark" intensity={75}>
          <SafeAreaView>
            <YStack height={"100%"} padding="$6">
              <ScrollView space="$6">
                <Stack justifyContent="center" alignItems="center" space="$6">
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_URL}${restaurant.images[0]}`,
                      width: 200,
                      height: 200,
                    }}
                    borderRadius={"$4"}
                  />

                  <Text fontSize={"$8"}>{restaurant.name}</Text>
                </Stack>

                <MenuItem text="Edit data" icon="edit" onPress={showEditData} />
                <MenuItem
                  text="Edit images"
                  icon="images"
                  onPress={imagesModal.showModal}
                />
                <MenuItem
                  text="Edit opening hours"
                  icon="clock"
                  onPress={hoursModal.showModal}
                />

                <MenuItem
                  text="Delete"
                  icon="trash"
                  onPress={handleDeletePress}
                />
              </ScrollView>

              <TouchableOpacity onPress={onHide}>
                <Text textAlign="center" fontSize={"$6"}>
                  Hide
                </Text>
              </TouchableOpacity>
            </YStack>
          </SafeAreaView>
        </BlurView>

        <EditDataModal
          visible={editDataVisible}
          onHide={hideEditData}
          restaurant={restaurant}
          onEditSuccess={onEditSuccess}
        />

        <EditOpeningHoursModal
          visible={hoursModal.visible}
          onHide={hoursModal.hideModal}
          restaurantId={restaurant._id}
        />

        <ManageImages
          visible={imagesModal.visible}
          onHide={imagesModal.hideModal}
          restaurant={restaurant}
          refetchRestaurant={onEditSuccess}
        />
      </>
    </Modal>
  );
};

export default EditRestaurantModal;

const styles = StyleSheet.create({
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

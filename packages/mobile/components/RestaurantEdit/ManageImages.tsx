import React, { useState } from "react";
import { Modal, SafeAreaView, TouchableOpacity } from "react-native";
import {
  Image,
  ScrollView,
  Stack,
  Text,
  YStack,
  Button,
  XStack,
  View,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { Restaurant } from "../../models/restaurant";
import { useMutation } from "react-query";
import { addImage, removeImage } from "../../services/restaurantService";

type Props = {
  visible: boolean;
  onHide: () => void;
  restaurant: Restaurant;
  refetchRestaurant: () => void;
};

const ManageImages = ({
  visible,
  onHide,
  restaurant,
  refetchRestaurant,
}: Props) => {
  const addMutation = useMutation(addImage);
  const removeMutation = useMutation(removeImage);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  );

  const handleOrderPress = (direction: "left" | "right") => {
    return;
  };

  const handleRemovePress = async () => {
    if (selectedImageIndex === null) return;
    await removeMutation.mutateAsync({
      restaurantId: restaurant._id,
      imageIndex: selectedImageIndex,
    });

    refetchRestaurant();
  };

  const handleAddPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0]);

      await addMutation.mutateAsync({
        restaurantId: restaurant._id,
        image: result.assets[0],
      });

      refetchRestaurant();
    }
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <Stack backgroundColor="$background" height="100%" padding="$4" space>
        <SafeAreaView>
          <Stack height="100%" space>
            <Stack space>
              <ScrollView horizontal space>
                {restaurant.images.map((image, index) => (
                  <Image
                    onPress={() => setSelectedImageIndex(index)}
                    key={`${image}-${index}`}
                    borderColor={
                      index === selectedImageIndex ? "$orange10" : "$gray11Dark"
                    }
                    borderRadius={"$4"}
                    borderWidth="$1"
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_URL}${image}`,
                      width: 200,
                      height: 200,
                    }}
                  />
                ))}
              </ScrollView>

              <Stack space>
                {/* <XStack space justifyContent="space-between">
                  <Button
                    disabled={selectedImageIndex !== null}
                    onPress={() => handleOrderPress("left")}
                  >
                    Move left
                  </Button>
                  <Button
                    disabled={selectedImageIndex !== null}
                    onPress={() => handleOrderPress("right")}
                  >
                    Move right
                  </Button>
                </XStack> */}

                <Button
                  disabled={selectedImageIndex === null}
                  theme={"red"}
                  onPress={handleRemovePress}
                >
                  Delete image
                </Button>

                <Button theme={"green"} onPress={handleAddPress}>
                  Add image
                </Button>
              </Stack>
            </Stack>

            <Stack marginTop="auto">
              <TouchableOpacity onPress={onHide}>
                <Text textAlign="center" fontSize={"$6"}>
                  Hide
                </Text>
              </TouchableOpacity>
            </Stack>
          </Stack>
        </SafeAreaView>
      </Stack>
    </Modal>
  );
};

export default ManageImages;

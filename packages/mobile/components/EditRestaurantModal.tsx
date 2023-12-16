import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { Image, ScrollView, Stack, Text, YStack, Button } from "tamagui";

type Props = {
  visible: boolean;
  onHide: () => void;
  restaurantName: string;
};

const EditRestaurantModal = ({ visible, onHide, restaurantName }: Props) => {
  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <BlurView style={styles.blurView} tint="dark" intensity={75}>
        <SafeAreaView>
          <YStack height={"100%"} padding="$6">
            <ScrollView space="$6">
              <Stack justifyContent="center" alignItems="center" space="$6">
                <Image
                  source={{
                    uri: require("../assets/demoImages/restaurant_profile.jpg"),
                    width: 200,
                    height: 200,
                  }}
                  borderRadius={"$4"}
                />

                <Text fontSize={"$8"}>{restaurantName}</Text>
              </Stack>

              <TouchableOpacity>
                <Stack
                  flexDirection="row"
                  space="$4"
                  alignItems="center"
                  width={"100%"}
                >
                  <FontAwesome5
                    name="edit"
                    color="hsl(11, 0%, 70%)"
                    size={20}
                  />
                  <Text fontSize={"$6"}>Edit data</Text>
                </Stack>
              </TouchableOpacity>

              <TouchableOpacity>
                <Stack
                  flexDirection="row"
                  space="$4"
                  alignItems="center"
                  width={"100%"}
                >
                  <FontAwesome5
                    name="utensils"
                    color="hsl(11, 0%, 70%)"
                    size={20}
                  />
                  <Text fontSize={"$6"}>Edit menu</Text>
                </Stack>
              </TouchableOpacity>

              <TouchableOpacity>
                <Stack
                  flexDirection="row"
                  space="$4"
                  alignItems="center"
                  width={"100%"}
                >
                  <FontAwesome5
                    name="eye-slash"
                    color="hsl(11, 0%, 70%)"
                    size={20}
                  />
                  <Text fontSize={"$6"}>Hide</Text>
                </Stack>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={onHide}>
              <Text textAlign="center" fontSize={"$6"}>
                Hide
              </Text>
            </TouchableOpacity>
          </YStack>
        </SafeAreaView>
      </BlurView>
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

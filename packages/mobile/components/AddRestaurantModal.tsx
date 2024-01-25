import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  YStack,
  Button,
  Text,
  Input,
  XStack,
  Image,
  ScrollView,
  TextArea,
  View,
  Stack,
} from "tamagui";
import { CreateRestaurantDto } from "../dto/restaurant/create-restaurant.dto";
import axios from "axios";
import { useMutation } from "react-query";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import useModal from "../hooks/useModal";
import SearchLocationModal from "./SearchLocationModal";
import SearchCuisineModal from "./SearchCuisineModal";
import { CuisineDTO } from "../../shared/src/dtos/CuisineDTO";
import { FontAwesome5 } from "@expo/vector-icons";
import ModalSelectButton from "./ModalSelectButton";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess: () => void;
};

interface FormValues {
  name: string;
  city: string;
  description: string;
  phone: string;
  email: string;
  cuisine: CuisineDTO;
  mainImage: ImagePickerAsset;
  address: string;
}

const restaurantSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  city: Yup.string().required("City is required"),
  description: Yup.string().required("Description is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  cuisine: Yup.object().required("Cuisine is required"),
});

const addRestaurant = async (createRestaurantDto: CreateRestaurantDto) => {
  const { name, city, description, phone, email, mainImage, cuisine, address } =
    createRestaurantDto;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("city", city);
  formData.append("description", description);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("cuisine", cuisine);
  formData.append("address", address);

  if (mainImage) {
    formData.append("mainImage", {
      uri: mainImage.uri,
      name: mainImage.fileName,
      type: mainImage.type,
    } as any);
  }
  const response = await axios.post("/restaurant", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const AddRestaurantModal = ({ visible, onHide, onAddSuccess }: Props) => {
  const {
    visible: locationModalVisible,
    hideModal: hideLocationModal,
    showModal: showLocationModal,
  } = useModal();

  const {
    visible: cuisineModalVisible,
    hideModal: hideCuisineModal,
    showModal: showCuisineModal,
  } = useModal();

  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const mutation = useMutation(addRestaurant, {
    onSuccess: () => {
      onAddSuccess();
      onHide();
    },
    onError: (error) => console.error(error),
  });

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<CreateRestaurantDto>
  ) => {
    if (!image) {
      alert("Please pick an image");
      return;
    }

    mutation.mutate({
      ...values,
      cuisine: values.cuisine._id,
      mainImage: image,
    });

    setImage(null);
    onHide();
  };

  return (
    <Modal
      presentationStyle="pageSheet"
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ justifyContent: "center" }}
      >
        <ScrollView
          height={"100%"}
          backgroundColor="$background"
          padding="$4"
          space="$4"
        >
          <XStack marginBottom="$4" space="$4" justifyContent="space-between">
            <Text fontSize="$8">New restaurant</Text>
          </XStack>

          <YStack space="$2" alignItems="center">
            <Image
              onPress={pickImage}
              source={{
                uri: image
                  ? image.uri
                  : require("../assets/images/no_photo.jpg"),
                width: 150,
                height: 150,
              }}
              borderRadius={"$8"}
            />

            <Button chromeless onPress={pickImage}>
              Pick an image
            </Button>
          </YStack>

          <Formik
            initialValues={
              {
                name: "Kebab",
                city: "",
                description: "Best kebab in town!",
                phone: "123123123",
                address: "Mariacka 7",
                email: "mateuszpenkala@gmail.com",
              } as FormValues
            }
            validationSchema={restaurantSchema}
            onSubmit={handleSubmit as any}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <>
                <SearchLocationModal
                  visible={locationModalVisible}
                  onHide={hideLocationModal}
                  onSelect={(value) => setFieldValue("city", value)}
                />

                <SearchCuisineModal
                  visible={cuisineModalVisible}
                  onHide={hideCuisineModal}
                  onSelect={(value) => setFieldValue("cuisine", value)}
                />

                <YStack space="$4">
                  <ScrollView horizontal space>
                    <ModalSelectButton
                      icon="map-marker-alt"
                      onPress={showLocationModal}
                      isValueSet={Boolean(values.city)}
                      defaultText="City"
                      valueDisplay={values.city}
                    />

                    <ModalSelectButton
                      icon="utensils"
                      onPress={showCuisineModal}
                      isValueSet={Boolean(values.cuisine)}
                      defaultText="Cuisine"
                      valueDisplay={values.cuisine?.name}
                    />
                  </ScrollView>

                  <Input
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Name"
                  />
                  {touched.name && errors.name && (
                    <Text color="$red10">{errors.name}</Text>
                  )}

                  <TextArea
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    placeholder="Description"
                  />
                  {touched.description && errors.description && (
                    <Text color="$red10">{errors.description}</Text>
                  )}

                  <Input
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    placeholder="Phone"
                  />
                  {touched.phone && errors.phone && (
                    <Text color="$red10">{errors.phone}</Text>
                  )}

                  <Input
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    value={values.address}
                    placeholder="Address"
                  />
                  {touched.address && errors.address && (
                    <Text color="$red10">{errors.address}</Text>
                  )}

                  <Input
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="Email"
                  />
                  {touched.email && errors.email && (
                    <Text color="$red10">{errors.email}</Text>
                  )}

                  <Button
                    onPress={handleSubmit as any}
                    theme={"orange"}
                    marginTop="auto"
                  >
                    Create restaurant
                  </Button>
                </YStack>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddRestaurantModal;

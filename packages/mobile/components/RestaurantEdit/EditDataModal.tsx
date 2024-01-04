import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import {
  Image,
  ScrollView,
  Text,
  YStack,
  Button,
  Input,
  TextArea,
} from "tamagui";
import { Restaurant } from "../../models/restaurant";
import { Formik, FormikHelpers } from "formik";
import ModalSelectButton from "../ModalSelectButton";
import useModal from "../../hooks/useModal";
import axios from "axios";
import * as Yup from "yup";
import { CuisineDTO } from "../../../shared/src/dtos/CuisineDTO";
import { ImagePickerAsset } from "expo-image-picker";
import { useMutation } from "react-query";
import SearchLocationModal from "../SearchLocationModal";
import SearchCuisineModal from "../SearchCuisineModal";
import { UpdateRestaurantDataDto } from "../../dto/restaurant/update-restaurant.dto";

interface FormValues {
  name: string;
  city: string;
  description: string;
  phone: string;
  email: string;
  cuisine: CuisineDTO;
}

const restaurantSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  city: Yup.string().required("City is required"),
  description: Yup.string().required("Description is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  cuisine: Yup.object().required("Cuisine is required"),
});

const editRestaurant = async (
  updateRestaurantData: UpdateRestaurantDataDto
) => {
  const { name, city, description, phone, email, _id, cuisine } =
    updateRestaurantData;

  const response = await axios.patch(
    `/restaurant/${_id}`,
    updateRestaurantData
  );

  return response.data;
};

type Props = {
  visible: boolean;
  onHide: () => void;
  restaurant: Restaurant;
  onEditSuccess?: () => void;
};

const EditDataModal = ({
  visible,
  onHide,
  restaurant,
  onEditSuccess,
}: Props) => {
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

  const mutation = useMutation(editRestaurant, {
    onSuccess: () => {
      console.log("success");
      onEditSuccess?.();
      onHide();
    },
    onError: (error) => console.error(error),
  });

  const handleSubmit = async (values: FormValues) => {
    mutation.mutate({
      _id: restaurant._id,
      ...values,
      cuisine: values.cuisine._id,
    });

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
          <Formik
            initialValues={
              {
                name: restaurant.name,
                city: restaurant.city,
                description: restaurant.description,
                phone: restaurant.phone,
                email: restaurant.email,
                cuisine: restaurant.cuisine,
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
                      valueDisplay={values.cuisine.name}
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

export default EditDataModal;

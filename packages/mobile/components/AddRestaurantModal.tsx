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
} from "tamagui";
import { CreateRestaurantDto } from "../dto/restaurant/create-restaurant.dto";
import axios from "axios";
import { useMutation } from "react-query";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess: () => void;
};

const cuisineRegex = /^[a-zA-Z]+(,\s*[a-zA-Z]+)*$/; // Regex for comma or space-separated words

const restaurantSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  cuisine: Yup.string()
    .matches(cuisineRegex, "Invalid cuisine format")
    .required("Cuisine is required"),
});

const addRestaurant = async (createRestaurantDto: CreateRestaurantDto) => {
  const { name, address, description, phone, email, mainImage, cuisine } =
    createRestaurantDto;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("address", address);
  formData.append("description", description);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("cuisine", cuisine);

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
    values: CreateRestaurantDto,
    formikHelpers: FormikHelpers<CreateRestaurantDto>
  ) => {
    if (!image) {
      alert("Please pick an image");
      return;
    }

    mutation.mutate({ ...values, mainImage: image });

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
            initialValues={{
              name: "Kebab",
              address: "Istanbul",
              description: "Best kebab in town!",
              phone: "123123123",
              email: "mateuszpenkala@gmail.com",
              cuisine: "French",
              // name: "",
              // address: "",
              // description: "",
              // phone: "",
              // email: "",
              // cuisine: "",
            }}
            validationSchema={restaurantSchema}
            onSubmit={handleSubmit as any}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <YStack space="$4">
                <Input
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder="Name"
                />
                {touched.name && errors.name && (
                  <Text color="$red10">{errors.name}</Text>
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

                <Input
                  onChangeText={handleChange("cuisine")}
                  onBlur={handleBlur("cuisine")}
                  value={values.cuisine}
                  placeholder="Cuisine (comma separated)"
                />
                {touched.cuisine && errors.cuisine && (
                  <Text theme={"red"}>{errors.cuisine}</Text>
                )}

                <Button
                  onPress={handleSubmit as any}
                  theme={"orange"}
                  marginTop="auto"
                >
                  Create restaurant
                </Button>
              </YStack>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddRestaurantModal;

import React from "react";
import { Modal, StyleSheet } from "react-native";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { YStack, Button, Text, Input, XStack } from "tamagui";
import { CreateRestaurantDto } from "../dto/restaurant/create-restaurant.dto";
import axios from "axios";
import { useMutation } from "react-query";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess: () => void;
};

const addRestaurant = async (createRestaurantDTO: CreateRestaurantDto) => {
  const response = await axios.post("/restaurant", createRestaurantDTO);
  return response.data;
};

const AddRestaurantModal = ({ visible, onHide, onAddSuccess }: Props) => {
  const mutation = useMutation(addRestaurant, {
    onSuccess: () => {
      onAddSuccess();
      onHide();
    },
    onError: (error) => console.error(error),
  });

  const restaurantSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    description: Yup.string().required("Description is required"),
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    // cuisine: Yup.array()
    //   .of(Yup.string())
    //   .required("At least one cuisine type is required"),
    cuisine: Yup.string().required("Cuisine is required"),
  });

  const handleSubmit = async (
    values: CreateRestaurantDto,
    formikHelpers: FormikHelpers<CreateRestaurantDto>
  ) => {
    mutation.mutate(values);
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
      <YStack backgroundColor="$background" height={"100%"} padding="$4">
        <XStack marginBottom="$4" space="$4" justifyContent="space-between">
          <Text fontSize="$8">New restaurant</Text>
        </XStack>
        <Formik
          initialValues={{
            name: "",
            address: "",
            description: "",
            phone: "",
            email: "",
            cuisine: "",
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

              <Input
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

              <Button onPress={handleSubmit as any} theme={"orange"}>
                Create restaurant
              </Button>
            </YStack>
          )}
        </Formik>
      </YStack>
    </Modal>
  );
};

export default AddRestaurantModal;

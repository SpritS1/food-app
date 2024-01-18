import React from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import * as Yup from "yup";
import { Text, Input, View, YStack, XStack, TextArea, Button } from "tamagui";
import { Formik } from "formik";
import KeyboardHide from "../../KeyboardHide";
import { useMutation } from "react-query";
import { addRestaurantRating } from "../../../services/restaurantRatingService";
import { useAuth } from "../../../contexts/AuthContext";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess: () => void;
  restaurantId: string;
};

interface FormValues {
  rating: string;
  comment: string;
}

const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Min 1")
    .max(10, "Max 10"),
  comment: Yup.string(),
});

const AddRestaurantModal = ({
  visible,
  onHide,
  onAddSuccess,
  restaurantId,
}: Props) => {
  const auth = useAuth();

  const mutation = useMutation(addRestaurantRating, {
    onSuccess: () => {
      onAddSuccess();
      onHide();
    },
    onError: (error) => console.error(error),
  });

  const handleSubmit = (values: FormValues) => {
    if (!auth.userData) throw new Error("User not logged in");

    mutation.mutate({
      rating: Number(values.rating),
      comment: values.comment,
      restaurantId: restaurantId,
      userId: auth.userData.userId,
    });
  };

  return (
    <Modal
      presentationStyle="pageSheet"
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <KeyboardHide>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ justifyContent: "center" }}
        >
          <View
            height={"100%"}
            backgroundColor="$background"
            padding="$4"
            space="$4"
          >
            <Text fontSize="$9" fontWeight="bold" textAlign="center">
              Your review
            </Text>

            <Formik
              initialValues={{ rating: "", comment: "" } as FormValues}
              validationSchema={reviewSchema}
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
                <YStack space="$4">
                  <YStack space={"$2"}>
                    <Text>Rate this restaurant from 1 to 10</Text>
                    <XStack space alignItems="center">
                      <Input
                        alignSelf="flex-start"
                        keyboardType="numeric"
                        onChangeText={handleChange("rating")}
                        onBlur={handleBlur("rating")}
                        value={values.rating}
                        placeholder="Rating"
                      />
                      {touched.rating && errors.rating && (
                        <Text color="$red10">{errors.rating}</Text>
                      )}
                    </XStack>
                  </YStack>

                  <YStack space>
                    <Text>Comment (optional)</Text>
                    <TextArea
                      rows={5}
                      onChangeText={handleChange("comment")}
                      onBlur={handleBlur("comment")}
                      value={values.comment}
                      placeholder="Your comment about the restaurant"
                    />
                  </YStack>

                  <Button onPress={handleSubmit as any} theme={"orange"}>
                    Add review
                  </Button>
                </YStack>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      </KeyboardHide>
    </Modal>
  );
};

export default AddRestaurantModal;

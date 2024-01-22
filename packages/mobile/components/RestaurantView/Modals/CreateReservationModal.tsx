import React from "react";

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Button, Input, ScrollView, Stack, Text } from "tamagui";
import * as Yup from "yup";
import { Formik } from "formik";
import { Restaurant } from "../../../models/restaurant";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { DaysOfWeek } from "../../../enums/daysOfWeek.enum";
import { useMutation } from "react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { createReservation } from "../../../services/reservationService";

type Props = {
  visible: boolean;
  onHide: () => void;
  onAddSuccess?: () => void;
  restaurant: Restaurant;
};

interface FormValues {
  reservationDate: Date;
  numberOfPeople: string;
  additionalNotes: string;
}

const CreateReservationModal = ({ visible, onHide, restaurant }: Props) => {
  const auth = useAuth();

  const validationSchema = Yup.object().shape({
    reservationDate: Yup.date()
      .test(
        "is-valid-date",
        "Invalid time. Please choose a date between opening and closing hours.",
        (value) => {
          if (!value) return false;

          const selectedDate = dayjs(value);

          const dayName: DaysOfWeek = selectedDate.format("dddd") as DaysOfWeek;
          const hours = restaurant.openingHours[dayName];

          const openHours = dayjs(hours.open).set("date", selectedDate.date());
          const closeHours = dayjs(hours.close).set(
            "date",
            selectedDate.date()
          );

          const isCorrect: boolean =
            selectedDate.isAfter(openHours) &&
            selectedDate.isBefore(closeHours);

          return isCorrect;
        }
      )
      .required("Reservation date is required"),
    numberOfPeople: Yup.number()
      .required("Guests number is required")
      .min(1, "Min 1"),
    additionalNotes: Yup.string(),
  });

  const mutation = useMutation(
    `newReservation-${auth.userData?.userId}-${dayjs().toISOString()}`,
    createReservation,
    {
      onSuccess: () => {
        Alert.alert(
          "Success",
          "Reservation created successfully, wait for the restaurant to confirm it."
        );
        onHide();
      },
      onError: (error) => console.error(error),
    }
  );

  const handleSubmit = async (values: FormValues) => {
    if (!auth.userData) return;

    await mutation.mutateAsync({
      user: auth.userData.userId,
      restaurant: restaurant._id,
      numberOfPeople: Number(values.numberOfPeople),
      reservationDate: values.reservationDate,
      additionalNotes: values.additionalNotes,
    });
  };

  return (
    <Modal
      presentationStyle="pageSheet"
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
      style={{ backgroundColor: "black" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.safeAreaView}
      >
        <Formik
          initialValues={
            {
              reservationDate: dayjs().toDate(),
              numberOfPeople: "",
              additionalNotes: "",
            } as FormValues
          }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
            <ScrollView
              height={"100%"}
              backgroundColor="$background"
              padding="$4"
              space="$4"
            >
              <Text fontSize="$8">Reservation</Text>

              <Text fontSize="$5">Number of guests</Text>
              <Input
                placeholder="Number of guests"
                inputMode="numeric"
                onChangeText={handleChange("numberOfPeople")}
                onBlur={handleBlur("numberOfPeople")}
                value={values.numberOfPeople}
              />
              {touched.numberOfPeople && errors.numberOfPeople && (
                <Text color={"$red10"}>{errors.numberOfPeople}</Text>
              )}

              <Text fontSize="$5">Additional notes</Text>
              <Input
                placeholder="Place your message here"
                inputMode="text"
                onChangeText={handleChange("additionalNotes")}
                onBlur={handleBlur("additionalNotes")}
                value={values.additionalNotes}
              />

              {touched.additionalNotes && errors.additionalNotes && (
                <Text color={"$red10"}>{errors.additionalNotes}</Text>
              )}

              <Text fontSize="$5">Reservation date and time</Text>

              <DateTimePicker
                themeVariant="dark"
                value={values.reservationDate}
                mode="datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={dayjs().toDate()}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  if (!selectedDate) return;

                  setFieldValue("reservationDate", selectedDate);
                }}
              />

              {errors.reservationDate && (
                <Text color={"$red10"}>{errors.reservationDate}</Text>
              )}

              <Button onPress={handleSubmit as any} theme="orange">
                Submit
              </Button>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    height: "150%",
  },
});

export default CreateReservationModal;

import React, { useState } from "react";
import {
  TouchableOpacity,
  Platform,
  GestureResponderEvent,
} from "react-native";
import { useFormik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DaysOfWeek } from "../../enums/daysOfWeek.enum";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";
import dayjs, { Dayjs } from "dayjs";

interface OpeningHoursFormProps {
  onSubmit: (
    openingHours: Record<DaysOfWeek, { open: Dayjs; close: Dayjs }>
  ) => void;
}

type TimeType = "open" | "close";

const DEFAULT_OPENING_HOURS = {
  open: dayjs().set("hour", 12).set("minute", 0),
  close: dayjs().set("hour", 22).set("minute", 0),
};

const OpeningHoursForm: React.FC<OpeningHoursFormProps> = ({ onSubmit }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DaysOfWeek | null>(null);
  const [timeType, setTimeType] = useState<TimeType>("open");

  const formik = useFormik({
    initialValues: {
      openingHours: {
        [DaysOfWeek.Monday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
        [DaysOfWeek.Tuesday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
        [DaysOfWeek.Wednesday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
        [DaysOfWeek.Thursday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
        [DaysOfWeek.Friday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
        [DaysOfWeek.Saturday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
        [DaysOfWeek.Sunday]: {
          open: DEFAULT_OPENING_HOURS.open,
          close: DEFAULT_OPENING_HOURS.close,
        },
      },
    },
    onSubmit: (values) => {
      //   console.log(values.openingHours);
      onSubmit(values.openingHours);
    },
  });

  const handleTimeChange = (event: Event, selectedTime?: Date) => {
    if (selectedTime && selectedDay) {
      formik.setFieldValue(
        `openingHours.${selectedDay}.${timeType}`,
        dayjs(selectedTime)
      );
    }
  };

  const showTimePicker = (day: DaysOfWeek, type: TimeType) => {
    setSelectedDay(day);
    setTimeType(type);
    setShowDatePicker(true);
  };

  const handleInputPress = (
    e: GestureResponderEvent,
    day: DaysOfWeek,
    type: TimeType
  ) => {
    e.preventDefault();
    showTimePicker(day as DaysOfWeek, type);
  };

  return (
    <ScrollView
      backgroundColor="$background"
      padding="$4"
      paddingBottom="50%"
      space
    >
      <DateTimePicker
        themeVariant="dark"
        value={dayjs(
          formik.values.openingHours[selectedDay as DaysOfWeek]?.[timeType] ||
            new Date()
        ).toDate()}
        mode="time"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={handleTimeChange as any}
      />

      <Button theme={"orange"} onPress={formik.handleSubmit as any}>
        Submit
      </Button>

      {Object.keys(DaysOfWeek).map((day) => (
        <YStack key={day} space>
          <Text fontSize="$6">{day}</Text>
          <XStack alignItems="center" space="$3">
            <Button
              onPress={(e) => handleInputPress(e, day as DaysOfWeek, "open")}
            >
              {formik.values.openingHours[day as DaysOfWeek].open.format(
                "HH:mm"
              ) || "Open hour"}
            </Button>

            <Text fontSize="$8">-</Text>

            <Button
              onPress={(e) => handleInputPress(e, day as DaysOfWeek, "close")}
            >
              {formik.values.openingHours[day as DaysOfWeek].close.format(
                "HH:mm"
              ) || "Close hour"}
            </Button>
          </XStack>
        </YStack>
      ))}
    </ScrollView>
  );
};

export default OpeningHoursForm;

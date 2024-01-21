import React from "react";
import { Modal } from "react-native";
import OpeningHoursForm from "./OpeningHoursForm";
import { DaysOfWeek } from "../../enums/daysOfWeek.enum";
import { Dayjs } from "dayjs";
import axios from "axios";
import { useMutation } from "react-query";

type Props = {
  visible: boolean;
  onHide: () => void;
  restaurantId: string;
};

type OpeningHours = Record<DaysOfWeek, { open: Dayjs; close: Dayjs }>;

const updateOpeningHours = async ({
  id,
  openingHours,
}: {
  id: string;
  openingHours: OpeningHours;
}) => {
  try {
    const response = await axios.put(`/restaurant/${id}/opening-hours`, {
      openingHours,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const EditOpeningHoursModal = ({ visible, onHide, restaurantId }: Props) => {
  const mutation = useMutation(
    `editOpeninghHours-${restaurantId}`,
    updateOpeningHours,
    {
      onSuccess: () => {
        onHide();
      },
      onError: (error) => console.error(error),
    }
  );

  const handleSubmit = (openingHours: OpeningHours) => {
    mutation.mutate({
      id: restaurantId,
      openingHours: openingHours,
    });

    onHide();
  };

  return (
    <Modal
      presentationStyle="formSheet"
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onHide}
    >
      <OpeningHoursForm onSubmit={handleSubmit} />
    </Modal>
  );
};

export default EditOpeningHoursModal;

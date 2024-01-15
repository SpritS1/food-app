import React, { useState } from "react";
import { Stack, useTheme } from "tamagui";
import { GestureResponderEvent } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation } from "react-query";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const addToFavourites = async ({
  userId,
  restaurantId,
}: {
  userId: string;
  restaurantId: string;
}) => {
  try {
    const response = await axios.post(`/users/${userId}/favorites`, {
      restaurantId,
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error adding to favorites");
    }
  } catch (error) {
    // Handle or rethrow the error as per your application's error handling logic
    throw error;
  }
};

const removeFavourite = async ({
  userId,
  restaurantId,
}: {
  userId: string;
  restaurantId: string;
}) => {
  try {
    const response = await axios.delete(
      `/users/${userId}/favorites/${restaurantId}`
    );

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error removing from favorites");
    }
  } catch (error) {
    // Handle or rethrow the error as per your application's error handling logic
    throw error;
  }
};

type Props = {
  restaurantId: string;
  isFavourite?: boolean;
  onFavRemove?: () => void;
};

const FavButton = ({
  restaurantId,
  isFavourite: initialFavoriteStatus = false,
  onFavRemove,
}: Props) => {
  const auth = useAuth();
  const theme = useTheme();

  const [isFavourite, setIsFavourite] = useState(initialFavoriteStatus);

  const addFavMutation = useMutation(addToFavourites, {
    onSuccess: () => setIsFavourite(true),
    onError: (error: any) => {
      console.error("Error adding to favorites:", error);
      alert(error?.message || "Error occurred");
    },
  });

  const removeFavMutation = useMutation(removeFavourite, {
    onSuccess: () => {
      setIsFavourite(false);
      onFavRemove?.();
    },
    onError: (error: any) => {
      console.error("Error removing from favorites:", error);
      alert(error?.message || "Error occurred");
    },
  });

  const handleFavPress = (e: GestureResponderEvent) => {
    e.stopPropagation();

    if (addFavMutation.isLoading || removeFavMutation.isLoading) return;
    if (!auth.userData) return;

    if (isFavourite) {
      removeFavMutation.mutate({
        userId: auth.userData.userId,
        restaurantId: restaurantId,
      });
    } else {
      addFavMutation.mutate({
        userId: auth.userData.userId,
        restaurantId: restaurantId,
      });
    }
  };

  return (
    <Stack
      onPress={handleFavPress}
      pressStyle={{ backgroundColor: "$backgroundPress" }}
      width={45}
      height={45}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      borderRadius={"$10"}
      zIndex={1}
      top="$2"
      right="$2"
    >
      <FontAwesome5
        color={isFavourite ? theme.red10.val : theme.color.val}
        name="heart"
        solid={isFavourite}
        size="20"
      />
    </Stack>
  );
};

export default FavButton;

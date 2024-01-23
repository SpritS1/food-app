import axios from "axios";
import React, { useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import { Button, Input, ScrollView, Text, XStack, YStack } from "tamagui";
import { CuisineDTO } from "../../shared/src/dtos/CuisineDTO";
import Divider from "./Divider";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSelect: (cuisine: CuisineDTO | null) => void;
};

const fetchCuisine = async () => {
  const response = await axios.get<CuisineDTO[]>(`/cuisine`);
  return response.data;
};

const SearchCuisineModal = ({ visible, onHide, onSelect }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isLoading, error, refetch } = useQuery(
    ["cuisine"],
    fetchCuisine
  );

  const handleSelect = (value: CuisineDTO) => {
    onSelect(value);
    onHide();
  };

  const handleClear = () => {
    onSelect(null);
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
      <ScrollView
        height={"100%"}
        backgroundColor="$background"
        padding="$4"
        space="$4"
      >
        <XStack justifyContent="space-between" space>
          <Text fontSize="$9">Cuisine</Text>
          <Button onPress={handleClear}>Clear</Button>
        </XStack>

        <Divider />

        <Input
          value={searchValue}
          onChangeText={(value) => setSearchValue(value)}
          placeholder="Search cuisine"
        />

        <YStack space>
          {data
            ?.filter((cuisine) => cuisine.name.includes(searchValue))
            .map((cuisine) => (
              <TouchableOpacity
                onPress={() => handleSelect(cuisine)}
                key={cuisine._id}
              >
                <XStack space alignItems="center" padding="$2">
                  <Text fontSize={"$6"}>{cuisine.name}</Text>
                </XStack>
              </TouchableOpacity>
            ))}
        </YStack>
      </ScrollView>
    </Modal>
  );
};

export default SearchCuisineModal;

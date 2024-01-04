import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "react-query";
import { Button, Input, ScrollView, Text, XStack, YStack } from "tamagui";
import { CityDTO } from "../../shared/src/dtos/CityDTO";
import Divider from "./Divider";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSelect: (city: string) => void;
};

const fetchLocations = async (name: string) => {
  const response = await axios.get<CityDTO[]>(`/city?name=${name}`);
  return response.data;
};

const SearchLocationModal = ({ visible, onHide, onSelect }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const { data, isLoading, error, refetch } = useQuery(
    ["city", debouncedSearchValue],
    () => fetchLocations(debouncedSearchValue)
  );

  const handleSelect = (city: string) => {
    onSelect(city);
    onHide();
  };

  const handleClear = () => {
    onSelect("");
    onHide();
  };

  const handleClose = () => {
    setSearchValue("");
    onHide();
  };

  return (
    <Modal
      presentationStyle="pageSheet"
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}
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
          <XStack justifyContent="space-between" space>
            <Text fontSize="$9">City</Text>
            <Button onPress={handleClear}>Clear</Button>
          </XStack>

          <Divider />

          <Input
            value={searchValue}
            onChangeText={(value) => setSearchValue(value)}
            placeholder="Search city"
          />

          <YStack space>
            {data?.map((city) => (
              <TouchableOpacity
                onPress={() => handleSelect(city.name)}
                key={city._id}
              >
                <XStack space alignItems="center" padding="$2">
                  {/* <FontAwesome5 name="city" size={24} color="white" /> */}
                  <Text fontSize={"$6"}>{city.name}</Text>
                </XStack>
              </TouchableOpacity>
            ))}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SearchLocationModal;

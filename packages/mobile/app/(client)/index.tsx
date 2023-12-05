import {
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import React from "react";
import { YStack, Text, XStack, Button, Input } from "tamagui";
import { FontAwesome } from "@expo/vector-icons";
import { Settings2 } from "@tamagui/lucide-icons";

export default function ClientHomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const colorScheme = useColorScheme();

  const getBackgroundColor = () => {
    // Determine background color based on the color scheme
    return colorScheme === "dark" ? "black" : "white"; // Modify as needed
  };

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <SafeAreaView
      // style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      >
        <YStack padding="$4" space="$4">
          <Text fontSize="$8">Witaj! Mateusz</Text>
          <Text fontSize="$9" fontWeight={"600"}>
            Gdzie dzisiaj zjemy?
          </Text>

          <XStack space="$4">
            <Input placeholder="Szukaj..." flex={1} color="orange" />
            <Button circular icon={Settings2} color="orange" />
          </XStack>
          {/* <View style={styles.searchbarContainer}>
            <Searchbar
              style={styles.searchbar}
              placeholder="Kuchnia, restauracja..."
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
            <IconButton mode="contained" icon="filter" />
          </View> */}

          {/* <View>
            <Text variant="headlineSmall" style={{ fontWeight: "500" }}>
              Popularne kategorie
            </Text>
          </View>

          <View>
            <Text variant="headlineSmall" style={{ fontWeight: "500" }}>
              W twojej okolicy
            </Text>
          </View> */}
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

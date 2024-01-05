import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, Image, YStack, Stack } from "tamagui";
import { SplashScreen as ExpoSplashScreen, router } from "expo-router";
import Svg from "../assets/undraw_breakfast_psiw.svg";
import { FontAwesome } from "@expo/vector-icons";
import SplashScreen from "../components/SplashScreen";
import { useAuth } from "../contexts/AuthContext";

type Props = {};

const StartScreen = (props: Props) => {
  // const [appIsReady, setAppIsReady] = React.useState<boolean>(false);
  const { initialized, authToken, accountType } = useAuth();

  const onLayoutRootView = useCallback(async () => {
    if (initialized) {
      console.log(`Account type: ${accountType} - ${authToken}`);
      if (authToken) {
        if (accountType === "business") router.replace("/(owner)");
        else if (accountType === "regular") router.replace("/(client)");
      }

      ExpoSplashScreen.hideAsync();
    }
  }, [initialized]);

  const handleClientPress = () => {
    router.replace("/(client)");
  };

  const handleRestaurantOwnerPress = () => {
    router.push("/(business-auth)/create-account");
  };

  if (!initialized) return <SplashScreen />;

  return (
    <SafeAreaView onLayout={onLayoutRootView}>
      <YStack space="$8" padding="$4" justifyContent="center" height={"100%"}>
        <Stack alignItems="center">
          <Svg height={150} />
        </Stack>

        <YStack space="$4">
          <Text fontSize={32} textAlign="center">
            Welcome to our app!
          </Text>
          <Text fontSize={16} textAlign="center" style={styles.font}>
            First tell us, are you a client or a restaurant owner?
          </Text>
        </YStack>

        <YStack space="$4">
          <Button
            width={"100%"}
            color="orange"
            onPress={handleClientPress}
            icon={<FontAwesome name="user" size={24} />}
          >
            Regular Client
          </Button>

          <Button
            icon={<FontAwesome name="briefcase" size={24} />}
            color="orange"
            width={"100%"}
            onPress={handleRestaurantOwnerPress}
          >
            Business Client
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  font: {
    fontFamily: "Poppins",
  },
});

export default StartScreen;

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "@tamagui/core/reset.css";

import { TamaguiProvider } from "tamagui";

import config from "../tamagui.config";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "../contexts/AuthContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <ThemeProvider value={DarkTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(client)" options={{ headerShown: false }} />
              <Stack.Screen name="(owner)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(business-auth)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

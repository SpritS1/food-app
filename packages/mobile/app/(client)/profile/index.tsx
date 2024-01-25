import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ListItem,
  Separator,
  Stack,
  Text,
  YGroup,
  YStack,
} from "tamagui";
import {
  Image,
  Settings,
  Star,
  User,
  ChefHat,
  LogOut,
} from "@tamagui/lucide-icons";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useAuth();

  const loggedIn = auth.userData;

  const handleAccountTypeChange = () => {
    auth.logout();
    router.replace("/");
  };

  const handleMyReviewsPress = () => {
    router.push("/(client)/profile/reviews");
  };

  return (
    <SafeAreaView>
      <YStack space="$4">
        <YStack space padding="$4">
          {auth.userData ? (
            <Text fontSize="$8">Hello {auth.userData?.name}!</Text>
          ) : (
            <YStack space>
              <Stack space>
                <Text fontSize="$8">Your account</Text>
                <Text fontSize="$5">
                  Sign in or create an account to access all features
                </Text>
              </Stack>
              <Link href="/sign-in" asChild>
                <Button color="orange">Login or register</Button>
              </Link>
            </YStack>
          )}
        </YStack>

        <YGroup>
          <Separator />

          {/* <YGroup.Item>
            <Link href="/(client)/profile/settings" asChild>
              <ListItem
                size="$5"
                hoverTheme
                pressTheme
                icon={Settings}
                title="Settings"
                disabled={!loggedIn}
              />
            </Link>
          </YGroup.Item> */}
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              icon={Star}
              title="My reviews"
              size="$5"
              disabled={!loggedIn}
              onPress={handleMyReviewsPress}
            />
          </YGroup.Item>
          {/* <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              icon={Image}
              title="My images"
              size="$5"
              disabled={!loggedIn}
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              size="$5"
              hoverTheme
              pressTheme
              icon={Settings}
              title="Settings"
              disabled={!loggedIn}
            />
          </YGroup.Item> */}
          <YGroup.Item>
            <ListItem
              onPress={handleAccountTypeChange}
              size="$5"
              hoverTheme
              pressTheme
              icon={ChefHat}
              title="Change account type"
            />
          </YGroup.Item>

          <YGroup.Item>
            <ListItem
              onPress={auth.logout}
              size="$5"
              hoverTheme
              pressTheme
              icon={LogOut}
              title="Logout"
              disabled={!loggedIn}
            />
          </YGroup.Item>
          <Separator />
        </YGroup>
      </YStack>
    </SafeAreaView>
  );
}

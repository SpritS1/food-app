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
import { useAuth } from "../../contexts/AuthContext";

export default function TabTwoScreen() {
  const router = useRouter();
  const auth = useAuth();

  const handleAccountTypeChange = () => {
    auth.logout();
    router.replace("/");
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

          <YGroup.Item>
            <ListItem
              color="orange"
              hoverTheme
              pressTheme
              icon={User}
              title="Personal data"
              size="$5"
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              icon={Star}
              title="My reviews"
              size="$5"
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              icon={Image}
              title="My images"
              size="$5"
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              size="$5"
              hoverTheme
              pressTheme
              icon={Settings}
              title="Settings"
            />
          </YGroup.Item>
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
            />
          </YGroup.Item>
          <Separator />
        </YGroup>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

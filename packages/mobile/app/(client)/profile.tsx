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
import { Image, Settings, Star, User } from "@tamagui/lucide-icons";
import { Link } from "expo-router";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <YStack space="$4">
        <YStack space="$4" padding="$4">
          <Stack space="$2">
            <Text fontSize="$8">Twoje konto</Text>
            <Text fontSize="$5">
              Zaloguj się aby móc korzystać z wszystkich funkcji aplikacji
            </Text>
          </Stack>
          <Link href="/sign-in" asChild>
            <Button color="orange">Zaloguj się lub zarejestruj</Button>
          </Link>
        </YStack>

        <YGroup>
          <Separator />

          <YGroup.Item>
            <ListItem
              color="orange"
              hoverTheme
              pressTheme
              icon={User}
              title="Dane personalne"
              size="$5"
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              icon={Star}
              title="Moje opinie"
              size="$5"
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              icon={Image}
              title="Moje zdjęcia"
              size="$5"
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              size="$5"
              hoverTheme
              pressTheme
              icon={Settings}
              title="Ustawienia"
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

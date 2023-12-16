import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, YGroup, Separator, ListItem } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, Settings, Star, User } from "@tamagui/lucide-icons";
import { router } from "expo-router";

type Props = {};

const Profile = (props: Props) => {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
    router.replace("/");
  };

  return (
    <SafeAreaView>
      <YStack space="$4">
        <YStack space="$4" padding="$4">
          <YStack space="$2">
            <Text fontSize="$6">Hello,</Text>
            <Text fontSize="$8">{auth.userData?.email}! </Text>
          </YStack>
        </YStack>

        <YGroup>
          <Separator />

          <YGroup.Item>
            <ListItem
              color="orange"
              hoverTheme
              pressTheme
              icon={User}
              title="Account details"
              size="$5"
              disabled
            />
          </YGroup.Item>
          <Separator />

          <YGroup.Item>
            <ListItem
              size="$5"
              hoverTheme
              pressTheme
              icon={Settings}
              title="Settings"
              disabled
            />
          </YGroup.Item>
          <Separator />

          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              onPress={handleLogout}
              icon={LogOut}
              title="Logout"
              size="$5"
            />
          </YGroup.Item>
          <Separator />
        </YGroup>
      </YStack>
    </SafeAreaView>
  );
};

export default Profile;

import {
  StyleSheet,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button, Input, Stack, Text, YStack } from "tamagui";
import { useMutation } from "react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginValues, useAuth } from "../../contexts/AuthContext";
import KeyboardHide from "../../components/KeyboardHide";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const BusinessLogin = () => {
  const { email } = useLocalSearchParams();

  const { login } = useAuth();
  const mutations = useMutation(login);

  const handleSignIn = async (values: LoginValues) => {
    try {
      await mutations.mutateAsync({ ...values, accountType: "business" });

      router.replace("/(owner)");
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  return (
    <KeyboardHide>
      <SafeAreaView>
        <YStack paddingHorizontal="$4" gap="$4" height="100%">
          <Text fontSize={"$10"}>Zaloguj się</Text>
          <Formik
            initialValues={{ email: email as string, password: "" }}
            validationSchema={SignInSchema}
            onSubmit={handleSignIn}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Stack gap="$4">
                <Input
                  placeholder="Email"
                  inputMode="email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Input
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <Button
                  color="orange"
                  onPress={
                    handleSubmit as unknown as (
                      e: GestureResponderEvent
                    ) => void
                  }
                  disabled={isSubmitting}
                >
                  Dalej
                </Button>
              </Stack>
            )}
          </Formik>

          <YStack alignItems="center" gap="$2" marginTop="auto">
            <Text>Nie posiadasz konta?</Text>
            <Link href={"/register"} asChild>
              <Text>Zarejestruj się</Text>
            </Link>
          </YStack>
        </YStack>
      </SafeAreaView>
    </KeyboardHide>
  );
};

export default BusinessLogin;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
});

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
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, LoginValues } from "../contexts/AuthContext";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignIn = () => {
  const { login } = useAuth();
  const mutations = useMutation(login);
  const router = useRouter();

  const handleSignIn = async (values: LoginValues) => {
    try {
      const result = await mutations.mutateAsync(values);
      if (result) router.replace("/(client)");
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <SafeAreaView>
        <YStack paddingHorizontal="$4" gap="$4" height="100%">
          <Text fontSize={"$10"}>Sign in</Text>
          <Formik
            initialValues={{ email: "", password: "", accountType: "regular" }}
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
                  Sign In
                </Button>
              </Stack>
            )}
          </Formik>

          <YStack alignItems="center" gap="$2" marginTop="auto">
            <Text>Don't have an account yet?</Text>
            <Link href={"/register"} asChild>
              <Button chromeless>Create account</Button>
            </Link>
          </YStack>
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
});

import { StyleSheet, GestureResponderEvent } from "react-native";
import React from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button, Input, Stack, Text, YStack } from "tamagui";
import { useMutation } from "react-query";
import { LoginValues, RegisterValues, useAuth } from "../contexts/AuthContext";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  passwordConfirm: Yup.string().required("Password confirmation is required"),
});

interface RegisterFormValues extends RegisterValues {
  passwordConfirm: string;
}

const Register = () => {
  const { register } = useAuth();
  const mutations = useMutation(register);

  const handleSignIn = async (values: RegisterFormValues) => {
    try {
      console.log(values);
      const { passwordConfirm, ...rest } = values;
      await mutations.mutateAsync(rest);
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  return (
    <SafeAreaView>
      <YStack paddingHorizontal="$4" gap="$4" height="100%">
        <Text fontSize={"$10"}>Załóż konto</Text>
        <Formik
          initialValues={
            {
              email: "",
              password: "",
              passwordConfirm: "",
            } as RegisterFormValues
          }
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
                <Text color="red">{errors.email}</Text>
              )}

              <Input
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text color="red">{errors.password}</Text>
              )}

              <Input
                placeholder="Confirm password"
                onChangeText={handleChange("passwordConfirm")}
                onBlur={handleBlur("passwordConfirm")}
                value={values.passwordConfirm}
                secureTextEntry
              />
              {touched.passwordConfirm && errors.passwordConfirm && (
                <Text color="red">{errors.passwordConfirm}</Text>
              )}

              <Button
                color="orange"
                onPress={handleSubmit as any}
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Stack>
          )}
        </Formik>

        <YStack alignItems="center" gap="$2" marginTop="auto">
          <Text>Posiadasz już konto?</Text>
          <Link href={"/sign-in"} asChild>
            <Text>Zaloguj się</Text>
          </Link>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default Register;

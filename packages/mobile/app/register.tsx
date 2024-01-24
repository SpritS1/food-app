import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Input, Stack, Text, YStack } from "tamagui";
import { useMutation } from "react-query";
import { RegisterValues, useAuth } from "../contexts/AuthContext";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  passwordConfirm: Yup.string()
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

interface RegisterFormValues extends RegisterValues {
  passwordConfirm: string;
}

const Register = () => {
  const { register } = useAuth();
  const mutations = useMutation(register);
  const router = useRouter();

  const handleSignIn = async (values: RegisterFormValues) => {
    try {
      const { passwordConfirm, ...rest } = values;
      await mutations.mutateAsync(rest);
      router.replace("/(client)");
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  return (
    <SafeAreaView>
      <YStack paddingHorizontal="$4" gap="$4" height="100%">
        <Text fontSize={"$9"}>Create an account</Text>
        <Formik
          initialValues={
            {
              email: "",
              password: "",
              passwordConfirm: "",
              name: "",
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

              <Input
                placeholder="Name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text color="red">{errors.name}</Text>
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
          <Text>Already have an account?</Text>
          <Link href={"/sign-in"} asChild>
            <Text>Sign in</Text>
          </Link>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default Register;

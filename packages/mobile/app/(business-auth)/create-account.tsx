import { Formik } from "formik";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Text, YStack } from "tamagui";
import { RegisterValues, useAuth } from "../../contexts/AuthContext";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { router, useLocalSearchParams } from "expo-router";

type Props = {};

interface FormValues extends RegisterValues {
  confirmPassword: string;
}

const CreateAccount = (props: Props) => {
  const { register } = useAuth();
  const { email } = useLocalSearchParams();

  const CreateAccountSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const { mutateAsync } = useMutation(({ email, password }: RegisterValues) =>
    register({ email, password, accountType: "business" })
  );

  const handleSubmit = async (values: FormValues) => {
    try {
      await mutateAsync(values);

      router.replace("/(owner)");
    } catch (error) {
      console.error("Create account failed", error);
      alert("Create account failed");
    }
  };

  return (
    <SafeAreaView>
      <YStack>
        <Text fontSize="$8">Create Account</Text>
        <Formik
          initialValues={{
            email: email as string,
            password: "",
            confirmPassword: "",
          }}
          validationSchema={CreateAccountSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <YStack>
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
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {touched.password && errors.password && (
                <Text color="red">{errors.password}</Text>
              )}

              <Input
                placeholder="Confirm Password"
                secureTextEntry
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text color="red">{errors.confirmPassword}</Text>
              )}

              <Button onPress={handleSubmit}>Create Account</Button>
            </YStack>
          )}
        </Formik>
      </YStack>
    </SafeAreaView>
  );
};

export default CreateAccount;

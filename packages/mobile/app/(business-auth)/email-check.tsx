import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Text, YStack } from "tamagui";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { Formik } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import KeyboardHide from "../../components/KeyboardHide";
import { GestureResponderEvent } from "react-native";

type Props = {};

const EmailCheck = (props: Props) => {
  const { checkEmail } = useAuth();
  const { mutateAsync } = useMutation((email: string) =>
    checkEmail(email, "business")
  );

  const handleCheckEmail = async ({ email }: { email: string }) => {
    try {
      const isAccountCreated = await mutateAsync(email);
      if (isAccountCreated) {
        router.push({
          pathname: "/(business-auth)/login",
          params: { email: email },
        });
        alert("Please login");
      } else {
        router.push({
          pathname: "/(business-auth)/create-account",
          params: { email: email },
        });
        alert("Email is available for registration!");
      }
    } catch (error) {
      console.error("Email check failed", error);
    }
  };

  const CheckEmailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <KeyboardHide>
      <SafeAreaView>
        <YStack space="$4" padding="$4">
          <Text fontSize="$9">Konto biznesowe</Text>
          <Text fontSize="$8">Zaloguj się lub załóż konto</Text>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={CheckEmailSchema}
            onSubmit={handleCheckEmail}
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
              <YStack space="$4">
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

                <Button
                  color="orange"
                  disabled={isSubmitting}
                  onPress={
                    handleSubmit as unknown as (
                      e: GestureResponderEvent
                    ) => void
                  }
                >
                  Dalej
                </Button>
              </YStack>
            )}
          </Formik>
        </YStack>
      </SafeAreaView>
    </KeyboardHide>
  );
};

export default EmailCheck;

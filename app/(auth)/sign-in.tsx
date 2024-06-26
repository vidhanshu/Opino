import * as z from "zod";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";

import PageLayout from "@/components/layouts/page-layout";
import { images } from "@/constants";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { PasswordField } from "@/components/form/password-field";
import { clearHistoryAndRoute } from "@/helpers/route";

///----------------------------------------------------------------------------------------------------------
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
});
///----------------------------------------------------------------------------------------------------------

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onValidate = () => {
    const err: Record<string, string> = {};

    const { success, error } = formSchema.safeParse({
      email: email.trim(),
      password: password.trim(),
    });
    if (!success) {
      if (error.formErrors.fieldErrors.email)
        err.email =
          typeof error.formErrors.fieldErrors.email === "string"
            ? error.formErrors.fieldErrors.email
            : error.formErrors.fieldErrors.email.join(", ");
      if (error.formErrors.fieldErrors.password)
        err.password =
          typeof error.formErrors.fieldErrors.password === "string"
            ? error.formErrors.fieldErrors.password
            : error.formErrors.fieldErrors.password.join(", ");
    }
    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const signInUser = async () => {
    if (!onValidate()) return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      clearHistoryAndRoute(router, `/home`)
    } catch (error: any) {
      Alert.alert("Something went wrong!", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] px-4 my-6 space-y-8">
          <Image
            className="mx-auto h-16"
            source={images.logo}
            resizeMode="contain"
          />
          <Text
            className="text-white text-center font-bold"
            variant="headlineMedium"
          >
            Sign in
          </Text>
          <View>
            <TextInput
              label="Email"
              value={email}
              mode="outlined"
              placeholder="Enter email"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              right={<TextInput.Icon icon="email" />}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          </View>
          <PasswordField
            value={password}
            setValue={setPassword}
            errors={errors}
          />
          <View className="flex flex-col gap-2">
            <Button
              loading={loading}
              disabled={loading}
              rippleColor="white"
              className="rounded-md"
              icon="login"
              mode="contained"
              onPress={signInUser}
            >
              Sign in
            </Button>
            <View className="flex items-center justify-center">
              <Text>
                Don't have an account?{"  "}
                <Link href="/sign-up">
                  <Text className="text-primary underline">Sign up</Text>
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default SignIn;

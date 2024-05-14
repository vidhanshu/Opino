import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }}>
      <Stack.Screen name="sign-in"/>
      <Stack.Screen name="sign-up"/>
    </Stack>
  );
};

export default AuthLayout;
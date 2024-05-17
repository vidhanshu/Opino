import { useGlobalContext } from "@/contexts/global";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const Routes = () => {
  const { user, loading } = useGlobalContext();

  if (loading) {
    return (
      <View className="flex  min-h-[70vh]  w-full justify-center flex-col items-center gap-4">
        <Feather
          size={50}
          name="loader"
          color="#FFCC2E"
          className="animate-spin"
        />
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{ animation: "slide_from_right", headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(quiz)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default Routes;

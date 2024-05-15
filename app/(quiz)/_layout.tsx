import React from "react";
import { Stack } from "expo-router";

const QuizLayout = () => {
  return (
    <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }}>
      <Stack.Screen name="quiz/[id]/start"/>
      <Stack.Screen name="quiz/[id]/feedback"/>
      <Stack.Screen name="quiz/[id]/in-progress"/>
    </Stack>
  );
};

export default QuizLayout;
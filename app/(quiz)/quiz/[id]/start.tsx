import { Entypo, Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

import PageLayout from "@/components/layouts/page-layout";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";

const StartQuiz = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<NSQuiz.IQuiz | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    quizService
      .getQuizById(id as string)
      .then(({ data }) => {
        setQuiz(data ?? null);
      })
      .finally(() => {
        setLoading(true);
      });
  }, [id]);

  return (
    <PageLayout>
      <ScrollView>
        {loading ? (
          <View className="flex h-full w-full justify-center flex-col items-center gap-4">
            <Feather
              name="loader"
              size={50}
              className="animate-spin"
              color="#FFCC2E"
            />
            <Text>Loading...</Text>
          </View>
        ) : (
          <View className="w-full justify-center min-h-[70vh] px-4 my-6 space-y-8">
            <Text className="font-rbold text-center" variant="headlineMedium">
              Start quiz
            </Text>
            <View className="items-center gap-2">
              <Entypo name="stopwatch" size={24} color="red" />
              <Text>{quiz?.name}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </PageLayout>
  );
};

export default StartQuiz;

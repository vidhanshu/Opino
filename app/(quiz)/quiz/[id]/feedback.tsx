import PageLayout from "@/components/layouts/page-layout";
import { useGlobalContext } from "@/contexts/global";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import { Feather } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";

export const Feedback = () => {
  const { user } = useGlobalContext();

  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<NSQuiz.IQuiz | null>(null);
  const [response, setResponse] = useState<NSQuiz.IQuizResponse | null>(null);

  useEffect(() => {
    if (!id || !user?.uid) return;

    setLoading(true);
    quizService
      .getResponse(id as string, user?.uid)
      .then(({ data }) => {
        return setResponse(data ?? null);
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(true);
    quizService
      .getQuizById(id as string)
      .then(({ data }) => {
        setQuiz(data ?? null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, user]);

  return (
    <PageLayout>
      <ScrollView className="h-[70vh] mb-4">
        {loading ? (
          <View className="flex  min-h-[70vh]  w-full justify-center flex-col items-center gap-4">
            <Feather
              size={50}
              name="loader"
              color="#FFCC2E"
              className="animate-spin"
            />
            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            <View className="p-4 flex-1">
              <Link href="/home" className="underline text-primary">
                Back to home
              </Link>
              <View className="mt-4 flex-1 items-center justify-center gap-2">
                <Text>
                  Quiz: <Text className="font-rbold">{quiz?.name}</Text>
                </Text>
                <Text>
                  Your score:{" "}
                  <Text className="font-rbold">{response?.score}</Text>
                </Text>
                <Text>
                  Total Score:{" "}
                  <Text className="font-rbold">{response?.totalScore}</Text>
                </Text>
                {response?.score !== undefined &&
                response?.totalScore !== undefined ? (
                  <Text>
                    Percentage:{" "}
                    <Text className="font-rbold">
                      {((response.score / response.totalScore) * 100).toFixed(
                        2
                      )}
                      %
                    </Text>
                  </Text>
                ) : null}
              </View>
            </View>
            <Divider className="my-4"/>
            <View className="px-4">
              <Text className="font-rbold" variant="titleLarge">
                {response?.score === response?.totalScore
                  ? "Congratulations! You got all the answers correct."
                  : "Here are the answers to the questions."}
              </Text>
              <View className="flex-1 gap-4">
                {quiz?.questions.map((q, idx) => {
                  return (
                    <View key={idx} className="flex-1 gap-2">
                      <Text>
                        Q{idx + 1}: {q.question}
                      </Text>
                      <View className="flex-1 gap-2">
                        <Text>
                          Your answer:{" "}
                          <Text className="font-rbold">
                            {q.options[response?.answers[idx]!]}
                          </Text>
                        </Text>
                        <Text>
                          Correct answer:{" "}
                          <Text className="font-rbold">
                            {q.options[q.correctAnswer]}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </PageLayout>
  );
};

export default Feedback;

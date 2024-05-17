import { Entypo, Feather } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";

import PageLayout from "@/components/layouts/page-layout";
import { K_CUR_QUIZ_ID, K_QUIZ_START_TIME_KEY, images } from "@/constants";
import { useGlobalContext } from "@/contexts/global";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import { getItem, setItem } from "@/helpers/local-storage";
import { clearHistoryAndRoute } from "@/helpers/route";

const StartQuiz = () => {
  const { user } = useGlobalContext();

  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [quiz, setQuiz] = useState<NSQuiz.IQuiz | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    quizService
      .getQuizById(id as string)
      .then(({ data }) => {
        setQuiz(data ?? null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (user?.uid && id) {
      quizService.getResponse(id as string, user.uid).then(({ data }) => {
        if (data) {
          setAttempted(true);
        }
      });
    }
  }, [user, id]);

  useEffect(() => {
    (async function () {
      const startTime = Number(await getItem(K_QUIZ_START_TIME_KEY));
      if (startTime) {
        setIsRunning(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    if (isRunning) {
      clearHistoryAndRoute(router, `/quiz/${id}/in-progress`);
    } else {
      setIsRunning(false);
    }
  }, [id, isRunning]);

  return (
    <PageLayout>
      <ScrollView>
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
          <View className="w-full justify-center min-h-[70vh] px-4 my-6 space-y-8">
            <View>
              <Image
                source={images.logo}
                resizeMode="contain"
                className="h-8 mx-auto"
              />
              <Text className="font-rbold text-center" variant="headlineMedium">
                Start quiz
              </Text>
            </View>
            <View className="items-center gap-3">
              <Text className="font-rbold">{quiz?.timeLimit} min</Text>
              <Entypo name="stopwatch" size={24} color="#FFCC2E" />
              <Text>
                Name: <Text className="font-rbold">{quiz?.name}</Text>
              </Text>
              <Text>
                Description:{" "}
                <Text className="font-rbold">{quiz?.description}</Text>
              </Text>
              <Text>
                No. of Questions:{" "}
                <Text className="font-rbold">{quiz?.questions?.length}</Text>
              </Text>
              <Text>
                Points per question:{" "}
                <Text className="font-rbold">
                  {quiz?.pointsPerQuestion} Points
                </Text>
              </Text>
              <Text>
                Total marks:{" "}
                <Text className="font-rbold">
                  {quiz?.questions?.length! * quiz?.pointsPerQuestion!} Points
                </Text>
              </Text>
              {quiz?.hasNegativeMarking ? (
                <Text>
                  Has negative marking of:{" "}
                  <Text className="font-rbold">
                    {quiz?.pointsDeductedPerWrongAnswer} Points
                  </Text>
                </Text>
              ) : (
                <></>
              )}
              <Button
                disabled={attempted || isRunning}
                onPress={async () => {
                  if (!id) return Alert.alert("Something went wrong");

                  await setItem(K_QUIZ_START_TIME_KEY, Date.now());
                  await setItem(K_CUR_QUIZ_ID, id);

                  clearHistoryAndRoute(router, `/quiz/${id}/in-progress`);
                  // router.push(`/quiz/${id}/in-progress`);
                }}
                mode="contained"
                icon="arrow-right"
              >
                Start
              </Button>
              {attempted && (
                <Text className="text-center">
                  You have attempted this quiz already, You can see your score{" "}
                  <Link
                    className="text-primary underline"
                    href={`/quiz/${id}/feedback`}
                  >
                    here
                  </Link>
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </PageLayout>
  );
};

export default StartQuiz;

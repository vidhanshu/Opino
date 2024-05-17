import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

import PageLayout from "@/components/layouts/page-layout";
import { K_CUR_QUIZ_ID, K_QUIZ_START_TIME_KEY } from "@/constants";
import { useGlobalContext } from "@/contexts/global";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import { getItem, setItem } from "@/helpers/local-storage";
import { clearHistoryAndRoute } from "@/helpers/route";
import { Question } from "@/components/quiz/question";

const InProgress = () => {
  const timerId = useRef<NodeJS.Timeout>();
  const timeLeft = useRef(0);

  const [attempted, setAttempted] = useState(false);

  const { user } = useGlobalContext();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [currQ, setCurrQ] = useState(0);
  const [timer, setTimer] = useState(0);
  const [quiz, setQuiz] = useState<NSQuiz.IQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

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

  const setupTimer = async () => {
    if (!quiz) return;

    const timeLimit = quiz.timeLimit * 60;
    const startTime = Number(await getItem(K_QUIZ_START_TIME_KEY)); // ms
    const currTime = Date.now(); // ms
    const timeElapsed = Math.floor((currTime - startTime) / 1000); // s
    const timeL = timeLimit - timeElapsed; // s
    setTimer(timeL);
    timeLeft.current = timeL;
    timerId.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(timerId.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!quiz) return;

    setupTimer();

    return () => {
      clearInterval(timerId.current);
    };
  }, [quiz]);

  const getTimerString = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}m ${s}s`;
  };

  const submitQuiz = () => {
    if (!quiz) return;
    if (attempted) return Alert.alert("You have already attempted this quiz");

    let score = 0;
    for (const key in answers) {
      const q = quiz.questions[parseInt(key)];

      if (q.correctAnswer == answers[key]) {
        score += quiz.pointsPerQuestion;
      } else if (quiz.hasNegativeMarking && quiz.pointsDeductedPerWrongAnswer) {
        console.log("[deducted marks]", quiz.pointsDeductedPerWrongAnswer)
        score -= quiz.pointsDeductedPerWrongAnswer;
      }
    }
 

    setLoading(true);
    quizService
      .saveResponse({
        score,
        quizId: id as string,
        userId: user?.uid as string,
        answers: Object.values(answers),
        totalScore: (quiz.questions.length * quiz.pointsPerQuestion) as number,
      })
      .then(() => {
        clearHistoryAndRoute(router, `/quiz/${id}/feedback`);
      })
      .finally(async () => {
        setLoading(false);
        await setItem(K_QUIZ_START_TIME_KEY, null);
        await setItem(K_CUR_QUIZ_ID, null);
      });
  };

  useEffect(() => {
    if (timer === 0) {
      submitQuiz();
    }
  }, [timer, answers, id, user]);

  useEffect(() => {
    if (user?.uid && id) {
      quizService.getResponse(id as string, user.uid).then(({ data }) => {
        if (data) {
          setAttempted(true);
          router.push(`/quiz/${id}/feedback`);
        }
      });
    }
  }, [user, id]);

  return (
    <PageLayout>
      {attempted ? (
        <View>
          <Text className="text-center">
            You have attempted this quiz already, You can see your score{" "}
            <Link
              className="text-primary underline"
              href={`/quiz/${id}/feedback`}
            >
              here
            </Link>
          </Text>
        </View>
      ) : loading || !quiz ? (
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
        <View className="flex-1">
          <View className="p-4 flex-row justify-end">
            <Text>
              {quiz.pointsPerQuestion} Point(s) . {getTimerString()}
            </Text>
          </View>
          <View className="px-4 justify-center flex-1 space-y-4">
            <Question
              setAnswer={setAnswers}
              answer={answers[currQ]}
              question={quiz.questions[currQ]}
              no={currQ}
            />
            {quiz.questions.length !== 1 && (
              <View className="flex-row gap-x-4 items-center justify-end">
                <IconButton
                  size={20}
                  mode="contained"
                  iconColor="black"
                  icon="arrow-left"
                  rippleColor="white"
                  className="bg-primary"
                  disabled={currQ === 0}
                  onPress={() => setCurrQ((prev) => prev - 1)}
                />
                <IconButton
                  size={20}
                  mode="contained"
                  iconColor="black"
                  icon="arrow-right"
                  rippleColor="white"
                  className="bg-primary"
                  disabled={currQ === quiz.questions.length - 1}
                  onPress={() => setCurrQ((prev) => prev + 1)}
                />
              </View>
            )}
            {currQ === quiz.questions.length - 1 && (
              <Button
                onPress={() => {
                  submitQuiz();
                  clearInterval(timerId.current);
                }}
                rippleColor="white"
                mode="contained"
              >
                Submit quiz
              </Button>
            )}
          </View>
        </View>
      )}
    </PageLayout>
  );
};

export default InProgress;
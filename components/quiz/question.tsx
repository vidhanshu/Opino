import { AntDesign } from "@expo/vector-icons";
import React  from "react";
import {  View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import NSQuiz from "@/firebase/services/quiz/type";

export const Question = ({
  no,
  question,
  answer,
  setAnswer,
}: {
  no: number;
  question: NSQuiz.IQuestion;
  answer?: number;
  setAnswer: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) => {
  return (
    <View className="space-y-4">
      <Text variant="titleLarge" className="font-rregular">
        Q {no + 1}. {question.question}
      </Text>
      <View className="space-y-4">
        {question.options.map((a, idx) => {
          return (
            <TouchableRipple
              key={idx}
              rippleColor="white"
              onPress={() => setAnswer((prev) => ({ ...prev, [no]: idx }))}
              className={
                answer === idx
                  ? "bg-primary/50 border border-transparent px-4 py-2 rounded-md"
                  : "border-gray-500 border px-4 py-2 rounded-md"
              }
            >
              <View className="flex flex-row gap-x-4 items-center">
                {idx === answer ? (
                  <AntDesign
                    className="ml-4"
                    name="checkcircle"
                    size={16}
                    color="white"
                  />
                ) : null}
                <Text>
                  {idx + 1}) {a}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
};

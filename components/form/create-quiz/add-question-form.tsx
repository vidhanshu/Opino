import { ICrateQuizFormState, IQuestion } from "@/app/(tabs)/create-quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import React from "react";
import { View } from "react-native";
import {
  Checkbox,
  Divider,
  HelperText,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";

///-----------------------------------------------------------------------------------------------------------

interface IAddQuestionFormProps {
  questions: IQuestion[];
  setForm: React.Dispatch<React.SetStateAction<ICrateQuizFormState>>;
  addNewQuestion: () => void;
  removeQuestion: (idx: number) => void;
  addOption: (idx: number) => void;
  removeOption: (qIdx: number, oIdx: number) => void;
  errors: Record<string, string>;
}

///-----------------------------------------------------------------------------------------------------------

export const AddQuestionForm = ({
  addNewQuestion,
  questions,
  setForm,
  removeQuestion,
  addOption,
  removeOption,
  errors,
}: IAddQuestionFormProps) => {
  return (
    <View>
      <View className="flex flex-row justify-end">
        <IconButton
          size={20}
          icon="plus"
          rippleColor="white"
          className="bg-primary"
          onPress={addNewQuestion}
        />
      </View>
      <View>
        {questions.map((q, key) => {
          return (
            <React.Fragment key={q.id}>
              <View>
                <View className="flex flex-row items-center justify-between">
                  <Text className="mb-2">Question No. {key + 1}</Text>
                  <TouchableRipple
                    onPress={() => removeQuestion(key)}
                    rippleColor="#fff"
                  >
                    <Text className="underline text-primary">remove</Text>
                  </TouchableRipple>
                </View>
                <View>
                  <TextInput
                    mode="outlined"
                    label="Question"
                    value={q.question}
                    placeholder="Enter question"
                    onChangeText={(text) => {
                      const id = q.id;
                      setForm((prev) => {
                        const newQuestions = [...prev.questions];
                        const idx = newQuestions.findIndex((q) => q.id === id);
                        newQuestions[idx].question = text;
                        return { ...prev, questions: newQuestions };
                      });
                    }}
                  />
                  <HelperText
                    type="error"
                    visible={!!errors[`questions[${key}].question`]}
                  >
                    {errors[`questions[${key}].question`] || ""}
                  </HelperText>
                </View>
                <View className="space-y-2">
                  <Text className="font-rregular text-gray-400">Options</Text>
                  {q.options.map((option, index) => (
                    <View
                      key={index}
                      className="flex flex-row gap-x-2 items-center"
                    >
                      <Checkbox
                        status={
                          q.correctAnswer === index ? "checked" : "unchecked"
                        }
                        onPress={() => {
                          const id = q.id;
                          setForm((prev) => {
                            const newQuestions = [...prev.questions];
                            const idx = newQuestions.findIndex(
                              (q) => q.id === id
                            );
                            newQuestions[idx].correctAnswer = index;
                            return { ...prev, questions: newQuestions };
                          });
                        }}
                      />
                      <View className="flex-1">
                        <TextInput
                          mode="outlined"
                          label={`Option ${index + 1}`}
                          value={option.option}
                          placeholder={`Enter option ${index + 1}`}
                          onChangeText={(text) => {
                            const id = q.id;
                            setForm((prev) => {
                              const newQuestions = [...prev.questions];
                              const idx = newQuestions.findIndex(
                                (q) => q.id === id
                              );
                              const optIdx = newQuestions[
                                idx
                              ].options.findIndex(
                                (o) => o.option === option.option
                              );
                              newQuestions[idx].options[optIdx].option = text;
                              return { ...prev, questions: newQuestions };
                            });
                          }}
                        />
                        {!!errors[`questions[${key}].options[${index}]`] && (
                          <HelperText
                            type="error"
                            visible={
                              !!errors[`questions[${key}].options[${index}]`]
                            }
                          >
                            {errors[`questions[${key}].options[${index}]`] ||
                              ""}
                          </HelperText>
                        )}
                      </View>
                      {index >= 2 && (
                        <IconButton
                          size={15}
                          icon="minus"
                          className="bg-rose-500"
                          rippleColor="white"
                          onPress={() => removeOption(key, index)}
                        />
                      )}
                      {index === q.options.length - 1 && index !== 3 && (
                        <IconButton
                          size={15}
                          icon="plus"
                          rippleColor="white"
                          className="bg-primary"
                          onPress={() => addOption(key)}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>
              {key !== questions.length - 1 && (
                <Divider className="mb-6 mt-8 bg-gray-800" />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

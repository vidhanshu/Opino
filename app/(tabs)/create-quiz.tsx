import { AddQuestionForm } from "@/components/form/create-quiz/add-question-form";
import PageLayout from "@/components/layouts/page-layout";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  HelperText,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import * as z from "zod";

///----------------------------------------------------------------------------------------------------------

export interface IQuestion {
  id: number;
  question: string;
  options: {
    id: number;
    option: string;
  }[];
  correctAnswer: number;
}
export interface ICrateQuizFormState {
  name: string;
  description: string;
  pointsPerQuestion: string;
  timeLimit: string;
  hasNegativeMarking: boolean;
  pointsDeductedPerWrongAnswer?: string;
  questions: IQuestion[];
}
const defaultQuestionValue = {
  question: "",
  options: [
    { id: 1, option: "Option1" },
    { id: 2, option: "Option2" },
  ],
  correctAnswer: 0,
};

const defaultValue = {
  name: "",
  description: "",
  pointsPerQuestion: "",
  timeLimit: "",
  hasNegativeMarking: false,
  pointsDeductedPerWrongAnswer: "",
  questions: [
    {
      id: 1, // unique index for frontend use only will remove before sending to backend
      question: "Enter your question here",
      options: [
        { id: 1, option: "Option1" },
        { id: 2, option: "Option2" },
      ],
      correctAnswer: 0,
    },
  ],
};

const formSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  pointsPerQuestion: z.number().int().positive(),
  timeLimit: z.number().int().positive(),
  hasNegativeMarking: z.boolean(),
  // should be less than the points to be awarded
  pointsDeductedPerWrongAnswer: z.number().positive().optional(),
});

///----------------------------------------------------------------------------------------------------------

const CreateQuiz = () => {
  const { id } = useLocalSearchParams();

  const [form, setForm] = useState<ICrateQuizFormState>(defaultValue);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onValidate = () => {
    const err: Record<string, string> = {};

    const { success, error } = formSchema.safeParse({
      name: form.name.trim(),
      description: form.description.trim(),
      pointsPerQuestion: +form.pointsPerQuestion,
      timeLimit: +form.timeLimit,
      hasNegativeMarking: form.hasNegativeMarking,
      pointsDeductedPerWrongAnswer: form.pointsDeductedPerWrongAnswer
        ? +form.pointsDeductedPerWrongAnswer
        : null,
    });

    if (!success) {
      if (error.formErrors.fieldErrors.name)
        err.name =
          typeof error.formErrors.fieldErrors.name === "string"
            ? error.formErrors.fieldErrors.name
            : error.formErrors.fieldErrors.name.join(", ");
      if (error.formErrors.fieldErrors.description)
        err.description =
          typeof error.formErrors.fieldErrors.description === "string"
            ? error.formErrors.fieldErrors.description
            : error.formErrors.fieldErrors.description.join(", ");
      if (error.formErrors.fieldErrors.pointsPerQuestion)
        err.pointsPerQuestion =
          typeof error.formErrors.fieldErrors.pointsPerQuestion === "string"
            ? error.formErrors.fieldErrors.pointsPerQuestion
            : error.formErrors.fieldErrors.pointsPerQuestion.join(", ");
      if (error.formErrors.fieldErrors.timeLimit)
        err.timeLimit =
          typeof error.formErrors.fieldErrors.timeLimit === "string"
            ? error.formErrors.fieldErrors.timeLimit
            : error.formErrors.fieldErrors.timeLimit.join(", ");
    }

    if (form.hasNegativeMarking && !form.pointsDeductedPerWrongAnswer)
      err.pointsDeductedPerWrongAnswer = "This field should be non zero.";
    if (
      form.hasNegativeMarking &&
      form.pointsDeductedPerWrongAnswer &&
      +form.pointsDeductedPerWrongAnswer > +form.pointsPerQuestion
    ) {
      err.pointsDeductedPerWrongAnswer =
        "This field should be less than points per question.";
    }
    form.questions.forEach((q, idx) => {
      if (q.question.trim().length === 0)
        err[`questions[${idx}].question`] = "This field is required.";
      q.options.forEach((o, oIdx) => {
        if (o.option.trim().length === 0)
          err[`questions[${idx}].options[${oIdx}]`] = "This field is required.";
      });
    });

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const onSubmit = async () => {
    if (!onValidate()) return;
    setLoading(true);
    const payload: NSQuiz.ICreateQuiz = {
      name: form.name,
      description: form.description,
      hasNegativeMarking: form.hasNegativeMarking,
      pointsPerQuestion: +form.pointsPerQuestion,
      timeLimit: +form.timeLimit,
      questions: form.questions.map((q) => ({
        question: q.question,
        options: q.options.map((o) => o.option),
        correctAnswer: q.correctAnswer,
      })),
    };
    if (form.hasNegativeMarking && form.pointsDeductedPerWrongAnswer) {
      payload.pointsDeductedPerWrongAnswer = +form.pointsDeductedPerWrongAnswer;
    }
    let error: any = null;
    let idToBeRoutedOnSuccess = id;
    if (id) {
      const res = await quizService.updateQuiz(id as string, payload);
      error = res.error;
    } else {
      const res = await quizService.createQuiz(payload);
      error = res.error;
      idToBeRoutedOnSuccess = res.data;
    }
    setLoading(false);

    if (error) {
      Alert.alert("Something went wrong!", error.message);
    } else {
      Alert.alert(`Quiz ${id ? "updated" : "created"} successfully!`);
      onReset();
      router.push(`/create-quiz?id=${idToBeRoutedOnSuccess}`);
    }
  };

  const onReset = () => {
    setErrors({});
    setForm(defaultValue);
    router.setParams({ id: "" });
  };

  useEffect(() => {
    if (id)
      quizService.getQuizById(id as string).then(({ data }) => {
        if (data) {
          setForm({
            name: data.name,
            description: data.description,
            pointsPerQuestion: data.pointsPerQuestion.toString(),
            timeLimit: data.timeLimit.toString(),
            hasNegativeMarking: data.hasNegativeMarking,
            pointsDeductedPerWrongAnswer:
              data.pointsDeductedPerWrongAnswer?.toString(),
            questions: data.questions.map((q) => ({
              id: Math.random(),
              question: q.question,
              options: q.options.map((o, idx) => ({ id: idx, option: o })),
              correctAnswer: q.correctAnswer,
            })),
          });
        }
      });
  }, [id]);

  return (
    <PageLayout>
      <ScrollView>
        <View className="w-full min-h-[70vh] px-4 my-6 space-y-4">
          <View className="flex flex-row justify-between items-center">
            <Text variant="titleLarge">{id ? "Update" : "Create"} quiz</Text>
            <TouchableRipple onPress={onReset} rippleColor="white">
              <Text variant="bodySmall" className="underline text-primary">
                Reset Form
              </Text>
            </TouchableRipple>
          </View>
          <View className="space-y-4">
            <View>
              <TextInput
                disabled={loading}
                label="Quiz name"
                value={form.name}
                mode="outlined"
                right={<TextInput.Affix text={`${form.name.length}/50`} />}
                placeholder="Enter quiz name"
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, name: text }))
                }
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            </View>
            <View>
              <TextInput
                disabled={loading}
                multiline
                numberOfLines={4}
                label="Quiz description"
                value={form.description}
                mode="outlined"
                placeholder="Enter quiz description"
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, description: text }))
                }
                right={
                  <TextInput.Affix text={`${form.description.length}/500`} />
                }
              />
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            </View>
            <View>
              <TextInput
                disabled={loading}
                mode="outlined"
                label="Quiz time limit (in minutes)"
                value={form.timeLimit}
                placeholder="Enter quiz time limit in minutes"
                inputMode="numeric"
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, timeLimit: text }))
                }
              />
              <HelperText type="error" visible={!!errors.timeLimit}>
                {errors.timeLimit}
              </HelperText>
            </View>
            <View>
              <TextInput
                disabled={loading}
                mode="outlined"
                label="Point(s) per question"
                value={form.pointsPerQuestion}
                placeholder="Enter point(s) per question"
                inputMode="numeric"
                onChangeText={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    pointsPerQuestion: text,
                  }))
                }
              />
              <HelperText type="error" visible={!!errors.pointsPerQuestion}>
                {errors.pointsPerQuestion}
              </HelperText>
            </View>
            <Checkbox.Item
              label="Has negative marking?"
              status={form.hasNegativeMarking ? "checked" : "unchecked"}
              onPress={() => {
                setForm((prev) => ({
                  ...prev,
                  hasNegativeMarking: !prev.hasNegativeMarking,
                }));
              }}
            />
            {form.hasNegativeMarking && (
              <View>
                <TextInput
                  disabled={loading}
                  mode="outlined"
                  label="Point(s) deducted per wrong answer"
                  value={form.pointsDeductedPerWrongAnswer}
                  placeholder="Point(s) deducted per wrong answer"
                  inputMode="numeric"
                  onChangeText={(text) =>
                    setForm((prev) => ({
                      ...prev,
                      pointsDeductedPerWrongAnswer: text,
                    }))
                  }
                />
                <HelperText
                  type="error"
                  visible={!!errors.pointsDeductedPerWrongAnswer}
                >
                  {errors.pointsDeductedPerWrongAnswer}
                </HelperText>
              </View>
            )}

            <Divider />

            <View>
              <Text variant="titleLarge">Add questions</Text>
              <AddQuestionForm
                questions={form.questions}
                setForm={setForm}
                addNewQuestion={() => {
                  setForm((prev) => ({
                    ...prev,
                    questions: [
                      ...prev.questions,
                      {
                        ...defaultQuestionValue,
                        id: Math.random(),
                        options: defaultQuestionValue.options.map((a) => ({
                          ...a,
                          id: Math.random(),
                        })),
                      },
                    ],
                  }));
                }}
                removeQuestion={(index: number) => {
                  if (form.questions.length === 1)
                    return Alert.alert("You can't remove all questions.");

                  setForm((prev) => {
                    const newQuestions = [...prev.questions];
                    newQuestions.splice(index, 1);
                    return { ...prev, questions: newQuestions };
                  });
                }}
                addOption={(qIdx: number) => {
                  if (form.questions[qIdx].options.length === 4)
                    return Alert.alert("You can't add more than 4 options.");

                  setForm((prev) => {
                    const newQuestions = [...prev.questions];
                    newQuestions[qIdx].options.push({
                      id: Math.random(),
                      option: `Option${newQuestions[qIdx].options.length + 1}`,
                    });
                    return { ...prev, questions: newQuestions };
                  });
                }}
                removeOption={(qIdx: number, oIdx: number) => {
                  setForm((prev) => {
                    const newQuestions = [...prev.questions];
                    newQuestions[qIdx].options.splice(oIdx, 1);
                    return { ...prev, questions: newQuestions };
                  });
                }}
                errors={errors}
              />
            </View>
            <Button
              icon={id ? "check-circle-outline" : "plus"}
              mode="contained"
              rippleColor="white"
              onPress={onSubmit}
              loading={loading}
              disabled={loading}
            >
              {id ? "Update quiz" : "Create quiz"}
            </Button>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default CreateQuiz;

import PageLayout from "@/components/layouts/page-layout";
import { quizService } from "@/firebase/services/quiz";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  Button,
  Checkbox,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import * as z from "zod";

///----------------------------------------------------------------------------------------------------------
const defaultValue = {
  name: "",
  description: "",
  pointsPerQuestion: "",
  timeLimit: "",
  hasNegativeMarking: false,
  pointsDeductedPerWrongAnswer: "",
};

const formSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  pointsPerQuestion: z.number().int().positive(),
  timeLimit: z.number().int().positive(),
  hasNegativeMarking: z.boolean(),
  pointsDeductedPerWrongAnswer: z.number().positive().optional(),
});
///----------------------------------------------------------------------------------------------------------

const CreateQuiz = () => {
  const [form, setForm] = useState(defaultValue);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onValidate = () => {
    const err: Record<string, string> = {};

    const { success, error } = formSchema.safeParse({
      name: form.name.trim(),
      description: form.description.trim(),
      pointsPerQuestion: form.pointsPerQuestion,
      timeLimit: form.timeLimit,
      hasNegativeMarking: form.hasNegativeMarking,
      pointsDeductedPerWrongAnswer: form.pointsDeductedPerWrongAnswer,
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
      if (form.hasNegativeMarking && !form.pointsDeductedPerWrongAnswer)
        err.pointsDeductedPerWrongAnswer = "This field should be non zero.";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const onSubmit = async () => {
    if (!onValidate()) return;
    setLoading(true);
    const { error } = await quizService.createQuiz({
      ...form,
      pointsPerQuestion: +form.pointsPerQuestion,
      timeLimit: +form.timeLimit,
      pointsDeductedPerWrongAnswer: +form.pointsDeductedPerWrongAnswer,
    });
    if (error) {
      Alert.alert("Something went wrong!", error.message);
    } else {
      Alert.alert("Quiz created successfully!");
      setForm(defaultValue);
      router.push("/quiz-list");
    }
    setLoading(false);
  };

  return (
    <PageLayout>
      <ScrollView>
        <View className="w-full min-h-[70vh] px-4 my-6 space-y-4">
          <Text variant="titleLarge">Create quiz</Text>
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

            <Button
              icon="plus"
              mode="contained"
              rippleColor="white"
              onPress={onSubmit}
              loading={loading}
              disabled={loading}
            >
              Create quiz
            </Button>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default CreateQuiz;

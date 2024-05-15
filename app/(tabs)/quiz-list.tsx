import GenericDialog from "@/components/dialog/generic-dialog";
import PageLayout from "@/components/layouts/page-layout";
import { useGlobalContext } from "@/contexts/global";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
} from "react-native-paper";

///----------------------------------------------------------------------------------------------------------
const defaultDeleteConfirmation = {
  id: "",
  show: false,
  loading: false,
};
///----------------------------------------------------------------------------------------------------------

const QuizList = () => {
  const { user } = useGlobalContext();
  const [q, setQ] = useState("");

  const [ql, setQl] = useState<NSQuiz.IQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // delete confirmation dialog
  const [deleteConfirmation, setDeleteConfirmation] = useState(
    defaultDeleteConfirmation
  );

  const fetchQuizzes = async () => {
    setLoading(true);
    const { error, data = [] } = await quizService.getQuizList();
    setLoading(false);
    if (error) {
      Alert.alert("Something went wrong!", error.message);
    } else {
      setQl(data);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async () => {
    if (!deleteConfirmation.id) return;

    setDeleteConfirmation((prev) => ({ ...prev, loading: true }));
    const { error } = await quizService.deleteQuiz(deleteConfirmation.id);
    if (error) {
      Alert.alert("Something went wrong!", error.message);
    } else {
      fetchQuizzes();
      Alert.alert("Success", "Quiz deleted successfully");
    }
    setDeleteConfirmation(defaultDeleteConfirmation);
  };

  return (
    <PageLayout>
      <FlatList
        data={
          loading
            ? []
            : q?.length
            ? ql.filter(({ name }) => name.includes(q))
            : ql
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Surface elevation={4} className="mx-4 p-4 bg-black rounded-md">
            <View className="flex flex-row justify-between items-center">
              <Text variant="titleMedium">{item.name}</Text>
              <Text className="text-gray-300" variant="labelSmall">
                {item.timeLimit} min
              </Text>
            </View>
            <Text className="text-gray-400" variant="bodySmall">
              {item.description}
            </Text>
            {user?.uid === item.author && (
              <View className="flex flex-row justify-end items-center gap-4 mt-4">
                <TouchableRipple>
                  <Text>Edit</Text>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => {
                    setDeleteConfirmation((prev) => ({
                      ...prev,
                      show: true,
                      id: item.id,
                    }));
                  }}
                >
                  <Text className="text-rose-500">Delete</Text>
                </TouchableRipple>
              </View>
            )}
          </Surface>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <Text variant="titleLarge">Search quiz</Text>

            <Searchbar
              value={q}
              onChangeText={setQ}
              placeholder="Search"
              className="bg-black border border-secondary-200"
            />

            {loading && <ActivityIndicator color="#fff" size="small" />}
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {!loading && (
              <View className="gap-4 items-center">
                <Text
                  variant="displaySmall"
                  className="text-center font-rbold text-gray-400"
                >
                  No quizzes found!
                </Text>
                <Button
                  onPress={() => router.push("/create-quiz")}
                  mode="contained"
                  icon="plus"
                >
                  Create now!
                </Button>
              </View>
            )}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchQuizzes} />
        }
      />

      <GenericDialog
        visible={deleteConfirmation.show}
        title="Are you sure?"
        hideDialog={() =>
          setDeleteConfirmation((prev) => ({ ...prev, show: false }))
        }
        subtitle="This action is irreversible, once this quiz deleted can't be retrieved back!"
        children={
          <View className="flex flex-row justify-end items-center gap-4 mt-4">
            <Button
              onPress={() => setDeleteConfirmation(defaultDeleteConfirmation)}
              loading={loading}
              disabled={loading}
              mode="outlined"
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              onPress={handleDeleteQuiz}
              mode="contained"
              className="bg-rose-500"
            >
              Delete
            </Button>
          </View>
        }
      />
    </PageLayout>
  );
};

export default QuizList;

export const QuizCard = () => {
  return (
    <View>
      <Text>Quiz card</Text>
    </View>
  );
};

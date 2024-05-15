import PageLayout from "@/components/layouts/page-layout";
import { useGlobalContext } from "@/contexts/global";
import { quizService } from "@/firebase/services/quiz";
import NSQuiz from "@/firebase/services/quiz/type";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import {
  ActivityIndicator,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
} from "react-native-paper";

const QuizList = () => {
  const { user } = useGlobalContext();
  const [q, setQ] = useState("");

  const [ql, setQl] = useState<NSQuiz.IQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
                <TouchableRipple>
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

            {loading && <ActivityIndicator color="#fff" size="large" />}
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {loading ? null : (
              <Text variant="displayMedium" className="text-center">
                No data found!
              </Text>
            )}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchQuizzes} />
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

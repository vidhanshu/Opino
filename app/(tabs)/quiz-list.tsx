import React from "react";

import PageLayout from "@/components/layouts/page-layout";
import { QuizList } from "@/components/list/quiz-list";

const QuizListScreen = () => {
  return (
    <PageLayout>
      <QuizList />
    </PageLayout>
  );
};

export default QuizListScreen;

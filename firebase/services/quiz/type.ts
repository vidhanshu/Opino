namespace NSQuiz {
  export interface IQuiz {
    id: string;
    name: string;
    description: string;
    timeLimit: number;
    pointsPerQuestion: number;
    hasNegativeMarking: boolean;
    pointsDeductedPerWrongAnswer?: number;
    author: string;
    questions: IQuestion[];
  }

  export interface IQuestion {
    id?: string | number;
    question: string;
    options: string[];
    correctAnswer: number;
  }

  export interface IQuizResponse {
    id: string;
    quizId: string;
    userId: string;
    answers: number[];
    score: number;
    totalScore: number;
  }

  // payload for creating a quiz
  export interface ICreateQuiz {
    name: string;
    description: string;
    timeLimit: number;
    pointsPerQuestion: number;
    hasNegativeMarking: boolean;
    pointsDeductedPerWrongAnswer?: number;
    questions: IQuestion[];
  }
}

export default NSQuiz;

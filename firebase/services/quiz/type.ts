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
    question: string;
    options: string[];
    correctAnswer: number;
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

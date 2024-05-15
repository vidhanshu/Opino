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
  }

  // payload for creating a quiz
  export interface ICreateQuiz {
    name: string;
    description: string;
    timeLimit: number;
    pointsPerQuestion: number;
    hasNegativeMarking: boolean;
    pointsDeductedPerWrongAnswer?: number;
  }
}

export default NSQuiz;

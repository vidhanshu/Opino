import { auth, db } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import NSQuiz from "./type";

export const quizService = {
  createQuiz: async (data: NSQuiz.ICreateQuiz) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { error: "User not found" };
      }

      const newDoc = await addDoc(collection(db, "quizzes"), {
        ...data,
        author: currentUser.uid,
      });
      return { data: newDoc };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  },
  getQuizList: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: data as NSQuiz.IQuiz[] };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  },
  deleteQuiz: async (id: string) => {
    try {
      await deleteDoc(doc(db, "quizzes", id));
      return { data: "Quiz deleted successfully" };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  }
};

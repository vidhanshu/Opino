import { auth, db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
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
      return { data: newDoc.id };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  },
  updateQuiz: async (id: string, data: NSQuiz.ICreateQuiz) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { error: "User not found" };
      }
      const docRef = doc(db, "quizzes", id);
      await setDoc(docRef, { ...data, author: currentUser.uid });
      return { error: false };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  },
  getQuizById: async (id: string) => {
    try {
      const docRef = doc(db, "quizzes", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return { error: "Quiz not found" };
      }
      return { data: docSnap.data() as NSQuiz.IQuiz };
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
  },
  saveResponse: async (response: Omit<NSQuiz.IQuizResponse, "id">) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { error: "User not found" };
      }
      const newDoc = await addDoc(collection(db, "responses"), {
        ...response,
        attemptedOn: new Date().toISOString(),
      });
      return { data: newDoc.id };
    } catch (error) {
      return { error };
    }
  },
  getResponse: async (quizId: string, userId: string) => {
    try {
      const q = query(
        collection(db, "responses"),
        where("quizId", "==", quizId),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: data[0] as NSQuiz.IQuizResponse };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  },
};

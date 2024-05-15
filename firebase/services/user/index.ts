import { db } from "@/firebase";
import NSUser from "./type";
import { addDoc, collection } from "firebase/firestore";

export const userServices = {
  createUser: async (data: NSUser.IUserCratePayload) => {
    try {
      const newDoc = await addDoc(collection(db, "users"), data);
      return { data: newDoc };
    } catch (error: any) {
      console.log(error);
      return { error };
    }
  },
};

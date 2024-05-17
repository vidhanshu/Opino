import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzEA9Hu_jFxAqMQ_dhy-utVVc3rJDxazE",
  authDomain: "opino-d3e95.firebaseapp.com",
  projectId: "opino-d3e95",
  storageBucket: "opino-d3e95.appspot.com",
  messagingSenderId: "471639481912",
  appId: "1:471639481912:web:aa0143311451276e20d0cd",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

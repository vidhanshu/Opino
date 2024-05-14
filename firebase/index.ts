import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from "@firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGE_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
};

export const app = initializeApp(firebaseConfig,);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
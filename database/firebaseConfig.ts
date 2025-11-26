// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRhLqcp3cGdvf3I1qITCQMKW5pWui6DzU",
  authDomain: "oias-8b76d.firebaseapp.com",
  projectId: "oias-8b76d",
  storageBucket: "oias-8b76d.firebaseapp.com",
  messagingSenderId: "383020668894",
  appId: "1:383020668894:web:2305b55f0774214ae22f4f",
  measurementId: "G-5LMNESF8ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default auth;
export { db };
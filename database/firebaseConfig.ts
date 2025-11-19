// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRhLqcp3cGdvf3I1qITCQMKW5pWui6DzU",
  authDomain: "oias-8b76d.firebaseapp.com",
  projectId: "oias-8b76d",
  storageBucket: "oias-8b76d.firebasestorage.app",
  messagingSenderId: "383020668894",
  appId: "1:383020668894:web:2305b55f0774214ae22f4f",
  measurementId: "G-5LMNESF8ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
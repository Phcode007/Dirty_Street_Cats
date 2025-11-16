// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA04rsqPGuEn6BBKl383hqCYf8Khw7CCY4",
  authDomain: "dirty-street-cats.firebaseapp.com",
  projectId: "dirty-street-cats",
  storageBucket: "dirty-street-cats.firebasestorage.app",
  messagingSenderId: "736879216674",
  appId: "1:736879216674:web:44342867122252ec1be27b",
  measurementId: "G-BL9VT3ZKPG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

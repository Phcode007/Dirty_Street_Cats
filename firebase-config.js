const firebaseConfig = {
  apiKey: "AIzaSyA04rsqPGuEn6BBKl383hqCYf8Khw7CCY4",
  authDomain: "dirty-street-cats.firebaseapp.com",
  projectId: "dirty-street-cats",
  storageBucket: "dirty-street-cats.firebasestorage.app",
  messagingSenderId: "736879216674",
  appId: "1:736879216674:web:44342867122252ec1be27b",
  measurementId: "G-BL9VT3ZKPG",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

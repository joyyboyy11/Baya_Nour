// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOETQUnP1HWiKV-nw2YhEgkzWWVju17rI",
  authDomain: "e--votee.firebaseapp.com",
  projectId: "e--votee",
  storageBucket: "e--votee.firebasestorage.app",
  messagingSenderId: "916221538672",
  appId: "1:916221538672:web:dc7492e37fe0d386bd9fb5",
  measurementId: "G-CCY80ZG075"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXCkI4-HWLHW-yFwGuy76O5PMeNKhnus8",
  authDomain: "textutils-db.firebaseapp.com",
  projectId: "textutils-db",
  storageBucket: "textutils-db.firebasestorage.app",
  messagingSenderId: "955714964235",
  appId: "1:955714964235:web:4a1833cb393e76c62bb00e",
  measurementId: "G-LXMEW0DDJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
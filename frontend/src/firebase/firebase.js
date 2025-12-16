import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9rm6c0DRzJx4X64LusSYUWepKjOQXjn0",
  authDomain: "norskapp-49b48.firebaseapp.com",
  projectId: "norskapp-49b48",
  storageBucket: "norskapp-49b48.firebasestorage.app",
  messagingSenderId: "651271577320",
  appId: "1:651271577320:web:7a2581774fe5fd8e12735d",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

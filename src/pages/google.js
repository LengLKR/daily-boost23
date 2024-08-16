import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBylDDHpDgZq-D57rfekXxjXqzI957fJKs",
  authDomain: "form-f8d6c.firebaseapp.com",
  projectId: "form-f8d6c",
  storageBucket: "form-f8d6c.appspot.com",
  messagingSenderId: "665618886236",
  appId: "1:665618886236:web:f0d6eb14df7c3524d44099",
  measurementId: "G-YKFHSVSZEL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const googleProvider = new GoogleAuthProvider();
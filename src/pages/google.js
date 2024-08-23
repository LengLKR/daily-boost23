import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // นำเข้า Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAGrDbcLB6Xx8t8rh2noyFrSPVoRYdeizU",
  authDomain: "myapp-e0219.firebaseapp.com",
  databaseURL:
    "https://myapp-e0219-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myapp-e0219",
  storageBucket: "myapp-e0219.appspot.com",
  messagingSenderId: "265220609618",
  appId: "1:265220609618:web:63c2055428b0a05baef18b",
  measurementId: "G-J63G9Y5YHJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore and export
export const db = getFirestore(app);

export const setupRecaptcha = () => {
  if (typeof window !== "undefined" && auth) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "normal",
          callback: (response) => {
            // Handle the reCAPTCHA success
            console.log("reCAPTCHA solved.");
          },
        },
        auth // ส่ง auth ที่ถูกตั้งค่าแล้วเข้าไปใน RecaptchaVerifier
      );

      window.recaptchaVerifier
        .render()
        .then(() => {
          console.log("reCAPTCHA ready");
        })
        .catch((error) => {
          console.error("Error rendering reCAPTCHA", error);
        });
    } catch (error) {
      console.error("Error initializing RecaptchaVerifier", error);
    }
  }
};

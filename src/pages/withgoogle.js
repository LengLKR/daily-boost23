import React from "react";
import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./google";

const Withgoogle = () => {
  const [user, setUser] = useState(null);
  const [str, setStr] = useState("Hello");
  const [textBtn, setTextbtn] = useState("Login Google");
  const [photoURL, setPhotoURL] = useState("");

  const loginAction = async () => {
    console.log("this checkLogin", auth?.currentUser);
    if (!auth?.currentUser) {
      await signInWithPopup(auth, googleProvider)
        .then(function (result) {
          if (!result) return;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          console.log(result.user);
          setUser(result.user);
          setStr("Is Login ....");
          setTextbtn("Logout");
        })
        .catch(function (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = error.credential;
          if (errorCode === "auth/account-exists-with-different-credential") {
            alert(
              "You have already signed up with a different auth provider for that email."
            );
          } else {
            console.log(error);
          }
        });
    } else {
      signOut(auth);
      setUser(null);
      setStr("not login");
      setTextbtn("Login with Google");
    }
  };
  return (
    <div>
      <button color="black" onClick={loginAction}>
        {textBtn}
      </button>
      <p>
        {str}
        {user ? "=>" : ""}
        {user?.email}
      </p>

    </div>
  );
};

export default Withgoogle;
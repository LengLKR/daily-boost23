import React from "react";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./google";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import {
  getUserByEmail,
  getUserByEmailAndPassword,
  sendDataToFirestore,
  verifyUsers,
} from "./service";

const login = () => {
  const [user, setUser] = useState(null);
  const [str, setStr] = useState("Hello");
  const [textBtn, setTextbtn] = useState("Login Google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

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
  const handleTest = async () => {
    console.log("testsetsets");
    const data = {
      name: "John Doe",
      email: "johndoe@example.com",
      createdAt: new Date(),
    };
    await sendDataToFirestore(data);
  };
  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    try {
      const emailInput = email;
      const passwordInput = password;

      const userData = await getUserByEmailAndPassword(
        emailInput,
        passwordInput
      );

      if (userData) {
        console.log("Login successful:", userData);
        setUser(userData);
        router.push('/');
        // ทำงานเพิ่มเติมหลังจากที่ผู้ใช้ล็อกอินสำเร็จ
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        // คุณอาจจะเปลี่ยนเส้นทางหลังจากล็อกอินสำเร็จ เช่น:
        // router.push("/dashboard");
      } else {
        console.error("Login failed: Incorrect email or password");
        alert("Login failed: Incorrect email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  };
  //Check if user is remembered
  useEffect(() => {
    const rememberedUser = localStorage.getItem("user");
    if (rememberMe) {
      setUser(JSON.parse(rememberedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setTextbtn("Logout");
    } else {
      setTextbtn("Login with Google");
    }
  }, [user]);

  return (
    <div>
      <>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <Image
                className="w-8 h-8 mr-2"
                src="/logoproject.png"
                alt="logo"
                width={32}
                height={32}
              />
              daily-boost
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div id="formarea" className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form
                  id="loginForm"
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleLogin}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          checked={rememberMe}
                          onChange={(e) => {
                            setRememberMe(e.target.checked);
                            console.log("Remember Me", e.target.checked);
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-300"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-black bg-gray-100 hover:bg-pink-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
                  >
                    Sign in
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      onClick={() => router.push("/signup")}
                    >
                      Sign up
                    </a>
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Sign in with Facebook
                    </button>
                    <button
                      onClick={loginAction}
                      type="button"
                      className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Sign in with Google
                    </button>
                  </div>
                </form>
                <button onClick={handleTest}>346346</button>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default login;

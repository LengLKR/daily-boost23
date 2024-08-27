import React, { useState, useEffect } from "react";
import QRCodeComponent from "./line";
import { useRouter } from "next/router";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./google"; // อ้างอิงไปที่ Firebase auth
import { signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginClick = () => {
    if (isLoggedIn) {
      router.push("/addAndHistory");
    } else {
      setShowLoginModal(true);
    }
  };

  const logoutClick = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const toggleMedal = () => {
    setShowModal(!showModal);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setShowLoginModal(false);  
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setShowLoginModal(false);
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setShowLoginModal(false);
    } catch (error) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  const loginWithPhone = () => {
    router.push("/phoneLogin");
  };
  const goToForgetPassword = () => {
    router.push("/ForgetPassword");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('bg_login.png')" }}
    >
      <div className="fixed top-4 right-4 flex items-center space-x-4">
        {isLoggedIn ? (
          <button
            onClick={logoutClick}
            className="flex items-center px-3 py-2 bg-pink-100 border border-pink-300 rounded-full shadow-lg hover:bg-pink-200 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-pink-300 rounded-full overflow-hidden">
              <img
                src="/logo_login.png"
                alt="Logout Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-pink-800 font-bold">Log out</span>
          </button>
        ) : (
          <button
            onClick={loginClick}
            className="flex items-center px-3 py-2 bg-pink-100 border border-pink-300 rounded-full shadow-lg hover:bg-pink-200 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-pink-300 rounded-full overflow-hidden">
              <img
                src="/logo_login.png"
                alt="Login Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-pink-800 font-bold">Log in</span>
          </button>
        )}
      </div>

      <div className="fixed top-4 left-4 flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
          <img
            src="/logohome.png"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white font-bold">Daily Boost</div>
      </div>

      <main className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-pink-100 drop-shadow-lg">
            เริ่มต้นวันใหม่ด้วยพลังใจจาก Daily Boost!
          </h1>
          <p className="text-lg text-pink-200 mt-4">Welcome to Daily Boost</p>
          <div className="mt-10 flex justify-center items-center space-x-4">
            <button
              onClick={loginClick}
              className="px-6 py-2 text-purple-500 font-bold bg-white rounded-full shadow-lg hover:bg-white/80 transition-colors border border-purple-500 flex items-center"
            >
              <span>เริ่มต้นใช้งาน</span>
            </button>
            <button
              onClick={toggleQRCode}
              className="px-6 py-2 text-purple-500 font-bold bg-white rounded-full shadow-lg hover:bg-white/80 transition-colors border border-purple-500 flex items-center"
            >
              <span>รับข้อความ</span>
            </button>
          </div>
        </div>
      </main>

      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">สแกน QR code</h2>
            <QRCodeComponent lineID="@686bymtt" />
            <button
              onClick={toggleQRCode}
              className="mt-4 px-4 py-2 text-white font-bold bg-pink-300 rounded-full shadow-lg hover:bg-pink-400 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* ปุ่มที่มุมขวาล่าง */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMedal}
          className="text-white text-sm underline hover:text-gray-300 transition-colors"
        >
          คำแนะนำการใช้งาน
        </button>
      </div>

      {/* ป๊อปอัพสำหรับแสดงคำแนะนำการใช้งาน */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">คำแนะนำการใช้งาน</h2>
            <p className="text-gray-700">
              นี่คือคำแนะนำในการใช้งานของแอปพลิเคชันนี้...
            </p>
            <button
              onClick={toggleMedal}
              className="mt-4 px-4 py-2 text-white font-bold bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* ป๊อปอัพสำหรับการล็อกอิน */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-3 rounded-lg shadow-lg max-w-md w-full mx-auto ">
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-white flex ml-[400px] "
            >
              X
            </button>
            <h1 className="justify-center text-white text-2xl font-bold mb-4 flex ">
              {isLogin ? "Login" : "Sign up"}
            </h1>
            <div className="flex bg-gray-700 rounded-lg overflow-hidden border border-gray-600 relative">
              <div
                className={`absolute inset-y-0 bg-gray-500 transition-transform duration-300 ease-in-out ${
                  isLogin
                    ? "transform translate-x-0"
                    : "transform translate-x-full"
                }`}
                style={{
                  width: "50%",
                  borderRadius: "0.5rem",
                  zIndex: 0,
                }}
              />
              <button
                className={`flex-1 p-2 z-10 relative ${
                  isLogin ? "text-white" : "text-gray-400"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 p-2 z-10 relative ${
                  !isLogin ? "text-white" : "text-gray-400"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </div>
            <form
              className="space-y-4 md:space-y-6"
              style={{ minHeight: "300px" }} // กำหนดความสูงขั้นต่ำ
              onSubmit={isLogin ? handleLogin : handleSignup}
            >
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    style={{ right: "10px" }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {isLogin && (
                <button
                  onClick={goToForgetPassword}
                  className="text-white flex ml-[290px] font-bold"
                >
                  Forget Password
                </button>
              )}
              <button
                type="submit"
                className="w-full text-black bg-gray-100 hover:bg-pink-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
              {isLogin && (
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={loginWithPhone}
                  >
                    Sign in with Phone
                  </button>
                  <button
                    type="button"
                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={loginWithGoogle}
                  >
                    Sign in with Google
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

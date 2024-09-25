import React, { useState, useEffect } from "react";
import QRCodeComponent from "./line";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, googleProvider } from "./google"; // อ้างอิงไปที่ Firebase auth
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { MdSunny } from "react-icons/md";
import { RiMoonFill } from "react-icons/ri";
import { db } from "./google";
import Head from "next/head";

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
  const [user, setUser] = useState(null);
  const [isFlying, setIsFlying] = useState(true);
  const [speed, setSpeed] = useState(5); // เพิ่มตัวแปร speed เพื่อควบคุมความเร็ว
  const [birdPosition, setBirdPosition] = useState({
    x: 100,
    y: 100,
    angle: 0,
  });
  const [direction, setDirection] = useState({ x: 1, y: 1 }); // กำหนดให้เป็นวัตถุเพื่อลดข้อผิดพลาด
  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    let animationFrameId;

    const moveBird = () => {
      if (!isMoving) return;

      setBirdPosition((prevPosition) => {
        // ปรับความเร็วให้สมูทขึ้น
        let newX = prevPosition.x + speed * direction.x * 0.5;
        let newY = prevPosition.y + speed * direction.y * 0.5;

        // กำหนดขนาดของพื้นหลัง
        const backgroundWidth = window.innerWidth;
        const backgroundHeight = window.innerHeight;

        // กำหนดขนาดของนก
        const birdWidth = 100;
        const birdHeight = 100;

        // กำหนดขอบปลอดภัยเพื่อให้นกอยู่ในพื้นที่หน้าจอที่มองเห็นได้มากขึ้น
        const safeMargin = 100;

        // ตรวจสอบการชนขอบของพื้นหลัง และทำการสุ่มเปลี่ยนทิศทาง
        let newDirectionX = direction.x;
        let newDirectionY = direction.y;

        if (
          newX >= backgroundWidth - birdWidth - safeMargin ||
          newX <= safeMargin
        ) {
          newDirectionX = -direction.x; // เปลี่ยนทิศทางแกน X
          newDirectionY = Math.random() > 0.5 ? 1 : -1; // สุ่มทิศทางแกน Y เพื่อไม่ให้นกบินกลับในทิศทางเดิม
        }

        if (
          newY >= backgroundHeight - birdHeight - safeMargin ||
          newY <= safeMargin
        ) {
          newDirectionY = -direction.y; // เปลี่ยนทิศทางแกน Y
          newDirectionX = Math.random() > 0.5 ? 1 : -1; // สุ่มทิศทางแกน X เพื่อไม่ให้นกบินกลับในทิศทางเดิม
        }

        // อัปเดตทิศทางใหม่
        setDirection({ x: newDirectionX, y: newDirectionY });

        // ตรวจสอบการหลุดขอบและแก้ไข
        newX = Math.min(
          Math.max(newX, safeMargin),
          backgroundWidth - birdWidth - safeMargin
        );
        newY = Math.min(
          Math.max(newY, safeMargin),
          backgroundHeight - birdHeight - safeMargin
        );

        // เพิ่มการขยับมุมเพื่อให้บินแบบโค้ง
        return { x: newX, y: newY, angle: prevPosition.angle + 1 };
      });

      animationFrameId = requestAnimationFrame(moveBird);
    };

    if (isMoving) {
      animationFrameId = requestAnimationFrame(moveBird);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMoving, direction, speed]);

  // ฟังก์ชันเมื่อคลิกที่นก
  const handleClick = () => {
    setIsMoving((prev) => !prev); // สลับสถานะการเคลื่อนไหว
    setSpeed((prevSpeed) => prevSpeed + 2); // เพิ่มความเร็วเมื่อคลิกที่นก
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user || localStorage.getItem("profileUser")) {
        setIsLoggedIn(true);
        const storedUser = localStorage.getItem("profileUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("profileUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("showLogin") === "true") {
      setShowLoginModal(true);
    }
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("showLogin") === "true") {
      setShowLoginModal(true);
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    router.push("/", undefined, { shallow: true });
  };

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
    localStorage.removeItem("profileUser");
    router.push("/");
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const toggleMedal = () => {
    setShowModal(!showModal);
  };

  console.log(user);

  const handleLogin = async (e) => {
    console.log(email, password);

    e.preventDefault();

    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", email.trim()));

      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      if (querySnapshot.empty) {
        alert("ไม่พบผู้ใช้ที่มีอีเมลนี้");
        return;
      }

      let userFound = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        if (userData.password === password) {
          userFound = true;
          setUser(userData);

          // เก็บข้อมูลผู้ใช้ใน localStorage
          localStorage.setItem("profileUser", JSON.stringify(userData));

          // ซ่อนโมดัลล็อกอินและเปลี่ยนเส้นทาง
          setShowLoginModal(false);
          router.push("/addAndHistory");
        }
      });

      if (!userFound) {
        alert("รหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      alert("การเข้าสู่ระบบล้มเหลว: " + error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      const userId = generateUniqueId();
      const newUser = {
        email: email,
        password: password,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", userId), newUser);

      // เก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem("profileUser", JSON.stringify(newUser));

      setUser(newUser);

      setShowLoginModal(false);
      router.push("/addAndHistory");
    } catch (error) {
      alert("การลงทะเบียนล้มเหลว: " + error.message);
    }
  };

  // ฟังก์ชันสำหรับสร้าง ID หรือ UID ที่ไม่ซ้ำกัน
  const generateUniqueId = () => {
    return "user_" + Math.random().toString(36).substr(2, 9); // ตัวอย่างการสร้าง ID แบบสุ่ม
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // ถ้าไม่มีผู้ใช้ในฐานข้อมูล ให้เพิ่มข้อมูลใหม่
        const newUser = {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), newUser);
        // เก็บข้อมูลผู้ใช้ใน localStorage
        localStorage.setItem("profileUser", JSON.stringify(newUser));
      } else {
        // ถ้ามีผู้ใช้อยู่แล้วในฐานข้อมูล ให้เก็บข้อมูลที่ได้จากฐานข้อมูล
        const userData = querySnapshot.docs[0].data();
        localStorage.setItem("profileUser", JSON.stringify(userData));
      }

      setShowLoginModal(false);
      router.push("/addAndHistory");
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
      className="flex flex-col items-center justify-center  bg-cover bg-center relative"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('image 1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>Daily Boost</title>
        <link rel="icon" href="/11zon_cropped.jpg" />
      </Head>

      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=McLaren&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Lily+Script+One&family=McLaren&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="bird"
        onClick={handleClick}
        style={{
          position: "absolute",
          left: `${birdPosition.x}px`,
          top: `${birdPosition.y}px`,
          transform: `rotate(${birdPosition.angle}deg)`,
          width: "100px",
          height: "100px",
          backgroundImage: "url('otw.gif')",
          backgroundSize: "contain",
          transition:
            "left 0.5s linear, top 0.5s linear, transform 0.5s linear",
          cursor: "pointer",
        }}
      ></div>

      <div className="fixed top-4 right-4 flex items-center space-x-4">
        {isLoggedIn ? (
          <button
            onClick={logoutClick}
            className="flex items-center px-3 py-2 border border-[#FF819A] rounded-full shadow-lg hover:bg-[#FFB6C4] transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-2  rounded-full overflow-hidden">
              <MdSunny className="text-blue-500 text-8xl" />
            </div>
            <span className="text-white font-serif  libre-caslon-text-regular ">
              Log out
            </span>
          </button>
        ) : (
          <button
            onClick={loginClick}
            className="flex items-center px-3 py-2  border border-[#FF819A] rounded-full shadow-lg hover:bg-[#FFB6C4] transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-2= rounded-full overflow-hidden">
              <RiMoonFill className="text-blue-500 text-xl" />
            </div>
            <span className="text-white  font-serif libre-caslon-text-regular ">
              Log in
            </span>
          </button>
        )}
      </div>
      <div className="fixed top-4 left-4 flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="/logo_web.png"
            alt="Home Icon"
            className=" transition-transform duration-500 hover:rotate-180 group-hover:text-black object-cover w-full h-full"
          />
        </div>
        <div className="text-white text-2xl  lily-script-one-regular ">
          Daily Boost
        </div>
      </div>
      <main className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <img
          src="/Group 10.png"
          className="w-full h-auto object-cover"
          alt="Group"
        />
        <div className="w-full max-w-3xl bg-white  rounded-xl shadow-xl p-9 mt-10 ">
          <h1
            className="text-4xl text-center font-serif  text-gray-600 drop-shadow-lg prompt-regular mt-1 "
            style={{ whiteSpace: "nowrap", marginLeft: "20px" }}
          >
            เริ่มต้นวันใหม่ด้วยพลังใจที่สดใสในทุกๆเช้า
          </h1>
          <p className="text-lg text-gray-600 mt-4 mb-4 font-serif prompt-regular ">
            เพื่อให้คุณพร้อมรับมือกับทุกความท้าทาย ไม่เพียงแค่รับแรงบันดาลใจ
          </p>
          <p className="text-lg text-gray-600 mb-3 font-serif prompt-regular ">
            คุณยังสามารถแบ่งปันข้อความดีๆให้กับคนที่คุณรักและห่วงใยได้เช่นกัน
          </p>
          <p className="text-lg text-gray-600 font-serif prompt-regular">
            มาเติมพลังใจทุกวันกับเรา!
          </p>

          <div className="mt-10 flex justify-center items-center space-x-4">
            <button
              onClick={loginClick}
              className="px-6 py-2 text-white font-serif   rounded-full shadow-lg bg-[#FF819A] hover:bg-[#FFB6C4] hover:text-white transition-colors border border-pink-300 flex items-center prompt-regular"
            >
              <span>เริ่มต้นใช้งาน</span>
            </button>
            <button
              onClick={toggleQRCode}
              className="px-6 py-2 text-white font-serif   rounded-full shadow-lg bg-[#FF819A] hover:bg-[#FFB6C4] hover:text-white transition-colors border border-pink-300 flex items-center prompt-regular"
            >
              <span>รับข้อความ</span>
            </button>
          </div>
        </div>
      </main>
      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              onClick={toggleQRCode}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="font-serif text-black font-bold text-xl justify-center flex mb-4 prompt-regular">
              สแกน QR CODE
            </h2>
            <div className="justify-center flex">
              <QRCodeComponent lineID="@686bymtt" className />
            </div>
            <h2 className="font-serif text-black font-bold text-xl justify-center flex mb-4 prompt-regular">
              สแกน QR CODE เพื่อรับข้อความ
            </h2>
          </div>
        </div>
      )}
      {/* ปุ่มที่มุมขวาล่าง */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMedal}
          className="text-gray-600 text-xl underline hover:text-gray-700 transition-colors font-serif prompt-regular"
        >
          คำแนะนำการใช้งาน
        </button>
      </div>
      {/* ป๊อปอัพสำหรับแสดงคำแนะนำการใช้งาน */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <button
              onClick={toggleMedal}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-serif text-[#FF819A] mb-4 prompt-regular">
              คำแนะนำการใช้งาน
            </h2>
            <p className="text-gray-700 font-serif prompt-regular">
              เป็นเว็บที่ทำขึ้นมาเพื่อแบ่งปันข้อความดีๆให้กับคนที่คุณรัก และ
              ห่วงใยให้มีความสุขในทุกๆเช้าของวัน ทำการ
              <span
                onClick={() => {
                  if (!isLoggedIn) {
                    toggleMedal();
                    setShowLoginModal(true);
                  } else {
                    alert("คุณได้ล็อกอินแล้ว เริ่มต้นใช้งานได้เลยค่ะ");
                  }
                }}
                className="text-[#FF819A] cursor-pointer"
              >
                {""} Login {""}
              </span>
              เพื่อใส่ข้อความดีๆให้มีกำลังใจในทุกๆเช้ากัน และ
              สามารถรับข้อความได้ง่ายๆแค่ สแกน{" "}
              <span
                onClick={() => {
                  if (!showQRCode) {
                    toggleMedal();
                    setShowQRCode(true);
                  }
                }}
                className="text-[#FF819A] cursor-pointer"
              >
                {""} QRCode {""}
              </span>
              เพื่อรับข้อความได้เลยค่ะ
            </p>
          </div>
        </div>
      )}
      {/* ป๊อปอัพสำหรับการล็อกอิน */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-3 rounded-lg shadow-lg max-w-md w-full mx-auto ">
            <button
              onClick={handleCloseLoginModal}
              className="text-black flex ml-[400px] "
            >
              X
            </button>
            <h1 className="justify-center text-black text-5xl font-serif  mb-4 flex  lily-script-one-regular ">
              {isLogin ? "Login" : "Sign up"}
            </h1>
            <div className="flex bg-gray-300 rounded-lg overflow-hidden border border-gray-300 relative">
              <div
                className={`absolute inset-y-0 bg-[#FF819A] transition-transform duration-300 ease-in-out ${
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
                  isLogin
                    ? "text-white libre-caslon-text-regular"
                    : "text-white libre-caslon-text-regular"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 p-2 z-10 relative ${
                  !isLogin
                    ? "text-white libre-caslon-text-regular"
                    : "text-white libre-caslon-text-regular"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </div>
            <form
              className="space-y-4 md:space-y-6"
              style={{ minHeight: "300px" }}
              onSubmit={isLogin ? handleLogin : handleSignup}
            >
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-600 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5 libre-caslon-text-regular"
                  placeholder="Username"
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
                    placeholder="Password"
                    className="bg-gray-50 border border-gray-300 text-gray-600 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-12 dark:bg-gray-700 dark:border-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 libre-caslon-text-regular"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-600"
                    style={{ right: "10px" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {isLogin && (
                <button
                  type="button"
                  onClick={goToForgetPassword}
                  className="text-black flex ml-[290px] font-serif  libre-caslon-text-regular"
                >
                  Forget Password
                </button>
              )}
              <button
                type="submit"
                className="w-full text-white bg-[#FF819A] hover:bg-[#FFB6C4] hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 libre-caslon-text-regular"
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
              {isLogin && (
                <div className="flex justify-between space-x-2 m-36">
                  <button
                    type="button"
                    className="p-1 bg-white rounded-full"
                    onClick={loginWithPhone}
                  >
                    <FaPhoneAlt className="text-2xl text-black" />
                  </button>
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="p-1 bg-white rounded-full"
                  >
                    <FcGoogle className="text-2xl" />
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

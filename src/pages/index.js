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
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { doc, setDoc,collection,query,where,getDocs } from "firebase/firestore";
import { db } from "./google";

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
  const [user,setUser] = useState(null)

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
    router.push("/");
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const toggleMedal = () => {
    setShowModal(!showModal);
  };

  console.log(user)
  const handleLogin = async (e) => {
    e.preventDefault();
  
    // การตรวจสอบข้อมูลพื้นฐาน
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
  
    try {
      // สร้างการค้นหาใน Firestore
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", email));
  
      // ดึงข้อมูลผู้ใช้จาก Firestore
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert("ไม่พบผู้ใช้ที่มีอีเมลนี้");
        return;
      }
  
      // ตรวจสอบข้อมูลรหัสผ่าน
      let userFound = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // ตรวจสอบรหัสผ่านที่เข้ารหัส (รหัสผ่านใน Firestore ควรจะเข้ารหัส)
        if (userData.password === password) {
          userFound = true;
          // กำหนดผู้ใช้ที่เข้าสู่ระบบ
          setUser(userData);
          
          // เก็บข้อมูลผู้ใช้ใน localStorage
          localStorage.setItem('profileUser', JSON.stringify(userData));
  
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
    
    // การตรวจสอบข้อมูลพื้นฐาน
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    
    try {
      // สร้าง ID ที่ไม่ซ้ำกันสำหรับผู้ใช้
      const userId = generateUniqueId();
      
      // บันทึกข้อมูลผู้ใช้ลงใน Firestore
      await setDoc(doc(db, "users", userId), {
        email: email,
        password: password, // ในการเก็บรหัสผ่านควรมีการเข้ารหัสและจัดเก็บอย่างปลอดภัย
        createdAt: new Date(),
      });
      
      // ซ่อนโมดัลล็อกอินและเปลี่ยนเส้นทาง
      setShowLoginModal(false);
      router.push("/addAndHistory");
    } catch (error) {
      alert("การลงทะเบียนล้มเหลว: " + error.message);
    }
  };
  
  // ฟังก์ชันสำหรับสร้าง ID หรือ UID ที่ไม่ซ้ำกัน
  const generateUniqueId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9); // ตัวอย่างการสร้าง ID แบบสุ่ม
  };
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
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
    <div flex-col items-center justify-center min-h-screen bg-cover bg-center
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://cdn.discordapp.com/attachments/1078547722879107163/1283632728666800148/night-sky-stars-sunrise-horizon-scenery-2k-wallpaper-uhdpaper.com-8060g.jpg?ex=66e3b3a3&is=66e26223&hm=7562061e90ec777004ff5d8a20af65df1067b1fa2cb2881809a0c5a3a193be87&')" }}
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
            <span className="text-pink-800 font-serif ">Log out</span>
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
            <span className="text-pink-800 font-serif ">Log in</span>
          </button>
        )}
      </div>

      <div className="fixed top-4 left-4 flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="https://cdn.discordapp.com/attachments/1078547722879107163/1283640731147436094/moon_logo_half_580c61bd-cc8f-484c-9ea0-1b9414888ae1.png?ex=66e3bb17&is=66e26997&hm=989fac35a3906898079a102183d6f5208e5e5d34abc98b97c40ecd2592d12ffd&"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white font-serif ">Daily Boost</div>
      </div>

      <main className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <div className="w-full max-w-3xl">
          <p className="text-lg text-white font-serif ">Daily Boost!</p>
          <h1
            className="text-4xl text-center font-serif  text-white drop-shadow-lg"
            style={{ whiteSpace: "nowrap", marginLeft: "20px" }}
          >
            เริ่มต้นวันใหม่ด้วยพลังใจที่สดใสในทุกๆเช้า
          </h1>

          <p className="text-lg text-white mt-4 font-serif ">
            เพื่อให้คุณพร้อมรับมือกับทุกความท้าทาย ไม่เพียงแค่รับแรงบันดาลใจ
          </p>
          <p className="text-lg text-white font-serif ">
            คุณยังสามารถแบ่งปันข้อความดีๆให้กับคนที่คุณรักและห่วงใยได้เช่นกัน
          </p>
          <p className="text-lg text-white font-serif ">
            มาเติมพลังใจทุกวันกับเรา!
          </p>

          <div className="mt-10 flex justify-center items-center space-x-4">
            <button
              onClick={loginClick}
              className="px-6 py-2 text-white font-serif   rounded-full shadow-lg hover:bg-white hover:text-purple-600 transition-colors border border-white flex items-center"
            >
              <span>เริ่มต้นใช้งาน</span>
            </button>
            <button
              onClick={toggleQRCode}
              className="px-6 py-2 text-white font-serif   rounded-full shadow-lg hover:bg-white hover:text-purple-600 transition-colors border border-white flex items-center"
            >
              <span>รับข้อความ</span>
            </button>
          </div>
        </div>
      </main>

      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-serif  mb-4">สแกน QR code</h2>
            <QRCodeComponent lineID="@686bymtt" />
            <button
              onClick={toggleQRCode}
              className="mt-4 px-4 py-2 text-white font-serif  bg-violet-500 rounded-full shadow-lg hover:bg-violet-600   transition-all duration-300 transform hover:scale-105"
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
          className="text-white text-base underline hover:text-gray-300 transition-colors font-serif"
        >
          คำแนะนำการใช้งาน
        </button>
      </div>

      {/* ป๊อปอัพสำหรับแสดงคำแนะนำการใช้งาน */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-serif text-purple-600 mb-4">
              คำแนะนำการใช้งาน
            </h2>
            <p className="text-gray-700 font-serif">
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
                className="text-purple-500 cursor-pointer"
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
                className="text-purple-500 cursor-pointer"
              >
                {""} QRCode {""}
              </span>
              เพื่อรับข้อความได้เลยค่ะ
            </p>

            <button
              onClick={toggleMedal}
              className="mt-4 px-4 py-2 text-white font-serif bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 w-full"
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
              onClick={handleCloseLoginModal}
              className="text-white flex ml-[400px] "
            >
              X
            </button>
            <h1 className="justify-center text-white text-2xl font-serif  mb-4 flex ">
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
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {isLogin && (
                <button
                  type="button"
                  onClick={goToForgetPassword}
                  className="text-white flex ml-[290px] font-serif "
                >
                  Forget Password
                </button>
              )}
              <button
                type="submit"
                className="w-full text-black bg-gray-100 hover:bg-purple-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
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
                    <FaPhoneAlt className="text-2xl text-purple-500" />
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

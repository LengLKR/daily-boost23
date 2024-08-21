import React from "react";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./google";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router"; // import useRouter
import { sendDataToFirestore } from "./service";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
const Signup = () => {
  const [user, setUser] = useState(null);
  const [str, setStr] = useState("Hello");
  const [textBtn, setTextbtn] = useState("Login Google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // เพิ่ม state สำหรับการแสดงรหัสผ่าน
  const [rememberMe, setRememberMe] = useState(false); // เพิ่ม state สำหรับ rememberMe
  const router = useRouter(); // ใช้ useRouter เพื่อเปลี่ยนหน้า

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // สร้างอินสแตนซ์ Firestore
      const db = getFirestore();
      const usersCollection = collection(db, "users");

      // ตรวจสอบว่ามีผู้ใช้ที่มี email และ password นี้อยู่ใน Firestore หรือไม่
      const q = query(
        usersCollection,
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // ถ้าดาต้าเบสไม่มีข้อมูล ให้ดำเนินการสร้างผู้ใช้ใหม่ใน Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // เก็บข้อมูลผู้ใช้ใน Firestore
        const data = {
          email: user.email,
          uid: user.uid,
          password: password, // เก็บรหัสผ่าน (ควรเข้ารหัสก่อนบันทึกในโปรดักชันจริง)
          createdAt: new Date(),
        };
        await sendDataToFirestore(data);

        router.push("/login"); // นำผู้ใช้ไปยังหน้า login
      } else {
        // ถ้าพบผู้ใช้ที่มีอีเมลและรหัสผ่านนี้ใน Firestore
        alert("Email และ Password นี้ถูกใช้งานไปแล้ว");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + error.message);
    }
  };

  useEffect(() => {
    if (user) {
      setTextbtn("Logout");
    } else {
      setTextbtn("Login with Google");
    }
  }, [user]);

  return (
    <div>
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
              Apply For Membership
              </h1>
              <form
                id="loginForm"
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit} // เปลี่ยนจาก handleTest เป็น handleSubmit
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} // เปลี่ยน type ของ input ตามสถานะ showPassword
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // เปลี่ยนสถานะ showPassword เมื่อคลิก
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-black bg-gray-100 hover:bg-pink-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;

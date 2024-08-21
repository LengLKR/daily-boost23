import React, { useState, useEffect } from "react";
import QRCodeComponent from "./line";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าทำงานอยู่ที่ฝั่งไคลเอนต์หรือไม่
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  // เพิ่ม listener เพื่อดักฟังการเปลี่ยนแปลงของ localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loginClick = () => {
    router.push("/login");
  };

  const logoutClick = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('bg_login.png')" }}
    >
      {/* ปุ่มมุมขวา */}
      <div className="fixed top-4 right-4 flex items-center space-x-4">
        {isLoggedIn ? (
          <button
            onClick={logoutClick}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-full shadow"
          >
            <div className="flex items-center justify-center w-6 h-6 mr-2 bg-purple-300 rounded-full overflow-hidden">
              <img
                src="/logo_login.png"
                alt="Logout Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-800">Log out</span>
          </button>
        ) : (
          <button
            onClick={loginClick}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-full shadow"
          >
            <div className="flex items-center justify-center w-6 h-6 mr-2 bg-purple-300 rounded-full overflow-hidden">
              <img
                src="/logo_login.png"
                alt="Login Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-800">Log in</span>
          </button>
        )}
      </div>

      {/* ปุ่มมุมซ้ายบนสุด */}
      <div className="fixed top-4 left-4 flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden">
          <img
            src="/logohome.png"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <main className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white">
            เริ่มต้นวันใหม่ด้วยพลังใจจาก Daily Boost!
          </h1>
          <p className="text-lg text-white mt-4">Welcome to Daily Boost</p>

          <div>
            <h1 className="text-white">
              สแกน QR code เพื่อเช้าวันใหม่ที่สดใสกัน!
            </h1>
            <div className="ml-36 mt-10 mb-10">
              <QRCodeComponent lineID="@686bymtt" />
            </div>
          </div>

          {!isLoggedIn && (
            <button
              onClick={loginClick}
              className="inline-flex items-center px-4 py-2 text-white rounded-full bg-purple-200 border border-purple-200"
            >
              <div className="flex items-center justify-center w-6 h-6 mr-2 bg-purple-300 rounded-full overflow-hidden">
                <img
                  src="/logo_login.png"
                  alt="Login Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-800">Log in</span>
            </button>
          )}
        </div>
      </main>

      <footer className="w-full p-4 text-center text-gray-500">
        การดำเนินการต่อแสดงว่าคุณยอมรับข้อกำหนดและโบยาบของเรา
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import QRCodeComponent from "./line";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./google"; // อ้างอิงไปที่ Firebase auth ของคุณ

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

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
    router.push("/login");
  };

  const logoutClick = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
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
      </div>

      <main className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-pink-100 drop-shadow-lg">
            เริ่มต้นวันใหม่ด้วยพลังใจจาก Daily Boost!
          </h1>
          <p className="text-lg text-pink-200 mt-4">Welcome to Daily Boost</p>
          <div className="mt-10 flex justify-center items-center space-x-4">
            <button className="px-6 py-2 text-purple-500 font-bold bg-white rounded-full shadow-lg hover:bg-white/80 transition-colors border border-purple-500 flex items-center">
              <span>เริ่มต้นใช้งาน</span>
              <span className=" "></span>
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

      <footer className="w-full p-4 text-center text-pink-300">
        การดำเนินการต่อแสดงว่าคุณยอมรับข้อกำหนดและโบยาบของเรา
      </footer>
    </div>
  );
}

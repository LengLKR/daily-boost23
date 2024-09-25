import React, {useEffect, useState } from "react";
import { sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { auth } from "./google";
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";
import Head from "next/head";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [isFlying, setIsFlying] = useState(true);
  const [speed, setSpeed] = useState(5); // เพิ่มตัวแปร speed เพื่อควบคุมความเร็ว
  const [birdPosition, setBirdPosition] = useState({
    x: 100,
    y: 100,
    angle: 0,
  });
  const [direction, setDirection] = useState({ x: 1, y: 1 }); // กำหนดให้เป็นวัตถุเพื่อลดข้อผิดพลาด
  const [isMoving, setIsMoving] = useState(true);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Failed to send reset email. " + error.message);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      // Re-authenticate the user with the email and password
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, password);
        setMessage("Password updated successfully!");
        router.push("/?showlogin=true");
      } else {
        setMessage("User not authenticated. Please log in first.");
      }
    } catch (error) {
      setMessage("Failed to update password. " + error.message);
    }
  };
  const handleBackToLogin = () => {
    router.push("/?showLogin=true");
  };

  const BackToLogin = () => {
    router.push("/?showLogin=true");
  };

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
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('image 1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        
      }}
    >
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

      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Lily+Script+One&family=McLaren&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=McLaren&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div>
        <button
          className="fixed top-4 left-4 z-50 text-4xl text-[#FF819A] underline hover:text-white transition-colors font-serif"
          onClick={BackToLogin}
        >
          <IoMdArrowRoundBack />
        </button>
      </div>
      <div>
        <img
          src="/Group 10.png"
          className="w-full h-auto object-cover"
          alt="Group"
        />
      </div>
      <div className="  w-[650px] ">
        <div className="w-full bg-white rounded-3xl shadow-md mt-4 px-5 py-8 ">
          <h2 className="text-2xl font-serif  text-black lily-script-one-regular ">
            Forgot your Password ?
          </h2>
          <form onSubmit={handleResetPassword} className="mt-6">
            <div className="mb-4">

              <label
                htmlFor="email"
                className="block text-sm  text-black libre-caslon-text-regular "
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[600px] px-4 py-2 mt-1 text-gray-700 bg-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>
            <div className="flex">
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-[#FF819A] rounded-lg hover:bg-[#FFB6C4]  mclaren-regular "
              >
                Reset Password
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full mt-4 text-[#840DCD] hover:underline mclaren-regular "
              >
                Back to Login
              </button>
            </div>
            {message && (
            <p className="mt-6 text-center text-[#FF819A]">{message}</p>
          )}
          </form>
          
          {/* <form onSubmit={handleUpdatePassword} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-600"
          >
            Update Password
          </button>
        </form> */}
          {/* {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

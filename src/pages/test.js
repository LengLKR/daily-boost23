import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaPhoneAlt,
  FaQrcode,
} from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Head from "next/head";
import QRCodeComponent from "./line";

export default function Home() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFlying, setIsFlying] = useState(true);
  const [speed, setSpeed] = useState(5); // เพิ่มตัวแปร speed เพื่อควบคุมความเร็ว
  const [birdPosition, setBirdPosition] = useState({
    x: 100,
    y: 100,
    angle: 0,
  });
  const [direction, setDirection] = useState({ x: 1, y: 1 }); // กำหนดให้เป็นวัตถุเพื่อลดข้อผิดพลาด
  const [isMoving, setIsMoving] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
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
      className="flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/image 1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=McLaren&display=swap"
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

      <div className="flex w-full">
        <div className="h-screen flex flex-col justify-center  shadow-lg md:rounded-lg bg-white rounded-r-3xl w-2/4 ">
          <div className="flex justify-center items-center min-h-screen ">
            <div>
              <h1
                className="mb-4 text-black pacifico-regular "
                style={{ fontSize: "64px", fontWeight: "bold" }}
              >
                Login
              </h1>
              <p className="text-sm mb-6 text-gray-500  ">
                เริ่มต้นวันใหม่ พร้อมรับพลังบวกทุกๆเช้ากับเรา
              </p>
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="flex flex-col mb-4 libre-caslon-text-regular">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className="p-4 rounded-md bg-white border border-black text-lg text-gray-400 w-full"
                      required
                    />
                  </div>
                  <div className="relative flex items-center mb-6 libre-caslon-text-regular">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="p-4 rounded-md bg-white border border-black text-lg text-gray-400 w-full"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 bg-transparent border-none text-lg cursor-pointer text-black"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 mb-4">
                  <button
                    type="submit"
                    style={{ backgroundColor: "#FF819A" }}
                    className="text-white py-4 px-6 rounded-md text-lg font-semibold w-full"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="bg-pink-200 text-pink-500 py-4 px-6 rounded-md text-lg font-semibold flex items-center"
                  >
                    <FaQrcode className="mr-2" />
                    <span> QR</span>
                  </button>
                </div>

                <p className="text-sm text-black text-center">
                  Do you doesn't have an account?{" "}
                  <a href="/create" className="text-pink-500">
                    create
                  </a>{" "}
                  /{" "}
                  <a href="/forgot-password" className="text-pink-500">
                    forgot password
                  </a>
                </p>

                <div className="flex justify-center mt-6 space-x-4">
                  <button className="flex items-center bg-white border border-black px-4 py-2 rounded-md text-sm text-black pacifico-regular">
                    <FaGoogle className="mr-2" /> Continue with Google
                  </button>
                  <button className="flex items-center bg-white border border-black px-4 py-2 rounded-md text-sm text-black pacifico-regular">
                    <FaPhoneAlt className="mr-2" /> Continue with OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-cover bg-center mt-72">
          <img
            src="/Group 10.png"
            className="w-full h-auto object-cover"
            alt="Group"
          />
        </div>
      </div>
    </div>
  );
}

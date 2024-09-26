import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";
import Head from "next/head";

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
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

 
  // Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAGrDbcLB6Xx8t8rh2noyFrSPVoRYdeizU",
    authDomain: "myapp-e0219.firebaseapp.com",
    databaseURL:
      "https://myapp-e0219-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "myapp-e0219",
    storageBucket: "myapp-e0219.appspot.com",
    messagingSenderId: "265220609618",
    appId: "1:265220609618:web:63c2055428b0a05baef18b",
    measurementId: "G-J63G9Y5YHJ",
  };

  // Initialize Firebase
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]; // ใช้ Firebase app ที่มีอยู่แล้ว
  }

  const auth = getAuth(app);
  auth.useDeviceLanguage();

  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container", // ต้องมี id "recaptcha-container" ใน DOM
        {
          size: "invisible", // หรือใช้ "normal" เพื่อแสดง
          callback: (response) => {
            console.log("Recaptcha solved successfully.");
          },
          "expired-callback": () => {
            console.log("Recaptcha expired. Please retry", requestOtp);
          },
        }
      );
      window.recaptchaVerifier
        .render()
        .then((widgetId) => {
          console.log(
            "Recaptcha rendered successfully with widgetId:",
            widgetId
          );
        })
        .catch((error) => {
          alert(error.toString());
          console.error("Error rendering Recaptcha:", error);
        });
    }
  };

  // Request OTP
  const requestOtp = async (e) => {
    e.preventDefault();
    setupRecaptcha();
    const applicationVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container"
    );
    // try {
    if (phoneNumber?.startsWith("0")) {
      setPhoneNumber("+66" + phoneNumber.substring(0, 1));
    }
    
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      applicationVerifier
    );
    // const credential = await confirmationResult.confirm(verificationCode);
    setVerificationId(confirmationResult.verificationId);
    setIsOtpSent(true);
    // } catch (error) {
    //   console.error("Error sending OTP:", error);
    //   alert(error.toString())
    // }
  };

  // Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      console.log("Verification successful:", userCredential.user);
    } catch (error) {
      console.log("Error verifying OTP:", error);
    }
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
      className="min-h-screen flex items-center justify-center bg-gray-100 relative"
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

      <div>
        <button
          className="fixed top-4 left-4 z-50 text-4xl text-[#FF819A] underline hover:text-white transition-colors font-serif"
          onClick={BackToLogin}
        >
          <IoMdArrowRoundBack />
        </button>
      </div>
      <div className="  w-[650px] ">
        <div className="w-full bg-white rounded-3xl shadow-md mt-4 px-5 py-8">
          <h2 className="text-2xl font-semibold  text-black mb-6 lily-script-one-regular">
            Login with Phone
          </h2>
          <label
            htmlFor="email"
            className="block text-sm  text-black libre-caslon-text-regular "
          >
            Phone
          </label>

          <div id="recaptcha-container"></div>
          {!isOtpSent ? (
            <form onSubmit={requestOtp}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className=" w-[600px] px-4 py-2 mt-1 text-gray-700 bg-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-[200px] px-4 py-2 text-white bg-[#FF819A] rounded-lg hover:bg-[#FFB6C4]  mclaren-regular"
              >
                Send OTP
              </button>
              
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;

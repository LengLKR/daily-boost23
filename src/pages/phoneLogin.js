import React, { useState, useEffect } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "./google";
import { useRouter } from "next/router";

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUser] = useState(null);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !recaptchaInitialized) {
      // ตั้งค่า appVerificationDisabledForTesting
      if (auth && auth.settings) {
        auth.settings.appVerificationDisabledForTesting = true;
      }
      setupRecaptcha();
      setRecaptchaInitialized(true);
    }
  }, [recaptchaInitialized]);

  const setupRecaptcha = () => {
    if (typeof window !== "undefined" && auth) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA solved.");
            },
          },
          auth
        );

        window.recaptchaVerifier
          .render()
          .then(() => {
            console.log("reCAPTCHA ready");
          })
          .catch((error) => {
            console.error("Error rendering reCAPTCHA", error);
          });
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier", error);
      }
    }
  };

  const handlePhoneSignIn = async () => {
    if (!window.recaptchaVerifier) {
      console.error("reCAPTCHA ยังไม่ได้รับการเริ่มต้น หรือ undefined");
      alert("การตรวจสอบ reCAPTCHA ล้มเหลว กรุณารีเฟรชหน้าและลองใหม่อีกครั้ง");
      return;
    }

    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log("ส่ง SMS สำเร็จแล้ว.");
    } catch (error) {
      console.error("ส่ง SMS ล้มเหลว", error);
      alert("ไม่สามารถส่ง SMS ได้: " + error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const confirmationResult = window.confirmationResult;
      const result = await confirmationResult.confirm(verificationCode);
      setUser(result.user);
      console.log("ยืนยันตัวตนด้วยเบอร์โทรศัพท์สำเร็จ:", result.user);
      router.push("/");
    } catch (error) {
      console.error("การยืนยันล้มเหลว:", error);
      alert("การยืนยันล้มเหลว: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            เข้าสู่ระบบด้วยเบอร์โทรศัพท์
          </h1>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                เบอร์โทรศัพท์ของคุณ
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="+1234567890"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div id="recaptcha-container"></div>
            <div>
              <button
                type="button"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handlePhoneSignIn}
                disabled={!recaptchaInitialized} // ปิดการใช้งานจนกว่า reCAPTCHA จะพร้อม
              >
                ส่งรหัสยืนยัน
              </button>
            </div>
            <div className="mt-4">
              <label
                htmlFor="verificationCode"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                รหัสยืนยัน
              </label>
              <input
                type="text"
                name="verificationCode"
                id="verificationCode"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="w-full mt-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                ยืนยันรหัส
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;

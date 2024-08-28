// phoneLogin.js
import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./google";

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha resolved");
        },
      },
      auth
    );
  };
  const requestOtp = async (e) => {
    // ฟังก์ชัน requestOtp ถูกประกาศที่นี่
    e.preventDefault();
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setIsOtpSent(true);
    } catch (error) {
      console.log("Error sending OTP:", error);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const credential = await auth.signInWithCredential(
        firebase.auth.PhoneAuthProvider.credential(verificationId, otp)
      );
      console.log("Verification successful:", credential.user);
    } catch (error) {
      console.log("Error verifying OTP:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login with Phone
        </h2>
        {!isOtpSent ? (
          <form onSubmit={requestOtp}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Send OTP
            </button>
            <div id="recaptcha-container" className="mt-4"></div>
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
  );
};

export default PhoneLogin;

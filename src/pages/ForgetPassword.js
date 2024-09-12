import React, { useState } from "react";
import { sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { auth } from "./google";
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

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
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://cdn.discordapp.com/attachments/1078547722879107163/1283637553144004659/sky-clouds-abstract-digital-art-uhdpaper.com-4K-4.327.jpg?ex=66e3b821&is=66e266a1&hm=be2894470fb77d83fd445ccb7262dd373121c4a1cc94df7c10fb9be7a61ebd26&')", 
      }}
    >
      <div>
        <button
          className="fixed top-4 left-4 z-50 text-4xl text-black underline hover:text-purple-600 transition-colors font-serif"
          onClick={BackToLogin}
        >
         <IoMdArrowRoundBack />
        </button>
      </div>
      <div className="w-full max-w-md p-6 bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-serif text-center text-white">
          Forgot Password
        </h2>
        <p className="mt-4 text-center text-white">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleResetPassword} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-violet-500 rounded-lg hover:bg-violet-600"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
        <form onSubmit={handleUpdatePassword} className="mt-6">
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
            className="w-full px-4 py-2 text-white bg-violet-500 rounded-lg hover:bg-violet-600"
          >
            Update Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
        <button
          onClick={handleBackToLogin}
          className="w-full mt-4 text-white hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;

import React, { useState } from "react";
import { sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { auth } from "./google";
import { useRouter } from "next/router";

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
        router.push("/login");
      } else {
        setMessage("User not authenticated. Please log in first.");
      }
    } catch (error) {
      setMessage("Failed to update password. " + error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="mt-4 text-center text-gray-600">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleResetPassword} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
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
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
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
              className="block text-sm font-medium text-gray-700"
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
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Update Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
        <button
          onClick={() => router.push("/login")}
          className="w-full mt-4 text-blue-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;

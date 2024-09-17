// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import {
//   signInWithPopup,
//   GoogleAuthProvider,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { auth, googleProvider } from "./google";
// import { sendDataToFirestore } from "./service";

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleToggle = () => {
//     setIsLogin(!isLogin);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       router.push("/");
//     } catch (error) {
//       alert("Login failed: " + error.message);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       await sendDataToFirestore({ email: user.email, uid: user.uid });
//       router.push("/");
//     } catch (error) {
//       alert("Signup failed: " + error.message);
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       router.push("/");
//     } catch (error) {
//       alert("Google sign-in failed: " + error.message);
//     }
//   };

//   const loginWithPhone = () => {
//     router.push("/phoneLogin");
//   };

//   return (
//     <div>
//       <section className="bg-gray-50 dark:bg-gray-900">
//         <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//           <a
//             href="#"
//             className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
//           >
//             <Image
//               className="w-8 h-8 mr-2"
//               src="/logoproject.png"
//               alt="logo"
//               width={32}
//               height={32}
//             />
//             daily-boost
//           </a>
//           <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//               <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                 {isLogin ? "Sign in to your account" : "Apply For Membership"}
//               </h1>
//               <div className="flex">
//                 <button
//                   className={`w-1/2 p-2 ${
//                     isLogin
//                       ? "bg-gray-800 text-white"
//                       : "bg-gray-200 dark:bg-gray-700"
//                   }`}
//                   onClick={() => setIsLogin(true)}
//                 >
//                   Login
//                 </button>
//                 <button
//                   className={`w-1/2 p-2 ${
//                     !isLogin
//                       ? "bg-gray-800 text-white"
//                       : "bg-gray-200 dark:bg-gray-700"
//                   }`}
//                   onClick={() => setIsLogin(false)}
//                 >
//                   Sign up
//                 </button>
//               </div>
//               <form
//                 className="space-y-4 md:space-y-6"
//                 onSubmit={isLogin ? handleLogin : handleSignup}
//               >
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Your email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     id="email"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                     placeholder="name@company.com"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       id="password"
//                       placeholder="••••••••"
//                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full text-black bg-gray-100 hover:bg-pink-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
//                 >
//                   {isLogin ? "Sign in" : "Sign up"}
//                 </button>
//                 {isLogin && (
//                   <div className="flex justify-between">
//                     <button
//                       type="button"
//                       className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//                       onClick={loginWithPhone}
//                     >
//                       Sign in with Phone
//                     </button>
//                     <button
//                       type="button"
//                       className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//                       onClick={loginWithGoogle}
//                     >
//                       Sign in with Google
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AuthPage;

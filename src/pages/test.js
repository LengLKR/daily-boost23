import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaPhoneAlt, FaQrcode } from "react-icons/fa";
import { useRouter } from "next/router";
import Head from "next/head";
import QRCodeComponent from "./line"; // Assuming you have this component


export default function TestPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFlying, setIsFlying] = useState(true);
  const [speed, setSpeed] = useState(5); // Control speed variable
  const [birdPosition, setBirdPosition] = useState({
    x: 100,
    y: 100,
    angle: 0,
  });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const [isMoving, setIsMoving] = useState(true);
  const router = useRouter();

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  // Bird animation on click
  const handleClick = () => {
    setIsMoving((prev) => !prev); // Toggle movement status
    setSpeed((prevSpeed) => prevSpeed + 2); // Increase speed on click
  };

  // Navigate to forget password
  const goToForgetPassword = () => {
    router.push("/ForgetPassword");
  };

  // Bird movement logic
  useEffect(() => {
    let animationFrameId;

    const moveBird = () => {
      if (!isMoving) return;

      setBirdPosition((prevPosition) => {
        let newX = prevPosition.x + speed * direction.x * 0.5;
        let newY = prevPosition.y + speed * direction.y * 0.5;

        const backgroundWidth = window.innerWidth;
        const backgroundHeight = window.innerHeight;
        const birdWidth = 100;
        const birdHeight = 100;
        const safeMargin = 100;

        let newDirectionX = direction.x;
        let newDirectionY = direction.y;

        if (newX >= backgroundWidth - birdWidth - safeMargin || newX <= safeMargin) {
          newDirectionX = -direction.x;
          newDirectionY = Math.random() > 0.5 ? 1 : -1;
        }

        if (newY >= backgroundHeight - birdHeight - safeMargin || newY <= safeMargin) {
          newDirectionY = -direction.y;
          newDirectionX = Math.random() > 0.5 ? 1 : -1;
        }

        setDirection({ x: newDirectionX, y: newDirectionY });

        newX = Math.min(Math.max(newX, safeMargin), backgroundWidth - birdWidth - safeMargin);
        newY = Math.min(Math.max(newY, safeMargin), backgroundHeight - birdHeight - safeMargin);

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
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text&display=swap"
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
          transition: "left 0.5s linear, top 0.5s linear, transform 0.5s linear",
          cursor: "pointer",
        }}
      ></div>

      <div className="flex w-full">
        <div className="h-screen flex flex-col justify-center shadow-lg md:rounded-lg bg-white rounded-r-3xl w-2/4">
          <div className="flex justify-center items-center min-h-screen">
            <div>
              <h1 className="mb-4 text-black pacifico-regular" style={{ fontSize: "64px", fontWeight: "bold" }}>
                Login
              </h1>
              <p className="text-sm mb-6 text-gray-500">เริ่มต้นวันใหม่ พร้อมรับพลังบวกทุกๆเช้ากับเรา</p>
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
                    <span>QR</span>
                  </button>
                </div>

                <p className="text-sm text-black text-center">
                  Do you doesn't have an account?{" "}
                  <a href="/create" className="text-pink-500">
                    create
                  </a>{" "}
                  /{" "}
                  <button onClick={goToForgetPassword}  className="text-pink-500">
                    forgot password
                  </button>
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
          <img src="/Group 10.png" className="w-full h-auto object-cover" alt="Group" />
        </div>
      </div>
    </div>
  );
}

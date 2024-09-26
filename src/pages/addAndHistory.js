import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Modal from "./modalprofile";
import Head from "next/head";

const badWords = [
  "ควย",
  "หี",
  "ไอเหี้ย",
  "ไอสัตว์",
  "ไอสัส",
  "ควาย",
  "เฮงซวย",
  "อีตอแหล",
  "ไอ้ระยำ",
  "ไอ้ตัวแสบ",
  "ผู้หญิงต่ำๆ",
  "พระหน้าผี",
  "อีดอก",
  "อีดอกทอง",
  "หมา",
  "ไอเวร",
  "มารศาสนา",
  "ไอ้หน้าโง่",
  "กระโหลก",
  "อีสัส",
  "ขว$ย",
  "xีสั$",
  "ค*ย",
  "hี",
  "ืเu",
  "ควาi",
  "l]งซวย",
  "อีต@แหล",
  "ไอระยำ",
  "aัส",
  "xัส",
  "vtwic",
  "ก$ย",
  "คsย",
  "ฆวย",
  "คๅย",
  "คุวย",
  "อีแก่",
  "อีบ้า",
  "อีโง่",
  "ไอ้ขี้เมา",
  "ไอ้หน้าแหก",
  "ไอ้ตอแหล",
  "อีชั่ว",
  "อีอ้วน",
  "อีบัดซบ",
  "ไอ้ถ่อย",
  "อีสันดาน",
  "ไอ้หัวขวด",
  "อีปอบ",
  "ไอ้จังไร",
  "อีชิงหมาเกิด",
  "ไอ้ขี้โกง",
  "ไอ้ขี้ขโมย",
  "ขวาย",
  "สันขวาน",
  "xี",
  "มึง",
  "กู",
  "ไอกาก",
  "เย็ด",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "damn",
  "cunt",
  "dick",
  "piss",
  "whore",
  "slut",
  "fag",
  "nigger",
  "motherfucker",
  "cock",
  "pussy",
  "wanker",
  "jerk",
  "douchebag",
  "twat",
  "prick",
  "bollocks",
  "bugger",
  "arse",
  "tosser",
  "skank",
  "scumbag",
  "dickhead",
  "shithead",
  "fucker",
  "cocksucker",
  "twathead",
  "asswipe",
  "crap",
  "hell",
  "bloody",
  "blowjob",
  "sod",
  "son of a bitch",
  "ๆอสัส",
  "แม่เยต",
  "แม่เยส",
  "ฆวย",
  "ฃวย",
  "ไอสั*",
  "ไอสัA",
  "ขวย",
  "ใครรวย",
  "ไอัสส",
  "ๆอัสเ",
  "ควสยไก่",
  "ขยะ",
  "หมอย",
  "แรด",
  "ตายซะ",
  "ปากหมา",
  "ไอสัตร์นรก",
  "ไอสัตว์นรก",
];

const AddAndHistory = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRecommend, setRecommend] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  console.log(user?.name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlying, setIsFlying] = useState(true);
  const [speed, setSpeed] = useState(5); // เพิ่มตัวแปร speed เพื่อควบคุมความเร็ว
  const [birdPosition, setBirdPosition] = useState({
    x: 100,
    y: 100,
    angle: 0,
  });
  const [direction, setDirection] = useState({ x: 1, y: 1 }); // กำหนดให้เป็นวัตถุเพื่อลดข้อผิดพลาด
  const [isMoving, setIsMoving] = useState(true);

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

  const handleSaveName = (name) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, name };
      // Save updated user to localStorage
      localStorage.setItem("profileUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("profileUser");
    if (!storedUser) {
      router.push("/");
    } else {
      const user = JSON.parse(storedUser);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("profileUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const email = user?.email;
      if (!email) {
        setNotification("Email not provided.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8888/api/messages",
          { email }
        );
        if (response.data.length > 0) {
          const filteredMessages = response.data.map((msg) => {
            return {
              ...msg,
              text: badWords.reduce(
                (acc, word) =>
                  acc.replace(new RegExp(`\\b${word}\\b`, "gi"), "***"),
                msg.text
              ),
            };
          });
          setMessages(filteredMessages);
        } else {
          setNotification("ไม่พบข้อความ.");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อความ:", error);
        setNotification("ใส่ข้อความที่ช่อง 👇🏻ได้เลยค่ะ ");
      }
    };

    if (user?.email) {
      fetchMessages();
    }
  }, [user]); // เพิ่ม user เป็น dependency

  const handleSave = async () => {
    const regexPattern = new RegExp(
      badWords
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|"),
      "gi"
    );

    const containsBadWords = (text) => {
      return regexPattern.test(text);
    };

    if (!message.trim()) {
      setNotification("มาแบ่งปันข้อความดีๆของคุณกัน!");
      return;
    }

    if (containsBadWords(message)) {
      setNotification(
        "ข้อความของคุณไม่น่ารักเลยนะคะ 🫵🏻 ไม่สามารถบันทึกได้ค่ะ"
      );
      return;
    }

    const email = user?.email;
    const nickName = user?.name;

    try {
      const response = await axios.post(
        "http://localhost:8888/api/saveMessage",
        { message, email, nickName }
      );

      setMessages([response.data, ...messages]);
      setMessage("");
      setNotification("บันทึกข้อความสำเร็จค่ะ");
    } catch (error) {
      console.error("Error saving message:", error);
      setNotification("ไม่สามารถบันทึกข้อความได้.");
    }
  };

  const handleNotificationClose = () => {
    setNotification("");
  };

  const indexClick = () => {
    router.push("/");
  };

  const toggleMedal = () => {
    setShowModal(!showModal);
  };

  const toggleRecommend = () => {
    setRecommend(!showRecommend);
  };

  const handleHistoryClick = (msgText) => {
    setMessage(msgText);
    setRecommend(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center  bg-cover bg-center relative"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('bg_add.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>addAndHistory</title>
        <link rel="icon" href="/11zon_cropped.jpg" />
      </Head>

      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=McLaren&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Lily+Script+One&family=McLaren&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="bird"
        onClick={handleClick}
        style={{
          position: "absolute",
          cursor: "pointer",
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
        <div className="fixed top-4 left-4 flex items-center space-x-4">
          <button className="flex items-center space-x-2">
            <div
              onClick={indexClick}
              className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-4 border-white shadow-lg"
            >
              <img
                src="/logo_web.png"
                alt="Home Icon"
                className=" transition-transform duration-500 hover:rotate-180 group-hover:text-black object-cover w-full h-full"
              />
            </div>
            <div
              onClick={indexClick}
              className="text-white text-2xl  lily-script-one-regular"
            >
              Daily Boost
            </div>
          </button>
        </div>

        <div className="fixed top-4 right-4">
          <button
            id="successButton"
            onClick={handleOpenModal}
            className="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center  mclaren-regular"
          >
            {user?.name || "Enter Your Name"}{" "}
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          email={user?.email}
          onSave={handleSaveName}
        />
      </div>

      <div className="w-full max-w-4xl p-8 flex flex-col items-center justify-center ">

      <img
          src="/Group 10.png"
          className="w-[500px] h-auto object-cover mb-3"
          alt="Group"
        />
        <div className="flex-1 text-center rounded-2xl bg-[#babbf4] p-6">

          <h1 className="text-3xl font-serif text-white prompt-regular">
            แบ่งปันข้อความดีๆ ให้กับคนที่คุณรักและห่วงใย
          </h1>
          <p className="text-white mt-3 text-xl prompt-regular">
            คุณสามารถเลือกใช้{" "}
            <button onClick={toggleRecommend}>
              <u>ข้อความแนะนำ</u>
            </button>{" "}
            ของ <strong>Daily Boost</strong> เพื่อส่งไปให้คนที่คุณรักได้
          </p>

          {showRecommend && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto border border-purple-400">
                <h2 className="text-xl text-left font-serif text-blue-500 mb-4">
                  ข้อความแนะนำ
                </h2>
                <p className="text-gray-800 font-serif mb-2">
                  เลือกข้อความที่ต้องการได้เลยค่ะ
                </p>
                <ul className="max-h-40 overflow-y-auto">
                  {[
                    "ขอให้มีความสุขในยามเช้า",
                    "ตอนเช้าที่สดใสขอให้เจอแต่เรื่องดีๆน้า",
                    "ไม่ว่าเจออะไรมาขอให้เจอสิ่งดีๆในตอนเช้าน้า",
                    "ตื่นมาเริ่มต้นวันใหม่ด้วยความสดใสและรอยยิ้มนะ!",
                    "เช้านี้รับพลังบวกเต็มๆ ไปเลยนะ ขอให้เป็นวันที่แสนดี!",
                    "เริ่มต้นวันใหม่ด้วยหัวใจที่เต็มไปด้วยความสุขนะ!",
                    "ขอให้เช้านี้เต็มไปด้วยความสดใสและกำลังใจที่ดี!",
                    "เช้านี้ดื่มกาแฟและรับความสุขในวันใหม่ไปพร้อมๆ กัน!",
                    "เช้านี้ขอให้คุณพบเจอแต่สิ่งที่ทำให้คุณยิ้มได้ทั้งวัน!",
                  ].map((msg, index) => (
                    <li
                      key={index}
                      className="p-2 mb-2 text-black bg-gray-200 rounded-lg shadow cursor-pointer hover:bg-blue-300"
                      onClick={() => handleHistoryClick(msg)}
                    >
                      {msg}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={toggleRecommend}
                  className="mt-4 px-4 py-2 text-white font-serif bg-indigo-500 rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 w-full"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 mt-5 p-5 text-center bg-white  rounded-3xl">
            <ul className="mt-4 max-h-64 overflow-y-auto scrollbar-custom">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className=" w-full  p-1 m-2  text-white bg-[#FF819A]    rounded-full shadow transition-colors  prompt-regular "
                >
                  <h2>{msg.text}</h2>
                </li>
              ))}
            </ul>
          </div>

          {notification && (
            <div className="relative bg-[#FF819A] p-1 mt-2 rounded text-white prompt-regular">
              {notification}
              <button
                className="absolute top-0 right-0 z-10 p-1 text-white rounded-full"
                onClick={handleNotificationClose}
              >
                X
              </button>
            </div>
          )}

          <div className="flex mt-2">
            <input
              className="w-full px-4 py-2 mt-1 rounded-full text-gray-700 bg-gray-100  prompt-regular "
              rows={4}
              placeholder="Message Here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            ></input>

            <button
              className="  max-w-56 px-6 py-2 m-2 text-white bg-[#FF819A]   hover:bg-[#FFB6C4] rounded-full shadow transition-colors  mclaren-regular "
              onClick={handleSave}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {/* ปุ่มที่มุมขวาล่าง */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMedal}
          className="text-gray-600 text-xl underline hover:text-gray-700 transition-colors font-serif prompt-regular"
        >
          คำแนะนำการใช้งาน
        </button>
      </div>
      {/* ป๊อปอัพสำหรับแสดงคำแนะนำการใช้งาน */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <button
              onClick={toggleMedal}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-serif text-[#FF819A] mb-4 prompt-regular">
              คำแนะนำการใช้งาน
            </h2>
            <p className="text-gray-700 font prompt-regular">
              สามารถนำข้อความของคุณใส่ตรง{" "}
              <span className="text-[#FF819A]  font-serif">
                ช่องแบ่งปันข้อความ
              </span>{" "}
              ได้เลยนะคะ มาแบ่งปันข้อความของคุณให้กับคนที่คุณรัก และ ห่วงใย
              กันค่ะ!
            </p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAndHistory;

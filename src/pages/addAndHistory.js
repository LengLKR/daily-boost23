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
        width: "100vw", // กำหนดขนาดให้ครอบคลุมเต็มหน้าจอ
        height: "100vh", // กำหนดขนาดให้ครอบคลุมเต็มหน้าจอ
        backgroundImage: "url('addAndHistory.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden", // ป้องกันนกเคลื่อนที่ออกนอกขอบเขต
      }}
    >
      <Head>
        <title>addAndHistory</title>
        <link rel="icon" href="/11zon_cropped.jpg" />
      </Head>
      <div
        className="bird"
        onClick={handleClick}
        style={{
          position: "absolute",cursor: "pointer",
          left: `${birdPosition.x}px`,
          top: `${birdPosition.y}px`,
          transform: `rotate(${birdPosition.angle}deg)`,
          width: "100px",
          height: "100px",
          backgroundImage: "url('butterfly-5707_256.gif')",
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
            <div onClick={indexClick} className="text-white font-serif">
              Daily Boost
            </div>
          </button>
        </div>
        <div className="fixed top-4 right-4">
          <button
            id="successButton"
            onClick={handleOpenModal}
            className="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {user?.name || "ตั้งชื่อของคุณได้เลย"}{" "}
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          email={user?.email}
          onSave={handleSaveName}
        />
      </div>
      <div className="w-full max-w-4xl p-8 flex flex-col items-center justify-center">
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-serif text-white">
            แบ่งปันข้อความดี ๆ ให้กับคนที่คุณรักและห่วงใย
          </h1>
          <p className="text-white mt-5 text-xl">
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

          {notification && (
            <div className="relative bg-violet-400 p-1 mt-2 rounded text-black">
              {notification}
              <button
                className="absolute top-0 right-0 z-10 p-1 text-black rounded-full"
                onClick={handleNotificationClose}
              >
                X
              </button>
            </div>
          )}

          <textarea
            className="w-3/4 max-w-lg p-4 mt-6 text-purple-300 bg-gray-800 rounded-lg resize-none"
            rows={4}
            placeholder="แบ่งปันข้อความของคุณ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
          ></textarea>

          <button
            className="mt-4 w-full max-w-56 px-6 py-2 text-white bg-indigo-500 rounded-full shadow transition-colors mx-auto hover:bg-blue-700"
            onClick={handleSave}
          >
            ส่งข้อความ
          </button>
        </div>

        {/* ประวัติข้อความ */}
        <div className="flex-1 mt-8 text-center ">
          <h1 className="text-xl font-serif text-white">ประวัติ</h1>
          <ul className="mt-4 max-h-64 overflow-y-auto scrollbar-custom">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="p-2 mb-2 text-white bg-gray-800 bg-opacity-70 rounded-lg shadow"
              >
                <p>{msg.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* ปุ่มที่มุมขวาล่าง */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMedal}
          className="text-white text-base underline hover:text-gray-300 transition-colors"
        >
          คำแนะนำการใช้งาน
        </button>
      </div>
      {/* ป๊อปอัพสำหรับแสดงคำแนะนำการใช้งาน */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-serif text-blue-500 mb-4">
              คำแนะนำการใช้งาน
            </h2>
            <p className="text-gray-700 font">
              สามารถนำข้อความของคุณใส่ตรง{" "}
              <span className="text-blue-500 font-serif">
                ช่องแบ่งปันข้อความ
              </span>{" "}
              ได้เลยนะคะ มาแบ่งปันข้อความของคุณให้กับคนที่คุณรัก และ ห่วงใย
              กันค่ะ!
            </p>
            <button
              onClick={toggleMedal}
              className="mt-4 px-4 py-2 text-white font-serif bg-blue-500 rounded-full shadow-lg hover:bg-blue-700  transition-all duration-300 transform hover:scale-105 w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAndHistory;

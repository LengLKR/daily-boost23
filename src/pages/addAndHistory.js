import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AddAndHistory = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(""); // State for notifications
  const [duplicateCount, setDuplicateCount] = useState(1); // State for duplicate count
  const [showModal, setShowModal] = useState(false);
  const [showRecommend, setRecommend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อความจาก API
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8888/api/messages");
        const filteredMessages = response.data.map((msg) => {
          return {
            ...msg,
            text: badWords.reduce(
              (acc, word) => acc.replace(new RegExp(word, "gi"), "***"),
              msg.text
            ),
          };
        });
        setMessage(filteredMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setNotification("Failed to fetch messages.");
      }
    };
    fetchMessages();
  }, []);

  const handleSave = async () => {
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
    ];

    const containsBadWords = (text) => {
      return badWords.some((word) => text.includes(word));
    };
    // Validate message before saving
    if (!message.trim()) {
      setNotification("Message cannot be empty.");
      return;
    }

    if (containsBadWords(message)) {
      setNotification(
        "Your message contains inappropriate language and cannot be saved."
      );
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8888/api/saveMessage",
        { message }
      );
  
      setMessages([response.data, ...messages]);
      setMessage(""); // Clear the textarea after saving
      setNotification("Message saved successfully.");
    } catch (error) {
      console.error("Error saving message:", error);
      setNotification("Failed to save message.");
    }
  };
  const handleNotificationClose = () => {
    setNotification(""); // Clear notification
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

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('bg_login.png')" }}
    >
      <button>
        <div className="fixed top-4 left-4 flex items-center space-x-4">
          <div
            onClick={indexClick}
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg"
          >
            <img
              src="/logohome.png"
              alt="Home Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div onClick={indexClick} className="text-white font-bold">
            Daily Boost
          </div>
        </div>
      </button>
      <div className="w-full max-w-lg p-8 ">
        <h1 className="text-2xl font-bold text-center text-white">
          แบ่งปันข้อความดี ๆ ให้กับคนที่คุณรักและห่วงใย
        </h1>
        <p className="text-center text-white mt-2">
          คุณสามารถเลือกใช้{" "}
          <button onClick={toggleRecommend}>
            <u>ข้อความแนะนำ</u>
          </button>{" "}
          ของ <strong>Daily Boost</strong> เพื่อส่งไปให้คนที่คุณรักได้
        </p>
        {notification && (
          <div className="bg-violet-400 p-2 mt-4 rounded text-black">
            {notification}
            <button
              className="ml-4 text-red-600"
              onClick={handleNotificationClose}
            >
              X
            </button>
          </div>
        )}
        <textarea
          className="w-full p-4 mt-6 text-black bg-gray-200 rounded-lg resize-none"
          rows={4}
          placeholder="แบ่งปันข้อความของคุณ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          className="mt-4 w-full px-6 py-2 text-white bg-purple-600 rounded-full shadow hover:bg-purple-700 transition-colors"
          onClick={handleSave}
        >
          ส่งข้อความ
        </button>

        <h1 className=" text-sm font-bold mt-8 text-center text-white">
          ประวัติข้อความ
        </h1>
        <ul className="mt-4 max-h-64 overflow-y-auto">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="border p-2 mb-2 bg-white bg-opacity-70 rounded-lg shadow"
            >
              <p>{msg.text}</p>{" "}
            </li>
          ))}
        </ul>
        {/* ปุ่มที่มุมขวาล่าง */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleMedal}
            className="text-white text-sm underline hover:text-gray-300 transition-colors"
          >
            คำแนะนำการใช้งาน
          </button>
        </div>
        {/* ป๊อปอัพสำหรับแสดงคำแนะนำการใช้งาน */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <h2 className="text-lg font-bold mb-4">คำแนะนำการใช้งาน</h2>
              <p className="text-gray-700">
                นี่คือคำแนะนำในการใช้งานของแอปพลิเคชันนี้...
              </p>
              <button
                onClick={toggleMedal}
                className="mt-4 px-4 py-2 text-white font-bold bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors w-full"
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAndHistory;

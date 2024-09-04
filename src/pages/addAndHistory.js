import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AddAndHistory = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(""); // State for notifications
  const [showModal, setShowModal] = useState(false);
  const [showRecommend, setRecommend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8888/api/messages");
        if (response.data.length > 0) {
          const filteredMessages = response.data.map((msg) => {
            return {
              ...msg,
              text: badWords.reduce(
                (acc, word) => acc.replace(new RegExp(word, "gi"), "***"),
                msg.text
              ),
            };
          });
          setMessages(filteredMessages);
        } else {
          setNotification("No messages found.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setNotification("");
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
      "ขว$ย",
      "vตวu[[y6i",
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
      "ไอสั*","ไอสัA"
    ];

    //Regular Expression จากคำหยาบ
    const regexPattern = new RegExp(
      badWords
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|"),
      "gi"
    );

    const containsBadWords = (text) => {
      return regexPattern.test(text);
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
          <div onClick={indexClick} className="text-white font-serif">
            Daily Boost
          </div>
        </div>
      </button>
      <div className="w-full max-w-4xl p-8 flex">
        {/* ฟอร์มแบ่งปันข้อความ */}
        <div className="flex-1">
          <h1 className="text-2xl font-serif text-center text-white">
            แบ่งปันข้อความดี ๆ ให้กับคนที่คุณรักและห่วงใย
          </h1>
          <p className="text-center text-white mt-2">
            คุณสามารถเลือกใช้{" "}
            <button onClick={toggleRecommend}>
              <u>ข้อความแนะนำ</u>
            </button>{" "}
            ของ <strong>Daily Boost</strong> เพื่อส่งไปให้คนที่คุณรักได้
          </p>

          {showRecommend && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-lg font-serif mb-4">ข้อความแนะนำ</h2>
                <p className="text-gray-700 ">
                  นี่คือตัวอย่างข้อความที่คุณสามารถใช้ส่งไปให้คนที่คุณรักได้...
                </p>
                <button
                  onClick={toggleRecommend}
                  className="mt-4 px-4 py-2 text-white font-serif bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors w-full"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
          {notification && (
            <div className="bg-violet-400 p-2 mt-4 rounded text-black">
              {notification}
              <button
                className="ml-4 text-white"
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
        </div>

        {/* ประวัติข้อความ */}
        <div className="flex-1 ml-24">
          <h1 className="text-2xl font-serif mt-8 text-center text-white">
            ประวัติข้อความ
          </h1>
          <ul className="mt-4 max-h-64 overflow-y-auto">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="border p-2 mb-2 bg-white bg-opacity-70 rounded-lg shadow"
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
            <h2 className="text-lg font-serif mb-4">คำแนะนำการใช้งาน</h2>
            <p className="text-gray-700">
              นี่คือคำแนะนำในการใช้งานของแอปพลิเคชันนี้...
            </p>
            <button
              onClick={toggleMedal}
              className="mt-4 px-4 py-2 text-white font-serif bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors w-full"
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

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
  console.log(messages);

  const handleSave = async () => {
    // Validate message before saving
    if (!message.trim()) {
      setNotification("Message cannot be empty.");
      return;
    }

    try {
      await axios.post("http://localhost:8888/api/saveMessage", { message });
      setMessage(""); // Clear the textarea after saving
      setNotification("Message saved successfully.");
    } catch (error) {
      console.error("Error saving message:", error);
      setNotification("Failed to save message.");
    }
  };
  const handleDuplicate = async (msg) => {
    const newMessages = [];
    for (let i = 0; i < duplicateCount; i++) {
      const newMessage = `${msg.text} (Duplicate ${i + 1})`;
      newMessages.push(newMessage);
    }

    try {
      for (const newMessage of newMessages) {
        await fetch("/api/saveMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: newMessage }),
        });
      }
      setMessages([
        ...messages,
        ...newMessages.map((text, index) => ({ id: Date.now() + index, text })),
      ]); // Update state with new messages
      setNotification(`Message duplicated ${duplicateCount} time(s).`);
    } catch (error) {
      console.error("Error duplicating message:", error);
      setNotification("Failed to duplicate message.");
    }
  };

  const handleNotificationClose = () => {
    setNotification(""); // Clear notification
  };

  const indexClick = () => {
    router.push("/");
  };
  7;
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
          คุณสามารถเลือกใช้{/*ปุ่มสำหรับแสดงข้อความแนะนำ */}{" "}
          <button onClick={toggleRecommend}>
            <u>ข้อความแนะนำ</u>
          </button>{" "}
          {/*ป๊อปอัพสำหรับข้อความแนะนำ */}
          {showRecommend && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">ข้อความแนะนำ</h2>
                <p className="text-gray-700">
                  นี่คือข้อความแนะนำที่คุณสามารถใช้ในการใช้งานแอปพลิเคชันนี้...
                </p>
                <button
                  onClick={toggleRecommend}
                  className="mt-4 px-4 py-2 text-white font-bold bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors w-full"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
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
              <p>{msg.text}</p>
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  className="mr-2 p-1 border border-gray-300 rounded w-16"
                  value={duplicateCount}
                  min="1"
                  onChange={(e) => setDuplicateCount(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleDuplicate(msg)}
                >
                  Duplicate
                </button>
              </div>
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

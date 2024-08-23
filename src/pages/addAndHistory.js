import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const AddAndHistory = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(""); // State for notifications
  const [duplicateCount, setDuplicateCount] = useState(1); // State for duplicate count
  const router = useRouter();

  useEffect(() => {
    // Fetch previous messages from API
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setNotification("Failed to fetch messages.");
      }
    };
    fetchMessages();
  }, []);

  const handleSave = async () => {
    // Validate message before saving
    if (!message.trim()) {
      setNotification("Message cannot be empty.");
      return;
    }

    try {
      await fetch("/api/saveMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
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
      setMessages([...messages, ...newMessages.map((text, index) => ({ id: Date.now() + index, text }))]); // Update state with new messages
      setNotification(`Message duplicated ${duplicateCount} time(s).`);
    } catch (error) {
      console.error("Error duplicating message:", error);
      setNotification("Failed to duplicate message.");
    }
  };

  const handleNotificationClose = () => {
    setNotification(""); // Clear notification
  };

  // Function to send messages via Line Chatbot
  const sendLineMessage = async () => {
    if (!message.trim()) {
      setNotification("Cannot send an empty message via Line Chatbot.");
      return;
    }

    try {
      await fetch("/api/sendLineMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      setNotification("Message sent via Line Chatbot successfully.");
    } catch (error) {
      console.error("Error sending message via Line Chatbot: ", error);
      setNotification("Failed to send message via Line Chatbot.");
    }
  };

  useEffect(() => {
    // Send messages every 7:00 AM
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      7,
      0,
      0
    );
    if (now < targetTime) {
      const timeToWait = targetTime - now;
      const timer = setTimeout(() => {
        sendLineMessage();
        setInterval(sendLineMessage, 24 * 60 * 60 * 1000); // Repeat daily
      }, timeToWait);
      return () => clearTimeout(timer);
    } else {
      sendLineMessage();
      setInterval(sendLineMessage, 24 * 60 * 60 * 1000);
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('bg_login.png')" }}
    >
      <div className="w-full max-w-lg p-8 ">
        <h1 className="text-2xl font-bold text-center text-white">แบ่งปันข้อความดี ๆ ให้กับคนที่คุณรักและห่วงใย</h1>
        <p className="text-center text-white mt-2">
          คุณสามารถเลือกใช้ <u>ข้อความแนะนำ</u> ของ <strong>Daily Boost</strong> เพื่อส่งไปให้คนที่คุณรักได้
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

        <h1 className=" text-sm font-bold mt-8 text-center text-white">ประวัติข้อความ</h1>
        <ul className="mt-4 max-h-64 overflow-y-auto">
          {messages.map((msg) => (
            <li key={msg.id} className="border p-2 mb-2 bg-white bg-opacity-70 rounded-lg shadow">
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
      </div>
    </div>
  );
};

export default AddAndHistory;

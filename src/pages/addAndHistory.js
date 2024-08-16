import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const MessagePage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // เรียก API เพื่อดึงข้อความที่เคยส่งของผู้ใช้
    const fetchMessages = async () => {
      try {
        // เปลี่ยน URL เป็น API ของคุณ
        const response = await fetch("/api/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const handleSave = async () => {
    // เรียก API เพื่อบันทึกข้อความ
    try {
      await fetch("/api/saveMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      console.log("Message saved:", message);
      setMessage(""); // Clear the textarea after saving
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleDuplicate = async (msg) => {
    const newMessage = `${msg.text} (Duplicate)`; // Duplicate message logic
    try {
      await fetch("/api/saveMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      setMessages([...messages, { id: Date.now(), text: newMessage }]); // Update state with new message
    } catch (error) {
      console.error("Error duplicating message:", error);
    }
  };

  // Function to send messages via Line Chatbot
  const sendLineMessage = async () => {
    try {
      await fetch("/api/sendLineMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        bady: JSON.stringify({ message: "Your scheduled message" }),
      });
    } catch (error) {
      console.error("Error sending message via Line Chatbot: ", error);
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
        // Repeat daily
        setInterval(sendLineMessage, 24 * 60 * 60 * 1000);
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
      <h1 className="text-2xl font-bold">Add/Edit Message</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mt-4"
        rows={4}
        placeholder="Enter your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSave}
      >
        Save
      </button>

      <h1 className="text-2xl font-bold mt-8">Message History</h1>
      <ul className="mt-4">
        {messages.map((msg) => (
          <li key={msg.id} className="border p-2 mb-2">
            <p>{msg.text}</p>
            <button
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => handleDuplicate(msg)}
            >
              Duplicate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagePage;

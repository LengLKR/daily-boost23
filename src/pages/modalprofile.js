import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./google"; // นำเข้าการตั้งค่า Firebase ของคุณ

const Modal = ({ isOpen, onClose, email }) => {
  const [formData, setFormData] = useState({
 
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // การตรวจสอบข้อมูลพื้นฐาน
    if (!email || !formData.name) {
      alert("กรุณากรอกอีเมลและชื่อ");
      return;
    }

    try {
      // ค้นหาผู้ใช้ที่มีอีเมลตรงกัน
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("ไม่พบผู้ใช้ที่มีอีเมลนี้");
        return;
      }

      // บันทึกข้อมูลผู้ใช้ลงใน Firestore
      querySnapshot.forEach(async (docSnapshot) => {
        const userDocRef = doc(db, "users", docSnapshot.id);
        await updateDoc(
          userDocRef,
          {
            name: formData.name,
            email: email,
            // คุณอาจต้องการเพิ่มข้อมูลอื่น ๆ ที่นี่
          },
          { merge: true }
        ); // ใช้ merge: true เพื่อไม่ลบข้อมูลที่มีอยู่
      });

      // ดำเนินการเมื่อสำเร็จ
      console.log("ข้อมูลถูกบันทึกเรียบร้อยแล้ว:", formData);
      onClose();
    } catch (error) {
      alert("การบันทึกข้อมูลล้มเหลว: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg z-10">
        <button
          type="button"
          className="absolute top-2.5 right-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5"
          onClick={onClose}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium text-center text-gray-900 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-sm font-medium text-center text-gray-900 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

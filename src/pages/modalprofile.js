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
import { db } from "./google"; 

const Modal = ({ isOpen, onClose, email, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  console.log(email);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !formData.name) {
      alert("กรุณากรอกอีเมลและชื่อ");
      return;
    }

    try {
      // ค้นหาผู้ใช้ที่มีอีเมลตรงกันในคอลเลคชัน users
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("ไม่พบผู้ใช้ที่มีอีเมลนี้");
        return;
      }

      // อัพเดทข้อมูลผู้ใช้ในคอลเลคชัน users
      const userDocRefs = [];
      querySnapshot.forEach((docSnapshot) => {
        const userDocRef = doc(db, "users", docSnapshot.id);
        userDocRefs.push(userDocRef);
      });

      await Promise.all(
        userDocRefs.map(async (userDocRef) => {
          await updateDoc(
            userDocRef,
            {
              name: formData.name, // ใช้ชื่อฟิลด์ name ใน users
              email: email,
            },
            { merge: true }
          );
        })
      );

      // อัพเดทข้อมูลใน messages
      const nickName = formData?.name;
      if (nickName) {
        const messagesCollection = collection(db, "messages");
        const messageQuery = query(
          messagesCollection,
          where("email", "==", email)
        );
        const messageSnapshot = await getDocs(messageQuery);

        if (!messageSnapshot.empty) {
          const messageDocRefs = [];
          messageSnapshot.forEach((docSnapshot) => {
            const messageDocRef = doc(db, "messages", docSnapshot.id);
            messageDocRefs.push(messageDocRef);
          });

          await Promise.all(
            messageDocRefs.map(async (messageDocRef) => {
              await updateDoc(
                messageDocRef,
                {
                  nickName: formData.name, // ใช้ชื่อฟิลด์ nickName ใน messages
                },
                { merge: true }
              );
            })
          );
        }
      }

      console.log("ข้อมูลถูกบันทึกเรียบร้อยแล้ว:", formData);
      onSave(formData.name); // เรียก onSave เพื่อส่งชื่อที่อัปเดตกลับไปยัง parent component
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
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
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

import { db } from "./google"; // นำเข้า db จากไฟล์ที่คุณตั้งค่า Firebase
import { collection, addDoc } from "firebase/firestore";

// สร้างฟังก์ชันและทำการ export
export const sendDataToFirestore = async (data) => {
  console.log("testsetset");
  try {
    // ระบุชื่อ collection ที่ต้องการส่งข้อมูลไป
    const docRef = await addDoc(collection(db, "565555"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

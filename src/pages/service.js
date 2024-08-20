import { db, firestore } from "./google"; // นำเข้า db จากไฟล์ที่คุณตั้งค่า Firebase
import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// สร้างฟังก์ชันและทำการ export
export const sendDataToFirestore = async (data) => {
  console.log("testsetset");
  try {
    // ระบุชื่อ collection ที่ต้องการส่งข้อมูลไป
    const docRef = await addDoc(collection(db, "user"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const verifyUsers = async (email, password) => {
  try {
    const docRef = doc(firestore, "user", email); // อ้างอิงไปยัง document ที่ใช้ email เป็น key
    const docSnap = await getDoc(docRef);
    console.log(docRef);
    console.log(docSnap);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.password === password) {
        console.log("User verified:", userData);
        return userData; // Return ข้อมูลผู้ใช้เมื่อการตรวจสอบสำเร็จ
      } else {
        console.error("Incorrect password");
        return null; // Return null ถ้ารหัสผ่านไม่ถูกต้อง
      }
    } else {
      console.error("No such user found");
      return null; // Return null ถ้าไม่พบผู้ใช้
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return null; // Return null ในกรณีที่เกิดข้อผิดพลาด
  }
};

export const getUserByEmailAndPassword = async (email, password) => {
  try {
    const emailString = email.toString();

    // สร้าง query เพื่อค้นหาเอกสารที่มี email ตรงกัน
    const q = query(
      collection(db, "user"), // ใช้ Firestore instance ที่ import มา
      where("email", "==", emailString)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // ตรวจสอบว่ารหัสผ่านตรงกับค่าที่ส่งเข้ามาหรือไม่
      if (userData.password === password) {
        console.log("User verified:", userData);
        return userData; // Return ข้อมูลของผู้ใช้เมื่อการตรวจสอบสำเร็จ
      } else {
        console.error("Incorrect password");
        return null; // Return null ถ้ารหัสผ่านไม่ตรง
      }
    } else {
      console.error("No user found with the provided email");
      return null; // Return null ถ้าไม่พบผู้ใช้
    }
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null; // Return null ในกรณีที่เกิดข้อผิดพลาด
  }
};

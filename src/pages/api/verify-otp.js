import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLTENT_EMAIL,
      privetKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const auth = admin.auth();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phoneNumber, code } = req.body;
    res.status(200).json({ message: "OTP verified Successfully" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

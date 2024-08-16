import React from "react";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRCodeComponent = () => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = "https://line.me/R/ti/p/@686bymtt";
        const qrCode = await QRCode.toDataURL(url);
        setSrc(qrCode);
      } catch (error) {
        console.error("Error generating QR Code", error);
      }
    };

    generateQRCode();
  }, []);

  return <div>{src && <img src={src} alt="QR Code" />}</div>;
};

export default QRCodeComponent;

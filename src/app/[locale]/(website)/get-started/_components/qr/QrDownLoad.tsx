"use client";

import QRCodeStyling from "qr-code-styling";

import { Button } from "@/components/ui/button";
import {  Download } from "lucide-react";

import { BusinessExtended } from "@/types";

import JSZip from "jszip";
import { useTranslations } from "next-intl";

export default function QrDownLoad({
  qrCode,
  business,
  text
}: {
  qrCode: QRCodeStyling | null;
  text:string
  business: BusinessExtended;
}) {
  const t = useTranslations("qr settings");
  if (!qrCode) return null;

  const downloadQR = async () => {
    const tempQRCode = new QRCodeStyling({
      ...qrCode._options,
      data: qrCode._options.data + "?table=" + text,
    });
  
    const qrBlob = await tempQRCode.getRawData("png");
  
    let qrImageBlob: Blob;
  
    if (qrBlob instanceof Buffer) {
      qrImageBlob = new Blob([qrBlob], { type: "image/png" });
    } else if (qrBlob instanceof Blob) {
      qrImageBlob = qrBlob;
    } else {
      console.error("Unexpected QR data format");
      return;
    }
  
    const qrImage = new Image();
    const qrURL = URL.createObjectURL(qrImageBlob);
  
    qrImage.src = qrURL;
    await new Promise((resolve) => (qrImage.onload = resolve));
  
    const qrSize = 300;
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    canvas.width = qrSize;
    canvas.height = qrSize;

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

    // Add table number text
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = qrCode._options.dotsOptions.color;
    ctx.textAlign = "left";
    ctx.fillText(text, 5, canvas.height - 5, (canvas.width * 3) / 4); // Position text
  
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `scanby_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, "image/png");
  };
  

  const downloadMultipleQRAsZip = async () => {
    if (!business.tables || !qrCode) return;
  
    const tables = business.tables.split(",");
    const zip = new JSZip();
  
    for (let t of tables) {
      const tempQRCode = new QRCodeStyling({
        ...qrCode._options,
        data: qrCode._options.data + "?table=" + t,
      });
  
      let qrData = await tempQRCode.getRawData("png");
  
      // ✅ Fix: Convert Buffer to Blob if needed
      if (qrData instanceof Buffer) {
        qrData = new Blob([qrData], { type: "image/png" });
      }
  
      if (!(qrData instanceof Blob)) continue; // Skip if not a valid image
  
      // Convert Blob to Image
      const qrImage = new Image();
      const qrURL = URL.createObjectURL(qrData);
  
      qrImage.src = qrURL;
      await new Promise((resolve) => (qrImage.onload = resolve));
  
      // Create new canvas (QR size + space for text)
      const qrSize = 300;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
  
      canvas.width = qrSize;
      canvas.height = qrSize;
  
      // Draw QR code
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
  
      // Add table number text
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = qrCode._options.dotsOptions.color;
      ctx.textAlign = "right";
      ctx.fillText(t, qrSize - 10, qrSize-5 );
      ctx.textAlign = "left";
      ctx.fillText(text, 5, canvas.height - 5, (canvas.width * 3) / 4); // Position text
  
      // Convert to PNG data URL
      const dataURL = canvas.toDataURL("image/png").split(",")[1];
      zip.file(`qr-table-${t}.png`, dataURL, { base64: true });
  
      URL.revokeObjectURL(qrURL); // Clean up memory
    }
  
    // Generate and download ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "qrcodes.zip";
      link.click();
    });
  };
  // const downloadMultipleQRAsZip = async () => {
  //   console.log(business.tables)
  //   const qrDataPromises = business.tables?.split(",").map((t) =>
  //     new QRCodeStyling({
  //       ...qrCode._options,
  //       data: qrCode._options.data + "?table=" + t,
  //     }).getRawData("png")
  //   );
  //   if (qrDataPromises) {
  //     const qrDataURLs = await Promise.all(qrDataPromises);

  //     const zip = new JSZip();
  //     qrDataURLs.forEach((dataURL, index) => {
  //       if (dataURL) zip.file(`qr-${index + 1}.png`, dataURL, { base64: true });
  //     });

  //     zip.generateAsync({ type: "blob" }).then((content) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(content);
  //       link.download = "qrcodes.zip";
  //       link.click();
  //     });
  //   }
  // };
  return (
    <div>
      <Button type="button" onClick={business.product==="SMART_QR_MENU"?downloadMultipleQRAsZip:downloadQR} className="w-full">
        {t("download")} <Download />
      </Button>
    </div>
  );
}

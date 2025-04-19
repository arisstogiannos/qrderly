"use client";
import QrDownLoad from "@/app/[locale]/(website)/get-started/_components/qr/QrDownLoad";
import { BusinessExtended } from "@/types";
import QRCodeStyling, { DotType, Options } from "qr-code-styling";
import React, { useEffect, useRef, useState } from "react";

export default function QrDisplay({
  business,
}: {
  business: BusinessExtended;
}) {
  const qr = business.qr;
  const qrRef = useRef<HTMLDivElement | null>(null);

  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  const qrOptions = JSON.parse(qr?.qrOptions??"") as Options;

  useEffect(() => {
    const qr = new QRCodeStyling({ ...qrOptions, width: 200, height: 200 });
    setQrCode(qr);
  }, []);

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = ""; // Clear old QR code
      qrCode.append(qrRef.current);

      // Wait for the QR code to be generated
      setTimeout(() => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 300 - 15, canvas.width, canvas.height + 40);
        canvas.style.backgroundColor =
          qrOptions.backgroundOptions?.color ?? "#fff";
        // Add text to the canvas

        // canvas.style.borderRadius="40px"

        ctx.font = "bold 14px Arial";
        ctx.fillStyle = qrOptions.dotsOptions?.color ?? "#000"; // Text color
        if (business.product === "SMART_QR_MENU") {
          ctx.textAlign = "right";
          ctx.fillText("table", canvas.width - 5, canvas.height - 3); // Position text
        }
        ctx.textAlign = "left";
        ctx.fillText(qr?.text??"", 5, canvas.height - 3, (canvas.width * 3) / 4); // Position text
      }, 100);
    }
  }, [qrCode, business]);
  return (
    <div className="w-full space-y-4">
      <div ref={qrRef} className="relative max-w-52 max-h-52"></div>
      <div className="mt-auto">
        <QrDownLoad business={business} qrCode={qrCode} text="" />
      </div>
    </div>
  );
}

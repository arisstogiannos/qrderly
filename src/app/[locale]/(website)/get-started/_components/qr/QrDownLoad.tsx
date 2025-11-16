'use client';

import JSZip from 'jszip';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import QRCodeStyling from 'qr-code-styling';
import { useState } from 'react';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { encryptTable } from '@/lib/table-crypt';
import type { BusinessExtended } from '@/types';
export default function QrDownLoad({
  qrCode,
  business,
  text,
}: {
  qrCode: QRCodeStyling | null;
  text: string;
  business: BusinessExtended;
}) {
  const t = useTranslations('qr settings');
  const [isDownloading, setIsDownloading] = useState(false);
  if (!qrCode) return null;

  const downloadQR = async () => {
    setIsDownloading(true);
    const encryptedTableId = await encryptTable(`self-service|${business.name}`); // Encrypt table ID
    const tempQRCode = new QRCodeStyling({
      ...qrCode._options,
      data: `${qrCode._options.data}?table=${encryptedTableId}`,
      height: 3000,
      width: 3000,
      margin: 200,
    });

    const qrBlob = await tempQRCode.getRawData('png');

    let qrImageBlob: Blob;

    if (qrBlob instanceof Buffer) {
      qrImageBlob = new Blob([new Uint8Array(qrBlob)], { type: 'image/png' });
    } else if (qrBlob instanceof Blob) {
      qrImageBlob = qrBlob;
    } else {
      console.error('Unexpected QR data format');
      return;
    }

    const qrImage = new Image();
    const qrURL = URL.createObjectURL(qrImageBlob);

    qrImage.src = qrURL;
    await new Promise((resolve) => {
      qrImage.onload = resolve;
    });

    const qrSize = 3000;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = qrSize;
    canvas.height = qrSize + 300;

    // Create rounded corners
    const radius = 200;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = qrCode._options.backgroundOptions.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

    // Add table number text
    ctx.font = 'bold 250px Arial';
    ctx.fillStyle = qrCode._options.dotsOptions.color;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height - 180); // Center text horizontally

    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'scanby_qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 'image/png');
    setIsDownloading(false);
  };

  //c2VsZi1zZXJ2aWNlOmJkZjFiNmRhMTgyZDhmZDMzN2E1MGNkYmM1ODRjMWRhMDYyYzA5OGJhOWQ2NzQ0NWQ0NTViZGE2ZjM5MWI5OWY

  const downloadMultipleQRAsZip = async () => {
    if (!business.tables || !qrCode) return;
    setIsDownloading(true);
    const tables = business.tables.split(',');
    const zip = new JSZip();

    for (const t of tables) {
      const encryptedTableId = await encryptTable(`${t}|${business.name}`); // Encrypt table ID
      const tempQRCode = new QRCodeStyling({
        ...qrCode._options,
        data: `${qrCode._options.data}?table=${encryptedTableId}`,
        height: 3000,
        width: 3000,
        margin: 200,
      });

      let qrData = await tempQRCode.getRawData('png');

      // ✅ Fix: Convert Buffer to Blob if needed
      if (qrData instanceof Buffer) {
        qrData = new Blob([new Uint8Array(qrData)], { type: 'image/png' });
      }

      if (!(qrData instanceof Blob)) continue; // Skip if not a valid image

      // Convert Blob to Image
      const qrImage = new Image();
      const qrURL = URL.createObjectURL(qrData);

      qrImage.src = qrURL;
      await new Promise((resolve) => {
        qrImage.onload = resolve;
      });

      // Create new canvas (QR size + space for text)
      const qrSize = 3000;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      canvas.width = qrSize;
      canvas.height = qrSize + 300;

      // Create rounded corners
      const radius = 200;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = qrCode._options.backgroundOptions.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

      // Add table number text
      ctx.fillStyle = qrCode._options.dotsOptions.color;
      ctx.textAlign = 'right';
      ctx.font = 'bold 100px Arial';
      ctx.fillText(t, canvas.width - 100, canvas.height - 100); // Center text horizontally
      ctx.textAlign = 'center';
      ctx.font = 'bold 250px Arial';
      ctx.fillText(text, canvas.width / 2, canvas.height - 180); // Center text horizontally

      // Convert to PNG data URL
      const dataURL = canvas.toDataURL('image/png').split(',')[1];
      zip.file(`qr-table-${t}.png`, dataURL, { base64: true });

      URL.revokeObjectURL(qrURL); // Clean up memory
    }

    // Generate and download ZIP
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'qrcodes.zip';
      link.click();
    });
    setIsDownloading(false);
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
    <Button
      type="button"
      disabled={isDownloading}
      onClick={business.product === 'SMART_QR_MENU' ? downloadMultipleQRAsZip : downloadQR}
      className="w-full"
    >
      {isDownloading ? (
        <Loader />
      ) : (
        <>
          {t('download')} <Download />
        </>
      )}
    </Button>
  );
}

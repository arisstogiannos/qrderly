'use client'; // Make this a client component

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QrDownloadButton({ qrImageSrc }: { qrImageSrc: string }) {
  function download() {
    if (typeof window === 'undefined') return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous'; // Prevent CORS issues if loading external images
    img.src = qrImageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const padding = 40; // Extra space for text
      canvas.width = img.width;
      canvas.height = img.height + padding;

      // **1. Fill background with white**
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // **2. Draw the QR code**
      ctx.drawImage(img, 0, 0);

      // **3. Add text at the bottom**
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'right';
      ctx.fillText('Scan Me!', canvas.width - 10, canvas.height - 10);

      // **4. Convert canvas to PNG and trigger download**
      const finalImage = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = finalImage;
      link.download = 'qr_code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  return (
    <Button className="w-full" onClick={download}>
      Download <Download />
    </Button>
  );
}

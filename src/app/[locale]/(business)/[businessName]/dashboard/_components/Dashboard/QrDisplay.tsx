'use client';
import QRCodeStyling, { type Options } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import QrDownLoad from '@/app/[locale]/(website)/get-started/_components/qr/QrDownLoad';
import { encryptTable } from '@/lib/table-crypt';
import type { BusinessExtended } from '@/types';

export default function QrDisplay({ business }: { business: BusinessExtended }) {
  const qr = business.qr;
  const qrRef = useRef<HTMLDivElement | null>(null);

  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [encodedAdminTableId, setEncodedAdminTableId] = useState('');

  const qrOptions = JSON.parse(qr?.qrOptions ?? '') as Options;

  useEffect(() => {
    async function encryptAdmin() {
      const encryptedTable = await encryptTable(`admin|${business.name}`);
      if (encryptedTable && encodedAdminTableId === '') {
        setEncodedAdminTableId(encryptedTable);
      }
    }
    encryptAdmin();
    const qr = new QRCodeStyling({
      ...qrOptions,
      data: `${qrOptions.data}?table=${encodedAdminTableId}`,
      width: 230,
      height: 230,
    });
    setQrCode(qr);
  }, [encodedAdminTableId]);

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = ''; // Clear old QR code
      qrCode.append(qrRef.current);

      // Wait for the QR code to be generated
      setTimeout(() => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 300 - 15, canvas.width, canvas.height + 40);
        canvas.style.backgroundColor = qrOptions.backgroundOptions?.color ?? '#fff';
        // Add text to the canvas

        canvas.style.borderRadius = '20px';
      }, 100);
    }
  }, [qrCode, business]);
  return (
    <div className="w-full space-y-4">
      <div
        style={{ backgroundColor: qrOptions.backgroundOptions?.color }}
        className=" h-[250px] relative rounded-xl overflow-hidden w-fit drop-shadow-lg"
      >
        <div ref={qrRef} className=" inline-block " />
        <span
          style={{ color: qrOptions.dotsOptions?.color }}
          className="absolute -translate-x-1/2 left-1/2 bottom-2 font-bold text-xl max-w-5/6  text-nowrap "
        >
          {qr?.text}
        </span>
      </div>
      <div className="mt-auto">
        <QrDownLoad
          business={business}
          qrCode={qrCode}
          text={business.qr?.text ?? 'Scan For Menu'}
        />
      </div>
    </div>
  );
}

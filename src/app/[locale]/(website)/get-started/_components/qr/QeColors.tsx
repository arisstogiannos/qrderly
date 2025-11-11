import { useTranslations } from 'next-intl';
import type React from 'react';
import { useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function QeColors({
  setBgColor,
  setDotColor,
  dotColor,
  bgColor,
}: {
  dotColor: string;
  bgColor: string;
  setDotColor: (v: string) => void;
  setBgColor: (v: string) => void;
}) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('qr settings');

  const handleDotColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDotColor(newColor);
    }, 200); // Adjust debounce time as needed
  }, []);

  const handleBgColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setBgColor(newColor);
    }, 200); // Adjust debounce time as needed
  }, []);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="dotColor">{t('colors')}</Label>
        <Input
          name="dotColor"
          id="dotColor"
          type="color"
          value={dotColor}
          className="w-20"
          onChange={handleDotColorChange}
        />
      </div>
      <div className="space-y-2 mt-auto">
        <Input
          name="bgColor"
          id="bgColor"
          type="color"
          value={bgColor}
          className="w-20"
          onChange={handleBgColorChange}
        />
      </div>
    </>
  );
}

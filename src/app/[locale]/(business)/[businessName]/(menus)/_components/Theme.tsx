'use client'; // Mark this as a client component

import { useLayoutEffect } from 'react';

export default function Theme({ theme }: { theme: string }) {
  useLayoutEffect(() => {
    const root = document.querySelector(':root') as HTMLElement;
    const colors = theme.split(',');
    if (root) {
      root.style.setProperty('--background', colors[0]);
      root.style.setProperty('--foreground', colors[3]);
      root.style.setProperty('--primary', colors[2]);
      root.style.setProperty('--secondary', colors[1]);
      root.style.setProperty('--accent', colors[4]);
    }
  }, []);

  return null;
}

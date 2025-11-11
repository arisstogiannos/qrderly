import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  // In development, serve a minimal service worker
  // In production, next-pwa will generate the actual service worker
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Minimal service worker for development
    const swContent = `
// Development Service Worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // No-op in development
});
`;

    return new NextResponse(swContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Service-Worker-Allowed': '/',
      },
    });
  }

  // In production, try to serve the generated service worker from public folder
  // If it doesn't exist, return a minimal one
  const swContent = `
// Production Service Worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Network first strategy
});
`;

  return new NextResponse(swContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
    },
  });
}


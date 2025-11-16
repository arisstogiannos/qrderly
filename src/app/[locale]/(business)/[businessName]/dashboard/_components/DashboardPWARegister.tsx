'use client';

import { useEffect } from 'react';

function getDashboardScope(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  const { pathname } = window.location;
  const dashboardMatch =
    decodeURIComponent(pathname).match(/^\/[^/]+\/[^/]+\/dashboard/) ||
    decodeURIComponent(pathname).match(/^\/[^/]+\/[^/]+\/πίνακας ελέγχου/);

  console.log('dashboardMatch', dashboardMatch);

  if (!dashboardMatch) {
    return '/';
  }

  return `${dashboardMatch[0]}/`;
}

async function registerDashboardServiceWorker(scope: string): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const isSecureContext =
    window.location.protocol === 'https:' || window.location.hostname === 'localhost';

  if (!isSecureContext) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/dashboard-sw.js', { scope });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker registered successfully', registration);
    }
  } catch (error) {
    console.error('Dashboard PWA registration failed', error);
  }
}

export function DashboardPWARegister(): null {
  useEffect(() => {
    const scope = getDashboardScope();

    registerDashboardServiceWorker(scope);
  }, []);

  return null;
}

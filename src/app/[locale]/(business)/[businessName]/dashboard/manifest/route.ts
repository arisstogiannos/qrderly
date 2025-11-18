import type { MetadataRoute } from 'next';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{
    businessName: string;
    locale: string;
  }>;
};

function getLocalizedName(locale: string): { name: string; shortName: string } {
  if (locale === 'el') {
    return {
      name: 'Scanby Πίνακας Ελέγχου',
      shortName: 'Scanby Admin',
    };
  }

  return {
    name: 'Scanby Dashboard',
    shortName: 'Scanby Admin',
  };
}

export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { businessName, locale } = await params;
  const normalizedBusinessName = businessName ?? '';
  const normalizedLocale = locale ?? 'en';
  const { name, shortName } = getLocalizedName(normalizedLocale);

  const manifest: MetadataRoute.Manifest = {
    name,
    short_name: shortName,
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    description: 'Manage your Scanby menu, orders, and QR settings from anywhere.',
    start_url: `/${normalizedLocale}/${normalizedBusinessName}/dashboard?source=pwa`,
    scope: `/${normalizedLocale}/${normalizedBusinessName}/dashboard`,
    orientation: 'portrait-primary',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/logo black.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}

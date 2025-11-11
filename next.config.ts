import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import nextPwa from 'next-pwa';

type UrlMatcherContext = {
  url: URL;
};

function isDashboardRequest({ url }: UrlMatcherContext): boolean {
  return /\/dashboard(\/|$)/.test(url.pathname);
}

function isNextStaticAsset({ url }: UrlMatcherContext): boolean {
  return url.pathname.startsWith('/_next/static/');
}

function isNextImage({ url }: UrlMatcherContext): boolean {
  return url.pathname.startsWith('/_next/image');
}

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  serverExternalPackages: [
    '@libsql/client',
    '@prisma/adapter-libsql',
    '@prisma/client',
    'prettier',
  ],
  async rewrites() {
    return [
      {
        source: '/:locale/:businessName/dashboard/manifest.webmanifest',
        destination: '/:locale/:businessName/dashboard/manifest',
      },
    ];
  },
};

const withPWA = nextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false,
  sw: 'dashboard-sw.js',
  scope: '/',
  skipWaiting: true,
  clientsClaim: true,
  dynamicStartUrl: true,
  runtimeCaching: [
    {
      urlPattern: isDashboardRequest,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dashboard-data',
        networkTimeoutSeconds: 4,
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
    {
      urlPattern: isNextStaticAsset,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'dashboard-static-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
    {
      urlPattern: isNextImage,
      handler: 'CacheFirst',
      options: {
        cacheName: 'dashboard-images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
});

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withPWA(nextConfig));

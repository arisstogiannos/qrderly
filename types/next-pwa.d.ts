import type { NextConfig } from 'next';

type CachingHandler = 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RuntimeCachingCallbackContext = {
  url: URL;
};

type RuntimeCachingEntry = {
  urlPattern: RegExp | string | ((context: RuntimeCachingCallbackContext) => boolean);
  handler: CachingHandler;
  method?: HttpMethod;
  options?: Record<string, unknown>;
};

type NextPWAOptions = {
  dest?: string;
  disable?: boolean;
  register?: boolean;
  sw?: string;
  scope?: string;
  skipWaiting?: boolean;
  clientsClaim?: boolean;
  dynamicStartUrl?: boolean;
  runtimeCaching?: RuntimeCachingEntry[];
  buildExcludes?: RegExp[];
};

declare module 'next-pwa' {
  export default function nextPwa(options?: NextPWAOptions): (nextConfig: NextConfig) => NextConfig;
}

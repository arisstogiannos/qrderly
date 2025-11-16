import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import createMiddleware from 'next-intl/middleware';
import authConfig from './auth.config.middleware';
import { routing } from './i18n/routing';

const { auth } = NextAuth(authConfig);

const handleI18nRouting = createMiddleware(routing);

export const proxy = auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isSignRoute = pathname.includes('/sign');
  const isAdminRoute = pathname.includes('/admin');
  const isProtectedRoute =
    pathname.includes('/get-started') &&
    !pathname.endsWith('/get-started') &&
    !pathname.endsWith('/get-started/');

  if (isLoggedIn && isSignRoute) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (!isLoggedIn && (isAdminRoute || isProtectedRoute)) {
    return NextResponse.redirect(new URL('/sign-up', req.nextUrl));
  }

  if (
    !pathname.includes('/api') &&
    !pathname.includes('stripe') &&
    !pathname.includes('sitemap') &&
    !pathname.endsWith('robots.txt') &&
    !pathname.includes('dashboard-sw.js') &&
    !pathname.endsWith('manifest.webmanifest') &&
    !pathname.endsWith('/dashboard/manifest')
  ) {
    return handleI18nRouting(req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|lottie|mp3|webm|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

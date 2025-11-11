import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import createMiddleware from 'next-intl/middleware';
import authConfig from './auth.config.middleware';
import { routing } from './i18n/routing';

const { auth } = NextAuth(authConfig);

const handleI18nRouting = createMiddleware(routing);
export default auth((req) => {
  const isLoggedin = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // const defaultLocale = req.headers.get('x-accept-language') || 'en';

  // Step 2: Create and call the next-intl middleware (example)
  // const handleI18nRouting = createMiddleware({
  //   locales: ['en', 'el'],
  //   defaultLocale:defaultLocale as "el" | "en"
  // });
  // // const response = handleI18nRouting(req);

  const isSignRoute = pathname.includes('/sign');
  const isAdminRoute = pathname.includes('/admin');
  const isProtectedRoute =
    pathname.includes('/get-started') &&
    !pathname.endsWith('/get-started') &&
    !pathname.endsWith('/get-started/');

  if (isLoggedin) {
    if (isSignRoute) {
      return Response.redirect(new URL('/', req.nextUrl));
    }
  } else {
    if (isAdminRoute || isProtectedRoute) {
      return Response.redirect(new URL('/sign-up', req.nextUrl));
    }
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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|lottie|mp3|webm|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

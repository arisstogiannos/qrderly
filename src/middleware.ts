import authConfig from "./auth.config";
import NextAuth from "next-auth";
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const { auth } = NextAuth(authConfig);

const handleI18nRouting = createMiddleware(routing);
export default  auth((req) => {
  const isLoggedin = !!req.auth;

  // const defaultLocale = req.headers.get('x-accept-language') || 'en';
 
  // Step 2: Create and call the next-intl middleware (example)
  // const handleI18nRouting = createMiddleware({
  //   locales: ['en', 'el'],
  //   defaultLocale:defaultLocale as "el" | "en"
  // });
  // // const response = handleI18nRouting(req);
 

  const isSignRoute = req.nextUrl.pathname.includes("/sign");
  const isAdminRoute = req.nextUrl.pathname.includes("/admin");
  const isProtectedRoute = req.nextUrl.pathname.includes("/get-started");

  if (isLoggedin) {
    if (isSignRoute) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  } else {
    if (isAdminRoute || isProtectedRoute) {
      return Response.redirect(new URL("/sign-up", req.nextUrl));
    }
  }

  return handleI18nRouting(req)
});


export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|webm|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  
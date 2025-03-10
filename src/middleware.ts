import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default  auth((req) => {
  const isLoggedin = !!req.auth;

  const isSignRoute = req.nextUrl.pathname.includes("/sign");
  const isAdminRoute = req.nextUrl.pathname.includes("/admin");


  if (isLoggedin) {
    if (isSignRoute) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  } else {
    if (isAdminRoute) {
      return Response.redirect(new URL("/sign-in", req.nextUrl));
    }
  }
});

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  
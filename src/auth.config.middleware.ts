import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

// Minimal auth config for middleware - excludes heavy dependencies like db, bcryptjs, zod
// The authorize function is only needed at runtime during authentication, not in middleware
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // The authorize function is not needed in middleware
      // It will be provided by the full auth.config.ts at runtime
      async authorize() {
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

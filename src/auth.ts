import NextAuth, { type DefaultSession } from "next-auth";

import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { UserRole } from "@prisma/client";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await db.user.findUnique({ where: { id: user.id } });

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token, trigger, session }) {
      
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (!token.sub) {
        return token;
      }

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      });

      if (!existingUser) {
        return token;
      }
      token.role = existingUser.role;


      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

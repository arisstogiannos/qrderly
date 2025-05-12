import NextAuth, { type DefaultSession } from "next-auth";

import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

import type { UserRole } from "@prisma/client";
import { db } from "./db";
import type { BusinessExtended, ExtendedSubscription } from "./types";
import { sendWelcomeEmail } from "./email/mail";
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      business: BusinessExtended[];
      subscriptions: ExtendedSubscription[];
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
      if (user.id) {
        await db.settings.create({
          data: {
            userId: user.id,
            createdAt: new Date(),
          },
        });
        if(user.email) await sendWelcomeEmail(user.email, user.name ?? "scanbier");
      }
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
        select: {
          id: true,
          business: {
            select: {
              menu: true,
              id: true,
              name: true,
              product: true,
              tables: true,
              location: true,
              type: true,
              qr: true,
              subscription: true
            },
          },
          role: true,
          subscriptions: true,
        },
      });

      if (!existingUser) {
        return token;
      }
      token.role = existingUser.role;
      token.business = existingUser.business;
      token.subscriptions = existingUser.subscriptions;

      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.business) {
          session.user.business = token.business as BusinessExtended[];
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }
        if (token.subscriptions) {
          session.user.subscriptions =
            token.subscriptions as ExtendedSubscription[];
        }
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

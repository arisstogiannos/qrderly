"use server";

import { z } from "zod";
import { signIn, signOut as authSignOut } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { sendVerificationEmail } from "@/email/mail";
import { generateVerificationToken } from "@/lib/tokens";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return {
      errors: {
        email: ["Invalid email"],
      },
    };
  }

  if (!existingUser.password) {
    return { error: "Try logging in with authentication providers" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Confirmation email sent" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/get-started",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}


export async function signOut() {
  await authSignOut({
    redirectTo: "/login",
  });
}
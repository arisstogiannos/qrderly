"use server";

import { z } from "zod";

import { db } from "@/db";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/email/mail";




// Register

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" })
    .trim(),
});

export async function register(prevState: any, formData: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  if (result.data.confirmPassword !== result.data.password) {
    return {
      errors: {
        password: ["Passwords doesnt match"],
        confirmPassword: ["Passwords doesnt match"],
      },
    };
  }
  const { email, password } = result.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      errors: {
        email: ["Email already exists"],
      },
    };
  }

  await db.user.create({
    data: {
      name:"",
      email,
      password: hashedPassword,
      role:"ADMIN"
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent" };
}
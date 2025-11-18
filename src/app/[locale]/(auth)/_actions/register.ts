'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/db';
import { sendVerificationEmail } from '@/email/mail';
import { generateVerificationToken } from '@/lib/tokens';

// Register

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z.string().min(6, { message: 'Password should be at least 6 characters' }).trim(),
});

export async function register(prevState: any, formData: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = result.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      errors: {
        email: ['Email already exists'],
      },
    };
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      settings: {
        create: {
          createdAt: new Date(),
        },
      },
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token, user.name);

  return { success: 'Confirmation email sent' };
}

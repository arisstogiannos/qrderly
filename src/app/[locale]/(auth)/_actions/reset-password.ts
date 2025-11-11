'use server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/db';
import { sendResetPasswordEmail } from '@/email/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).trim(),
});

export async function resetPassword(prevState: any, formData: FormData) {
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email } = result.data;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      errors: {
        email: ['Email not found'],
      },
    };
  }

  const resetToken = await generatePasswordResetToken(user.email);
  await sendResetPasswordEmail(resetToken.email, resetToken.token, user.name);

  return { success: 'Password reset email sent' };
}

const newPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password should be at least 8 characters' }).trim(),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters' })
    .trim(),
  token: z.string().min(8, { message: 'Token does not exist' }).trim(),
});

export async function newPassword(prevState: any, formData: FormData) {
  const result = newPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { newPassword, token } = result.data;

  const existingToken = await db.token.findFirst({
    where: {
      token,
      type: 'RESET_PASSWORD',
    },
  });

  if (!existingToken) {
    return {
      error: 'An error occured. Try again!',
    };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    return {
      error: 'Reset token has expired.',
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const existingUser = await db.user.update({
    where: {
      email: existingToken.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (!existingUser) {
    return {
      error: 'User does not exist',
    };
  }

  return { success: 'Password has changed succesfully !' };
}

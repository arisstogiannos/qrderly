'use server';
import type { Product } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Resend } from 'resend';
import { z } from 'zod';
import { productMapURL } from '@/data';
import EmailVerification from './components/auth/EmailVerification';
import ResetPasswordEmail from './components/auth/ResetPasswordEmail';
import ContactEmail from './components/contact/ContactEmail';
import FeedbackEmailAdmin from './components/contact/FeedbackEmailAdmin';
import FeedbackEmail from './components/FeedbackEmail';
import QrMenuCreatedEmail from './components/Menu/MenuCreatedEmail';
import { OrderMenuEmail } from './components/OrderMenuEmail';
import OrderMenuEmailAdmin from './components/OrderMenuEmailAdmin';
import { EmptyMenuEmail } from './components/reminders/EmptyMenuEmail';
import { NoMenuEmail } from './components/reminders/NoMenuEmail';
import UnfinishedMenuEmail from './components/reminders/UnfinishedMenuEmail';
import UnverifiedEmail from './components/reminders/UnverifiedEmailEmail';
import { UpgradeToProEmail } from './components/reminders/UpgradeToProEmail';
import TrialEndedEmail from './components/trialEnded/TrialEndedEmail';
import WelcomeEmail from './components/welcome/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  name: string,
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/account-verification?token=${verificationToken}`;
  const t = await getTranslations('emails.verification');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <EmailVerification verificationUrl={confirmLink} username={name} userEmail={email} />,
    text: `Please verify your email by clicking the link below: ${confirmLink}`,
  });
};

export const sendFeedbackEmail = async (email: string, name: string) => {
  const t = await getTranslations('emails.feedback');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: (
      <FeedbackEmail
        userEmail={email}
        username={name}
        feedbackUrl={`${process.env.NEXT_PUBLIC_SERVER_URL}/feedback`}
      />
    ),
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const t = await getTranslations('emails.welcome');
  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <WelcomeEmail userEmail={email} username={name} />,
  });
};

export const sendTrialEndedEmail = async (email: string, name: string, businessName: string) => {
  const t = await getTranslations('emails.trialEnded');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <TrialEndedEmail businessName={businessName} userEmail={email} username={name} />,
  });
};

export const sendMenuCreatedEmail = async (
  email: string,
  name: string,
  businessName: string,
  menuUrlPath: string,
) => {
  const t = await getTranslations('emails.menuCreated');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject', { menuName: businessName }),
    react: (
      <QrMenuCreatedEmail
        username={name}
        menuName={businessName}
        menuUrlPath={menuUrlPath}
        userEmail={email}
      />
    ),
  });
};

export const sendResetPasswordEmail = async (email: string, resetToken: string, name: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${resetToken}`;
  const t = await getTranslations('emails.passwordReset');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: React.createElement(ResetPasswordEmail, {
      resetLink: resetLink,
      name,
      userEmail: email,
    }),
  });
};

const ContactInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  product: z.string(),
  reason: z.string(),
  message: z.string(),
  phone: z.string().optional(),
});
export type ContactDataType = z.infer<typeof ContactInfoSchema>;

export const sendContactEmail = async (prev: unknown, formData: FormData) => {
  const result = ContactInfoSchema.safeParse(Object.fromEntries(formData));

  const rawData = Object.fromEntries(formData) as unknown as Partial<ContactDataType>;
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      rawData,
    };
  }

  if (result.data.phone === '') {
    const emailStatus = await resend.emails.send({
      from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
      to: process.env.ADMIN_EMAIL as string,
      subject: 'Contact Form',
      react: React.createElement(ContactEmail, { data: result.data }),
    });

    if (emailStatus.error) {
      return {
        error: 'Something went wrong. Try again.',
        rawData,
      };
    }
  }
  return { success: true };
};
const OrderMenuInfoSchema = z.object({
  product: z.string(),
  comment: z.string(),
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  phone: z.string().optional(),
  username: z.string().optional(),
  businessName: z.string(),
});
export type OrderMenuDataType = z.infer<typeof OrderMenuInfoSchema>;

export const sendOrderMenuEmail = async (
  businessName: string,
  product: string,
  comment: string,
  phone: string,
  username: string | null,
  userEmail: string,
) => {
  const t = await getTranslations('emails.orderMenu');
  if (phone === '') {
    const emailStatus = await resend.emails.send({
      from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
      to: userEmail,
      subject: t('subject'),
      react: (
        <OrderMenuEmail
          product={product}
          comment={comment}
          email={userEmail}
          username={username || 'scanbier'}
          businessName={businessName}
        />
      ),
    });
  }
  return { success: true };
};
export const sendOrderMenuEmailAdmin = async (prev: unknown, formData: FormData) => {
  const result = OrderMenuInfoSchema.safeParse(Object.fromEntries(formData));

  const rawData = Object.fromEntries(formData) as unknown as Partial<OrderMenuDataType>;
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      rawData,
    };
  }

  if (result.data.phone === '') {
    const emailStatus = await resend.emails.send({
      from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
      to: 'info@scanby.cloud',
      subject: 'Order Menu Form',
      react: <OrderMenuEmailAdmin data={result.data} />,
    });

    if (emailStatus.error) {
      return {
        error: 'Something went wrong. Try again.',
        rawData,
      };
    }
  }
  return { success: true };
};

const FeedbackInfoSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).trim().optional(),
  feedback: z.string(),
  message: z.string(),
  rating: z.string(),
});
export type FeedbackDataType = z.infer<typeof FeedbackInfoSchema>;

export const sendFeedbackEmailAdmin = async (prev: unknown, formData: FeedbackDataType) => {
  const emailStatus = await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: process.env.ADMIN_EMAIL as string,
    subject: 'Feedback Form',
    react: <FeedbackEmailAdmin data={formData} />,
  });

  if (emailStatus.error) {
    return {
      error: 'Something went wrong. Try again.',
      formData,
    };
  }

  return { success: true };
};

//reminders

export const sendEmptyMenuEmail = async (email: string, name: string, businessName: string) => {
  const t = await getTranslations('emails.emptyMenu');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <EmptyMenuEmail username={name} userEmail={email} businessName={businessName} />,
  });
};

export const sendUpgradeToProEmail = async (email: string, name: string, businessName: string) => {
  const t = await getTranslations('emails.upgradeToPro');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <UpgradeToProEmail username={name} userEmail={email} businessName={businessName} />,
  });
};

export const sendNoMenuEmail = async (email: string, name: string) => {
  const t = await getTranslations('emails.noMenu');

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <NoMenuEmail username={name} userEmail={email} />,
  });
};

export const sendNoEmailVerifiedEmail = async (
  email: string,
  name: string,
  verificationToken: string,
) => {
  const t = await getTranslations('emails.unverified');
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.scanby.cloud';
  const confirmationLink = `${baseUrl}/account-verification?token=${verificationToken}`;
  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: (
      <UnverifiedEmail username={name} userEmail={email} verificationToken={verificationToken} />
    ),
    text: `Please verify your email by clicking the link below: ${confirmationLink}`,
  });
};

export const sendUnfinishedMenuEmail = async (
  email: string,
  name: string,
  unfinishedMenu: Product,
) => {
  const t = await getTranslations('emails.unfinishedMenu');
  const link = `${process.env.NEXT_PUBLIC_SERVER_URL}/get-started/${productMapURL[unfinishedMenu]}/business-setup`;

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t('subject'),
    react: <UnfinishedMenuEmail username={name} userEmail={email} link={link} />,
  });
};

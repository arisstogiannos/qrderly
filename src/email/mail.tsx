"use server"
import { Resend } from "resend";
import EmailVerification from "./components/auth/EmailVerification";
import React from "react";
import ResetPasswordEmail from "./components/auth/ResetPasswordEmail";
import { z } from "zod";
import ContactEmail from "./components/contact/ContactEmail";
import QrMenuCreatedEmail from "./components/Menu/MenuCreatedEmail";
import WelcomeEmail from "./components/welcome/WelcomeEmail";
import TrialEndedEmail from "./components/trialEnded/TrialEndedEmail";
import FeedbackEmail from "./components/FeedbackEmail";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  name: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/account-verification?token=${verificationToken}`;
  const t = await getTranslations("emails.verification");

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t("subject"),
    react: <EmailVerification verificationUrl={confirmLink} username={name} />,
  });
};

export const sendFeedbackEmail = async (
  email: string,
  name: string
) => {
  const t = await getTranslations("emails.feedback");

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t("subject"),
    react: <FeedbackEmail username={name} feedbackUrl={process.env.NEXT_PUBLIC_SERVER_URL + "/FAQ-contact#contact-form"} />,
  });
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
) => {
  const t = await getTranslations("emails.welcome");

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t("subject"),
    react: <WelcomeEmail userEmail={email} username={name} />,
  });
};

export const sendTrialEndedEmail = async (
  email: string,
  name: string,
  businessName: string,
) => {
  const t = await getTranslations("emails.trialEnded");

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t("subject"),
    react: <TrialEndedEmail businessName={businessName} userEmail={email} username={name} />,
  });
};

export const sendMenuCreatedEmail = async (
  email: string,
  name: string,
  businessName: string,
  menuUrlPath: string
) => {
  const t = await getTranslations("emails.menuCreated");

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t("subject", { menuName: businessName }),
    react: <QrMenuCreatedEmail username={name} menuName={businessName} menuUrlPath={menuUrlPath} />,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string,
  name: string
) => {
  const resetLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${resetToken}`;
  const t = await getTranslations("emails.passwordReset");

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: t("subject"),
    react: React.createElement(ResetPasswordEmail, { resetLink: resetLink, name }),
  });
};

const ContactInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  product: z.string(),
  reason: z.string(),
  message: z.string(),
  phone: z.string().optional()
})
export type ContactDataType = z.infer<typeof ContactInfoSchema>;

export const sendContactEmail = async (
  prev: any,
  formData: FormData
) => {
  const result = ContactInfoSchema.safeParse(Object.fromEntries(formData))

  const rawData = Object.fromEntries(
    formData
  ) as unknown as Partial<ContactDataType>;
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      rawData
    };
  }

  if (result.data.phone === "") {
    const emailStatus = await resend.emails.send({
      from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
      to: process.env.ADMIN_EMAIL as string,
      subject: "Contact Form",
      react: React.createElement(ContactEmail, { data: result.data }),
    });

    if (emailStatus.error) {
      return {
        error: "Something went wrong. Try again.",
        rawData
      };
    }
  }
  return { success: true }
};
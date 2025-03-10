import { Resend } from "resend";
import EmailVerification from "./components/auth/EmailVerification";
import React from "react";
import ResetPasswordEmail from "./components/auth/ResetPasswordEmail";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/account-verification?token=${verificationToken}`;

  await resend.emails.send({
    from: `Aris <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: "Email Verification",
    react: React.createElement(EmailVerification, { confirmLink: confirmLink }),
  });
};
export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/new-password?token=${resetToken}`;

  await resend.emails.send({
    from: `Aris <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: "Password Reset",
    react: React.createElement(ResetPasswordEmail, { resetLink: resetLink }),
  });
};

"use server"
import { Resend } from "resend";
import EmailVerification from "./components/auth/EmailVerification";
import React from "react";
import ResetPasswordEmail from "./components/auth/ResetPasswordEmail";
import { z } from "zod";
import ContactEmail from "./components/contact/ContactEmail";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/account-verification?token=${verificationToken}`;
  

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: "Email Verification",
    react: <EmailVerification confirmLink={confirmLink} />,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: email,
    subject: "Password Reset",
    react: React.createElement(ResetPasswordEmail, { resetLink: resetLink }),
  });
};

const ContactInfoSchema = z.object({
  fullName:z.string(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  product:z.string(),
  reason:z.string(),
  message:z.string()
})
export type ContactDataType = z.infer<typeof ContactInfoSchema>;

export const sendContactEmail = async (
  prev:any,
  formData:FormData
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

  const emailStatus = await resend.emails.send({
    from: `Scanby <${process.env.SENDER_EMAIL as string}>`,
    to: process.env.ADMIN_EMAIL as string,
    subject: "Contact Form",
    react: React.createElement(ContactEmail, { data:result.data }),
  });

  if(emailStatus.error){
    return {
      error: emailStatus.error,
      rawData
      
    };
  }
  return {success:true}
};
"use server"
import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

  const existingToken = await db.token.findFirst({
    where: {
      email,
      type: "VALIDATION",
    },
  });

  if (existingToken) {
    await db.token.delete({
      where: {
        id: existingToken.id,
        type: "VALIDATION",
      },
    });
  }

  const newVerificationToken = await db.token.create({
    data: {
      email,
      token,
      type: "VALIDATION",
      expiresAt: expires,
    },
  });

  return newVerificationToken;
};

export const verifyToken = async (token: string) => {
  const verificationToken = await db.token.findFirst({
    where: {
      token,
    },
  });

  if (!verificationToken) {
    return {
      error: "Invalid token",
    };
  }

  if (new Date(verificationToken.expiresAt) < new Date()) {
    return {
      error: "Token has expired",
    };
  }

  await db.user.update({
    where: {
      email: verificationToken.email,
    },
    data: {
      emailVerified: new Date(),
      email: verificationToken.email,
    },
  });

  return { success: true};
};

export const verifyResetToken = async (token: string) => {
  const validToken = await db.token.findFirst({
    where: {
      token,
      type:"RESET_PASSWORD"
    },
  });

  if (!validToken) {
    return {
      error: "Invalid token",
    };
  }

  if (new Date(validToken.expiresAt) < new Date()) {
    return {
      error: "Token has expired",
    };
  }

  return { success: true,token:validToken.token};
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 30 * 60 * 1000);

  const existingToken = await db.token.findFirst({
    where: {
      email,
      type: "RESET_PASSWORD",
    },
  });

  if (existingToken) {
    await db.token.delete({
      where: {
        id: existingToken.id,
        type:"RESET_PASSWORD"

      },
    });
  }

  const newPasswordResetToken = await db.token.create({
    data: {
      email,
      type: "RESET_PASSWORD",
      token,
      expiresAt,
    },
  });

  return newPasswordResetToken;
};

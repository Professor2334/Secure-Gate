import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Generates and stores a verification token for email validation.
 * Expired in 15 minutes.
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  // 15 minutes expiry
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // Check if a verification token already exists for this email
  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { token: existingToken.token },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}

/**
 * Generates and stores a password reset token.
 * Expired in 1 hour.
 */
export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  // 1 hour expiry
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  // Check if a password reset token already exists for this email
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { token: existingToken.token },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}

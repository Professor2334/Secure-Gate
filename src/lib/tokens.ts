import crypto from "crypto";
import { verificationTokenRepository, passwordResetTokenRepository } from "@/database/repositories";

/**
 * Generates and stores a verification token for email validation.
 * Expired in 15 minutes.
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  // 15 minutes expiry
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // Check if a verification token already exists for this email
  const existingToken = await verificationTokenRepository.findByIdentifier(email);

  if (existingToken) {
    await verificationTokenRepository.deleteByToken(existingToken.token);
  }

  const verificationToken = await verificationTokenRepository.create({
    identifier: email,
    token,
    expires,
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
  const existingToken = await passwordResetTokenRepository.findByEmail(email);

  if (existingToken) {
    await passwordResetTokenRepository.deleteByToken(existingToken.token);
  }

  const passwordResetToken = await passwordResetTokenRepository.create({
    email,
    token,
    expires,
  });

  return passwordResetToken;
}

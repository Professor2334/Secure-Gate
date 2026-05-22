"use server";

import bcrypt from "bcryptjs";
import { RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/schemas";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { userRepository, verificationTokenRepository, passwordResetTokenRepository } from "@/database/repositories";

function getClientIp(): string {
  const headersList = headers();
  return headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
}

/**
 * Register action
 */
export async function register(values: any) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const { name, email, password } = validatedFields.data;

  // Rate Limiting by IP
  const rateLimitCheck = await checkRateLimit(getClientIp(), "register");

  if (!rateLimitCheck.success) {
    return { error: "Too many registration attempts. Please try again later." };
  }

  try {
    // Check if duplicate email
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash password with 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token BEFORE creating user
    const verificationToken = await generateVerificationToken(email);

    // Create user (emailVerified defaults to null/unverified)
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send email — if this fails, roll back the created user and token
    try {
      await sendVerificationEmail(user.email, verificationToken.token);
    } catch (emailError) {
      console.error("[REGISTER EMAIL FAILURE] Cleaning up created resources...", emailError);
      await verificationTokenRepository.deleteByToken(verificationToken.token).catch(() => {});
      await userRepository.deleteByEmail(user.email).catch(() => {});
      return { error: "Failed to send verification email. Please try again." };
    }

    return { success: "Verification email sent. Please check your inbox." };
  } catch (error: any) {
    console.error("[REGISTER ACTION ERROR]", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Verify Email Action
 */
export async function verifyEmail(token: string) {
  if (!token) {
    return { error: "Token is missing." };
  }

  // Rate Limiting by IP
  const rateLimitCheck = await checkRateLimit(getClientIp(), "verify-email");

  if (!rateLimitCheck.success) {
    return { error: "Too many verification attempts. Please try again later." };
  }

  try {
    const existingToken = await verificationTokenRepository.findByToken(token);

    if (!existingToken) {
      return { error: "Verification token is invalid or has already been used." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Verification token has expired. Please request a new one." };
    }

    const user = await userRepository.findByEmail(existingToken.identifier);

    if (!user) {
      return { error: "User account associated with this token was not found." };
    }

    // Mark user as verified
    await userRepository.updateEmailVerified(user.id, new Date());

    // Delete token after successful use
    await verificationTokenRepository.deleteByToken(token);

    return { success: "Your email has been verified! You can now log in." };
  } catch (error) {
    console.error("[VERIFY EMAIL ERROR]", error);
    return { error: "An unexpected database error occurred." };
  }
}

/**
 * Resend Verification Email Action
 */
export async function resendVerification(email: string) {
  if (!email) {
    return { error: "Email address is required." };
  }

  // Rate Limiting by IP
  const rateLimitCheck = await checkRateLimit(getClientIp(), "resend-verification");

  if (!rateLimitCheck.success) {
    return { error: "Too many requests. Please try again later." };
  }

  try {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      // Return a successful generic message to prevent account enumeration leaks
      return { success: "If the account exists, a new verification link has been sent." };
    }

    if (user.emailVerified) {
      return { error: "This email address is already verified." };
    }

    const verificationToken = await generateVerificationToken(user.email);
    await sendVerificationEmail(user.email, verificationToken.token);

    return { success: "If the account exists, a new verification link has been sent." };
  } catch (error) {
    console.error("[RESEND VERIFICATION ERROR]", error);
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Forgot Password Action
 */
export async function forgotPassword(values: any) {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email address format." };
  }

  const { email } = validatedFields.data;

  // Rate Limiting by IP
  const rateLimitCheck = await checkRateLimit(getClientIp(), "forgot-password");

  if (!rateLimitCheck.success) {
    return { error: "Too many requests. Please try again in 10 minutes." };
  }

  try {
    const user = await userRepository.findByEmail(email);

    // CRITICAL SECURITY REQUIREMENT: Never reveal if the email exists. Always return success.
    if (!user) {
      return { success: "Password reset link sent! If the email is registered, you will receive an email shortly." };
    }

    const resetToken = await generatePasswordResetToken(user.email);
    await sendPasswordResetEmail(user.email, resetToken.token);

    return { success: "Password reset link sent! If the email is registered, you will receive an email shortly." };
  } catch (error) {
    console.error("[FORGOT PASSWORD ACTION ERROR]", error);
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Reset Password Action
 */
export async function resetPassword(values: any, token: string | null) {
  if (!token) {
    return { error: "Token is missing." };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password format. Check security requirements." };
  }

  const { password } = validatedFields.data;

  // Rate Limiting by IP
  const rateLimitCheck = await checkRateLimit(getClientIp(), "reset-password");

  if (!rateLimitCheck.success) {
    return { error: "Too many password reset attempts. Please try again later." };
  }

  try {
    const existingToken = await passwordResetTokenRepository.findByToken(token);

    if (!existingToken) {
      return { error: "Password reset token is invalid or has already been used." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Password reset token has expired. Please request a new link." };
    }

    const user = await userRepository.findByEmail(existingToken.email);

    if (!user) {
      return { error: "User account associated with this token was not found." };
    }

    // Hash new password with 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await userRepository.updatePassword(user.id, hashedPassword);

    // Delete reset token
    await passwordResetTokenRepository.deleteByToken(token);

    return { success: "Password reset successful! You can now log in." };
  } catch (error) {
    console.error("[RESET PASSWORD ACTION ERROR]", error);
    return { error: "An unexpected error occurred." };
  }
}

"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/schemas";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

/**
 * Register action
 */
export async function register(values: any) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash password with 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (emailVerified defaults to null/unverified)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate token
    const verificationToken = await generateVerificationToken(user.email);

    // Send email
    await sendVerificationEmail(user.email, verificationToken.token);

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

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Verification token is invalid or has already been used." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Verification token has expired. Please request a new one." };
    }

    const user = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!user) {
      return { error: "User account associated with this token was not found." };
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete token after successful use
    await prisma.verificationToken.delete({
      where: { token },
    });

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

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

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
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const rateLimitCheck = await checkRateLimit(ip, "forgot-password");

  if (!rateLimitCheck.success) {
    return { error: "Too many requests. Please try again in 10 minutes." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

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

  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Password reset token is invalid or has already been used." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Password reset token has expired. Please request a new link." };
    }

    const user = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!user) {
      return { error: "User account associated with this token was not found." };
    }

    // Hash new password with 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Delete reset token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return { success: "Password reset successful! You can now log in." };
  } catch (error) {
    console.error("[RESET PASSWORD ACTION ERROR]", error);
    return { error: "An unexpected error occurred." };
  }
}

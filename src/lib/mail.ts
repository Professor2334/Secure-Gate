import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";
import { env } from "@/lib/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const domain = env.NEXTAUTH_URL;
const fromAddress = env.RESEND_FROM;

/**
 * Sends a verification link to the user's email.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify-email/${token}`;
  
  console.log(`[MAIL SERVER] Sending verification email to ${email}`);
  console.log(`[MAIL SERVER] Verification Link: ${confirmLink}`);

  if (!resend) {
    console.log("[MAIL SERVER] Resend API key missing. Logged link to console above.");
    return { success: true, logged: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ confirmLink }),
    });

    if (error) {
      console.error("[MAIL SERVER ERROR]", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[MAIL SERVER THROWN ERROR]", error);
    return { success: false, error };
  }
}

/**
 * Sends a password reset link to the user's email.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/reset-password/${token}`;

  console.log(`[MAIL SERVER] Sending password reset email to ${email}`);
  console.log(`[MAIL SERVER] Password Reset Link: ${resetLink}`);

  if (!resend) {
    console.log("[MAIL SERVER] Resend API key missing. Logged link to console above.");
    return { success: true, logged: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Reset your password",
      react: ResetPasswordEmail({ resetLink }),
    });

    if (error) {
      console.error("[MAIL SERVER ERROR]", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[MAIL SERVER THROWN ERROR]", error);
    return { success: false, error };
  }
}

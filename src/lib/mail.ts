import { Resend } from "resend";
import nodemailer from "nodemailer";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";
import { render } from "@react-email/render";
import { env } from "@/lib/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const domain = env.NEXTAUTH_URL;
const resendFrom = env.RESEND_FROM;

// Nodemailer transport setup
const smtpConfigured = !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;

// Use SMTP_FROM if available, otherwise fallback to Resend's sender
const smtpFrom = env.SMTP_FROM || resendFrom;

/**
 * Sends a verification link to the user's email.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify-email/${token}`;
  
  console.log(`[MAIL SERVER] Sending verification email to ${email}`);
  console.log(`[MAIL SERVER] Verification Link: ${confirmLink}`);

  const html = await render(VerificationEmail({ confirmLink }));
  const subject = "Verify your email address";

  // Try Nodemailer first
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject,
        html,
      });
      console.log("[MAIL SERVER] Sent via Nodemailer", info.messageId);
      return { success: true, data: info };
    } catch (error) {
      console.error("[MAIL SERVER ERROR] Nodemailer failed, falling back to Resend...", error);
    }
  }

  // Fallback to Resend
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: resendFrom,
        to: email,
        subject,
        html,
      });

      if (error) {
        console.error("[MAIL SERVER ERROR] Resend Error:", error);
        return { success: false, error };
      }

      console.log("[MAIL SERVER] Sent via Resend", data?.id);
      return { success: true, data };
    } catch (error: any) {
      console.error("[MAIL SERVER THROWN ERROR] Resend Exception:", error);
      return { success: false, error };
    }
  }

  console.log("[MAIL SERVER] No email provider configured. Logged link to console above.");
  return { success: true, logged: true };
}

/**
 * Sends a password reset link to the user's email.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/reset-password/${token}`;

  console.log(`[MAIL SERVER] Sending password reset email to ${email}`);
  console.log(`[MAIL SERVER] Password Reset Link: ${resetLink}`);

  const html = await render(ResetPasswordEmail({ resetLink }));
  const subject = "Reset your password";

  // Try Nodemailer first
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject,
        html,
      });
      console.log("[MAIL SERVER] Sent via Nodemailer", info.messageId);
      return { success: true, data: info };
    } catch (error) {
      console.error("[MAIL SERVER ERROR] Nodemailer failed, falling back to Resend...", error);
    }
  }

  // Fallback to Resend
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: resendFrom,
        to: email,
        subject,
        html,
      });

      if (error) {
        console.error("[MAIL SERVER ERROR] Resend Error:", error);
        return { success: false, error };
      }

      console.log("[MAIL SERVER] Sent via Resend", data?.id);
      return { success: true, data };
    } catch (error: any) {
      console.error("[MAIL SERVER THROWN ERROR] Resend Exception:", error);
      return { success: false, error };
    }
  }

  console.log("[MAIL SERVER] No email provider configured. Logged link to console above.");
  return { success: true, logged: true };
}

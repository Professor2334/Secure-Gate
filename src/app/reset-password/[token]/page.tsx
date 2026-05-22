import { passwordResetTokenRepository } from "@/database/repositories";
import ResetPasswordForm from "./ResetPasswordForm";
import Link from "next/link";

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export const metadata = {
  title: "Reset Password - SecureGate",
  description: "Reset your SecureGate account password.",
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params;

  // Verify token server-side before showing the form
  const existingToken = await passwordResetTokenRepository.findByToken(token);

  const isValid = existingToken && new Date(existingToken.expires) > new Date();

  if (!isValid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
        <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Invalid or Expired Link</h1>
            <p className="text-sm text-slate-400">
              The password reset link is invalid, has already been used, or has expired. Password reset links expire after 1 hour.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-white/20 transition duration-200 flex items-center justify-center"
          >
            Request New Reset Link
          </Link>
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-white transition duration-200"
          >
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return <ResetPasswordForm token={token} />;
}

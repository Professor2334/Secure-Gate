import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import VerifyNoticeClient from "@/app/verify-notice/VerifyNoticeClient";

export const metadata = {
  title: "Verify Your Email - SecureGate",
  description: "Please verify your email address to access your dashboard.",
};

export default async function VerifyNoticePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.emailVerified) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
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
                d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">Verify your email</h1>
          <p className="text-sm text-slate-400">
            We sent a verification link to <span className="text-emerald-400 font-medium">{session.user.email}</span>.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Please check your inbox (and spam folder) and click the link to activate your account.
          </p>
        </div>

        <VerifyNoticeClient email={session.user.email!} />
      </div>
    </main>
  );
}

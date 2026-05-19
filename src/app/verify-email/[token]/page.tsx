import { verifyEmail } from "@/app/actions";
import Link from "next/link";
import ResendForm from "./ResendForm";

interface VerifyEmailPageProps {
  params: {
    token: string;
  };
}

export const metadata = {
  title: "Account Verification - SecureGate",
  description: "Verify your SecureGate email address.",
};

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = params;
  const result = await verifyEmail(token);
  const isSuccess = !!result.success;
  const isExpired = result.error?.includes("expired");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 text-center transition-all duration-300">
        {isSuccess ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">Email Verified</h1>
              <p className="text-sm text-slate-400">
                {result.success}
              </p>
            </div>
            <Link
              href="/login"
              className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition duration-200 flex items-center justify-center gap-2"
            >
              Go to Sign In
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {isExpired ? "Verification Link Expired" : "Verification Failed"}
              </h1>
              <p className="text-sm text-slate-400">
                {result.error}
              </p>
            </div>

            <div className="border-t border-slate-900 pt-4 flex flex-col gap-2 text-left">
              <span className="text-xs font-semibold text-slate-300">Need a new link?</span>
              <p className="text-xs text-slate-500">
                Enter your email address below and we will send you a new confirmation link.
              </p>
              <ResendForm />
            </div>

            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-white mt-2 transition duration-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 self-center"
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

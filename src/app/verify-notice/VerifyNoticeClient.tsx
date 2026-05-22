"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { resendVerification } from "@/app/actions";

interface VerifyNoticeClientProps {
  email: string;
}

export default function VerifyNoticeClient({ email }: VerifyNoticeClientProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        const result = await resendVerification(email);
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          setMessage(result.success);
        }
      } catch (err) {
        setError("Failed to send verification email. Please try again later.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center" role="alert">
          {error}
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={isPending}
        className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Resending link...
          </>
        ) : (
          "Resend Verification Email"
        )}
      </button>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-300 font-medium py-2.5 rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 text-sm"
      >
        Log out and use another account
      </button>
    </div>
  );
}

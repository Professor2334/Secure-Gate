"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log unexpected runtime errors to the telemetry console
    console.error("[GLOBAL RUNTIME ERROR]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
          <svg
            className="h-6 w-6"
            fill="none; stroke=currentColor"
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
          <h1 className="text-2xl font-bold tracking-tight text-white">An error occurred</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            An unexpected error occurred while rendering this page. SecureGate has blocked the execution to prevent state leakage.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-200 text-sm flex items-center justify-center gap-2"
          >
            Try Again
          </button>
          <Link
            href="/login"
            className="w-full bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-300 font-medium py-2.5 rounded-lg focus:outline-none transition duration-200 text-sm flex items-center justify-center"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

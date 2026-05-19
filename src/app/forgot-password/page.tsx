"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ForgotPasswordSchema } from "@/schemas";
import { forgotPassword } from "@/app/actions";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = ForgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid email address");
      return;
    }

    startTransition(async () => {
      try {
        const result = await forgotPassword({ email });
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          setEmail("");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Forgot password</h1>
          <p className="text-sm text-slate-400">
            Enter your email address and we will send you a password reset link
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              aria-invalid={!!error}
              aria-describedby={error ? "email-error" : undefined}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition duration-200"
              required
            />
            {error && (
              <span className="text-xs text-rose-500 mt-1" id="email-error" role="alert">
                {error}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                Sending request...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Remember your password?{" "}
          <Link href="/login" className="text-emerald-400 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

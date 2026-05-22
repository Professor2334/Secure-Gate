"use client";

import { useState, useTransition } from "react";
import { resendVerification } from "@/app/actions";

export default function ResendForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const errorId = "resend-error";
  const messageId = "resend-success";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await resendVerification(email);
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          setMessage(result.success);
          setEmail("");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full mt-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="resend-email" className="text-xs font-medium text-slate-400">
          Email Address
        </label>
        <input
          id="resend-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          aria-invalid={!!error}
          aria-describedby={
            [
              error ? errorId : null,
              message ? messageId : null
            ].filter(Boolean).join(" ") || undefined
          }
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200"
          required
        />
      </div>

      {error && (
        <span className="text-xs text-rose-500" id={errorId} role="alert">
          {error}
        </span>
      )}
      {message && (
        <span className="text-xs text-emerald-400 font-medium" id={messageId} role="status">
          {message}
        </span>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 text-white"
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
            Resending...
          </>
        ) : (
          "Request New Link"
        )}
      </button>
    </form>
  );
}

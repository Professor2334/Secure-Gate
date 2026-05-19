"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResetPasswordSchema } from "@/schemas";
import PasswordInput from "@/components/PasswordInput";
import { resetPassword } from "@/app/actions";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validate client-side
    const validation = ResetPasswordSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof errors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPassword(formData, token);
        if (result.error) {
          setSubmitError(result.error);
        } else if (result.success) {
          setSubmitSuccess(result.success);
          setFormData({ password: "", confirmPassword: "" });
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (err) {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset password</h1>
          <p className="text-sm text-slate-400">Choose a strong, secure new password</p>
        </div>

        {submitError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center" role="alert">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center" role="status">
            {submitSuccess}
          </div>
        )}

        {!submitSuccess && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PasswordInput
              id="password"
              name="password"
              label="New Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isPending}
              error={errors.password}
              showStrength={true}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isPending}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition duration-200"
                required
              />
              {errors.confirmPassword && (
                <span className="text-xs text-rose-500 mt-1" id="confirmPassword-error" role="alert">
                  {errors.confirmPassword}
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
                  Resetting password...
                </>
              ) : (
                "Save Password"
              )}
            </button>
          </form>
        )}

        {submitSuccess && (
          <div className="text-center">
            <Link href="/login" className="text-sm text-emerald-400 hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">
              Return to Login now
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

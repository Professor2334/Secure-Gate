"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/schemas";
import PasswordInput from "@/components/PasswordInput";
import InputError from "@/components/InputError";
import { register } from "@/app/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (value.trim() !== "") {
      // Remove error when typing begins
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof typeof errors];
        return updated;
      });

      // If form was already submitted, validate on change for formatting/strength errors
      if (hasSubmitted) {
        const validation = RegisterSchema.safeParse(newFormData);
        if (!validation.success) {
          const fieldErrors: typeof errors = {};
          validation.error.issues.forEach((err) => {
            const field = err.path[0] as keyof typeof errors;
            if (field && !fieldErrors[field]) {
              fieldErrors[field] = err.message;
            }
          });

          setErrors((prev) => {
            const updated = { ...prev };
            if (fieldErrors[name as keyof typeof errors]) {
              updated[name as keyof typeof errors] = fieldErrors[name as keyof typeof errors];
            } else {
              delete updated[name as keyof typeof errors];
            }

            // Also keep other validation errors
            Object.keys(fieldErrors).forEach((key) => {
              const k = key as keyof typeof errors;
              if (fieldErrors[k]) {
                updated[k] = fieldErrors[k];
              }
            });

            return updated;
          });
        }
      }
    } else {
      // If cleared, mark as empty
      setErrors((prev) => ({ ...prev, [name]: "This field cannot be empty" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "This field cannot be empty" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setHasSubmitted(true);

    // Validate client-side
    const validation = RegisterSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Call server action inside transition
    startTransition(async () => {
      const result = await register(formData);
      if (result?.error) {
        setSubmitError(result.error);
      } else if (result?.success) {
        setSubmitSuccess(result.success);
        setFormData({ name: "", email: "", password: "" });
        setErrors({});
        setHasSubmitted(false);
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-slate-400">Enter your details below to sign up</p>
        </div>

        {submitError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center animate-slide-down" role="alert">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center animate-slide-down" role="status">
            {submitSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isPending}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-[1.5px] transition duration-200 ${
                errors.name
                  ? "border-rose-500/50 focus:ring-rose-500/30 focus:border-rose-500/50"
                  : "border-slate-800 focus:ring-emerald-500/30 focus:border-slate-700"
              }`}
              required
            />
            <InputError message={errors.name} id="name-error" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isPending}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-[1.5px] transition duration-200 ${
                errors.email
                  ? "border-rose-500/50 focus:ring-rose-500/30 focus:border-rose-500/50"
                  : "border-slate-800 focus:ring-emerald-500/30 focus:border-slate-700"
              }`}
              required
            />
            <InputError message={errors.email} id="email-error" />
          </div>

          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isPending}
            error={errors.password}
            showStrength={true}
            required
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

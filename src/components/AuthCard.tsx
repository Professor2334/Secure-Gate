"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginSchema, RegisterSchema, ForgotPasswordSchema } from "@/schemas";
import PasswordInput from "@/components/PasswordInput";
import InputError from "@/components/InputError";
import { register, forgotPassword } from "@/app/actions";

function isValidCallbackUrl(url: string | null): boolean {
  if (!url) return false;
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  return true;
}

function AuthCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawMode = searchParams.get("mode");
  const mode: "login" | "register" | "forgot-password" =
    rawMode === "register" ? "register" :
    rawMode === "forgot-password" ? "forgot-password" :
    "login";

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [loginSubmitError, setLoginSubmitError] = useState<string | null>(null);
  const [loginSubmitSuccess, setLoginSubmitSuccess] = useState<string | null>(null);

  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [registerErrors, setRegisterErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [registerHasSubmitted, setRegisterHasSubmitted] = useState(false);
  const [registerSubmitError, setRegisterSubmitError] = useState<string | null>(null);
  const [registerSubmitSuccess, setRegisterSubmitSuccess] = useState<string | null>(null);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const urlError = searchParams.get("error") === "CredentialsSignin"
    ? "Invalid credentials"
    : searchParams.get("error");

  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = isValidCallbackUrl(rawCallbackUrl) ? rawCallbackUrl! : "/dashboard";

  const setMode = (newMode: string) => {
    router.replace(`/login?mode=${newMode}`);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (loginErrors[name as keyof typeof loginErrors]) {
      setLoginErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitError(null);
    setLoginSubmitSuccess(null);

    const validation = LoginSchema.safeParse(loginForm);
    if (!validation.success) {
      const fieldErrors: typeof loginErrors = {};
      validation.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof typeof loginErrors] = err.message;
      });
      setLoginErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: loginForm.email,
          password: loginForm.password,
          redirect: false,
          callbackUrl,
        });
        if (result?.error) {
          if (result.error.includes("Too many") || result.error.includes("rate limit") || result.error.includes("attempts")) {
            setLoginSubmitError("Too many login attempts. Please try again in 10 minutes.");
          } else {
            setLoginSubmitError("Invalid credentials");
          }
        } else if (result?.ok) {
          setLoginSubmitSuccess("Login successful! Redirecting...");
          router.push(result.url || callbackUrl);
          router.refresh();
        }
      } catch {
        setLoginSubmitError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...registerForm, [name]: value };
    setRegisterForm(newFormData);

    if (value.trim() !== "") {
      setRegisterErrors(prev => {
        const updated = { ...prev };
        delete updated[name as keyof typeof registerErrors];
        return updated;
      });

      if (registerHasSubmitted) {
        const validation = RegisterSchema.safeParse(newFormData);
        if (!validation.success) {
          const fieldErrors: typeof registerErrors = {};
          validation.error.issues.forEach(err => {
            const field = err.path[0] as keyof typeof registerErrors;
            if (field && !fieldErrors[field]) fieldErrors[field] = err.message;
          });
          setRegisterErrors(prev => {
            const updated = { ...prev };
            if (fieldErrors[name as keyof typeof registerErrors]) {
              updated[name as keyof typeof registerErrors] = fieldErrors[name as keyof typeof registerErrors];
            } else {
              delete updated[name as keyof typeof registerErrors];
            }
            Object.keys(fieldErrors).forEach(key => {
              const k = key as keyof typeof registerErrors;
              if (fieldErrors[k]) updated[k] = fieldErrors[k];
            });
            return updated;
          });
        }
      }
    } else {
      setRegisterErrors(prev => ({ ...prev, [name]: "This field cannot be empty" }));
    }
  };

  const handleRegisterBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setRegisterErrors(prev => ({ ...prev, [name]: "This field cannot be empty" }));
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSubmitError(null);
    setRegisterSubmitSuccess(null);
    setRegisterHasSubmitted(true);

    const validation = RegisterSchema.safeParse(registerForm);
    if (!validation.success) {
      const fieldErrors: typeof registerErrors = {};
      validation.error.issues.forEach(err => {
        const field = err.path[0] as keyof typeof registerErrors;
        if (field && !fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setRegisterErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await register(registerForm);
      if (result?.error) {
        setRegisterSubmitError(result.error);
      } else if (result?.success) {
        setRegisterSubmitSuccess(result.success);
        setRegisterForm({ name: "", email: "", password: "" });
        setRegisterErrors({});
        setRegisterHasSubmitted(false);
      }
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const validation = ForgotPasswordSchema.safeParse({ email: forgotEmail });
    if (!validation.success) {
      setForgotError(validation.error.issues[0]?.message || "Invalid email address");
      return;
    }

    startTransition(async () => {
      try {
        const result = await forgotPassword({ email: forgotEmail });
        if (result.error) {
          setForgotError(result.error);
        } else if (result.success) {
          setForgotSuccess(result.success);
          setForgotEmail("");
        }
      } catch {
        setForgotError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-[1.5px] transition duration-200 ${
      hasError
        ? "border-rose-500/50 focus:ring-rose-500/30 focus:border-rose-500/50"
        : "border-slate-800 focus:ring-emerald-500/30 focus:border-slate-700"
    }`;

  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300">
        {mode === "login" && (
          <>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
              <p className="text-sm text-slate-400">Sign in to your account to continue</p>
            </div>

            {(loginSubmitError || urlError) && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center" role="alert">
                {loginSubmitError || urlError}
              </div>
            )}
            {loginSubmitSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center" role="status">
                {loginSubmitSuccess}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email" name="email" type="email" placeholder="name@example.com"
                  value={loginForm.email} onChange={handleLoginChange} disabled={isPending}
                  aria-invalid={!!loginErrors.email} className={inputClass(!!loginErrors.email)} required
                />
                {loginErrors.email && (
                  <span className="text-xs text-rose-500 mt-1" role="alert">{loginErrors.email}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-medium text-slate-300">Password</label>
                  <button
                    type="button" onClick={() => setMode("forgot-password")}
                    className="text-xs text-emerald-400 hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordInput
                  id="login-password" name="password" label=""
                  placeholder="••••••••" value={loginForm.password}
                  onChange={handleLoginChange} disabled={isPending}
                  error={loginErrors.password} showStrength={false} required
                />
              </div>

              <button type="submit" disabled={isPending} className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? <Spinner /> : "Sign In"}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => setMode("register")} className="text-emerald-400 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">
                Create Account
              </button>
            </p>
          </>
        )}

        {mode === "register" && (
          <>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
              <p className="text-sm text-slate-400">Enter your details below to sign up</p>
            </div>

            {registerSubmitError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center" role="alert">
                {registerSubmitError}
              </div>
            )}
            {registerSubmitSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center" role="status">
                {registerSubmitSuccess}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300" htmlFor="reg-name">Name</label>
                <input
                  id="reg-name" name="name" type="text" placeholder="John Doe"
                  value={registerForm.name} onChange={handleRegisterChange} onBlur={handleRegisterBlur}
                  disabled={isPending} aria-invalid={!!registerErrors.name}
                  className={inputClass(!!registerErrors.name)} required
                />
                <InputError message={registerErrors.name} id="reg-name-error" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300" htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email" name="email" type="email" placeholder="name@example.com"
                  value={registerForm.email} onChange={handleRegisterChange} onBlur={handleRegisterBlur}
                  disabled={isPending} aria-invalid={!!registerErrors.email}
                  className={inputClass(!!registerErrors.email)} required
                />
                <InputError message={registerErrors.email} id="reg-email-error" />
              </div>

              <PasswordInput
                id="reg-password" name="password" placeholder="••••••••"
                value={registerForm.password} onChange={handleRegisterChange} onBlur={handleRegisterBlur}
                disabled={isPending} error={registerErrors.password} showStrength={true} required
              />

              <button type="submit" disabled={isPending} className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? <><Spinner />Creating account...</> : "Create Account"}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center">
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-emerald-400 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">
                Sign In
              </button>
            </p>
          </>
        )}

        {mode === "forgot-password" && (
          <>
            <button type="button" onClick={() => setMode("login")} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 self-start focus:outline-none focus:ring-1 focus:ring-emerald-500 -ml-0.5 rounded px-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 11H4" />
                <polyline points="11 18 4 11 11 4" />
              </svg>
              Back
            </button>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">Forgot password</h1>
              <p className="text-sm text-slate-400">Enter your email address and we will send you a password reset link</p>
            </div>

            {forgotError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-medium text-center" role="alert">
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-medium text-center" role="status">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300" htmlFor="forgot-email">Email Address</label>
                <input
                  id="forgot-email" name="email" type="email" placeholder="name@example.com"
                  value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  disabled={isPending} aria-invalid={!!forgotError}
                  className={inputClass(!!forgotError)} required
                />
                {forgotError && (
                  <span className="text-xs text-rose-500 mt-1" role="alert">{forgotError}</span>
                )}
              </div>

              <button type="submit" disabled={isPending} className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? <><Spinner />Sending request...</> : "Send Reset Link"}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center">
              Remember your password?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-emerald-400 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1">
                Log in
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default function AuthCard() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
        <div className="w-full max-w-md border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6 text-center justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" aria-hidden="true"></div>
          <span className="text-sm text-slate-400">Loading SecureGate...</span>
        </div>
      </main>
    }>
      <AuthCardContent />
    </Suspense>
  );
}

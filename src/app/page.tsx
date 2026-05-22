import Link from "next/link";

export const metadata = {
  title: "SecureGate - Production Grade Auth Gateway",
  description: "SecureGate standalone authentication and authorization gateway engine.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Subtle radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 max-w-2xl w-full flex flex-col gap-8 text-center items-center">
        <div className="flex flex-col gap-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Secure<span className="text-emerald-400">Gate</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            A hardened, standalone authentication engine built with Next.js 14, Prisma, PostgreSQL, and Upstash Redis.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-sm">
          <Link
            href="/login"
            className="flex-1 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 text-sm flex items-center justify-center"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex-1 bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500/30 transition duration-200 text-sm flex items-center justify-center"
          >
            Create Account
          </Link>
        </div>

        {/* Feature List Grid */}
        <div className="border border-slate-900 bg-slate-900/20 backdrop-blur-xl p-6 rounded-2xl text-left w-full shadow-2xl flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3 items-start">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0 animate-pulse" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-slate-200">Credentials Flow</span>
                <span className="text-xs text-slate-400">Secure sign up and sign in utilizing bcrypt hash comparison and JWT session state.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0 animate-pulse" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-slate-200">Email Verification</span>
                <span className="text-xs text-slate-400">Required email ownership validation with one-time verification tokens expiring in 15 mins.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-slate-200">Password Reset Flow</span>
                <span className="text-xs text-slate-400">Account enumeration protected, time-boxed tokenized email password reset.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-slate-200">Hardened Middleware</span>
                <span className="text-xs text-slate-400">Cryptographically signed cookies, session enforcement, and rate-limiting blocks.</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          SecureGate Core v0.1.0 • Protected by Upstash Redis and HTTP Security Enforcements
        </p>
      </div>
    </main>
  );
}

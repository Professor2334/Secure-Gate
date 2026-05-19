import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "Dashboard - SecureGate",
  description: "SecureGate user dashboard.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redundant checks for defensive programming
  if (!session) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-notice");
  }

  const { name, email, id, emailVerified } = session.user;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-900 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-white tracking-wide">SecureGate</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Secure Session Active</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {name || "User"}
          </h1>
          <p className="text-slate-400 text-sm">
            Your authentication session is encrypted using JWT tokens.
          </p>
        </div>

        {/* User Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-900 pb-2">
              User Profile
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Name</span>
                <span className="text-slate-200 font-medium">{name || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-200 font-medium">{email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">User ID</span>
                <span className="text-slate-300 font-mono text-xs">{id}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-900 pb-2">
              Security Status
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Email Verification</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Verified At</span>
                <span className="text-slate-300 text-xs">
                  {emailVerified ? new Date(emailVerified).toLocaleString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Session Strategy</span>
                <span className="text-slate-300 font-medium">JWT (Signed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border border-slate-900 bg-slate-900/10 p-6 rounded-2xl flex gap-4 items-start">
          <div className="text-emerald-400 mt-1">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-white">Production Guard Enabled</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SecureGate is configured with CSRF tokens, strict HTTP headers, rate limiters, and cryptographically signed session tokens. Any attempt to modify these configurations without proper authentication will result in immediate termination of the session.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

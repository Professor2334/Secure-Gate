export default function GlobalLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      <div className="flex flex-col items-center gap-4 text-center justify-center min-h-[300px]">
        {/* Modern double spin ring loading indicator */}
        <div className="relative flex items-center justify-center h-12 w-12">
          <div className="absolute animate-ping h-8 w-8 rounded-full bg-emerald-500/20"></div>
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-emerald-500"></div>
        </div>
        <span className="text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          Loading SecureGate...
        </span>
      </div>
    </main>
  );
}

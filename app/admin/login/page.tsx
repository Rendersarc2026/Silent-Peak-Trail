"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already authenticated, skip login page
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) router.replace("/admin/dashboard");
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      // keep loading=true so overlay stays while router redirects
      router.replace("/admin/dashboard");
    } else {
      setLoading(false);
      setError("Invalid username or password. Try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      {/* Full-screen overlay while logging in / redirecting */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Loader2 size={40} className="animate-spin text-white mb-4" />
          <p className="text-sm font-semibold text-slate-300 tracking-wide">Signing in to Silent Peak Trail</p>
        </div>
      )}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            🏔️ Admin Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Silent Peak Trail</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your travel agency</p>
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-10 py-3 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-10 py-3 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In →"
            )}
          </button>
        </form>


      </div>
    </div>
  );
}

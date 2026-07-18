"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const [loginIdState, setLoginIdState] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(loginIdState, password);
      // Determine role from backend response
      const role = data.employee?.role || "EMPLOYEE";
      
      // Usually would save token here, e.g., localStorage.setItem('token', data.token);
      
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] flex bg-white lg:overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-950 flex-col justify-between p-10 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <path d="M-100 600 C200 400, 400 700, 900 300" stroke="#4eeab5" strokeWidth="4" />
            <path d="M-100 650 C200 450, 400 750, 900 350" stroke="#36a08d" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-8 w-8 text-white" fill="none">
              <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
              <path d="M6 26 C9 16,13 10,16 10 C19 10,23 16,26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold text-white tracking-tight">OrgRide</span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Share the route.<br />
            Simplify the commute.
          </h1>
          <p className="text-lg text-primary-200">
            Join your trusted workplace network to find rides or offer available seats to colleagues.
          </p>
        </div>
        
        <div className="relative z-10 text-primary-400 text-xs">
          &copy; {new Date().getFullYear()} OrgRide. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 lg:overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-8 w-8 text-primary-950" fill="none">
                <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
                <path d="M6 26 C9 16,13 10,16 10 C19 10,23 16,26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-2xl font-bold text-primary-950 tracking-tight">OrgRide</span>
            </Link>
          </div>

          <h2 className="text-3xl font-extrabold text-primary-950 mb-1.5">Welcome back</h2>
          <p className="text-neutral-500 mb-6">Sign in to continue to OrgRide.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="loginId">
                Work Email or Employee ID <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                id="loginId"
                type="text"
                value={loginIdState}
                onChange={(e) => setLoginIdState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="password">
                Password <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 hover:text-primary-700 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-neutral-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-800">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-center text-sm text-neutral-500 font-medium mb-3">
              New to OrgRide? Choose how you want to join:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/register/rider"
                className="flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200"
              >
                Register as Rider
              </Link>
              <Link
                href="/register/driver"
                className="flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-accent-800 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors border border-accent-200"
              >
                Register as Driver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

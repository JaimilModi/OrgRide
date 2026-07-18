"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <div className="min-h-[100dvh] lg:h-[100dvh] flex bg-[#F7F9FC] lg:overflow-hidden font-sans">
      {/* Left Panel — Premium Illustration */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#EEF5FF] flex-col justify-between p-10 relative overflow-hidden border-r border-[#E2E8F0]">
        {/* Subtle background circles */}
        <div className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-[#2563EB]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-5%] w-80 h-80 bg-[#0891B2]/8 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/branding/orgride-logo-transparent.png"
              alt="OrgRide"
              width={140}
              height={56}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8">
          <div className="w-full max-w-sm mx-auto">
            <Image
              src="/images/auth-illustration.png"
              alt="OrgRide carpooling illustration"
              width={460}
              height={460}
              className="w-full h-auto drop-shadow-lg"
              priority
            />
          </div>
          <div className="mt-8 text-center max-w-xs">
            <h1 className="text-2xl font-extrabold text-[#10233F] mb-3 leading-snug tracking-tight">
              Share the route.<br />
              <span className="text-[#2563EB]">Simplify the commute.</span>
            </h1>
            <p className="text-[#475569] font-medium leading-relaxed text-sm">
              Join your trusted workplace network to find rides or offer available seats to colleagues.
            </p>
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A085]" />
          AI Mobility Network
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-8 lg:overflow-y-auto bg-[#F7F9FC]">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl shadow-slate-100/50">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/">
              <Image
                src="/branding/orgride-logo-transparent.png"
                alt="OrgRide"
                width={140}
                height={56}
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          <h2 className="text-3xl font-extrabold text-[#10233F] mb-2">Welcome back</h2>
          <p className="text-[#64748B] font-medium mb-8">Sign in to your OrgRide account</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#475569] mb-1.5" htmlFor="loginId">
                Work Email or Employee ID <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                id="loginId"
                type="text"
                value={loginIdState}
                onChange={(e) => setLoginIdState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#10233F] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-[#94A3B8] font-medium shadow-sm"
                placeholder="e.g., EMP12345"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#475569] mb-1.5" htmlFor="password">
                Password <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#10233F] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all pr-12 font-medium shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/50" />
                <span className="text-sm text-[#64748B] font-medium group-hover:text-[#475569] transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-white transition-all",
                "bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md hover:shadow-lg",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md",
                "active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
              )}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#E2E8F0]">
            <p className="text-center text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">
              New to OrgRide?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/register/rider"
                className="flex items-center justify-center py-3 px-4 text-sm font-bold text-[#2563EB] bg-[#EEF5FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-xl transition-all active:scale-[0.98]"
              >
                Find a Ride
              </Link>
              <Link
                href="/register/driver"
                className="flex items-center justify-center py-3 px-4 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Offer a Ride
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




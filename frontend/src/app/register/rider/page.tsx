"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerEmployee } from "@/lib/api";

export default function RiderRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    gender: "MALE",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await registerEmployee(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] flex bg-white lg:overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[40%] bg-primary-950 flex-col justify-between p-10 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <path d="M-100 600 C200 400, 400 700, 900 300" stroke="#4eeab5" strokeWidth="4" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-7 w-7 text-white" fill="none">
              <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
              <path d="M6 26 C9 16,13 10,16 10 C19 10,23 16,26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">OrgRide</span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-sm">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            Find rides with people you trust.
          </h1>
          <p className="text-base text-primary-200">
            Join your workplace network and find colleagues travelling along your route. Share the commute, share the costs.
          </p>
        </div>
        
        <div className="relative z-10 text-primary-400 text-xs">
          &copy; {new Date().getFullYear()} OrgRide.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 lg:p-8 lg:overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="lg:hidden mb-6 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-primary-950" fill="none">
                <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
                <path d="M6 26 C9 16,13 10,16 10 C19 10,23 16,26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-primary-950 tracking-tight">OrgRide</span>
            </Link>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-950 mb-6 lg:mb-8">Create your Rider account</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="name">
                  Full Name <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="employeeId">
                  Employee ID <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="employeeId" name="employeeId" type="text" required
                  value={formData.employeeId} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="email">
                  Work Email <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="phone">
                  Phone Number <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="phone" name="phone" type="tel" required
                  value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="gender">
                Gender <span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                id="gender" name="gender" required
                value={formData.gender} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="password">
                  Password <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="password" name="password" type={showPassword ? "text" : "password"} required
                  value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-900 mb-1" htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-neutral-500 hover:text-primary-700 font-medium"
              >
                {showPassword ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Rider Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 font-medium text-center">
              Planning to offer rides instead? <Link href="/register/driver" className="text-accent-600 hover:underline">Register as a Driver</Link>
            </p>
            <p className="mt-2 text-sm text-neutral-600 font-medium text-center">
              Already have an account? <Link href="/signin" className="text-primary-700 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

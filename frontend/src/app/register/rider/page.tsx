"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerEmployee } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RiderRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    gender: "PREFER_NOT_TO_SAY",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Backend expects role "EMPLOYEE" by default, and active Status
      await registerEmployee({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender,
        employeeId: formData.employeeId,
      });

      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#10233F] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-[#94A3B8] font-medium shadow-sm";
  const labelClass = "block text-sm font-semibold text-[#475569] mb-1.5";

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] flex bg-[#F7F9FC] lg:overflow-hidden font-sans">
      {/* Left Panel â€” Premium Illustration */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#EEF5FF] flex-col justify-between p-10 relative overflow-hidden border-r border-[#E2E8F0]">
        <div className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-[#2563EB]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-5%] w-80 h-80 bg-[#0891B2]/8 rounded-full blur-[80px] pointer-events-none" />

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
              Join the verified<br />
              <span className="text-[#2563EB]">workplace network.</span>
            </h1>
            <p className="text-[#475569] font-medium leading-relaxed text-sm">
              Create your Rider account using your enterprise credentials to find safe, reliable commutes with colleagues.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          Rider Onboarding
        </div>
      </div>

      {/* Right Panel â€” Form */}
      <div className="w-full lg:w-[55%] flex flex-col items-center p-6 lg:p-12 lg:overflow-y-auto bg-[#F7F9FC]">
        <div className="w-full max-w-[600px] bg-white p-8 md:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl shadow-slate-100/50 my-auto">
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

          <h2 className="text-3xl font-extrabold text-[#10233F] mb-2">Create Rider Account</h2>
          <p className="text-[#64748B] font-medium mb-8">Fill in your details to get started</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="name">
                  Full Name <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  className={inputClass}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="employeeId">
                  Employee ID <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="employeeId" name="employeeId" type="text" required
                  value={formData.employeeId} onChange={handleChange}
                  className={inputClass}
                  placeholder="EMP12345"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="email">
                  Work Email <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className={inputClass}
                  placeholder="jane@company.com"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone Number <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="phone" name="phone" type="tel" required
                  value={formData.phone} onChange={handleChange}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="gender">
                Gender <span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                id="gender" name="gender" required
                value={formData.gender} onChange={handleChange}
                className={cn(inputClass, "appearance-none cursor-pointer")}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="password">
                  Password <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="password" name="password" type={showPassword ? "text" : "password"} required
                  value={formData.password} onChange={handleChange}
                  className={inputClass}
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} required
                  value={formData.confirmPassword} onChange={handleChange}
                  className={inputClass}
                  placeholder="Repeat password"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#64748B] hover:text-[#2563EB] font-semibold transition-colors flex items-center gap-1"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPassword ? "Hide Passwords" : "Show Passwords"}
              </button>
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
              {loading ? "Creating Account..." : "Create Rider Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-sm font-medium text-[#64748B]">
              Already have an account?{" "}
              <Link href="/signin" className="text-[#2563EB] font-bold hover:text-[#1D4ED8] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

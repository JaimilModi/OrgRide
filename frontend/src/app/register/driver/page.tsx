"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerEmployee } from "@/lib/api";
import { FileUpload } from "@/components/ui/FileUpload";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function DriverRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Employee
    name: "",
    email: "",
    phone: "",
    gender: "MALE",
    password: "",
    confirmPassword: "",
    // Step 2: Vehicle
    vehicleNumber: "",
    type: "SEDAN",
    brand: "",
    model: "",
    color: "",
    fuelType: "PETROL",
    seatingCapacity: "",
    registrationYear: new Date().getFullYear().toString(),
    rcNumber: "",
    insuranceExpiry: "",
  });

  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [rcPhoto, setRcPhoto] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "vehicleNumber") {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\s+/g, "").toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!vehiclePhoto || !rcPhoto) {
      setError("Vehicle Photo and RC Photo are both required.");
      setLoading(false);
      return;
    }

    try {
      await registerEmployee({
        ...formData,
        vehiclePhoto: "backend-gap-missing-upload",
        rcPhoto: "backend-gap-missing-upload"
      });
      router.push("/signin"); 
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#10233F] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-[#94A3B8] font-medium shadow-sm";
  const labelClass = "block text-sm font-semibold text-[#475569] mb-1.5";

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-[#F7F9FC] w-full font-sans">
      {/* Left Panel — Premium Illustration */}
      <div className="hidden lg:flex lg:w-[40%] bg-[#EEF5FF] flex-col justify-between p-10 lg:p-12 relative overflow-hidden lg:sticky lg:top-0 lg:h-[100dvh] border-r border-[#E2E8F0]">
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
          <div className="w-full max-w-xs mx-auto">
            <Image
              src="/images/auth-illustration.png"
              alt="OrgRide carpooling illustration"
              width={400}
              height={400}
              className="w-full h-auto drop-shadow-lg"
              priority
            />
          </div>
          <div className="mt-8 text-center max-w-xs">
            <h1 className="text-2xl font-extrabold text-[#10233F] mb-3 leading-snug tracking-tight">
              Drive together.<br />
              <span className="text-[#2563EB]">Commute smarter.</span>
            </h1>
            <p className="text-[#475569] font-medium leading-relaxed text-sm">
              Offer available seats and share your daily commute with verified colleagues.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
          Driver Onboarding
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-6 lg:p-12 min-h-[100dvh] lg:min-h-0 py-12 bg-[#F7F9FC]">
        <div className="w-full max-w-[800px] bg-white p-8 md:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl shadow-slate-100/50">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#10233F]">Create Driver Account</h2>
            <span className="text-xs font-bold text-[#2563EB] bg-[#EEF5FF] border border-[#BFDBFE] px-3 py-1.5 rounded-full whitespace-nowrap uppercase tracking-wider">
              Step {step} of 2
            </span>
          </div>
          <p className="text-[#64748B] font-medium mb-8">
            {step === 1 ? "Your personal and account details" : "Your vehicle information"}
          </p>

          {/* Step progress */}
          <div className="flex gap-2 mb-8">
            <div className={cn("flex-1 h-1.5 rounded-full transition-all", step >= 1 ? "bg-[#2563EB]" : "bg-[#E2E8F0]")} />
            <div className={cn("flex-1 h-1.5 rounded-full transition-all", step >= 2 ? "bg-[#2563EB]" : "bg-[#E2E8F0]")} />
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6 max-w-2xl">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="name">
                    Full Name <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required
                    value={formData.name} onChange={handleChange}
                    className={inputClass}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">
                    Work Email <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    value={formData.email} onChange={handleChange}
                    className={inputClass}
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
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
                  </select>
                </div>
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
                className={cn(
                  "w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all",
                  "bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md hover:shadow-lg",
                  "active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
                )}
              >
                Next: Vehicle Details →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="vehicleNumber">
                    Vehicle Number <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="vehicleNumber" name="vehicleNumber" type="text" required
                    value={formData.vehicleNumber} onChange={handleChange}
                    placeholder="GJ01XX1234"
                    className={cn(inputClass, "uppercase")}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="type">
                    Vehicle Type <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="type" name="type" required
                    value={formData.type} onChange={handleChange}
                    className={cn(inputClass, "appearance-none cursor-pointer")}
                  >
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="TWO_WHEELER">Two Wheeler</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="brand">
                    Brand <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="brand" name="brand" type="text" required
                    value={formData.brand} onChange={handleChange}
                    placeholder="e.g. Honda"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="model">
                    Model <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="model" name="model" type="text" required
                    value={formData.model} onChange={handleChange}
                    placeholder="e.g. City"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass} htmlFor="color">
                    Color <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="color" name="color" type="text" required
                    value={formData.color} onChange={handleChange}
                    placeholder="Silver"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass} htmlFor="seatingCapacity">
                    Seats <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="seatingCapacity" name="seatingCapacity" type="number" min="1" max="10" required
                    value={formData.seatingCapacity} onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass} htmlFor="fuelType">
                    Fuel <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="fuelType" name="fuelType" required
                    value={formData.fuelType} onChange={handleChange}
                    className={cn(inputClass, "appearance-none cursor-pointer")}
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="EV">EV</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass} htmlFor="registrationYear">
                    Year <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="registrationYear" name="registrationYear" type="number" min="1990" max={new Date().getFullYear()} required
                    value={formData.registrationYear} onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="rcNumber">
                    RC Number <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="rcNumber" name="rcNumber" type="text" required
                    value={formData.rcNumber} onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="insuranceExpiry">
                    Insurance Expiry <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="insuranceExpiry" name="insuranceExpiry" type="date" required
                    value={formData.insuranceExpiry} onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-bold text-[#10233F] mb-4">Required Documents</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FileUpload 
                    label="Vehicle Photo" 
                    onChange={(file) => setVehiclePhoto(file)}
                    accept="image/*"
                  />
                  <FileUpload 
                    label="RC Document" 
                    onChange={(file) => setRcPhoto(file)}
                    accept="image/*,.pdf"
                  />
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-[#64748B] hover:text-[#10233F] transition-colors"
                >
                  ← Back to Personal Details
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full sm:w-2/3 py-3.5 px-4 rounded-xl font-bold text-white transition-all",
                    "bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md hover:shadow-lg",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md",
                    "active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
                  )}
                >
                  {loading ? "Creating Account..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}

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

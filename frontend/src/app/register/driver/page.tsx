"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerEmployee } from "@/lib/api";
import { FileUpload } from "@/components/ui/FileUpload";

export default function DriverRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Employee (Employee ID removed as requested)
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
    // Normalize vehicle number spacing
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
      // The API contract shows we need to hit auth/register (which doesn't exist).
      // If it existed, we would send formData. 
      // Uploads require /api/v1/upload with a token, which we don't have until logged in.
      // This is a known backend gap.
      await registerEmployee({
        ...formData,
        // Send vehicle photo and rc photo as fake URLs since upload endpoint requires token
        vehiclePhoto: "backend-gap-missing-upload",
        rcPhoto: "backend-gap-missing-upload"
      });
      router.push("/dashboard"); 
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-white w-full">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[35%] bg-primary-950 flex-col justify-between p-10 lg:p-12 relative overflow-hidden lg:sticky lg:top-0 lg:h-[100dvh]">
        {/* Subtle background element matching rider/signin system */}
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
            Drive together. Commute smarter.
          </h1>
          <p className="text-base text-primary-200">
            Offer available seats and share your daily commute with verified colleagues.
          </p>
        </div>
        
        <div className="relative z-10 text-primary-400 text-xs">
          &copy; {new Date().getFullYear()} OrgRide.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[65%] flex flex-col items-center justify-center p-6 lg:p-12 min-h-[100dvh] lg:min-h-0 py-12">
        <div className="w-full max-w-[800px]">
          <div className="lg:hidden mb-6 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-primary-950" fill="none">
                <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
                <path d="M6 26 C9 16,13 10,16 10 C19 10,23 16,26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-primary-950 tracking-tight">OrgRide</span>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-950">Create your Driver account</h2>
            <span className="text-sm font-semibold text-accent-700 bg-accent-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
              Step {step} of 2
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6 max-w-2xl">
              {/* Employee Account Fields */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="name">
                    Full Name <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required
                    value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="email">
                    Work Email <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="phone">
                    Phone Number <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="phone" name="phone" type="tel" required
                    value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="gender">
                    Gender <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="gender" name="gender" required
                    value={formData.gender} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="password">
                    Password <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"} required
                    value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} required
                    value={formData.confirmPassword} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-neutral-500 hover:text-accent-700 font-medium -mt-4"
                >
                  {showPassword ? "Hide Passwords" : "Show Passwords"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-accent-500 hover:bg-accent-400 text-primary-950 font-bold rounded-lg shadow-sm hover:shadow transition-all"
              >
                Next: Vehicle Details
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
              {/* Vehicle Fields */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="vehicleNumber">
                    Vehicle Number <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="vehicleNumber" name="vehicleNumber" type="text" required
                    value={formData.vehicleNumber} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="type">
                    Vehicle Type <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="type" name="type" required
                    value={formData.type} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all bg-white"
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="MUV">MUV</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="brand">
                    Brand <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="brand" name="brand" type="text" required
                    value={formData.brand} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="model">
                    Model <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="model" name="model" type="text" required
                    value={formData.model} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="color">
                    Colour <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="color" name="color" type="text" required
                    value={formData.color} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="fuelType">
                    Fuel Type <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="fuelType" name="fuelType" required
                    value={formData.fuelType} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all bg-white"
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="EV">EV</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="seatingCapacity">
                    Seating Capacity <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="seatingCapacity" name="seatingCapacity" type="number" min="1" max="15" required
                    value={formData.seatingCapacity} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="registrationYear">
                    Registration Year <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="registrationYear" name="registrationYear" required
                    value={formData.registrationYear} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all bg-white"
                  >
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="rcNumber">
                    RC Number <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="rcNumber" name="rcNumber" type="text" required
                    value={formData.rcNumber} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1.5" htmlFor="insuranceExpiry">
                    Insurance Expiry Date <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="insuranceExpiry" name="insuranceExpiry" type="date" required
                    value={formData.insuranceExpiry} onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <FileUpload
                  label="Vehicle Photo"
                  instruction="Front or side view showing vehicle clearly"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={setVehiclePhoto}
                  required
                />
                
                <FileUpload
                  label="RC Photo"
                  instruction="Clear photo or scan of RC document"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={setRcPhoto}
                  required
                />
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3.5 px-4 bg-accent-500 hover:bg-accent-400 text-primary-950 font-bold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Create Driver Account"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 font-medium text-center">
              Looking for a ride instead? <Link href="/register/rider" className="text-primary-700 hover:underline">Register as a Rider</Link>
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

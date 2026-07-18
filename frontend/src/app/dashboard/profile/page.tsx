"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile, setAuth, getToken, getUser } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { UserRound, Building2, Briefcase, Mail, Phone, MapPin, Languages, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "MALE",
    languagePreference: "",
    address: "",
    emergencyContact: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    setUser(getUser());
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            gender: data.gender || "MALE",
            languagePreference: data.languagePreference || "",
            address: data.address || "",
            emergencyContact: data.emergencyContact || "",
            department: data.department || "",
            designation: data.designation || "",
          });
        }
      } catch (err: any) {
        showToast(err.message || "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(formData);
      showToast("Profile updated successfully", "success");
      
      const token = getToken();
      if (token && updated) {
        setAuth(token, updated);
        setUser(updated); // reflect locally
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl animate-pulse">
        <div className="h-40 bg-white rounded-[32px] border border-[#E2E8F0]"></div>
        <div className="h-96 bg-white rounded-[32px] border border-[#E2E8F0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl font-sans">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-[#10233F] tracking-tight">Profile</h2>
        <p className="text-[#64748B] font-medium mt-1">Manage your personal and workplace information.</p>
      </div>

      {/* Identity Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E2E8F0] relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#EEF5FF] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-[#ECFDF5] rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 bg-[#F8FAFC] rounded-3xl flex items-center justify-center shadow-sm border border-[#CBD5E1] shrink-0">
            <span className="text-4xl font-extrabold text-[#2563EB]">
              {formData.name ? formData.name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || "U")}
            </span>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h3 className="text-3xl font-extrabold text-[#10233F] tracking-tight">{formData.name || user?.name}</h3>
              <span className="bg-[#EEF5FF] text-[#2563EB] border border-[#BFDBFE] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex w-fit mx-auto md:mx-0">
                {user?.role || "EMPLOYEE"}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6 mt-4">
              <div className="flex items-center gap-2 text-[#64748B] font-bold">
                <Briefcase size={16} className="text-[#2563EB]" />
                <span>ID: {user?.employeeId || "EMP-..."}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B] font-bold">
                <Mail size={16} className="text-[#2563EB]" />
                <span>{user?.email || "email@domain.com"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B] font-bold">
                <Building2 size={16} className="text-[#2563EB]" />
                <span>Org ID: {user?.orgId || "..."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[32px] border border-[#E2E8F0] shadow-sm space-y-10">
        
        {/* Section: Personal */}
        <div>
          <h4 className="text-lg font-extrabold text-[#10233F] flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-4">
            <UserRound size={20} className="text-[#2563EB]" /> Personal Information
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm appearance-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Commute */}
        <div>
          <h4 className="text-lg font-extrabold text-[#10233F] flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-4">
            <MapPin size={20} className="text-[#16A085]" /> Commute & Safety
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Home Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm placeholder:text-[#94A3B8]"
                placeholder="Full residential address"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Emergency Contact</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DC2626]/70" />
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm placeholder:text-[#94A3B8]"
                  placeholder="Name and number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Work */}
        <div>
          <h4 className="text-lg font-extrabold text-[#10233F] flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-4">
            <Briefcase size={20} className="text-[#2563EB]" /> Work Information
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Language Preference</label>
              <div className="relative">
                <Languages size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={formData.languagePreference}
                  onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E2E8F0] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              "bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-10 py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center gap-2 active:scale-[0.98]"
            )}
          >
            {saving ? "Saving Changes..." : <><CheckCircle2 size={20} /> Save Profile</>}
          </button>
        </div>
      </form>
    </div>
  );
}

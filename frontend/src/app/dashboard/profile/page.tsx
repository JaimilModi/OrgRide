"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile, setAuth, getToken, getUser } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { UserRound, Building2, Briefcase, Mail, Phone, MapPin, Languages, CheckCircle2 } from "lucide-react";

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
        <div className="h-40 bg-surface-main rounded-[32px] border border-border-subtle"></div>
        <div className="h-96 bg-surface-main rounded-[32px] border border-border-subtle"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-text-main tracking-tight">Profile</h2>
        <p className="text-text-sub font-medium mt-1">Manage your personal and workplace information.</p>
      </div>

      {/* Identity Card */}
      <div className="bg-primary-900 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary-700 rounded-full blur-2xl opacity-40 translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 bg-surface-main rounded-3xl flex items-center justify-center shadow-inner border-[4px] border-primary-500/30 shrink-0">
            <span className="text-4xl font-extrabold text-primary-900">
              {formData.name ? formData.name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || "U")}
            </span>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{formData.name || user?.name}</h3>
              <span className="bg-primary-500 text-primary-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex w-fit mx-auto md:mx-0">
                {user?.role || "EMPLOYEE"}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6 mt-4">
              <div className="flex items-center gap-2 text-primary-100/80 font-medium">
                <Briefcase size={16} />
                <span>ID: {user?.employeeId || "EMP-..."}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100/80 font-medium">
                <Mail size={16} />
                <span>{user?.email || "email@domain.com"}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100/80 font-medium">
                <Building2 size={16} />
                <span>Org ID: {user?.orgId || "..."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-surface-main p-8 md:p-10 rounded-[32px] border border-border-subtle shadow-sm space-y-10">
        
        {/* Section: Personal */}
        <div>
          <h4 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <UserRound size={20} className="text-primary-600" /> Personal Information
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Commute */}
        <div>
          <h4 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <MapPin size={20} className="text-primary-600" /> Commute & Safety
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Home Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
                placeholder="Full residential address"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Emergency Contact</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-danger-main/70" />
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
                  placeholder="Name and number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Work */}
        <div>
          <h4 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <Briefcase size={20} className="text-primary-600" /> Work Information
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Language Preference</label>
              <div className="relative">
                <Languages size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub" />
                <input
                  type="text"
                  value={formData.languagePreference}
                  onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-900 hover:bg-primary-800 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-md shadow-primary-900/20 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving Changes..." : <><CheckCircle2 size={20} /> Save Profile</>}
          </button>
        </div>
      </form>
    </div>
  );
}

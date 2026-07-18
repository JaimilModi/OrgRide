"use client";

import { useEffect, useState } from "react";
import { getOrganization, updateOrganization } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Building2, FileText, Globe, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrganizationPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [org, setOrg] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const data = await getOrganization();
        setOrg(data);
        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            address: data.address || "",
          });
        }
      } catch (err: any) {
        showToast(err.message || "Failed to load organization", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateOrganization(formData);
      showToast("Organization settings updated successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update organization", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl animate-pulse">
        <div className="h-[200px] bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm"></div>
        <div className="h-[400px] bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl font-sans">
      
      {/* Read Only Org Identity Header */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E2E8F0] relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#EEF5FF] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-[#DBEAFE] transition-colors"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 bg-[#F8FAFC] rounded-2xl flex items-center justify-center shadow-sm border border-[#E2E8F0] shrink-0">
            <Building2 size={40} className="text-[#2563EB]" />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-extrabold text-[#10233F] tracking-tight mb-3">{org?.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6">
              <div className="flex items-center gap-2 text-[#64748B] font-medium bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">Org ID</span>
                <span className="font-mono text-sm text-[#10233F]">{org?.id}</span>
              </div>
              <div className="flex items-center gap-2 text-[#10233F] font-bold bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                <Globe size={16} className="text-[#2563EB]" />
                <span className="text-sm">{org?.domain}</span>
              </div>
            </div>
            <p className="text-[#64748B] text-sm mt-4 font-bold max-w-lg leading-relaxed">
              Domain and ID are read-only identifiers managed by the system. Updating the organization profile below affects all employees within this network.
            </p>
          </div>
        </div>
      </div>

      {/* Editable Organization Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[32px] border border-[#E2E8F0] shadow-sm space-y-10">
        
        <div>
          <h3 className="text-lg font-extrabold text-[#10233F] flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-4">
            <Building2 size={20} className="text-[#2563EB]" /> General Profile
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] shadow-sm"
                placeholder="Enterprise Name"
              />
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={16} className="text-[#2563EB]" /> Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] min-h-[120px] resize-y shadow-sm"
                placeholder="Brief description of the organization and its commuting policy..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-[#16A085]" /> Headquarters Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-bold text-[#10233F] min-h-[100px] resize-none shadow-sm"
                placeholder="Primary office location"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E2E8F0] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold px-10 py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]"
          >
            {saving ? "Saving Changes..." : <><CheckCircle2 size={20} /> Update Organization</>}
          </button>
        </div>
      </form>
    </div>
  );
}

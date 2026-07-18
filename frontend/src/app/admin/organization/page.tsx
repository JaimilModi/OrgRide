"use client";

import { useEffect, useState } from "react";
import { getOrganization, updateOrganization } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Building2, FileText, Globe, MapPin, CheckCircle2 } from "lucide-react";

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
        <div className="h-[200px] bg-surface-main rounded-[32px] border border-border-subtle"></div>
        <div className="h-[400px] bg-surface-main rounded-[32px] border border-border-subtle"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      
      {/* Read Only Org Identity Header */}
      <div className="bg-primary-900 rounded-[32px] p-8 md:p-10 shadow-xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 bg-surface-main rounded-2xl flex items-center justify-center shadow-inner border-[4px] border-primary-500/30 shrink-0">
            <Building2 size={40} className="text-primary-900" />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">{org?.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6">
              <div className="flex items-center gap-2 text-primary-100/80 font-medium bg-primary-800/50 px-3 py-1.5 rounded-lg border border-primary-700">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-300">Org ID</span>
                <span className="font-mono">{org?.id}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100/80 font-medium bg-primary-800/50 px-3 py-1.5 rounded-lg border border-primary-700">
                <Globe size={16} className="text-primary-300" />
                <span>{org?.domain}</span>
              </div>
            </div>
            <p className="text-primary-100/60 text-sm mt-4 font-medium max-w-lg leading-relaxed">
              Domain and ID are read-only identifiers managed by the system. Updating the organization profile below affects all employees within this network.
            </p>
          </div>
        </div>
      </div>

      {/* Editable Organization Form */}
      <form onSubmit={handleSubmit} className="bg-surface-main p-8 md:p-10 rounded-[32px] border border-border-subtle shadow-sm space-y-10">
        
        <div>
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
            <Building2 size={20} className="text-primary-600" /> General Profile
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold"
                placeholder="Enterprise Name"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={16} /> Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold min-h-[120px] resize-y"
                placeholder="Brief description of the organization and its commuting policy..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin size={16} /> Headquarters Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-semibold min-h-[100px] resize-none"
                placeholder="Primary office location"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-900 hover:bg-primary-800 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-md shadow-primary-900/20 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving Changes..." : <><CheckCircle2 size={20} /> Update Organization</>}
          </button>
        </div>
      </form>
    </div>
  );
}

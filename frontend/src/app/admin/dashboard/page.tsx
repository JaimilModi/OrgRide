"use client";

import { useEffect, useState } from "react";
import { getOrganization, getAdminReports } from "@/lib/api";
import { Building2, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [orgData, reportsData] = await Promise.all([
          getOrganization(),
          getAdminReports()
        ]);
        setOrg(orgData);
        setReports(reportsData || []);
      } catch (err) {
        console.error("Failed to load admin overview", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const pendingReports = reports.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS');
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-white rounded-[24px] border border-[#E2E8F0] animate-pulse shadow-sm"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-[24px] border border-[#E2E8F0] animate-pulse shadow-sm"></div>
          <div className="h-64 bg-white rounded-[24px] border border-[#E2E8F0] animate-pulse shadow-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      
      {/* Organization Snapshot */}
      <div className="bg-gradient-to-br from-[#10233F] to-[#1E293B] rounded-[32px] p-8 md:p-10 shadow-md border border-[#334155] relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-[#2563EB]/30 transition-colors"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-[#0891B2]/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#16A085]/20 border border-[#16A085]/40 text-[#A7F3D0] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <Activity size={14} /> System Active
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              {org?.name || "Organization Network"}
            </h2>
            <p className="text-[#94A3B8] font-medium max-w-xl text-lg">
              {org?.description || "Manage your enterprise commuting infrastructure, enforce safety standards, and monitor network health."}
            </p>
          </div>
          
          <Link href="/admin/organization" className="bg-white hover:bg-[#F8FAFC] text-[#10233F] font-extrabold px-8 py-4 rounded-2xl transition-all shadow-lg flex items-center gap-2 shrink-0 active:scale-[0.98]">
            <Building2 size={20} className="text-[#2563EB]" />
            Manage Organization
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Reports KPI */}
        <div className="bg-white rounded-[24px] p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between group hover:border-[#FCA5A5] hover:shadow-md transition-all">
          <div>
            <div className="w-12 h-12 bg-[#FEF2F2] rounded-xl flex items-center justify-center text-[#DC2626] mb-6 border border-[#FECACA] shadow-sm group-hover:scale-110 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#10233F] mb-2">Active Incidents</h3>
            <p className="text-[#64748B] font-medium mb-8">Reports that require administrative review and resolution.</p>
          </div>
          
          <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-[#10233F] tracking-tight">{pendingReports.length}</span>
              <span className="text-[#64748B] font-bold uppercase tracking-wider text-sm">Pending</span>
            </div>
            <Link href="/admin/reports" className="flex items-center text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group/link">
              View Queue <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Resolution KPI */}
        <div className="bg-white rounded-[24px] p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between group hover:border-[#A7F3D0] hover:shadow-md transition-all">
          <div>
            <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center text-[#16A085] mb-6 border border-[#A7F3D0] shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#10233F] mb-2">Resolved Incidents</h3>
            <p className="text-[#64748B] font-medium mb-8">Reports that have been successfully closed by administrators.</p>
          </div>
          
          <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-[#10233F] tracking-tight">{resolvedReports.length}</span>
              <span className="text-[#64748B] font-bold uppercase tracking-wider text-sm">Resolved</span>
            </div>
            <Link href="/admin/reports" className="flex items-center text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group/link">
              View History <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
      
      {/* Recent High Priority Reports (If Any) */}
      {pendingReports.length > 0 && (
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <h3 className="font-extrabold text-[#10233F] flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#DC2626]" /> Needs Attention
            </h3>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {pendingReports.slice(0, 3).map(report => (
              <div key={report.id} className="p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {report.category}
                    </span>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-bold text-[#10233F]">{report.description}</p>
                </div>
                <Link href="/admin/reports" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm shrink-0 ml-4 active:scale-[0.98]">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

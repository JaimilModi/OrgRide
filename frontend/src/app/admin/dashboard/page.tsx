"use client";

import { useEffect, useState } from "react";
import { getOrganization, getAdminReports } from "@/lib/api";
import { Building2, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

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
        <div className="h-48 bg-surface-main rounded-[24px] border border-border-subtle animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-surface-main rounded-[24px] border border-border-subtle animate-pulse"></div>
          <div className="h-64 bg-surface-main rounded-[24px] border border-border-subtle animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Organization Snapshot */}
      <div className="bg-neutral-900 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary-700 rounded-full blur-2xl opacity-30 translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 text-primary-300 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Activity size={14} /> System Active
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              {org?.name || "Organization Network"}
            </h2>
            <p className="text-neutral-400 font-medium max-w-xl text-lg">
              {org?.description || "Manage your enterprise commuting infrastructure, enforce safety standards, and monitor network health."}
            </p>
          </div>
          
          <Link href="/admin/organization" className="bg-primary-500 hover:bg-primary-400 text-primary-950 font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2 shrink-0">
            <Building2 size={20} />
            Manage Organization
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Reports KPI */}
        <div className="bg-surface-main rounded-[24px] p-8 border border-border-subtle shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-danger-sub rounded-xl flex items-center justify-center text-danger-main mb-6 border border-danger-main/20">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Active Incidents</h3>
            <p className="text-text-sub font-medium mb-8">Reports that require administrative review and resolution.</p>
          </div>
          
          <div className="flex items-end justify-between border-t border-border-subtle pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-text-main tracking-tight">{pendingReports.length}</span>
              <span className="text-text-sub font-bold uppercase tracking-wider text-sm">Pending</span>
            </div>
            <Link href="/admin/reports" className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group">
              View Queue <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Resolution KPI */}
        <div className="bg-surface-main rounded-[24px] p-8 border border-border-subtle shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 border border-primary-200">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Resolved Incidents</h3>
            <p className="text-text-sub font-medium mb-8">Reports that have been successfully closed by administrators.</p>
          </div>
          
          <div className="flex items-end justify-between border-t border-border-subtle pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-text-main tracking-tight">{resolvedReports.length}</span>
              <span className="text-text-sub font-bold uppercase tracking-wider text-sm">Resolved</span>
            </div>
            <Link href="/admin/reports" className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group">
              View History <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
      
      {/* Recent High Priority Reports (If Any) */}
      {pendingReports.length > 0 && (
        <div className="bg-surface-main rounded-[24px] border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-sub/50">
            <h3 className="font-bold text-text-main flex items-center gap-2">
              <AlertTriangle size={18} className="text-danger-main" /> Needs Attention
            </h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {pendingReports.slice(0, 3).map(report => (
              <div key={report.id} className="p-6 flex items-center justify-between hover:bg-surface-sub transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-danger-main/10 text-danger-main px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {report.category}
                    </span>
                    <span className="text-xs font-bold text-text-sub uppercase">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-text-main">{report.description}</p>
                </div>
                <Link href="/admin/reports" className="bg-white border border-border-subtle px-4 py-2 rounded-lg text-sm font-bold text-text-main hover:border-primary-300 transition-colors shadow-sm shrink-0 ml-4">
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

"use client";

import { useEffect, useState } from "react";
import { getAdminReports, updateReportStatus } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, XCircle, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED">("PENDING");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAdminReports();
      setReports(data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this report as ${newStatus}?`)) return;
    setUpdatingId(id);
    try {
      await updateReportStatus(id, newStatus);
      showToast(`Report status updated to ${newStatus}`, "success");
      fetchReports();
    } catch (err: any) {
      showToast(err.message || "Failed to update report status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = activeTab === "ALL" ? reports : reports.filter(r => r.status === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertTriangle size={16} />;
      case 'IN_PROGRESS': return <Clock size={16} />;
      case 'RESOLVED': return <CheckCircle2 size={16} />;
      case 'DISMISSED': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'IN_PROGRESS': return 'bg-[#EEF5FF] text-[#2563EB] border-[#BFDBFE]';
      case 'RESOLVED': return 'bg-[#ECFDF5] text-[#16A085] border-[#A7F3D0]';
      case 'DISMISSED': return 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]';
      default: return 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-[#10233F] tracking-tight flex items-center gap-3">
          <ShieldAlert className="text-[#DC2626]" size={28} /> Reports & Safety
        </h2>
        <p className="text-[#64748B] font-medium mt-1">Review reported incidents and manage safety across the OrgRide network.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED", "ALL"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wider uppercase transition-all whitespace-nowrap border shadow-sm",
              activeTab === tab
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
            )}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white rounded-[24px] border border-[#E2E8F0] animate-pulse shadow-sm"></div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center pt-16 pb-8 bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm min-h-[400px]">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-6 border border-[#E2E8F0]">
            <ShieldAlert size={32} className="text-[#94A3B8] opacity-50" />
          </div>
          <h3 className="text-xl font-extrabold text-[#10233F] mb-2">No reports found</h3>
          <p className="text-[#64748B] font-medium max-w-sm mx-auto">There are no reports matching the '{activeTab}' status.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-md hover:border-[#FECACA] transition-all">
              
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border", getStatusColor(report.status))}>
                    {getStatusIcon(report.status)} {report.status.replace("_", " ")}
                  </span>
                  <span className="bg-[#FEF2F2] text-[#DC2626] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#FECACA]">
                    Category: {report.category}
                  </span>
                  <span className="text-xs font-bold text-[#64748B] ml-auto">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Incident Description</h4>
                  <p className="text-[#10233F] font-medium leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    {report.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 bg-[#F1F5F9] p-4 rounded-xl border border-[#E2E8F0]">
                  <div>
                    <h5 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Reported By</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EEF5FF] text-[#2563EB] border border-[#BFDBFE] font-bold flex items-center justify-center text-[10px]">
                        {report.reporter?.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-bold text-[#10233F] text-sm">{report.reporter?.name || "Unknown User"}</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider mb-1">Reported User</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold flex items-center justify-center text-[10px]">
                        {report.reportedUser?.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-bold text-[#10233F] text-sm">{report.reportedUser?.name || "Unknown User"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Sidebar */}
              <div className="bg-[#F8FAFC] lg:w-[280px] p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] flex flex-col justify-center">
                <h4 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-4">Admin Actions</h4>
                
                <div className="space-y-3">
                  {report.status !== 'RESOLVED' && report.status !== 'DISMISSED' && (
                    <>
                      {report.status === 'PENDING' && (
                        <button 
                          onClick={() => handleStatusUpdate(report.id, 'IN_PROGRESS')}
                          disabled={updatingId === report.id}
                          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 active:scale-[0.98]"
                        >
                          Mark In Progress
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleStatusUpdate(report.id, 'RESOLVED')}
                        disabled={updatingId === report.id}
                        className="w-full bg-[#16A085] hover:bg-[#0F766E] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 active:scale-[0.98]"
                      >
                        Resolve Incident
                      </button>

                      <button 
                        onClick={() => handleStatusUpdate(report.id, 'DISMISSED')}
                        disabled={updatingId === report.id}
                        className="w-full bg-white hover:bg-[#F1F5F9] text-[#10233F] border border-[#E2E8F0] font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 active:scale-[0.98]"
                      >
                        Dismiss Report
                      </button>
                    </>
                  )}
                  
                  {(report.status === 'RESOLVED' || report.status === 'DISMISSED') && (
                    <div className="text-center p-4 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                      <CheckCircle2 size={24} className="mx-auto text-[#16A085] mb-2" />
                      <span className="text-sm font-bold text-[#10233F] block">Case Closed</span>
                      <span className="text-xs font-medium text-[#64748B] block mt-1">No further action required.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

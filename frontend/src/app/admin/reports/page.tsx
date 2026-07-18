"use client";

import { useEffect, useState } from "react";
import { getAdminReports, updateReportStatus } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, XCircle, MoreVertical } from "lucide-react";

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
      case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'DISMISSED': return 'bg-neutral-100 text-neutral-600 border-border-subtle';
      default: return 'bg-surface-sub text-text-sub border-border-subtle';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-text-main tracking-tight flex items-center gap-3">
          <ShieldAlert className="text-danger-main" size={28} /> Reports & Safety
        </h2>
        <p className="text-text-sub font-medium mt-1">Review reported incidents and manage safety across the OrgRide network.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED", "ALL"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
              activeTab === tab
                ? "bg-primary-900 text-white border-primary-900 shadow-md"
                : "bg-surface-main text-text-sub border-border-subtle hover:border-primary-300"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface-main rounded-[24px] border border-border-subtle animate-pulse"></div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center pt-16 pb-8 bg-surface-main rounded-[24px] border border-border-subtle shadow-sm min-h-[400px]">
          <div className="w-20 h-20 bg-surface-sub rounded-full flex items-center justify-center mb-6 border border-border-subtle">
            <ShieldAlert size={32} className="text-text-sub opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">No reports found</h3>
          <p className="text-text-sub max-w-sm mx-auto">There are no reports matching the '{activeTab}' status.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-surface-main rounded-[24px] border border-border-subtle shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:border-primary-200 transition-colors">
              
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)} {report.status.replace("_", " ")}
                  </span>
                  <span className="bg-danger-main/10 text-danger-main px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-danger-main/20">
                    Category: {report.category}
                  </span>
                  <span className="text-xs font-bold text-text-sub ml-auto">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-text-sub uppercase tracking-wider mb-2">Incident Description</h4>
                  <p className="text-text-main font-medium leading-relaxed bg-bg-page p-4 rounded-xl border border-border-subtle">
                    {report.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 bg-surface-sub p-4 rounded-xl border border-border-subtle">
                  <div>
                    <h5 className="text-[11px] font-bold text-text-sub uppercase tracking-wider mb-1">Reported By</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-200 text-primary-900 font-bold flex items-center justify-center text-[10px]">
                        {report.reporter?.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-semibold text-text-main text-sm">{report.reporter?.name || "Unknown User"}</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-text-sub uppercase tracking-wider mb-1 text-danger-main">Reported User</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-danger-sub text-danger-main font-bold flex items-center justify-center text-[10px]">
                        {report.reportedUser?.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-semibold text-text-main text-sm">{report.reportedUser?.name || "Unknown User"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Sidebar */}
              <div className="bg-surface-sub lg:w-[280px] p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border-subtle flex flex-col justify-center">
                <h4 className="text-[11px] font-bold text-text-sub uppercase tracking-wider mb-4">Admin Actions</h4>
                
                <div className="space-y-3">
                  {report.status !== 'RESOLVED' && report.status !== 'DISMISSED' && (
                    <>
                      {report.status === 'PENDING' && (
                        <button 
                          onClick={() => handleStatusUpdate(report.id, 'IN_PROGRESS')}
                          disabled={updatingId === report.id}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                        >
                          Mark In Progress
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleStatusUpdate(report.id, 'RESOLVED')}
                        disabled={updatingId === report.id}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                      >
                        Resolve Incident
                      </button>

                      <button 
                        onClick={() => handleStatusUpdate(report.id, 'DISMISSED')}
                        disabled={updatingId === report.id}
                        className="w-full bg-white hover:bg-neutral-100 border border-border-subtle text-text-main font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                      >
                        Dismiss Report
                      </button>
                    </>
                  )}
                  
                  {(report.status === 'RESOLVED' || report.status === 'DISMISSED') && (
                    <div className="text-center p-4 bg-white rounded-xl border border-border-subtle">
                      <CheckCircle2 size={24} className="mx-auto text-primary-500 mb-2" />
                      <span className="text-sm font-bold text-text-main block">Case Closed</span>
                      <span className="text-xs font-medium text-text-sub block mt-1">No further action required.</span>
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

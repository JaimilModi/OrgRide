"use client";

import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking, payBooking, reportUser } from "@/lib/api";
import { Booking } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { CarFront, MapPin, IndianRupee, Users, ShieldAlert, X, AlertTriangle, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MyRides() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [reportingRide, setReportingRide] = useState<{rideId: string, driverId: string} | null>(null);
  const [reportData, setReportData] = useState({ category: 'SAFETY', description: '' });
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      showToast("Booking cancelled successfully", "success");
      fetchBookings();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel", "error");
    }
  };

  const handlePay = async (id: string) => {
    if (!confirm("Pay for this ride using your wallet balance?")) return;
    try {
      await payBooking(id);
      showToast("Payment successful!", "success");
      fetchBookings();
    } catch (err: any) {
      showToast(err.message || "Failed to process payment", "error");
    }
  };

  const submitReport = async () => {
    if (!reportingRide) return;
    if (!reportData.description.trim()) return showToast("Description is required", "error");
    
    setSubmittingReport(true);
    try {
      await reportUser({
        rideId: reportingRide.rideId,
        reportedUserId: reportingRide.driverId,
        category: reportData.category,
        description: reportData.description
      });
      showToast("Report submitted securely.", "success");
      setReportingRide(null);
      setReportData({ category: 'SAFETY', description: '' });
    } catch (err: any) {
      showToast(err.message || "Failed to submit report", "error");
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACCEPTED':
        return <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={14}/> {status}</span>;
      case 'PENDING':
        return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={14}/> {status}</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><X size={14}/> {status}</span>;
      default:
        return <span className="bg-surface-sub text-text-sub px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-text-main tracking-tight">My Rides</h2>
        <p className="text-text-sub font-medium mt-1">Manage your requested and confirmed commutes.</p>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="grid gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-surface-main h-48 rounded-[24px] border border-border-subtle animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center pt-16 pb-8 bg-surface-main rounded-[24px] border border-border-subtle shadow-sm min-h-[400px]">
          <div className="w-48 h-48 mb-6 relative text-border-subtle">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
              <path d="M40 100C40 100 80 40 160 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"/>
              <circle cx="40" cy="100" r="12" fill="currentColor"/>
              <circle cx="160" cy="100" r="12" fill="currentColor"/>
              <path d="M100 130L120 160H80L100 130Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">No rides booked yet</h3>
          <p className="text-text-sub max-w-sm mx-auto mb-6">Your requested and confirmed rides will appear here.</p>
          <Link href="/dashboard/find-ride" className="bg-primary-900 hover:bg-primary-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
            <CarFront size={18} /> Find a Ride
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-surface-main p-6 rounded-[24px] border border-border-subtle shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 justify-between hover:border-primary-200 transition-colors">
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  {getStatusBadge(booking.status)}
                  {booking.ride && (
                    <span className="text-sm font-bold text-text-sub flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(booking.ride.pickupAt)} at {formatTime(booking.ride.pickupAt)}
                    </span>
                  )}
                </div>
                
                {booking.ride && (
                  <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
                    <div className="relative">
                      <div className="absolute -left-9 top-0.5 w-5 h-5 rounded-full bg-surface-main border-[4px] border-primary-500 shadow-sm z-10"></div>
                      <p className="font-semibold text-text-main text-lg leading-tight">{booking.ride.sourceAddress}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-9 top-0.5 w-5 h-5 rounded-full bg-surface-main border-[4px] border-danger-main shadow-sm z-10"></div>
                      <p className="font-semibold text-text-main text-lg leading-tight">{booking.ride.destinationAddress}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-border-subtle flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-text-sub font-medium text-sm">
                    <Users size={16} />
                    <span className="text-text-main font-bold">{booking.seatsBooked}</span> {booking.seatsBooked === 1 ? 'seat' : 'seats'}
                  </div>
                  {booking.ride?.driver && (
                    <div className="flex items-center gap-2 text-text-sub font-medium text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary-200 text-primary-900 font-bold flex items-center justify-center text-[10px]">
                        {booking.ride.driver.name.charAt(0)}
                      </div>
                      <span className="text-text-main font-bold">{booking.ride.driver.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end md:w-48 shrink-0 md:pl-6 md:border-l border-border-subtle">
                {booking.ride && (
                  <div className="text-right w-full mb-6">
                    <span className="text-[11px] font-bold text-text-sub uppercase tracking-wider block mb-1">Total Amount</span>
                    <div className="flex items-center justify-end gap-1 text-primary-700">
                      <IndianRupee size={18} strokeWidth={3} />
                      <span className="text-[28px] font-extrabold leading-none">
                        {(Number(booking.ride.pricePerSeat) * booking.seatsBooked).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="w-full space-y-2">
                  {booking.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => handlePay(booking.id)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-primary-600/20"
                    >
                      Pay Now
                    </button>
                  )}
                  {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="w-full bg-surface-sub hover:bg-border-subtle text-text-main px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'ACCEPTED' && booking.ride && (
                    <button 
                      onClick={() => setReportingRide({ rideId: booking.ride!.id, driverId: booking.ride!.driverId })}
                      className="w-full flex items-center justify-center gap-2 text-danger-main hover:bg-danger-sub px-4 py-2 rounded-xl text-xs font-bold transition-colors mt-2"
                    >
                      <ShieldAlert size={14} />
                      Report Driver
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {reportingRide && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface-main rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-sub">
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <AlertTriangle className="text-danger-main" /> Report Driver
              </h3>
              <button onClick={() => setReportingRide(null)} className="p-1.5 text-text-sub hover:bg-border-subtle rounded-lg transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={reportData.category}
                  onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-bg-page focus:ring-2 focus:ring-danger-main/20 focus:border-danger-main outline-none font-semibold text-text-main"
                >
                  <option value="SAFETY">Safety Issue</option>
                  <option value="DRIVER_LATE">Driver was late</option>
                  <option value="VEHICLE">Vehicle issue</option>
                  <option value="PAYMENT">Payment issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-bg-page focus:ring-2 focus:ring-danger-main/20 focus:border-danger-main outline-none min-h-[120px] font-medium resize-none"
                  placeholder="Please describe the issue in detail..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-border-subtle bg-surface-sub flex justify-end gap-3">
              <button 
                onClick={() => setReportingRide(null)}
                className="px-6 py-2.5 text-text-main font-bold hover:bg-border-subtle rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitReport}
                disabled={submittingReport}
                className="bg-danger-main hover:bg-danger-main/90 text-white font-bold px-8 py-2.5 rounded-xl transition-all shadow-md shadow-danger-main/20 disabled:opacity-50 flex items-center gap-2"
              >
                {submittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking, payBooking, reportUser } from "@/lib/api";
import { Booking, Ride } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { CarFront, MapPin, IndianRupee, Users, ShieldAlert, X, AlertTriangle, CalendarDays, Clock, CheckCircle2, MapPinned } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OlaMap } from "@/components/maps/OlaMap";

export default function MyRides() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [reportingRide, setReportingRide] = useState<{rideId: string, driverId: string} | null>(null);
  const [reportData, setReportData] = useState({ category: 'SAFETY', description: '' });
  const [submittingReport, setSubmittingReport] = useState(false);
  
  const [viewingRoute, setViewingRoute] = useState<Ride | null>(null);

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
        return <span className="bg-[#16A085]/10 border border-[#16A085]/30 text-[#16A085] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={14}/> {status}</span>;
      case 'PENDING':
        return <span className="bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={14}/> {status}</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><X size={14}/> {status}</span>;
      default:
        return <span className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const hasValidCoordinates = (ride: Ride) => {
    const slat = Number(ride.sourceLatitude);
    const slng = Number(ride.sourceLongitude);
    const dlat = Number(ride.destinationLatitude);
    const dlng = Number(ride.destinationLongitude);
    return !isNaN(slat) && !isNaN(slng) && !isNaN(dlat) && !isNaN(dlng) &&
           slat !== 0 && slng !== 0 && dlat !== 0 && dlng !== 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-[#10233F] tracking-tight">My Rides</h2>
        <p className="text-[#64748B] font-medium mt-1">Manage your requested and confirmed commutes.</p>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="grid gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white h-48 rounded-[24px] border border-[#E2E8F0] animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center pt-16 pb-8 bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm min-h-[400px]">
          <div className="w-48 h-48 mb-6 relative text-[#CBD5E1]">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
              <path d="M40 100C40 100 80 40 160 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"/>
              <circle cx="40" cy="100" r="12" fill="currentColor"/>
              <circle cx="160" cy="100" r="12" fill="currentColor"/>
              <path d="M100 130L120 160H80L100 130Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-[#10233F] mb-2">No rides booked yet</h3>
          <p className="text-[#64748B] font-medium max-w-sm mx-auto mb-6">Your requested and confirmed rides will appear here.</p>
          <Link href="/dashboard/find-ride" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]">
            <CarFront size={18} /> Find a Ride
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 justify-between hover:shadow-md hover:border-[#CBD5E1] transition-all">
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  {getStatusBadge(booking.status)}
                  {booking.ride && (
                    <span className="text-sm font-bold text-[#64748B] flex items-center gap-2">
                      <CalendarDays size={16} className="text-[#2563EB]" />
                      {formatDate(booking.ride.pickupAt)} at {formatTime(booking.ride.pickupAt)}
                    </span>
                  )}
                </div>
                
                {booking.ride && (
                  <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
                    <div className="relative">
                      <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#16A085] shadow-sm z-10"></div>
                      <p className="font-bold text-[#10233F] text-lg leading-tight">{booking.ride.sourceAddress}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#2563EB] shadow-sm z-10"></div>
                      <p className="font-bold text-[#10233F] text-lg leading-tight">{booking.ride.destinationAddress}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-[#64748B] font-medium text-sm">
                    <Users size={16} className="text-[#2563EB]" />
                    <span className="text-[#10233F] font-bold">{booking.seatsBooked}</span> {booking.seatsBooked === 1 ? 'seat' : 'seats'}
                  </div>
                  {booking.ride?.driver && (
                    <div className="flex items-center gap-2 text-[#64748B] font-medium text-sm">
                      <div className="w-5 h-5 rounded-full bg-[#EEF5FF] text-[#2563EB] border border-[#BFDBFE] font-bold flex items-center justify-center text-[10px]">
                        {booking.ride.driver.name.charAt(0)}
                      </div>
                      <span className="text-[#10233F] font-bold">{booking.ride.driver.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end md:w-48 shrink-0 md:pl-6 md:border-l border-[#E2E8F0]">
                {booking.ride && (
                  <div className="text-right w-full mb-6">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">Total Amount</span>
                    <div className="flex items-center justify-end gap-1 text-[#16A085]">
                      <IndianRupee size={18} strokeWidth={3} />
                      <span className="text-[28px] font-extrabold leading-none">
                        {(Number(booking.ride.pricePerSeat) * booking.seatsBooked).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="w-full space-y-2">
                  {booking.ride && (
                    <button 
                      onClick={() => setViewingRoute(booking.ride!)}
                      className="w-full bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <MapPinned size={16} />
                      View Route
                    </button>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => handlePay(booking.id)}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98]"
                    >
                      Pay Now
                    </button>
                  )}
                  {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="w-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#10233F] px-4 py-3 rounded-xl text-sm font-bold transition-colors border border-[#CBD5E1]"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'ACCEPTED' && booking.ride && (
                    <button 
                      onClick={() => setReportingRide({ rideId: booking.ride!.id, driverId: booking.ride!.driverId })}
                      className="w-full flex items-center justify-center gap-2 text-[#DC2626] hover:bg-[#FEF2F2] px-4 py-2 rounded-xl text-xs font-bold transition-colors mt-2"
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

      {/* Route Viewer Modal */}
      {viewingRoute && (
        <div className="fixed inset-0 bg-[#10233F]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E2E8F0] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="text-xl font-extrabold text-[#10233F] flex items-center gap-2">
                  <MapPinned className="text-[#2563EB]" /> Route Overview
                </h3>
                <p className="text-[#64748B] text-sm font-medium mt-1 flex items-center gap-2">
                  <CalendarDays size={14} /> {formatDate(viewingRoute.pickupAt)} at {formatTime(viewingRoute.pickupAt)}
                  {viewingRoute.driver && (
                     <>
                        <span className="w-1 h-1 bg-[#CBD5E1] rounded-full mx-1"></span>
                        <span>Driver: <strong className="text-[#10233F]">{viewingRoute.driver.name}</strong></span>
                     </>
                  )}
                </p>
              </div>
              <button onClick={() => setViewingRoute(null)} className="p-2 text-[#64748B] hover:text-[#10233F] hover:bg-[#E2E8F0] rounded-xl transition-colors">
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 bg-white flex-1 min-h-[400px] overflow-hidden">
               {hasValidCoordinates(viewingRoute) ? (
                 <OlaMap 
                    sourceCoords={{ longitude: Number(viewingRoute.sourceLongitude), latitude: Number(viewingRoute.sourceLatitude) }} 
                    destinationCoords={{ longitude: Number(viewingRoute.destinationLongitude), latitude: Number(viewingRoute.destinationLatitude) }}
                    sourceLabel={viewingRoute.sourceAddress}
                    destinationLabel={viewingRoute.destinationAddress}
                 />
               ) : (
                 <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl p-6 text-center shadow-sm">
                    <MapPin size={48} className="text-[#94A3B8] mb-4 opacity-50" />
                    <h4 className="text-lg font-bold text-[#10233F] mb-2">Route map unavailable</h4>
                    <p className="text-[#64748B] max-w-sm">
                       The coordinates for this ride are either missing or malformed.
                    </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingRide && (
        <div className="fixed inset-0 bg-[#10233F]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#FECACA]">
            <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="text-xl font-extrabold text-[#10233F] flex items-center gap-2">
                <AlertTriangle className="text-[#DC2626]" /> Report Driver
              </h3>
              <button onClick={() => setReportingRide(null)} className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={reportData.category}
                  onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none font-bold text-[#10233F] shadow-sm"
                >
                  <option value="SAFETY">Safety Issue</option>
                  <option value="DRIVER_LATE">Driver was late</option>
                  <option value="VEHICLE">Vehicle issue</option>
                  <option value="PAYMENT">Payment issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none min-h-[120px] font-medium resize-none text-[#10233F] placeholder:text-[#94A3B8] shadow-sm"
                  placeholder="Please describe the issue in detail..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button 
                onClick={() => setReportingRide(null)}
                className="px-6 py-2.5 text-[#64748B] font-bold hover:text-[#10233F] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitReport}
                disabled={submittingReport}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold px-8 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]"
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

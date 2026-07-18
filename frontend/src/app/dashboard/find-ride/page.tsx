"use client";

import { useState, useEffect } from "react";
import { searchRides, bookRide } from "@/lib/api";
import { Ride } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { Search, MapPin, CalendarDays, CarFront, Users, IndianRupee, ArrowRight, X, Clock, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

function FindRideContent() {
  const { showToast } = useToast();
  const searchParamsHook = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchParams, setSearchParams] = useState({
    source: searchParamsHook.get("source") || "",
    destination: searchParamsHook.get("destination") || "",
    pickupDate: "",
    minSeats: 1,
  });

  const [bookingRideId, setBookingRideId] = useState<string | null>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (searchParamsHook.get("source") || searchParamsHook.get("destination")) {
      const triggerSearch = async () => {
        await executeSearch({
          source: searchParamsHook.get("source") || "",
          destination: searchParamsHook.get("destination") || ""
        });
      };
      triggerSearch();
    }
  }, [searchParamsHook]);

  const executeSearch = async (params: any) => {
    setLoading(true);
    try {
      const query: any = {};
      if (params.source) query.source = params.source;
      if (params.destination) query.destination = params.destination;
      if (params.pickupDate) query.pickupDate = params.pickupDate;
      if (params.minSeats) query.minSeats = params.minSeats;

      const data = await searchRides(query);
      setRides(data || []);
      setHasSearched(true);
    } catch (err: any) {
      showToast(err.message || "Failed to search rides.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchParams);
  };

  const handleBook = async () => {
    if (!bookingRideId) return;
    setBookingLoading(true);
    try {
      await bookRide(bookingRideId, seatsToBook);
      showToast("Seat requested successfully! Waiting for driver approval.", "success");
      setBookingRideId(null);
    } catch (err: any) {
      showToast(err.message || "Failed to book ride.", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const bookingRide = rides.find(r => r.id === bookingRideId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      
      {/* Search Header */}
      <div>
        <h2 className="text-[28px] font-extrabold text-[#10233F] tracking-tight">Find a Ride</h2>
        <p className="text-[#64748B] font-medium mt-1">Enter your commute details to discover available rides.</p>
      </div>

      {/* Search Panel */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm relative z-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">From</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" />
              <input
                type="text"
                placeholder="Source location"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-medium text-[#10233F] placeholder:text-[#94A3B8] shadow-sm"
                value={searchParams.source}
                onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">To</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Destination"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-medium text-[#10233F] placeholder:text-[#94A3B8] shadow-sm"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Date</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="date"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-medium text-[#10233F] shadow-sm"
                value={searchParams.pickupDate}
                onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 h-[52px] active:scale-[0.98]"
            >
              {loading ? <span className="animate-pulse">Searching...</span> : <><Search size={18} strokeWidth={2.5} /> Search Rides</>}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="min-h-[400px]">
        {!hasSearched && !loading && (
          <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
            <div className="w-48 h-48 mb-6 relative">
              <div className="absolute inset-0 bg-[#EEF5FF] rounded-full blur-[60px]"></div>
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 text-[#2563EB]/20">
                <path d="M40 160C40 160 70 120 100 120C130 120 160 160 160 160" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"/>
                <circle cx="40" cy="160" r="12" fill="currentColor"/>
                <circle cx="160" cy="160" r="12" fill="currentColor"/>
                <rect x="70" y="40" width="60" height="40" rx="8" stroke="currentColor" strokeWidth="4"/>
                <circle cx="85" cy="80" r="8" fill="currentColor"/>
                <circle cx="115" cy="80" r="8" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-[#10233F] mb-2">Ready to Commute?</h3>
            <p className="text-[#64748B] max-w-sm mx-auto font-medium">Enter your route details above to discover available rides from your workplace network.</p>
          </div>
        )}

        {hasSearched && !loading && rides.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
            <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-6 border border-[#E2E8F0] shadow-sm">
              <Search size={32} className="text-[#94A3B8]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#10233F] mb-2">No matching rides found</h3>
            <p className="text-[#64748B] max-w-sm mx-auto font-medium">We couldn't find any rides matching your criteria. Try adjusting your dates or destinations.</p>
          </div>
        )}

        {loading && (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-48 rounded-[24px] border border-[#E2E8F0] animate-pulse"></div>
            ))}
          </div>
        )}

        {rides.length > 0 && !loading && (
          <div className="grid gap-6">
            <h3 className="font-extrabold text-[#10233F] text-lg">Available Rides ({rides.length})</h3>
            {rides.map((ride) => {
              const available = ride.availableSeats - ride.bookedSeats;
              return (
                <div key={ride.id} className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all group">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between">
                    
                    {/* Left: Timeline & Route */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-[#EEF5FF] text-[#2563EB] border border-[#BFDBFE] px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5">
                          <CalendarDays size={16} />
                          {formatDate(ride.pickupAt)}
                        </span>
                        <span className="bg-[#F1F5F9] text-[#10233F] border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5">
                          <Clock size={16} className="text-[#64748B]" />
                          {formatTime(ride.pickupAt)}
                        </span>
                        {ride.femaleOnly && (
                          <span className="bg-[#FEF2F2] text-[#DC2626] px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 border border-[#FECACA]">
                            <ShieldCheck size={16} />
                            Female Only
                          </span>
                        )}
                      </div>

                      <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
                        <div className="relative">
                          <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#16A085] shadow-sm z-10"></div>
                          <p className="font-bold text-[#10233F] text-lg leading-tight">{ride.sourceAddress}</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#2563EB] shadow-sm z-10"></div>
                          <p className="font-bold text-[#10233F] text-lg leading-tight">{ride.destinationAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Info & Action */}
                    <div className="flex flex-row md:flex-col justify-between items-end md:w-48 shrink-0 md:pl-6 md:border-l border-[#E2E8F0]">
                      <div className="text-left md:text-right w-full md:w-auto">
                        <div className="flex items-center md:justify-end gap-1 text-[#64748B] font-bold mb-1">
                          <IndianRupee size={16} />
                          <span className="text-2xl font-extrabold text-[#16A085]">{Number(ride.pricePerSeat).toFixed(2)}</span>
                          <span className="text-sm">/ seat</span>
                        </div>
                        <div className="flex items-center md:justify-end gap-1.5 text-sm font-bold mb-4">
                          <Users size={16} className={available > 0 ? "text-[#2563EB]" : "text-[#DC2626]"} />
                          <span className={available > 0 ? "text-[#2563EB]" : "text-[#DC2626]"}>
                            {available} {available === 1 ? 'seat' : 'seats'} left
                          </span>
                        </div>
                        
                        {ride.driver && (
                          <div className="flex items-center md:justify-end gap-2 text-sm mt-4 md:mt-0 bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                            <div className="w-6 h-6 rounded-full bg-[#EEF5FF] text-[#2563EB] font-bold flex items-center justify-center text-[10px] border border-[#BFDBFE]">
                              {ride.driver.name.charAt(0)}
                            </div>
                            <span className="font-bold text-[#10233F] truncate max-w-[100px]">{ride.driver.name}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setBookingRideId(ride.id)}
                        disabled={available <= 0}
                        className="mt-4 md:mt-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none whitespace-nowrap flex items-center gap-2 w-full md:w-auto justify-center group active:scale-[0.98]"
                      >
                        Request Seat
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingRide && (
        <div className="fixed inset-0 bg-[#10233F]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="text-xl font-extrabold text-[#10233F]">Request to Join</h3>
              <button onClick={() => setBookingRideId(null)} className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#16A085]" />
                  <span className="font-bold text-[#10233F] line-clamp-1">{bookingRide.sourceAddress}</span>
                </div>
                <div className="pl-2 border-l-2 border-[#E2E8F0] h-2 ml-1.5"></div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#2563EB]" />
                  <span className="font-bold text-[#10233F] line-clamp-1">{bookingRide.destinationAddress}</span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">How many seats?</label>
                <select 
                  value={seatsToBook} 
                  onChange={(e) => setSeatsToBook(Number(e.target.value))}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none font-bold text-[#10233F] shadow-sm"
                >
                  {Array.from({ length: bookingRide.availableSeats - bookingRide.bookedSeats }).map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} Seat{i > 0 && 's'}</option>
                  ))}
                </select>
              </div>

              <div className="bg-[#ECFDF5] p-4 rounded-xl border border-[#A7F3D0] flex justify-between items-center shadow-sm">
                <span className="font-bold text-[#065F46]">Total Amount</span>
                <span className="text-2xl font-extrabold text-[#065F46] flex items-center">
                  ₹{(Number(bookingRide.pricePerSeat) * seatsToBook).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button 
                onClick={() => setBookingRideId(null)}
                className="px-6 py-3 text-[#64748B] font-bold hover:text-[#10233F] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBook}
                disabled={bookingLoading}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]"
              >
                {bookingLoading ? "Requesting..." : "Confirm Request"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function FindRidePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#64748B] font-bold animate-pulse">Loading search interface...</div>}>
      <FindRideContent />
    </Suspense>
  );
}

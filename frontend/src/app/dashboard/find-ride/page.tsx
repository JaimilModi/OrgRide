"use client";

import { useState, useEffect } from "react";
import { searchRides, bookRide } from "@/lib/api";
import { Ride } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { Search, MapPin, CalendarDays, CarFront, Users, IndianRupee, ArrowRight, X, Clock, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
      // Auto-trigger search if we came from overview quick search
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
      // Refresh available seats locally or just let them wait
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search Header */}
      <div>
        <h2 className="text-[28px] font-extrabold text-text-main tracking-tight">Find a Ride</h2>
        <p className="text-text-sub font-medium mt-1">Enter your commute details to discover available rides.</p>
      </div>

      {/* Search Panel */}
      <div className="bg-surface-main p-6 rounded-[24px] border border-border-subtle shadow-sm relative z-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">From</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
              <input
                type="text"
                placeholder="Source location"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium placeholder:font-normal bg-bg-page focus:bg-surface-main"
                value={searchParams.source}
                onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">To</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub" />
              <input
                type="text"
                placeholder="Destination"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium placeholder:font-normal bg-bg-page focus:bg-surface-main"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Date</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub" />
              <input
                type="date"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium bg-bg-page focus:bg-surface-main"
                value={searchParams.pickupDate}
                onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 h-[50px]"
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
              <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 text-primary-200">
                <path d="M40 160C40 160 70 120 100 120C130 120 160 160 160 160" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"/>
                <circle cx="40" cy="160" r="12" fill="currentColor"/>
                <circle cx="160" cy="160" r="12" fill="currentColor"/>
                <rect x="70" y="40" width="60" height="40" rx="8" stroke="currentColor" strokeWidth="4"/>
                <circle cx="85" cy="80" r="8" fill="currentColor"/>
                <circle cx="115" cy="80" r="8" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Ready to Commute?</h3>
            <p className="text-text-sub max-w-sm mx-auto">Enter your route details above to discover available rides from your workplace network.</p>
          </div>
        )}

        {hasSearched && !loading && rides.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
            <div className="w-20 h-20 bg-surface-sub rounded-full flex items-center justify-center mb-6 border border-border-subtle">
              <Search size={32} className="text-text-sub opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">No matching rides found</h3>
            <p className="text-text-sub max-w-sm mx-auto">We couldn't find any rides matching your criteria. Try adjusting your dates or destinations.</p>
          </div>
        )}

        {loading && (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-main h-48 rounded-[24px] border border-border-subtle animate-pulse"></div>
            ))}
          </div>
        )}

        {rides.length > 0 && !loading && (
          <div className="grid gap-6">
            <h3 className="font-bold text-text-main text-lg">Available Rides ({rides.length})</h3>
            {rides.map((ride) => {
              const available = ride.availableSeats - ride.bookedSeats;
              return (
                <div key={ride.id} className="bg-surface-main p-6 rounded-[24px] border border-border-subtle shadow-sm hover:shadow-md hover:border-primary-200 transition-all group">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between">
                    
                    {/* Left: Timeline & Route */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5">
                          <CalendarDays size={16} />
                          {formatDate(ride.pickupAt)}
                        </span>
                        <span className="bg-surface-sub text-text-main px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 border border-border-subtle">
                          <Clock size={16} />
                          {formatTime(ride.pickupAt)}
                        </span>
                        {ride.femaleOnly && (
                          <span className="bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 border border-pink-100">
                            <ShieldCheck size={16} />
                            Female Only
                          </span>
                        )}
                      </div>

                      <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
                        <div className="relative">
                          <div className="absolute -left-9 top-0.5 w-5 h-5 rounded-full bg-surface-main border-[4px] border-primary-500 shadow-sm z-10"></div>
                          <p className="font-semibold text-text-main text-lg leading-tight">{ride.sourceAddress}</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-9 top-0.5 w-5 h-5 rounded-full bg-surface-main border-[4px] border-danger-main shadow-sm z-10"></div>
                          <p className="font-semibold text-text-main text-lg leading-tight">{ride.destinationAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Info & Action */}
                    <div className="flex flex-row md:flex-col justify-between items-end md:w-48 shrink-0 md:pl-6 md:border-l border-border-subtle">
                      <div className="text-left md:text-right w-full md:w-auto">
                        <div className="flex items-center md:justify-end gap-1 text-text-sub font-medium mb-1">
                          <IndianRupee size={16} />
                          <span className="text-2xl font-extrabold text-primary-700">{Number(ride.pricePerSeat).toFixed(2)}</span>
                          <span className="text-sm">/ seat</span>
                        </div>
                        <div className="flex items-center md:justify-end gap-1.5 text-text-sub text-sm font-semibold mb-4">
                          <Users size={16} className={available > 0 ? "text-primary-500" : "text-danger-main"} />
                          <span className={available > 0 ? "text-primary-700" : "text-danger-main"}>
                            {available} {available === 1 ? 'seat' : 'seats'} left
                          </span>
                        </div>
                        
                        {ride.driver && (
                          <div className="flex items-center md:justify-end gap-2 text-sm mt-4 md:mt-0 bg-surface-sub p-2 rounded-xl border border-border-subtle">
                            <div className="w-6 h-6 rounded-full bg-primary-200 text-primary-900 font-bold flex items-center justify-center text-[10px]">
                              {ride.driver.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-text-main truncate max-w-[100px]">{ride.driver.name}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setBookingRideId(ride.id)}
                        disabled={available <= 0}
                        className="mt-4 md:mt-6 bg-primary-900 hover:bg-primary-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-primary-900/20 disabled:opacity-50 disabled:shadow-none whitespace-nowrap flex items-center gap-2 w-full md:w-auto justify-center group"
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
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface-main rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-sub">
              <h3 className="text-xl font-bold text-text-main">Request to Join</h3>
              <button onClick={() => setBookingRideId(null)} className="p-1.5 text-text-sub hover:bg-border-subtle rounded-lg transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-surface-sub p-4 rounded-xl border border-border-subtle space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-600" />
                  <span className="font-semibold text-text-main line-clamp-1">{bookingRide.sourceAddress}</span>
                </div>
                <div className="pl-2 border-l-2 border-border-subtle h-2 ml-1.5"></div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-danger-main" />
                  <span className="font-semibold text-text-main line-clamp-1">{bookingRide.destinationAddress}</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">How many seats?</label>
                <select 
                  value={seatsToBook} 
                  onChange={(e) => setSeatsToBook(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-bg-page focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-semibold text-text-main"
                >
                  {Array.from({ length: bookingRide.availableSeats - bookingRide.bookedSeats }).map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} Seat{i > 0 && 's'}</option>
                  ))}
                </select>
              </div>

              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex justify-between items-center">
                <span className="font-bold text-primary-800">Total Amount</span>
                <span className="text-2xl font-extrabold text-primary-700 flex items-center">
                  ₹{(Number(bookingRide.pricePerSeat) * seatsToBook).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-border-subtle bg-surface-sub flex justify-end gap-3">
              <button 
                onClick={() => setBookingRideId(null)}
                className="px-6 py-2.5 text-text-main font-bold hover:bg-border-subtle rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBook}
                disabled={bookingLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-2.5 rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:opacity-50 flex items-center gap-2"
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
    <Suspense fallback={<div className="p-8 text-center text-text-sub font-medium animate-pulse">Loading search interface...</div>}>
      <FindRideContent />
    </Suspense>
  );
}

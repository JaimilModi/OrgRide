"use client";

import { useEffect, useState } from "react";
import { getUser, getMyBookings, getWallet } from "@/lib/api";
import { Employee, Booking, Wallet } from "@/types";
import { ArrowRight, MapPin, Search, WalletCards, CarFront, CalendarDays, IndianRupee, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const [user, setUser] = useState<Employee | null>(null);
  const [upcomingRide, setUpcomingRide] = useState<Booking | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [searchParams, setSearchParams] = useState({ source: "", destination: "" });

  useEffect(() => {
    setUser(getUser());
    const loadOverviewData = async () => {
      try {
        const [bookingsData, walletData] = await Promise.all([
          getMyBookings(),
          getWallet()
        ]);
        
        // Find nearest upcoming accepted or pending booking
        if (bookingsData && bookingsData.length > 0) {
          const activeBookings = bookingsData.filter((b: Booking) => b.status === "ACCEPTED" || b.status === "PENDING");
          // Sort by pickup date (closest first)
          activeBookings.sort((a: Booking, b: Booking) => 
            new Date(a.ride?.pickupAt || 0).getTime() - new Date(b.ride?.pickupAt || 0).getTime()
          );
          if (activeBookings.length > 0) setUpcomingRide(activeBookings[0]);
        }
        
        if (walletData) setWallet(walletData);
      } catch (e) {
        console.error("Failed to load overview", e);
      } finally {
        setLoading(false);
      }
    };
    loadOverviewData();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (searchParams.source) qs.set("source", searchParams.source);
    if (searchParams.destination) qs.set("destination", searchParams.destination);
    router.push(`/dashboard/find-ride?${qs.toString()}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[28px] font-extrabold text-text-main tracking-tight">
          {getGreeting()}, {user?.name.split(" ")[0] || "there"}
        </h2>
        <p className="text-text-sub font-medium text-lg">Ready for your next commute?</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column (Search & Actions) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Search Card */}
          <div className="bg-surface-main p-8 rounded-[24px] border border-border-subtle shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity"></div>
            <h3 className="text-xl font-bold text-text-main mb-6">Where are you heading?</h3>
            <form onSubmit={handleQuickSearch} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Pickup Point</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
                  <input
                    type="text"
                    placeholder="Enter source location"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium placeholder:text-text-sub/50"
                    value={searchParams.source}
                    onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-2">Drop Point</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub" />
                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border-subtle bg-bg-page focus:bg-surface-main focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium placeholder:text-text-sub/50"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary-900 hover:bg-primary-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-primary-900/20 flex items-center justify-center gap-2 h-[52px] w-full md:w-auto"
              >
                <Search size={18} />
                Search
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/find-ride" className="bg-surface-main p-5 rounded-2xl border border-border-subtle hover:border-primary-300 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                <Search size={22} />
              </div>
              <span className="font-semibold text-text-main text-sm">Find Ride</span>
            </Link>
            <Link href="/dashboard/rides" className="bg-surface-main p-5 rounded-2xl border border-border-subtle hover:border-primary-300 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <CarFront size={22} />
              </div>
              <span className="font-semibold text-text-main text-sm">My Bookings</span>
            </Link>
            <Link href="/dashboard/wallet" className="bg-surface-main p-5 rounded-2xl border border-border-subtle hover:border-primary-300 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <WalletCards size={22} />
              </div>
              <span className="font-semibold text-text-main text-sm">Wallet</span>
            </Link>
            <Link href="/dashboard/profile" className="bg-surface-main p-5 rounded-2xl border border-border-subtle hover:border-primary-300 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <UserRound size={22} />
              </div>
              <span className="font-semibold text-text-main text-sm">Profile</span>
            </Link>
          </div>
        </div>

        {/* Right Column (Upcoming & Wallet) */}
        <div className="space-y-6">
          
          {/* Upcoming Ride */}
          <div className="bg-surface-main rounded-[24px] border border-border-subtle shadow-sm flex flex-col h-[320px]">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-bold text-text-main">Upcoming Commute</h3>
              <CarFront size={20} className="text-text-sub" />
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-center">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-surface-sub rounded w-3/4"></div>
                  <div className="h-4 bg-surface-sub rounded w-1/2"></div>
                </div>
              ) : upcomingRide && upcomingRide.ride ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${upcomingRide.status === 'ACCEPTED' ? 'bg-primary-100 text-primary-800' : 'bg-orange-100 text-orange-800'}`}>
                      {upcomingRide.status}
                    </span>
                    <span className="text-sm font-semibold text-text-sub flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {new Date(upcomingRide.ride.pickupAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-surface-main border-[3px] border-primary-500 shadow-sm z-10"></div>
                      <p className="font-semibold text-text-main leading-snug">{upcomingRide.ride.sourceAddress}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-surface-main border-[3px] border-danger-main shadow-sm z-10"></div>
                      <p className="font-semibold text-text-main leading-snug">{upcomingRide.ride.destinationAddress}</p>
                    </div>
                  </div>

                  <Link href="/dashboard/rides" className="w-full flex items-center justify-center gap-2 bg-surface-sub hover:bg-border-subtle text-text-main font-semibold py-2.5 rounded-xl transition-colors">
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-surface-sub rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={24} className="text-text-sub opacity-50" />
                  </div>
                  <h4 className="font-bold text-text-main">No upcoming ride yet</h4>
                  <p className="text-sm text-text-sub mt-1 max-w-[200px] mx-auto">Find colleagues travelling your route and plan your next commute.</p>
                  <Link href="/dashboard/find-ride" className="inline-flex items-center font-bold text-primary-600 hover:text-primary-700 mt-4 text-sm">
                    Find a Ride <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Snapshot */}
          <div className="bg-primary-900 rounded-[24px] p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[20px] border-primary-800 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-primary-100 font-medium">Wallet Balance</h3>
                <WalletCards size={20} className="text-primary-300" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-primary-300 text-2xl font-bold">₹</span>
                <span className="text-white text-4xl font-extrabold tracking-tight">
                  {loading ? "..." : wallet ? Number(wallet.balance).toFixed(2) : "0.00"}
                </span>
              </div>
              <Link href="/dashboard/wallet" className="inline-flex items-center text-sm font-bold text-primary-300 hover:text-primary-100 mt-6 transition-colors group-hover:gap-2">
                Manage Wallet
                <ArrowRight size={14} className="ml-1.5 transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

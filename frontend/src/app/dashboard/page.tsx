"use client";

import { useEffect, useState } from "react";
import { getUser, getMyBookings, getWallet } from "@/lib/api";
import { Employee, Booking, Wallet } from "@/types";
import { ArrowRight, MapPin, Search, WalletCards, CarFront, CalendarDays, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
        
        if (bookingsData && bookingsData.length > 0) {
          const activeBookings = bookingsData.filter((b: Booking) => b.status === "ACCEPTED" || b.status === "PENDING");
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 font-sans">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[28px] font-extrabold text-[#10233F] tracking-tight">
          {getGreeting()}, {user?.name.split(" ")[0] || "there"}
        </h2>
        <p className="text-[#64748B] font-medium text-lg">Ready for your next commute?</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column (Search & Actions) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Search Card */}
          <div className="bg-white p-8 rounded-[24px] border border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#EEF5FF] rounded-full blur-[80px] -z-10 transition-colors"></div>
            <h3 className="text-xl font-extrabold text-[#10233F] mb-6">Where are you heading?</h3>
            <form onSubmit={handleQuickSearch} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Pickup Point</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]" />
                  <input
                    type="text"
                    placeholder="Enter source location"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-medium text-[#10233F] placeholder:text-[#94A3B8] shadow-sm"
                    value={searchParams.source}
                    onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Drop Point</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all font-medium text-[#10233F] placeholder:text-[#94A3B8] shadow-sm"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 h-[52px] w-full md:w-auto"
              >
                <Search size={18} />
                Search
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/dashboard/find-ride", icon: Search, label: "Find Ride" },
              { href: "/dashboard/rides", icon: CarFront, label: "My Bookings" },
              { href: "/dashboard/wallet", icon: WalletCards, label: "Wallet" },
              { href: "/dashboard/profile", icon: UserRound, label: "Profile" }
            ].map((action, i) => (
              <Link key={i} href={action.href} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:shadow-sm transition-all group flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 bg-[#EEF5FF] border border-[#BFDBFE] rounded-full flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-all shadow-sm">
                  <action.icon size={22} />
                </div>
                <span className="font-bold text-[#10233F] text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column (Upcoming & Wallet) */}
        <div className="space-y-6">
          
          {/* Upcoming Ride */}
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm flex flex-col h-[320px]">
            <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-extrabold text-[#10233F]">Upcoming Commute</h3>
              <CarFront size={20} className="text-[#2563EB]" />
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-center">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-[#E2E8F0] rounded w-3/4"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-1/2"></div>
                </div>
              ) : upcomingRide && upcomingRide.ride ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                      upcomingRide.status === 'ACCEPTED' ? 'bg-[#16A085]/10 text-[#16A085] border-[#16A085]/30' : 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30'
                    )}>
                      {upcomingRide.status}
                    </span>
                    <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-[#2563EB]" />
                      {new Date(upcomingRide.ride.pickupAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-white border-[2px] border-[#16A085] shadow-sm z-10"></div>
                      <p className="font-bold text-[#10233F] leading-snug">{upcomingRide.ride.sourceAddress}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-white border-[2px] border-[#2563EB] shadow-sm z-10"></div>
                      <p className="font-bold text-[#10233F] leading-snug">{upcomingRide.ride.destinationAddress}</p>
                    </div>
                  </div>

                  <Link href="/dashboard/rides" className="w-full flex items-center justify-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#10233F] font-bold py-2.5 rounded-xl transition-colors border border-[#CBD5E1]">
                    View Details
                    <ArrowRight size={16} className="text-[#2563EB]" />
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
                    <MapPin size={24} className="text-[#94A3B8]" />
                  </div>
                  <h4 className="font-extrabold text-[#10233F]">No upcoming ride yet</h4>
                  <p className="text-sm text-[#64748B] mt-1 max-w-[200px] mx-auto font-medium">Find colleagues travelling your route and plan your next commute.</p>
                  <Link href="/dashboard/find-ride" className="inline-flex items-center font-bold text-[#2563EB] hover:text-[#1D4ED8] mt-4 text-sm transition-colors">
                    Find a Ride <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Snapshot */}
          <div className="bg-gradient-to-br from-[#2563EB] to-[#0891B2] rounded-[24px] p-6 shadow-md relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[2px] border-white/20 rounded-full blur-[2px] group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/80 font-bold">Wallet Balance</h3>
                <WalletCards size={20} className="text-white" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white/80 text-2xl font-extrabold">₹</span>
                <span className="text-white text-4xl font-extrabold tracking-tight">
                  {loading ? "..." : wallet ? Number(wallet.balance).toFixed(2) : "0.00"}
                </span>
              </div>
              <Link href="/dashboard/wallet" className="inline-flex items-center text-sm font-bold text-white hover:text-white/80 mt-6 transition-colors group-hover:gap-2">
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

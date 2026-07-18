"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/api";
import { Employee } from "@/types";
import { Menu } from "lucide-react";

export function TopBar() {
  const [user, setUser] = useState<Employee | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return { title: "Overview", subtitle: "Welcome back to OrgRide" };
    if (pathname === "/dashboard/find-ride") return { title: "Find a Ride", subtitle: "Search for available commutes" };
    if (pathname === "/dashboard/rides") return { title: "My Rides", subtitle: "Manage your bookings and requests" };
    if (pathname === "/dashboard/wallet") return { title: "Wallet", subtitle: "Balance and transaction history" };
    if (pathname === "/dashboard/profile") return { title: "Profile", subtitle: "Manage your account settings" };
    return { title: "Dashboard", subtitle: "" };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="h-[72px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sm:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-[20px] font-extrabold text-[#10233F] tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#64748B] font-medium">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3 bg-[#F7F9FC] py-1.5 pl-1.5 pr-4 rounded-full border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all cursor-pointer shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#10233F] leading-tight">{user.name}</span>
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

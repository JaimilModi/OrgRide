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
    <header className="h-[88px] bg-bg-page/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 sm:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-text-sub hover:bg-surface-sub rounded-lg">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-[22px] font-bold text-text-main tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-text-sub mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 bg-surface-main py-1.5 pl-1.5 pr-4 rounded-full border border-border-subtle shadow-sm">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main leading-tight">{user.name}</span>
              <span className="text-[11px] font-medium text-text-sub uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

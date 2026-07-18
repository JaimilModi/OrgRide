"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/api";
import { LayoutDashboard, Search, CarFront, WalletCards, UserRound, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
    { name: "Find a Ride", href: "/dashboard/find-ride", icon: <Search size={20} strokeWidth={2.5} /> },
    { name: "My Rides", href: "/dashboard/rides", icon: <CarFront size={20} strokeWidth={2.5} /> },
    { name: "Wallet", href: "/dashboard/wallet", icon: <WalletCards size={20} strokeWidth={2.5} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <UserRound size={20} strokeWidth={2.5} /> },
  ];

  return (
    <aside className="w-[260px] bg-white text-[#10233F] flex flex-col min-h-screen sticky top-0 hidden md:flex border-r border-[#E2E8F0] z-20 shadow-sm">
      <div className="p-6 pb-4 border-b border-[#E2E8F0]">
        <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity group">
          <Image
            src="/branding/orgride-logo-transparent.png"
            alt="OrgRide"
            width={120}
            height={48}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm",
                isActive
                  ? "bg-[#EEF5FF] text-[#2563EB] border-l-[3px] border-[#2563EB] pl-3"
                  : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#10233F]"
              )}
            >
              <div className={cn("transition-colors", isActive ? "text-[#2563EB]" : "text-[#64748B]")}>
                {link.icon}
              </div>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E2E8F0]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#DC2626] hover:bg-red-50 hover:border-red-100 border border-transparent rounded-xl transition-all font-semibold text-sm group"
        >
          <LogOut size={18} strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

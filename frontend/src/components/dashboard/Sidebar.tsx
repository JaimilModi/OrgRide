"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/api";
import { LayoutDashboard, Search, CarFront, WalletCards, UserRound, LogOut, Hexagon } from "lucide-react";

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
    <aside className="w-[260px] bg-primary-900 text-white flex flex-col min-h-screen sticky top-0 hidden md:flex shadow-2xl shadow-primary-950/20 z-20">
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="text-[22px] font-extrabold tracking-tight text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Hexagon size={24} className="text-primary-900 fill-primary-100" />
          </div>
          OrgRide
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold text-sm ${
                isActive
                  ? "bg-primary-800 text-primary-400 shadow-inner border border-primary-700/50"
                  : "text-primary-100/70 hover:bg-primary-800/50 hover:text-white"
              }`}
            >
              <div className={`${isActive ? "text-primary-400" : "text-primary-300/50"}`}>
                {link.icon}
              </div>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-danger-main hover:bg-danger-main/10 rounded-xl transition-colors font-semibold text-sm group"
        >
          <LogOut size={20} strokeWidth={2.5} className="group-hover:text-danger-main/80 text-danger-main/70 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

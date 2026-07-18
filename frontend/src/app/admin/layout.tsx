"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUser, logout } from "@/lib/api";
import { ToastProvider } from "@/components/ui/Toast";
import { LayoutDashboard, Building2, ShieldAlert, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/signin");
      return;
    }
    if (user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    setAdmin(user);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#F7F9FC] text-[#64748B] flex items-center justify-center font-bold">Loading Admin Portal...</div>;
  }

  const links = [
    { name: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
    { name: "Organization", href: "/admin/organization", icon: <Building2 size={20} strokeWidth={2.5} /> },
    { name: "Reports & Safety", href: "/admin/reports", icon: <ShieldAlert size={20} strokeWidth={2.5} /> },
  ];

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return { title: "Admin Overview", subtitle: "Operational Command Centre" };
    if (pathname === "/admin/organization") return { title: "Organization Settings", subtitle: "Manage workspace parameters" };
    if (pathname === "/admin/reports") return { title: "Reports & Safety", subtitle: "Manage network incidents" };
    return { title: "Admin Portal", subtitle: "" };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#F7F9FC] text-[#10233F] font-sans selection:bg-[#2563EB]/20 selection:text-[#10233F]">
        
        {/* Admin Sidebar */}
        <aside className="w-[260px] bg-[#F8FAFC] border-r border-[#E2E8F0] text-[#10233F] flex flex-col min-h-screen sticky top-0 hidden md:flex z-20 shadow-sm">
          <div className="p-6 pb-4">
            <Link href="/admin/dashboard" className="flex items-center hover:opacity-80 transition-opacity group mb-3">
              <Image
                src="/branding/orgride-logo-transparent.png"
                alt="OrgRide"
                width={120}
                height={48}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <div className="inline-flex items-center gap-1.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
              <ShieldCheck size={14} /> Admin Portal
            </div>
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
                      : "text-[#64748B] hover:bg-white hover:text-[#10233F] hover:shadow-sm"
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
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] font-bold text-xs shadow-sm">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-[#10233F] truncate">{admin?.name}</span>
                <span className="text-[10px] text-[#D97706] font-bold uppercase">{admin?.employeeId}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#DC2626] hover:bg-red-50 hover:border-red-100 border border-transparent rounded-xl transition-all font-semibold text-sm group"
            >
              <LogOut size={18} strokeWidth={2.5} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Admin Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <header className="h-[72px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sm:px-8 sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-[20px] font-extrabold text-[#10233F] tracking-tight leading-tight">{title}</h1>
              {subtitle && <p className="text-sm text-[#64748B] font-medium">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-[#FEF3C7] text-[#D97706] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#FDE68A] shadow-sm">
                <ShieldCheck size={16} /> Admin Authenticated
              </span>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-8 max-w-[1440px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

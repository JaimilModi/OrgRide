"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getUser, logout } from "@/lib/api";
import { ToastProvider } from "@/components/ui/Toast";
import { LayoutDashboard, Building2, ShieldAlert, LogOut, Hexagon, ShieldCheck } from "lucide-react";

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
    return <div className="min-h-screen bg-bg-page flex items-center justify-center">Loading Admin Portal...</div>;
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
      <div className="flex min-h-screen bg-bg-page text-text-main font-sans selection:bg-primary-200">
        
        {/* Admin Sidebar */}
        <aside className="w-[260px] bg-neutral-900 text-white flex flex-col min-h-screen sticky top-0 hidden md:flex shadow-2xl z-20">
          <div className="p-8 pb-4">
            <Link href="/admin/dashboard" className="text-[22px] font-extrabold tracking-tight text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Hexagon size={24} className="text-primary-900 fill-primary-100" />
              </div>
              OrgRide
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-neutral-800 text-primary-400 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> Admin Portal
            </div>
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
                      ? "bg-neutral-800 text-white shadow-inner"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                  }`}
                >
                  <div className={`${isActive ? "text-primary-400" : "text-neutral-500"}`}>
                    {link.icon}
                  </div>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-neutral-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-primary-400 font-bold text-xs">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">{admin?.name}</span>
                <span className="text-[10px] text-neutral-400 uppercase">{admin?.employeeId}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl transition-colors font-semibold text-sm group"
            >
              <LogOut size={20} strokeWidth={2.5} className="group-hover:text-danger-main transition-colors" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Admin Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <header className="h-[88px] bg-bg-page/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 sm:px-8 sticky top-0 z-10">
            <div>
              <h1 className="text-[22px] font-bold text-text-main tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-text-sub mt-0.5 font-medium">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-primary-200">
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

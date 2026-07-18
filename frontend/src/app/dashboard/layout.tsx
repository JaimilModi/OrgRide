import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-bg-page text-text-main font-sans selection:bg-primary-200">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-6 sm:p-8 max-w-[1440px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

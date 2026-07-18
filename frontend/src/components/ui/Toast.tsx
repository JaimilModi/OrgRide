"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 font-sans">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border min-w-[300px] animate-in slide-in-from-bottom-5 fade-in duration-300",
              toast.type === "success" && "bg-white border-[#16A085]/20 text-[#10233F]",
              toast.type === "error" && "bg-white border-[#DC2626]/20 text-[#10233F]",
              toast.type === "info" && "bg-white border-[#2563EB]/20 text-[#10233F]"
            )}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#16A085] shrink-0" />}
            {toast.type === "error" && <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-[#2563EB] shrink-0" />}
            <span className="font-semibold text-sm tracking-wide">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              toast.type === "success"
                ? "bg-primary-50 border-primary-200 text-primary-900"
                : toast.type === "error"
                ? "bg-danger-sub border-danger-main/20 text-danger-main"
                : "bg-surface-sub border-border-subtle text-text-main"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
            {toast.type === "error" && <XCircle className="w-5 h-5 text-danger-main" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-primary-800" />}
            <span className="font-medium text-sm">{toast.message}</span>
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

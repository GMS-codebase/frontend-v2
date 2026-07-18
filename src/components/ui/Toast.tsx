"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

// Toast types
interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Exportable hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Global reference for calling toast.* outside components
let toastContextRef: ToastContextType | null = null;

// Global toast function
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    toastContextRef?.addToast({ type: "success", title, message, duration });
  },
  error: (title: string, message?: string, duration?: number) => {
    toastContextRef?.addToast({ type: "error", title, message, duration });
  },
  warning: (title: string, message?: string, duration?: number) => {
    toastContextRef?.addToast({ type: "warning", title, message, duration });
  },
  info: (title: string, message?: string, duration?: number) => {
    toastContextRef?.addToast({ type: "info", title, message, duration });
  },
};

// ToastProvider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Assign to global reference
  toastContextRef = { addToast, removeToast };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast container
const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map((toast) => (
      <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
    ))}
  </div>
);

// Toast item
const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400",
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`max-w-sm w-full border rounded-lg p-4 shadow-lg animate-slide-up ${colors[toast.type]}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColors[toast.type]}`} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => onRemove(toast.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

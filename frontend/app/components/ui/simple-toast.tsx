"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Baby,
  Sparkles,
  Clock,
} from "lucide-react";

type ToastVariant = "default" | "success" | "destructive" | "warning";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onOK?: () => void; // Add onOK callback
}

interface ToastContextType {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 3000,
    onOK,
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev,
      { id, title, description, variant, duration, onOK },
    ]);

    // Always set auto-dismiss timer regardless of onOK
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Blurred backdrop when toasts are present */}
      {toasts.length > 0 && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300" />
      )}

      {/* Toast container - centered */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <div className="flex flex-col gap-3 max-w-sm w-full mx-4">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={() => dismiss(toast.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </>,
    document.body,
  );
}

function Toast({
  toast,
  onDismiss,
  index,
}: {
  toast: Toast;
  onDismiss: () => void;
  index: number;
}) {
  const [timeLeft, setTimeLeft] = useState(
    Math.floor((toast.duration || 3000) / 1000),
  );
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const startTime = Date.now();
    const duration = toast.duration;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const secondsLeft = Math.ceil(remaining / 1000);
      const progressPercent = (remaining / duration) * 100;

      setTimeLeft(secondsLeft);
      setProgress(progressPercent);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [toast.duration]);

  const handleOKClick = () => {
    if (toast.onOK) {
      toast.onOK(); // Execute the callback first
    }
    onDismiss(); // Then dismiss the toast
  };

  const getIcon = () => {
    switch (toast.variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "destructive":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-[#1a9fb0]" />;
    }
  };

  const getGradient = () => {
    switch (toast.variant) {
      case "success":
        return "from-emerald-50 to-green-50 border-emerald-200";
      case "destructive":
        return "from-rose-50 to-red-50 border-rose-200";
      case "warning":
        return "from-amber-50 to-yellow-50 border-amber-200";
      default:
        return "from-[#e6f7ff] to-[#d1f0f6] border-[#b3e0ff]";
    }
  };

  const getAccentColor = () => {
    switch (toast.variant) {
      case "success":
        return "bg-emerald-500";
      case "destructive":
        return "bg-rose-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-[#1a9fb0]";
    }
  };

  const getButtonColor = () => {
    switch (toast.variant) {
      case "success":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "destructive":
        return "bg-rose-500 hover:bg-rose-600";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-[#1a9fb0] hover:bg-[#148a9a]";
    }
  };

  const getProgressColor = () => {
    switch (toast.variant) {
      case "success":
        return "bg-emerald-300";
      case "destructive":
        return "bg-rose-300";
      case "warning":
        return "bg-amber-300";
      default:
        return "bg-[#77c1e6]";
    }
  };

  return (
    <div
      className={`
        relative bg-gradient-to-br ${getGradient()} 
        rounded-xl shadow-2xl border overflow-hidden
        animate-in fade-in zoom-in duration-300
        backdrop-blur-sm pointer-events-auto
        w-full
      `}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Accent stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${getAccentColor()}`}
      />

      {/* Progress bar at top - ALWAYS show if duration exists */}
      {toast.duration && toast.duration > 0 && (
        <div
          className={`h-1 ${getProgressColor()} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
      <div className="absolute -left-2 -bottom-2 w-8 h-8 bg-white/30 rounded-full blur-lg" />

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Icon with decorative background */}
          <div
            className={`
            flex-shrink-0 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm 
            flex items-center justify-center shadow-sm
            ${toast.variant === "success" ? "text-emerald-500" : ""}
            ${toast.variant === "destructive" ? "text-rose-500" : ""}
            ${toast.variant === "warning" ? "text-amber-500" : ""}
            ${toast.variant === "default" ? "text-[#1a9fb0]" : ""}
          `}
          >
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4
                className={`
                font-semibold text-sm mb-0.5
                ${toast.variant === "success" ? "text-emerald-800" : ""}
                ${toast.variant === "destructive" ? "text-rose-800" : ""}
                ${toast.variant === "warning" ? "text-amber-800" : ""}
                ${toast.variant === "default" ? "text-[#1a3a5f]" : ""}
              `}
              >
                {toast.title === "Success" && "✨ "}
                {toast.title === "Error" && "⚠️ "}
                {toast.title === "Invalid Age" && "📅 "}
                {toast.title === "Validation Error" && "📝 "}
                {toast.title}
              </h4>
            )}
            {toast.description && (
              <p
                className={`
                text-xs leading-relaxed
                ${toast.variant === "success" ? "text-emerald-700" : ""}
                ${toast.variant === "destructive" ? "text-rose-700" : ""}
                ${toast.variant === "warning" ? "text-amber-700" : ""}
                ${toast.variant === "default" ? "text-gray-600" : ""}
              `}
              >
                {toast.description}
              </p>
            )}
          </div>

          {/* OK Button */}
          <button
            onClick={handleOKClick}
            className={`
              px-3 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap
              transition-all duration-200 hover:shadow-md
              ${getButtonColor()}
            `}
          >
            OK
          </button>
        </div>

        {/* Countdown timer text - ALWAYS show if timeLeft > 0 */}
        {toast.duration && toast.duration > 0 && timeLeft > 0 && (
          <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-400">
            <Clock className="w-3 h-3" />
            <span>
              Closes in {timeLeft} second{timeLeft !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

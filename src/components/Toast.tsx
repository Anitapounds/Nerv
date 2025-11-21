"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsAnimating(false);
          setTimeout(onClose, 300); // Wait for exit animation
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
          border: "border-green-500/50",
          icon: "✓",
          iconBg: "bg-green-500",
          text: "text-green-400",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500/10 to-rose-500/10",
          border: "border-red-500/50",
          icon: "✕",
          iconBg: "bg-red-500",
          text: "text-red-400",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10",
          border: "border-yellow-500/50",
          icon: "⚠",
          iconBg: "bg-yellow-500",
          text: "text-yellow-400",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
          border: "border-blue-500/50",
          icon: "ℹ",
          iconBg: "bg-blue-500",
          text: "text-blue-400",
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-md transition-all duration-300 ${
        isAnimating
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95"
      }`}
    >
      <div
        className={`${styles.bg} ${styles.border} border rounded-lg p-4 shadow-2xl backdrop-blur-sm`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`${styles.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
          >
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${styles.text} text-sm font-medium break-words whitespace-pre-wrap`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

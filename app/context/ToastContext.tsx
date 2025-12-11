"use client";

import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"], timeout?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  const addToast = useCallback((message: string, type: Toast["type"] = "info", timeout = 3000) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
    const toast: Toast = { id, message, type };
    setToasts((t) => [toast, ...t]);
    if (timeout > 0) setTimeout(() => removeToast(id), timeout);
  }, [removeToast]);

  const value = useMemo(() => ({ toasts, addToast, removeToast, clearAll }), [toasts, addToast, removeToast, clearAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        <div className="flex items-center justify-end">
          <button
            onClick={clearAll}
            className="text-xs text-gray-600 bg-white/80 backdrop-blur px-2 py-1 rounded-md shadow-sm hover:bg-white"
            aria-label="Clear toasts"
          >
            Clear
          </button>
        </div>

        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="max-w-xs w-full"
            >
              <div className={`rounded-md shadow-md px-4 py-3 text-sm font-serif text-white flex items-start justify-between ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}>
                <div className="pr-3">{t.message}</div>
                <button onClick={() => removeToast(t.id)} className="ml-2 text-white/90 px-1 py-0.5 rounded hover:opacity-80">×</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastContext;

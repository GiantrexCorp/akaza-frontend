'use client';

import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const typeStyles = {
  success: 'border-emerald-500/30 text-emerald-400',
  error: 'border-red-500/30 text-red-400',
  info: 'border-primary/30 text-primary',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-20 right-3 left-3 sm:left-auto sm:right-6 sm:top-28 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-5 py-3 bg-[var(--surface-card)] border ${typeStyles[toast.type]} shadow-2xl w-full sm:min-w-[300px] sm:max-w-[420px]`}>
      <Icon size={18} className="shrink-0" />
      <p className="text-sm font-sans text-[var(--text-secondary)] flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-sky-300 bg-sky-50/95 text-sky-900';
        let iconClass = 'text-sky-600';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-300 bg-white/95 text-emerald-950 shadow-md';
          iconClass = 'text-emerald-600';
        } else if (toast.type === 'warning' || toast.type === 'urgent') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-300 bg-white/95 text-amber-950 shadow-md';
          iconClass = 'text-amber-600';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-300 bg-white/95 text-red-950 shadow-md';
          iconClass = 'text-red-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-lg transition-all animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-xs tracking-wide uppercase opacity-90 mb-0.5">{toast.title}</div>}
              <div className="text-stone-800 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-600 p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;

import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Clock, Activity, FileCheck, Stethoscope } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function StatusBadge({ status, type = 'status', className = '' }) {
  const { t } = useLanguage();

  const getBadgeConfig = () => {
    const s = (status || '').toLowerCase();

    // Priority types
    if (s.includes('high')) {
      return {
        label: t('highPriority'),
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        icon: AlertTriangle
      };
    }
    if (s.includes('medium') || s.includes('med')) {
      return {
        label: t('mediumPriority'),
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        icon: AlertCircle
      };
    }
    if (s.includes('low')) {
      return {
        label: t('lowPriority'),
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: CheckCircle2
      };
    }

    // Status types
    if (s.includes('active')) {
      return {
        label: t('active'),
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500 animate-pulse',
        icon: Activity
      };
    }
    if (s.includes('review')) {
      return {
        label: t('underReview'),
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: Clock
      };
    }
    if (s.includes('follow')) {
      return {
        label: t('followUpStatus'),
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: Stethoscope
      };
    }
    if (s.includes('resolved') || s.includes('healthy') || s.includes('closed')) {
      return {
        label: t('resolved'),
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: CheckCircle2
      };
    }
    if (s.includes('prescribed')) {
      return {
        label: t('prescribed'),
        bg: 'bg-teal-50 text-teal-800 border-teal-200',
        dot: 'bg-teal-600',
        icon: FileCheck
      };
    }
    if (s.includes('draft')) {
      return {
        label: t('draft'),
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: Clock
      };
    }

    return {
      label: status,
      bg: 'bg-stone-50 text-stone-700 border-stone-200',
      dot: 'bg-stone-400',
      icon: Activity
    };
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide transition-all ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

export default StatusBadge;

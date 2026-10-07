import React from 'react';

const STATUS_CONFIGS = {
  critical: {
    bg: 'bg-red-50 text-[#ba1a1a] border-red-200',
    dot: 'bg-[#ba1a1a]',
    label: 'Critical'
  },
  warning: {
    bg: 'bg-amber-50 text-[#d97706] border-amber-200',
    dot: 'bg-[#d97706]',
    label: 'Warning'
  },
  approved: {
    bg: 'bg-emerald-50 text-[#00a859] border-emerald-200',
    dot: 'bg-[#00a859]',
    label: 'Approved'
  },
  'ai-optimized': {
    bg: 'bg-blue-50 text-[#005db7] border-blue-200',
    dot: 'bg-[#005db7]',
    label: 'AI-Optimized'
  },
  active: {
    bg: 'bg-indigo-50 text-[#0b3d91] border-indigo-200',
    dot: 'bg-[#0b3d91] animate-pulse',
    label: 'Active'
  },
  pending: {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
    label: 'Pending'
  },
  scheduled: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-600',
    label: 'Scheduled'
  },
  completed: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600',
    label: 'Completed'
  },
  normal: {
    bg: 'bg-emerald-50 text-[#00a859] border-emerald-200',
    dot: 'bg-[#00a859]',
    label: 'Normal'
  },
  caution: {
    bg: 'bg-amber-50 text-[#d97706] border-amber-200',
    dot: 'bg-[#d97706]',
    label: 'Caution'
  },
  degraded: {
    bg: 'bg-red-50 text-[#ba1a1a] border-red-200',
    dot: 'bg-[#ba1a1a]',
    label: 'Degraded'
  }
};

export default function StatusBadge({ status, text, size = 'md', className = '' }) {
  const normalizedKey = (status || '').toLowerCase().replace(/[\s_]+/g, '-');
  const config = STATUS_CONFIGS[normalizedKey] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
    label: text || status
  };

  const displayText = text || config.label;
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px] font-mono tracking-wider' 
    : 'px-2.5 py-1 text-xs font-mono tracking-wider';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border uppercase ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {displayText}
    </span>
  );
}

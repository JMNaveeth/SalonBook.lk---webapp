import React from 'react';

const STATUS_CONFIGS = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/80', dot: 'bg-amber-500' },
  accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/80', dot: 'bg-emerald-500' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/80', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/80', dot: 'bg-rose-500' },
  rescheduled: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200/80', dot: 'bg-sky-500' },
  completed: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', dot: 'bg-neutral-500' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/80', dot: 'bg-rose-400' },
  no_show: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/80', dot: 'bg-purple-500' },
  suspended: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-600' },
};

const Badge = ({ status, children }) => {
  const config = STATUS_CONFIGS[status?.toLowerCase()] || {
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
    border: 'border-neutral-200',
    dot: 'bg-neutral-400',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase shadow-xs ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
      <span>{children || status?.toUpperCase()?.replace('_', ' ')}</span>
    </span>
  );
};

export default Badge;

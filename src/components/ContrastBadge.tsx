import React from 'react';

interface ContrastBadgeProps {
  contrastRatio: number;
  className?: string;
  showDetails?: boolean;
}

export const ContrastBadge: React.FC<ContrastBadgeProps> = ({
  contrastRatio,
  className = '',
  showDetails = false,
}) => {
  let label = 'Low';
  let badgeBg = 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
  let dotBg = 'bg-rose-500';

  if (contrastRatio >= 7.0) {
    label = 'AAA';
    badgeBg = 'bg-[#34D399]/25 text-emerald-900 dark:text-emerald-300';
    dotBg = 'bg-[#34D399]';
  } else if (contrastRatio >= 4.5) {
    label = 'AA';
    badgeBg = 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300';
    dotBg = 'bg-teal-500';
  } else if (contrastRatio >= 3.0) {
    label = 'AA Large';
    badgeBg = 'bg-[#FBBF24]/25 text-amber-900 dark:text-amber-300';
    dotBg = 'bg-[#FBBF24]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-mono font-black border border-[#1E293B] dark:border-slate-700 shadow-[1px_1px_0px_0px_#1E293B] dark:shadow-[1px_1px_0px_0px_#020617] whitespace-nowrap flex-shrink-0 ${badgeBg} ${className}`}
      title={`WCAG 2.1 Contrast Ratio: ${contrastRatio}:1 (${label})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full border border-[#1E293B] dark:border-slate-800 flex-shrink-0 ${dotBg}`} />
      <span className="tracking-tight">{contrastRatio.toFixed(1)}:1</span>
      {showDetails && <span className="font-sans font-extrabold text-[9px] opacity-80">({label})</span>}
    </span>
  );
};

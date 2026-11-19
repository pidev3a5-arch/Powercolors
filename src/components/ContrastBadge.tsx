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
  let badgeClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  if (contrastRatio >= 7.0) {
    label = 'AAA';
    badgeClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (contrastRatio >= 4.5) {
    label = 'AA';
    badgeClasses = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
  } else if (contrastRatio >= 3.0) {
    label = 'AA Large';
    badgeClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${badgeClasses} ${className}`}
      title={`WCAG 2.1 Contrast Ratio: ${contrastRatio}:1 (${label})`}
    >
      <span>{contrastRatio}:1</span>
      {showDetails && <span className="opacity-75">• {label}</span>}
    </span>
  );
};

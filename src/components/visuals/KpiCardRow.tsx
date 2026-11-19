import React from 'react';
import { ArrowUpRight, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { StructuralColors } from '../../core/types';

interface KpiCardRowProps {
  dataColors: string[];
  structural: StructuralColors;
  isDarkCanvas: boolean;
}

export const KpiCardRow: React.FC<KpiCardRowProps> = ({
  dataColors,
  structural,
  isDarkCanvas,
}) => {
  const primaryColor = dataColors[0] || '#2563EB';
  const secondaryColor = dataColors[1] || '#7C3AED';

  const cardBgClass = isDarkCanvas
    ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-md'
    : 'bg-white border-slate-200/90 text-slate-900 shadow-xs';

  const subtextClass = isDarkCanvas ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {/* KPI 1: Total Revenue */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${subtextClass}`}>
            Total Revenue
          </span>
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight font-sans">
            $4,285,900
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${structural.good}20`,
                color: structural.good,
              }}
            >
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +12.4%
            </span>
            <span className={`text-[11px] ${subtextClass}`}>vs last year</span>
          </div>
        </div>
        {/* SVG Mini Sparkline */}
        <div className="mt-3 h-6 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M 0 16 Q 20 8 40 14 T 80 6 T 100 2"
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* KPI 2: YoY Growth Target */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${subtextClass}`}>
            YoY Growth
          </span>
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${structural.good}15`, color: structural.good }}
          >
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight font-sans">
            +18.6%
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${structural.good}20`,
                color: structural.good,
              }}
            >
              Above Target
            </span>
            <span className={`text-[11px] ${subtextClass}`}>Target: 15.0%</span>
          </div>
        </div>
        {/* Target Progress Bar */}
        <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: '85%', backgroundColor: structural.good }}
          />
        </div>
      </div>

      {/* KPI 3: Active Customers */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${subtextClass}`}>
            Active Customers
          </span>
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}
          >
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight font-sans">
            142,850
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${secondaryColor}20`,
                color: secondaryColor,
              }}
            >
              +4,210
            </span>
            <span className={`text-[11px] ${subtextClass}`}>new this month</span>
          </div>
        </div>
        {/* Accent Bar */}
        <div className="mt-3 flex items-center space-x-1">
          <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: dataColors[0] }} />
          <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: dataColors[1] }} />
          <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: dataColors[2] }} />
          <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: dataColors[3] }} />
        </div>
      </div>

      {/* KPI 4: Gross Margin */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${subtextClass}`}>
            Gross Margin
          </span>
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${structural.neutral}15`, color: structural.neutral }}
          >
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight font-sans">
            42.3%
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${structural.good}20`,
                color: structural.good,
              }}
            >
              +1.8% pts
            </span>
            <span className={`text-[11px] ${subtextClass}`}>QoQ expansion</span>
          </div>
        </div>
        {/* Margin Sparkline */}
        <div className="mt-3 h-6 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M 0 14 Q 30 18 60 8 T 100 4"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

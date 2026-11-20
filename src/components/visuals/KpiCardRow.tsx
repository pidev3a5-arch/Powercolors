import React from 'react';
import { ArrowUpRight, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { StructuralColors } from '../../core/types';

interface KpiCardRowProps {
  dataColors: string[];
  structural: StructuralColors;
  isDarkCanvas: boolean;
  fontFamily?: string;
}

export const KpiCardRow: React.FC<KpiCardRowProps> = ({
  dataColors,
  structural,
  isDarkCanvas,
  fontFamily,
}) => {
  const primaryColor = dataColors[0] || '#8B5CF6';
  const secondaryColor = dataColors[1] || '#F472B6';

  const cardBgClass = isDarkCanvas
    ? 'bg-slate-900 border-2 border-slate-700 text-slate-100 shadow-[4px_4px_0px_0px_#020617]'
    : 'bg-white border-2 border-[#1E293B] text-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B]';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full" style={{ fontFamily }}>
      {/* KPI 1: Total Revenue */}
      <div className={`p-4 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500">
            Total Revenue
          </span>
          <div
            className="w-8 h-8 rounded-full border-2 border-[#1E293B] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#1E293B]"
            style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
          >
            <DollarSign className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-heading font-black tracking-tight" style={{ fontFamily }}>
            $4,285,900
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-black px-2 py-0.5 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
              style={{
                backgroundColor: `${structural.good}30`,
                color: structural.good,
              }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3] mr-0.5" />
              +12.4%
            </span>
            <span className="text-[11px] font-bold text-slate-500">vs last year</span>
          </div>
        </div>
        <div className="mt-3.5 h-6 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M 0 16 Q 20 8 40 14 T 80 6 T 100 2"
              fill="none"
              stroke={primaryColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* KPI 2: YoY Growth Target */}
      <div className={`p-4 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500">
            YoY Growth
          </span>
          <div
            className="w-8 h-8 rounded-full border-2 border-[#1E293B] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#1E293B]"
            style={{ backgroundColor: structural.good, color: '#FFFFFF' }}
          >
            <TrendingUp className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-heading font-black tracking-tight" style={{ fontFamily }}>
            +18.6%
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-black px-2 py-0.5 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
              style={{
                backgroundColor: `${structural.good}30`,
                color: structural.good,
              }}
            >
              Above Target
            </span>
            <span className="text-[11px] font-bold text-slate-500">Target: 15.0%</span>
          </div>
        </div>
        <div className="mt-3.5 w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full border border-[#1E293B] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: '85%', backgroundColor: structural.good }}
          />
        </div>
      </div>

      {/* KPI 3: Active Customers */}
      <div className={`p-4 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500">
            Active Customers
          </span>
          <div
            className="w-8 h-8 rounded-full border-2 border-[#1E293B] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#1E293B]"
            style={{ backgroundColor: secondaryColor, color: '#FFFFFF' }}
          >
            <Users className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-heading font-black tracking-tight" style={{ fontFamily }}>
            142,850
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-black px-2 py-0.5 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
              style={{
                backgroundColor: `${secondaryColor}30`,
                color: secondaryColor,
              }}
            >
              +4,210
            </span>
            <span className="text-[11px] font-bold text-slate-500">new this month</span>
          </div>
        </div>
        <div className="mt-3.5 flex items-center space-x-1.5">
          <span className="h-2 flex-1 rounded-full border border-[#1E293B]" style={{ backgroundColor: dataColors[0] }} />
          <span className="h-2 flex-1 rounded-full border border-[#1E293B]" style={{ backgroundColor: dataColors[1] }} />
          <span className="h-2 flex-1 rounded-full border border-[#1E293B]" style={{ backgroundColor: dataColors[2] }} />
          <span className="h-2 flex-1 rounded-full border border-[#1E293B]" style={{ backgroundColor: dataColors[3] }} />
        </div>
      </div>

      {/* KPI 4: Gross Margin */}
      <div className={`p-4 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500">
            Gross Margin
          </span>
          <div
            className="w-8 h-8 rounded-full border-2 border-[#1E293B] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#1E293B]"
            style={{ backgroundColor: structural.neutral, color: '#FFFFFF' }}
          >
            <Percent className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-heading font-black tracking-tight" style={{ fontFamily }}>
            42.3%
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center text-xs font-black px-2 py-0.5 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
              style={{
                backgroundColor: `${structural.good}30`,
                color: structural.good,
              }}
            >
              +1.8% pts
            </span>
            <span className="text-[11px] font-bold text-slate-500">QoQ expansion</span>
          </div>
        </div>
        <div className="mt-3.5 h-6 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M 0 14 Q 30 18 60 8 T 100 4"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { CvdType } from '../../core/accessibility/types';
import { simulateCvd } from '../../core/accessibility/cvdSimulator';

interface VisualPreviewSimulatorProps {
  palette: string[];
  selectedCvd: CvdType;
}

export const VisualPreviewSimulator: React.FC<VisualPreviewSimulatorProps> = ({
  palette,
  selectedCvd,
}) => {
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  const simulatedColors = palette.map((c) => simulateCvd(c, selectedCvd));

  const isDark = previewTheme === 'dark';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const canvasBg = isDark ? '#0F172A' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#1E293B';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const mockCategories = [
    { label: 'North America', val: 78, color: simulatedColors[0] || '#2563EB', orig: palette[0] },
    { label: 'Europe HQ', val: 62, color: simulatedColors[1] || '#7C3AED', orig: palette[1] },
    { label: 'Asia Pacific', val: 45, color: simulatedColors[2] || '#059669', orig: palette[2] },
    { label: 'Latin America', val: 34, color: simulatedColors[3] || '#D97706', orig: palette[3] },
    { label: 'Middle East', val: 28, color: simulatedColors[4] || '#DB2777', orig: palette[4] },
  ];

  return (
    <div className="space-y-4">
      {/* Header & Theme Switcher */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] flex-wrap">
        <div>
          <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
            Live Power BI Visual Simulation
          </span>
          <p className="text-[11px] text-slate-500 font-bold">
            Simulated under <span className="text-[#8B5CF6] uppercase">{selectedCvd}</span> mode
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
          <button
            type="button"
            onClick={() => setPreviewTheme('light')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
              !isDark
                ? 'bg-white text-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Light Canvas
          </button>
          <button
            type="button"
            onClick={() => setPreviewTheme('dark')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
              isDark
                ? 'bg-[#1E293B] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Dark Canvas
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div
        className="p-5 rounded-2xl border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-colors"
        style={{ backgroundColor: canvasBg }}
      >
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div
            className="p-3.5 rounded-xl border shadow-xs flex items-center justify-between"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <div>
              <div className="text-[11px] font-bold" style={{ color: subtextColor }}>
                Total Revenue
              </div>
              <div className="text-xl font-heading font-black" style={{ color: textColor }}>
                $4.28M
              </div>
              <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2% vs target
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center border shadow-xs"
              style={{ backgroundColor: simulatedColors[0] || '#2563EB', borderColor: '#1E293B' }}
            >
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border shadow-xs flex items-center justify-between"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <div>
              <div className="text-[11px] font-bold" style={{ color: subtextColor }}>
                Active Customers
              </div>
              <div className="text-xl font-heading font-black" style={{ color: textColor }}>
                18,420
              </div>
              <div className="text-[10px] font-bold text-sky-500 flex items-center gap-1 mt-0.5">
                <Activity className="w-3 h-3" /> 98.4% retention
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center border shadow-xs"
              style={{ backgroundColor: simulatedColors[1] || '#7C3AED', borderColor: '#1E293B' }}
            >
              <Activity className="w-4 h-4 text-white" />
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border shadow-xs flex items-center justify-between"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <div>
              <div className="text-[11px] font-bold" style={{ color: subtextColor }}>
                Gross Margin
              </div>
              <div className="text-xl font-heading font-black" style={{ color: textColor }}>
                43.6%
              </div>
              <div className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +2.1 pts QoQ
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center border shadow-xs"
              style={{ backgroundColor: simulatedColors[2] || '#059669', borderColor: '#1E293B' }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart Simulation */}
          <div
            className="p-4 rounded-xl border shadow-xs space-y-3"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-heading font-black" style={{ color: textColor }}>
                  Regional Performance
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Power BI Bar Visual</span>
            </div>

            <div className="space-y-2 pt-1">
              {mockCategories.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span style={{ color: subtextColor }}>{cat.label}</span>
                    <span style={{ color: textColor }}>{cat.val}%</span>
                  </div>
                  <div className="w-full h-4.5 bg-slate-200 dark:bg-slate-700/60 rounded-md overflow-hidden relative border border-black/10">
                    <div
                      className="h-full rounded-md transition-all duration-300"
                      style={{
                        width: `${cat.val}%`,
                        backgroundColor: cat.color,
                      }}
                      title={`Original: ${cat.orig} → Simulated: ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart Simulation */}
          <div
            className="p-4 rounded-xl border shadow-xs space-y-3 flex flex-col justify-between"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#F472B6]" />
                <span className="text-xs font-heading font-black" style={{ color: textColor }}>
                  Product Category Distribution
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Donut Visual</span>
            </div>

            {/* SVG Donut Visual representation */}
            <div className="flex items-center justify-center py-2 gap-4 flex-wrap">
              <svg viewBox="0 0 100 100" className="w-32 h-32">
                <circle cx="50" cy="50" r="35" fill="none" stroke={simulatedColors[0]} strokeWidth="18" strokeDasharray="60 160" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="35" fill="none" stroke={simulatedColors[1]} strokeWidth="18" strokeDasharray="45 175" strokeDashoffset="-60" />
                <circle cx="50" cy="50" r="35" fill="none" stroke={simulatedColors[2]} strokeWidth="18" strokeDasharray="40 180" strokeDashoffset="-105" />
                <circle cx="50" cy="50" r="35" fill="none" stroke={simulatedColors[3]} strokeWidth="18" strokeDasharray="35 185" strokeDashoffset="-145" />
                <circle cx="50" cy="50" r="35" fill="none" stroke={simulatedColors[4]} strokeWidth="18" strokeDasharray="40 180" strokeDashoffset="-180" />
                <text x="50" y="53" textAnchor="middle" fontSize="11" fontWeight="bold" fill={textColor}>
                  100%
                </text>
              </svg>

              {/* Legend */}
              <div className="space-y-1.5 text-[11px] font-bold">
                {mockCategories.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border border-black/20" style={{ backgroundColor: cat.color }} />
                    <span style={{ color: subtextColor }}>{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { LayoutGrid, MonitorPlay, Layers } from 'lucide-react';
import { ColorSwatch, StructuralColors, ThemeCustomizationOptions } from '../core/types';
import { KpiCardRow } from './visuals/KpiCardRow';
import { ClusteredBarChart } from './visuals/ClusteredBarChart';
import { LineTrendChart } from './visuals/LineTrendChart';
import { DonutChart } from './visuals/DonutChart';
import { StyledMatrixTable } from './visuals/StyledMatrixTable';

interface ReportCanvasProps {
  swatches: ColorSwatch[];
  structural: StructuralColors;
  isDarkCanvas: boolean;
  themeName: string;
  fontFamily?: ThemeCustomizationOptions['fontFamily'];
}

export function getFontFamilyCss(font?: ThemeCustomizationOptions['fontFamily']): string {
  switch (font) {
    case 'Aptos':
      return "'Aptos', 'Segoe UI', system-ui, -apple-system, sans-serif";
    case 'DIN':
      return "'DIN Alternate', 'DIN', 'Barlow', 'Arial Narrow', sans-serif";
    case 'Arial':
      return "Arial, Helvetica, sans-serif";
    case 'Calibri':
      return "'Calibri', 'Carlito', 'Gill Sans', sans-serif";
    case 'Verdana':
      return "Verdana, Geneva, Tahoma, sans-serif";
    case 'Tahoma':
      return "Tahoma, Verdana, Segoe, sans-serif";
    case 'Trebuchet MS':
      return "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
    case 'Georgia':
      return "Georgia, 'Times New Roman', Times, serif";
    case 'Segoe UI':
    default:
      return "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif";
  }
}

export const ReportCanvas: React.FC<ReportCanvasProps> = ({
  swatches,
  structural,
  isDarkCanvas,
  themeName,
  fontFamily = 'Segoe UI',
}) => {
  const [aspectRatioMode, setAspectRatioMode] = useState<'16-9' | 'fluid'>('fluid');

  const dataColors = swatches.map((s) => s.hex);
  const fontCss = getFontFamilyCss(fontFamily);

  return (
    <div className="w-full space-y-4">
      {/* Canvas Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-[#34D399] text-[#1E293B] border-2 border-[#1E293B] flex items-center justify-center font-heading font-extrabold text-sm shadow-[2px_2px_0px_0px_#1E293B]">
              2
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E293B] dark:text-white tracking-tight">
              Live Power BI Canvas
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-[#F472B6] text-white font-mono font-bold text-xs border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
              Font: {fontFamily}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 pl-10">
            Real-time interactive dashboard rendered with your custom 10-color palette, structural styles, and typography.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex p-1 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] pl-10 sm:pl-1">
          <button
            type="button"
            onClick={() => setAspectRatioMode('fluid')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer ${
              aspectRatioMode === 'fluid'
                ? 'bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Responsive Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setAspectRatioMode('16-9')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer ${
              aspectRatioMode === '16-9'
                ? 'bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>16:9 Desktop View</span>
          </button>
        </div>
      </div>

      {/* Power BI Canvas Frame */}
      <div
        style={{ fontFamily: fontCss }}
        className={`w-full rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 transition-all duration-300 overflow-hidden shadow-[6px_6px_0px_0px_#1E293B] dark:shadow-[6px_6px_0px_0px_#020617] ${
          isDarkCanvas
            ? 'bg-[#0F172A] text-slate-100'
            : 'bg-[#FFFFFF] text-slate-900'
        } ${
          aspectRatioMode === '16-9' ? 'aspect-[16/10] overflow-y-auto' : ''
        }`}
      >
        {/* Ribbon Bar */}
        <div className={`px-5 sm:px-7 py-3.5 border-b-2 border-[#1E293B] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 ${
          isDarkCanvas ? 'bg-slate-950/60' : 'bg-[#FFFDF5]'
        }`}>
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-6 rounded-md border-2 border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
              style={{ backgroundColor: structural.tableAccent }}
            />
            <div>
              <h1
                style={{ fontFamily: fontCss }}
                className={`text-sm sm:text-base font-heading font-black tracking-tight ${
                  isDarkCanvas ? 'text-white' : 'text-[#1E293B]'
                }`}
              >
                {themeName} — Executive Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Page 1 of 1</span>
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Auto-refresh: 15m
                </span>
              </div>
            </div>
          </div>

          {/* Quick Filter Slicers */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 rounded-full border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white font-bold shadow-[2px_2px_0px_0px_#1E293B]">
              Fiscal Year: <strong>2026</strong>
            </span>
            <span className="px-3 py-1 rounded-full border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white font-bold shadow-[2px_2px_0px_0px_#1E293B] hidden sm:inline">
              Segment: <strong>All Segments</strong>
            </span>
          </div>
        </div>

        {/* Canvas Body Content */}
        <div className="p-4 sm:p-6 space-y-4" style={{ fontFamily: fontCss }}>
          {/* Row 1: KPI Cards */}
          <KpiCardRow
            dataColors={dataColors}
            structural={structural}
            isDarkCanvas={isDarkCanvas}
            fontFamily={fontCss}
          />

          {/* Row 2: Clustered Bar Chart & Line Trend Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ClusteredBarChart
              dataColors={dataColors}
              isDarkCanvas={isDarkCanvas}
              fontFamily={fontCss}
            />
            <LineTrendChart
              dataColors={dataColors}
              isDarkCanvas={isDarkCanvas}
              fontFamily={fontCss}
            />
          </div>

          {/* Row 3: Category Donut Chart & Styled Matrix Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5">
              <DonutChart
                dataColors={dataColors}
                isDarkCanvas={isDarkCanvas}
                fontFamily={fontCss}
              />
            </div>
            <div className="lg:col-span-7">
              <StyledMatrixTable
                dataColors={dataColors}
                structural={structural}
                isDarkCanvas={isDarkCanvas}
                fontFamily={fontCss}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

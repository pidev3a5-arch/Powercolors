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
    <div className="w-full space-y-3">
      {/* Canvas Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center space-x-2">
            <MonitorPlay className="w-4 h-4 text-[#EC9700]" />
            <h2 className="text-base font-bold tracking-tight">
              Live Power BI Report Canvas
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Font: {fontFamily}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time preview of Power BI visuals dynamically formatted with your custom 10-color palette, structural styles, and typography.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setAspectRatioMode('fluid')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              aspectRatioMode === 'fluid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Responsive Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setAspectRatioMode('16-9')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              aspectRatioMode === '16-9'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>16:9 Desktop View</span>
          </button>
        </div>
      </div>

      {/* Power BI Canvas Frame */}
      <div
        style={{ fontFamily: fontCss }}
        className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
          isDarkCanvas
            ? 'border-slate-800 bg-[#0F172A] text-slate-100'
            : 'border-slate-200 bg-[#FFFFFF] text-slate-900'
        } ${
          aspectRatioMode === '16-9' ? 'aspect-[16/10] overflow-y-auto' : ''
        }`}
      >
        {/* Power BI Report Ribbon / Page Bar */}
        <div className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDarkCanvas ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex items-center space-x-3">
            <div
              className="w-2.5 h-5 rounded-xs"
              style={{ backgroundColor: structural.tableAccent }}
            />
            <div>
              <h1
                style={{ fontFamily: fontCss }}
                className={`text-sm font-bold tracking-tight ${
                  isDarkCanvas ? 'text-white' : 'text-slate-900'
                }`}
              >
                {themeName} — Executive Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-medium flex items-center gap-1 ${
                  isDarkCanvas ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Layers className="w-3 h-3 text-slate-400" />
                  <span>Page 1 of 1</span>
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className={`text-[10px] font-mono ${isDarkCanvas ? 'text-slate-400' : 'text-slate-500'}`}>
                  Auto-refresh: 15m
                </span>
              </div>
            </div>
          </div>

          {/* Quick Filter Breadcrumbs / Slicers */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className={`px-2.5 py-1 rounded-md border font-medium ${
              isDarkCanvas ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              Fiscal Year: <strong>2026</strong>
            </span>
            <span className={`px-2.5 py-1 rounded-md border font-medium hidden sm:inline ${
              isDarkCanvas ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              Segment: <strong>All Segments</strong>
            </span>
          </div>
        </div>

        {/* Canvas Body Content */}
        <div className="p-4 sm:p-6 space-y-4" style={{ fontFamily: fontCss }}>
          {/* Row 1: KPI Summary Cards */}
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

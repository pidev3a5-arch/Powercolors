import React from 'react';
import { Sun, Moon, Sliders, Type, BoxSelect } from 'lucide-react';
import { StructuralColors, ThemeCustomizationOptions } from '../core/types';

interface ThemeControlsProps {
  themeName: string;
  onThemeNameChange: (name: string) => void;
  isDarkCanvas: boolean;
  onToggleCanvasMode: () => void;
  structural: StructuralColors;
  onUpdateStructuralColor: (key: keyof StructuralColors, hex: string) => void;
  customizationOptions: ThemeCustomizationOptions;
  onCustomizationOptionsChange: (options: ThemeCustomizationOptions) => void;
  isDarkSite: boolean;
}

const FONT_OPTIONS: Array<ThemeCustomizationOptions['fontFamily']> = [
  'Segoe UI',
  'Aptos',
  'DIN',
  'Arial',
  'Calibri',
];

export const ThemeControls: React.FC<ThemeControlsProps> = ({
  themeName,
  onThemeNameChange,
  isDarkCanvas,
  onToggleCanvasMode,
  structural,
  onUpdateStructuralColor,
  customizationOptions,
  onCustomizationOptionsChange,
  isDarkSite,
}) => {
  const cardBgClass = isDarkSite
    ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-md'
    : 'bg-white border-slate-200 text-slate-900 shadow-xs';

  const inputBgClass = isDarkSite
    ? 'bg-slate-950 border-slate-800 text-white'
    : 'bg-slate-50 border-slate-300 text-slate-900';

  const subtextClass = isDarkSite ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`w-full border rounded-2xl p-5 transition-all space-y-4 ${cardBgClass}`}>
      {/* Top Row: Theme Name & Canvas Background Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Theme Name Input */}
        <div className="flex-1 space-y-1">
          <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkSite ? 'text-slate-200' : 'text-slate-700'}`}>
            <Type className="w-3.5 h-3.5 text-amber-500" />
            <span>Theme Name</span>
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => onThemeNameChange(e.target.value)}
            placeholder="e.g. Contoso Brand Theme"
            className={`w-full font-medium text-sm px-3.5 py-2 rounded-xl border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors ${inputBgClass}`}
          />
        </div>

        {/* Canvas Background Mode Switcher */}
        <div className="space-y-1">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkSite ? 'text-slate-200' : 'text-slate-700'}`}>
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Report Canvas Background</span>
          </span>
          <div className={`inline-flex p-1 rounded-xl border ${inputBgClass}`}>
            <button
              type="button"
              onClick={() => {
                if (isDarkCanvas) onToggleCanvasMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                !isDarkCanvas
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isDarkCanvas) onToggleCanvasMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isDarkCanvas
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Typography & Visual Container Options */}
      <div className={`pt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-4 ${isDarkSite ? 'border-slate-800' : 'border-slate-100'}`}>
        {/* Font Selection */}
        <div className="space-y-1.5">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkSite ? 'text-slate-300' : 'text-slate-700'}`}>
            <span>Power BI Font Family:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => onCustomizationOptionsChange({ ...customizationOptions, fontFamily: font })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  customizationOptions.fontFamily === font
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                    : isDarkSite
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Container Borders & Shadow Options */}
        <div className="space-y-1.5">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkSite ? 'text-slate-300' : 'text-slate-700'}`}>
            <BoxSelect className="w-3.5 h-3.5 text-amber-500" />
            <span>Visual Container Defaults:</span>
          </span>
          <div className="flex items-center space-x-4 text-xs pt-1">
            <label className={`inline-flex items-center space-x-2 cursor-pointer font-medium ${isDarkSite ? 'text-slate-300' : 'text-slate-700'}`}>
              <input
                type="checkbox"
                checked={customizationOptions.showVisualBorders}
                onChange={(e) => onCustomizationOptionsChange({ ...customizationOptions, showVisualBorders: e.target.checked })}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
              <span>Container Borders</span>
            </label>

            <label className={`inline-flex items-center space-x-2 cursor-pointer font-medium ${isDarkSite ? 'text-slate-300' : 'text-slate-700'}`}>
              <input
                type="checkbox"
                checked={customizationOptions.showVisualDropShadow}
                onChange={(e) => onCustomizationOptionsChange({ ...customizationOptions, showVisualDropShadow: e.target.checked })}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
              <span>Drop Shadow</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Row: Structural Colors Preview Pills */}
      <div className={`pt-3 border-t flex flex-wrap items-center gap-3 ${isDarkSite ? 'border-slate-800' : 'border-slate-100'}`}>
        <span className={`text-xs font-semibold ${subtextClass}`}>Theme Structural Colors:</span>

        {/* Canvas Background */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${inputBgClass}`}>
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
            style={{ backgroundColor: structural.background }}
          />
          <span className={subtextClass}>Canvas:</span>
          <span className="font-mono font-medium">{structural.background}</span>
        </div>

        {/* Foreground / Text */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${inputBgClass}`}>
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
            style={{ backgroundColor: structural.foreground }}
          />
          <span className={subtextClass}>Text:</span>
          <span className="font-mono font-medium">{structural.foreground}</span>
        </div>

        {/* Table Accent */}
        <label className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${inputBgClass} hover:border-amber-500`}>
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
            style={{ backgroundColor: structural.tableAccent }}
          />
          <span className={subtextClass}>Table Accent:</span>
          <span className="font-mono font-medium">{structural.tableAccent}</span>
          <input
            type="color"
            value={structural.tableAccent}
            onChange={(e) => onUpdateStructuralColor('tableAccent', e.target.value.toUpperCase())}
            className="opacity-0 w-0 h-0 pointer-events-none"
          />
        </label>

        {/* KPI Status Badges */}
        <div className={`flex items-center gap-2 text-xs ml-auto ${subtextClass}`}>
          <span className="font-medium">KPI Statuses:</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: structural.good }} /> Good
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: structural.neutral }} /> Neutral
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: structural.bad }} /> Bad
          </span>
        </div>
      </div>
    </div>
  );
};

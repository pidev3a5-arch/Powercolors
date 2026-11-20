import React from 'react';
import { Sun, Moon, Sliders, BoxSelect } from 'lucide-react';
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
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Georgia',
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
  isDarkSite: _isDarkSite,
}) => {
  return (
    <div className="w-full border-2 border-[#1E293B] dark:border-slate-700 rounded-3xl p-5 sm:p-7 bg-white dark:bg-slate-900 shadow-[6px_6px_0px_0px_#1E293B] dark:shadow-[6px_6px_0px_0px_#020617] space-y-6">
      {/* Top Header & Numbered Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Theme Name Input */}
        <div className="flex-1 space-y-2">
          <label className="text-xs font-heading font-extrabold flex items-center gap-2 text-[#1E293B] dark:text-white uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px] font-black border border-[#1E293B]">
              T
            </span>
            <span>Theme Name</span>
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => onThemeNameChange(e.target.value)}
            placeholder="e.g. Playful Pop Theme"
            className="w-full font-heading font-bold text-sm px-4 py-2.5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6] focus:shadow-[3px_3px_0px_0px_#8B5CF6] transition-all"
          />
        </div>

        {/* Canvas Background Mode Switcher */}
        <div className="space-y-2">
          <span className="text-xs font-heading font-extrabold flex items-center gap-2 text-[#1E293B] dark:text-white uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-[#F472B6] stroke-[2.5]" />
            <span>Power BI Canvas Mode</span>
          </span>
          <div className="inline-flex p-1 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 shadow-[2px_2px_0px_0px_#1E293B]">
            <button
              type="button"
              onClick={() => {
                if (isDarkCanvas) onToggleCanvasMode();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                !isDarkCanvas
                  ? 'bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'text-slate-500 hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 stroke-[2.5]" />
              <span>Light Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isDarkCanvas) onToggleCanvasMode();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isDarkCanvas
                  ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'text-slate-500 hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 stroke-[2.5]" />
              <span>Dark Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Typography Chips & Visual Container Options */}
      <div className="pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Font Selection */}
        <div className="space-y-2">
          <span className="text-xs font-heading font-extrabold text-[#1E293B] dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <span>Power BI Font Family</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => onCustomizationOptionsChange({ ...customizationOptions, fontFamily: font })}
                className={`pop-btn px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  customizationOptions.fontFamily === font
                    ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 text-[#1E293B] dark:text-slate-300 hover:bg-[#FBBF24] hover:text-[#1E293B]'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Container Borders & Shadow Options */}
        <div className="space-y-2">
          <span className="text-xs font-heading font-extrabold text-[#1E293B] dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <BoxSelect className="w-3.5 h-3.5 text-[#34D399] stroke-[2.5]" />
            <span>Visual Container Options</span>
          </span>
          <div className="flex items-center space-x-6 text-xs pt-1.5">
            <label className="inline-flex items-center space-x-2.5 cursor-pointer font-bold text-[#1E293B] dark:text-slate-200 select-none">
              <input
                type="checkbox"
                checked={customizationOptions.showVisualBorders}
                onChange={(e) => onCustomizationOptionsChange({ ...customizationOptions, showVisualBorders: e.target.checked })}
                className="w-4 h-4 rounded-md border-2 border-[#1E293B] accent-[#8B5CF6] cursor-pointer"
              />
              <span>Container Borders</span>
            </label>

            <label className="inline-flex items-center space-x-2.5 cursor-pointer font-bold text-[#1E293B] dark:text-slate-200 select-none">
              <input
                type="checkbox"
                checked={customizationOptions.showVisualDropShadow}
                onChange={(e) => onCustomizationOptionsChange({ ...customizationOptions, showVisualDropShadow: e.target.checked })}
                className="w-4 h-4 rounded-md border-2 border-[#1E293B] accent-[#8B5CF6] cursor-pointer"
              />
              <span>Drop Shadows</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Row: Structural Colors Preview Pills */}
      <div className="pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-heading font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Structural Styles:
        </span>

        {/* Canvas Background */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-xs shadow-[2px_2px_0px_0px_#1E293B]">
          <span
            className="w-3.5 h-3.5 rounded-full border border-[#1E293B]"
            style={{ backgroundColor: structural.background }}
          />
          <span className="text-slate-500 font-bold">Canvas:</span>
          <span className="font-mono font-extrabold">{structural.background}</span>
        </div>

        {/* Foreground / Text */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-xs shadow-[2px_2px_0px_0px_#1E293B]">
          <span
            className="w-3.5 h-3.5 rounded-full border border-[#1E293B]"
            style={{ backgroundColor: structural.foreground }}
          />
          <span className="text-slate-500 font-bold">Text:</span>
          <span className="font-mono font-extrabold">{structural.foreground}</span>
        </div>

        {/* Table Accent */}
        <label className="pop-btn flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF5] dark:bg-slate-950 text-xs cursor-pointer hover:bg-[#FBBF24] hover:text-[#1E293B]">
          <span
            className="w-3.5 h-3.5 rounded-full border border-[#1E293B]"
            style={{ backgroundColor: structural.tableAccent }}
          />
          <span className="text-slate-500 font-bold">Table Accent:</span>
          <span className="font-mono font-extrabold">{structural.tableAccent}</span>
          <input
            type="color"
            value={structural.tableAccent}
            onChange={(e) => onUpdateStructuralColor('tableAccent', e.target.value.toUpperCase())}
            className="opacity-0 w-0 h-0 pointer-events-none"
          />
        </label>

        {/* KPI Status Badges */}
        <div className="flex items-center gap-3 text-xs ml-auto">
          <span className="font-heading font-extrabold text-slate-500 dark:text-slate-400">KPI Status:</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold">
            <span className="w-3 h-3 rounded-full border border-[#1E293B]" style={{ backgroundColor: structural.good }} /> Good
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold">
            <span className="w-3 h-3 rounded-full border border-[#1E293B]" style={{ backgroundColor: structural.neutral }} /> Neutral
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold">
            <span className="w-3 h-3 rounded-full border border-[#1E293B]" style={{ backgroundColor: structural.bad }} /> Bad
          </span>
        </div>
      </div>
    </div>
  );
};

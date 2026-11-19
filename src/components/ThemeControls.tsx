import React from 'react';
import { Sun, Moon, Sliders, Type } from 'lucide-react';
import { StructuralColors } from '../core/types';

interface ThemeControlsProps {
  themeName: string;
  onThemeNameChange: (name: string) => void;
  isDarkCanvas: boolean;
  onToggleCanvasMode: () => void;
  structural: StructuralColors;
  onUpdateStructuralColor: (key: keyof StructuralColors, hex: string) => void;
}

export const ThemeControls: React.FC<ThemeControlsProps> = ({
  themeName,
  onThemeNameChange,
  isDarkCanvas,
  onToggleCanvasMode,
  structural,
  onUpdateStructuralColor,
}) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Theme Name Input */}
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme Name</span>
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => onThemeNameChange(e.target.value)}
            placeholder="e.g. Contoso Brand Theme"
            className="w-full bg-slate-950 text-white font-medium text-sm px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-colors"
          />
        </div>

        {/* Canvas Background Mode Switcher */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Report Canvas Background</span>
          </span>
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (isDarkCanvas) onToggleCanvasMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                !isDarkCanvas
                  ? 'bg-slate-800 text-amber-300 shadow-xs'
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
                  ? 'bg-slate-800 text-indigo-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structural Colors Preview Pills */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-slate-400">Structural Colors:</span>

        {/* Canvas Background */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: structural.background }}
          />
          <span className="text-slate-400">Background:</span>
          <span className="font-mono text-slate-200">{structural.background}</span>
        </div>

        {/* Foreground / Text */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: structural.foreground }}
          />
          <span className="text-slate-400">Foreground:</span>
          <span className="font-mono text-slate-200">{structural.foreground}</span>
        </div>

        {/* Table Accent */}
        <label className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs cursor-pointer hover:border-slate-700">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: structural.tableAccent }}
          />
          <span className="text-slate-400">Table Accent:</span>
          <span className="font-mono text-slate-200">{structural.tableAccent}</span>
          <input
            type="color"
            value={structural.tableAccent}
            onChange={(e) => onUpdateStructuralColor('tableAccent', e.target.value.toUpperCase())}
            className="opacity-0 w-0 h-0 pointer-events-none"
          />
        </label>

        {/* KPI Status Badges */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
          <span>KPIs:</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: structural.good }} title="Good / Positive Metric" />
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: structural.neutral }} title="Neutral Metric" />
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: structural.bad }} title="Bad / Alert Metric" />
        </div>
      </div>
    </div>
  );
};

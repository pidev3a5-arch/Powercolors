import React from 'react';
import { Type, BoxSelect } from 'lucide-react';
import { ThemeCustomizationOptions } from '../core/types';

interface ThemeCustomizerProps {
  options: ThemeCustomizationOptions;
  onOptionsChange: (updated: ThemeCustomizationOptions) => void;
  isDarkCanvas: boolean;
}

const FONT_OPTIONS: Array<ThemeCustomizationOptions['fontFamily']> = [
  'Segoe UI',
  'Aptos',
  'DIN',
  'Arial',
  'Calibri',
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  options,
  onOptionsChange,
  isDarkCanvas,
}) => {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isDarkCanvas ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Typography Selector */}
        <div className="space-y-1">
          <label className={`text-xs font-semibold flex items-center gap-1.5 ${
            isDarkCanvas ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Type className="w-3.5 h-3.5 text-amber-500" />
            <span>Theme Font Family</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => onOptionsChange({ ...options, fontFamily: font })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  options.fontFamily === font
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                    : isDarkCanvas
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Container Toggles */}
        <div className="space-y-1">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${
            isDarkCanvas ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <BoxSelect className="w-3.5 h-3.5 text-amber-500" />
            <span>Visual Containers</span>
          </span>
          <div className="flex items-center space-x-3 text-xs">
            <label className={`inline-flex items-center space-x-1.5 cursor-pointer font-medium ${
              isDarkCanvas ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={options.showVisualBorders}
                onChange={(e) => onOptionsChange({ ...options, showVisualBorders: e.target.checked })}
                className="rounded accent-amber-500 w-3.5 h-3.5"
              />
              <span>Borders</span>
            </label>

            <label className={`inline-flex items-center space-x-1.5 cursor-pointer font-medium ${
              isDarkCanvas ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={options.showVisualDropShadow}
                onChange={(e) => onOptionsChange({ ...options, showVisualDropShadow: e.target.checked })}
                className="rounded accent-amber-500 w-3.5 h-3.5"
              />
              <span>Drop Shadow</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

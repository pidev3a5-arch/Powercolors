import React, { useState } from 'react';
import { Sparkles, Check, AlertTriangle, XCircle, ArrowRight, Wand2 } from 'lucide-react';
import { BackgroundPreset } from '../../core/accessibility/types';
import {
  evaluateContrast,
  suggestAccessibleColor,
} from '../../core/accessibility/contrastEngine';

interface AccessibilityMatrixProps {
  palette: string[];
  backgrounds: BackgroundPreset[];
  onUpdateColor: (index: number, newHex: string) => void;
  onCustomBackgroundChange?: (hex: string) => void;
}

export const AccessibilityMatrix: React.FC<AccessibilityMatrixProps> = ({
  palette,
  backgrounds,
  onUpdateColor,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'charts' | 'text'>('all');
  const [activeFixIndex, setActiveFixIndex] = useState<{ colorIndex: number; bgHex: string } | null>(null);

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
            WCAG 2.1 Contrast Matrix
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            ({palette.length} Data Colors × {backgrounds.length} Backgrounds)
          </span>
        </div>

        {/* Standard selector pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
            }`}
          >
            All Standards
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('charts')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
              filterMode === 'charts'
                ? 'bg-[#38BDF8] text-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
            }`}
          >
            Charts & UI (3.0:1)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('text')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
              filterMode === 'text'
                ? 'bg-[#FBBF24] text-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
            }`}
          >
            Normal Text (4.5:1)
          </button>
        </div>
      </div>

      {/* Responsive Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B]">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-800">
              <th className="p-3 text-xs font-heading font-black text-[#1E293B] dark:text-white sticky left-0 z-10 bg-[#FFFDF5] dark:bg-slate-800 border-r-2 border-[#1E293B]">
                Data Color
              </th>
              {backgrounds.map((bg) => (
                <th key={bg.id} className="p-3 text-xs font-heading font-black text-[#1E293B] dark:text-white text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[11px] truncate max-w-[120px]">{bg.name}</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#1E293B] text-[10px] font-mono shadow-[1px_1px_0px_0px_#1E293B]" style={{ backgroundColor: bg.hex, color: bg.isDark ? '#FFFFFF' : '#1E293B' }}>
                      <span className="w-2 h-2 rounded-full border border-black/30" style={{ backgroundColor: bg.hex }} />
                      <span>{bg.hex}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {palette.map((color, colorIdx) => (
              <tr
                key={`${color}-${colorIdx}`}
                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {/* Row Header (Data Color) */}
                <td className="p-3 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r-2 border-[#1E293B]">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                        Color {colorIdx + 1}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 font-bold">{color}</div>
                    </div>
                  </div>
                </td>

                {/* Matrix Cells */}
                {backgrounds.map((bg) => {
                  const evalRes = evaluateContrast(color, bg.hex);
                  const isGraphicalPass = evalRes.ratio >= 3.0;
                  const isTextPass = evalRes.ratio >= 4.5;
                  const isFailing = filterMode === 'text' ? !isTextPass : !isGraphicalPass;

                  const isFixActive =
                    activeFixIndex?.colorIndex === colorIdx && activeFixIndex?.bgHex === bg.hex;

                  const fix = isFailing ? suggestAccessibleColor(color, bg.hex, filterMode === 'text' ? 4.5 : 3.0) : null;

                  return (
                    <td key={bg.id} className="p-2.5 text-center align-middle">
                      <div
                        className="p-2 rounded-xl border border-[#1E293B] flex flex-col items-center gap-1 transition-all relative group"
                        style={{ backgroundColor: bg.hex }}
                      >
                        {/* Sample preview chip */}
                        <div
                          className="px-2.5 py-0.5 rounded text-[11px] font-bold border border-black/20 shadow-xs flex items-center gap-1"
                          style={{ backgroundColor: color, color: evalRes.ratio > 4.5 ? bg.hex : '#FFFFFF' }}
                        >
                          <span className="font-mono text-[10px]">{evalRes.ratio.toFixed(1)}:1</span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1">
                          {evalRes.ratio >= 7.0 ? (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-heading font-black bg-[#34D399] text-[#064E3B] border border-[#064E3B]/30 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> AAA
                            </span>
                          ) : evalRes.ratio >= 4.5 ? (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-heading font-black bg-[#38BDF8] text-[#0C4A6E] border border-[#0C4A6E]/30 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> AA
                            </span>
                          ) : evalRes.ratio >= 3.0 ? (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-heading font-black bg-[#FBBF24] text-[#78350F] border border-[#78350F]/30 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 stroke-[3]" /> 3:1 UI
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-heading font-black bg-[#FB7185] text-[#881337] border border-[#881337]/30 flex items-center gap-0.5">
                              <XCircle className="w-2.5 h-2.5 stroke-[3]" /> Fail
                            </span>
                          )}

                          {/* Quick Auto-Fix Trigger */}
                          {fix && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isFixActive) {
                                  setActiveFixIndex(null);
                                } else {
                                  setActiveFixIndex({ colorIndex: colorIdx, bgHex: bg.hex });
                                }
                              }}
                              className="p-1 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B] cursor-pointer"
                              title={`Auto-fix contrast: suggested ${fix.suggestedHex} (${fix.newRatio}:1)`}
                            >
                              <Wand2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>

                        {/* Interactive Fix Popover */}
                        {isFixActive && fix && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 w-48 p-2.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] text-left">
                            <div className="text-[10px] font-heading font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#FBBF24]" /> Suggested Fix
                            </div>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <div className="flex items-center gap-1">
                                <span className="w-4 h-4 rounded border border-black/30" style={{ backgroundColor: color }} />
                                <span className="text-[10px] font-mono text-slate-400 line-through">{color}</span>
                              </div>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <div className="flex items-center gap-1">
                                <span className="w-4 h-4 rounded border border-black/30" style={{ backgroundColor: fix.suggestedHex }} />
                                <span className="text-[10px] font-mono font-bold text-[#8B5CF6]">{fix.suggestedHex}</span>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-600 dark:text-slate-300 mb-2">
                              New contrast: <span className="font-bold text-[#34D399]">{fix.newRatio}:1</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateColor(colorIdx, fix.suggestedHex);
                                setActiveFixIndex(null);
                              }}
                              className="w-full py-1 px-2 rounded-lg text-[10px] font-heading font-black bg-[#34D399] hover:bg-[#10B981] text-[#064E3B] border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B] cursor-pointer text-center"
                            >
                              Apply to Palette
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

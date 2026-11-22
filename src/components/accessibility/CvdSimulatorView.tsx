import React from 'react';
import { Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { CvdType } from '../../core/accessibility/types';
import {
  CVD_CATALOG,
  simulateCvd,
  detectCvdConflicts,
} from '../../core/accessibility/cvdSimulator';

interface CvdSimulatorViewProps {
  palette: string[];
  selectedCvd: CvdType;
  onSelectCvd: (type: CvdType) => void;
}

export const CvdSimulatorView: React.FC<CvdSimulatorViewProps> = ({
  palette,
  selectedCvd,
  onSelectCvd,
}) => {
  const currentMeta = CVD_CATALOG.find((c) => c.type === selectedCvd) || CVD_CATALOG[0];
  const allConflicts = detectCvdConflicts(palette, 11);
  const activeConflicts = allConflicts.filter((c) =>
    selectedCvd === 'normal' ? true : c.cvdType === selectedCvd
  );

  return (
    <div className="space-y-4">
      {/* CVD Type Selector Bar */}
      <div className="p-3 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B]">
        <div className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#8B5CF6]" />
          <span>Color Vision Deficiency (CVD) Simulations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CVD_CATALOG.map((item) => {
            const isSelected = selectedCvd === item.type;
            const conflictCountForType = allConflicts.filter((c) => c.cvdType === item.type).length;

            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onSelectCvd(item.type)}
                className={`p-2.5 rounded-xl border-2 border-[#1E293B] text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-slate-50 dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-slate-100 shadow-[1px_1px_0px_0px_#1E293B]'
                }`}
              >
                <div className="text-xs font-heading font-black truncate">{item.label.split('(')[0]}</div>
                <div
                  className={`text-[10px] font-bold ${
                    isSelected ? 'text-purple-200' : 'text-slate-500'
                  }`}
                >
                  {item.populationRate}
                </div>

                {conflictCountForType > 0 && item.type !== 'normal' && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-heading font-black bg-[#FB7185] text-white border border-[#1E293B]">
                    {conflictCountForType}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CVD Medical Explanation & Conflict Callout */}
      <div className="p-3.5 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-[#1E293B]" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-heading font-black text-[#1E293B] dark:text-white">
              {currentMeta.label} • <span className="text-[#8B5CF6]">{currentMeta.populationRate}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">{currentMeta.description}</p>
            <p className="text-slate-500 text-[11px]">
              <span className="font-bold text-[#1E293B] dark:text-slate-200">Perception Impact:</span>{' '}
              {currentMeta.affectedColors}
            </p>
          </div>
        </div>

        {/* Conflicts Alert */}
        {activeConflicts.length > 0 ? (
          <div className="mt-3 p-3 rounded-xl border-2 border-[#FB7185] bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-heading font-black text-[#FB7185]">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <span>
                {activeConflicts.length} Indistinguishable Color Pair
                {activeConflicts.length > 1 ? 's' : ''} Detected!
              </span>
            </div>
            <p className="text-[11px] text-rose-800 dark:text-rose-300">
              Users with {currentMeta.label.split('(')[0]} will struggle to tell these categories apart in bar charts or legends:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeConflicts.map((c, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#1E293B] flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded border border-black/30" style={{ backgroundColor: c.colorA }} />
                    <span className="text-[10px] font-mono font-bold">Color {c.indexA + 1}</span>
                    <span className="text-slate-400">vs</span>
                    <span className="w-4 h-4 rounded border border-black/30" style={{ backgroundColor: c.colorB }} />
                    <span className="text-[10px] font-mono font-bold">Color {c.indexB + 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-500">Simulated:</span>
                    <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: c.simulatedA }} />
                    <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: c.simulatedB }} />
                    <span className="text-[10px] font-bold text-rose-600">ΔE {c.deltaE}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded-xl border border-[#34D399] bg-emerald-50 dark:bg-emerald-950/30 text-[#064E3B] dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#34D399] stroke-[2.5] flex-shrink-0" />
            <span className="font-bold">
              Zero color confusion detected! All data colors remain clearly distinguishable under {currentMeta.label.split('(')[0]}.
            </span>
          </div>
        )}
      </div>

      {/* Side-by-Side Swatches Grid */}
      <div className="p-3.5 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B]">
        <div className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider mb-3">
          Palette Simulation Comparison (Original vs {currentMeta.label.split('(')[0]})
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {palette.map((color, idx) => {
            const simulated = simulateCvd(color, selectedCvd);

            return (
              <div
                key={idx}
                className="p-2 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800 flex flex-col items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#1E293B]"
              >
                <div className="text-[10px] font-heading font-black text-slate-500">#{idx + 1}</div>

                {/* Original */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-7 rounded-md border border-[#1E293B] shadow-xs"
                    style={{ backgroundColor: color }}
                    title={`Original: ${color}`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">{color}</span>
                </div>

                <div className="w-full border-t border-slate-300 dark:border-slate-700 my-0.5" />

                {/* Simulated */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-7 rounded-md border border-[#1E293B] shadow-xs"
                    style={{ backgroundColor: simulated }}
                    title={`Simulated: ${simulated}`}
                  />
                  <span className="text-[9px] font-mono font-bold text-[#8B5CF6] mt-0.5">{simulated}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

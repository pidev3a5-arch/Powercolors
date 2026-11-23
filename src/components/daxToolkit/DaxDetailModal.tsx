import React, { useState } from 'react';
import { X, Copy, Check, Download, RotateCcw, Lightbulb, Zap } from 'lucide-react';
import { DaxTemplate } from '../../core/daxToolkit/types';
import { interpolateDax, downloadDaxFile } from '../../core/daxToolkit/daxEngine';

interface DaxDetailModalProps {
  template: DaxTemplate | null;
  onClose: () => void;
}

export const DaxDetailModal: React.FC<DaxDetailModalProps> = ({
  template,
  onClose,
}) => {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const currentDax = interpolateDax(template, paramValues);
  const measureName = paramValues['measure_name'] || template.parameters.find(p => p.id === 'measure_name')?.defaultValue || template.name;

  const handleParamChange = (id: string, val: string) => {
    setParamValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setParamValues({});
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentDax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadDaxFile(measureName, currentDax);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border-2 border-[#1E293B] rounded-2xl shadow-[6px_6px_0px_0px_#1E293B] w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col overflow-hidden min-w-0">
        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between p-3.5 sm:p-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-800 flex-shrink-0 gap-2">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-black bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/30 uppercase shrink-0">
                {template.category.replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-heading font-black bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] border border-[#34D399]/30 shrink-0">
                {template.difficulty}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">
                Output: {template.outputType}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-heading font-black text-[#1E293B] dark:text-white truncate">
              {template.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="pop-btn p-1.5 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-800 hover:bg-[#FB7185] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x-2 divide-[#1E293B] min-w-0">
          {/* Left Column: Live Parameter Substitution Inputs (5 cols) */}
          <div className="md:col-span-5 p-3.5 sm:p-5 space-y-4 bg-slate-50/60 dark:bg-slate-900/60 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                  Substitute Parameters
                </h4>
                <p className="text-[11px] text-slate-500 font-bold">
                  Replace placeholders with your table & measure names
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] font-heading font-bold text-slate-500 hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer shrink-0"
                title="Reset to default template names"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-3">
              {template.parameters.map((param) => {
                const currentVal = paramValues[param.id] !== undefined ? paramValues[param.id] : param.defaultValue;

                return (
                  <div key={param.id} className="space-y-1">
                    <label className="text-[11px] font-heading font-black text-[#1E293B] dark:text-slate-200 flex items-center justify-between">
                      <span>{param.label}</span>
                      <span className="text-[9.5px] font-mono text-slate-400 capitalize">{param.type}</span>
                    </label>
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleParamChange(param.id, e.target.value)}
                      placeholder={param.placeholder}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-mono font-bold text-[#1E293B] dark:text-white shadow-xs focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {param.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Power BI Best Practice Card */}
            <div className="p-3 sm:p-3.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-800 shadow-[2px_2px_0px_0px_#1E293B] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-heading font-black text-[#1E293B] dark:text-white">
                <Lightbulb className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Power BI Implementation Guide</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <div>
                  <span className="font-bold text-[#1E293B] dark:text-slate-200">Recommended Visual:</span>{' '}
                  {template.powerBiTips.recommendedVisual}
                </div>
                {template.powerBiTips.formatString && (
                  <div className="break-all">
                    <span className="font-bold text-[#1E293B] dark:text-slate-200">Format String:</span>{' '}
                    <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
                      {template.powerBiTips.formatString}
                    </code>
                  </div>
                )}
                <div>
                  <span className="font-bold text-[#1E293B] dark:text-slate-200">Performance Note:</span>{' '}
                  {template.powerBiTips.performanceNote}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Formatted DAX Code & Actions (7 cols) */}
          <div className="md:col-span-7 p-3.5 sm:p-5 space-y-4 flex flex-col justify-between bg-white dark:bg-slate-900 min-w-0">
            <div className="space-y-3 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
                <div>
                  <h4 className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Live Formatted DAX Expression
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Ready to copy or download as a .dax file
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none pop-btn inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-heading font-black bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] border border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied DAX!' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 sm:flex-none pop-btn inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .dax</span>
                  </button>
                </div>
              </div>

              {/* Formatted Code Block */}
              <div className="relative min-w-0 w-full overflow-hidden">
                <pre className="p-3 sm:p-4 rounded-xl border-2 border-[#1E293B] bg-slate-950 text-slate-100 text-[11px] sm:text-xs font-mono overflow-x-auto max-h-[260px] sm:max-h-[380px] leading-relaxed shadow-[3px_3px_0px_0px_#1E293B] w-full">
                  <code>{currentDax}</code>
                </pre>
              </div>

              {/* Pro Best Practice Tip */}
              <div className="p-3 rounded-xl border border-[#34D399] bg-emerald-50 dark:bg-emerald-950/30 text-[#064E3B] dark:text-emerald-300 text-xs flex items-start gap-2 min-w-0">
                <Zap className="w-4 h-4 text-[#34D399] stroke-[2.5] flex-shrink-0 mt-0.5" />
                <div className="min-w-0 break-words">
                  <span className="font-bold">Authoring Best Practice:</span>{' '}
                  {template.powerBiTips.bestPractice}
                </div>
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-bold min-w-0">
              <span className="truncate">Tags: {template.tags.join(', ')}</span>
              <button
                type="button"
                onClick={onClose}
                className="hover:underline text-[#1E293B] dark:text-white cursor-pointer self-end sm:self-auto"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

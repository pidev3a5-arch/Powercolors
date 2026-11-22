import React, { useState } from 'react';
import { Copy, Check, Download, ArrowRight } from 'lucide-react';
import { DaxTemplate } from '../../core/daxToolkit/types';
import { interpolateDax, downloadDaxFile } from '../../core/daxToolkit/daxEngine';

interface DaxTemplateCardProps {
  template: DaxTemplate;
  onOpenDetail: (template: DaxTemplate) => void;
}

export const DaxTemplateCard: React.FC<DaxTemplateCardProps> = ({
  template,
  onOpenDetail,
}) => {
  const [copied, setCopied] = useState(false);

  const defaultDax = interpolateDax(template, {});

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(defaultDax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadDaxFile(template.name, defaultDax);
  };

  return (
    <div
      onClick={() => onOpenDetail(template)}
      className="pop-card p-5 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] flex flex-col justify-between space-y-4 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all group"
    >
      <div className="space-y-3">
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/30 uppercase">
            {template.category.replace('-', ' ')}
          </span>

          <div className="flex items-center gap-1.5">
            {template.difficulty === 'Beginner' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-heading font-black bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] border border-[#34D399]/30">
                Beginner
              </span>
            )}
            {template.difficulty === 'Intermediate' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-heading font-black bg-[#FBBF24]/20 text-[#D97706] dark:text-[#FBBF24] border border-[#FBBF24]/30">
                Intermediate
              </span>
            )}
            {template.difficulty === 'Advanced' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-heading font-black bg-[#FB7185]/20 text-[#E11D48] dark:text-[#FB7185] border border-[#FB7185]/30">
                Advanced
              </span>
            )}

            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              {template.outputType}
            </span>
          </div>
        </div>

        {/* Name & Description */}
        <div>
          <h3 className="text-base font-heading font-black text-[#1E293B] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
            {template.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Code Snippet Preview */}
        <div className="relative">
          <pre className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-900 text-slate-100 text-[10px] font-mono overflow-hidden max-h-24 leading-relaxed select-none">
            {defaultDax}
          </pre>
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-xl" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[11px] font-heading font-black text-[#8B5CF6] flex items-center gap-1 group-hover:underline">
          <span>Customize Variables</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleCopy}
            className="pop-btn p-1.5 rounded-lg border border-[#1E293B] bg-white dark:bg-slate-800 hover:bg-[#FBBF24] hover:text-[#1E293B] text-[#1E293B] dark:text-white shadow-[1px_1px_0px_0px_#1E293B] transition-colors cursor-pointer"
            title="Copy default DAX measure"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="pop-btn p-1.5 rounded-lg border border-[#1E293B] bg-white dark:bg-slate-800 hover:bg-[#8B5CF6] hover:text-white text-[#1E293B] dark:text-white shadow-[1px_1px_0px_0px_#1E293B] transition-colors cursor-pointer"
            title="Download .dax file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

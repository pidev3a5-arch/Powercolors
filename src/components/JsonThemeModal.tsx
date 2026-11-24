import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Code2, BookOpen, FileCode } from 'lucide-react';
import { PowerBITheme } from '../core/types';
import { serializePowerBITheme } from '../core/powerBiTheme';
import { copyToClipboard } from '../core/clipboard';
import { SchemaValidationCard } from './SchemaValidationCard';

interface JsonThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PowerBITheme;
  themeName: string;
  isDarkCanvas: boolean;
}

export const JsonThemeModal: React.FC<JsonThemeModalProps> = ({
  isOpen,
  onClose,
  theme,
  themeName,
  isDarkCanvas,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const jsonString = serializePowerBITheme(theme);
  const slug = themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'power-bi-theme';
  const fileName = `${slug}.json`;
  const fileSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopy = async () => {
    const success = await copyToClipboard(jsonString);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E293B]/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] sm:shadow-[8px_8px_0px_0px_#1E293B] dark:shadow-[6px_6px_0px_0px_#020617] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: Responsive 2-tier on mobile, 1-tier on desktop */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b-2 border-[#1E293B] dark:border-slate-800 bg-[#FFFDF5] dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-shrink-0">
          {/* Top Row: File Icon, Title, Size Badge, and Guaranteed-Visible Close Button */}
          <div className="flex items-center justify-between gap-2 min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-2.5 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center text-[#1E293B] flex-shrink-0">
                <FileCode className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-sm sm:text-base font-heading font-black tracking-tight text-[#1E293B] dark:text-white truncate">
                    {fileName}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-mono font-black px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 flex-shrink-0">
                    {fileSizeKb} KB
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                  Official Microsoft Power BI Theme Specification
                </p>
              </div>
            </div>

            {/* Mobile Close Button (Anchored to top right, never pushed off-screen) */}
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden pop-btn p-1.5 rounded-full bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Action Buttons: Full width on mobile, inline on desktop */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="pop-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="pop-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black bg-[#8B5CF6] text-white hover:bg-[#7C3AED] cursor-pointer shadow-[2.5px_2.5px_0px_0px_#1E293B]"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>Download .json</span>
            </button>

            {/* Desktop Close Button (hidden on mobile, visible on sm and up) */}
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex pop-btn p-1.5 rounded-full bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors ml-1 cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-white dark:bg-slate-900">
          {/* Schema Validation Card */}
          <SchemaValidationCard theme={theme} isDarkCanvas={isDarkCanvas} />

          {/* Code Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#8B5CF6] stroke-[2.5]" />
                <span>Theme JSON Output</span>
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] bg-[#FFFDF5] dark:bg-slate-950 px-2 py-0.5 rounded-md border border-[#1E293B]/20">
                {theme.dataColors.length} Colors • UTF-8
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] sm:shadow-[4px_4px_0px_0px_#1E293B]">
              <pre className="p-3.5 sm:p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[220px] sm:max-h-[300px] leading-relaxed selection:bg-[#FBBF24] selection:text-[#1E293B]">
                <code>{jsonString}</code>
              </pre>
            </div>
          </div>

          {/* Power BI Import Guide */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-800 bg-[#FFFDF5] dark:bg-slate-950 shadow-[3px_3px_0px_0px_#1E293B]">
            <h4 className="text-xs font-heading font-extrabold flex items-center gap-2 mb-2 text-[#1E293B] dark:text-white uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#F472B6] stroke-[2.5]" />
              <span>How to Apply in Power BI Desktop:</span>
            </h4>
            <ol className="text-xs space-y-1.5 list-decimal list-inside text-slate-700 dark:text-slate-300 font-medium">
              <li>Download this <code className="font-mono font-bold bg-[#FBBF24] text-[#1E293B] px-1.5 py-0.5 rounded border border-[#1E293B]">{fileName}</code> file.</li>
              <li>Open your report in <strong>Power BI Desktop</strong>.</li>
              <li>On the ribbon, click the <strong>View</strong> tab.</li>
              <li>Expand the <strong>Themes</strong> dropdown gallery and select <strong>Browse for themes...</strong></li>
              <li>Select your downloaded file. All visuals immediately update to your custom palette!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, BookOpen, FileCode } from 'lucide-react';
import { PowerBITheme } from '../core/types';
import { serializePowerBITheme } from '../core/powerBiTheme';
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

  if (!isOpen) return null;

  const jsonString = serializePowerBITheme(theme);
  const slug = themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'power-bi-theme';
  const fileName = `${slug}.json`;
  const fileSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkCanvas
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkCanvas ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/80'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight">
                  {fileName}
                </h3>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400">
                  {fileSizeKb} KB
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Microsoft Power BI Theme File
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDarkCanvas
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON!' : 'Copy Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Schema Validation Card */}
          <SchemaValidationCard theme={theme} isDarkCanvas={isDarkCanvas} />

          {/* Code Viewer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span>JSON Preview</span>
              </span>
              <span className="font-mono text-[11px]">{theme.dataColors.length} Data Colors • UTF-8</span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[300px] leading-relaxed selection:bg-amber-500/30">
                <code>{jsonString}</code>
              </pre>
            </div>
          </div>

          {/* Power BI Import Guide */}
          <div className={`p-4 rounded-xl border ${
            isDarkCanvas ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="text-xs font-bold flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>How to Apply in Power BI Desktop:</span>
            </h4>
            <ol className="text-xs space-y-1.5 list-decimal list-inside text-slate-600 dark:text-slate-400">
              <li>Download this <code className="font-mono text-amber-500 font-semibold">{fileName}</code> file to your computer.</li>
              <li>Open your report in <strong>Power BI Desktop</strong>.</li>
              <li>On the top ribbon, click the <strong>View</strong> tab.</li>
              <li>Expand the <strong>Themes</strong> dropdown gallery and select <strong>Browse for themes...</strong></li>
              <li>Select your downloaded file. All visuals immediately update to your custom palette!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

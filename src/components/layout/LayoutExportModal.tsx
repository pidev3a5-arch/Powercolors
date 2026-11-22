import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Table,
  Info,
} from 'lucide-react';
import { LayoutVisualItem, LayoutDimension, ReportLayoutState } from '../../core/layoutTypes';
import {
  generateCoordinatesMarkdownTable,
  generateCoordinatesCsv,
  generatePbirPositionsJson,
  exportLayoutStateToJson,
} from '../../core/layoutExport';

interface LayoutExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  visuals: LayoutVisualItem[];
  dimensions: LayoutDimension;
  state: ReportLayoutState;
}

type ExportTab = 'markdown' | 'csv' | 'pbir' | 'json';

export const LayoutExportModal: React.FC<LayoutExportModalProps> = ({
  isOpen,
  onClose,
  visuals,
  dimensions,
  state,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mdTable = generateCoordinatesMarkdownTable(visuals, dimensions);
  const csvData = generateCoordinatesCsv(visuals, dimensions);
  const pbirJson = generatePbirPositionsJson(visuals);
  const fullJson = exportLayoutStateToJson(state);

  let currentContent = mdTable;
  let filename = 'powerbi-visual-coordinates.md';
  let mimeType = 'text/markdown';

  if (activeTab === 'csv') {
    currentContent = csvData;
    filename = 'powerbi-visual-coordinates.csv';
    mimeType = 'text/csv';
  } else if (activeTab === 'pbir') {
    currentContent = pbirJson;
    filename = 'pbir-visual-positions.json';
    mimeType = 'application/json';
  } else if (activeTab === 'json') {
    currentContent = fullJson;
    filename = 'powerlab-layout-backup.json';
    mimeType = 'application/json';
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E293B]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border-4 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[10px_10px_0px_0px_#1E293B] overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-3 border-[#1E293B] bg-slate-50 dark:bg-slate-800/90 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[10px] font-heading font-black border border-[#1E293B]">
              <Table className="w-3 h-3" />
              <span>Pixel-Accurate Positioning</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white mt-1">
              Export Power BI Coordinates
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Format Tabs */}
          <div className="flex items-center gap-2 border-b-2 border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('markdown')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black border-2 transition-all cursor-pointer ${
                activeTab === 'markdown'
                  ? 'border-[#1E293B] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              Markdown Table
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('csv')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black border-2 transition-all cursor-pointer ${
                activeTab === 'csv'
                  ? 'border-[#1E293B] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              CSV (Excel / Sheets)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pbir')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black border-2 transition-all cursor-pointer ${
                activeTab === 'pbir'
                  ? 'border-[#1E293B] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              PBIR Position JSON
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black border-2 transition-all cursor-pointer ${
                activeTab === 'json'
                  ? 'border-[#1E293B] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              Full State Backup (.json)
            </button>
          </div>

          {/* Code / Content Display Box */}
          <div className="relative rounded-2xl border-2 border-[#1E293B] bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-[260px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
            <pre className="whitespace-pre">{currentContent}</pre>
          </div>

          {/* Power BI Desktop Implementation Guidance */}
          <div className="p-4 rounded-2xl border-2 border-[#1E293B] bg-amber-50 dark:bg-amber-950/20 text-slate-800 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-heading font-black text-amber-900 dark:text-amber-300">
              <Info className="w-4 h-4 text-amber-600" />
              <span>How to Apply These Coordinates in Power BI Desktop:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 font-medium pl-1 text-[11.5px] leading-relaxed">
              <li>Select any visual on your Power BI Desktop canvas.</li>
              <li>In the right-hand panel, click the <span className="font-bold">Format visual</span> icon and choose the <span className="font-bold">General</span> tab.</li>
              <li>Expand <span className="font-bold">Properties → Position</span> and paste the exact <span className="font-mono font-bold">Horizontal (X)</span> and <span className="font-mono font-bold">Vertical (Y)</span> pixels.</li>
              <li>Expand <span className="font-bold">Properties → Size</span> and enter the <span className="font-mono font-bold">Width</span> and <span className="font-mono font-bold">Height</span> pixels.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t-3 border-[#1E293B] bg-slate-50 dark:bg-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-bold">
            {visuals.length} visual positions calculated
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="pop-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] hover:bg-slate-100 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="pop-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

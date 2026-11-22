import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  Grid,
  BarChart3,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  FileCheck2,
} from 'lucide-react';
import { AppPage } from '../core/types';
import { CvdType, BackgroundPreset } from '../core/accessibility/types';
import {
  ACCESSIBLE_PALETTE_PRESETS,
  DEFAULT_BACKGROUND_PRESETS,
} from '../core/accessibility/accessiblePresets';
import { generateAuditSummary } from '../core/accessibility/contrastEngine';
import { detectCvdConflicts } from '../core/accessibility/cvdSimulator';
import { AccessibilityMatrix } from '../components/accessibility/AccessibilityMatrix';
import { CvdSimulatorView } from '../components/accessibility/CvdSimulatorView';
import { VisualPreviewSimulator } from '../components/accessibility/VisualPreviewSimulator';
import { AccessibilityReportModal } from '../components/accessibility/AccessibilityReportModal';

interface AccessibilityCheckerPageProps {
  onNavigate: (page: AppPage) => void;
  initialPalette?: string[];
}

export const AccessibilityCheckerPage: React.FC<AccessibilityCheckerPageProps> = ({
  initialPalette,
}) => {
  const [palette, setPalette] = useState<string[]>(() => {
    if (initialPalette && initialPalette.length > 0) return initialPalette;
    // Default to the internationally recognized Bang Wong colorblind safe palette
    return ACCESSIBLE_PALETTE_PRESETS[0].colors;
  });

  const [backgrounds, setBackgrounds] = useState<BackgroundPreset[]>(DEFAULT_BACKGROUND_PRESETS);
  const [customBgHex, setCustomBgHex] = useState('#FFFFFF');
  const [activeTab, setActiveTab] = useState<'matrix' | 'cvd' | 'visuals'>('matrix');
  const [selectedCvd, setSelectedCvd] = useState<CvdType>('deuteranopia');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Color conflict & summary calculations
  const conflicts = detectCvdConflicts(palette, 11);
  const summary = generateAuditSummary(palette, backgrounds, conflicts.length);

  // Palette editing handlers
  const handleUpdateColor = (index: number, newHex: string) => {
    setPalette((prev) => {
      const next = [...prev];
      next[index] = newHex.toUpperCase();
      return next;
    });
  };

  const handleAddColor = () => {
    if (palette.length >= 16) {
      showNotification('Palette limit reached (16 colors max).');
      return;
    }
    const defaultNewColor = '#3B82F6';
    setPalette((prev) => [...prev, defaultNewColor]);
    showNotification('Added new color to palette.');
  };

  const handleDeleteColor = (index: number) => {
    if (palette.length <= 3) {
      showNotification('Palette must have at least 3 colors.');
      return;
    }
    setPalette((prev) => prev.filter((_, i) => i !== index));
    showNotification('Removed color from palette.');
  };

  const handleApplyPreset = (presetId: string) => {
    const found = ACCESSIBLE_PALETTE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPalette(found.colors);
      showNotification(`Applied "${found.name}" preset!`);
    }
  };

  // Custom Background Addition
  const handleAddCustomBackground = () => {
    const newBg: BackgroundPreset = {
      id: `custom-bg-${Date.now().toString(36)}`,
      name: `Custom (${customBgHex})`,
      hex: customBgHex.toUpperCase(),
      isDark: false, // heuristic can be refined
      category: 'custom',
    };
    setBackgrounds((prev) => [...prev, newBg]);
    showNotification(`Added custom background ${customBgHex}!`);
  };

  // Import from JSON Theme File
  const handleImportJsonTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json.dataColors) && json.dataColors.length > 0) {
          setPalette(json.dataColors);
          showNotification(`Imported ${json.dataColors.length} colors from "${json.name || file.name}"!`);
        } else {
          showNotification('Invalid Power BI theme: "dataColors" array missing.');
        }
      } catch {
        showNotification('Failed to parse theme JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] font-heading font-black text-xs shadow-[3px_3px_0px_0px_#1E293B] animate-in fade-in slide-in-from-bottom-2">
          {notification}
        </div>
      )}

      {/* Top Banner & Audit Score Hero */}
      <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-heading font-black bg-[#34D399] text-[#064E3B] border border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG 2.1 AA/AAA & Non-Text Contrast Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight">
            Color Accessibility Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Ensure your Power BI report themes are accessible to all users. Audit non-text chart contrast (3.0:1), text contrast (4.5:1), and colorblind simulation conflicts with one-click auto-fixes.
          </p>
        </div>

        {/* Score Card & Action CTA */}
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-800 text-center shadow-[2px_2px_0px_0px_#1E293B] min-w-[120px]">
            <div className="text-[10px] font-heading font-black uppercase text-slate-500">
              Audit Score
            </div>
            <div className="text-2xl font-heading font-black text-[#8B5CF6]">
              {summary.complianceScore}%
            </div>
            <div className="text-[9.5px] font-bold text-slate-500">
              {summary.passedGraphicalCount}/{summary.totalChecks} checks pass
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="pop-btn inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 stroke-[2.5]" />
              <span>Audit Report Card</span>
            </button>

            <label className="pop-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 hover:bg-[#FBBF24] hover:text-[#1E293B] text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Theme JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJsonTheme}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Palette Editor & Presets Strip */}
      <div className="p-4 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
            <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
              Audited Theme Palette ({palette.length} Colors)
            </span>
          </div>

          {/* Curated Presets Switcher & Custom BG */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Presets:</span>
            <select
              aria-label="Accessible Palette Presets"
              onChange={(e) => handleApplyPreset(e.target.value)}
              defaultValue=""
              className="px-2.5 py-1.5 rounded-xl text-xs font-heading font-bold border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
            >
              <option value="" disabled>
                Select Curated Accessible Palette...
              </option>
              {ACCESSIBLE_PALETTE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.author})
                </option>
              ))}
            </select>

            {/* Custom Background Adder */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-800 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              <input
                type="color"
                value={customBgHex}
                onChange={(e) => setCustomBgHex(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border border-[#1E293B]"
                title="Pick custom background color"
              />
              <input
                type="text"
                value={customBgHex}
                onChange={(e) => setCustomBgHex(e.target.value)}
                className="w-16 px-1 text-[10px] font-mono uppercase font-bold bg-transparent text-[#1E293B] dark:text-white"
                placeholder="#HEX"
              />
              <button
                type="button"
                onClick={handleAddCustomBackground}
                className="pop-btn px-2 py-0.5 rounded-md text-[9.5px] font-heading font-black bg-[#8B5CF6] text-white cursor-pointer"
                title="Add custom background to contrast matrix"
              >
                + BG
              </button>
            </div>
          </div>
        </div>

        {/* Swatch Editor Items */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          {palette.map((color, idx) => (
            <div
              key={idx}
              className="p-1.5 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800 flex flex-col items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#1E293B] flex-shrink-0 relative group"
            >
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleUpdateColor(idx, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#1E293B] shadow-xs"
                  title={`Color ${idx + 1}: ${color}`}
                />
              </div>
              <input
                type="text"
                value={color}
                onChange={(e) => handleUpdateColor(idx, e.target.value)}
                className="w-16 px-1 text-[10px] font-mono text-center uppercase font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleDeleteColor(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 cursor-pointer"
                title="Remove color"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Color Button */}
          <button
            type="button"
            onClick={handleAddColor}
            className="pop-btn h-20 px-3 rounded-xl border-2 border-dashed border-[#1E293B] dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-[#FBBF24]/20 flex flex-col items-center justify-center gap-1 text-[#1E293B] dark:text-slate-300 cursor-pointer flex-shrink-0"
            title="Add color swatch"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-heading font-black">Add</span>
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Grid className="w-4 h-4 stroke-[2.5]" />
          <span>Contrast Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cvd')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'cvd'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4 stroke-[2.5]" />
          <span>Colorblind Simulator ({conflicts.length} alerts)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visuals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'visuals'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          <span>Power BI Visual Previews</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'matrix' && (
        <AccessibilityMatrix
          palette={palette}
          backgrounds={backgrounds}
          onUpdateColor={handleUpdateColor}
        />
      )}

      {activeTab === 'cvd' && (
        <CvdSimulatorView
          palette={palette}
          selectedCvd={selectedCvd}
          onSelectCvd={setSelectedCvd}
        />
      )}

      {activeTab === 'visuals' && (
        <VisualPreviewSimulator
          palette={palette}
          selectedCvd={selectedCvd}
        />
      )}

      {/* Report Modal */}
      <AccessibilityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        palette={palette}
        backgrounds={backgrounds}
        summary={summary}
      />
    </div>
  );
};

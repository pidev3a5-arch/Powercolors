import React, { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Type,
  Target,
  BarChart2,
  Palette,
  Code,
  Box,
  Layers,
  ArrowRight,
  ZoomIn,
  Sun,
  Moon,
} from 'lucide-react';
import { AppPage } from '../core/types';
import {
  KpiCardConfig,
  KpiCardStyle,
  KpiMicroChartType,
  KpiTrendDirection,
  KpiPolarity,
  KpiBadgeStyle,
} from '../core/kpiCard/types';
import {
  generateKpiCardSvg,
  generateKpiDaxMeasure,
  generateKpiPbirSnippet,
  generateScorecardSvg,
  downloadKpiSvg,
  downloadKpiPng,
  KPI_ICONS,
} from '../core/kpiCard/kpiEngine';
import { KPI_PRESETS } from '../core/kpiCard/catalog';

interface KpiStudioPageProps {
  onNavigate: (page: AppPage) => void;
  paletteHexes?: string[];
}

const DEFAULT_PALETTE = ['#8B5CF6', '#FBBF24', '#34D399', '#38BDF8', '#F472B6', '#1E293B', '#10B981', '#EC4899'];
const FONT_FAMILIES = ['Outfit', 'Plus Jakarta Sans', 'Poppins', 'Barlow', 'Segoe UI', 'DIN', 'Arial'];

export const KpiStudioPage: React.FC<KpiStudioPageProps> = ({
  onNavigate: _onNavigate,
  paletteHexes = DEFAULT_PALETTE,
}) => {
  // Active Card Configuration
  const [cardConfig, setCardConfig] = useState<KpiCardConfig>(KPI_PRESETS[0].config);

  // Inspector Tabs
  const [inspectorTab, setInspectorTab] = useState<'presets' | 'geometry' | 'typography' | 'badges' | 'charts' | 'icons'>('presets');

  // Preset Category Filter
  const [presetCategory, setPresetCategory] = useState<string>('All');

  // Canvas Mode: Single card vs Multi-card Scorecard 3-Pack
  const [viewMode, setViewMode] = useState<'single' | 'scorecard'>('single');

  // Preview Canvas Wallpaper: 'warm' | 'dark' | 'checker'
  const [canvasBg, setCanvasBg] = useState<'warm' | 'dark' | 'checker'>('warm');

  // Zoom Level
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Code Tab in Preview Box
  const [codeTab, setCodeTab] = useState<'dax' | 'pbir' | 'svg'>('dax');

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showNotification(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showNotification('Failed to copy to clipboard.');
    }
  };

  // Generated SVG & Code
  const activeSvg = useMemo(() => {
    if (viewMode === 'scorecard') {
      const cards = [cardConfig, KPI_PRESETS[1].config, KPI_PRESETS[2].config];
      return generateScorecardSvg(cards, 16);
    }
    return generateKpiCardSvg(cardConfig);
  }, [cardConfig, viewMode]);

  const activeDax = useMemo(() => generateKpiDaxMeasure(cardConfig), [cardConfig]);
  const activePbir = useMemo(() => generateKpiPbirSnippet(cardConfig), [cardConfig]);

  // Filtered Presets
  const filteredPresets = useMemo(() => {
    if (presetCategory === 'All') return KPI_PRESETS;
    return KPI_PRESETS.filter((p) => p.category === presetCategory);
  }, [presetCategory]);

  const presetCategories = ['All', 'Executive', 'Sales', 'Finance', 'SaaS & Growth', 'Customer', 'Operations'];

  // Handle Preset Selection
  const handleSelectPreset = (config: KpiCardConfig) => {
    setCardConfig({ ...config, id: `kpi_${Date.now()}` });
    showNotification(`Loaded preset "${config.name}"`);
  };

  // 1-Click Palette Binding
  const handleBindActivePalette = () => {
    if (!paletteHexes || paletteHexes.length < 3) return;
    setCardConfig((prev) => ({
      ...prev,
      accentBarColor: paletteHexes[0],
      sparkColor: paletteHexes[0],
      progressBarColor: paletteHexes[0],
      iconColor: paletteHexes[0],
      iconBgColor: `${paletteHexes[0]}15`,
    }));
    showNotification('Bound active PowerLab palette swatches to KPI card!');
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] font-heading font-black text-xs shadow-[3px_3px_0px_0px_#1E293B] animate-in fade-in slide-in-from-bottom-2">
          {notification}
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 min-w-0">
        <div className="space-y-1.5 max-w-2xl min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-heading font-black bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/30 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5 fill-[#8B5CF6] stroke-none" />
            <span>EXECUTIVE METRICS & SCORECARD STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight break-words">
            Power BI KPI & Executive Card Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
            Design presentation-grade executive KPI cards and scorecards for Power BI. Customize typography, sparklines, variance delta badges, and radial progress rings, then export pure DAX Image URL measures, PBIR visual containers, or SVG/PNG wallpaper assets.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-heading font-extrabold text-[#1E293B] dark:text-slate-200">
            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700">✓ Pure DAX SVG Image URLs</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700">✓ Power BI New Card Ready</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700">✓ PBIR visual.json Export</span>
          </div>
        </div>

        {/* Header Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === 'single' ? 'scorecard' : 'single'))}
            className={`pop-btn inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer transition-all ${
              viewMode === 'scorecard'
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-purple-50'
            }`}
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>{viewMode === 'scorecard' ? 'Scorecard Active' : 'Scorecard 3-Pack'}</span>
          </button>

          <button
            type="button"
            onClick={handleBindActivePalette}
            className="pop-btn inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-heading font-black bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer"
            title="Auto-bind active PowerLab palette colors to card accents and sparklines"
          >
            <Palette className="w-4 h-4 stroke-[2.5]" />
            <span>Bind Palette</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0 items-start">
        {/* LEFT COLUMN: Live Canvas Preview & Code Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6 min-w-0">
          {/* Card Preview Container */}
          <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] space-y-4 min-w-0">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-slate-100 dark:border-slate-800 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-black text-slate-500 uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {viewMode === 'scorecard' ? 'Scorecard Row' : `${cardConfig.width}×${cardConfig.height}px`}
                </span>
              </div>

              {/* Wallpaper & Zoom Controls */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-[#1E293B]/30">
                  <button
                    type="button"
                    onClick={() => setCanvasBg('warm')}
                    className={`p-1 rounded text-xs cursor-pointer ${canvasBg === 'warm' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-400'}`}
                    title="Warm dot grid background"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasBg('dark')}
                    className={`p-1 rounded text-xs cursor-pointer ${canvasBg === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400'}`}
                    title="Dark navy background"
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasBg('checker')}
                    className={`p-1 rounded text-xs cursor-pointer ${canvasBg === 'checker' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-400'}`}
                    title="Checkerboard transparent"
                  >
                    <Box className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => (z === 100 ? 125 : z === 125 ? 75 : 100))}
                  className="pop-btn px-2 py-1 rounded-lg text-[10.5px] font-heading font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B] cursor-pointer"
                  title="Toggle Zoom"
                >
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" />
                    <span>{zoomLevel}%</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Visual Canvas Display Area */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border-2 border-[#1E293B] min-h-[220px] flex items-center justify-center overflow-x-auto transition-all ${
                canvasBg === 'warm'
                  ? 'bg-[#FFFDF5] bg-dot-grid'
                  : canvasBg === 'dark'
                  ? 'bg-[#0B1120]'
                  : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50'
              }`}
            >
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-150 inline-block drop-shadow-md select-none"
                dangerouslySetInnerHTML={{ __html: activeSvg }}
              />
            </div>

            {/* Quick Export Action Buttons Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => copyToClipboard(activeDax, 'dax', 'Power BI DAX Measure')}
                className="pop-btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-black bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
                title="Copy ready-to-paste DAX calculation measure"
              >
                {copiedKey === 'dax' ? <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy DAX</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(activeSvg, 'svg', 'Card SVG')}
                className="pop-btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-purple-50 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
                title="Copy pure SVG code"
              >
                {copiedKey === 'svg' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Code className="w-3.5 h-3.5" />}
                <span>Copy SVG</span>
              </button>

              <button
                type="button"
                onClick={() => downloadKpiSvg(cardConfig)}
                className="pop-btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-purple-50 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
                title="Download SVG file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG File</span>
              </button>

              <button
                type="button"
                onClick={() => downloadKpiPng(cardConfig)}
                className="pop-btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
                title="Download high-resolution PNG image"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG (2x)</span>
              </button>
            </div>

            {/* Code Inspector Tabs */}
            <div className="pt-2 border-t-2 border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[#1E293B]/30">
                  <button
                    type="button"
                    onClick={() => setCodeTab('dax')}
                    className={`px-3 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer ${
                      codeTab === 'dax'
                        ? 'bg-[#8B5CF6] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
                    }`}
                  >
                    DAX Measure
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeTab('pbir')}
                    className={`px-3 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer ${
                      codeTab === 'pbir'
                        ? 'bg-[#8B5CF6] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
                    }`}
                  >
                    PBIR JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeTab('svg')}
                    className={`px-3 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer ${
                      codeTab === 'svg'
                        ? 'bg-[#8B5CF6] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
                    }`}
                  >
                    Raw SVG
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      codeTab === 'dax' ? activeDax : codeTab === 'pbir' ? activePbir : activeSvg,
                      codeTab,
                      codeTab.toUpperCase()
                    )
                  }
                  className="pop-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B] cursor-pointer"
                >
                  {copiedKey === codeTab ? <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              {/* Code Box */}
              <div className="relative">
                <pre className="p-3.5 rounded-xl border-2 border-[#1E293B] bg-slate-950 text-slate-100 text-[10px] sm:text-[11px] font-mono overflow-x-auto max-h-52 leading-relaxed shadow-[3px_3px_0px_0px_#1E293B]">
                  <code>{codeTab === 'dax' ? activeDax : codeTab === 'pbir' ? activePbir : activeSvg}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabbed Inspector Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          <div className="pop-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] space-y-6 min-w-0">
            {/* Inspector Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'presets', label: 'Presets (12)', icon: Sparkles },
                { id: 'geometry', label: 'Card & Layout', icon: Sliders },
                { id: 'typography', label: 'Title & Callout', icon: Type },
                { id: 'badges', label: 'Comparison & Badges', icon: Target },
                { id: 'charts', label: 'Micro-Charts', icon: BarChart2 },
                { id: 'icons', label: 'Icon & Palette', icon: Palette },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = inspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInspectorTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap shrink-0 border-2 border-[#1E293B] ${
                      isActive
                        ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 shadow-[1px_1px_0px_0px_#1E293B]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PRESETS */}
            {inspectorTab === 'presets' && (
              <div className="space-y-4">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {presetCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPresetCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap shrink-0 border border-[#1E293B] ${
                        presetCategory === cat
                          ? 'bg-[#FBBF24] text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[560px] overflow-y-auto pr-1">
                  {filteredPresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.config)}
                      className={`p-3.5 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] space-y-2 ${
                        cardConfig.name === preset.name
                          ? 'bg-purple-50/80 dark:bg-purple-950/30 border-[#8B5CF6] shadow-[3px_3px_0px_0px_#8B5CF6]'
                          : 'bg-white dark:bg-slate-800 shadow-[2.5px_2.5px_0px_0px_#1E293B] hover:shadow-[3.5px_3.5px_0px_0px_#1E293B]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] font-heading font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {preset.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {preset.config.styleVariant}
                        </span>
                      </div>
                      <h4 className="text-xs font-heading font-black text-[#1E293B] dark:text-white truncate">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs font-black text-[#8B5CF6]">
                        <span>Load Preset</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CARD & LAYOUT */}
            {inspectorTab === 'geometry' && (
              <div className="space-y-5">
                {/* Style Variant Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Aesthetic Card Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'neo-pop', label: 'Neo-Pop', desc: 'Tactile bold borders & shadows' },
                      { id: 'clean-white', label: 'Clean White', desc: 'Minimal flat & modern' },
                      { id: 'executive-dark', label: 'Executive Dark', desc: 'Dark slate & neon accents' },
                      { id: 'glass-modern', label: 'Glass Modern', desc: 'Subtle frost & borders' },
                      { id: 'gradient-accent', label: 'Gradient Accent', desc: 'Top accent glow' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() =>
                          setCardConfig((prev) => ({
                            ...prev,
                            styleVariant: style.id as KpiCardStyle,
                            bgColor: style.id === 'executive-dark' ? '#0F172A' : '#FFFFFF',
                            borderColor: style.id === 'executive-dark' ? '#334155' : '#1E293B',
                            valueColor: style.id === 'executive-dark' ? '#F8FAFC' : '#1E293B',
                            categoryColor: style.id === 'executive-dark' ? '#94A3B8' : '#64748B',
                          }))
                        }
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          cardConfig.styleVariant === style.id
                            ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#1E293B]/40 hover:bg-purple-50'
                        }`}
                      >
                        <div className="text-xs font-heading font-black">{style.label}</div>
                        <div className="text-[10px] opacity-80 leading-tight">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-heading font-black">
                      <span>Card Width</span>
                      <span>{cardConfig.width} px</span>
                    </div>
                    <input
                      type="range"
                      min="220"
                      max="400"
                      step="5"
                      value={cardConfig.width}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, width: Number(e.target.value) }))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-heading font-black">
                      <span>Card Height</span>
                      <span>{cardConfig.height} px</span>
                    </div>
                    <input
                      type="range"
                      min="110"
                      max="180"
                      step="5"
                      value={cardConfig.height}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, height: Number(e.target.value) }))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Corner Radius & Border Width */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-heading font-black">
                      <span>Corner Radius</span>
                      <span>{cardConfig.cornerRadius} px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={cardConfig.cornerRadius}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, cornerRadius: Number(e.target.value) }))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-heading font-black">
                      <span>Border Thickness</span>
                      <span>{cardConfig.borderWidth} px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.5"
                      value={cardConfig.borderWidth}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, borderWidth: Number(e.target.value) }))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Accent Bar Toggle & Color */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                      Decorative Accent Bar
                    </label>
                    <input
                      type="checkbox"
                      checked={cardConfig.showAccentBar}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, showAccentBar: e.target.checked }))}
                      className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                    />
                  </div>

                  {cardConfig.showAccentBar && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">Position</span>
                        <div className="flex gap-2">
                          {(['top', 'left'] as const).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => setCardConfig((prev) => ({ ...prev, accentBarPosition: pos }))}
                              className={`flex-1 py-1 rounded-lg text-xs font-heading font-black border uppercase ${
                                cardConfig.accentBarPosition === pos
                                  ? 'bg-[#8B5CF6] text-white border-[#1E293B]'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">Accent Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={cardConfig.accentBarColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, accentBarColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-[#1E293B] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cardConfig.accentBarColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, accentBarColor: e.target.value }))}
                            className="w-24 px-2 py-1 rounded text-xs font-mono font-bold border border-[#1E293B]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Drop Shadow Toggle & Color */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                        Card Drop Shadow
                      </label>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Toggle tactile solid neo-pop shadow behind card
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={cardConfig.showShadow !== false}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, showShadow: e.target.checked }))}
                      className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                    />
                  </div>

                  {cardConfig.showShadow !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-heading font-black">
                          <span>Shadow Offset</span>
                          <span>{cardConfig.shadowOffset} px</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={cardConfig.shadowOffset}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, shadowOffset: Number(e.target.value) }))}
                          className="w-full accent-[#8B5CF6]"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">Shadow Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={cardConfig.shadowColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, shadowColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-[#1E293B] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cardConfig.shadowColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, shadowColor: e.target.value }))}
                            className="w-24 px-2 py-1 rounded text-xs font-mono font-bold border border-[#1E293B]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: TITLE & CALLOUT */}
            {inspectorTab === 'typography' && (
              <div className="space-y-5">
                {/* Category Header Label */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                      Category Label
                    </label>
                    <input
                      type="checkbox"
                      checked={cardConfig.showCategory}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, showCategory: e.target.checked }))}
                      className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                    />
                  </div>
                  {cardConfig.showCategory && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardConfig.category}
                        onChange={(e) => setCardConfig((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. MONTHLY REVENUE"
                        className="px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-heading font-black"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={cardConfig.categoryColor}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, categoryColor: e.target.value }))}
                          className="w-8 h-8 rounded border border-[#1E293B] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-500">Label Color</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtitle / Period */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                      Subtitle / Period
                    </label>
                    <input
                      type="checkbox"
                      checked={cardConfig.showSubtitle}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, showSubtitle: e.target.checked }))}
                      className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                    />
                  </div>
                  {cardConfig.showSubtitle && (
                    <input
                      type="text"
                      value={cardConfig.subtitle}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="e.g. vs Previous Month"
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-bold"
                    />
                  )}
                </div>

                {/* Primary Callout Value */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Primary Callout Metric
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Value Text</span>
                      <input
                        type="text"
                        value={cardConfig.value}
                        onChange={(e) => setCardConfig((prev) => ({ ...prev, value: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-sm font-heading font-black"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Unit / Suffix</span>
                      <input
                        type="text"
                        value={cardConfig.unitSuffix}
                        onChange={(e) => setCardConfig((prev) => ({ ...prev, unitSuffix: e.target.value }))}
                        placeholder="e.g. USD, %, pts"
                        className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-sm font-heading font-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-heading font-black">
                        <span>Font Size</span>
                        <span>{cardConfig.valueFontSize} px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="38"
                        value={cardConfig.valueFontSize}
                        onChange={(e) => setCardConfig((prev) => ({ ...prev, valueFontSize: Number(e.target.value) }))}
                        className="w-full accent-[#8B5CF6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-heading font-black">Font Family</span>
                      <select
                        value={cardConfig.fontFamily}
                        onChange={(e) => setCardConfig((prev) => ({ ...prev, fontFamily: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-bold"
                      >
                        {FONT_FAMILIES.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMPARISON & BADGES */}
            {inspectorTab === 'badges' && (
              <div className="space-y-5">
                {/* Variance Delta Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                      Delta Variance Pill Badge
                    </label>
                    <input
                      type="checkbox"
                      checked={cardConfig.showBadge}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, showBadge: e.target.checked }))}
                      className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                    />
                  </div>

                  {cardConfig.showBadge && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500">Badge Text</span>
                          <input
                            type="text"
                            value={cardConfig.badgeText}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, badgeText: e.target.value }))}
                            placeholder="e.g. +8.6%"
                            className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-heading font-black"
                          />
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500">Badge Style</span>
                          <select
                            value={cardConfig.badgeStyle}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, badgeStyle: e.target.value as KpiBadgeStyle }))}
                            className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-bold"
                          >
                            <option value="subtle-tint">Subtle Tinted Pill</option>
                            <option value="solid">Solid Vibrant Color</option>
                            <option value="outline">Clean Outline Border</option>
                            <option value="pill-minimal">Minimal Transparent</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500">Trend Direction</span>
                          <div className="flex gap-1.5 pt-1">
                            {(['up', 'down', 'neutral'] as const).map((dir) => (
                              <button
                                key={dir}
                                type="button"
                                onClick={() => setCardConfig((prev) => ({ ...prev, trendDirection: dir as KpiTrendDirection }))}
                                className={`flex-1 py-1 rounded-lg text-xs font-heading font-black border uppercase ${
                                  cardConfig.trendDirection === dir
                                    ? 'bg-[#8B5CF6] text-white border-[#1E293B]'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                {dir === 'up' ? '▲ Up' : dir === 'down' ? '▼ Down' : '● Flat'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500">Polarity Rule</span>
                          <select
                            value={cardConfig.polarity}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, polarity: e.target.value as KpiPolarity }))}
                            className="w-full mt-1 px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-bold"
                          >
                            <option value="good-up">Standard (Up = Green, Down = Red)</option>
                            <option value="good-down">Inverse / Churn (Down = Green, Up = Red)</option>
                            <option value="neutral">Neutral (Slate / Non-Evaluated)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target & Comparison Benchmark */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                      Target / Comparison Benchmark
                    </label>
                    <input
                      type="checkbox"
                      checked={cardConfig.showTarget}
                      onChange={(e) => setCardConfig((prev) => ({ ...prev, showTarget: e.target.checked }))}
                      className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                    />
                  </div>

                  {cardConfig.showTarget && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">Label (e.g. Target, Budget, SLA)</span>
                        <input
                          type="text"
                          value={cardConfig.targetLabel}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, targetLabel: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">Target Value</span>
                        <input
                          type="text"
                          value={cardConfig.targetValue}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, targetValue: e.target.value }))}
                          placeholder="e.g. $1.15M"
                          className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-bold"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: MICRO-CHARTS */}
            {inspectorTab === 'charts' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Micro-Graphic Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'sparkarea', label: 'Spark-Area', desc: 'Curved area gradient' },
                      { id: 'sparkline', label: 'Sparkline', desc: 'Minimal line trend' },
                      { id: 'bar-chart', label: 'Mini Bar Chart', desc: 'Discrete period bars' },
                      { id: 'stepped-area', label: 'Stepped Area', desc: 'Staircase step trend' },
                      { id: 'semi-gauge', label: 'Semi-Gauge', desc: '180° speedometer arc' },
                      { id: 'lollipop', label: 'Lollipop', desc: 'Stems with dot heads' },
                      { id: 'waffle', label: 'Waffle Grid', desc: '10-dot matrix progress' },
                      { id: 'progress-ring', label: 'Progress Ring', desc: 'Radial circular gauge' },
                      { id: 'progress-bar', label: 'Progress Bar', desc: 'Horizontal completion' },
                      { id: 'bullet', label: 'Bullet Chart', desc: 'Bar with target marker' },
                      { id: 'none', label: 'No Chart', desc: 'Clean typography only' },
                    ].map((chart) => (
                      <button
                        key={chart.id}
                        type="button"
                        onClick={() => setCardConfig((prev) => ({ ...prev, chartType: chart.id as KpiMicroChartType }))}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          cardConfig.chartType === chart.id
                            ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#1E293B]/40 hover:bg-purple-50'
                        }`}
                      >
                        <div className="text-xs font-heading font-black">{chart.label}</div>
                        <div className="text-[10px] opacity-80 leading-tight">{chart.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific controls based on chart type */}
                {['sparkline', 'sparkarea', 'bar-chart', 'stepped-area', 'lollipop'].includes(cardConfig.chartType) && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-[#1E293B] space-y-3">
                    <h4 className="text-xs font-heading font-black uppercase text-slate-500">Trend & Series Configuration</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">Series Color</span>
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="color"
                            value={cardConfig.sparkColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, sparkColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-[#1E293B] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cardConfig.sparkColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, sparkColor: e.target.value }))}
                            className="w-24 px-2 py-1 rounded text-xs font-mono font-bold border border-[#1E293B]"
                          />
                        </div>
                      </div>

                      {['sparkline', 'sparkarea', 'stepped-area'].includes(cardConfig.chartType) && (
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-xs font-heading font-black">End Pulse Dot</span>
                          <input
                            type="checkbox"
                            checked={cardConfig.showPulseDot}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, showPulseDot: e.target.checked }))}
                            className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Data Points (comma separated)</span>
                      <input
                        type="text"
                        value={cardConfig.sparkPoints.join(', ')}
                        onChange={(e) => {
                          const pts = e.target.value.split(',').map((p) => parseFloat(p.trim())).filter((n) => !isNaN(n));
                          if (pts.length >= 2) {
                            setCardConfig((prev) => ({ ...prev, sparkPoints: pts }));
                          }
                        }}
                        className="w-full mt-1 px-3 py-1.5 rounded-xl border border-[#1E293B] bg-white dark:bg-slate-800 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {['progress-ring', 'progress-bar', 'bullet', 'semi-gauge', 'waffle'].includes(cardConfig.chartType) && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-[#1E293B] space-y-3">
                    <h4 className="text-xs font-heading font-black uppercase text-slate-500">Progress Benchmark</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-heading font-black">
                        <span>Attainment Percentage</span>
                        <span>{cardConfig.progressValue}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cardConfig.progressValue}
                        onChange={(e) => setCardConfig((prev) => ({ ...prev, progressValue: Number(e.target.value) }))}
                        className="w-full accent-[#8B5CF6]"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Indicator Fill Color</span>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="color"
                          value={cardConfig.progressBarColor}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, progressBarColor: e.target.value }))}
                          className="w-8 h-8 rounded border border-[#1E293B] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cardConfig.progressBarColor}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, progressBarColor: e.target.value }))}
                          className="w-24 px-2 py-1 rounded text-xs font-mono font-bold border border-[#1E293B]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: ICONS & PALETTE BINDING */}
            {inspectorTab === 'icons' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Show Graphic Icon
                  </label>
                  <input
                    type="checkbox"
                    checked={cardConfig.showIcon}
                    onChange={(e) => setCardConfig((prev) => ({ ...prev, showIcon: e.target.checked }))}
                    className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                  />
                </div>

                {cardConfig.showIcon && (
                  <div className="space-y-4">
                    {/* Icon Selection Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500">Select Icon</span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        {Object.keys(KPI_ICONS).map((iconKey) => {
                          const isSelected = cardConfig.iconName === iconKey;
                          return (
                            <button
                              key={iconKey}
                              type="button"
                              onClick={() => setCardConfig((prev) => ({ ...prev, iconName: iconKey }))}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-xs'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50'
                              }`}
                              title={iconKey}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                dangerouslySetInnerHTML={{ __html: KPI_ICONS[iconKey] }}
                              />
                              <span className="text-[9px] font-mono mt-1 truncate max-w-full">{iconKey}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Icon Color & Badge Styling */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">Icon Color</span>
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="color"
                            value={cardConfig.iconColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, iconColor: e.target.value }))}
                            className="w-8 h-8 rounded border border-[#1E293B] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cardConfig.iconColor}
                            onChange={(e) => setCardConfig((prev) => ({ ...prev, iconColor: e.target.value }))}
                            className="w-24 px-2 py-1 rounded text-xs font-mono font-bold border border-[#1E293B]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        <span className="text-xs font-heading font-black">Circular/Square Badge Box</span>
                        <input
                          type="checkbox"
                          checked={cardConfig.iconBadge}
                          onChange={(e) => setCardConfig((prev) => ({ ...prev, iconBadge: e.target.checked }))}
                          className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

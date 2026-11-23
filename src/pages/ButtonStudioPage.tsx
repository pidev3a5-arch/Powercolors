import React, { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Palette,
  Code,
  Box,
} from 'lucide-react';
import { AppPage } from '../core/types';
import {
  ButtonConfig,
  ButtonState,
  ButtonType,
  ButtonCornerRadius,
  ButtonIconPosition,
} from '../core/button/types';
import {
  generateButtonSvg,
  downloadButtonSvg,
  downloadButtonPng,
  exportButtonBundleZip,
  downloadButtonBundleZip,
  generateButtonDaxExpression,
} from '../core/button/buttonEngine';
import { CURATED_BUTTON_PRESETS } from '../core/button/presets';
import { SVG_ICONS_COLLECTION } from '../core/iconLibrary/icons';

interface ButtonStudioPageProps {
  onNavigate: (page: AppPage) => void;
  paletteHexes?: string[];
}

const DEFAULT_PALETTE = ['#8B5CF6', '#FBBF24', '#34D399', '#38BDF8', '#F472B6', '#1E293B', '#10B981', '#EC4899'];

const FONT_FAMILIES = ['Segoe UI', 'Aptos', 'DIN', 'Plus Jakarta Sans', 'Outfit', 'Arial', 'Verdana'];

export const ButtonStudioPage: React.FC<ButtonStudioPageProps> = ({
  onNavigate,
  paletteHexes = DEFAULT_PALETTE,
}) => {
  // Active button configuration
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>(CURATED_BUTTON_PRESETS[0].config);

  // Active simulated state
  const [activeState, setActiveState] = useState<ButtonState>('default');

  // Inspector tabs
  const [inspectorTab, setInspectorTab] = useState<'presets' | 'geometry' | 'style' | 'typography' | 'icon'>('presets');

  // State override tab (when customizing states in geometry/style tab)
  const [overrideStateTab, setOverrideStateTab] = useState<'hover' | 'pressed' | 'inactive' | 'disabled'>('hover');

  // Icon search query
  const [iconSearch, setIconSearch] = useState('');

  // Notifications / Copied state
  const [copiedDax, setCopiedDax] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [isExportingBundle, setIsExportingBundle] = useState(false);

  // SVG strings for all 4 states for preview
  const defaultSvg = useMemo(() => generateButtonSvg(buttonConfig, 'default'), [buttonConfig]);
  const hoverSvg = useMemo(() => generateButtonSvg(buttonConfig, 'hover'), [buttonConfig]);
  const pressedSvg = useMemo(() => generateButtonSvg(buttonConfig, 'pressed'), [buttonConfig]);
  const disabledSvg = useMemo(() => generateButtonSvg(buttonConfig, 'disabled'), [buttonConfig]);

  // Active state SVG
  const activeSvg = useMemo(() => generateButtonSvg(buttonConfig, activeState), [buttonConfig, activeState]);

  // Filtered icons for icon picker
  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return SVG_ICONS_COLLECTION.slice(0, 32);
    const q = iconSearch.toLowerCase().trim();
    return SVG_ICONS_COLLECTION.filter(
      (ic) => ic.name.toLowerCase().includes(q) || ic.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 36);
  }, [iconSearch]);

  // Handlers
  const handleApplyPreset = (presetConfig: ButtonConfig) => {
    setButtonConfig({ ...presetConfig });
    setActiveState('default');
  };

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    setButtonConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateStateOverride = (
    state: 'hover' | 'pressed' | 'inactive' | 'disabled',
    key: string,
    val: any
  ) => {
    setButtonConfig((prev) => ({
      ...prev,
      stateOverrides: {
        ...prev.stateOverrides,
        [state]: {
          ...prev.stateOverrides?.[state],
          [key]: val,
        },
      },
    }));
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(activeSvg);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleCopyDax = () => {
    const dax = generateButtonDaxExpression(buttonConfig, activeState);
    navigator.clipboard.writeText(dax);
    setCopiedDax(true);
    setTimeout(() => setCopiedDax(false), 2000);
  };

  const handleDownloadActiveSvg = () => {
    downloadButtonSvg(buttonConfig, activeState);
  };

  const handleDownloadActivePng = () => {
    downloadButtonPng(buttonConfig, activeState);
  };

  const handleDownloadZipBundle = async () => {
    setIsExportingBundle(true);
    try {
      const blob = await exportButtonBundleZip(buttonConfig, ['default', 'hover', 'pressed', 'disabled']);
      downloadButtonBundleZip(blob, buttonConfig.name);
    } finally {
      setIsExportingBundle(false);
    }
  };

  return (
    <main className="flex-1 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b-2 border-[#1E293B] dark:border-slate-800">
        <div className="space-y-2 text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 text-xs font-heading font-black border border-[#8B5CF6]/30 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>POWER BI BUTTON & INTERACTION STUDIO</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight">
            Power BI <span className="text-[#8B5CF6]">Button Studio</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Build presentation-grade custom buttons for Power BI Desktop. Simulate all 4 interactive states (Default, On hover, On press, Disabled), customize geometry, icons & typography, then export SVGs, PNGs, or a 1-click Power BI state bundle.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ 4-State Simulation
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#BBF7D0] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ 120+ SVG Icons
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#BAE6FD] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ 1-Click Power BI State ZIP
            </span>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('icon-library')}
            className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer hover:bg-slate-50"
          >
            <ImageIcon className="w-4 h-4 text-[#10B981]" />
            <span>Icon Library</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('theme-generator')}
            className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8B5CF6] text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer hover:bg-[#7C3AED]"
          >
            <Sliders className="w-4 h-4" />
            <span>Theme Studio</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Stage (Live Simulator + 4-State Strip) & Right Stage (Inspector Tabs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LIVE SIMULATOR & 4-STATE PREVIEW STRIP (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Hero Simulator Box */}
          <div className="pop-card p-6 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-heading font-black uppercase text-slate-500 tracking-wider">
                Live Interactive Simulator
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                {buttonConfig.width} × {buttonConfig.height} px
              </span>
            </div>

            {/* Interactive Stage Viewport */}
            <div className="w-full min-h-[180px] rounded-2xl bg-[#FFFDF5] dark:bg-slate-950 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex flex-col items-center justify-center p-6 transition-all relative overflow-hidden bg-dot-grid">
              <div
                className="transform transition-transform cursor-pointer select-none"
                onMouseEnter={() => activeState === 'default' && setActiveState('hover')}
                onMouseLeave={() => activeState === 'hover' && setActiveState('default')}
                onMouseDown={() => setActiveState('pressed')}
                onMouseUp={() => setActiveState('hover')}
                dangerouslySetInnerHTML={{ __html: activeSvg }}
                title="Hover & Click to test interaction!"
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                Interactive: Click or hover directly on button to test!
              </span>
            </div>

            {/* State Switcher Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                  Simulate Power BI State:
                </span>
                <span className="text-[11px] font-heading font-black uppercase text-[#8B5CF6]">
                  Active: {activeState}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-[#1E293B]">
                {(['default', 'hover', 'pressed', 'inactive', 'disabled'] as ButtonState[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveState(st)}
                    className={`py-1.5 rounded-lg text-[11px] font-heading font-black capitalize transition-all cursor-pointer ${
                      activeState === st
                        ? 'bg-[#8B5CF6] text-white shadow-[1.5px_1.5px_0px_0px_#1E293B] border border-[#1E293B]'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    {st === 'pressed' ? 'Press' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Export Action Bar */}
            <div className="space-y-2.5 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadActiveSvg}
                  className="pop-btn py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50"
                  title="Download vector SVG of the currently active state"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download .SVG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadActivePng}
                  className="pop-btn py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50"
                  title="Download high-resolution rasterized PNG"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download .PNG (2x)</span>
                </button>
              </div>

              {/* 1-Click Power BI 4-State Bundle */}
              <button
                type="button"
                onClick={handleDownloadZipBundle}
                disabled={isExportingBundle}
                className="pop-btn w-full py-3 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-black text-xs sm:text-sm border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] inline-flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                title="Download ready-to-import ZIP containing Default, Hover, Press, and Disabled SVG/PNG files plus setup README"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isExportingBundle
                    ? 'Packaging Power BI Bundle...'
                    : 'Download 4-State Power BI Bundle (.zip)'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopySvg}
                  className="pop-btn py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-heading font-bold text-xs border-2 border-[#1E293B] inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100"
                >
                  {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSvg ? 'Copied SVG!' : 'Copy SVG'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDax}
                  className="pop-btn py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-heading font-bold text-xs border-2 border-[#1E293B] inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100"
                >
                  {copiedDax ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5" />}
                  <span>{copiedDax ? 'Copied DAX!' : 'Copy DAX Measure'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4-State Comparison Strip: Shows Default, Hover, Press, Disabled side-by-side */}
          <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-heading font-black text-slate-800 dark:text-slate-200">
                Power BI 4-State Transformation Strip
              </span>
              <span className="text-[10px] font-heading font-bold text-slate-500 uppercase">
                Visual Sync
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Default */}
              <div
                onClick={() => setActiveState('default')}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'default'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                  1. Default
                </span>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: defaultSvg }}
                />
              </div>

              {/* On Hover */}
              <div
                onClick={() => setActiveState('hover')}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'hover'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                  2. On Hover
                </span>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: hoverSvg }}
                />
              </div>

              {/* On Press */}
              <div
                onClick={() => setActiveState('pressed')}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'pressed'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                  3. On Press
                </span>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: pressedSvg }}
                />
              </div>

              {/* Disabled */}
              <div
                onClick={() => setActiveState('disabled')}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'disabled'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                  4. Disabled
                </span>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: disabledSvg }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INSPECTOR CONTROLS TABS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="pop-card p-6 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] space-y-5">
            {/* Inspector Tab Bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-[#1E293B] overflow-x-auto">
              <button
                type="button"
                onClick={() => setInspectorTab('presets')}
                className={`pop-btn px-3 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  inspectorTab === 'presets'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presets (8)</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorTab('geometry')}
                className={`pop-btn px-3 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  inspectorTab === 'geometry'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Type & Size</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorTab('style')}
                className={`pop-btn px-3 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  inspectorTab === 'style'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Colors & Fill</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorTab('typography')}
                className={`pop-btn px-3 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  inspectorTab === 'typography'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Title & Badge</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorTab('icon')}
                className={`pop-btn px-3 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  inspectorTab === 'icon'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Icon System</span>
              </button>
            </div>

            {/* TAB 1: PRESETS */}
            {inspectorTab === 'presets' && (
              <div className="space-y-4">
                <span className="text-xs text-slate-500 font-medium block">
                  Select a battle-tested Power BI button preset to immediately populate styling and 4-state transforms.
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {CURATED_BUTTON_PRESETS.map((preset) => {
                    const presetSvg = generateButtonSvg(preset.config, 'default');
                    const isSelected = buttonConfig.name === preset.config.name;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.config)}
                        className={`p-3.5 rounded-2xl border-2 border-[#1E293B] flex flex-col justify-between space-y-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/40 shadow-[3px_3px_0px_0px_#8B5CF6]'
                            : 'bg-[#FFFDF5] dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-[2px_2px_0px_0px_#1E293B]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-black text-xs text-[#1E293B] dark:text-white">
                              {preset.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E293B] text-white">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                            {preset.description}
                          </p>
                        </div>

                        <div className="w-full py-2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <div dangerouslySetInnerHTML={{ __html: presetSvg }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: GEOMETRY & TYPE */}
            {inspectorTab === 'geometry' && (
              <div className="space-y-5">
                {/* Button Name & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Button Name
                    </label>
                    <input
                      type="text"
                      value={buttonConfig.name}
                      onChange={(e) => updateConfig({ name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-bold bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Button Role / Type
                    </label>
                    <select
                      value={buttonConfig.type}
                      onChange={(e) => updateConfig({ type: e.target.value as ButtonType })}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-bold bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                    >
                      <option value="nav">Nav Button (Ribbon / Bookmark)</option>
                      <option value="filter">Filter Button (Slicer Chip)</option>
                      <option value="action">Action Button (CTA / Drill-down)</option>
                      <option value="info">Info / Help Button</option>
                      <option value="kpi">KPI Quick Link Button</option>
                      <option value="icon-only">Icon-Only Action</option>
                      <option value="pill-tag">Status Pill / Tag</option>
                    </select>
                  </div>
                </div>

                {/* Width & Height Sliders */}
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Width: {buttonConfig.width} px</span>
                      <span className="text-slate-400 font-mono text-[11px]">40px - 320px</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="320"
                      step="2"
                      value={buttonConfig.width}
                      onChange={(e) => updateConfig({ width: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Height: {buttonConfig.height} px</span>
                      <span className="text-slate-400 font-mono text-[11px]">28px - 80px</span>
                    </div>
                    <input
                      type="range"
                      min="28"
                      max="80"
                      step="2"
                      value={buttonConfig.height}
                      onChange={(e) => updateConfig({ height: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Corner Radius Presets */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300 block">
                    Corner Geometry
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['square', 'subtle', 'smooth', 'rounded', 'pill'] as ButtonCornerRadius[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => updateConfig({ cornerRadius: r, customRadius: undefined })}
                        className={`py-2 px-2 rounded-xl text-xs font-heading font-black capitalize transition-all cursor-pointer text-center ${
                          buttonConfig.cornerRadius === r
                            ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border-2 border-[#1E293B]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-[#1E293B] hover:bg-purple-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COLORS & STYLING */}
            {inspectorTab === 'style' && (
              <div className="space-y-5">
                {/* 1-Click Palette Binding */}
                <div className="space-y-2">
                  <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-300 block">
                    1-Click Color Swatches (Active Theme):
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {paletteHexes.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => updateConfig({ fillColor: hex })}
                        style={{ backgroundColor: hex }}
                        className="w-8 h-8 rounded-xl border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] hover:scale-110 transition-transform cursor-pointer shrink-0"
                        title={`Apply ${hex} to button fill`}
                      />
                    ))}
                  </div>
                </div>

                {/* Fill & Border Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Fill Color (Hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={buttonConfig.fillColor}
                        onChange={(e) => updateConfig({ fillColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={buttonConfig.fillColor}
                        onChange={(e) => updateConfig({ fillColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Border Color (Hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={buttonConfig.borderColor}
                        onChange={(e) => updateConfig({ borderColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={buttonConfig.borderColor}
                        onChange={(e) => updateConfig({ borderColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Border Width & Shadow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Border Width: {buttonConfig.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={buttonConfig.borderWidth}
                      onChange={(e) => updateConfig({ borderWidth: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Neo-Pop Shadow Offset: {buttonConfig.shadowOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="1"
                      value={buttonConfig.shadowOffset}
                      onChange={(e) => updateConfig({ shadowOffset: parseInt(e.target.value, 10), hasShadow: parseInt(e.target.value, 10) > 0 })}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* State Override Customizer */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-black text-slate-800 dark:text-slate-200">
                      Customize State Overrides
                    </span>
                    <div className="flex items-center gap-1">
                      {(['hover', 'pressed', 'inactive', 'disabled'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOverrideStateTab(st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-heading font-black capitalize transition-all ${
                            overrideStateTab === st
                              ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                              : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {overrideStateTab.toUpperCase()} Fill Color
                      </span>
                      <input
                        type="text"
                        value={buttonConfig.stateOverrides?.[overrideStateTab]?.fillColor || ''}
                        placeholder={buttonConfig.fillColor}
                        onChange={(e) => updateStateOverride(overrideStateTab, 'fillColor', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E293B] text-xs font-mono font-bold bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {overrideStateTab.toUpperCase()} Text Color
                      </span>
                      <input
                        type="text"
                        value={buttonConfig.stateOverrides?.[overrideStateTab]?.textColor || ''}
                        placeholder={buttonConfig.textColor}
                        onChange={(e) => updateStateOverride(overrideStateTab, 'textColor', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E293B] text-xs font-mono font-bold bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TYPOGRAPHY & BADGE */}
            {inspectorTab === 'typography' && (
              <div className="space-y-5">
                {/* Title Text & Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Button Label
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={buttonConfig.showTitle}
                        onChange={(e) => updateConfig({ showTitle: e.target.checked })}
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span>Show Label</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={buttonConfig.title}
                    disabled={!buttonConfig.showTitle}
                    onChange={(e) => updateConfig({ title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs sm:text-sm font-bold bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white disabled:opacity-50"
                  />
                </div>

                {/* Font Family & Text Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Font Family
                    </label>
                    <select
                      value={buttonConfig.fontFamily}
                      onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-bold bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                    >
                      {FONT_FAMILIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={buttonConfig.textColor}
                        onChange={(e) => updateConfig({ textColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={buttonConfig.textColor}
                        onChange={(e) => updateConfig({ textColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Font Size: {buttonConfig.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="22"
                      step="1"
                      value={buttonConfig.fontSize}
                      onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Font Weight
                    </label>
                    <select
                      value={buttonConfig.fontWeight}
                      onChange={(e) => updateConfig({ fontWeight: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-bold bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                    >
                      <option value="normal">Normal (500)</option>
                      <option value="bold">Bold (700)</option>
                      <option value="black">Black (900)</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle / Counter Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-heading font-black text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={buttonConfig.showBadge}
                        onChange={(e) => updateConfig({ showBadge: e.target.checked })}
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span>Enable Notification / Status Badge</span>
                    </label>
                  </div>

                  {buttonConfig.showBadge && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Badge Text</span>
                        <input
                          type="text"
                          value={buttonConfig.badgeText}
                          onChange={(e) => updateConfig({ badgeText: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E293B] text-xs font-bold bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Badge Fill</span>
                        <input
                          type="color"
                          value={buttonConfig.badgeBgColor}
                          onChange={(e) => updateConfig({ badgeBgColor: e.target.value })}
                          className="w-full h-8 rounded-lg border border-[#1E293B] cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Badge Text Color</span>
                        <input
                          type="color"
                          value={buttonConfig.badgeTextColor}
                          onChange={(e) => updateConfig({ badgeTextColor: e.target.value })}
                          className="w-full h-8 rounded-lg border border-[#1E293B] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: ICON SYSTEM */}
            {inspectorTab === 'icon' && (
              <div className="space-y-5">
                {/* Icon Toggle & Position */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <label className="flex items-center gap-1.5 text-xs font-heading font-black text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={buttonConfig.showIcon}
                      onChange={(e) => updateConfig({ showIcon: e.target.checked })}
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span>Show Icon</span>
                  </label>

                  <div className="flex items-center gap-1">
                    {(['left', 'right', 'top', 'icon-only'] as ButtonIconPosition[]).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => updateConfig({ iconPosition: pos })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-heading font-black capitalize transition-all ${
                          buttonConfig.iconPosition === pos
                            ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Size & Icon Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Icon Size: {buttonConfig.iconSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      step="1"
                      value={buttonConfig.iconSize}
                      onChange={(e) => updateConfig({ iconSize: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Icon Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={buttonConfig.iconColor}
                        onChange={(e) => updateConfig({ iconColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={buttonConfig.iconColor}
                        onChange={(e) => updateConfig({ iconColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Icon Picker Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Select Icon from Library
                    </span>
                    <input
                      type="text"
                      placeholder="Search icons (filter, home, arrow, search)..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="w-56 px-2.5 py-1 rounded-lg border border-[#1E293B] text-xs bg-[#FFFDF5] dark:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-[#1E293B] max-h-48 overflow-y-auto">
                    {filteredIcons.map((ic) => {
                      const isSelected = buttonConfig.iconName === ic.id;
                      return (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => updateConfig({ iconName: ic.id })}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                          title={ic.name}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dangerouslySetInnerHTML={{ __html: ic.body }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

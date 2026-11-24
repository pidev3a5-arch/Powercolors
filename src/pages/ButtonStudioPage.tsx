import React, { useState, useMemo, useRef } from 'react';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  X,
  RotateCcw,
} from 'lucide-react';
import { AppPage } from '../core/types';
import { copyToClipboard } from '../core/clipboard';
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
  sanitizeCustomSvg,
  resolveEffectiveStateConfig,
} from '../core/button/buttonEngine';
import { CURATED_BUTTON_PRESETS } from '../core/button/presets';
import { SVG_ICONS_COLLECTION } from '../core/iconLibrary/icons';

interface ButtonStudioPageProps {
  onNavigate: (page: AppPage) => void;
  paletteHexes?: string[];
}

const DEFAULT_PALETTE = ['#8B5CF6', '#FBBF24', '#34D399', '#38BDF8', '#F472B6', '#1E293B', '#10B981', '#EC4899'];

const FONT_FAMILIES = ['Segoe UI', 'Poppins', 'Outfit', 'Plus Jakarta Sans', 'DIN', 'Arial', 'Verdana'];

export const ButtonStudioPage: React.FC<ButtonStudioPageProps> = ({
  onNavigate,
  paletteHexes = DEFAULT_PALETTE,
}) => {
  // Active button configuration
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>(CURATED_BUTTON_PRESETS[0].config);

  // Active simulated state in live simulator
  const [activeState, setActiveState] = useState<ButtonState>('default');

  // Active state currently selected for editing in inspector
  const [editingState, setEditingState] = useState<ButtonState>('default');

  // Inspector tabs
  const [inspectorTab, setInspectorTab] = useState<'presets' | 'geometry' | 'style' | 'typography' | 'icon'>('presets');

  // Computed effective state configuration for the state currently being edited
  const effectiveActiveState = useMemo(
    () => resolveEffectiveStateConfig(buttonConfig, editingState),
    [buttonConfig, editingState]
  );

  // Icon search query & custom icon upload ref
  const [iconSearch, setIconSearch] = useState('');
  const [isPastingSvg, setIsPastingSvg] = useState(false);
  const [rawSvgInput, setRawSvgInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unified property updater for either default base or specific state override
  const updateActiveStateProperty = (key: string, val: any) => {
    if (editingState === 'default') {
      setButtonConfig((prev) => ({ ...prev, [key]: val }));
    } else {
      setButtonConfig((prev) => ({
        ...prev,
        stateOverrides: {
          ...prev.stateOverrides,
          [editingState]: {
            ...prev.stateOverrides?.[editingState],
            [key]: val,
          },
        },
      }));
    }
  };

  const handleResetStateOverrides = (stateToReset: ButtonState) => {
    if (stateToReset === 'default') return;
    setButtonConfig((prev) => {
      const nextOverrides = { ...prev.stateOverrides };
      delete nextOverrides[stateToReset];
      return { ...prev, stateOverrides: nextOverrides };
    });
  };

  const handleCopyDefaultToState = (targetState: ButtonState) => {
    if (targetState === 'default') return;
    setButtonConfig((prev) => ({
      ...prev,
      stateOverrides: {
        ...prev.stateOverrides,
        [targetState]: {
          title: prev.title,
          showTitle: prev.showTitle,
          fontFamily: prev.fontFamily,
          fontSize: prev.fontSize,
          fontWeight: prev.fontWeight,
          textAlign: prev.textAlign,
          showIcon: prev.showIcon,
          iconName: prev.iconName,
          customIconSvg: prev.customIconSvg,
          iconPosition: prev.iconPosition,
          iconSize: prev.iconSize,
          showBadge: prev.showBadge,
          badgeText: prev.badgeText,
          badgeBgColor: prev.badgeBgColor,
          badgeTextColor: prev.badgeTextColor,
          fillColor: prev.fillColor,
          borderColor: prev.borderColor,
          borderWidth: prev.borderWidth,
          textColor: prev.textColor,
          iconColor: prev.iconColor,
        },
      },
    }));
  };

  const handleUploadSvgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        updateActiveStateProperty('customIconSvg', content);
        updateActiveStateProperty('showIcon', true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyPastedSvg = () => {
    if (rawSvgInput.trim()) {
      updateActiveStateProperty('customIconSvg', rawSvgInput.trim());
      updateActiveStateProperty('showIcon', true);
      setIsPastingSvg(false);
    }
  };

  const handleClearCustomIcon = () => {
    updateActiveStateProperty('customIconSvg', undefined);
    setRawSvgInput('');
    setIsPastingSvg(false);
  };

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
    setEditingState('default');
  };

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    setButtonConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopySvg = async () => {
    const success = await copyToClipboard(activeSvg);
    if (success) {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    }
  };

  const handleCopyDax = async () => {
    const dax = generateButtonDaxExpression(buttonConfig, activeState);
    const success = await copyToClipboard(dax);
    if (success) {
      setCopiedDax(true);
      setTimeout(() => setCopiedDax(false), 2000);
    }
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
                    onClick={() => {
                      setActiveState(st);
                      setEditingState(st);
                    }}
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
                onClick={() => {
                  setActiveState('default');
                  setEditingState('default');
                }}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'default'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                    1. Default
                  </span>
                  <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[80px]">
                    "{buttonConfig.title}"
                  </span>
                </div>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: defaultSvg }}
                />
              </div>

              {/* On Hover */}
              <div
                onClick={() => {
                  setActiveState('hover');
                  setEditingState('hover');
                }}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'hover'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                    2. On Hover
                  </span>
                  <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[80px]">
                    "{buttonConfig.stateOverrides?.hover?.title || buttonConfig.title}"
                  </span>
                </div>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: hoverSvg }}
                />
              </div>

              {/* On Press */}
              <div
                onClick={() => {
                  setActiveState('pressed');
                  setEditingState('pressed');
                }}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'pressed'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                    3. On Press
                  </span>
                  <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[80px]">
                    "{buttonConfig.stateOverrides?.pressed?.title || buttonConfig.title}"
                  </span>
                </div>
                <div
                  className="max-w-full flex items-center justify-center py-1"
                  dangerouslySetInnerHTML={{ __html: pressedSvg }}
                />
              </div>

              {/* Disabled */}
              <div
                onClick={() => {
                  setActiveState('disabled');
                  setEditingState('disabled');
                }}
                className={`p-3 rounded-2xl border-2 border-[#1E293B] flex flex-col items-center justify-between space-y-2 cursor-pointer transition-all ${
                  activeState === 'disabled'
                    ? 'bg-purple-50 dark:bg-purple-950/40 ring-2 ring-[#8B5CF6]'
                    : 'bg-[#FFFDF5] dark:bg-slate-950 hover:bg-slate-50'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-heading font-black uppercase text-slate-600 dark:text-slate-400">
                    4. Disabled
                  </span>
                  <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[80px]">
                    "{buttonConfig.stateOverrides?.disabled?.title || buttonConfig.title}"
                  </span>
                </div>
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
            {/* STATE SELECTOR & CUSTOMIZATION HEADER */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-amber-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 border-2 border-[#1E293B] dark:border-slate-700 shadow-[2.5px_2.5px_0px_0px_#1E293B] space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-heading font-black text-slate-500 uppercase tracking-wider">
                    Editing Button State:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-heading font-black bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]">
                    {editingState === 'default'
                      ? '1. DEFAULT (BASE)'
                      : editingState === 'hover'
                      ? '2. ON HOVER'
                      : editingState === 'pressed'
                      ? '3. ON PRESS'
                      : editingState === 'inactive'
                      ? 'INACTIVE (NAV)'
                      : '4. DISABLED'}
                  </span>
                  {editingState !== 'default' && buttonConfig.stateOverrides?.[editingState] && Object.keys(buttonConfig.stateOverrides[editingState] || {}).length > 0 && (
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                      Overrides Active
                    </span>
                  )}
                </div>

                {editingState !== 'default' && (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyDefaultToState(editingState)}
                      className="text-[11px] font-heading font-bold text-slate-600 dark:text-slate-400 hover:text-[#8B5CF6] transition-colors cursor-pointer"
                      title="Clone base default values to this state"
                    >
                      Clone Base
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      type="button"
                      onClick={() => handleResetStateOverrides(editingState)}
                      className="text-[11px] font-heading font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
                      title="Clear all overrides for this state and inherit from default"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Overrides</span>
                    </button>
                  </div>
                )}
              </div>

              {/* State Selector Buttons */}
              <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-[#1E293B]/40 dark:border-slate-700">
                {[
                  { id: 'default', label: 'Default', tag: 'Base' },
                  { id: 'hover', label: 'On Hover', tag: 'Action' },
                  { id: 'pressed', label: 'On Press', tag: 'Push' },
                  { id: 'inactive', label: 'Inactive', tag: 'Idle' },
                  { id: 'disabled', label: 'Disabled', tag: 'Lock' },
                ].map((st) => {
                  const isSelected = editingState === st.id;
                  const hasOverrides = st.id !== 'default' && buttonConfig.stateOverrides?.[st.id as ButtonState] && Object.keys(buttonConfig.stateOverrides[st.id as ButtonState] || {}).length > 0;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setEditingState(st.id as ButtonState);
                        setActiveState(st.id as ButtonState);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-heading font-black flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{st.label}</span>
                      <span className={`text-[9px] font-bold ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                        {st.tag}
                      </span>
                      {hasOverrides && !isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1 border border-white dark:border-slate-800" title="State has custom overrides" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
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
                <span>Presets (18)</span>
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      1-Click Color Swatches (Apply to {editingState.toUpperCase()} fill):
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Target: {editingState}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {paletteHexes.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => updateActiveStateProperty('fillColor', hex)}
                        style={{ backgroundColor: hex }}
                        className="w-8 h-8 rounded-xl border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] hover:scale-110 transition-transform cursor-pointer shrink-0"
                        title={`Apply ${hex} to ${editingState} button fill`}
                      />
                    ))}
                  </div>
                </div>

                {/* Fill & Border Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Fill Color ({editingState.toUpperCase()})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={effectiveActiveState.fillColor}
                        onChange={(e) => updateActiveStateProperty('fillColor', e.target.value)}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={effectiveActiveState.fillColor}
                        onChange={(e) => updateActiveStateProperty('fillColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Border Color ({editingState.toUpperCase()})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={effectiveActiveState.borderColor}
                        onChange={(e) => updateActiveStateProperty('borderColor', e.target.value)}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={effectiveActiveState.borderColor}
                        onChange={(e) => updateActiveStateProperty('borderColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Border Width & Shadow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Border Width: {effectiveActiveState.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={effectiveActiveState.borderWidth}
                      onChange={(e) => updateActiveStateProperty('borderWidth', parseInt(e.target.value, 10))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Neo-Pop Shadow Offset: {effectiveActiveState.shadowOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="1"
                      value={effectiveActiveState.shadowOffset}
                      onChange={(e) => updateActiveStateProperty('shadowOffset', parseInt(e.target.value, 10))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* State-specific Physical Transforms */}
                {editingState !== 'default' ? (
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-slate-800 border-2 border-[#1E293B] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-black text-slate-800 dark:text-slate-200">
                        {editingState.toUpperCase()} Interaction Physics & Depth
                      </span>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-bold">
                        PBI State Sync
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-heading font-black">
                          <span>Vertical Shift (Offset Y): {effectiveActiveState.offsetY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-4"
                          max="4"
                          step="1"
                          value={effectiveActiveState.offsetY}
                          onChange={(e) => updateActiveStateProperty('offsetY', parseInt(e.target.value, 10))}
                          className="w-full accent-[#8B5CF6]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-heading font-black">
                          <span>Opacity: {Math.round(effectiveActiveState.opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="1"
                          step="0.05"
                          value={effectiveActiveState.opacity}
                          onChange={(e) => updateActiveStateProperty('opacity', parseFloat(e.target.value))}
                          className="w-full accent-[#8B5CF6]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-[#1E293B]/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>💡 Editing Base Default Colors. Switch to <strong>On Hover</strong> or <strong>On Press</strong> above to customize state-specific colors or lift effects.</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TYPOGRAPHY & BADGE */}
            {inspectorTab === 'typography' && (
              <div className="space-y-5">
                {/* Title Text & Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                        Button Label ({editingState.toUpperCase()} State)
                      </label>
                      {editingState !== 'default' && buttonConfig.stateOverrides?.[editingState]?.title !== undefined && (
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded">
                          State Specific
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={effectiveActiveState.showTitle}
                        onChange={(e) => updateActiveStateProperty('showTitle', e.target.checked)}
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span>Show Label</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={effectiveActiveState.title}
                    disabled={!effectiveActiveState.showTitle}
                    placeholder={buttonConfig.title}
                    onChange={(e) => updateActiveStateProperty('title', e.target.value)}
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
                      value={effectiveActiveState.fontFamily}
                      onChange={(e) => updateActiveStateProperty('fontFamily', e.target.value)}
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
                      Text Color ({editingState.toUpperCase()})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={effectiveActiveState.textColor}
                        onChange={(e) => updateActiveStateProperty('textColor', e.target.value)}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={effectiveActiveState.textColor}
                        onChange={(e) => updateActiveStateProperty('textColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading font-black">
                      <span>Font Size: {effectiveActiveState.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="22"
                      step="1"
                      value={effectiveActiveState.fontSize}
                      onChange={(e) => updateActiveStateProperty('fontSize', parseInt(e.target.value, 10))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Font Weight
                    </label>
                    <select
                      value={effectiveActiveState.fontWeight}
                      onChange={(e) => updateActiveStateProperty('fontWeight', e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-bold bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                    >
                      <option value="normal">Normal (500)</option>
                      <option value="bold">Bold (700)</option>
                      <option value="black">Black (900)</option>
                    </select>
                  </div>
                </div>

                {/* Horizontal Alignment: Left, Middle / Center, Right */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300 block">
                    Horizontal Content Alignment (Text & Icon)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', label: 'Left', icon: AlignLeft },
                      { id: 'center', label: 'Middle', icon: AlignCenter },
                      { id: 'right', label: 'Right', icon: AlignRight },
                    ].map((align) => {
                      const Icon = align.icon;
                      const isSelected = effectiveActiveState.textAlign === align.id;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => updateActiveStateProperty('textAlign', align.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-heading font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border-2 border-[#1E293B]'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-[#1E293B] hover:bg-purple-50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{align.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtitle / Counter Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-heading font-black text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={effectiveActiveState.showBadge}
                        onChange={(e) => updateActiveStateProperty('showBadge', e.target.checked)}
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span>Enable Notification / Status Badge ({editingState.toUpperCase()})</span>
                    </label>
                  </div>

                  {effectiveActiveState.showBadge && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Badge Text</span>
                        <input
                          type="text"
                          value={effectiveActiveState.badgeText}
                          onChange={(e) => updateActiveStateProperty('badgeText', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E293B] text-xs font-bold bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Badge Fill</span>
                        <input
                          type="color"
                          value={effectiveActiveState.badgeBgColor}
                          onChange={(e) => updateActiveStateProperty('badgeBgColor', e.target.value)}
                          className="w-full h-8 rounded-lg border border-[#1E293B] cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Badge Text Color</span>
                        <input
                          type="color"
                          value={effectiveActiveState.badgeTextColor}
                          onChange={(e) => updateActiveStateProperty('badgeTextColor', e.target.value)}
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
                  <div className="flex items-center gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-heading font-black text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={effectiveActiveState.showIcon}
                        onChange={(e) => updateActiveStateProperty('showIcon', e.target.checked)}
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span>Show Icon ({editingState.toUpperCase()} State)</span>
                    </label>
                    {editingState !== 'default' && (buttonConfig.stateOverrides?.[editingState]?.iconName !== undefined || buttonConfig.stateOverrides?.[editingState]?.customIconSvg !== undefined) && (
                      <span className="text-[9px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded">
                        State Specific
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {(['left', 'right', 'top', 'icon-only'] as ButtonIconPosition[]).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => updateActiveStateProperty('iconPosition', pos)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-heading font-black capitalize transition-all ${
                          effectiveActiveState.iconPosition === pos
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
                      <span>Icon Size: {effectiveActiveState.iconSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      step="1"
                      value={effectiveActiveState.iconSize}
                      onChange={(e) => updateActiveStateProperty('iconSize', parseInt(e.target.value, 10))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Icon Color ({editingState.toUpperCase()})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={effectiveActiveState.iconColor}
                        onChange={(e) => updateActiveStateProperty('iconColor', e.target.value)}
                        className="w-9 h-9 rounded-xl border-2 border-[#1E293B] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={effectiveActiveState.iconColor}
                        onChange={(e) => updateActiveStateProperty('iconColor', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E293B] text-xs font-mono font-bold uppercase bg-[#FFFDF5] dark:bg-slate-800 text-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Icon Import Section */}
                <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border-2 border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#8B5CF6]" />
                      <span className="text-xs font-heading font-black text-slate-800 dark:text-slate-200">
                        Import Custom Icon (SVG) - {editingState.toUpperCase()}
                      </span>
                    </div>
                    {effectiveActiveState.customIconSvg && (
                      <button
                        type="button"
                        onClick={handleClearCustomIcon}
                        className="text-[11px] font-heading font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Revert to Library Icon</span>
                      </button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadSvgFile}
                    accept=".svg,image/svg+xml"
                    className="hidden"
                  />

                  {effectiveActiveState.customIconSvg ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#1E293B]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center border border-[#1E293B]/20 overflow-hidden">
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-[#8B5CF6]"
                            dangerouslySetInnerHTML={{ __html: sanitizeCustomSvg(effectiveActiveState.customIconSvg) }}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                            Custom SVG Icon Active ({editingState.toUpperCase()})
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {editingState === 'default' ? 'Applied as default base icon' : `Custom override for ${editingState} state`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="pop-btn px-2.5 py-1 text-[11px] font-heading font-black rounded-lg border border-[#1E293B] bg-white dark:bg-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          Replace File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRawSvgInput(effectiveActiveState.customIconSvg || '');
                            setIsPastingSvg(true);
                          }}
                          className="pop-btn px-2.5 py-1 text-[11px] font-heading font-black rounded-lg border border-[#1E293B] bg-white dark:bg-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          Edit Markup
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="pop-btn flex-1 py-2 px-3 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#1E293B] text-xs font-heading font-black text-slate-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload .SVG File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPastingSvg(!isPastingSvg)}
                        className={`pop-btn py-2 px-3 rounded-xl border-2 border-[#1E293B] text-xs font-heading font-black flex items-center justify-center gap-1.5 cursor-pointer ${
                          isPastingSvg
                            ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                            : 'bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#1E293B] text-slate-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/40'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Paste SVG</span>
                      </button>
                    </div>
                  )}

                  {/* Paste SVG Drawer */}
                  {isPastingSvg && (
                    <div className="space-y-2 pt-2 border-t border-purple-200 dark:border-purple-800">
                      <textarea
                        rows={3}
                        value={rawSvgInput}
                        onChange={(e) => setRawSvgInput(e.target.value)}
                        placeholder="Paste raw <svg>...</svg> or path markup here..."
                        className="w-full p-2.5 rounded-xl border-2 border-[#1E293B] font-mono text-[11px] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPastingSvg(false);
                            setRawSvgInput('');
                          }}
                          className="px-2.5 py-1 text-xs font-heading font-bold text-slate-600 dark:text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!rawSvgInput.trim()}
                          onClick={handleApplyPastedSvg}
                          className="pop-btn px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] text-white text-xs font-heading font-black shadow-[2px_2px_0px_0px_#1E293B] disabled:opacity-50 cursor-pointer"
                        >
                          Apply Pasted SVG
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Icon Picker Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                      Select Icon from Library ({editingState.toUpperCase()})
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
                      const isSelected = effectiveActiveState.iconName === ic.id;
                      return (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => updateActiveStateProperty('iconName', ic.id)}
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

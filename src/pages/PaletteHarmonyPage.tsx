import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Layers,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AppPage, StructuralColors } from '../core/types';
import { copyToClipboard as universalCopy } from '../core/clipboard';
import { HarmonyMode, HarmonyPalette } from '../core/paletteHarmony/types';
import {
  generateHarmonyPalette,
  HARMONY_PRESET_SEEDS,
  buildPowerBiThemeFromHarmony,
} from '../core/paletteHarmony/harmonyEngine';
import { ClusteredBarChart } from '../components/visuals/ClusteredBarChart';
import { DonutChart } from '../components/visuals/DonutChart';
import { LineTrendChart } from '../components/visuals/LineTrendChart';
import { KpiCardRow } from '../components/visuals/KpiCardRow';

interface PaletteHarmonyPageProps {
  onNavigate: (page: AppPage) => void;
  onApplyToThemeStudio?: (hexes: string[]) => void;
}

export const PaletteHarmonyPage: React.FC<PaletteHarmonyPageProps> = ({
  onNavigate,
  onApplyToThemeStudio,
}) => {
  const [baseHex, setBaseHex] = useState<string>('#8B5CF6');
  const [activeMode, setActiveMode] = useState<HarmonyMode>('split-complementary');
  const [themeName, setThemeName] = useState<string>('Harmonic Power BI Palette');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [jsonCopied, setJsonCopied] = useState<boolean>(false);
  const [hexListCopied, setHexListCopied] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'bars' | 'donut' | 'line' | 'kpis'>('bars');

  // Compute active harmony palette
  const harmonyPalette: HarmonyPalette = useMemo(() => {
    return generateHarmonyPalette(baseHex, activeMode);
  }, [baseHex, activeMode]);

  const copyToClipboard = async (text: string, type: 'hex' | 'json' | 'hexlist', key?: string) => {
    const success = await universalCopy(text);
    if (success) {
      if (type === 'hex') {
        setCopiedHex(key || text);
        setTimeout(() => setCopiedHex(null), 1800);
      } else if (type === 'json') {
        setJsonCopied(true);
        setTimeout(() => setJsonCopied(false), 2000);
      } else if (type === 'hexlist') {
        setHexListCopied(true);
        setTimeout(() => setHexListCopied(false), 2000);
      }
    }
  };

  const handleDownloadThemeJson = () => {
    const theme = buildPowerBiThemeFromHarmony(harmonyPalette, themeName);
    const jsonStr = JSON.stringify(theme, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyThemeJson = () => {
    const theme = buildPowerBiThemeFromHarmony(harmonyPalette, themeName);
    copyToClipboard(JSON.stringify(theme, null, 2), 'json');
  };

  const handleCopyHexList = () => {
    const list = harmonyPalette.colors.map((c) => c.hex).join(', ');
    copyToClipboard(list, 'hexlist');
  };

  const handleApplyToStudio = () => {
    if (onApplyToThemeStudio) {
      onApplyToThemeStudio(harmonyPalette.colors.map((c) => c.hex));
    }
    onNavigate('theme-generator');
  };

  // Convert harmony palette to string[] for Report Canvas Visuals
  const visualHexColors: string[] = useMemo(() => {
    return harmonyPalette.colors.map((c) => c.hex);
  }, [harmonyPalette]);

  const previewStructural: StructuralColors = useMemo(() => ({
    background: '#FFFFFF',
    foreground: '#1E293B',
    tableAccent: visualHexColors[0] || '#8B5CF6',
    good: '#10B981',
    bad: '#EF4444',
    neutral: '#F59E0B',
  }), [visualHexColors]);

  const harmonyModes: Array<{ id: HarmonyMode; label: string; desc: string; badge: string }> = [
    { id: 'analogous', label: 'Analogous', desc: 'Adjacent 30° wheel neighbors', badge: 'Harmonious' },
    { id: 'split-complementary', label: 'Split-Comp', desc: 'Base + 150° and 210° angles', badge: 'Popular' },
    { id: 'triadic', label: 'Triadic', desc: 'Balanced 120° triangle', badge: 'Vibrant' },
    { id: 'tetradic', label: 'Tetradic', desc: 'Rich 90° square symmetry', badge: 'Dynamic' },
    { id: 'complementary', label: 'Complementary', desc: 'Direct 180° focal opposite', badge: 'High Contrast' },
    { id: 'monochromatic', label: 'Monochromatic', desc: 'Single hue stepped in lightness', badge: 'Minimalist' },
    { id: 'golden-ratio', label: 'Golden Spiral', desc: '137.5° Fibonacci angle sequence', badge: 'Organic' },
  ];

  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#1E293B] dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 text-xs font-heading font-black border border-[#8B5CF6]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COLOR THEORY ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white">
            Palette Harmony Generator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Generate balanced, color-wheel verified Power BI palettes with automatic 9-step shade scales and 1-click theme export.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHexList}
            className="pop-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
          >
            {hexListCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{hexListCopied ? 'Copied Hexes!' : 'Copy Hex List'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyThemeJson}
            className="pop-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
          >
            {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{jsonCopied ? 'Theme Copied!' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadThemeJson}
            className="pop-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer hover:bg-[#7C3AED]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download theme.json</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Controls & Seed (Left) + Swatches & Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Seed Color & Harmony Wheel Mode Selection (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Base Seed Picker Card */}
          <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-black text-slate-500 uppercase tracking-wider">
                1. Select Dominant Base Seed
              </span>
              <div
                className="w-6 h-6 rounded-lg border-2 border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
                style={{ backgroundColor: baseHex }}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseHex}
                onChange={(e) => setBaseHex(e.target.value)}
                className="w-12 h-12 rounded-xl border-2 border-[#1E293B] cursor-pointer p-0.5 shadow-[2px_2px_0px_0px_#1E293B]"
              />
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Base Hex Code</label>
                <input
                  type="text"
                  value={baseHex}
                  onChange={(e) => setBaseHex(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-black rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B] uppercase"
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            {/* Quick Seeds */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-2">Curated Seed Palettes</span>
              <div className="grid grid-cols-4 gap-2">
                {HARMONY_PRESET_SEEDS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setBaseHex(preset.hex);
                      setActiveMode(preset.mode);
                      setThemeName(`${preset.name} Theme`);
                    }}
                    className={`p-2 rounded-xl border-2 border-[#1E293B] text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      baseHex.toUpperCase() === preset.hex.toUpperCase()
                        ? 'ring-2 ring-[#8B5CF6] scale-105 shadow-[2px_2px_0px_0px_#1E293B]'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100'
                    }`}
                    title={`${preset.name}: ${preset.vibe}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-[9.5px] font-heading font-black truncate w-full">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Harmony Rules Selector */}
          <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-3">
            <span className="text-xs font-heading font-black text-slate-500 uppercase tracking-wider block">
              2. Choose Color Harmony Rule
            </span>

            <div className="space-y-2">
              {harmonyModes.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveMode(mode.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 border-[#1E293B] text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#8B5CF6] text-white shadow-[3px_3px_0px_0px_#1E293B]'
                        : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-heading font-black">{mode.label}</span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {mode.badge}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] font-medium mt-0.5 ${
                          isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {mode.desc}
                      </p>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border-2 border-[#1E293B] flex items-center justify-center ${
                        isActive ? 'bg-[#FBBF24]' : 'bg-transparent'
                      }`}
                    >
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#1E293B]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workflow Callout: Send to Theme Studio */}
          <div className="p-4 rounded-2xl bg-[#FBBF24]/20 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white block">
                Want to refine in Theme Studio?
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Push these harmonic colors straight into the theme canvas.
              </span>
            </div>
            <button
              type="button"
              onClick={handleApplyToStudio}
              className="pop-btn flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-black bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
            >
              <span>Push to Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Palette Strip, 9-Shade Matrix & Live Power BI Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Harmonic Color Palette Strip */}
          <div className="pop-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-black text-[#1E293B] dark:text-white">
                  {harmonyPalette.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {harmonyPalette.colors.length} Harmonic Keynotes • Click any swatch to copy Hex
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>WCAG Evaluated</span>
              </div>
            </div>

            {/* Swatch Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {harmonyPalette.colors.map((color) => (
                <div
                  key={color.hex + color.role}
                  className="group rounded-2xl border-2 border-[#1E293B] overflow-hidden bg-slate-50 dark:bg-slate-800 shadow-[2px_2px_0px_0px_#1E293B] flex flex-col justify-between"
                >
                  {/* Swatch Area */}
                  <div
                    onClick={() => copyToClipboard(color.hex, 'hex', color.hex)}
                    className="h-24 w-full relative flex items-center justify-center cursor-pointer transition-transform group-hover:scale-102"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-2 py-1 rounded-lg text-[10px] font-heading font-black text-white flex items-center gap-1">
                      {copiedHex === color.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHex === color.hex ? 'Copied' : 'Copy'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-heading font-extrabold text-slate-500 uppercase truncate">
                        {color.role}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {color.hsl.h}°
                      </span>
                    </div>
                    <span className="font-mono font-black text-xs text-[#1E293B] dark:text-white block">
                      {color.hex}
                    </span>
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 pt-0.5">
                      <span>W: {color.contrastOnWhite}:1</span>
                      <span>D: {color.contrastOnDark}:1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9-Step Shade & Tint Ladder (50 to 900) */}
          <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#8B5CF6]" />
                  <span>9-Step Luminance Ladder (50 - 900)</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Use tints (50-200) for matrix heatmaps and shades (700-900) for high-contrast outlines.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1 overflow-x-auto">
              {harmonyPalette.colors.map((color) => (
                <div key={'shades-' + color.hex} className="flex items-center gap-1.5 min-w-[500px]">
                  <span className="w-20 text-[10px] font-heading font-extrabold text-slate-500 truncate">
                    {color.role}
                  </span>
                  <div className="flex-1 grid grid-cols-10 gap-1">
                    {color.shades.map((shade) => (
                      <button
                        key={shade.level}
                        type="button"
                        onClick={() => copyToClipboard(shade.hex, 'hex', shade.hex)}
                        className="group relative h-8 rounded-lg border border-[#1E293B]/40 hover:border-[#1E293B] transition-transform hover:scale-105 cursor-pointer flex items-center justify-center"
                        style={{ backgroundColor: shade.hex }}
                        title={`${color.role} ${shade.level}: ${shade.hex} (Click to copy)`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-mono font-black text-black bg-white/80 px-1 rounded shadow">
                          {shade.level}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Power BI Visuals Simulator */}
          <div className="pop-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Power BI Canvas Simulation</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified rendering of your harmonic colors inside native Power BI visual models.
                </p>
              </div>

              {/* Chart Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-[#1E293B]">
                {(['bars', 'donut', 'line', 'kpis'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPreviewTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-heading font-black capitalize transition-all cursor-pointer ${
                      previewTab === tab
                        ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Selected Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-[#1E293B] min-h-[260px] flex items-center justify-center">
              {previewTab === 'bars' && (
                <div className="w-full">
                  <ClusteredBarChart
                    dataColors={visualHexColors}
                    isDarkCanvas={false}
                    fontFamily="Segoe UI"
                  />
                </div>
              )}
              {previewTab === 'donut' && (
                <div className="w-full">
                  <DonutChart
                    dataColors={visualHexColors}
                    isDarkCanvas={false}
                    fontFamily="Segoe UI"
                  />
                </div>
              )}
              {previewTab === 'line' && (
                <div className="w-full">
                  <LineTrendChart
                    dataColors={visualHexColors}
                    isDarkCanvas={false}
                    fontFamily="Segoe UI"
                  />
                </div>
              )}
              {previewTab === 'kpis' && (
                <div className="w-full">
                  <KpiCardRow
                    dataColors={visualHexColors}
                    structural={previewStructural}
                    isDarkCanvas={false}
                    fontFamily="Segoe UI"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

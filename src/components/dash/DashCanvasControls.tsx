import React from 'react';
import {
  Monitor,
  LayoutGrid,
  Paintbrush,
  Sparkles,
  Type,
  Heading,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  CanvasDimension,
  CanvasResolutionPreset,
  DashCanvasContainerStyle,
  DashTypographyConfig,
  LayoutPresetType,
  PageTitleItem,
  PageTitlePosition,
} from '../../core/dashTypes';
import { LAYOUT_PRESETS_CATALOG } from '../../core/dashLayoutPresets';
import { READY_DESIGN_PRESETS } from '../../core/dashDesignPresets';

interface DashCanvasControlsProps {
  dimensions: CanvasDimension;
  backgroundColor: string;
  containerStyle: DashCanvasContainerStyle;
  typography: DashTypographyConfig;
  pageTitles: PageTitleItem[];
  layoutPreset: LayoutPresetType;
  onChangeDimensions: (dimensions: CanvasDimension) => void;
  onChangeBackgroundColor: (color: string) => void;
  onChangeContainerStyle: (updates: Partial<DashCanvasContainerStyle>) => void;
  onChangeTypography: (updates: Partial<DashTypographyConfig>) => void;
  onUpdatePageTitle: (id: string, updates: Partial<PageTitleItem>) => void;
  onAddPageTitle: () => void;
  onRemovePageTitle: (id: string) => void;
  onSelectLayoutPreset: (preset: LayoutPresetType) => void;
  onApplyReadyDesign: (presetId: string) => void;
}

const BG_PRESET_COLORS = [
  { hex: '#F8FAFC', label: 'Slate Soft' },
  { hex: '#FFFDF5', label: 'Warm Cream' },
  { hex: '#FFFFFF', label: 'Pure White' },
  { hex: '#0F172A', label: 'Midnight' },
  { hex: '#1E293B', label: 'Dark Slate' },
];

const FONT_FAMILIES = [
  'Segoe UI',
  'Aptos',
  'DIN',
  'Verdana',
  'Arial',
  'Calibri',
  'Plus Jakarta Sans',
  'Outfit',
];

export const DashCanvasControls: React.FC<DashCanvasControlsProps> = ({
  dimensions,
  backgroundColor,
  containerStyle,
  typography,
  pageTitles,
  layoutPreset,
  onChangeDimensions,
  onChangeBackgroundColor,
  onChangeContainerStyle,
  onChangeTypography,
  onUpdatePageTitle,
  onAddPageTitle,
  onRemovePageTitle,
  onSelectLayoutPreset,
  onApplyReadyDesign,
}) => {
  const handleResolutionPresetChange = (preset: CanvasResolutionPreset) => {
    if (preset === '1280x720') {
      onChangeDimensions({ preset, width: 1280, height: 720 });
    } else if (preset === '1920x1080') {
      onChangeDimensions({ preset, width: 1920, height: 1080 });
    } else if (preset === '1024x768') {
      onChangeDimensions({ preset, width: 1024, height: 768 });
    } else if (preset === '1440x900') {
      onChangeDimensions({ preset, width: 1440, height: 900 });
    } else {
      onChangeDimensions({ ...dimensions, preset: 'custom' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Ready-Made Design Themes (Requirement 1: 6 Unique Presets) */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F472B6]" />
              <span>Ready Design Presets ({READY_DESIGN_PRESETS.length})</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Distinct slot counts, layouts, fonts & nav orientations
            </p>
          </div>
          <span className="text-[10px] font-heading font-black px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6]">
            1-Click Theme
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {READY_DESIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyReadyDesign(preset.id)}
              className="p-2.5 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 text-left bg-slate-50 dark:bg-slate-800/90 hover:bg-[#FBBF24]/15 shadow-[2px_2px_0px_0px_#1E293B] transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white group-hover:text-[#8B5CF6] transition-colors truncate">
                  {preset.name}
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[#1E293B] shadow-xs flex-shrink-0"
                  style={{ backgroundColor: preset.accentColor }}
                />
              </div>

              {/* Distinct Specs Badge */}
              <div className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                <span className="font-mono text-[#8B5CF6] font-black">{preset.slotCount} Slots</span>
                {' • '}
                <span>{preset.navType === 'left' ? `Left ${preset.navSize}px` : `Top ${preset.navSize}px`}</span>
                {' • '}
                <span className="text-slate-600 dark:text-slate-300">{preset.fontFamily}</span>
              </div>

              {/* Color swatch row preview */}
              <div className="flex items-center gap-1">
                <span
                  className="w-4 h-4 rounded border border-[#1E293B]"
                  style={{ backgroundColor: preset.backgroundColor }}
                  title="Canvas Background"
                />
                <span
                  className="w-4 h-4 rounded border border-[#1E293B]"
                  style={{ backgroundColor: preset.navColor }}
                  title="Nav Ribbon"
                />
                <span
                  className="w-4 h-4 rounded border border-[#1E293B]"
                  style={{ backgroundColor: preset.cardColor }}
                  title="Card Fill"
                />
                <span
                  className="w-4 h-4 rounded border border-[#1E293B]"
                  style={{ backgroundColor: preset.accentColor }}
                  title="Active Accent"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Canvas Resolution & Dimensions (Requirement 2: 4 Presets) */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#8B5CF6]" />
          <span>Canvas Resolution & Color</span>
        </h4>

        {/* Dropdown Selector */}
        <div className="space-y-1">
          <label className="text-xs font-heading font-black text-slate-500 uppercase">
            Aspect Ratio Preset
          </label>
          <select
            value={dimensions.preset}
            onChange={(e) =>
              handleResolutionPresetChange(e.target.value as CanvasResolutionPreset)
            }
            className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
          >
            <option value="1280x720">1280 × 720 px (16:9 Standard Power BI)</option>
            <option value="1920x1080">1920 × 1080 px (16:9 Full HD Crisp)</option>
            <option value="1024x768">1024 × 768 px (4:3 Classic Standard)</option>
            <option value="1440x900">1440 × 900 px (16:10 Widescreen Display)</option>
            <option value="custom">Custom Dimensions (W × H)</option>
          </select>
        </div>

        {/* Custom Width & Height Inputs */}
        {dimensions.preset === 'custom' && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Width (px)
              </label>
              <input
                type="number"
                min={800}
                max={3840}
                step={10}
                value={dimensions.width}
                onChange={(e) =>
                  onChangeDimensions({
                    ...dimensions,
                    width: Math.max(600, Number(e.target.value) || 800),
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-950 text-xs font-mono font-bold text-[#1E293B] dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Height (px)
              </label>
              <input
                type="number"
                min={500}
                max={2160}
                step={10}
                value={dimensions.height}
                onChange={(e) =>
                  onChangeDimensions({
                    ...dimensions,
                    height: Math.max(400, Number(e.target.value) || 600),
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-950 text-xs font-mono font-bold text-[#1E293B] dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Canvas Background Color */}
        <div className="space-y-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
          <label className="text-xs font-heading font-black text-slate-500 uppercase">
            Canvas Background Fill
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {BG_PRESET_COLORS.map((bg) => (
              <button
                key={bg.hex}
                type="button"
                onClick={() => onChangeBackgroundColor(bg.hex)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-[#1E293B] text-[11px] font-bold transition-all cursor-pointer ${
                  backgroundColor.toLowerCase() === bg.hex.toLowerCase()
                    ? 'ring-2 ring-[#8B5CF6] shadow-[2px_2px_0px_0px_#1E293B] -translate-y-0.5'
                    : 'opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: bg.hex }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-[#1E293B]"
                  style={{ backgroundColor: bg.hex }}
                />
                <span
                  className={
                    bg.hex === '#0F172A' || bg.hex === '#1E293B'
                      ? 'text-white'
                      : 'text-[#1E293B]'
                  }
                >
                  {bg.label}
                </span>
              </button>
            ))}

            <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onChangeBackgroundColor(e.target.value)}
                className="w-6 h-6 rounded-md border border-[#1E293B] cursor-pointer"
              />
              <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 px-1">
                {backgroundColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography Configuration (Requirement 3) */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-[#38BDF8]" />
          <span>Dashboard Typography</span>
        </h4>

        {/* Font Family Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-heading font-black text-slate-500 uppercase">
            Font Family
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => onChangeTypography({ fontFamily: font })}
                className={`px-2.5 py-1 rounded-lg border-2 border-[#1E293B] text-xs font-bold transition-all cursor-pointer ${
                  typography.fontFamily === font
                    ? 'bg-[#38BDF8] text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Text Sizes & Colors */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
          {/* Card Title Size & Color */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <span>Title Size ({typography.titleSize}px)</span>
            </div>
            <input
              type="range"
              min={11}
              max={18}
              value={typography.titleSize}
              onChange={(e) => onChangeTypography({ titleSize: Number(e.target.value) })}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#1E293B] bg-slate-50 dark:bg-slate-800">
              <input
                type="color"
                value={typography.titleColor}
                onChange={(e) => onChangeTypography({ titleColor: e.target.value })}
                className="w-5 h-5 rounded border border-[#1E293B] cursor-pointer"
              />
              <span className="font-mono text-[10px] font-bold truncate">
                {typography.titleColor}
              </span>
            </div>
          </div>

          {/* Subtitle Size & Color */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <span>Subtitle ({typography.subtitleSize}px)</span>
            </div>
            <input
              type="range"
              min={9}
              max={14}
              step={0.5}
              value={typography.subtitleSize}
              onChange={(e) => onChangeTypography({ subtitleSize: Number(e.target.value) })}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#1E293B] bg-slate-50 dark:bg-slate-800">
              <input
                type="color"
                value={typography.subtitleColor}
                onChange={(e) => onChangeTypography({ subtitleColor: e.target.value })}
                className="w-5 h-5 rounded border border-[#1E293B] cursor-pointer"
              />
              <span className="font-mono text-[10px] font-bold truncate">
                {typography.subtitleColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Canvas Page Titles & Positions (Requirement 5) */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
              <Heading className="w-4 h-4 text-[#FBBF24]" />
              <span>Page Header Titles ({pageTitles.length})</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Place title & subtitle in corners (Top-Right default)
            </p>
          </div>

          <button
            type="button"
            onClick={onAddPageTitle}
            disabled={pageTitles.length >= 4}
            className={`pop-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] transition-all ${
              pageTitles.length >= 4
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] cursor-pointer'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Title</span>
          </button>
        </div>

        <div className="space-y-3">
          {pageTitles.map((pt, idx) => (
            <div
              key={pt.id}
              className="p-3 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                  Title #{idx + 1}
                </span>

                <div className="flex items-center gap-2">
                  {/* Position Dropdown */}
                  <select
                    value={pt.position}
                    onChange={(e) =>
                      onUpdatePageTitle(pt.id, {
                        position: e.target.value as PageTitlePosition,
                      })
                    }
                    className="px-2 py-0.5 rounded-lg border border-[#1E293B] text-[11px] font-bold bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white cursor-pointer"
                  >
                    <option value="top-right">Top-Right (Default)</option>
                    <option value="top-left">Top-Left</option>
                    <option value="bottom-right">Bottom-Right</option>
                    <option value="bottom-left">Bottom-Left</option>
                  </select>

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => onRemovePageTitle(pt.id)}
                      className="p-1 rounded text-rose-600 hover:bg-rose-100 cursor-pointer"
                      title="Delete Title"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={pt.title}
                onChange={(e) => onUpdatePageTitle(pt.id, { title: e.target.value })}
                placeholder="Page Title (e.g. Executive Overview)"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6]"
              />

              <input
                type="text"
                value={pt.subtitle}
                onChange={(e) => onUpdatePageTitle(pt.id, { subtitle: e.target.value })}
                placeholder="Page Subtitle (e.g. Live Q3 Metrics)"
                className="w-full px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-[#8B5CF6]"
              />

              {/* Title & Subtitle Size & Color Controls */}
              <div className="grid grid-cols-2 gap-2.5 pt-1.5 border-t border-slate-200 dark:border-slate-700/80">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Title Size ({pt.titleSize ?? 18}px)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="range"
                      min={12}
                      max={26}
                      value={pt.titleSize ?? 18}
                      onChange={(e) => onUpdatePageTitle(pt.id, { titleSize: Number(e.target.value) })}
                      className="w-full accent-[#FBBF24] cursor-pointer"
                    />
                    <input
                      type="color"
                      value={pt.titleColor ?? typography.titleColor ?? '#1E293B'}
                      onChange={(e) => onUpdatePageTitle(pt.id, { titleColor: e.target.value })}
                      className="w-5 h-5 rounded border border-[#1E293B] cursor-pointer flex-shrink-0"
                      title="Title text color"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Subtitle ({pt.subtitleSize ?? 11.5}px)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="range"
                      min={9}
                      max={16}
                      step={0.5}
                      value={pt.subtitleSize ?? 11.5}
                      onChange={(e) => onUpdatePageTitle(pt.id, { subtitleSize: Number(e.target.value) })}
                      className="w-full accent-[#FBBF24] cursor-pointer"
                    />
                    <input
                      type="color"
                      value={pt.subtitleColor ?? typography.subtitleColor ?? '#64748B'}
                      onChange={(e) => onUpdatePageTitle(pt.id, { subtitleColor: e.target.value })}
                      className="w-5 h-5 rounded border border-[#1E293B] cursor-pointer flex-shrink-0"
                      title="Subtitle text color"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Visual Shapes Layout Presets (9 Presets - Requirement 8) */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <div>
          <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#F472B6]" />
            <span>Layout Presets (9 Options)</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Pre-calculated slot coordinates without nav bar collisions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {LAYOUT_PRESETS_CATALOG.map((preset) => {
            const isSelected = layoutPreset === preset.type;
            return (
              <button
                key={preset.type}
                type="button"
                onClick={() => onSelectLayoutPreset(preset.type)}
                className={`p-3 rounded-xl border-2 border-[#1E293B] text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-white shadow-[3px_3px_0px_0px_#1E293B] -translate-y-0.5'
                    : 'bg-slate-50 dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-heading font-black truncate">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-[#1E293B] ${
                      isSelected ? 'bg-white text-[#1E293B]' : 'bg-white/80 text-slate-700'
                    }`}
                  >
                    {preset.containerCount} slots
                  </span>
                </div>
                <p
                  className={`text-[10px] leading-tight line-clamp-2 ${
                    isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Slot Borders & Colors (Requirement 4) */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-[#34D399]" />
          <span>Slot Appearance & Borders</span>
        </h4>

        {/* Border On/Off Switch */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
              Container Borders
            </span>
            <p className="text-[11px] text-slate-500 font-medium">
              Toggle border outline on all slots
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onChangeContainerStyle({
                showBorder: containerStyle.showBorder !== false ? false : true,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-[#1E293B] transition-colors cursor-pointer ${
              containerStyle.showBorder !== false ? 'bg-[#34D399]' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white border border-[#1E293B] shadow-xs transition-transform ${
                containerStyle.showBorder !== false ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Border Thickness */}
        {containerStyle.showBorder !== false && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-heading font-black text-slate-500 uppercase">
              Border Thickness
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0.5, 1, 1.5, 2, 3].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChangeContainerStyle({ borderWidth: w })}
                  className={`py-1 rounded-lg border-2 border-[#1E293B] text-xs font-bold transition-all cursor-pointer ${
                    containerStyle.borderWidth === w
                      ? 'bg-[#34D399] text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors Grid: Fill and Border */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <label className="text-[10px] font-heading font-black text-slate-500 uppercase">
              Slot Background
            </label>
            <div className="flex items-center gap-1.5 p-1 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
              <input
                type="color"
                value={containerStyle.backgroundColor}
                onChange={(e) =>
                  onChangeContainerStyle({ backgroundColor: e.target.value })
                }
                className="w-6 h-6 rounded-lg border border-[#1E293B] cursor-pointer"
              />
              <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 truncate">
                {containerStyle.backgroundColor}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-heading font-black text-slate-500 uppercase">
              Border Color
            </label>
            <div className="flex items-center gap-1.5 p-1 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
              <input
                type="color"
                value={containerStyle.borderColor}
                onChange={(e) =>
                  onChangeContainerStyle({ borderColor: e.target.value })
                }
                className="w-6 h-6 rounded-lg border border-[#1E293B] cursor-pointer"
              />
              <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 truncate">
                {containerStyle.borderColor}
              </span>
            </div>
          </div>
        </div>

        {/* Corner Radius Buttons */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-heading font-black text-slate-500 uppercase">
            Corner Radius
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { label: 'Sharp', val: 0 },
              { label: 'Subtle', val: 4 },
              { label: 'Smooth', val: 8 },
              { label: 'Standard', val: 14 },
              { label: 'Round', val: 20 },
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => onChangeContainerStyle({ cornerRadius: r.val })}
                className={`py-1 rounded-lg border-2 border-[#1E293B] text-xs font-bold transition-all cursor-pointer ${
                  containerStyle.cornerRadius === r.val
                    ? 'bg-[#34D399] text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {r.label} ({r.val}px)
              </button>
            ))}
          </div>
        </div>

        {/* Drop Shadow Switch */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Hard Offset Shadow
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              onChangeContainerStyle({
                showDropShadow: !containerStyle.showDropShadow,
              })
            }
            className={`relative inline-flex h-6 w-10 items-center rounded-full border-2 border-[#1E293B] transition-colors cursor-pointer ${
              containerStyle.showDropShadow ? 'bg-[#34D399]' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white border border-[#1E293B] shadow-xs transition-transform ${
                containerStyle.showDropShadow ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

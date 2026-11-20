import React from 'react';
import {
  Monitor,
  LayoutGrid,
  Paintbrush,
  Sparkles,
} from 'lucide-react';
import {
  CanvasDimension,
  CanvasResolutionPreset,
  DashCanvasContainerStyle,
  LayoutPresetType,
} from '../../core/dashTypes';
import { LAYOUT_PRESETS_CATALOG } from '../../core/dashLayoutPresets';

interface DashCanvasControlsProps {
  dimensions: CanvasDimension;
  backgroundColor: string;
  containerStyle: DashCanvasContainerStyle;
  layoutPreset: LayoutPresetType;
  onChangeDimensions: (dimensions: CanvasDimension) => void;
  onChangeBackgroundColor: (color: string) => void;
  onChangeContainerStyle: (updates: Partial<DashCanvasContainerStyle>) => void;
  onSelectLayoutPreset: (preset: LayoutPresetType) => void;
}

const BG_PRESET_COLORS = [
  { hex: '#F8FAFC', label: 'Slate Soft' },
  { hex: '#FFFDF5', label: 'Warm Cream' },
  { hex: '#FFFFFF', label: 'Pure White' },
  { hex: '#0F172A', label: 'Midnight' },
  { hex: '#1E293B', label: 'Dark Slate' },
];

export const DashCanvasControls: React.FC<DashCanvasControlsProps> = ({
  dimensions,
  backgroundColor,
  containerStyle,
  layoutPreset,
  onChangeDimensions,
  onChangeBackgroundColor,
  onChangeContainerStyle,
  onSelectLayoutPreset,
}) => {
  const handleResolutionPresetChange = (preset: CanvasResolutionPreset) => {
    if (preset === '1280x720') {
      onChangeDimensions({ preset, width: 1280, height: 720 });
    } else if (preset === '1920x1080') {
      onChangeDimensions({ preset, width: 1920, height: 1080 });
    } else {
      onChangeDimensions({ ...dimensions, preset: 'custom' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Canvas Resolution & Dimensions */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#8B5CF6]" />
          <span>Canvas Resolution</span>
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
            Canvas Background Color
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

      {/* 2. Visual Shapes Layout Presets */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <div>
          <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#F472B6]" />
            <span>Layout Preset</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Pre-calculated visual container bounds
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

      {/* 3. Container Card Styling */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
        <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-[#34D399]" />
          <span>Container Appearance</span>
        </h4>

        {/* Corner Radius Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-heading font-black text-slate-500 uppercase">
            Corner Radius
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Sharp', val: 0 },
              { label: 'Subtle', val: 8 },
              { label: 'Standard', val: 14 },
              { label: 'Round', val: 20 },
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => onChangeContainerStyle({ cornerRadius: r.val })}
                className={`py-1.5 rounded-lg border-2 border-[#1E293B] text-xs font-bold transition-all cursor-pointer ${
                  containerStyle.cornerRadius === r.val
                    ? 'bg-[#34D399] text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {r.label} ({r.val}px)
              </button>
            ))}
          </div>
        </div>

        {/* Colors & Shadow */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
          {/* Container Background */}
          <div className="space-y-1">
            <label className="text-[10px] font-heading font-black text-slate-500 uppercase">
              Container Fill
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

          {/* Border Color */}
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

        {/* Drop Shadow Switch */}
        <div className="flex items-center justify-between pt-2">
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

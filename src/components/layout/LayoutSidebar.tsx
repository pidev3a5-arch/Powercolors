import React from 'react';
import {
  Plus,
  Check,
  Lock,
  Unlock,
  Trash2,
  Box,
  Boxes,
  Table,
} from 'lucide-react';
import {
  LayoutVisualItem,
  LayoutDimension,
  GridSnapConfig,
  PbiVisualType,
  VISUAL_TYPES_CATALOG,
  RESOLUTION_PRESETS,
  clampCoordinates,
} from '../../core/layoutTypes';
import { CURATED_LAYOUT_PRESETS, LayoutPresetDefinition } from '../../core/layoutPresets';

interface LayoutSidebarProps {
  dimensions: LayoutDimension;
  grid: GridSnapConfig;
  backgroundColor: string;
  visuals: LayoutVisualItem[];
  selectedId: string | null;
  onAddVisual: (type: PbiVisualType) => void;
  onSelectVisual: (id: string | null) => void;
  onUpdateVisual: (id: string, updates: Partial<LayoutVisualItem>) => void;
  onDeleteVisual: (id: string) => void;
  onChangeDimensions: (dimensions: LayoutDimension) => void;
  onChangeGrid: (updates: Partial<GridSnapConfig>) => void;
  onChangeBackgroundColor: (color: string) => void;
  onApplyPreset: (preset: LayoutPresetDefinition) => void;
  onSyncFromSlots?: () => void;
  onOpenExport?: () => void;
}

const BG_COLORS = [
  { hex: '#F8FAFC', label: 'Slate Soft' },
  { hex: '#FFFFFF', label: 'Pure White' },
  { hex: '#FFFDF5', label: 'Warm Cream' },
  { hex: '#F1F5F9', label: 'Ice Slate' },
  { hex: '#0F172A', label: 'Midnight Dark' },
];

export const LayoutSidebar: React.FC<LayoutSidebarProps> = ({
  dimensions,
  grid,
  backgroundColor,
  visuals,
  selectedId,
  onAddVisual,
  onSelectVisual: _onSelectVisual,
  onUpdateVisual,
  onDeleteVisual,
  onChangeDimensions,
  onChangeGrid,
  onChangeBackgroundColor,
  onApplyPreset,
  onSyncFromSlots,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = React.useState<'add' | 'inspect' | 'canvas' | 'presets'>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('presets')) {
      return 'presets';
    }
    return 'add';
  });

  const selectedVisual = visuals.find((v) => v.id === selectedId);

  // Auto-switch to inspect tab if a visual is selected
  React.useEffect(() => {
    if (selectedId) {
      setActiveTab('inspect');
    }
  }, [selectedId]);

  React.useEffect(() => {
    if (activeTab === 'presets' && typeof window !== 'undefined' && window.location.hash.includes('mobile')) {
      const container = document.getElementById('layout-presets-list');
      const el = document.getElementById('preset-card-mobile-portrait');
      if (container && el) {
        container.scrollTop = el.offsetTop - container.offsetTop;
      }
    }
  }, [activeTab]);

  return (
    <aside className="w-full space-y-4">
      {/* Quick Actions Header: Sync from Slots & Export Coordinates */}
      <div className="flex items-center gap-2">
        {onSyncFromSlots && (
          <button
            type="button"
            onClick={onSyncFromSlots}
            className="pop-btn flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] text-xs font-heading font-black shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
            title="Populate visual rectangles matching wallpaper card slots"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Sync Slots</span>
          </button>
        )}

        {onOpenExport && (
          <button
            type="button"
            onClick={onOpenExport}
            className="pop-btn flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-heading font-black shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
            title="Export exact coordinates to Markdown, CSV, or PBIR"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Export Coordinates</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#1E293B]">
        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'add'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Add Visual
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inspect')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'inspect'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Inspector {selectedVisual ? '•' : ''}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'canvas'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Canvas & Grid
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Presets
        </button>
      </div>

      {/* Tab 1: Add Visual Palette */}
      {activeTab === 'add' && (
        <div className="p-4 sm:p-5 rounded-3xl border-3 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] space-y-4 animate-fade-in">
          <div>
            <h3 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#8B5CF6]" />
              <span>Add Visual to Canvas</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click to place a standard Power BI visual container on the layout.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1">
            {VISUAL_TYPES_CATALOG.map((meta) => (
              <button
                key={meta.type}
                type="button"
                onClick={() => onAddVisual(meta.type)}
                className="p-2.5 rounded-xl border-2 border-[#1E293B] hover:border-[#8B5CF6] bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_#1E293B] text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group"
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
                    className="px-1.5 py-0.5 rounded text-[9px] font-heading font-black border border-[#1E293B]"
                  >
                    {meta.category.toUpperCase()}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#8B5CF6] group-hover:rotate-90 transition-transform" />
                </div>

                <div>
                  <div className="text-xs font-heading font-black text-[#1E293B] dark:text-white truncate">
                    {meta.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {meta.defaultWidth} × {meta.defaultHeight} px
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Visual Inspector */}
      {activeTab === 'inspect' && (
        <div className="p-4 sm:p-5 rounded-3xl border-3 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] space-y-4 animate-fade-in">
          {selectedVisual ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-heading font-black uppercase text-purple-600">
                    Properties & Coordinates
                  </span>
                  <h3 className="text-sm font-heading font-black text-[#1E293B] dark:text-white truncate">
                    {selectedVisual.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteVisual(selectedVisual.id)}
                  className="p-1.5 rounded-lg border border-rose-300 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  title="Delete Visual"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-heading font-bold text-slate-700 dark:text-slate-300">
                  Visual Name
                </label>
                <input
                  type="text"
                  value={selectedVisual.name}
                  onChange={(e) => onUpdateVisual(selectedVisual.id, { name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800 text-xs font-medium text-[#1E293B] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              {/* Type Field */}
              <div className="space-y-1">
                <label className="text-xs font-heading font-bold text-slate-700 dark:text-slate-300">
                  Visual Type
                </label>
                <select
                  value={selectedVisual.type}
                  onChange={(e) => onUpdateVisual(selectedVisual.id, { type: e.target.value as PbiVisualType })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800 text-xs font-medium text-[#1E293B] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8B5CF6]"
                >
                  {VISUAL_TYPES_CATALOG.map((m) => (
                    <option key={m.type} value={m.type}>
                      {m.label} ({m.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Exact Power BI Position & Size Matrix */}
              <div className="p-3 rounded-2xl border-2 border-[#1E293B] bg-purple-50 dark:bg-purple-950/20 space-y-3">
                <div className="text-[11px] font-heading font-black text-purple-900 dark:text-purple-300 flex items-center justify-between">
                  <span>Power BI Desktop Coordinates</span>
                  <span className="font-mono text-[10px]">px units</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Horizontal (X)
                    </label>
                    <input
                      type="number"
                      value={selectedVisual.x}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        const clamped = clampCoordinates(val, selectedVisual.y, selectedVisual.width, selectedVisual.height, dimensions.width, dimensions.height);
                        onUpdateVisual(selectedVisual.id, { x: clamped.x });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 font-mono text-xs font-bold text-[#1E293B] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Vertical (Y)
                    </label>
                    <input
                      type="number"
                      value={selectedVisual.y}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        const clamped = clampCoordinates(selectedVisual.x, val, selectedVisual.width, selectedVisual.height, dimensions.width, dimensions.height);
                        onUpdateVisual(selectedVisual.id, { y: clamped.y });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 font-mono text-xs font-bold text-[#1E293B] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Width (W)
                    </label>
                    <input
                      type="number"
                      value={selectedVisual.width}
                      onChange={(e) => {
                        const val = Math.max(40, parseInt(e.target.value) || 40);
                        const clamped = clampCoordinates(selectedVisual.x, selectedVisual.y, val, selectedVisual.height, dimensions.width, dimensions.height);
                        onUpdateVisual(selectedVisual.id, { width: clamped.width });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 font-mono text-xs font-bold text-[#1E293B] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Height (H)
                    </label>
                    <input
                      type="number"
                      value={selectedVisual.height}
                      onChange={(e) => {
                        const val = Math.max(30, parseInt(e.target.value) || 30);
                        const clamped = clampCoordinates(selectedVisual.x, selectedVisual.y, selectedVisual.width, val, dimensions.width, dimensions.height);
                        onUpdateVisual(selectedVisual.id, { height: clamped.height });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 font-mono text-xs font-bold text-[#1E293B] dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Z-Order & Lock Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Z-Order:
                  </label>
                  <input
                    type="number"
                    value={selectedVisual.zIndex}
                    onChange={(e) => onUpdateVisual(selectedVisual.id, { zIndex: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onUpdateVisual(selectedVisual.id, { locked: !selectedVisual.locked })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    selectedVisual.locked
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {selectedVisual.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{selectedVisual.locked ? 'Locked' : 'Unlocked'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <Box className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-medium">
                No visual selected. Click any visual rectangle on the canvas to inspect its exact coordinates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Canvas & Grid Settings */}
      {activeTab === 'canvas' && (
        <div className="p-4 sm:p-5 rounded-3xl border-3 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] space-y-5 animate-fade-in">
          {/* Resolution Picker */}
          <div className="space-y-2">
            <h3 className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
              Canvas Resolution
            </h3>
            <div className="space-y-1.5">
              {RESOLUTION_PRESETS.map((res) => {
                const isActive = dimensions.preset === res.preset;
                return (
                  <button
                    key={res.preset}
                    type="button"
                    onClick={() =>
                      onChangeDimensions({
                        width: res.width,
                        height: res.height,
                        preset: res.preset,
                      })
                    }
                    className={`w-full p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'border-[#8B5CF6] bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 shadow-[2px_2px_0px_0px_#8B5CF6]'
                        : 'border-[#1E293B] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-heading font-black">{res.label}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {res.width} × {res.height} px • Aspect {res.aspect}
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#8B5CF6] stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Snapping Controls */}
          <div className="space-y-3 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
              Grid & Snap Alignment
            </h3>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Snap to Grid
              </span>
              <button
                type="button"
                onClick={() => onChangeGrid({ enabled: !grid.enabled })}
                className={`px-3 py-1 rounded-full text-xs font-heading font-black border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer transition-colors ${
                  grid.enabled ? 'bg-[#34D399] text-[#1E293B]' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {grid.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Show Grid Lines
              </span>
              <button
                type="button"
                onClick={() => onChangeGrid({ showGrid: !grid.showGrid })}
                className={`px-3 py-1 rounded-full text-xs font-heading font-black border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer transition-colors ${
                  grid.showGrid ? 'bg-[#34D399] text-[#1E293B]' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {grid.showGrid ? 'Visible' : 'Hidden'}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500">
                Snap Interval (Default 8px in Power BI)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[4, 8, 10, 16].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onChangeGrid({ size: sz })}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border-2 cursor-pointer transition-all ${
                      grid.size === sz
                        ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                        : 'border-[#1E293B] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
              Canvas Background
            </h3>
            <div className="flex items-center gap-2">
              {BG_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onChangeBackgroundColor(c.hex)}
                  title={c.label}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full border-2 border-[#1E293B] cursor-pointer transition-transform ${
                    backgroundColor === c.hex ? 'scale-125 ring-2 ring-[#8B5CF6]' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Curated Layout Presets */}
      {activeTab === 'presets' && (
        <div className="p-4 sm:p-5 rounded-3xl border-3 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] space-y-4 animate-fade-in">
          <div>
            <h3 className="text-sm font-heading font-black text-[#1E293B] dark:text-white">
              Curated Layout Presets
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Load battle-tested Power BI report architectures designed for executive storytelling.
            </p>
          </div>

          <div id="layout-presets-list" className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {CURATED_LAYOUT_PRESETS.map((preset) => (
              <div
                key={preset.id}
                id={`preset-card-${preset.id}`}
                className="p-3.5 rounded-2xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800/80 shadow-[2px_2px_0px_0px_#1E293B] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                    {preset.name}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-heading font-black bg-[#FBBF24] text-[#1E293B] border border-[#1E293B]">
                    {preset.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {preset.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500">
                  <span>{preset.visuals.length} Visuals Placed</span>
                  <span>{preset.dimensions.width}×{preset.dimensions.height}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onApplyPreset(preset)}
                  className="w-full py-1.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-700 hover:bg-[#8B5CF6] hover:text-white text-[#1E293B] dark:text-white text-xs font-heading font-black shadow-[1.5px_1.5px_0px_0px_#1E293B] transition-colors cursor-pointer"
                >
                  Apply This Layout
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

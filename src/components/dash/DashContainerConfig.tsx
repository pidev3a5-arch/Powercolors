import React, { useState } from 'react';
import {
  Boxes,
  Trash2,
  Plus,
  RotateCcw,
  Heading,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { VisualContainerConfig } from '../../core/dashTypes';

interface DashContainerConfigProps {
  containers: VisualContainerConfig[];
  onUpdateContainer: (id: string, updates: Partial<VisualContainerConfig>) => void;
  onRemoveContainer: (id: string) => void;
  onAddContainer: () => void;
  onResetLayout: () => void;
  onAutoArrange: () => void;
}

export const DashContainerConfig: React.FC<DashContainerConfigProps> = ({
  containers,
  onUpdateContainer,
  onRemoveContainer,
  onAddContainer,
  onResetLayout,
  onAutoArrange,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-between">
        <div>
          <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#8B5CF6]" />
            <span>Visual Slots ({containers.length})</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Customize slot titles, custom colors, borders, and position
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onAutoArrange}
            className="p-1.5 rounded-xl border-2 border-[#1E293B] bg-[#34D399] text-[#1E293B] hover:bg-[#10B981] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
            title="Auto-arrange all slots to fit canvas perfectly"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onResetLayout}
            className="p-1.5 rounded-xl border-2 border-[#1E293B] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#FBBF24] hover:text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
            title="Reset to Preset Default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onAddContainer}
            className="pop-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Auto-pack Notification Pill */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-xs font-medium text-[#1E293B] dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
          <span>Smart auto-arrange automatically packs slots to make room</span>
        </div>
        <button
          type="button"
          onClick={onAutoArrange}
          className="text-[11px] font-heading font-black text-[#8B5CF6] underline cursor-pointer"
        >
          Auto-Fit Grid
        </button>
      </div>

      {/* Containers List */}
      <div className="space-y-3">
        {containers.map((container, index) => {
          const isExpanded = expandedId === container.id;

          return (
            <div
              key={container.id}
              className="pop-card bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[2px_2px_0px_0px_#1E293B] space-y-3"
            >
              {/* Top row: Badge, dimensions, expand toggle, and delete */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#8B5CF6] text-white flex items-center justify-center text-[10px] font-mono font-black border border-[#1E293B]">
                    {index + 1}
                  </span>
                  <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white truncate max-w-[140px]">
                    {container.title || `Slot ${index + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {Math.round(container.width)} × {Math.round(container.height)}
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : container.id)}
                    className="p-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title={isExpanded ? 'Collapse' : 'Expand Advanced Styling'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveContainer(container.id)}
                    className="p-1 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 cursor-pointer"
                    title="Remove Slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title Configuration */}
              <div className="space-y-1.5 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-heading font-black text-slate-600 dark:text-slate-400">
                    <Heading className="w-3 h-3 text-[#8B5CF6]" />
                    <span>Card Title</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateContainer(container.id, {
                        showTitle: !container.showTitle,
                      })
                    }
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#1E293B] transition-colors cursor-pointer ${
                      container.showTitle
                        ? 'bg-[#34D399] text-[#1E293B]'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {container.showTitle ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                {container.showTitle && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={container.title}
                      onChange={(e) =>
                        onUpdateContainer(container.id, { title: e.target.value })
                      }
                      placeholder="Card title (e.g. Total Revenue)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-xs font-bold text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6]"
                    />

                    {/* Title Font Size & Color */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex-1 space-y-0.5">
                        <div className="flex justify-between text-[9.5px] font-bold text-slate-500">
                          <span>Font Size</span>
                          <span className="font-mono">{container.titleSize || 13}px</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={22}
                          value={container.titleSize || 13}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { titleSize: Number(e.target.value) })
                          }
                          className="w-full accent-[#8B5CF6] cursor-pointer"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-bold text-slate-500 block">Color</span>
                        <input
                          type="color"
                          value={container.titleColor || '#1E293B'}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { titleColor: e.target.value })
                          }
                          className="w-5 h-5 rounded border border-[#1E293B] cursor-pointer"
                          title="Title text color"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtitle Configuration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-heading font-black text-slate-600 dark:text-slate-400">
                    Card Subtitle
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateContainer(container.id, {
                        showSubtitle: !container.showSubtitle,
                      })
                    }
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#1E293B] transition-colors cursor-pointer ${
                      container.showSubtitle
                        ? 'bg-[#34D399] text-[#1E293B]'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {container.showSubtitle ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                {container.showSubtitle && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={container.subtitle}
                      onChange={(e) =>
                        onUpdateContainer(container.id, { subtitle: e.target.value })
                      }
                      placeholder="Card subtitle (e.g. Monthly breakdown vs target)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-[#8B5CF6]"
                    />

                    {/* Subtitle Font Size & Color */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex-1 space-y-0.5">
                        <div className="flex justify-between text-[9.5px] font-bold text-slate-500">
                          <span>Font Size</span>
                          <span className="font-mono">{container.subtitleSize || 10.5}px</span>
                        </div>
                        <input
                          type="range"
                          min={8}
                          max={16}
                          step={0.5}
                          value={container.subtitleSize || 10.5}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { subtitleSize: Number(e.target.value) })
                          }
                          className="w-full accent-[#8B5CF6] cursor-pointer"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-bold text-slate-500 block">Color</span>
                        <input
                          type="color"
                          value={container.subtitleColor || '#64748B'}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { subtitleColor: e.target.value })
                          }
                          className="w-5 h-5 rounded border border-[#1E293B] cursor-pointer"
                          title="Subtitle text color"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Slot Header Divider Configuration (Requirement 5) */}
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-heading font-black text-slate-700 dark:text-slate-300">
                    Header Divider Line
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateContainer(container.id, {
                        showDivider: container.showDivider !== false ? false : true,
                      })
                    }
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#1E293B] transition-colors cursor-pointer ${
                      container.showDivider !== false
                        ? 'bg-[#34D399] text-[#1E293B]'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {container.showDivider !== false ? 'Active' : 'Off'}
                  </button>
                </div>

                {container.showDivider !== false && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <div className="space-y-0.5">
                      <span className="text-[9.5px] font-bold text-slate-500 block">Thickness</span>
                      <div className="flex gap-1">
                        {[1, 1.5, 2, 3].map((th) => (
                          <button
                            key={th}
                            type="button"
                            onClick={() => onUpdateContainer(container.id, { dividerThickness: th })}
                            className={`flex-1 py-0.5 rounded text-[10px] font-bold border border-[#1E293B] cursor-pointer ${
                              (container.dividerThickness || 1) === th
                                ? 'bg-[#8B5CF6] text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {th}px
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9.5px] font-bold text-slate-500 block">Divider Color</span>
                      <div className="flex items-center gap-1 p-0.5 rounded border border-[#1E293B] bg-white dark:bg-slate-900">
                        <input
                          type="color"
                          value={container.dividerColor || '#E2E8F0'}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { dividerColor: e.target.value })
                          }
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="font-mono text-[9.5px] font-bold truncate">
                          {container.dividerColor || '#E2E8F0'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Advanced Styling: Custom Background, Border, Width, and Placement (Requirement 4 & 7) */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-[11px] font-heading font-black text-[#8B5CF6] uppercase">
                    Slot Styling & Positioning
                  </div>

                  {/* Colors: Custom Slot Background & Border */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Slot Fill Color
                      </label>
                      <div className="flex items-center gap-1 p-1 rounded-lg border border-[#1E293B] bg-slate-50 dark:bg-slate-800">
                        <input
                          type="color"
                          value={container.backgroundColor || '#FFFFFF'}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { backgroundColor: e.target.value })
                          }
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="font-mono text-[10px] font-bold">
                          {container.backgroundColor || 'Default'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Slot Border Color
                      </label>
                      <div className="flex items-center gap-1 p-1 rounded-lg border border-[#1E293B] bg-slate-50 dark:bg-slate-800">
                        <input
                          type="color"
                          value={container.borderColor || '#1E293B'}
                          onChange={(e) =>
                            onUpdateContainer(container.id, { borderColor: e.target.value })
                          }
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="font-mono text-[10px] font-bold">
                          {container.borderColor || 'Default'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Border Thickness & Toggle */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Border Outline
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContainer(container.id, {
                          showBorder: container.showBorder !== false ? false : true,
                        })
                      }
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#1E293B] transition-colors cursor-pointer ${
                        container.showBorder !== false ? 'bg-[#34D399] text-[#1E293B]' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {container.showBorder !== false ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  {/* Position Coordinates (X, Y, W, H) */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">X</span>
                      <input
                        type="number"
                        value={Math.round(container.x)}
                        onChange={(e) =>
                          onUpdateContainer(container.id, { x: Number(e.target.value) })
                        }
                        className="w-full p-1 rounded border border-slate-300 text-[10px] font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">Y</span>
                      <input
                        type="number"
                        value={Math.round(container.y)}
                        onChange={(e) =>
                          onUpdateContainer(container.id, { y: Number(e.target.value) })
                        }
                        className="w-full p-1 rounded border border-slate-300 text-[10px] font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">Width</span>
                      <input
                        type="number"
                        value={Math.round(container.width)}
                        onChange={(e) =>
                          onUpdateContainer(container.id, { width: Number(e.target.value) })
                        }
                        className="w-full p-1 rounded border border-slate-300 text-[10px] font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">Height</span>
                      <input
                        type="number"
                        value={Math.round(container.height)}
                        onChange={(e) =>
                          onUpdateContainer(container.id, { height: Number(e.target.value) })
                        }
                        className="w-full p-1 rounded border border-slate-300 text-[10px] font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {containers.length === 0 && (
          <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 font-bold text-xs space-y-2">
            <p>No visual slots configured.</p>
            <button
              type="button"
              onClick={onResetLayout}
              className="pop-btn px-4 py-2 rounded-full bg-[#8B5CF6] text-white font-heading font-black text-xs cursor-pointer"
            >
              Load Default Preset Slots
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

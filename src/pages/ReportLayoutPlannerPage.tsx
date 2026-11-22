import React, { useState, useRef, useCallback } from 'react';
import {
  Sparkles,
  RotateCcw,
  Upload,
  Check,
  Table,
  Undo2,
  Redo2,
} from 'lucide-react';
import {
  ReportLayoutState,
  LayoutVisualItem,
  LayoutDimension,
  GridSnapConfig,
  PbiVisualType,
  VISUAL_TYPES_CATALOG,
  DEFAULT_LAYOUT_STATE,
  snapToGrid,
} from '../core/layoutTypes';
import { LayoutPresetDefinition } from '../core/layoutPresets';
import { importLayoutStateFromJson } from '../core/layoutExport';
import { LayoutCanvas } from '../components/layout/LayoutCanvas';
import { LayoutSidebar } from '../components/layout/LayoutSidebar';
import { LayoutExportModal } from '../components/layout/LayoutExportModal';
import { AppPage } from '../core/types';

interface ReportLayoutPlannerPageProps {
  onNavigate: (page: AppPage) => void;
}

export const ReportLayoutPlannerPage: React.FC<ReportLayoutPlannerPageProps> = ({ onNavigate }) => {
  const [layoutState, setLayoutState] = useState<ReportLayoutState>(DEFAULT_LAYOUT_STATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<ReportLayoutState[]>([]);
  const [future, setFuture] = useState<ReportLayoutState[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateStateWithHistory = useCallback((updater: (prev: ReportLayoutState) => ReportLayoutState) => {
    setLayoutState((prev) => {
      const next = updater(prev);
      setHistory((h) => [...h.slice(-15), prev]);
      setFuture([]);
      return next;
    });
  }, []);

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [layoutState, ...f]);
    setLayoutState(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, layoutState]);
    setLayoutState(next);
  };

  // Add Visual
  const handleAddVisual = (type: PbiVisualType) => {
    const meta = VISUAL_TYPES_CATALOG.find((m) => m.type === type);
    const newId = `vis-${Date.now().toString(36)}`;
    const count = layoutState.visuals.filter((v) => v.type === type).length + 1;

    // Stagger position
    const offsetX = 24 + ((layoutState.visuals.length * 32) % 300);
    const offsetY = 40 + ((layoutState.visuals.length * 32) % 240);

    const newVisual: LayoutVisualItem = {
      id: newId,
      name: `${meta?.label || 'Visual'} ${count}`,
      type,
      x: snapToGrid(offsetX, layoutState.grid.size, layoutState.grid.enabled),
      y: snapToGrid(offsetY, layoutState.grid.size, layoutState.grid.enabled),
      width: meta?.defaultWidth || 300,
      height: meta?.defaultHeight || 180,
      zIndex: layoutState.visuals.length + 1,
      color: meta?.badgeBg || '#8B5CF6',
    };

    updateStateWithHistory((prev) => ({
      ...prev,
      visuals: [...prev.visuals, newVisual],
    }));
    setSelectedId(newId);
    showToast(`Added ${newVisual.name}`);
  };

  // Update Visual
  const handleUpdateVisual = (id: string, updates: Partial<LayoutVisualItem>) => {
    setLayoutState((prev) => ({
      ...prev,
      visuals: prev.visuals.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  };

  // Delete Visual
  const handleDeleteVisual = (id: string) => {
    updateStateWithHistory((prev) => ({
      ...prev,
      visuals: prev.visuals.filter((v) => v.id !== id),
    }));
    if (selectedId === id) setSelectedId(null);
    showToast('Visual removed');
  };

  // Duplicate Visual
  const handleDuplicateVisual = (id: string) => {
    const original = layoutState.visuals.find((v) => v.id === id);
    if (!original) return;

    const newId = `vis-${Date.now().toString(36)}`;
    const cloned: LayoutVisualItem = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      x: snapToGrid(original.x + 24, layoutState.grid.size, layoutState.grid.enabled),
      y: snapToGrid(original.y + 24, layoutState.grid.size, layoutState.grid.enabled),
      zIndex: layoutState.visuals.length + 1,
    };

    updateStateWithHistory((prev) => ({
      ...prev,
      visuals: [...prev.visuals, cloned],
    }));
    setSelectedId(newId);
    showToast(`Duplicated ${original.name}`);
  };

  // Bring to Front
  const handleBringToFront = (id: string) => {
    const maxZ = Math.max(...layoutState.visuals.map((v) => v.zIndex), 0);
    handleUpdateVisual(id, { zIndex: maxZ + 1 });
  };

  // Dimensions
  const handleChangeDimensions = (dimensions: LayoutDimension) => {
    updateStateWithHistory((prev) => ({
      ...prev,
      dimensions,
    }));
  };

  // Grid
  const handleChangeGrid = (updates: Partial<GridSnapConfig>) => {
    setLayoutState((prev) => ({
      ...prev,
      grid: { ...prev.grid, ...updates },
    }));
  };

  // Background Color
  const handleChangeBackgroundColor = (color: string) => {
    setLayoutState((prev) => ({
      ...prev,
      backgroundColor: color,
    }));
  };

  // Apply Preset
  const handleApplyPreset = (preset: LayoutPresetDefinition) => {
    updateStateWithHistory((prev) => ({
      ...prev,
      name: preset.name,
      dimensions: preset.dimensions,
      visuals: preset.visuals,
    }));
    setSelectedId(null);
    showToast(`Applied "${preset.name}" preset`);
  };

  // Clear / Reset
  const handleResetCanvas = () => {
    if (window.confirm('Reset all visuals to default layout?')) {
      updateStateWithHistory(() => DEFAULT_LAYOUT_STATE);
      setSelectedId(null);
      showToast('Reset to default layout');
    }
  };

  // Import JSON File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importLayoutStateFromJson(content);
        updateStateWithHistory(() => imported);
        setSelectedId(null);
        showToast('Layout imported successfully!');
      } catch (err) {
        alert('Failed to import layout JSON file. Please verify the file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
      {/* Page Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Power BI Canvas Layout Architect</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white">
            Report <span className="text-[#8B5CF6]">Layout Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
            Design pixel-accurate visual layouts with snap-to-grid precision. Export exact X, Y, Width, and Height coordinates directly to Power BI Desktop.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={future.length === 0}
            className="p-2.5 rounded-xl border-2 border-[#1E293B] bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="pop-btn inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-heading font-black bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] hover:opacity-90 cursor-pointer"
            title="Import saved layout JSON"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={handleResetCanvas}
            className="pop-btn inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-heading font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] hover:bg-slate-50 cursor-pointer"
            title="Reset Canvas Layout"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="pop-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] cursor-pointer"
          >
            <Table className="w-4 h-4 stroke-[2.5]" />
            <span>Export Coordinates</span>
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 px-4 rounded-2xl border-2 border-[#1E293B] bg-[#34D399] text-[#1E293B] font-heading font-black text-xs shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs font-black underline hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (Add, Inspect, Canvas, Presets): 4.5 cols on lg */}
        <div className="lg:col-span-4 xl:col-span-4">
          <LayoutSidebar
            dimensions={layoutState.dimensions}
            grid={layoutState.grid}
            backgroundColor={layoutState.backgroundColor}
            visuals={layoutState.visuals}
            selectedId={selectedId}
            onAddVisual={handleAddVisual}
            onSelectVisual={setSelectedId}
            onUpdateVisual={handleUpdateVisual}
            onDeleteVisual={handleDeleteVisual}
            onChangeDimensions={handleChangeDimensions}
            onChangeGrid={handleChangeGrid}
            onChangeBackgroundColor={handleChangeBackgroundColor}
            onApplyPreset={handleApplyPreset}
          />
        </div>

        {/* Right Canvas Area: 8 cols on lg */}
        <div className="lg:col-span-8 xl:col-span-8">
          <LayoutCanvas
            dimensions={layoutState.dimensions}
            visuals={layoutState.visuals}
            selectedId={selectedId}
            grid={layoutState.grid}
            backgroundColor={layoutState.backgroundColor}
            onSelectVisual={setSelectedId}
            onUpdateVisual={handleUpdateVisual}
            onDeleteVisual={handleDeleteVisual}
            onDuplicateVisual={handleDuplicateVisual}
            onBringToFront={handleBringToFront}
          />

          {/* Quick Cross-Tool Navigation Ribbon */}
          <div className="mt-6 p-4 rounded-3xl border-3 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                Need a matching Power BI wallpaper background?
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Design custom card slots and navigation ribbons in Dash Canvas SVG.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('dash-generator')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#1E293B] bg-[#F472B6] hover:bg-[#EC4899] text-white text-xs font-heading font-black shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
              >
                <span>Open Dash Canvas &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Coordinates Modal */}
      <LayoutExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        visuals={layoutState.visuals}
        dimensions={layoutState.dimensions}
        state={layoutState}
      />
    </main>
  );
};

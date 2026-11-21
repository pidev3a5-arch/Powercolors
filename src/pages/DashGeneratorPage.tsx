import React, { useState, useCallback, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  Monitor,
  Navigation,
  Boxes,
  HelpCircle,
  Palette,
  Sparkles,
  FileText,
} from 'lucide-react';
import {
  DashCanvasState,
  CanvasDimension,
  DashCanvasContainerStyle,
  DashTypographyConfig,
  LayoutPresetType,
  NavBarConfig,
  NavButtonConfig,
  NavButtonSection,
  PageTitleItem,
  PageTitlePosition,
  VisualContainerConfig,
  DEFAULT_DASH_CANVAS_STATE,
} from '../core/dashTypes';
import { generateLayoutContainers, autoArrangeContainers } from '../core/dashLayoutPresets';
import { READY_DESIGN_PRESETS } from '../core/dashDesignPresets';
import { generateDashSvg, downloadDashSvg, getDefaultSvgFilename } from '../core/dashSvgExport';
import { DashNavControls } from '../components/dash/DashNavControls';
import { DashCanvasControls } from '../components/dash/DashCanvasControls';
import { DashContainerConfig } from '../components/dash/DashContainerConfig';
import { DashSvgCanvas } from '../components/dash/DashSvgCanvas';
import { AppPage } from '../core/types';

interface DashGeneratorPageProps {
  onNavigate: (page: AppPage) => void;
}

type DashTab = 'canvas' | 'nav' | 'containers';

export const DashGeneratorPage: React.FC<DashGeneratorPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DashTab>('canvas');
  const [copied, setCopied] = useState(false);

  // Dash Canvas Core State
  const [dashState, setDashState] = useState<DashCanvasState>(() => {
    const initial = { ...DEFAULT_DASH_CANVAS_STATE };
    initial.containers = generateLayoutContainers(
      initial.layoutPreset,
      initial.dimensions.width,
      initial.dimensions.height,
      initial.navBar,
      initial.pageTitles
    );
    return initial;
  });

  // Re-generate containers whenever resolution, nav bar, or page header titles change
  const syncContainersWithLayout = useCallback(
    (
      preset: LayoutPresetType,
      width: number,
      height: number,
      navBar: NavBarConfig,
      pageTitles?: PageTitleItem[]
    ) => {
      return generateLayoutContainers(preset, width, height, navBar, pageTitles);
    },
    []
  );

  // 1. Canvas Dimensions
  const handleUpdateDimensions = (dimensions: CanvasDimension) => {
    setDashState((prev) => {
      const nextContainers = syncContainersWithLayout(
        prev.layoutPreset,
        dimensions.width,
        dimensions.height,
        prev.navBar,
        prev.pageTitles
      );
      return {
        ...prev,
        dimensions,
        containers: nextContainers,
      };
    });
  };

  // 2. Background Color
  const handleUpdateBackgroundColor = (backgroundColor: string) => {
    setDashState((prev) => ({ ...prev, backgroundColor }));
  };

  // 3. Container Style
  const handleUpdateContainerStyle = (updates: Partial<DashCanvasContainerStyle>) => {
    setDashState((prev) => ({
      ...prev,
      containerStyle: { ...prev.containerStyle, ...updates },
    }));
  };

  // 4. Typography
  const handleUpdateTypography = (updates: Partial<DashTypographyConfig>) => {
    setDashState((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...updates },
    }));
  };

  // 5. Page Titles
  const handleUpdatePageTitle = (id: string, updates: Partial<PageTitleItem>) => {
    setDashState((prev) => {
      const nextTitles = prev.pageTitles.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const shouldRecalc =
        updates.position !== undefined ||
        updates.title !== undefined ||
        updates.subtitle !== undefined;

      const nextContainers = shouldRecalc
        ? syncContainersWithLayout(
            prev.layoutPreset,
            prev.dimensions.width,
            prev.dimensions.height,
            prev.navBar,
            nextTitles
          )
        : prev.containers;

      return {
        ...prev,
        pageTitles: nextTitles,
        containers: nextContainers,
      };
    });
  };

  const handleAddPageTitle = () => {
    setDashState((prev) => {
      const newId = `title-${Date.now()}`;
      const usedPositions = prev.pageTitles.map((t) => t.position);
      const allPositions: PageTitlePosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
      const nextPos = allPositions.find((p) => !usedPositions.includes(p)) || 'bottom-left';
      const newTitle: PageTitleItem = {
        id: newId,
        title: 'New Page Stamp',
        subtitle: 'Secondary KPI Telemetry',
        position: nextPos,
        titleSize: 15,
        titleColor: prev.typography.titleColor || '#1E293B',
        subtitleSize: 11,
        subtitleColor: prev.typography.subtitleColor || '#64748B',
      };
      const nextTitles = [...prev.pageTitles, newTitle];
      const nextContainers = syncContainersWithLayout(
        prev.layoutPreset,
        prev.dimensions.width,
        prev.dimensions.height,
        prev.navBar,
        nextTitles
      );
      return {
        ...prev,
        pageTitles: nextTitles,
        containers: nextContainers,
      };
    });
  };

  const handleRemovePageTitle = (id: string) => {
    setDashState((prev) => {
      const nextTitles = prev.pageTitles.filter((t) => t.id !== id);
      const nextContainers = syncContainersWithLayout(
        prev.layoutPreset,
        prev.dimensions.width,
        prev.dimensions.height,
        prev.navBar,
        nextTitles
      );
      return {
        ...prev,
        pageTitles: nextTitles,
        containers: nextContainers,
      };
    });
  };

  // 6. Ready Designs
  const handleApplyReadyDesign = (presetId: string) => {
    const found = READY_DESIGN_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setDashState((curr) => {
        const applied = found.apply(curr);
        const nextContainers = syncContainersWithLayout(
          applied.layoutPreset,
          applied.dimensions.width,
          applied.dimensions.height,
          applied.navBar,
          applied.pageTitles
        );
        return {
          ...applied,
          containers: nextContainers,
        };
      });
    }
  };

  // 7. Layout Preset
  const handleSelectLayoutPreset = (layoutPreset: LayoutPresetType) => {
    setDashState((prev) => {
      const nextContainers = syncContainersWithLayout(
        layoutPreset,
        prev.dimensions.width,
        prev.dimensions.height,
        prev.navBar,
        prev.pageTitles
      );
      return {
        ...prev,
        layoutPreset,
        containers: nextContainers,
      };
    });
  };

  // 8. Navigation Bar Updates
  const handleUpdateNavBar = (updates: Partial<NavBarConfig>) => {
    setDashState((prev) => {
      const nextNavBar = { ...prev.navBar, ...updates };
      const shouldRecalc =
        updates.orientation !== undefined ||
        updates.size !== undefined ||
        updates.show !== undefined;

      const nextContainers = shouldRecalc
        ? syncContainersWithLayout(
            prev.layoutPreset,
            prev.dimensions.width,
            prev.dimensions.height,
            nextNavBar,
            prev.pageTitles
          )
        : prev.containers;

      return {
        ...prev,
        navBar: nextNavBar,
        containers: nextContainers,
      };
    });
  };

  // 9. Navigation Buttons
  const handleAddNavButton = (section: NavButtonSection = 'menu') => {
    setDashState((prev) => {
      const newId = `btn-${Date.now()}`;
      const count = prev.navBar.buttons.filter((b) => (b.section || 'menu') === section).length + 1;
      const newButton: NavButtonConfig = {
        id: newId,
        label: section === 'general' ? `Tool ${count}` : `Page ${count}`,
        icon: section === 'general' ? 'settings' : 'bar-chart',
        isActive: false,
        section,
      };
      return {
        ...prev,
        navBar: {
          ...prev.navBar,
          buttons: [...prev.navBar.buttons, newButton],
        },
      };
    });
  };

  const handleRemoveNavButton = (id: string) => {
    setDashState((prev) => ({
      ...prev,
      navBar: {
        ...prev.navBar,
        buttons: prev.navBar.buttons.filter((b) => b.id !== id),
      },
    }));
  };

  const handleUpdateNavButton = (id: string, updates: Partial<NavButtonConfig>) => {
    setDashState((prev) => ({
      ...prev,
      navBar: {
        ...prev.navBar,
        buttons: prev.navBar.buttons.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      },
    }));
  };

  const handleReorderNavButtons = (fromIndex: number, toIndex: number) => {
    setDashState((prev) => {
      const btns = [...prev.navBar.buttons];
      if (toIndex < 0 || toIndex >= btns.length) return prev;
      const [moved] = btns.splice(fromIndex, 1);
      btns.splice(toIndex, 0, moved);
      return {
        ...prev,
        navBar: {
          ...prev.navBar,
          buttons: btns,
        },
      };
    });
  };

  // 10. Visual Containers Customization & Auto-Arrange
  const handleUpdateContainer = (id: string, updates: Partial<VisualContainerConfig>) => {
    setDashState((prev) => ({
      ...prev,
      containers: prev.containers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const handleRemoveContainer = (id: string) => {
    setDashState((prev) => ({
      ...prev,
      containers: prev.containers.filter((c) => c.id !== id),
    }));
  };

  const handleAddContainer = () => {
    setDashState((prev) => {
      const newId = `container-${Date.now()}`;
      const newContainer: VisualContainerConfig = {
        id: newId,
        title: 'Custom Visual Slot',
        subtitle: 'Placeholder for Power BI visual',
        showTitle: true,
        showSubtitle: true,
        x: 40,
        y: 100,
        width: 320,
        height: 200,
      };
      // Auto-arrange all including new container
      const all = [...prev.containers, newContainer];
      const arranged = autoArrangeContainers(
        all,
        prev.dimensions.width,
        prev.dimensions.height,
        prev.navBar,
        prev.pageTitles
      );
      return {
        ...prev,
        containers: arranged,
      };
    });
  };

  const handleResetContainers = () => {
    setDashState((prev) => ({
      ...prev,
      containers: syncContainersWithLayout(
        prev.layoutPreset,
        prev.dimensions.width,
        prev.dimensions.height,
        prev.navBar,
        prev.pageTitles
      ),
    }));
  };

  const handleAutoArrangeContainers = () => {
    setDashState((prev) => ({
      ...prev,
      containers: autoArrangeContainers(
        prev.containers,
        prev.dimensions.width,
        prev.dimensions.height,
        prev.navBar,
        prev.pageTitles
      ),
    }));
  };

  // Custom SVG Download Filename (Requirement 2)
  const [customSvgFilename, setCustomSvgFilename] = useState<string>('');

  const defaultSvgFilename = useMemo(() => {
    return getDefaultSvgFilename(dashState);
  }, [dashState]);

  // Copy SVG Code
  const handleCopySvg = async () => {
    try {
      const markup = generateDashSvg(dashState, false);
      await navigator.clipboard.writeText(markup);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy to clipboard.');
    }
  };

  // Download SVG File
  const handleDownloadSvg = () => {
    const filename = customSvgFilename.trim() || defaultSvgFilename;
    downloadDashSvg(dashState, filename);
  };

  return (
    <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-8">
      {/* Page Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F472B6] text-white text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Power BI Canvas Background Builder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white">
            Dash <span className="text-[#F472B6]">Canvas Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Configure navigation ribbons, card containers, and branding into a pixel-perfect Power BI wallpaper SVG.
          </p>
        </div>

        {/* Global Action Buttons & Custom Filename Input (Requirement 2) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filename Input */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#1E293B] bg-white dark:bg-slate-800 shadow-[2px_2px_0px_0px_#1E293B]">
            <FileText className="w-3.5 h-3.5 text-[#F472B6] flex-shrink-0" />
            <input
              type="text"
              value={customSvgFilename !== '' ? customSvgFilename : defaultSvgFilename.replace(/\.svg$/, '')}
              onChange={(e) => setCustomSvgFilename(e.target.value)}
              placeholder={defaultSvgFilename.replace(/\.svg$/, '')}
              className="text-xs font-mono font-bold bg-transparent border-none outline-none text-[#1E293B] dark:text-white w-44 sm:w-60"
              title="Custom SVG filename (defaults to ReportTitle_PageHeaderTitle)"
            />
            <span className="text-[11px] font-mono font-bold text-slate-400">.svg</span>
          </div>

          <button
            type="button"
            onClick={handleCopySvg}
            className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] hover:bg-slate-50 transition-all cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500 stroke-[2.5]" />
            )}
            <span>{copied ? 'Copied SVG!' : 'Copy SVG'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="pop-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Background (.svg)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Panel (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs for Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#1E293B]">
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Canvas & Style</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nav')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                activeTab === 'nav'
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Nav Ribbon</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('containers')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                activeTab === 'containers'
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Slots ({dashState.containers.length})</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'canvas' && (
            <DashCanvasControls
              dimensions={dashState.dimensions}
              backgroundColor={dashState.backgroundColor}
              containerStyle={dashState.containerStyle}
              typography={dashState.typography}
              pageTitles={dashState.pageTitles}
              layoutPreset={dashState.layoutPreset}
              onChangeDimensions={handleUpdateDimensions}
              onChangeBackgroundColor={handleUpdateBackgroundColor}
              onChangeContainerStyle={handleUpdateContainerStyle}
              onChangeTypography={handleUpdateTypography}
              onUpdatePageTitle={handleUpdatePageTitle}
              onAddPageTitle={handleAddPageTitle}
              onRemovePageTitle={handleRemovePageTitle}
              onSelectLayoutPreset={handleSelectLayoutPreset}
              onApplyReadyDesign={handleApplyReadyDesign}
            />
          )}

          {activeTab === 'nav' && (
            <DashNavControls
              navBar={dashState.navBar}
              onUpdateNavBar={handleUpdateNavBar}
              onAddButton={handleAddNavButton}
              onRemoveButton={handleRemoveNavButton}
              onUpdateButton={handleUpdateNavButton}
              onReorderButtons={handleReorderNavButtons}
            />
          )}

          {activeTab === 'containers' && (
            <DashContainerConfig
              containers={dashState.containers}
              onUpdateContainer={handleUpdateContainer}
              onRemoveContainer={handleRemoveContainer}
              onAddContainer={handleAddContainer}
              onResetLayout={handleResetContainers}
              onAutoArrange={handleAutoArrangeContainers}
            />
          )}
        </div>

        {/* Right Canvas Preview & Import Instructions (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Vector Canvas Viewport */}
          <DashSvgCanvas state={dashState} />

          {/* Power BI Desktop Import Guide */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[4px_4px_0px_0px_#1E293B] space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                <HelpCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-heading font-black text-[#1E293B] dark:text-white">
                How to Import in Power BI Desktop
              </h3>
            </div>

            <ol className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside pl-1">
              <li>
                Download the <span className="font-bold text-[#F472B6]">.svg</span> background using the button above.
              </li>
              <li>
                Open your report in <span className="font-bold text-[#1E293B] dark:text-white">Power BI Desktop</span> and click on the blank canvas area.
              </li>
              <li>
                In the right panel, go to <span className="font-bold text-[#8B5CF6]">Format Page &gt; Canvas background</span>.
              </li>
              <li>
                Click <span className="font-bold">Browse / Add file</span> and select the downloaded SVG file.
              </li>
              <li>
                Set <span className="font-bold text-emerald-600">Image fit = Normal</span> (or <span className="font-bold text-emerald-600">Fit</span>) and change <span className="font-bold text-emerald-600">Transparency = 0%</span>.
              </li>
            </ol>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-bold">
                Need matching visual colors?
              </span>
              <button
                type="button"
                onClick={() => onNavigate('theme-generator')}
                className="inline-flex items-center gap-1 font-heading font-black text-[#8B5CF6] hover:underline cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Open Theme Studio &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

import React, { useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, RotateCcw } from 'lucide-react';
import { DashCanvasState } from '../../core/dashTypes';
import { generateDashSvg } from '../../core/dashSvgExport';

interface DashSvgCanvasProps {
  state: DashCanvasState;
}

export const DashSvgCanvas: React.FC<DashSvgCanvasProps> = ({ state }) => {
  // Zoom mode: 'fit' (scales to 100% of available viewport width with aspect ratio) or custom zoom percentage (50% to 150%)
  const [isFitMode, setIsFitMode] = useState<boolean>(true);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  // Generate real-time SVG markup for preview (with style="width: 100%; height: 100%;")
  const svgMarkup = useMemo(() => {
    return generateDashSvg(state, true);
  }, [state]);

  const { width, height } = state.dimensions;
  const aspectRatio = `${width} / ${height}`;

  const handleZoomIn = () => {
    setIsFitMode(false);
    setZoomPercent((prev) => Math.min(160, prev + 15));
  };

  const handleZoomOut = () => {
    setIsFitMode(false);
    setZoomPercent((prev) => Math.max(40, prev - 15));
  };

  const handleResetFit = () => {
    setIsFitMode(true);
    setZoomPercent(100);
  };

  return (
    <div className="space-y-3">
      {/* Canvas Toolbar & Meta Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border-2 border-[#1E293B] dark:border-slate-700 text-xs font-mono font-black text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B]">
            <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>
              {width} × {height} px
            </span>
            <span className="text-slate-400 font-sans font-bold text-[10px]">
              ({state.dimensions.preset})
            </span>
          </div>

          <span className="text-xs font-heading font-black text-slate-500 hidden sm:inline">
            {state.containers.length} Slots
          </span>
        </div>

        {/* Interactive Zoom Controls & Slider */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[2px_2px_0px_0px_#1E293B]">
          <button
            type="button"
            onClick={handleResetFit}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer ${
              isFitMode
                ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
            title="Scale entire canvas to fit view"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit All</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            title="Zoom Out (-15%)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Slider */}
          <input
            type="range"
            min={40}
            max={150}
            step={5}
            value={isFitMode ? 90 : zoomPercent}
            onChange={(e) => {
              setIsFitMode(false);
              setZoomPercent(Number(e.target.value));
            }}
            className="w-16 sm:w-20 accent-[#8B5CF6] cursor-pointer"
            title="Zoom slider"
          />

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            title="Zoom In (+15%)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-[11px] font-bold text-slate-500 w-9 text-right">
            {isFitMode ? 'Fit' : `${zoomPercent}%`}
          </span>
        </div>
      </div>

      {/* SVG Canvas Frame */}
      <div className="pop-card relative rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 bg-slate-100 dark:bg-slate-950/80 p-3 sm:p-5 shadow-[6px_6px_0px_0px_#1E293B] overflow-hidden">
        {/* Power BI Desktop Canvas Header Decoration */}
        <div className="flex items-center justify-between pb-3 px-1 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-[#1E293B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#1E293B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1E293B]" />
            <span className="text-[11px] font-mono font-bold text-slate-500 ml-1.5 truncate">
              Power BI Desktop Canvas Wallpaper Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFit}
              className="text-[10px] font-heading font-black text-slate-500 hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset Fit</span>
            </button>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
              Vector SVG
            </span>
          </div>
        </div>

        {/* Canvas Display Viewport (Scrollable when zoomed, centered when fit) */}
        <div className="w-full max-h-[700px] overflow-auto rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#E2E8F0]/40 dark:bg-slate-950 p-3 sm:p-6 flex items-center justify-center">
          <div
            className="transition-all duration-150 shadow-2xl rounded-xl overflow-hidden border-2 border-[#1E293B] flex-shrink-0 bg-white"
            style={{
              width: isFitMode ? '100%' : `${(width * zoomPercent) / 100}px`,
              maxWidth: isFitMode ? '100%' : 'none',
              aspectRatio: aspectRatio,
            }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </div>
      </div>
    </div>
  );
};

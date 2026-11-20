import React, { useState, useMemo } from 'react';
import { ZoomIn, Maximize2, Layers } from 'lucide-react';
import { DashCanvasState } from '../../core/dashTypes';
import { generateDashSvg } from '../../core/dashSvgExport';

interface DashSvgCanvasProps {
  state: DashCanvasState;
}

export const DashSvgCanvas: React.FC<DashSvgCanvasProps> = ({ state }) => {
  const [zoomMode, setZoomMode] = useState<'fit' | 'actual'>('fit');

  // Generate real-time SVG markup
  const svgMarkup = useMemo(() => {
    return generateDashSvg(state);
  }, [state]);

  const { width, height } = state.dimensions;
  const aspectRatio = `${width} / ${height}`;

  return (
    <div className="space-y-3">
      {/* Canvas Toolbar & Meta */}
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
            {state.containers.length} Visual Zones
          </span>
        </div>

        {/* View Zoom Mode */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[2px_2px_0px_0px_#1E293B]">
          <button
            type="button"
            onClick={() => setZoomMode('fit')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer ${
              zoomMode === 'fit'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit Window</span>
          </button>
          <button
            type="button"
            onClick={() => setZoomMode('actual')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-heading font-black transition-all cursor-pointer ${
              zoomMode === 'actual'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <ZoomIn className="w-3 h-3" />
            <span>100% Size</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Frame */}
      <div className="pop-card relative rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 bg-slate-200/50 dark:bg-slate-950/70 p-3 sm:p-5 shadow-[6px_6px_0px_0px_#1E293B] overflow-hidden">
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
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
            Interactive Vector SVG
          </span>
        </div>

        {/* Canvas Display Viewport */}
        <div
          className={`w-full flex items-center justify-center rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] overflow-auto bg-dot-grid p-2 sm:p-4 ${
            zoomMode === 'actual' ? 'max-h-[750px]' : ''
          }`}
        >
          <div
            className="transition-all duration-200 shadow-xl rounded-lg overflow-hidden border border-[#1E293B]/20"
            style={{
              width: zoomMode === 'fit' ? '100%' : `${width}px`,
              maxWidth: zoomMode === 'fit' ? '100%' : 'none',
              aspectRatio: zoomMode === 'fit' ? aspectRatio : 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </div>
      </div>
    </div>
  );
};

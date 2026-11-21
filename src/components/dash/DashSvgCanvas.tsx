import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, RotateCcw, Eye, X } from 'lucide-react';
import { DashCanvasState } from '../../core/dashTypes';
import { generateDashSvg } from '../../core/dashSvgExport';

interface DashSvgCanvasProps {
  state: DashCanvasState;
}

export const DashSvgCanvas: React.FC<DashSvgCanvasProps> = ({ state }) => {
  // Zoom mode: 'fit' (scales to 100% of available viewport width with aspect ratio) or custom zoom percentage (50% to 150%)
  const [isFitMode, setIsFitMode] = useState<boolean>(true);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  // Pan / Grab-to-move state when zoomed in
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Real size 1:1 popup modal state
  const [isRealSizePopupOpen, setIsRealSizePopupOpen] = useState(false);

  // Generate real-time SVG markup for preview (with style="width: 100%; height: 100%;")
  const svgMarkup = useMemo(() => {
    return generateDashSvg(state, true);
  }, [state]);

  const { width, height } = state.dimensions;
  const aspectRatio = `${width} / ${height}`;

  // Wheel zoom in/out with scroll mouse (Requirement 1)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsFitMode(false);
      const delta = e.deltaY < 0 ? 8 : -8;
      setZoomPercent((prev) => Math.min(220, Math.max(35, prev + delta)));
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  // Escape key listener to close Real Size popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRealSizePopupOpen(false);
      }
    };
    if (isRealSizePopupOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRealSizePopupOpen]);

  const handleZoomIn = () => {
    setIsFitMode(false);
    setZoomPercent((prev) => Math.min(220, prev + 15));
  };

  const handleZoomOut = () => {
    setIsFitMode(false);
    setZoomPercent((prev) => Math.max(35, prev - 15));
  };

  const handleResetFit = () => {
    setIsFitMode(true);
    setZoomPercent(100);
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
      viewportRef.current.scrollTop = 0;
    }
  };

  // Drag-to-pan handlers (hand mouse pointer)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFitMode) return;
    if (!viewportRef.current) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewportRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    viewportRef.current.scrollLeft = Math.max(0, dragStartRef.current.scrollLeft - dx);
    viewportRef.current.scrollTop = Math.max(0, dragStartRef.current.scrollTop - dy);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
              onClick={() => setIsRealSizePopupOpen(true)}
              className="pop-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] dark:border-slate-700 text-xs font-heading font-black text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B] hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer"
              title="Open canvas wallpaper in a clear, high-resolution preview popup"
            >
              <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Preview Popup</span>
            </button>

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

        {/* Canvas Display Viewport (Scrollable when zoomed, centered when fit, with grab-and-drag hand cursor) */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full max-h-[700px] overflow-auto rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#E2E8F0]/40 dark:bg-slate-950 p-3 sm:p-6 select-none ${
            isFitMode
              ? 'flex items-center justify-center cursor-default'
              : isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
          }`}
          title={!isFitMode ? 'Click and drag with hand cursor to pan canvas' : undefined}
        >
          {/* Scroll wrapper ensuring left edge (x=0) is fully accessible when zoomed */}
          <div
            className={isFitMode ? 'w-full flex items-center justify-center' : 'min-w-full flex items-center'}
            style={!isFitMode ? { width: 'fit-content', margin: '0 auto' } : undefined}
          >
            {/* Dashboard Canvas Container: Corner Radius 4px, 0.5px subtle contour border, flush left edge */}
            <div
              className="transition-transform duration-75 shadow-2xl rounded-[4px] overflow-hidden flex-shrink-0"
              style={{
                borderRadius: '4px',
                border: '0.5px solid rgba(30, 41, 59, 0.5)',
                width: isFitMode ? '100%' : `${(width * zoomPercent) / 100}px`,
                maxWidth: isFitMode ? '100%' : 'none',
                aspectRatio: aspectRatio,
                backgroundColor: state.backgroundColor,
              }}
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          </div>
        </div>
      </div>

      {/* Clear Fitted Preview Popup Modal (Requirement 1) */}
      {isRealSizePopupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsRealSizePopupOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-100 dark:bg-slate-900 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[8px_8px_0px_0px_#1E293B] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 border border-[#1E293B]" />
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-[#1E293B]" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-[#1E293B]" />
                <h3 className="text-sm sm:text-base font-heading font-black text-[#1E293B] dark:text-white ml-1">
                  Canvas Wallpaper Preview ({width} × {height} px)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 hidden sm:inline">
                  Fitted Vector Preview
                </span>
                <button
                  type="button"
                  onClick={() => setIsRealSizePopupOpen(false)}
                  className="p-1.5 rounded-xl border-2 border-[#1E293B] bg-slate-100 dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-rose-100 hover:text-rose-600 shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer transition-all"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Clear, fitted preview display without needing to scroll around */}
            <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-[#E2E8F0]/50 dark:bg-slate-950 overflow-hidden">
              <div
                className="shadow-2xl flex-shrink-0 rounded-[4px] overflow-hidden"
                style={{
                  borderRadius: '4px',
                  border: '0.5px solid rgba(30, 41, 59, 0.5)',
                  width: '100%',
                  maxWidth: `min(90vw, calc((84vh - 80px) * (${width} / ${height})))`,
                  aspectRatio: `${width} / ${height}`,
                  backgroundColor: state.backgroundColor,
                }}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

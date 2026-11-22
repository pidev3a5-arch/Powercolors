import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Layers,
} from 'lucide-react';
import {
  LayoutVisualItem,
  LayoutDimension,
  GridSnapConfig,
  snapToGrid,
  clampCoordinates,
  VISUAL_TYPES_CATALOG,
} from '../../core/layoutTypes';
import { NavBarConfig, PageTitleItem } from '../../core/dashTypes';

interface LayoutCanvasProps {
  dimensions: LayoutDimension;
  visuals: LayoutVisualItem[];
  selectedId: string | null;
  grid: GridSnapConfig;
  backgroundColor: string;
  navBar?: NavBarConfig;
  pageTitles?: PageTitleItem[];
  onSelectVisual: (id: string | null) => void;
  onUpdateVisual: (id: string, updates: Partial<LayoutVisualItem>) => void;
  onDeleteVisual: (id: string) => void;
  onDuplicateVisual: (id: string) => void;
  onBringToFront: (id: string) => void;
}

type ResizeDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const LayoutCanvas: React.FC<LayoutCanvasProps> = ({
  dimensions,
  visuals,
  selectedId,
  grid,
  backgroundColor,
  navBar,
  pageTitles,
  onSelectVisual,
  onUpdateVisual,
  onDeleteVisual,
  onDuplicateVisual,
  onBringToFront,
}) => {
  const [scale, setScale] = useState(0.8);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeState, setResizeState] = useState<{
    direction: ResizeDirection;
    mouseX: number;
    mouseY: number;
    initialX: number;
    initialY: number;
    initialW: number;
    initialH: number;
  } | null>(null);

  // Auto-fit scale on mount or dimension change
  const autoFit = useCallback(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const availableWidth = parent.clientWidth - 48; // padding
    const availableHeight = Math.max(480, window.innerHeight - 340);

    const scaleW = availableWidth / dimensions.width;
    const scaleH = availableHeight / dimensions.height;
    const fitScale = Math.min(scaleW, scaleH, 1.0);
    setScale(Math.max(0.3, Math.min(1.5, Number(fitScale.toFixed(2)))));
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    autoFit();
  }, [autoFit]);

  // Handle Drag Move
  const handlePointerDownDrag = (e: React.PointerEvent, vis: LayoutVisualItem) => {
    onSelectVisual(vis.id);
    if (vis.locked) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: vis.x,
      initialY: vis.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveDrag = (e: React.PointerEvent, vis: LayoutVisualItem) => {
    if (!isDragging || !dragStart || selectedId !== vis.id) return;
    e.stopPropagation();

    const dx = (e.clientX - dragStart.mouseX) / scale;
    const dy = (e.clientY - dragStart.mouseY) / scale;

    let targetX = dragStart.initialX + dx;
    let targetY = dragStart.initialY + dy;

    if (grid.enabled) {
      targetX = snapToGrid(targetX, grid.size, true);
      targetY = snapToGrid(targetY, grid.size, true);
    }

    const clamped = clampCoordinates(targetX, targetY, vis.width, vis.height, dimensions.width, dimensions.height);
    onUpdateVisual(vis.id, { x: clamped.x, y: clamped.y });
  };

  const handlePointerUpDrag = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Handle Resize Move
  const handlePointerDownResize = (e: React.PointerEvent, direction: ResizeDirection, vis: LayoutVisualItem) => {
    if (vis.locked) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeState({
      direction,
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: vis.x,
      initialY: vis.y,
      initialW: vis.width,
      initialH: vis.height,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = (e: React.PointerEvent, vis: LayoutVisualItem) => {
    if (!isResizing || !resizeState || selectedId !== vis.id) return;
    e.stopPropagation();

    const dx = (e.clientX - resizeState.mouseX) / scale;
    const dy = (e.clientY - resizeState.mouseY) / scale;

    let newX = resizeState.initialX;
    let newY = resizeState.initialY;
    let newW = resizeState.initialW;
    let newH = resizeState.initialH;

    const dir = resizeState.direction;

    if (dir.includes('e')) {
      newW = resizeState.initialW + dx;
    }
    if (dir.includes('s')) {
      newH = resizeState.initialH + dy;
    }
    if (dir.includes('w')) {
      newW = resizeState.initialW - dx;
      newX = resizeState.initialX + dx;
    }
    if (dir.includes('n')) {
      newH = resizeState.initialH - dy;
      newY = resizeState.initialY + dy;
    }

    if (grid.enabled) {
      newW = snapToGrid(newW, grid.size, true);
      newH = snapToGrid(newH, grid.size, true);
      newX = snapToGrid(newX, grid.size, true);
      newY = snapToGrid(newY, grid.size, true);
    }

    const minSize = 40;
    if (newW < minSize) {
      newW = minSize;
      if (dir.includes('w')) newX = resizeState.initialX + resizeState.initialW - minSize;
    }
    if (newH < minSize) {
      newH = minSize;
      if (dir.includes('n')) newY = resizeState.initialY + resizeState.initialH - minSize;
    }

    const clamped = clampCoordinates(newX, newY, newW, newH, dimensions.width, dimensions.height);
    onUpdateVisual(vis.id, {
      x: clamped.x,
      y: clamped.y,
      width: clamped.width,
      height: clamped.height,
    });
  };

  const handlePointerUpResize = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      setResizeState(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Keyboard nudge support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const vis = visuals.find((v) => v.id === selectedId);
      if (!vis || vis.locked) return;

      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      const step = e.shiftKey ? 16 : (grid.enabled ? grid.size : 1);

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const clamped = clampCoordinates(vis.x - step, vis.y, vis.width, vis.height, dimensions.width, dimensions.height);
        onUpdateVisual(vis.id, { x: clamped.x });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const clamped = clampCoordinates(vis.x + step, vis.y, vis.width, vis.height, dimensions.width, dimensions.height);
        onUpdateVisual(vis.id, { x: clamped.x });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const clamped = clampCoordinates(vis.x, vis.y - step, vis.width, vis.height, dimensions.width, dimensions.height);
        onUpdateVisual(vis.id, { y: clamped.y });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const clamped = clampCoordinates(vis.x, vis.y + step, vis.width, vis.height, dimensions.width, dimensions.height);
        onUpdateVisual(vis.id, { y: clamped.y });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        onDeleteVisual(vis.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, visuals, dimensions, grid, onUpdateVisual, onDeleteVisual]);

  const selectedVisual = visuals.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Canvas Top Toolbar: Zoom & Viewport controls */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[2.5px_2.5px_0px_0px_#1E293B]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-black text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            {dimensions.width} × {dimensions.height} px ({dimensions.preset})
          </span>
          <span className="text-xs font-bold text-slate-500">
            {visuals.length} Visuals Placed
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.3, Number((s - 0.1).toFixed(2))))}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(1.5, Number((s + 0.1).toFixed(2))))}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={autoFit}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black shadow-[1.5px_1.5px_0px_0px_#1E293B] hover:opacity-90 cursor-pointer ml-1"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit</span>
          </button>
          <button
            type="button"
            onClick={() => setScale(1.0)}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Reset to 100%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Container */}
      <div
        ref={containerRef}
        onClick={() => onSelectVisual(null)}
        className="w-full overflow-auto p-6 sm:p-8 rounded-3xl border-3 border-[#1E293B] bg-slate-100 dark:bg-slate-950 shadow-[6px_6px_0px_0px_#1E293B] flex items-center justify-center min-h-[520px] select-none"
      >
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            backgroundColor,
          }}
          className="relative transition-transform duration-75 ease-out rounded-2xl border-3 border-[#1E293B] shadow-[8px_8px_0px_0px_#1E293B] overflow-hidden flex-shrink-0"
        >
          {/* Subtle Grid Lines or Dots Overlay */}
          {grid.showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="canvas-grid-pattern"
                  width={grid.size * 2}
                  height={grid.size * 2}
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx={grid.size} cy={grid.size} r="1" fill="#1E293B" />
                  <path
                    d={`M ${grid.size * 2} 0 L 0 0 0 ${grid.size * 2}`}
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#canvas-grid-pattern)" />
            </svg>
          )}

          {/* Background Nav Ribbon Guide (Non-interactive) */}
          {navBar && navBar.show && (
            navBar.orientation === 'left' ? (
              <div
                style={{
                  left: 0,
                  top: 0,
                  width: navBar.size,
                  height: '100%',
                  backgroundColor: navBar.backgroundColor || '#0F172A',
                }}
                className="absolute border-r-2 border-[#1E293B] pointer-events-none select-none p-4 flex flex-col justify-between z-0"
              >
                <div className="space-y-3">
                  <div className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white font-heading font-black text-xs truncate border border-white/20">
                    {navBar.reportTitle || 'Navigation'}
                  </div>
                  <div className="space-y-2 opacity-60">
                    <div className="h-6 rounded-md bg-white/20 w-3/4" />
                    <div className="h-6 rounded-md bg-white/10 w-4/5" />
                    <div className="h-6 rounded-md bg-white/10 w-2/3" />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-white/50 text-center uppercase tracking-wider py-1 rounded bg-black/20">
                  Nav Ribbon ({navBar.size}px)
                </div>
              </div>
            ) : (
              <div
                style={{
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: navBar.size,
                  backgroundColor: navBar.backgroundColor || '#0F172A',
                }}
                className="absolute border-b-2 border-[#1E293B] pointer-events-none select-none px-4 flex items-center justify-between z-0"
              >
                <div className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white font-heading font-black text-xs truncate border border-white/20">
                  {navBar.reportTitle || 'Navigation'}
                </div>
                <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider py-1 px-2 rounded bg-black/20">
                  Top Ribbon ({navBar.size}px)
                </div>
              </div>
            )
          )}

          {/* Background Page Header Titles (Non-interactive) */}
          {pageTitles && pageTitles.length > 0 && pageTitles.map((pt) => {
            if (!pt.title && !pt.subtitle) return null;
            const isLeftNav = navBar?.show && navBar.orientation === 'left';
            const isTopNav = navBar?.show && navBar.orientation === 'top';
            const titleLeft = isLeftNav ? navBar.size + 24 : 24;
            const titleTop = isTopNav ? navBar.size + 16 : 16;
            const isRight = pt.position === 'top-right' || pt.position === 'bottom-right';

            return (
              <div
                key={pt.id}
                style={{
                  left: isRight ? undefined : titleLeft,
                  right: isRight ? 24 : undefined,
                  top: pt.position.startsWith('bottom') ? undefined : titleTop,
                  bottom: pt.position.startsWith('bottom') ? 16 : undefined,
                }}
                className="absolute pointer-events-none select-none z-0 space-y-0.5"
              >
                {pt.title && (
                  <div
                    style={{ fontSize: pt.titleSize || 22, color: pt.titleColor || '#1E293B' }}
                    className="font-heading font-black leading-tight tracking-tight drop-shadow-xs"
                  >
                    {pt.title}
                  </div>
                )}
                {pt.subtitle && (
                  <div
                    style={{ fontSize: pt.subtitleSize || 13, color: pt.subtitleColor || '#64748B' }}
                    className="font-bold leading-tight"
                  >
                    {pt.subtitle}
                  </div>
                )}
              </div>
            );
          })}

          {/* Placed Visual Items */}
          {visuals.map((vis) => {
            const isSelected = selectedId === vis.id;
            const meta = VISUAL_TYPES_CATALOG.find((m) => m.type === vis.type);

            return (
              <div
                key={vis.id}
                style={{
                  left: vis.x,
                  top: vis.y,
                  width: vis.width,
                  height: vis.height,
                  zIndex: vis.zIndex,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVisual(vis.id);
                }}
                onPointerDown={(e) => handlePointerDownDrag(e, vis)}
                onPointerMove={(e) => handlePointerMoveDrag(e, vis)}
                onPointerUp={handlePointerUpDrag}
                className={`absolute group rounded-xl border-2 transition-shadow cursor-grab active:cursor-grabbing flex flex-col justify-between p-2.5 overflow-hidden ${
                  isSelected
                    ? 'border-[#8B5CF6] ring-3 ring-[#8B5CF6]/30 shadow-[4px_4px_0px_0px_#8B5CF6] bg-white dark:bg-slate-900'
                    : 'border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] bg-white/95 dark:bg-slate-900/95 hover:border-[#8B5CF6]'
                } ${vis.locked ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                {/* Visual Header Tag */}
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      style={{ backgroundColor: meta?.badgeBg || '#8B5CF6', color: meta?.badgeText || '#FFFFFF' }}
                      className="px-1.5 py-0.5 rounded text-[10px] font-heading font-black border border-[#1E293B] flex-shrink-0"
                    >
                      {meta?.label || vis.type}
                    </span>
                    <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white truncate">
                      {vis.name}
                    </span>
                  </div>

                  {vis.locked && (
                    <span className="p-0.5 text-slate-400">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Center / Body Preview Mock */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-1 pointer-events-none opacity-40">
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    X: {vis.x} | Y: {vis.y}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                    {vis.width} × {vis.height} px
                  </span>
                </div>

                {/* Bottom Status / Pill */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[9px] font-mono text-slate-400">
                  <span>Z: {vis.zIndex}</span>
                  <span className="text-[#8B5CF6] font-bold">PBI Pos</span>
                </div>

                {/* Resize Handles (8 directions) when selected and not locked */}
                {isSelected && !vis.locked && (
                  <>
                    {/* Corners */}
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'nw', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#8B5CF6] border-2 border-white rounded-full cursor-nwse-resize z-20"
                    />
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'ne', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#8B5CF6] border-2 border-white rounded-full cursor-nesw-resize z-20"
                    />
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'se', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#8B5CF6] border-2 border-white rounded-full cursor-nwse-resize z-20"
                    />
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'sw', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#8B5CF6] border-2 border-white rounded-full cursor-nesw-resize z-20"
                    />
                    {/* Edges */}
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'n', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#8B5CF6] border border-white rounded-xs cursor-ns-resize z-20"
                    />
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 's', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#8B5CF6] border border-white rounded-xs cursor-ns-resize z-20"
                    />
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'w', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 bg-[#8B5CF6] border border-white rounded-xs cursor-ew-resize z-20"
                    />
                    <div
                      onPointerDown={(e) => handlePointerDownResize(e, 'e', vis)}
                      onPointerMove={(e) => handlePointerMoveResize(e, vis)}
                      onPointerUp={handlePointerUpResize}
                      className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-[#8B5CF6] border border-white rounded-xs cursor-ew-resize z-20"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar for Selected Visual */}
      {selectedVisual && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] flex-wrap animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
              Selected: <span className="text-[#8B5CF6]">{selectedVisual.name}</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
              X={selectedVisual.x} Y={selectedVisual.y} | {selectedVisual.width} × {selectedVisual.height} px
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBringToFront(selectedVisual.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Bring to Front"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Front</span>
            </button>

            <button
              type="button"
              onClick={() => onDuplicateVisual(selectedVisual.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Duplicate Visual"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateVisual(selectedVisual.id, { locked: !selectedVisual.locked })}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                selectedVisual.locked
                  ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-800 dark:text-amber-300'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title={selectedVisual.locked ? 'Unlock Visual' : 'Lock Position'}
            >
              {selectedVisual.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{selectedVisual.locked ? 'Locked' : 'Lock'}</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteVisual(selectedVisual.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 cursor-pointer"
              title="Delete Visual"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Lock, Unlock, ChevronLeft, ChevronRight, Copy, Check, Pipette } from 'lucide-react';
import { ColorSwatch } from '../core/types';
import { ContrastBadge } from './ContrastBadge';
import chroma from 'chroma-js';

interface ColorSwatchCardProps {
  index: number;
  swatch: ColorSwatch;
  isDarkCanvas: boolean;
  onUpdateHex: (index: number, newHex: string) => void;
  onToggleLock: (index: number) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

export const ColorSwatchCard: React.FC<ColorSwatchCardProps> = ({
  index,
  swatch,
  isDarkCanvas,
  onUpdateHex,
  onToggleLock,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}) => {
  const [copied, setCopied] = useState(false);
  const [hexInput, setHexInput] = useState(swatch.hex);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Sync internal hex state if swatch prop updates
  if (hexInput !== swatch.hex && !document.activeElement?.id?.includes(`hex-input-${index}`)) {
    setHexInput(swatch.hex);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(swatch.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleHexBlur = () => {
    if (chroma.valid(hexInput)) {
      const normalized = chroma(hexInput).hex().toUpperCase();
      setHexInput(normalized);
      onUpdateHex(index, normalized);
    } else {
      // Revert to valid swatch
      setHexInput(swatch.hex);
    }
  };

  const handleHexKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHexBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value.toUpperCase();
    setHexInput(newHex);
    onUpdateHex(index, newHex);
  };

  const currentContrast = isDarkCanvas ? swatch.contrastOnDark : swatch.contrastOnLight;

  return (
    <div className={`flex flex-col bg-slate-900 border rounded-xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg ${
      swatch.isLocked
        ? 'border-amber-500/50 ring-1 ring-amber-500/20'
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Visual Color Block with Sequence and Native Color Picker */}
      <div
        onClick={() => colorPickerRef.current?.click()}
        className="relative h-24 w-full cursor-pointer group flex items-center justify-center transition-transform"
        style={{ backgroundColor: swatch.hex }}
        title="Click to open color picker"
      >
        {/* Sequence Badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-950/60 backdrop-blur-xs text-[11px] font-mono font-bold text-white border border-white/10 shadow-xs">
          #{index + 1}
        </div>

        {/* Lock Indicator */}
        {swatch.isLocked && (
          <div className="absolute top-2 right-2 p-1 rounded-md bg-amber-500 text-slate-950 shadow-xs">
            <Lock className="w-3 h-3" />
          </div>
        )}

        {/* Hover Pipette Hint */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/70 backdrop-blur-xs px-2 py-1 rounded-full text-white text-xs flex items-center gap-1 font-medium shadow-md">
          <Pipette className="w-3 h-3" />
          <span>Pick</span>
        </div>

        {/* Hidden native color input */}
        <input
          ref={colorPickerRef}
          type="color"
          value={swatch.hex}
          onChange={handleColorPickerChange}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </div>

      {/* Card Content & Controls */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        {/* Hex input & Copy */}
        <div className="flex items-center justify-between gap-1">
          <div className="relative flex-1">
            <input
              id={`hex-input-${index}`}
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value.toUpperCase())}
              onBlur={handleHexBlur}
              onKeyDown={handleHexKeyDown}
              maxLength={7}
              className="w-full bg-slate-950 text-slate-100 font-mono text-xs font-semibold px-2 py-1 rounded border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none uppercase"
            />
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy Hex Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Contrast indicator */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[10px] text-slate-400">Contrast:</span>
          <ContrastBadge contrastRatio={currentContrast} />
        </div>

        {/* Action Buttons: Reorder & Lock */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={!canMoveLeft}
              onClick={() => onMoveLeft(index)}
              className={`p-1 rounded text-slate-400 hover:text-slate-200 transition-colors ${
                canMoveLeft ? 'hover:bg-slate-800 cursor-pointer' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Move color earlier in sequence"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={!canMoveRight}
              onClick={() => onMoveRight(index)}
              className={`p-1 rounded text-slate-400 hover:text-slate-200 transition-colors ${
                canMoveRight ? 'hover:bg-slate-800 cursor-pointer' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Move color later in sequence"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onToggleLock(index)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              swatch.isLocked
                ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={swatch.isLocked ? 'Unlock color' : 'Lock color (preserves across extractions)'}
          >
            {swatch.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

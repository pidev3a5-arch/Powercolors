import React, { useState, useRef } from 'react';
import { Lock, Unlock, ChevronLeft, ChevronRight, Copy, Check, Pipette } from 'lucide-react';
import { ColorSwatch } from '../core/types';
import { ContrastBadge } from './ContrastBadge';
import { copyToClipboard } from '../core/clipboard';
import chroma from 'chroma-js';

interface ColorSwatchCardProps {
  index: number;
  swatch: ColorSwatch;
  isDarkCanvas: boolean;
  isDarkSite?: boolean;
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
  isDarkSite: _isDarkSite = false,
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

  if (hexInput !== swatch.hex && !document.activeElement?.id?.includes(`hex-input-${index}`)) {
    setHexInput(swatch.hex);
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(swatch.hex);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleHexBlur = () => {
    if (chroma.valid(hexInput)) {
      const normalized = chroma(hexInput).hex().toUpperCase();
      setHexInput(normalized);
      onUpdateHex(index, normalized);
    } else {
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
    <div
      className={`group relative flex flex-col rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200 ${
        swatch.isLocked
          ? 'shadow-[4px_4px_0px_0px_#FBBF24] ring-2 ring-[#FBBF24]'
          : 'shadow-[4px_4px_0px_0px_#1E293B] dark:shadow-[4px_4px_0px_0px_#020617] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#1E293B] dark:hover:shadow-[6px_6px_0px_0px_#020617]'
      }`}
    >
      {/* Visual Color Block with Native Color Picker Trigger */}
      <div
        onClick={() => colorPickerRef.current?.click()}
        className="relative h-24 w-full cursor-pointer flex items-center justify-center transition-transform"
        style={{ backgroundColor: swatch.hex }}
        title="Click to pick a color"
      >
        {/* Sequence Badge (Yellow Pill) */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FBBF24] text-[#1E293B] text-[11px] font-heading font-extrabold border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
          #{index + 1}
        </div>

        {/* Lock Indicator */}
        {swatch.isLocked && (
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] animate-bounce">
            <Lock className="w-3 h-3 stroke-[2.5]" />
          </div>
        )}

        {/* Hover Pipette Hint */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#1E293B] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
          <Pipette className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Pick</span>
        </div>

        <input
          ref={colorPickerRef}
          type="color"
          value={swatch.hex}
          onChange={handleColorPickerChange}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </div>

      {/* Card Content & Controls */}
      <div className="p-2.5 sm:p-3 space-y-2 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
        {/* Hex input & Copy Button */}
        <div className="flex items-center gap-1 min-w-0">
          <input
            id={`hex-input-${index}`}
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value.toUpperCase())}
            onBlur={handleHexBlur}
            onKeyDown={handleHexKeyDown}
            maxLength={7}
            className="w-full font-mono text-[11px] font-black px-1.5 py-1 rounded-lg border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-[#1E293B] dark:text-white uppercase outline-none focus:border-[#8B5CF6] focus:shadow-[2px_2px_0px_0px_#8B5CF6] transition-all min-w-0 tracking-tight"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-lg border-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex-shrink-0"
            title="Copy Hex Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        </div>

        {/* Contrast indicator */}
        <div className="flex items-center justify-between gap-1 pt-0.5 min-w-0">
          <span className="text-[10px] font-heading font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight flex-shrink-0">
            Ratio
          </span>
          <ContrastBadge contrastRatio={currentContrast} />
        </div>

        {/* Action Buttons: Reorder & Lock */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={!canMoveLeft}
              onClick={() => onMoveLeft(index)}
              className={`p-1 rounded-lg border-2 border-[#1E293B] dark:border-slate-700 transition-all ${
                canMoveLeft
                  ? 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                  : 'opacity-25 cursor-not-allowed bg-slate-100 dark:bg-slate-800'
              }`}
              title="Move color earlier"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              disabled={!canMoveRight}
              onClick={() => onMoveRight(index)}
              className={`p-1 rounded-lg border-2 border-[#1E293B] dark:border-slate-700 transition-all ${
                canMoveRight
                  ? 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                  : 'opacity-25 cursor-not-allowed bg-slate-100 dark:bg-slate-800'
              }`}
              title="Move color later"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onToggleLock(index)}
            className={`p-1.5 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 transition-all cursor-pointer ${
              swatch.isLocked
                ? 'bg-[#FBBF24] text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#F472B6] hover:text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]'
            } active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
            title={swatch.isLocked ? 'Unlock color' : 'Lock color'}
          >
            {swatch.isLocked ? <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> : <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  );
};

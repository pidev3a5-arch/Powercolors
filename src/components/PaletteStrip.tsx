import React from 'react';
import { ColorSwatch } from '../core/types';
import { ColorSwatchCard } from './ColorSwatchCard';
import { ArrowLeftRight, Lock, Unlock, Shuffle, Palette } from 'lucide-react';

interface PaletteStripProps {
  swatches: ColorSwatch[];
  isDarkCanvas: boolean;
  onUpdateHex: (index: number, newHex: string) => void;
  onToggleLock: (index: number) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onReversePalette: () => void;
  onToggleLockAll: () => void;
  onShuffleUnlocked: () => void;
}

export const PaletteStrip: React.FC<PaletteStripProps> = ({
  swatches,
  isDarkCanvas,
  onUpdateHex,
  onToggleLock,
  onMoveLeft,
  onMoveRight,
  onReversePalette,
  onToggleLockAll,
  onShuffleUnlocked,
}) => {
  const allLocked = swatches.length > 0 && swatches.every((s) => s.isLocked);

  return (
    <div className="w-full space-y-3">
      {/* Palette Header & Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              10-Color Data Palette
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700">
              dataColors
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Power BI Desktop visuals cycle sequentially through these 10 colors for series and categories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleLockAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title={allLocked ? 'Unlock all swatches' : 'Lock all swatches'}
          >
            {allLocked ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{allLocked ? 'Unlock All' : 'Lock All'}</span>
          </button>

          <button
            type="button"
            onClick={onReversePalette}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Reverse color sequence order"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Reverse</span>
          </button>

          <button
            type="button"
            onClick={onShuffleUnlocked}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Shuffle order of unlocked colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-400" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
        {swatches.map((swatch, idx) => (
          <ColorSwatchCard
            key={swatch.id || `swatch-${idx}`}
            index={idx}
            swatch={swatch}
            isDarkCanvas={isDarkCanvas}
            onUpdateHex={onUpdateHex}
            onToggleLock={onToggleLock}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            canMoveLeft={idx > 0}
            canMoveRight={idx < swatches.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

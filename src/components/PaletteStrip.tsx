import React from 'react';
import { ColorSwatch } from '../core/types';
import { ColorSwatchCard } from './ColorSwatchCard';
import { ArrowLeftRight, Lock, Unlock, Shuffle } from 'lucide-react';

interface PaletteStripProps {
  swatches: ColorSwatch[];
  isDarkCanvas: boolean;
  isDarkSite?: boolean;
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
  isDarkSite = false,
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
    <div className="w-full space-y-5">
      {/* Palette Header matching Playful Geometric Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] flex items-center justify-center font-heading font-extrabold text-sm shadow-[2px_2px_0px_0px_#1E293B]">
              1
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E293B] dark:text-white tracking-tight">
              Color Palette
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-[#8B5CF6] text-white font-mono font-bold text-xs border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
              10 dataColors
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 pl-10">
            Power BI Desktop visuals cycle sequentially through these 10 colors for series, categories, and slices.
          </p>
        </div>

        {/* Action Buttons as Tactile Candy Buttons */}
        <div className="flex flex-wrap items-center gap-2 pl-10 sm:pl-0">
          <button
            type="button"
            onClick={onToggleLockAll}
            className={`pop-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              allLocked
                ? 'bg-[#FBBF24] text-[#1E293B]'
                : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B]'
            }`}
            title={allLocked ? 'Unlock all swatches' : 'Lock all swatches'}
          >
            {allLocked ? <Unlock className="w-3.5 h-3.5 stroke-[2.5]" /> : <Lock className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>{allLocked ? 'Unlock All' : 'Lock All'}</span>
          </button>

          <button
            type="button"
            onClick={onReversePalette}
            className="pop-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#F472B6] hover:text-white transition-all cursor-pointer"
            title="Reverse color sequence order"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Reverse</span>
          </button>

          <button
            type="button"
            onClick={onShuffleUnlocked}
            className="pop-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] transition-all cursor-pointer"
            title="Shuffle order of unlocked colors"
          >
            <Shuffle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* 10 Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
        {swatches.map((swatch, idx) => (
          <ColorSwatchCard
            key={swatch.id || `swatch-${idx}`}
            index={idx}
            swatch={swatch}
            isDarkCanvas={isDarkCanvas}
            isDarkSite={isDarkSite}
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

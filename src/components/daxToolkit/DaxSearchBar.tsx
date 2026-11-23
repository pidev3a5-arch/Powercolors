import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { DaxCategory } from '../../core/daxToolkit/types';
import { DAX_CATEGORIES } from '../../core/daxToolkit/catalog';

interface DaxSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: DaxCategory | 'all';
  onCategoryChange: (cat: DaxCategory | 'all') => void;
  selectedDifficulty: 'all' | 'Beginner' | 'Intermediate' | 'Advanced';
  onDifficultyChange: (diff: 'all' | 'Beginner' | 'Intermediate' | 'Advanced') => void;
  totalResults: number;
}

export const DaxSearchBar: React.FC<DaxSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  totalResults,
}) => {
  return (
    <div className="space-y-3 min-w-0 w-full">
      {/* Top Search Input */}
      <div className="relative w-full min-w-0">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search measures by name, tags, or DAX functions (e.g. CALCULATE, YTD)..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl sm:rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-400 shadow-[2.5px_2.5px_0px_0px_#1E293B] focus:outline-none focus:border-[#8B5CF6]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Row: Difficulty Segmented Control & Total Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
        {/* Difficulty Segmented Control */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl sm:rounded-full bg-slate-100 dark:bg-slate-800/80 sm:bg-white sm:dark:bg-slate-900 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] overflow-x-auto max-w-full">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1.5 shrink-0 hidden sm:inline-block" />
          {[
            { id: 'all', short: 'All', full: 'All Levels' },
            { id: 'Beginner', short: 'Beginner', full: 'Beginner' },
            { id: 'Intermediate', short: 'Intermed.', full: 'Intermediate' },
            { id: 'Advanced', short: 'Advanced', full: 'Advanced' },
          ].map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => onDifficultyChange(diff.id as any)}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-full text-[11px] sm:text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap text-center ${
                selectedDifficulty === diff.id
                  ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
              }`}
            >
              <span className="sm:hidden">{diff.short}</span>
              <span className="hidden sm:inline">{diff.full}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-[11px] sm:text-xs font-heading font-black text-slate-500">
          <span className="sm:hidden text-slate-400 uppercase tracking-wider text-[10px]">Showing</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-[#8B5CF6] dark:text-purple-300">
            {totalResults} {totalResults === 1 ? 'Measure' : 'Measures'}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap shrink-0 border-2 border-[#1E293B] ${
            selectedCategory === 'all'
              ? 'bg-[#FBBF24] text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#1E293B]'
          }`}
        >
          All Categories
        </button>

        {DAX_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap shrink-0 border-2 border-[#1E293B] ${
                isSelected
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#1E293B]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

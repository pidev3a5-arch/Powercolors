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
    <div className="space-y-3">
      {/* Top Search Input & Difficulty Filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search measures by name, tags, or DAX functions (e.g. CALCULATE, YTD, Pareto, SWITCH)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-400 shadow-[3px_3px_0px_0px_#1E293B] focus:outline-none focus:border-[#8B5CF6]"
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

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white dark:bg-slate-900 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => onDifficultyChange(diff)}
                className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#1E293B]'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </button>
            ))}
          </div>

          <span className="text-xs font-heading font-black text-slate-500 whitespace-nowrap pl-1">
            {totalResults} Measure{totalResults !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap border-2 border-[#1E293B] ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap border-2 border-[#1E293B] ${
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

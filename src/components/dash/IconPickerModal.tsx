import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { AVAILABLE_NAV_ICONS, NavIconDefinition } from '../../core/dashTypes';

interface IconPickerModalProps {
  isOpen: boolean;
  currentIcon: string;
  onSelectIcon: (iconName: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  currentIcon,
  onSelectIcon,
  onClose,
  title = 'Choose Navigation Icon',
  description = 'Curated vector icons optimized for Power BI report tabs',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredIcons = useMemo(() => {
    return AVAILABLE_NAV_ICONS.filter((icon: NavIconDefinition) => {
      const matchesSearch =
        icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[8px_8px_0px_0px_#1E293B] p-5 sm:p-7 max-h-[85vh] flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-heading font-black text-[#1E293B] dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-rose-100 hover:text-rose-600 shadow-[2px_2px_0px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons by name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-sm font-bold text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6] focus:shadow-[2px_2px_0px_0px_#8B5CF6] transition-all"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'analytics', 'navigation', 'commerce', 'general'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-heading font-black border-2 border-[#1E293B] transition-all capitalize cursor-pointer flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {filteredIcons.map((icon) => {
              const isSelected = icon.name === currentIcon;
              return (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => {
                    onSelectIcon(icon.name);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#8B5CF6] text-white shadow-[3px_3px_0px_0px_#1E293B] -translate-y-0.5'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                  >
                    <path d={icon.path} />
                  </svg>
                  <span className="text-[11px] font-heading font-black truncate max-w-full">
                    {icon.label}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-bold text-sm">
              No matching icons found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

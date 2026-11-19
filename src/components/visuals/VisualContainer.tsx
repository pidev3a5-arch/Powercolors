import React from 'react';
import { Filter, Maximize2, MoreVertical } from 'lucide-react';

interface VisualContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  isDarkCanvas: boolean;
}

export const VisualContainer: React.FC<VisualContainerProps> = ({
  title,
  subtitle,
  children,
  className = '',
  isDarkCanvas,
}) => {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isDarkCanvas
          ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-sm'
      } ${className}`}
    >
      {/* Power BI Visual Header */}
      <div className={`px-4 pt-3.5 pb-2 flex items-start justify-between border-b ${
        isDarkCanvas ? 'border-slate-800/60' : 'border-slate-100'
      }`}>
        <div className="min-w-0 pr-2">
          <h3 className={`text-xs font-bold tracking-tight truncate ${
            isDarkCanvas ? 'text-slate-100' : 'text-slate-800'
          }`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-[11px] truncate mt-0.5 ${
              isDarkCanvas ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Power BI Action Icons */}
        <div className={`flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity ${
          isDarkCanvas ? 'text-slate-400' : 'text-slate-400'
        }`}>
          <button
            type="button"
            className="p-1 rounded hover:bg-slate-500/10 cursor-pointer"
            title="Filters on this visual"
          >
            <Filter className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-slate-500/10 cursor-pointer"
            title="Focus mode"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-slate-500/10 cursor-pointer"
            title="More options"
          >
            <MoreVertical className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Visual Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

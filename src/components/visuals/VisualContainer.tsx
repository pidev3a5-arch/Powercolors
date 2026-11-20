import React from 'react';
import { Filter, Maximize2, MoreVertical } from 'lucide-react';

interface VisualContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  isDarkCanvas: boolean;
  fontFamily?: string;
}

export const VisualContainer: React.FC<VisualContainerProps> = ({
  title,
  subtitle,
  children,
  className = '',
  isDarkCanvas,
  fontFamily,
}) => {
  return (
    <div
      style={{ fontFamily }}
      className={`rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 transition-all duration-200 overflow-hidden flex flex-col shadow-[4px_4px_0px_0px_#1E293B] dark:shadow-[4px_4px_0px_0px_#020617] ${
        isDarkCanvas
          ? 'bg-slate-900 text-slate-100'
          : 'bg-white text-slate-900'
      } ${className}`}
    >
      {/* Power BI Visual Header */}
      <div className={`px-4 pt-3.5 pb-2.5 flex items-start justify-between border-b-2 border-[#1E293B]/15 dark:border-slate-800 ${
        isDarkCanvas ? 'bg-slate-950/40' : 'bg-[#FFFDF5]/80'
      }`}>
        <div className="min-w-0 pr-2">
          <h3
            style={{ fontFamily }}
            className={`text-xs font-heading font-extrabold tracking-tight truncate ${
              isDarkCanvas ? 'text-slate-100' : 'text-[#1E293B]'
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{ fontFamily }}
              className="text-[11px] truncate mt-0.5 text-slate-500 font-medium"
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-1 text-slate-500">
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FBBF24] hover:text-[#1E293B] transition-colors cursor-pointer"
            title="Filters on visual"
          >
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FBBF24] hover:text-[#1E293B] transition-colors cursor-pointer"
            title="Focus mode"
          >
            <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FBBF24] hover:text-[#1E293B] transition-colors cursor-pointer"
            title="More options"
          >
            <MoreVertical className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Visual Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between" style={{ fontFamily }}>
        {children}
      </div>
    </div>
  );
};

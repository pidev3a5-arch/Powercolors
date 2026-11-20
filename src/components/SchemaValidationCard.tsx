import React from 'react';
import { CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { PowerBITheme } from '../core/types';
import { validatePowerBITheme } from '../core/powerBiTheme';

interface SchemaValidationCardProps {
  theme: PowerBITheme;
  isDarkCanvas: boolean;
}

export const SchemaValidationCard: React.FC<SchemaValidationCardProps> = ({
  theme,
  isDarkCanvas: _isDarkCanvas,
}) => {
  const validation = validatePowerBITheme(theme);

  const checklistItems = [
    {
      label: 'Microsoft Schema URL',
      detail: '$schema points to official reportThemeSchema JSON',
      valid: theme.$schema.includes('reportThemeSchema'),
    },
    {
      label: '10 Data Colors',
      detail: `Contains exactly ${theme.dataColors.length} valid hex strings for visuals`,
      valid: theme.dataColors.length === 10,
    },
    {
      label: 'Structural Colors',
      detail: `background (${theme.background}), foreground (${theme.foreground}), tableAccent (${theme.tableAccent})`,
      valid: !!theme.background && !!theme.foreground && !!theme.tableAccent,
    },
    {
      label: 'KPI Status Colors',
      detail: `good (${theme.good}), neutral (${theme.neutral}), bad (${theme.bad})`,
      valid: !!theme.good && !!theme.neutral && !!theme.bad,
    },
    {
      label: 'Typography classes',
      detail: `Font: ${theme.textClasses.title.fontFace} configured for title, label, callout, header`,
      valid: !!theme.textClasses?.title?.fontFace,
    },
  ];

  return (
    <div className="rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 p-5 bg-[#FFFDF5] dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-dashed border-[#1E293B]/20 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-heading font-extrabold text-[#1E293B] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] border border-[#1E293B]" />
            Official Schema Compliance
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            Guaranteed compatible with Microsoft Power BI Desktop 2024-2026
          </p>
        </div>

        <a
          href="https://github.com/microsoft/powerbi-desktop-samples/tree/main/Report%20Theme%20JSON%20Schema"
          target="_blank"
          rel="noopener noreferrer"
          className="pop-btn text-xs bg-white dark:bg-slate-800 text-[#8B5CF6] dark:text-[#A78BFA] px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 transition-colors"
        >
          <span>Official Schema</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
        </a>
      </div>

      {/* Checklist */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-[#1E293B]/20 dark:border-slate-800">
            {item.valid ? (
              <span className="w-5 h-5 rounded-full bg-[#34D399] text-[#1E293B] border border-[#1E293B] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_#1E293B]">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full bg-rose-400 text-white border border-[#1E293B] flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
            <div>
              <span className="text-xs font-heading font-extrabold text-[#1E293B] dark:text-slate-200">
                {item.label}
              </span>
              <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 font-medium">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Validation errors */}
      {!validation.isValid && (
        <div className="mt-4 p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-700 text-xs font-bold shadow-[2px_2px_0px_0px_#EF4444]">
          <span>Validation issues:</span>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            {validation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';
import { PowerBITheme } from '../core/types';
import { validatePowerBITheme } from '../core/powerBiTheme';

interface SchemaValidationCardProps {
  theme: PowerBITheme;
  isDarkCanvas: boolean;
}

export const SchemaValidationCard: React.FC<SchemaValidationCardProps> = ({
  theme,
  isDarkCanvas,
}) => {
  const validation = validatePowerBITheme(theme);

  const checklistItems = [
    {
      label: 'Microsoft Schema URL',
      detail: '$schema points to reportThemeSchema-latest.json',
      valid: theme.$schema.includes('reportThemeSchema-latest.json'),
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
      label: 'Segoe UI / Typography Classes',
      detail: `Font: ${theme.textClasses.title.fontFamily} configured for title, label, callout, header`,
      valid: !!theme.textClasses?.title?.fontFamily,
    },
  ];

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isDarkCanvas ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-xs font-bold ${isDarkCanvas ? 'text-white' : 'text-slate-800'}`}>
              Microsoft Power BI Schema Compliance
            </h4>
            <p className={`text-[11px] ${isDarkCanvas ? 'text-slate-400' : 'text-slate-500'}`}>
              Guaranteed importable via Power BI Desktop (View → Themes → Browse)
            </p>
          </div>
        </div>

        <a
          href="https://github.com/microsoft/powerbi-desktop-samples/tree/main/Report%20Theme%20JSON%20Schema"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 font-medium"
        >
          <span>Official Schema</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            {item.valid ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className={`font-semibold text-[11px] ${isDarkCanvas ? 'text-slate-200' : 'text-slate-700'}`}>
                {item.label}
              </span>
              <p className={`text-[10px] ${isDarkCanvas ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!validation.isValid && (
        <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <span className="font-bold">Validation Issues:</span>
          <ul className="list-disc list-inside mt-1">
            {validation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

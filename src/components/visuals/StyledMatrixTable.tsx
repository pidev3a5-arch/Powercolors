import React from 'react';
import { VisualContainer } from './VisualContainer';
import { StructuralColors } from '../../core/types';

interface StyledMatrixTableProps {
  dataColors: string[];
  structural: StructuralColors;
  isDarkCanvas: boolean;
}

interface TableRowData {
  rep: string;
  region: string;
  deals: number;
  revenue: number; // in thousands
  margin: number; // percentage
  status: 'good' | 'bad' | 'neutral';
}

const TABLE_ROWS: TableRowData[] = [
  { rep: 'Sarah Jenkins', region: 'North America', deals: 42, revenue: 840, margin: 46.2, status: 'good' },
  { rep: 'Marcus Vance', region: 'EMEA', deals: 36, revenue: 710, margin: 43.8, status: 'good' },
  { rep: 'Kenji Sato', region: 'Asia-Pacific', deals: 31, revenue: 630, margin: 39.5, status: 'neutral' },
  { rep: 'Elena Rostova', region: 'Europe West', deals: 27, revenue: 540, margin: 41.0, status: 'good' },
  { rep: 'Lucas Silva', region: 'Latin America', deals: 18, revenue: 320, margin: 31.4, status: 'bad' },
];

export const StyledMatrixTable: React.FC<StyledMatrixTableProps> = ({
  dataColors,
  structural,
  isDarkCanvas,
}) => {
  const primaryBarColor = dataColors[0] || '#2563EB';
  const maxRevenue = 1000;

  const getStatusColor = (status: TableRowData['status']) => {
    switch (status) {
      case 'good':
        return structural.good;
      case 'bad':
        return structural.bad;
      case 'neutral':
        return structural.neutral;
    }
  };

  const getStatusLabel = (status: TableRowData['status']) => {
    switch (status) {
      case 'good':
        return 'On Track';
      case 'bad':
        return 'At Risk';
      case 'neutral':
        return 'Monitoring';
    }
  };

  return (
    <VisualContainer
      title="Top Sales Reps & Regional Performance"
      subtitle="Matrix Visual (Headers styled by tableAccent)"
      isDarkCanvas={isDarkCanvas}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header Styled by TableAccent */}
          <thead>
            <tr
              style={{ backgroundColor: structural.tableAccent }}
              className="text-white font-semibold transition-colors"
            >
              <th className="py-2.5 px-3 rounded-l-md font-sans">Representative</th>
              <th className="py-2.5 px-3 font-sans">Region</th>
              <th className="py-2.5 px-3 text-right font-sans">Deals</th>
              <th className="py-2.5 px-3 text-left font-sans min-w-[140px]">Revenue Volume</th>
              <th className="py-2.5 px-3 text-right font-sans">Margin</th>
              <th className="py-2.5 px-3 text-center rounded-r-md font-sans">Status</th>
            </tr>
          </thead>

          {/* Table Rows with Alternating Striping */}
          <tbody className="divide-y divide-slate-800/20">
            {TABLE_ROWS.map((row, idx) => {
              const isEven = idx % 2 === 0;
              const rowBg = isEven
                ? isDarkCanvas
                  ? 'bg-slate-900/60'
                  : 'bg-white'
                : isDarkCanvas
                ? 'bg-slate-800/40'
                : 'bg-slate-50/80';

              const barWidth = `${(row.revenue / maxRevenue) * 100}%`;
              const statusColor = getStatusColor(row.status);

              return (
                <tr
                  key={row.rep}
                  className={`transition-colors hover:bg-slate-500/10 ${rowBg}`}
                >
                  <td className="py-2.5 px-3 font-medium">{row.rep}</td>
                  <td className={`py-2.5 px-3 ${isDarkCanvas ? 'text-slate-400' : 'text-slate-600'}`}>
                    {row.region}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">
                    {row.deals}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: barWidth, backgroundColor: primaryBarColor }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold w-12 text-right">
                        ${row.revenue}k
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {row.margin.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${statusColor}20`,
                        color: statusColor,
                      }}
                    >
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </VisualContainer>
  );
};

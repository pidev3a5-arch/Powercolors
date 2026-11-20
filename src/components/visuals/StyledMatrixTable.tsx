import React from 'react';
import { VisualContainer } from './VisualContainer';
import { StructuralColors } from '../../core/types';

interface StyledMatrixTableProps {
  dataColors: string[];
  structural: StructuralColors;
  isDarkCanvas: boolean;
  fontFamily?: string;
}

interface TableRowData {
  rep: string;
  region: string;
  deals: number;
  revenue: number;
  margin: number;
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
  fontFamily,
}) => {
  const primaryBarColor = dataColors[0] || '#8B5CF6';
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
      fontFamily={fontFamily}
    >
      <div className="w-full overflow-x-auto" style={{ fontFamily }}>
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          {/* Table Header Styled by TableAccent */}
          <thead>
            <tr
              style={{ backgroundColor: structural.tableAccent, fontFamily }}
              className="text-white font-heading font-extrabold transition-colors border-b-2 border-[#1E293B]"
            >
              <th className="py-2.5 px-3 rounded-l-xl">Representative</th>
              <th className="py-2.5 px-3">Region</th>
              <th className="py-2.5 px-3 text-right">Deals</th>
              <th className="py-2.5 px-3 text-left min-w-[140px]">Revenue Volume</th>
              <th className="py-2.5 px-3 text-right">Margin</th>
              <th className="py-2.5 px-3 text-center rounded-r-xl">Status</th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className="divide-y-2 divide-dashed divide-slate-200 dark:divide-slate-800" style={{ fontFamily }}>
            {TABLE_ROWS.map((row, idx) => {
              const isEven = idx % 2 === 0;
              const rowBg = isEven
                ? isDarkCanvas
                  ? 'bg-slate-900'
                  : 'bg-white'
                : isDarkCanvas
                ? 'bg-slate-800/40'
                : 'bg-[#FFFDF5]';

              const barWidth = `${(row.revenue / maxRevenue) * 100}%`;
              const statusColor = getStatusColor(row.status);

              return (
                <tr
                  key={row.rep}
                  className={`transition-colors hover:bg-[#FBBF24]/10 ${rowBg}`}
                  style={{ fontFamily }}
                >
                  <td className="py-2.5 px-3 font-heading font-bold text-[#1E293B] dark:text-white">
                    {row.rep}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-medium">
                    {row.region}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {row.deals}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full border border-[#1E293B] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: barWidth, backgroundColor: primaryBarColor }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-black w-12 text-right">
                        ${row.revenue}k
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {row.margin.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
                      style={{
                        backgroundColor: `${statusColor}25`,
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

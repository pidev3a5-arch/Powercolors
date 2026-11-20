import React, { useState } from 'react';
import { VisualContainer } from './VisualContainer';

interface ClusteredBarChartProps {
  dataColors: string[];
  isDarkCanvas: boolean;
  fontFamily?: string;
}

interface DataSeries {
  name: string;
  colorIndex: number;
}

interface CategoryGroup {
  category: string;
  values: number[];
}

const CATEGORIES: CategoryGroup[] = [
  { category: 'North America', values: [840, 620, 480, 290] },
  { category: 'EMEA', values: [710, 540, 410, 310] },
  { category: 'Asia-Pacific', values: [630, 490, 580, 420] },
  { category: 'Latin America', values: [320, 260, 210, 180] },
];

const SERIES: DataSeries[] = [
  { name: 'Enterprise', colorIndex: 0 },
  { name: 'Mid-Market', colorIndex: 1 },
  { name: 'SMB', colorIndex: 2 },
  { name: 'Consumer', colorIndex: 3 },
];

export const ClusteredBarChart: React.FC<ClusteredBarChartProps> = ({
  dataColors,
  isDarkCanvas,
  fontFamily,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    category: string;
    series: string;
    value: number;
    color: string;
  } | null>(null);

  const axisColor = isDarkCanvas ? '#334155' : '#CBD5E1';
  const labelColor = isDarkCanvas ? '#94A3B8' : '#475569';

  const chartWidth = 500;
  const chartHeight = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxValue = 1000;
  const groupWidth = innerWidth / CATEGORIES.length;
  const barWidth = (groupWidth * 0.72) / SERIES.length;

  return (
    <VisualContainer
      title="Revenue by Region & Segment"
      subtitle="Clustered Column Chart (Series 1–4)"
      isDarkCanvas={isDarkCanvas}
      fontFamily={fontFamily}
    >
      <div className="flex flex-col h-full space-y-2.5" style={{ fontFamily }}>
        {/* Interactive Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          {SERIES.map((s) => {
            const color = dataColors[s.colorIndex] || '#8B5CF6';
            return (
              <div key={s.name} className="flex items-center space-x-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]"
                  style={{ backgroundColor: color }}
                />
                <span className="font-heading font-bold text-[11px] text-slate-700 dark:text-slate-300">
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* SVG Chart Area */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-[220px] overflow-visible"
          >
            {/* Grid Lines */}
            {[0, 250, 500, 750, 1000].map((val) => {
              const y = padding.top + innerHeight - (val / maxValue) * innerHeight;
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={axisColor}
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    opacity={0.8}
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="9"
                    fontWeight="700"
                    fill={labelColor}
                    style={{ fontFamily }}
                  >
                    ${val}k
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {CATEGORIES.map((cat, catIdx) => {
              const groupX = padding.left + catIdx * groupWidth + (groupWidth * 0.14);

              return (
                <g key={cat.category}>
                  {/* Category X-Axis Label */}
                  <text
                    x={groupX + (groupWidth * 0.72) / 2}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill={labelColor}
                    fontWeight="800"
                    style={{ fontFamily }}
                  >
                    {cat.category}
                  </text>

                  {/* Individual Segment Bars */}
                  {cat.values.map((val, seriesIdx) => {
                    const barHeight = (val / maxValue) * innerHeight;
                    const barX = groupX + seriesIdx * barWidth;
                    const barY = padding.top + innerHeight - barHeight;
                    const color = dataColors[seriesIdx] || '#8B5CF6';

                    return (
                      <rect
                        key={seriesIdx}
                        x={barX}
                        y={barY}
                        width={barWidth - 2}
                        height={barHeight}
                        rx="3"
                        fill={color}
                        stroke="#1E293B"
                        strokeWidth="1.5"
                        className="transition-all duration-200 hover:brightness-110 cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            category: cat.category,
                            series: SERIES[seriesIdx].name,
                            value: val,
                            color,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Tooltip Callout */}
          {hoveredPoint && (
            <div
              style={{ fontFamily }}
              className="absolute top-2 right-2 px-3 py-2 rounded-xl text-xs border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white pointer-events-none transition-all"
            >
              <div className="flex items-center space-x-1.5 font-heading font-extrabold">
                <span className="w-2.5 h-2.5 rounded-full border border-[#1E293B]" style={{ backgroundColor: hoveredPoint.color }} />
                <span>{hoveredPoint.series}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                {hoveredPoint.category}: <span className="font-extrabold text-[#8B5CF6]">${hoveredPoint.value}k</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </VisualContainer>
  );
};

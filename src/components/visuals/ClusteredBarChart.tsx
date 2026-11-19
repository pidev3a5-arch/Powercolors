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

  const axisColor = isDarkCanvas ? '#475569' : '#CBD5E1';
  const labelColor = isDarkCanvas ? '#94A3B8' : '#64748B';

  const chartWidth = 500;
  const chartHeight = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxValue = 1000;
  const groupWidth = innerWidth / CATEGORIES.length;
  const barWidth = (groupWidth * 0.7) / SERIES.length;

  return (
    <VisualContainer
      title="Revenue by Region & Segment"
      subtitle="Clustered Column Chart (Series 1–4)"
      isDarkCanvas={isDarkCanvas}
      fontFamily={fontFamily}
    >
      <div className="flex flex-col h-full space-y-2" style={{ fontFamily }}>
        {/* Interactive Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          {SERIES.map((s) => {
            const color = dataColors[s.colorIndex] || '#2563EB';
            return (
              <div key={s.name} className="flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-xs transition-colors"
                  style={{ backgroundColor: color }}
                />
                <span className={`font-medium text-[11px] ${isDarkCanvas ? 'text-slate-300' : 'text-slate-600'}`} style={{ fontFamily }}>
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
                    strokeDasharray="3 3"
                    strokeWidth="0.8"
                    opacity={0.5}
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="9"
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
              const groupX = padding.left + catIdx * groupWidth + (groupWidth * 0.15);

              return (
                <g key={cat.category}>
                  {/* Category X-Axis Label */}
                  <text
                    x={groupX + (groupWidth * 0.7) / 2}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill={labelColor}
                    fontWeight="600"
                    style={{ fontFamily }}
                  >
                    {cat.category}
                  </text>

                  {/* Individual Segment Bars */}
                  {cat.values.map((val, seriesIdx) => {
                    const barHeight = (val / maxValue) * innerHeight;
                    const barX = groupX + seriesIdx * barWidth;
                    const barY = padding.top + innerHeight - barHeight;
                    const color = dataColors[seriesIdx] || '#2563EB';

                    return (
                      <rect
                        key={seriesIdx}
                        x={barX}
                        y={barY}
                        width={barWidth - 2}
                        height={barHeight}
                        rx="2"
                        fill={color}
                        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
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

          {/* Interactive Tooltip Callout */}
          {hoveredPoint && (
            <div
              style={{ fontFamily }}
              className={`absolute top-2 right-2 px-2.5 py-1.5 rounded-lg text-xs border shadow-lg backdrop-blur-md pointer-events-none transition-all ${
                isDarkCanvas
                  ? 'bg-slate-950/90 border-slate-700 text-white'
                  : 'bg-white/95 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center space-x-1.5 font-bold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
                <span>{hoveredPoint.series}</span>
              </div>
              <div className="text-[11px] opacity-75">
                {hoveredPoint.category}: <span className="font-semibold">${hoveredPoint.value}k</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </VisualContainer>
  );
};

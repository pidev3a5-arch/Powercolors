import React, { useState } from 'react';
import { VisualContainer } from './VisualContainer';

interface LineTrendChartProps {
  dataColors: string[];
  isDarkCanvas: boolean;
  fontFamily?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const ACTUALS = [320, 410, 480, 530, 690, 780];
const BENCHMARK = [280, 340, 390, 460, 520, 610];

export const LineTrendChart: React.FC<LineTrendChartProps> = ({
  dataColors,
  isDarkCanvas,
  fontFamily,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const seriesColor1 = dataColors[0] || '#8B5CF6';
  const seriesColor2 = dataColors[4] || dataColors[1] || '#FBBF24';

  const axisColor = isDarkCanvas ? '#334155' : '#CBD5E1';
  const labelColor = isDarkCanvas ? '#94A3B8' : '#475569';

  const chartWidth = 500;
  const chartHeight = 220;
  const padding = { top: 20, right: 25, bottom: 35, left: 45 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const maxVal = 1000;

  const getX = (idx: number) => padding.left + (idx / (MONTHS.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxVal) * innerHeight;

  const createSmoothPath = (values: number[]) => {
    return values.reduce((acc, val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) return `M ${x} ${y}`;
      const prevX = getX(idx - 1);
      const prevY = getY(values[idx - 1]);
      const cx1 = prevX + (x - prevX) / 2;
      const cy1 = prevY;
      const cx2 = prevX + (x - prevX) / 2;
      const cy2 = y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }, '');
  };

  const pathActuals = createSmoothPath(ACTUALS);
  const pathBenchmark = createSmoothPath(BENCHMARK);
  const areaActuals = `${pathActuals} L ${getX(MONTHS.length - 1)} ${padding.top + innerHeight} L ${getX(0)} ${padding.top + innerHeight} Z`;

  return (
    <VisualContainer
      title="Monthly Sales Trajectory vs LY"
      subtitle="Multi-Line Trend (Series 1 & 5)"
      isDarkCanvas={isDarkCanvas}
      fontFamily={fontFamily}
    >
      <div className="flex flex-col h-full space-y-2.5" style={{ fontFamily }}>
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-1.5 rounded-full border border-[#1E293B]" style={{ backgroundColor: seriesColor1 }} />
            <span className="font-heading font-bold text-[11px] text-slate-700 dark:text-slate-300">
              2026 Actuals
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-1.5 border-t-2 border-dashed border-[#1E293B]" style={{ borderColor: seriesColor2 }} />
            <span className="font-heading font-bold text-[11px] text-slate-700 dark:text-slate-300">
              2025 Benchmark
            </span>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-[220px] overflow-visible"
          >
            <defs>
              <linearGradient id="actualsGradPlayful" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={seriesColor1} stopOpacity="0.25" />
                <stop offset="100%" stopColor={seriesColor1} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 250, 500, 750, 1000].map((val) => {
              const y = getY(val);
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

            {/* Area Fill for Actuals */}
            <path d={areaActuals} fill="url(#actualsGradPlayful)" />

            {/* Benchmark Line (Dashed) */}
            <path
              d={pathBenchmark}
              fill="none"
              stroke={seriesColor2}
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />

            {/* Actuals Line (Solid) */}
            <path
              d={pathActuals}
              fill="none"
              stroke={seriesColor1}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {MONTHS.map((month, idx) => {
              const x = getX(idx);
              const yActual = getY(ACTUALS[idx]);
              const yBench = getY(BENCHMARK[idx]);
              const isHovered = hoveredIdx === idx;

              return (
                <g key={month} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                  {/* Vertical Crosshair Line */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + innerHeight}
                      stroke="#1E293B"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Benchmark Point */}
                  <circle
                    cx={x}
                    cy={yBench}
                    r={isHovered ? 5 : 3.5}
                    fill={seriesColor2}
                    stroke="#1E293B"
                    strokeWidth="1.5"
                    className="transition-all"
                  />

                  {/* Actuals Point */}
                  <circle
                    cx={x}
                    cy={yActual}
                    r={isHovered ? 6.5 : 4.5}
                    fill={seriesColor1}
                    stroke="#1E293B"
                    strokeWidth="2"
                    className="transition-all cursor-pointer shadow-xs"
                  />

                  {/* X Axis Label */}
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill={labelColor}
                    fontWeight="800"
                    style={{ fontFamily }}
                  >
                    {month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIdx !== null && (
            <div
              style={{ fontFamily }}
              className="absolute top-2 right-2 px-3 py-2 rounded-xl text-xs border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white pointer-events-none transition-all"
            >
              <div className="font-heading font-extrabold border-b border-slate-200 dark:border-slate-800 pb-1 mb-1">
                {MONTHS[hoveredIdx]} Metrics
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-bold">
                <span className="w-2.5 h-2.5 rounded-full border border-[#1E293B]" style={{ backgroundColor: seriesColor1 }} />
                <span>Actuals:</span>
                <span className="font-extrabold text-[#8B5CF6]">${ACTUALS[hoveredIdx]}k</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full border border-[#1E293B]" style={{ backgroundColor: seriesColor2 }} />
                <span>Benchmark:</span>
                <span>${BENCHMARK[hoveredIdx]}k</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </VisualContainer>
  );
};

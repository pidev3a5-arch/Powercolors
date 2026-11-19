import React, { useState } from 'react';
import { VisualContainer } from './VisualContainer';

interface DonutChartProps {
  dataColors: string[];
  isDarkCanvas: boolean;
  fontFamily?: string;
}

interface SliceData {
  label: string;
  percentage: number;
}

const SLICES: SliceData[] = [
  { label: 'Direct Sales', percentage: 35 },
  { label: 'Partner Network', percentage: 25 },
  { label: 'Online Store', percentage: 18 },
  { label: 'Enterprise Reseller', percentage: 14 },
  { label: 'Referrals', percentage: 8 },
];

export const DonutChart: React.FC<DonutChartProps> = ({
  dataColors,
  isDarkCanvas,
  fontFamily,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<SliceData | null>(null);

  const size = 200;
  const center = size / 2;
  const outerRadius = 80;
  const innerRadius = 52;

  let accumulatedAngle = -90;

  const arcs = SLICES.map((slice, idx) => {
    const angle = (slice.percentage / 100) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + outerRadius * Math.cos(startRad);
    const y1 = center + outerRadius * Math.sin(startRad);
    const x2 = center + outerRadius * Math.cos(endRad);
    const y2 = center + outerRadius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    return {
      slice,
      pathData,
      color: dataColors[idx] || '#2563EB',
    };
  });

  return (
    <VisualContainer
      title="Sales Distribution by Channel"
      subtitle="Donut Breakdown (Series 1–5)"
      isDarkCanvas={isDarkCanvas}
      fontFamily={fontFamily}
    >
      <div className="flex flex-col sm:flex-row items-center justify-around h-full gap-4" style={{ fontFamily }}>
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
            {arcs.map((arc, idx) => {
              const isHovered = hoveredSlice?.label === arc.slice.label;
              return (
                <path
                  key={idx}
                  d={arc.pathData}
                  fill={arc.color}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                    filter: isHovered ? 'brightness(1.1)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredSlice(arc.slice)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span
              style={{ fontFamily }}
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDarkCanvas ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {hoveredSlice ? hoveredSlice.label : 'Total'}
            </span>
            <span
              style={{ fontFamily }}
              className={`text-base font-extrabold ${
                isDarkCanvas ? 'text-white' : 'text-slate-900'
              }`}
            >
              {hoveredSlice ? `${hoveredSlice.percentage}%` : '100%'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 w-full sm:w-auto">
          {SLICES.map((slice, idx) => {
            const color = dataColors[idx] || '#2563EB';
            const isHovered = hoveredSlice?.label === slice.label;

            return (
              <div
                key={slice.label}
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between space-x-3 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  isHovered ? (isDarkCanvas ? 'bg-slate-800' : 'bg-slate-100') : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    style={{ fontFamily }}
                    className={`text-[11px] font-medium ${
                      isDarkCanvas ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {slice.label}
                  </span>
                </div>
                <span
                  style={{ fontFamily }}
                  className={`text-[11px] font-mono font-bold ${
                    isDarkCanvas ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {slice.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </VisualContainer>
  );
};

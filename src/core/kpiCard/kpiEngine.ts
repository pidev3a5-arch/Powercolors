import { KpiCardConfig, KpiPolarity, KpiTrendDirection } from './types';

// Embedded vector icon paths (100% self-contained pure SVG, zero external runtime dependency)
export const KPI_ICONS: Record<string, string> = {
  TrendingUp: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>`,
  TrendingDown: `<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>`,
  DollarSign: `<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>`,
  Target: `<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>`,
  Award: `<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>`,
  Users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
  ShoppingCart: `<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>`,
  Zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>`,
  BarChart3: `<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>`,
  ShieldCheck: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path>`,
  Heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>`,
  Star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`,
  Flame: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>`,
  Clock: `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`,
  Cpu: `<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>`,
  Activity: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>`,
  Briefcase: `<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>`,
  Layers: `<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>`,
};

/**
 * Resolve badge fill & text color based on trend direction, polarity, and badge style
 */
export function resolveBadgeColors(
  direction: KpiTrendDirection,
  polarity: KpiPolarity,
  style: KpiCardConfig['badgeStyle'],
  customBg?: string,
  customText?: string
): { bg: string; text: string; border: string; arrow: string } {
  if (customBg && customText) {
    return { bg: customBg, text: customText, border: customText, arrow: direction === 'up' ? '▲' : direction === 'down' ? '▼' : '●' };
  }

  let isPositive = false;
  if (polarity === 'good-up') {
    isPositive = direction === 'up';
  } else if (polarity === 'good-down') {
    isPositive = direction === 'down';
  } else {
    isPositive = direction === 'up';
  }

  const isNeutral = direction === 'neutral' || polarity === 'neutral';

  const greenBg = '#DCFCE7';
  const greenText = '#15803D';
  const greenBorder = '#16A34A';

  const redBg = '#FEE2E2';
  const redText = '#B91C1C';
  const redBorder = '#DC2626';

  const neutralBg = '#F1F5F9';
  const neutralText = '#475569';
  const neutralBorder = '#94A3B8';

  let bg = isNeutral ? neutralBg : isPositive ? greenBg : redBg;
  let text = isNeutral ? neutralText : isPositive ? greenText : redText;
  let border = isNeutral ? neutralBorder : isPositive ? greenBorder : redBorder;

  if (style === 'solid') {
    bg = isNeutral ? '#64748B' : isPositive ? '#16A34A' : '#DC2626';
    text = '#FFFFFF';
    border = '#1E293B';
  } else if (style === 'outline') {
    bg = 'transparent';
  } else if (style === 'pill-minimal') {
    bg = isNeutral ? 'rgba(100, 116, 139, 0.12)' : isPositive ? 'rgba(22, 163, 74, 0.14)' : 'rgba(220, 38, 38, 0.14)';
    border = 'transparent';
  }

  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '●';
  return { bg, text, border, arrow };
}

/**
 * Generate smooth bezier curve path for Sparkline & Spark-area
 */
export function generateSparklinePaths(
  points: number[],
  width: number,
  height: number,
  padding = 6
): { linePath: string; areaPath: string; lastPoint: { x: number; y: number } } {
  if (!points || points.length < 2) {
    return { linePath: '', areaPath: '', lastPoint: { x: width / 2, y: height / 2 } };
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const w = width - padding * 2;
  const h = height - padding * 2;

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * w;
    const y = padding + h - ((p - min) / range) * h;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  });

  // Build smooth quadratic bezier curve
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const midX = (p0.x + p1.x) / 2;
    const midY = (p0.y + p1.y) / 2;
    if (i === 0) {
      d += ` Q ${p0.x} ${p0.y}, ${midX} ${midY}`;
    } else {
      d += ` Q ${p0.x} ${p0.y}, ${midX} ${midY}`;
    }
  }
  const last = coords[coords.length - 1];
  d += ` T ${last.x} ${last.y}`;

  const areaD = `${d} L ${last.x} ${height} L ${coords[0].x} ${height} Z`;

  return { linePath: d, areaPath: areaD, lastPoint: last };
}

/**
 * Generate stepped staircase path for Stepped-Area micro-chart
 */
export function generateSteppedPaths(
  points: number[],
  width: number,
  height: number,
  padding = 4
): { linePath: string; areaPath: string; lastPoint: { x: number; y: number } } {
  if (!points || points.length < 2) {
    return { linePath: '', areaPath: '', lastPoint: { x: width / 2, y: height / 2 } };
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const w = width - padding * 2;
  const h = height - padding * 2;
  const stepW = w / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = padding + i * stepW;
    const y = padding + h - ((p - min) / range) * h;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  });

  let lineD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    lineD += ` H ${coords[i].x} V ${coords[i].y}`;
  }

  const last = coords[coords.length - 1];
  const areaD = `${lineD} L ${last.x} ${height} L ${coords[0].x} ${height} Z`;

  return { linePath: lineD, areaPath: areaD, lastPoint: last };
}

/**
 * Pure SVG generator for a single KPI Card
 */
export function generateKpiCardSvg(config: KpiCardConfig): string {
  const {
    width,
    height,
    cornerRadius,
    borderWidth,
    borderColor,
    bgColor,
    showShadow,
    shadowOffset,
    shadowColor,
    styleVariant: _styleVariant,
    showAccentBar,
    accentBarPosition,
    accentBarColor,
    accentBarThickness,
    category,
    showCategory,
    categoryColor,
    categoryFontSize,
    categoryFontWeight,
    subtitle,
    showSubtitle,
    subtitleColor,
    value,
    unitSuffix,
    valueColor,
    valueFontSize,
    valueFontWeight,
    fontFamily,
    showTarget,
    targetLabel,
    targetValue,
    targetColor,
    showBadge,
    badgeText,
    trendDirection,
    polarity,
    badgeStyle,
    badgeBgColor,
    badgeTextColor,
    chartType,
    sparkPoints,
    sparkColor,
    sparkAreaOpacity,
    sparkStrokeWidth,
    showPulseDot,
    progressValue,
    progressMax,
    progressBarColor,
    showIcon,
    iconName,
    iconPosition,
    iconColor,
    iconBgColor,
    iconSize,
    iconBadge,
    customIconSvg,
  } = config;

  const cleanFont = (fontFamily || 'Outfit').replace(/['"]/g, '');
  const fontStack = `${cleanFont}, Segoe UI, sans-serif`;

  const hasShadow = showShadow !== false && shadowOffset > 0;
  const totalW = width + (hasShadow ? shadowOffset : 0);
  const totalH = height + (hasShadow ? shadowOffset : 0);

  const badgeTheme = resolveBadgeColors(trendDirection, polarity, badgeStyle, badgeBgColor, badgeTextColor);

  // Icon SVG definition
  const rawIconPath = customIconSvg || KPI_ICONS[iconName] || KPI_ICONS['TrendingUp'];

  // Calculate card layout coordinates
  const padLeft = 18;
  const padRight = 18;
  const padTop = 16;
  const contentWidth = width - padLeft - padRight;

  // Header & Category Row
  const catY = padTop + categoryFontSize;
  const subY = catY + 13;

  // Primary Callout Value Row
  const valY = (showCategory ? catY + (showSubtitle ? 20 : 12) : padTop + 14) + valueFontSize * 0.85;

  // Target & Comparison Row
  const targetY = valY + 18;

  // Micro-Chart Area
  const sparkW = Math.min(110, Math.round(contentWidth * 0.42));
  const sparkH = Math.min(46, Math.round(height * 0.4));
  const sparkX = width - padRight - sparkW;
  const sparkY = height - sparkH - 12;

  // Top-Right Icon positioning
  const iconBoxSize = iconBadge ? iconSize + 12 : iconSize;
  const iconX = width - padRight - iconBoxSize;
  const iconY = padTop - 2;

  // Radial progress calculations
  const ringRadius = 20;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringPct = Math.min(100, Math.max(0, (progressValue / (progressMax || 100)) * 100));
  const ringOffset = ringCircumference - (ringPct / 100) * ringCircumference;
  const ringCx = width - padRight - ringRadius - 4;
  const ringCy = height / 2 + 2;

  // Sparkline calculations
  const { linePath, areaPath, lastPoint } =
    chartType === 'sparkline' || chartType === 'sparkarea'
      ? generateSparklinePaths(sparkPoints, sparkW, sparkH, 4)
      : { linePath: '', areaPath: '', lastPoint: { x: 0, y: 0 } };

  // Glass/Modern gradient definitions
  const defs = `
    <defs>
      <linearGradient id="kpiAreaGrad_${config.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sparkColor}" stop-opacity="${sparkAreaOpacity}" />
        <stop offset="100%" stop-color="${sparkColor}" stop-opacity="0.0" />
      </linearGradient>
      <linearGradient id="kpiGlassGrad_${config.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.03" />
      </linearGradient>
      <clipPath id="cardClip_${config.id}">
        <rect x="0" y="0" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}" />
      </clipPath>
    </defs>
  `;

  // Shadow element (Neo-Pop hard drop shadow or flat)
  const shadowElement =
    hasShadow
      ? `<rect x="${shadowOffset}" y="${shadowOffset}" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${shadowColor}" />`
      : '';

  // Background rect
  const bgElement = `<rect x="0" y="0" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${bgColor}" stroke="${borderColor}" stroke-width="${borderWidth}" />`;

  // Accent bar element
  let accentBarElement = '';
  if (showAccentBar) {
    if (accentBarPosition === 'top') {
      accentBarElement = `<rect x="0" y="0" width="${width}" height="${accentBarThickness}" fill="${accentBarColor}" clip-path="url(#cardClip_${config.id})" />`;
    } else {
      accentBarElement = `<rect x="0" y="0" width="${accentBarThickness}" height="${height}" fill="${accentBarColor}" clip-path="url(#cardClip_${config.id})" />`;
    }
  }

  // Icon element
  let iconElement = '';
  if (showIcon && iconPosition === 'top-right') {
    if (iconBadge) {
      iconElement = `
        <g transform="translate(${iconX}, ${iconY})">
          <rect width="${iconBoxSize}" height="${iconBoxSize}" rx="${Math.round(iconBoxSize / 3.5)}" fill="${iconBgColor || '#F1F5F9'}" stroke="${borderColor}" stroke-width="${borderWidth > 0 ? 1.5 : 0}" />
          <g transform="translate(${(iconBoxSize - iconSize) / 2}, ${(iconBoxSize - iconSize) / 2}) scale(${iconSize / 24})" stroke="${iconColor}" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            ${rawIconPath}
          </g>
        </g>
      `;
    } else {
      iconElement = `
        <g transform="translate(${iconX + (iconBoxSize - iconSize)}, ${iconY + (iconBoxSize - iconSize) / 2}) scale(${iconSize / 24})" stroke="${iconColor}" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          ${rawIconPath}
        </g>
      `;
    }
  }

  // Category & Subtitle Text
  let categoryElement = '';
  if (showCategory && category) {
    const weightClass = categoryFontWeight === 'black' ? '900' : categoryFontWeight === 'bold' ? '700' : '600';
    categoryElement = `
      <text x="${padLeft}" y="${catY}" font-family="${fontStack}" font-size="${categoryFontSize}" font-weight="${weightClass}" fill="${categoryColor}" letter-spacing="0.05em">
        ${escapeXml(category.toUpperCase())}
      </text>
    `;
  }

  let subtitleElement = '';
  if (showSubtitle && subtitle) {
    subtitleElement = `
      <text x="${padLeft}" y="${subY}" font-family="${fontStack}" font-size="10.5" font-weight="500" fill="${subtitleColor}">
        ${escapeXml(subtitle)}
      </text>
    `;
  }

  // Primary Callout Metric (Value + Suffix)
  const valWeight = valueFontWeight === 'extrabold' ? '800' : valueFontWeight === 'black' ? '900' : '700';
  const valText = escapeXml(value);
  const suffixText = unitSuffix ? ` <tspan font-size="${Math.round(valueFontSize * 0.45)}" font-weight="600" fill="${categoryColor}">${escapeXml(unitSuffix)}</tspan>` : '';

  const valueElement = `
    <text x="${padLeft}" y="${valY}" font-family="${fontStack}" font-size="${valueFontSize}" font-weight="${valWeight}" fill="${valueColor}" letter-spacing="-0.03em">
      ${valText}${suffixText}
    </text>
  `;

  // Delta Variance Pill Badge
  let badgeElement = '';
  if (showBadge && badgeText) {
    const badgeW = 74;
    const badgeH = 21;
    // Align badge next to target or below value
    const badgeX = padLeft;
    const badgeY = (showTarget ? targetY + 6 : valY + 8);

    badgeElement = `
      <g transform="translate(${badgeX}, ${badgeY})">
        <rect width="${badgeW}" height="${badgeH}" rx="10.5" fill="${badgeTheme.bg}" stroke="${badgeTheme.border}" stroke-width="${badgeStyle === 'outline' ? 1.5 : 1}" />
        <text x="8" y="14" font-family="${fontStack}" font-size="9" fill="${badgeTheme.text}" font-weight="800">
          ${badgeTheme.arrow}
        </text>
        <text x="22" y="14" font-family="${fontStack}" font-size="10.5" font-weight="800" fill="${badgeTheme.text}">
          ${escapeXml(badgeText)}
        </text>
      </g>
    `;
  }

  // Target / Comparison Metric
  let targetElement = '';
  if (showTarget && targetValue) {
    const targetX = showBadge ? padLeft + 84 : padLeft;
    const tY = showBadge ? (showTarget ? targetY + 19 : valY + 22) : targetY;
    targetElement = `
      <text x="${targetX}" y="${tY}" font-family="${fontStack}" font-size="11" font-weight="600" fill="${targetColor}">
        <tspan fill="${categoryColor}">${escapeXml(targetLabel || 'Target')}:</tspan> ${escapeXml(targetValue)}
      </text>
    `;
  }

  // Micro-Chart Graphics
  let chartElement = '';
  if (chartType === 'sparkline' || chartType === 'sparkarea') {
    chartElement = `
      <g transform="translate(${sparkX}, ${sparkY})">
        ${chartType === 'sparkarea' ? `<path d="${areaPath}" fill="url(#kpiAreaGrad_${config.id})" />` : ''}
        <path d="${linePath}" fill="none" stroke="${sparkColor}" stroke-width="${sparkStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
        ${
          showPulseDot
            ? `
          <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="3.5" fill="${sparkColor}" stroke="#FFFFFF" stroke-width="1.5" />
          <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="6" fill="${sparkColor}" opacity="0.3" />
        `
            : ''
        }
      </g>
    `;
  } else if (chartType === 'bar-chart') {
    const points = sparkPoints && sparkPoints.length > 0 ? sparkPoints : [35, 55, 45, 70, 85, 95];
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points) || 1;
    const range = maxVal - minVal || 1;
    const count = points.length;
    const gap = 3;
    const barW = Math.max(4, Math.floor((sparkW - (count - 1) * gap) / count));
    const actualTotalW = count * barW + (count - 1) * gap;
    const offsetX = Math.max(0, Math.round((sparkW - actualTotalW) / 2));

    const bars = points
      .map((p, idx) => {
        const norm = (p - minVal) / range;
        const bH = Math.max(4, Math.round(norm * (sparkH - 6)));
        const bx = offsetX + idx * (barW + gap);
        const by = sparkH - bH;
        const isLast = idx === count - 1;
        const opacity = isLast ? '1' : '0.45';
        const fill = isLast ? sparkColor : sparkColor;
        return `<rect x="${bx}" y="${by}" width="${barW}" height="${bH}" rx="${Math.min(2, barW / 2)}" fill="${fill}" opacity="${opacity}" />`;
      })
      .join('\n');

    chartElement = `
      <g transform="translate(${sparkX}, ${sparkY})">
        ${bars}
      </g>
    `;
  } else if (chartType === 'stepped-area') {
    const { linePath: stepLine, areaPath: stepArea, lastPoint: stepLast } =
      generateSteppedPaths(sparkPoints, sparkW, sparkH, 4);
    chartElement = `
      <g transform="translate(${sparkX}, ${sparkY})">
        <path d="${stepArea}" fill="url(#kpiAreaGrad_${config.id})" />
        <path d="${stepLine}" fill="none" stroke="${sparkColor}" stroke-width="${sparkStrokeWidth}" stroke-linecap="square" />
        ${
          showPulseDot
            ? `
          <circle cx="${stepLast.x}" cy="${stepLast.y}" r="3.5" fill="${sparkColor}" stroke="#FFFFFF" stroke-width="1.5" />
          <circle cx="${stepLast.x}" cy="${stepLast.y}" r="6" fill="${sparkColor}" opacity="0.3" />
        `
            : ''
        }
      </g>
    `;
  } else if (chartType === 'semi-gauge') {
    const gaugeRadius = 24;
    const gaugeCx = width - padRight - gaugeRadius - 4;
    const gaugeCy = height - 16;
    const arcCircumference = Math.PI * gaugeRadius;
    const gaugePct = Math.min(100, Math.max(0, (progressValue / (progressMax || 100)) * 100));
    const gaugeOffset = arcCircumference - (gaugePct / 100) * arcCircumference;

    chartElement = `
      <g transform="translate(${gaugeCx}, ${gaugeCy})">
        <!-- Background Track Arc (180 deg) -->
        <path d="M -${gaugeRadius} 0 A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeRadius} 0" fill="none" stroke="${borderColor === '#1E293B' ? '#E2E8F0' : 'rgba(255,255,255,0.15)'}" stroke-width="5" stroke-linecap="round" />
        <!-- Progress Arc -->
        <path d="M -${gaugeRadius} 0 A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeRadius} 0" fill="none" stroke="${progressBarColor}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${arcCircumference}" stroke-dashoffset="${gaugeOffset}" />
        <!-- Center Value -->
        <text x="0" y="-3" font-family="${fontStack}" font-size="10.5" font-weight="800" fill="${valueColor}" text-anchor="middle">
          ${Math.round(gaugePct)}%
        </text>
        <text x="0" y="9" font-family="${fontStack}" font-size="7.5" font-weight="700" fill="${categoryColor}" text-anchor="middle" letter-spacing="0.05em">
          GAUGE
        </text>
      </g>
    `;
  } else if (chartType === 'lollipop') {
    const points = sparkPoints && sparkPoints.length > 0 ? sparkPoints : [30, 50, 45, 65, 80, 95];
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points) || 1;
    const range = maxVal - minVal || 1;
    const count = points.length;
    const stepX = (sparkW - 8) / (count - 1 || 1);

    const lollipops = points
      .map((p, idx) => {
        const norm = (p - minVal) / range;
        const headY = Math.round(sparkH - 6 - norm * (sparkH - 12));
        const cx = 4 + idx * stepX;
        const isLast = idx === count - 1;
        const opacity = isLast ? '1' : '0.5';
        return `
          <line x1="${cx}" y1="${sparkH}" x2="${cx}" y2="${headY}" stroke="${sparkColor}" stroke-width="1.8" opacity="${opacity}" />
          <circle cx="${cx}" cy="${headY}" r="${isLast ? 3.5 : 2.5}" fill="${sparkColor}" stroke="#FFFFFF" stroke-width="1" opacity="${opacity}" />
        `;
      })
      .join('\n');

    chartElement = `
      <g transform="translate(${sparkX}, ${sparkY})">
        <line x1="0" y1="${sparkH}" x2="${sparkW}" y2="${sparkH}" stroke="${borderColor === '#1E293B' ? '#CBD5E1' : 'rgba(255,255,255,0.2)'}" stroke-width="1" stroke-dasharray="2 2" />
        ${lollipops}
      </g>
    `;
  } else if (chartType === 'waffle') {
    const wafflePct = Math.min(100, Math.max(0, (progressValue / (progressMax || 100)) * 100));
    const filledCount = Math.min(10, Math.round((wafflePct / 100) * 10));
    const dotW = 9;
    const dotH = 9;
    const gap = 3;
    const waffleW = 5 * dotW + 4 * gap;
    const waffleH = 2 * dotH + 1 * gap;
    const waffleX = width - padRight - waffleW;
    const waffleY = height - waffleH - 14;

    const dots: string[] = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        const idx = row * 5 + col;
        const isFilled = idx < filledCount;
        const dx = col * (dotW + gap);
        const dy = row * (dotH + gap);
        const fill = isFilled ? progressBarColor : borderColor === '#1E293B' ? '#E2E8F0' : 'rgba(255,255,255,0.15)';
        dots.push(`<rect x="${dx}" y="${dy}" width="${dotW}" height="${dotH}" rx="2" fill="${fill}" />`);
      }
    }

    chartElement = `
      <g transform="translate(${waffleX}, ${waffleY})">
        <text x="${waffleW}" y="-4" font-family="${fontStack}" font-size="9" font-weight="800" fill="${valueColor}" text-anchor="end">
          ${Math.round(wafflePct)}%
        </text>
        ${dots.join('\n')}
      </g>
    `;
  } else if (chartType === 'progress-ring') {
    chartElement = `
      <g transform="translate(${ringCx}, ${ringCy})">
        <!-- Background Track -->
        <circle cx="0" cy="0" r="${ringRadius}" fill="none" stroke="${borderColor === '#1E293B' ? '#E2E8F0' : 'rgba(255,255,255,0.15)'}" stroke-width="5" />
        <!-- Progress Arc -->
        <circle cx="0" cy="0" r="${ringRadius}" fill="none" stroke="${progressBarColor}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${ringCircumference}" stroke-dashoffset="${ringOffset}" transform="rotate(-90)" />
        <text x="0" y="3.5" font-family="${fontStack}" font-size="10" font-weight="800" fill="${valueColor}" text-anchor="middle">
          ${Math.round(ringPct)}%
        </text>
      </g>
    `;
  } else if (chartType === 'progress-bar' || chartType === 'bullet') {
    const barW = Math.min(120, Math.round(contentWidth * 0.44));
    const barH = 8;
    const barX = width - padRight - barW;
    const barY = height - barH - 18;
    const fillW = Math.round((ringPct / 100) * barW);

    chartElement = `
      <g transform="translate(${barX}, ${barY})">
        <rect width="${barW}" height="${barH}" rx="${barH / 2}" fill="${borderColor === '#1E293B' ? '#E2E8F0' : 'rgba(255,255,255,0.15)'}" />
        <rect width="${fillW}" height="${barH}" rx="${barH / 2}" fill="${progressBarColor}" />
        ${
          chartType === 'bullet'
            ? `
          <!-- Target marker line (85% target benchmark) -->
          <line x1="${Math.round(barW * 0.85)}" y1="-3" x2="${Math.round(barW * 0.85)}" y2="${barH + 3}" stroke="${valueColor}" stroke-width="2.5" stroke-linecap="round" />
        `
            : ''
        }
        <text x="${barW}" y="-5" font-family="${fontStack}" font-size="9.5" font-weight="700" fill="${categoryColor}" text-anchor="end">
          ${Math.round(ringPct)}% OF GOAL
        </text>
      </g>
    `;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  ${defs}
  ${shadowElement}
  ${bgElement}
  ${accentBarElement}
  ${iconElement}
  ${categoryElement}
  ${subtitleElement}
  ${valueElement}
  ${badgeElement}
  ${targetElement}
  ${chartElement}
</svg>`.trim();
}

/**
 * Generate a multi-card executive scorecard banner combining multiple cards
 */
export function generateScorecardSvg(cards: KpiCardConfig[], gap = 16): string {
  if (!cards || cards.length === 0) return '';
  const totalW =
    cards.reduce(
      (acc, c, idx) =>
        acc +
        c.width +
        (c.showShadow !== false && c.shadowOffset > 0 ? c.shadowOffset : 0) +
        (idx > 0 ? gap : 0),
      0
    ) + 12;
  const maxH =
    Math.max(
      ...cards.map(
        (c) => c.height + (c.showShadow !== false && c.shadowOffset > 0 ? c.shadowOffset : 0)
      )
    ) + 12;

  let currentX = 0;
  const cardSvgs = cards.map((c) => {
    const svgInner = generateKpiCardSvg(c);
    const cardShadow = c.showShadow !== false && c.shadowOffset > 0 ? c.shadowOffset : 0;
    const g = `<g transform="translate(${currentX}, 0)">${svgInner}</g>`;
    currentX += c.width + cardShadow + gap;
    return g;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${maxH}" width="${totalW}" height="${maxH}">
  ${cardSvgs.join('\n')}
</svg>`.trim();
}

/**
 * Generate Power BI DAX Measure with Image URL encoding and dynamic calculation structure
 */
export function generateKpiDaxMeasure(config: KpiCardConfig): string {
  const measureName = config.name.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Executive KPI Card';
  const svg = generateKpiCardSvg(config);

  // Encode SVG for Power BI DAX Image URL
  // 1. Minify whitespace
  // 2. Replace double quotes with single quotes so DAX string literal doesn't break
  // 3. Replace '#' with '%23' so Power BI URL parser doesn't truncate at hex color hashes
  const cleanSvg = svg
    .replace(/\r?\n\s*/g, ' ')
    .replace(/"/g, "'")
    .replace(/#/g, '%23');

  return `
${measureName} = 
/*
  =============================================================================
  PowerLab KPI Studio — Production DAX Measure
  Card: ${config.name} (${config.styleVariant.toUpperCase()})
  Generated: ${new Date().toISOString()}

  HOW TO USE IN POWER BI DESKTOP:
  1. Create a new measure in your model and paste the DAX code below.
  2. Select the measure in the Fields pane.
  3. Under Measure tools > Properties, set "Data Category" to "Image URL".
  4. Add this measure to a Table, Matrix, or the New Card Visual (Image tab).
  =============================================================================
*/
VAR _CurrentValue = 1248500  // Replace with: [Your Actual Measure]
VAR _TargetValue  = 1150000  // Replace with: [Your Target Measure]
VAR _VariancePct  = DIVIDE( _CurrentValue - _TargetValue, _TargetValue, 0 )

// Dynamic variance badge color determination (using %23 for Power BI URL compatibility)
VAR _IsPositive = _VariancePct >= 0
VAR _BadgeBg    = IF( _IsPositive, "%23DCFCE7", "%23FEE2E2" )
VAR _BadgeText  = IF( _IsPositive, "%2315803D", "%23B91C1C" )
VAR _Arrow      = IF( _IsPositive, "▲", "▼" )
VAR _DeltaStr   = FORMAT( _VariancePct, "+0.0%;-0.0%;0.0%" )

// Formatted KPI Callout string
VAR _ValueStr   = FORMAT( _CurrentValue, "$#,##0" )

RETURN
    "data:image/svg+xml;utf8," & 
    "${cleanSvg}"
`.trim();
}

/**
 * Generate Power BI PBIR visualContainer snippet
 */
export function generateKpiPbirSnippet(config: KpiCardConfig): string {
  return JSON.stringify(
    {
      $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/1.4.0/schema.json',
      name: `KpiCard_${config.id}`,
      position: {
        x: 40,
        y: 40,
        width: config.width,
        height: config.height,
        z: 100,
      },
      visual: {
        visualType: 'image',
        objects: {
          general: [
            {
              properties: {
                imageUrl: {
                  expr: {
                    Measure: {
                      Expression: { SourceRef: { Entity: 'KeyMetrics' } },
                      Property: `${config.name.replace(/[^a-zA-Z0-9 ]/g, '')} SVG`,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    null,
    2
  );
}

/**
 * Download SVG file directly in the browser
 */
export function downloadKpiSvg(config: KpiCardConfig, filename?: string): void {
  const svg = generateKpiCardSvg(config);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (filename || `${config.name.toLowerCase().replace(/\s+/g, '_')}`).replace(/[^a-z0-9_-]/gi, '');
  a.href = url;
  a.download = `${safeName}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download high-res PNG file directly in the browser using HTML5 Canvas rasterization
 */
export async function downloadKpiPng(config: KpiCardConfig, filename?: string, scale = 2): Promise<void> {
  const svg = generateKpiCardSvg(config);
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const blobURL = URL.createObjectURL(svgBlob);

  const image = new Image();
  const canvas = document.createElement('canvas');
  const hasShadow = config.showShadow !== false && config.shadowOffset > 0;
  const totalW = (config.width + (hasShadow ? config.shadowOffset : 0)) * scale;
  const totalH = (config.height + (hasShadow ? config.shadowOffset : 0)) * scale;
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');

  await new Promise<void>((resolve, reject) => {
    image.onload = () => {
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, totalW, totalH);
      }
      resolve();
    };
    image.onerror = reject;
    image.src = blobURL;
  });

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to create PNG blob'));
    }, 'image/png');
  });

  const downloadUrl = URL.createObjectURL(pngBlob);
  const a = document.createElement('a');
  const safeName = (filename || `${config.name.toLowerCase().replace(/\s+/g, '_')}`).replace(/[^a-z0-9_-]/gi, '');
  a.href = downloadUrl;
  a.download = `${safeName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  URL.revokeObjectURL(blobURL);
}

/**
 * Helper to escape special XML characters
 */
function escapeXml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

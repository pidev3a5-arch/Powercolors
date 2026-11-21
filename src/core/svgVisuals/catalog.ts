import { SvgVisualDefinition, SvgCategoryInfo } from './types';
import { buildDaxMeasure } from './daxGenerator';

export const SVG_CATEGORIES: SvgCategoryInfo[] = [
  {
    id: 'all',
    label: 'All Visuals',
    description: 'Explore the full curated library of Power BI micro-visuals',
    iconName: 'LayoutGrid',
  },
  {
    id: 'kpi',
    label: 'KPI & Badges',
    description: 'Progress rings, checkpoint completion badges, and metric cards',
    iconName: 'Sparkles',
  },
  {
    id: 'gauge',
    label: 'Gauges & Dials',
    description: 'Track gauges, outline gauges with needles, and speedometers',
    iconName: 'Gauge',
  },
  {
    id: 'line',
    label: 'Lines & Sparklines',
    description: 'Trend sparklines with min/max dots, area fills, and comparisons',
    iconName: 'TrendingUp',
  },
  {
    id: 'bar',
    label: 'Bars & Bullets',
    description: 'IBCS bullet bars, data bars, and diverging variance charts',
    iconName: 'BarChart2',
  },
  {
    id: 'donut',
    label: 'Donuts & Radials',
    description: 'KPI doughnuts, segmented dials, and circular part-to-whole',
    iconName: 'PieChart',
  },
  {
    id: 'waffle',
    label: 'Waffles & Ratings',
    description: '10x10 waffle grids, star ratings, and boolean status badges',
    iconName: 'Grid',
  },
];

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export const SVG_VISUALS_CATALOG: SvgVisualDefinition[] = [
  // =========================================================================
  // 1. KPI & BADGES
  // =========================================================================
  {
    id: 'kpi-ring-progress',
    name: 'Circular Ring Progress',
    category: 'kpi',
    description: 'Circular progress ring with percentage callout, ideal for table and matrix status columns.',
    tags: ['ring', 'progress', 'circle', 'percentage', 'matrix', 'kpi'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 50, height: 50 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 60,
      recommendedHeight: 60,
      notes: 'Set Image Size to 50x50 in Table/Matrix format settings. Perfect for monthly status grids.',
    },
    params: [
      { id: 'actual', label: 'Actual Value (%)', type: 'number', defaultValue: 75, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Progress Color', type: 'color', defaultValue: '#84CC16', daxVarName: '_Color' },
      { id: 'trackColor', label: 'Track Color', type: 'color', defaultValue: '#E2E8F0', daxVarName: '_TrackColor' },
      { id: 'strokeWidth', label: 'Ring Thickness', type: 'number', defaultValue: 10, min: 4, max: 20, step: 1, daxVarName: '_Thickness' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 75), 0, 100);
      const color = params.color || '#84CC16';
      const trackColor = params.trackColor || '#E2E8F0';
      const strokeWidth = Number(params.strokeWidth ?? 10);
      const r = 38;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - actual / 100);
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${trackColor}' stroke-width='${strokeWidth}' />
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${color}' stroke-width='${strokeWidth}' stroke-dasharray='${c.toFixed(2)}' stroke-dashoffset='${offset.toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='22' font-weight='800' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Ring_Progress') => {
      return buildDaxMeasure({
        measureName,
        description: 'Circular ring progress metric with percentage callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 75, type: 'number', comment: 'Replace with [Achievement %] or model measure' },
          { name: '_Color', value: params.color || '#84CC16', type: 'color', comment: 'Progress ring color' },
          { name: '_TrackColor', value: params.trackColor || '#E2E8F0', type: 'color', comment: 'Background ring track' },
          { name: '_Thickness', value: params.strokeWidth ?? 10, type: 'number', comment: 'Ring stroke thickness' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )', comment: 'Clamp percentage between 0 and 1' },
          { name: '_Radius', expression: '38' },
          { name: '_Circumference', expression: '2 * PI() * _Radius' },
          { name: '_DashOffset', expression: '_Circumference * ( 1 - _Normalized )' },
          { name: '_Label', expression: 'FORMAT( _Actual, "0" ) & "%"' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'" & _TrackColor & "\' stroke-width=\'" & _Thickness & "\'/>"' },
          { name: '_Arc', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'" & _Thickness & "\' stroke-dasharray=\'" & ROUND( _Circumference, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
          { name: '_Text', expression: '"<text x=\'50\' y=\'57\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'22\' font-weight=\'800\' fill=\'#1E293B\'>" & _Label & "</text>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'kpi-ring-checkpoint',
    name: 'Ring with 100% Checkmark',
    category: 'kpi',
    description: 'Shows percentage ring progress, and switches to a solid filled badge with checkmark when 100% complete.',
    tags: ['checkpoint', 'checkmark', 'completion', 'done', 'ring', 'matrix'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 50, height: 50 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 50,
      recommendedHeight: 50,
      notes: 'Direct implementation from user matrix reference. When score reaches 100%, turns into solid checkmark badge.',
    },
    params: [
      { id: 'actual', label: 'Completion (%)', type: 'number', defaultValue: 100, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Active Color', type: 'color', defaultValue: '#84CC16', daxVarName: '_Color' },
      { id: 'trackColor', label: 'Track Color', type: 'color', defaultValue: '#E2E8F0', daxVarName: '_TrackColor' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 100), 0, 100);
      const color = params.color || '#84CC16';
      const trackColor = params.trackColor || '#E2E8F0';
      const isComplete = actual >= 100;
      const r = 38;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - actual / 100);

      if (isComplete) {
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='42' fill='${color}' />
  <path d='M33 50 L45 62 L67 38' fill='none' stroke='#FFFFFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round' />
</svg>`;
      }

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${trackColor}' stroke-width='10' />
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${color}' stroke-width='10' stroke-dasharray='${c.toFixed(2)}' stroke-dashoffset='${offset.toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='22' font-weight='800' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Ring_With_Checkmark') => {
      return buildDaxMeasure({
        measureName,
        description: 'Circular progress ring that transforms into a solid checkmark badge upon 100% completion.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 100, type: 'number', comment: 'Actual completion percentage (0-100)' },
          { name: '_Color', value: params.color || '#84CC16', type: 'color', comment: 'Active progress / checkmark badge color' },
          { name: '_TrackColor', value: params.trackColor || '#E2E8F0', type: 'color', comment: 'Track background color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_IsComplete', expression: '_Actual >= 100' },
          { name: '_Radius', expression: '38' },
          { name: '_Circumference', expression: '2 * PI() * _Radius' },
          { name: '_DashOffset', expression: '_Circumference * ( 1 - _Normalized )' },
        ],
        svgElements: [
          {
            name: '_Content',
            expression: `IF(
        _IsComplete,
        "<circle cx='50' cy='50' r='42' fill='" & _Color & "'/>" &
        "<path d='M33 50 L45 62 L67 38' fill='none' stroke='#FFFFFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/>",
        "<circle cx='50' cy='50' r='" & _Radius & "' fill='none' stroke='" & _TrackColor & "' stroke-width='10'/>" &
        "<circle cx='50' cy='50' r='" & _Radius & "' fill='none' stroke='" & _Color & "' stroke-width='10' stroke-dasharray='" & ROUND( _Circumference, 2 ) & "' stroke-dashoffset='" & ROUND( _DashOffset, 2 ) & "' stroke-linecap='round' transform='rotate(-90 50 50)'/>" &
        "<text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='22' font-weight='800' fill='#1E293B'>" & FORMAT( _Actual, "0" ) & "%</text>"
    )`,
            comment: 'Switches between circular progress ring and checkmark badge',
          },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'kpi-ring-alert-tiers',
    name: 'Traffic-Light Progress Ring',
    category: 'kpi',
    description: 'Ring progress with dynamic alert thresholds: Green (>=80%), Amber/Yellow (50-79%), Red (<50%).',
    tags: ['alert', 'traffic-light', 'threshold', 'red', 'yellow', 'green', 'ring'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 50, height: 50 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 50,
      recommendedHeight: 50,
      notes: 'Matches the multi-color row states from reference image 1.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 30, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'greenColor', label: 'Good Color (>=80%)', type: 'color', defaultValue: '#84CC16', daxVarName: '_ColorGood' },
      { id: 'yellowColor', label: 'Warning Color (>=50%)', type: 'color', defaultValue: '#EAB308', daxVarName: '_ColorWarn' },
      { id: 'redColor', label: 'Critical Color (<50%)', type: 'color', defaultValue: '#EF4444', daxVarName: '_ColorCrit' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 30), 0, 100);
      const green = params.greenColor || '#84CC16';
      const yellow = params.yellowColor || '#EAB308';
      const red = params.redColor || '#EF4444';
      const activeColor = actual >= 80 ? green : actual >= 50 ? yellow : red;
      const r = 38;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - actual / 100);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='#E2E8F0' stroke-width='10' />
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${activeColor}' stroke-width='10' stroke-dasharray='${c.toFixed(2)}' stroke-dashoffset='${offset.toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='22' font-weight='800' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Alert_Progress_Ring') => {
      return buildDaxMeasure({
        measureName,
        description: 'Traffic-light conditional progress ring with automatic 3-tier color coding.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 30, type: 'number' },
          { name: '_ColorGood', value: params.greenColor || '#84CC16', type: 'color' },
          { name: '_ColorWarn', value: params.yellowColor || '#EAB308', type: 'color' },
          { name: '_ColorCrit', value: params.redColor || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_ActiveColor', expression: 'SWITCH( TRUE(), _Actual >= 80, _ColorGood, _Actual >= 50, _ColorWarn, _ColorCrit )' },
          { name: '_Radius', expression: '38' },
          { name: '_Circumference', expression: '2 * PI() * _Radius' },
          { name: '_DashOffset', expression: '_Circumference * ( 1 - _Normalized )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'#E2E8F0\' stroke-width=\'10\'/>"' },
          { name: '_Arc', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'" & _ActiveColor & "\' stroke-width=\'10\' stroke-dasharray=\'" & ROUND( _Circumference, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
          { name: '_Text', expression: '"<text x=\'50\' y=\'57\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'22\' font-weight=\'800\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'kpi-card-metric',
    name: 'Metric Callout with Delta Arrow',
    category: 'kpi',
    description: 'Formatted callout metric with positive/negative trend arrow and percentage variance badge.',
    tags: ['card', 'callout', 'delta', 'variance', 'arrow', 'kpi'],
    viewBox: '0 0 120 45',
    recommendedDimensions: { width: 120, height: 45 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 120,
      recommendedHeight: 45,
      notes: 'Inspired by Image 4 Basic Card III (e.g. ↓ 4.3% vs Prior Year).',
    },
    params: [
      { id: 'value', label: 'Primary Value', type: 'text', defaultValue: '$1,482K', daxVarName: '_Metric' },
      { id: 'delta', label: 'Delta (%)', type: 'number', defaultValue: 12.4, step: 0.1, daxVarName: '_DeltaPct' },
      { id: 'subtext', label: 'Context Label', type: 'text', defaultValue: 'vs Target', daxVarName: '_Subtext' },
      { id: 'positiveColor', label: 'Positive Color', type: 'color', defaultValue: '#10B981', daxVarName: '_PosColor' },
      { id: 'negativeColor', label: 'Negative Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_NegColor' },
    ],
    renderSvg: (params) => {
      const value = String(params.value ?? '$1,482K');
      const delta = Number(params.delta ?? 12.4);
      const subtext = String(params.subtext ?? 'vs Target');
      const isPos = delta >= 0;
      const deltaColor = isPos ? (params.positiveColor || '#10B981') : (params.negativeColor || '#EF4444');
      const arrow = isPos ? '▲' : '▼';
      const deltaStr = `${arrow} ${Math.abs(delta).toFixed(1)}% ${subtext}`;

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 45' width='100%' height='100%'>
  <text x='5' y='20' font-family='Segoe UI, sans-serif' font-size='18' font-weight='900' fill='#1E293B'>${value}</text>
  <text x='5' y='36' font-family='Segoe UI, sans-serif' font-size='10.5' font-weight='700' fill='${deltaColor}'>${deltaStr}</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Metric_Callout_Delta') => {
      return buildDaxMeasure({
        measureName,
        description: 'Metric callout with dynamic delta arrow and colored percentage variance.',
        configVars: [
          { name: '_MetricValue', value: params.value ?? '$1,482K', type: 'text', comment: 'Replace with FORMAT([Sales], "$#,##0K")' },
          { name: '_DeltaPct', value: params.delta ?? 12.4, type: 'number', comment: 'Replace with [Sales YoY %]' },
          { name: '_Subtext', value: params.subtext ?? 'vs Target', type: 'text' },
          { name: '_PosColor', value: params.positiveColor || '#10B981', type: 'color' },
          { name: '_NegColor', value: params.negativeColor || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_IsPositive', expression: '_DeltaPct >= 0' },
          { name: '_Color', expression: 'IF( _IsPositive, _PosColor, _NegColor )' },
          { name: '_Arrow', expression: 'IF( _IsPositive, "▲", "▼" )' },
          { name: '_DeltaFormatted', expression: '_Arrow & " " & FORMAT( ABS( _DeltaPct ), "0.0%" ) & " " & _Subtext' },
        ],
        svgElements: [
          { name: '_ValueText', expression: '"<text x=\'5\' y=\'20\' font-family=\'Segoe UI, sans-serif\' font-size=\'18\' font-weight=\'900\' fill=\'#1E293B\'>" & _MetricValue & "</text>"' },
          { name: '_DeltaText', expression: '"<text x=\'5\' y=\'36\' font-family=\'Segoe UI, sans-serif\' font-size=\'10.5\' font-weight=\'700\' fill=\'" & _Color & "\'>" & _DeltaFormatted & "</text>"' },
        ],
        viewBox: '0 0 120 45',
      });
    },
  },

  {
    id: 'kpi-pill-badge',
    name: 'Status Pill Badge',
    category: 'kpi',
    description: 'Compact rounded pill badge with status indicator dot and category label for matrix cells.',
    tags: ['pill', 'badge', 'status', 'tag', 'kpi'],
    viewBox: '0 0 100 28',
    recommendedDimensions: { width: 100, height: 28 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 90,
      recommendedHeight: 28,
      notes: 'Based on Kurt Buhler / Data Goblins status pill pattern for category tagging.',
    },
    params: [
      { id: 'label', label: 'Badge Label', type: 'text', defaultValue: 'Active', daxVarName: '_Label' },
      { id: 'color', label: 'Badge Color', type: 'color', defaultValue: '#10B981', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const label = String(params.label ?? 'Active');
      const color = params.color || '#10B981';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 28' width='100%' height='100%'>
  <rect x='2' y='2' width='96' height='24' rx='12' fill='${color}' fill-opacity='0.15' stroke='${color}' stroke-width='1.5' />
  <circle cx='14' cy='14' r='4' fill='${color}' />
  <text x='25' y='18' font-family='Segoe UI, sans-serif' font-size='11' font-weight='800' fill='${color}'>${label}</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Status_Pill') => {
      return buildDaxMeasure({
        measureName,
        description: 'Rounded status pill badge with indicator dot.',
        configVars: [
          { name: '_Label', value: params.label ?? 'Active', type: 'text', comment: 'Replace with status column or measure' },
          { name: '_Color', value: params.color || '#10B981', type: 'color', comment: 'Status badge theme color' },
        ],
        svgElements: [
          { name: '_BgPill', expression: '"<rect x=\'2\' y=\'2\' width=\'96\' height=\'24\' rx=\'12\' fill=\'" & _Color & "\' fill-opacity=\'0.15\' stroke=\'" & _Color & "\' stroke-width=\'1.5\'/>"' },
          { name: '_Dot', expression: '"<circle cx=\'14\' cy=\'14\' r=\'4\' fill=\'" & _Color & "\'/>"' },
          { name: '_Text', expression: '"<text x=\'25\' y=\'18\' font-family=\'Segoe UI, sans-serif\' font-size=\'11\' font-weight=\'800\' fill=\'" & _Color & "\'>" & _Label & "</text>"' },
        ],
        viewBox: '0 0 100 28',
      });
    },
  },

  // =========================================================================
  // 2. GAUGES & DIALS (Direct Match to User References 2 & 3)
  // =========================================================================
  {
    id: 'gauge-with-track',
    name: 'Gauge with Track',
    category: 'gauge',
    description: 'Semicircular arc gauge with a background track, progress fill arc, and bold percentage callout below. Matches reference image 2 & 3 column 1.',
    tags: ['gauge', 'track', 'arc', 'semicircle', 'percentage', 'reference'],
    viewBox: '0 0 100 65',
    recommendedDimensions: { width: 100, height: 65 },
    pbiTips: {
      visualType: 'Table / Matrix / Card',
      recommendedWidth: 90,
      recommendedHeight: 60,
      notes: 'Matches user reference image (Apples 40%, Bananas 55%, Carrots 80%). Use in table matrix cells.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 55, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Arc Color', type: 'color', defaultValue: '#FACC15', daxVarName: '_Color' },
      { id: 'trackColor', label: 'Track Color', type: 'color', defaultValue: '#E2E8F0', daxVarName: '_TrackColor' },
      { id: 'thickness', label: 'Arc Thickness', type: 'number', defaultValue: 10, min: 4, max: 16, step: 1, daxVarName: '_Thickness' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 55), 0, 100);
      const color = params.color || '#FACC15';
      const trackColor = params.trackColor || '#E2E8F0';
      const thickness = Number(params.thickness ?? 10);
      const r = 36;
      const arcLength = Math.PI * r;
      const fillOffset = arcLength * (1 - actual / 100);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 65' width='100%' height='100%'>
  <!-- Background Track Arc -->
  <path d='M 14,48 A 36 36 0 0 1 86,48' fill='none' stroke='${trackColor}' stroke-width='${thickness}' stroke-linecap='round' />
  <!-- Progress Fill Arc -->
  <path d='M 14,48 A 36 36 0 0 1 86,48' fill='none' stroke='${color}' stroke-width='${thickness}' stroke-dasharray='${arcLength.toFixed(2)}' stroke-dashoffset='${fillOffset.toFixed(2)}' stroke-linecap='round' />
  <!-- Center Percentage Text -->
  <text x='50' y='60' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='17' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Gauge_With_Track') => {
      return buildDaxMeasure({
        measureName,
        description: 'Semicircular gauge with background track and bold percentage callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 55, type: 'number', comment: 'Actual percentage (0 to 100)' },
          { name: '_Color', value: params.color || '#FACC15', type: 'color', comment: 'Fill arc color (e.g. #EF4444 for 40%, #FACC15 for 55%, #6366F1 for 80%)' },
          { name: '_TrackColor', value: params.trackColor || '#E2E8F0', type: 'color', comment: 'Track background color' },
          { name: '_Thickness', value: params.thickness ?? 10, type: 'number' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_Radius', expression: '36' },
          { name: '_ArcLength', expression: 'PI() * _Radius' },
          { name: '_DashOffset', expression: '_ArcLength * ( 1 - _Normalized )' },
          { name: '_Text', expression: 'FORMAT( _Actual, "0" ) & "%"' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<path d=\'M 14,48 A 36 36 0 0 1 86,48\' fill=\'none\' stroke=\'" & _TrackColor & "\' stroke-width=\'" & _Thickness & "\' stroke-linecap=\'round\'/>"' },
          { name: '_Fill', expression: '"<path d=\'M 14,48 A 36 36 0 0 1 86,48\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'" & _Thickness & "\' stroke-dasharray=\'" & ROUND( _ArcLength, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\'/>"' },
          { name: '_Label', expression: '"<text x=\'50\' y=\'60\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'17\' font-weight=\'900\' fill=\'#1E293B\'>" & _Text & "</text>"' },
        ],
        viewBox: '0 0 100 65',
      });
    },
  },

  {
    id: 'gauge-with-outline-needle',
    name: 'Gauge with Outline & Needle',
    category: 'gauge',
    description: 'Semicircular gauge with outer rim outline, progress shaded sector, dynamic pointer needle, and centered percentage. Matches reference image 2 & 3 column 2.',
    tags: ['gauge', 'needle', 'outline', 'dial', 'semicircle', 'pointer', 'reference'],
    viewBox: '0 0 100 68',
    recommendedDimensions: { width: 100, height: 68 },
    pbiTips: {
      visualType: 'Table / Matrix / Card',
      recommendedWidth: 90,
      recommendedHeight: 65,
      notes: 'Direct match to Gauge with Outline from reference image. Needle dynamically rotates according to actual value.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 55, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Progress Fill Color', type: 'color', defaultValue: '#FEF08A', daxVarName: '_Color' },
      { id: 'outlineColor', label: 'Outline Rim Color', type: 'color', defaultValue: '#64748B', daxVarName: '_RimColor' },
      { id: 'needleColor', label: 'Needle Color', type: 'color', defaultValue: '#0F172A', daxVarName: '_NeedleColor' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 55), 0, 100);
      const color = params.color || '#FEF08A';
      const outlineColor = params.outlineColor || '#64748B';
      const needleColor = params.needleColor || '#0F172A';
      const r = 36;
      const arcLength = Math.PI * r;
      const fillOffset = arcLength * (1 - actual / 100);

      const angleRad = (180 - actual * 1.8) * (Math.PI / 180);
      const needleLength = 38;
      const nx = 50 + needleLength * Math.cos(angleRad);
      const ny = 50 - needleLength * Math.sin(angleRad);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 68' width='100%' height='100%'>
  <!-- Outer Outline Rim -->
  <path d='M 14,50 A 36 36 0 0 1 86,50' fill='none' stroke='${outlineColor}' stroke-width='3.5' stroke-linecap='round' />
  <!-- Tinted Shaded Sector -->
  <path d='M 14,50 A 36 36 0 0 1 86,50' fill='none' stroke='${color}' stroke-width='10' stroke-dasharray='${arcLength.toFixed(2)}' stroke-dashoffset='${fillOffset.toFixed(2)}' stroke-linecap='round' opacity='0.7' />
  <!-- Center Needle Pointer -->
  <line x1='50' y1='50' x2='${nx.toFixed(1)}' y2='${ny.toFixed(1)}' stroke='${needleColor}' stroke-width='2.5' stroke-linecap='round' />
  <circle cx='50' cy='50' r='3.5' fill='${needleColor}' />
  <!-- Centered Percentage Text -->
  <text x='50' y='64' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='15' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Gauge_With_Outline') => {
      return buildDaxMeasure({
        measureName,
        description: 'Semicircular gauge with outline rim, tinted progress sector, dynamic needle, and percentage callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 55, type: 'number', comment: 'Actual score percentage (0-100)' },
          { name: '_Color', value: params.color || '#FEF08A', type: 'color', comment: 'Tinted sector color' },
          { name: '_RimColor', value: params.outlineColor || '#64748B', type: 'color', comment: 'Outer rim outline color' },
          { name: '_NeedleColor', value: params.needleColor || '#0F172A', type: 'color', comment: 'Needle indicator color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_Radius', expression: '36' },
          { name: '_ArcLength', expression: 'PI() * _Radius' },
          { name: '_DashOffset', expression: '_ArcLength * ( 1 - _Normalized )' },
          { name: '_AngleRad', expression: '( 180 - ( _Normalized * 180 ) ) * ( PI() / 180 )' },
          { name: '_NeedleX', expression: 'ROUND( 50 + 38 * COS( _AngleRad ), 1 )' },
          { name: '_NeedleY', expression: 'ROUND( 50 - 38 * SIN( _AngleRad ), 1 )' },
          { name: '_Text', expression: 'FORMAT( _Actual, "0" ) & "%"' },
        ],
        svgElements: [
          { name: '_Rim', expression: '"<path d=\'M 14,50 A 36 36 0 0 1 86,50\' fill=\'none\' stroke=\'" & _RimColor & "\' stroke-width=\'3.5\' stroke-linecap=\'round\'/>"' },
          { name: '_Sector', expression: '"<path d=\'M 14,50 A 36 36 0 0 1 86,50\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'10\' stroke-dasharray=\'" & ROUND( _ArcLength, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\' opacity=\'0.7\'/>"' },
          { name: '_Needle', expression: '"<line x1=\'50\' y1=\'50\' x2=\'" & _NeedleX & "\' y2=\'" & _NeedleY & "\' stroke=\'" & _NeedleColor & "\' stroke-width=\'2.5\' stroke-linecap=\'round\'/><circle cx=\'50\' cy=\'50\' r=\'3.5\' fill=\'" & _NeedleColor & "\'/>"' },
          { name: '_Label', expression: '"<text x=\'50\' y=\'64\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'15\' font-weight=\'900\' fill=\'#1E293B\'>" & _Text & "</text>"' },
        ],
        viewBox: '0 0 100 68',
      });
    },
  },

  {
    id: 'gauge-kpi-target',
    name: 'KPI Target Gauge',
    category: 'gauge',
    description: 'Half-dial KPI gauge with progress arc and benchmark target tick line. Inspired by Image 4 KPI Gauge.',
    tags: ['gauge', 'target', 'benchmark', 'kpi', 'claims'],
    viewBox: '0 0 120 70',
    recommendedDimensions: { width: 120, height: 70 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 120,
      recommendedHeight: 70,
      notes: 'Inspired by KPI Gauge in Image 4. Features target benchmark marker and contextual subtitle.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 40, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'target', label: 'Target (%)', type: 'number', defaultValue: 53, min: 0, max: 100, step: 1, daxVarName: '_Target' },
      { id: 'color', label: 'Progress Color', type: 'color', defaultValue: '#38BDF8', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 40), 0, 100);
      const target = clamp(Number(params.target ?? 53), 0, 100);
      const color = params.color || '#38BDF8';
      const r = 40;
      const arcLength = Math.PI * r;
      const fillOffset = arcLength * (1 - actual / 100);

      const targetRad = (180 - target * 1.8) * (Math.PI / 180);
      const tx1 = 60 + 32 * Math.cos(targetRad);
      const ty1 = 54 - 32 * Math.sin(targetRad);
      const tx2 = 60 + 48 * Math.cos(targetRad);
      const ty2 = 54 - 48 * Math.sin(targetRad);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 70' width='100%' height='100%'>
  <path d='M 20,54 A 40 40 0 0 1 100,54' fill='none' stroke='#F1F5F9' stroke-width='12' stroke-linecap='round' />
  <path d='M 20,54 A 40 40 0 0 1 100,54' fill='none' stroke='${color}' stroke-width='12' stroke-dasharray='${arcLength.toFixed(2)}' stroke-dashoffset='${fillOffset.toFixed(2)}' stroke-linecap='round' />
  <line x1='${tx1.toFixed(1)}' y1='${ty1.toFixed(1)}' x2='${tx2.toFixed(1)}' y2='${ty2.toFixed(1)}' stroke='#1E293B' stroke-width='2.5' />
  <text x='60' y='50' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='16' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
  <text x='60' y='65' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='9' font-weight='700' fill='#64748B'>Target ${Math.round(target)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_KPI_Target_Gauge') => {
      return buildDaxMeasure({
        measureName,
        description: 'Half-dial KPI gauge with progress arc and benchmark target tick line.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 40, type: 'number', comment: 'Replace with [Actual %]' },
          { name: '_Target', value: params.target ?? 53, type: 'number', comment: 'Replace with [Target %]' },
          { name: '_Color', value: params.color || '#38BDF8', type: 'color' },
        ],
        calcVars: [
          { name: '_NormActual', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_NormTarget', expression: 'MIN( 1, MAX( 0, DIVIDE( _Target, 100, 0 ) ) )' },
          { name: '_Radius', expression: '40' },
          { name: '_ArcLength', expression: 'PI() * _Radius' },
          { name: '_DashOffset', expression: '_ArcLength * ( 1 - _NormActual )' },
          { name: '_TargetRad', expression: '( 180 - ( _NormTarget * 180 ) ) * ( PI() / 180 )' },
          { name: '_TX1', expression: 'ROUND( 60 + 32 * COS( _TargetRad ), 1 )' },
          { name: '_TY1', expression: 'ROUND( 54 - 32 * SIN( _TargetRad ), 1 )' },
          { name: '_TX2', expression: 'ROUND( 60 + 48 * COS( _TargetRad ), 1 )' },
          { name: '_TY2', expression: 'ROUND( 54 - 48 * SIN( _TargetRad ), 1 )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<path d=\'M 20,54 A 40 40 0 0 1 100,54\' fill=\'none\' stroke=\'#F1F5F9\' stroke-width=\'12\' stroke-linecap=\'round\'/>"' },
          { name: '_Fill', expression: '"<path d=\'M 20,54 A 40 40 0 0 1 100,54\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'12\' stroke-dasharray=\'" & ROUND( _ArcLength, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\'/>"' },
          { name: '_TargetTick', expression: '"<line x1=\'" & _TX1 & "\' y1=\'" & _TY1 & "\' x2=\'" & _TX2 & "\' y2=\'" & _TY2 & "\' stroke=\'#1E293B\' stroke-width=\'2.5\'/>"' },
          { name: '_Labels', expression: '"<text x=\'60\' y=\'50\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'16\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text><text x=\'60\' y=\'65\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'9\' font-weight=\'700\' fill=\'#64748B\'>Target " & FORMAT( _Target, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 120 70',
      });
    },
  },

  {
    id: 'gauge-speedometer',
    name: 'Radial Speedometer Gauge',
    category: 'gauge',
    description: 'Classic speedometer with calibrated radial tick marks, colored arc zones, and rotating pointer needle.',
    tags: ['speedometer', 'gauge', 'dial', 'ticks', 'needle'],
    viewBox: '0 0 100 70',
    recommendedDimensions: { width: 100, height: 70 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 90,
      recommendedHeight: 65,
      notes: 'Includes calibrated radial tick marks for executive dashboards.',
    },
    params: [
      { id: 'actual', label: 'Actual Value', type: 'number', defaultValue: 72, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Needle & Accent Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 72), 0, 100);
      const color = params.color || '#8B5CF6';
      const angleRad = (180 - actual * 1.8) * (Math.PI / 180);
      const nx = 50 + 34 * Math.cos(angleRad);
      const ny = 52 - 34 * Math.sin(angleRad);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 70' width='100%' height='100%'>
  <path d='M 15,52 A 35 35 0 0 1 35,21' fill='none' stroke='#EF4444' stroke-width='4' />
  <path d='M 35,21 A 35 35 0 0 1 65,21' fill='none' stroke='#EAB308' stroke-width='4' />
  <path d='M 65,21 A 35 35 0 0 1 85,52' fill='none' stroke='#10B981' stroke-width='4' />
  <line x1='15' y1='52' x2='20' y2='52' stroke='#94A3B8' stroke-width='1.5' />
  <line x1='50' y1='17' x2='50' y2='22' stroke='#94A3B8' stroke-width='1.5' />
  <line x1='85' y1='52' x2='80' y2='52' stroke='#94A3B8' stroke-width='1.5' />
  <line x1='50' y1='52' x2='${nx.toFixed(1)}' y2='${ny.toFixed(1)}' stroke='${color}' stroke-width='2.5' stroke-linecap='round' />
  <circle cx='50' cy='52' r='4' fill='#1E293B' />
  <text x='50' y='66' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='14' font-weight='900' fill='#1E293B'>${Math.round(actual)}</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Radial_Speedometer') => {
      return buildDaxMeasure({
        measureName,
        description: 'Speedometer gauge with calibrated 3-zone color sectors and rotating pointer.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 72, type: 'number' },
          { name: '_Color', value: params.color || '#8B5CF6', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_AngleRad', expression: '( 180 - ( _Normalized * 180 ) ) * ( PI() / 180 )' },
          { name: '_NX', expression: 'ROUND( 50 + 34 * COS( _AngleRad ), 1 )' },
          { name: '_NY', expression: 'ROUND( 52 - 34 * SIN( _AngleRad ), 1 )' },
        ],
        svgElements: [
          { name: '_Zones', expression: '"<path d=\'M 15,52 A 35 35 0 0 1 35,21\' fill=\'none\' stroke=\'#EF4444\' stroke-width=\'4\'/><path d=\'M 35,21 A 35 35 0 0 1 65,21\' fill=\'none\' stroke=\'#EAB308\' stroke-width=\'4\'/><path d=\'M 65,21 A 35 35 0 0 1 85,52\' fill=\'none\' stroke=\'#10B981\' stroke-width=\'4\'/>"' },
          { name: '_Ticks', expression: '"<line x1=\'15\' y1=\'52\' x2=\'20\' y2=\'52\' stroke=\'#94A3B8\' stroke-width=\'1.5\'/><line x1=\'50\' y1=\'17\' x2=\'50\' y2=\'22\' stroke=\'#94A3B8\' stroke-width=\'1.5\'/><line x1=\'85\' y1=\'52\' x2=\'80\' y2=\'52\' stroke=\'#94A3B8\' stroke-width=\'1.5\'/>"' },
          { name: '_Needle', expression: '"<line x1=\'50\' y1=\'52\' x2=\'" & _NX & "\' y2=\'" & _NY & "\' stroke=\'" & _Color & "\' stroke-width=\'2.5\' stroke-linecap=\'round\'/><circle cx=\'50\' cy=\'52\' r=\'4\' fill=\'#1E293B\'/>"' },
          { name: '_Text', expression: '"<text x=\'50\' y=\'66\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'14\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "</text>"' },
        ],
        viewBox: '0 0 100 70',
      });
    },
  },

  {
    id: 'gauge-minimal-arc',
    name: 'Minimalist Arc Gauge',
    category: 'gauge',
    description: 'Sleek, modern slim arc gauge with end dot indicator and center value.',
    tags: ['gauge', 'minimal', 'arc', 'modern', 'sleek'],
    viewBox: '0 0 100 65',
    recommendedDimensions: { width: 100, height: 65 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 90,
      recommendedHeight: 60,
      notes: 'Clean, modern alternative to bulky dials.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 68, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Accent Color', type: 'color', defaultValue: '#06B6D4', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 68), 0, 100);
      const color = params.color || '#06B6D4';
      const r = 36;
      const arcLength = Math.PI * r;
      const fillOffset = arcLength * (1 - actual / 100);

      const angleRad = (180 - actual * 1.8) * (Math.PI / 180);
      const dotX = 50 + 36 * Math.cos(angleRad);
      const dotY = 50 - 36 * Math.sin(angleRad);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 65' width='100%' height='100%'>
  <path d='M 14,50 A 36 36 0 0 1 86,50' fill='none' stroke='#E2E8F0' stroke-width='4' stroke-linecap='round' />
  <path d='M 14,50 A 36 36 0 0 1 86,50' fill='none' stroke='${color}' stroke-width='4' stroke-dasharray='${arcLength.toFixed(2)}' stroke-dashoffset='${fillOffset.toFixed(2)}' stroke-linecap='round' />
  <circle cx='${dotX.toFixed(1)}' cy='${dotY.toFixed(1)}' r='5' fill='${color}' stroke='#FFFFFF' stroke-width='2' />
  <text x='50' y='52' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='16' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Minimal_Arc_Gauge') => {
      return buildDaxMeasure({
        measureName,
        description: 'Modern slim arc gauge with end marker dot and center callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 68, type: 'number' },
          { name: '_Color', value: params.color || '#06B6D4', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_Radius', expression: '36' },
          { name: '_ArcLength', expression: 'PI() * _Radius' },
          { name: '_DashOffset', expression: '_ArcLength * ( 1 - _Normalized )' },
          { name: '_AngleRad', expression: '( 180 - ( _Normalized * 180 ) ) * ( PI() / 180 )' },
          { name: '_DotX', expression: 'ROUND( 50 + 36 * COS( _AngleRad ), 1 )' },
          { name: '_DotY', expression: 'ROUND( 50 - 36 * SIN( _AngleRad ), 1 )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<path d=\'M 14,50 A 36 36 0 0 1 86,50\' fill=\'none\' stroke=\'#E2E8F0\' stroke-width=\'4\' stroke-linecap=\'round\'/>"' },
          { name: '_Arc', expression: '"<path d=\'M 14,50 A 36 36 0 0 1 86,50\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'4\' stroke-dasharray=\'" & ROUND( _ArcLength, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\'/>"' },
          { name: '_Dot', expression: '"<circle cx=\'" & _DotX & "\' cy=\'" & _DotY & "\' r=\'5\' fill=\'" & _Color & "\' stroke=\'#FFFFFF\' stroke-width=\'2\'/>"' },
          { name: '_Text', expression: '"<text x=\'50\' y=\'52\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'16\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 65',
      });
    },
  },

  // =========================================================================
  // 3. LINES & SPARKLINES (Image 4 References)
  // =========================================================================
  {
    id: 'sparkline-min-max',
    name: 'Sparkline with Min/Max Dots',
    category: 'line',
    description: 'Trend sparkline with highlighted peak (highest) and trough (lowest) callout dots. Matches Image 4 KPI Sparkline Trend.',
    tags: ['sparkline', 'trend', 'min', 'max', 'dots', 'table', 'matrix'],
    viewBox: '0 0 120 40',
    recommendedDimensions: { width: 120, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 40,
      notes: 'Use alongside category names in Table/Matrix (e.g. Elves 20K ↗ [sparkline]).',
    },
    params: [
      { id: 'lineColor', label: 'Trend Line Color', type: 'color', defaultValue: '#6366F1', daxVarName: '_LineColor' },
      { id: 'maxColor', label: 'Max Dot Color', type: 'color', defaultValue: '#10B981', daxVarName: '_MaxColor' },
      { id: 'minColor', label: 'Min Dot Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_MinColor' },
      { id: 'strokeWidth', label: 'Line Width', type: 'number', defaultValue: 2, min: 1, max: 4, step: 0.5, daxVarName: '_LineWidth' },
    ],
    renderSvg: (params) => {
      const lineColor = params.lineColor || '#6366F1';
      const maxColor = params.maxColor || '#10B981';
      const minColor = params.minColor || '#EF4444';
      const strokeWidth = params.strokeWidth ?? 2;
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40' width='100%' height='100%'>
  <polyline points='10,25 30,14 50,30 70,8 90,22 110,12' fill='none' stroke='${lineColor}' stroke-width='${strokeWidth}' stroke-linecap='round' stroke-linejoin='round' />
  <circle cx='70' cy='8' r='3.5' fill='${maxColor}' stroke='#FFFFFF' stroke-width='1.5' />
  <circle cx='50' cy='30' r='3.5' fill='${minColor}' stroke='#FFFFFF' stroke-width='1.5' />
  <circle cx='110' cy='12' r='3' fill='${lineColor}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Sparkline_Min_Max') => {
      return buildDaxMeasure({
        measureName,
        description: 'Trend sparkline with highlighted minimum and maximum points.',
        configVars: [
          { name: '_LineColor', value: params.lineColor || '#6366F1', type: 'color' },
          { name: '_MaxColor', value: params.maxColor || '#10B981', type: 'color' },
          { name: '_MinColor', value: params.minColor || '#EF4444', type: 'color' },
          { name: '_LineWidth', value: params.strokeWidth ?? 2, type: 'number' },
        ],
        calcVars: [
          {
            name: '_Points',
            expression: `"10,25 30,14 50,30 70,8 90,22 110,12"`,
            comment: 'For dynamic tables, generate coordinate string using CONCATENATEX over your Date/Period table',
          },
        ],
        svgElements: [
          { name: '_Line', expression: '"<polyline points=\'" & _Points & "\' fill=\'none\' stroke=\'" & _LineColor & "\' stroke-width=\'" & _LineWidth & "\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/>"' },
          { name: '_MaxDot', expression: '"<circle cx=\'70\' cy=\'8\' r=\'3.5\' fill=\'" & _MaxColor & "\' stroke=\'#FFFFFF\' stroke-width=\'1.5\'/>"' },
          { name: '_MinDot', expression: '"<circle cx=\'50\' cy=\'30\' r=\'3.5\' fill=\'" & _MinColor & "\' stroke=\'#FFFFFF\' stroke-width=\'1.5\'/>"' },
          { name: '_EndDot', expression: '"<circle cx=\'110\' cy=\'12\' r=\'3\' fill=\'" & _LineColor & "\'/>"' },
        ],
        viewBox: '0 0 120 40',
      });
    },
  },

  {
    id: 'sparkline-area-fill',
    name: 'Gradient Area Sparkline',
    category: 'line',
    description: 'Smooth shaded area sparkline with subtle gradient fill and latest endpoint callout dot.',
    tags: ['area', 'gradient', 'sparkline', 'trend', 'shaded'],
    viewBox: '0 0 120 45',
    recommendedDimensions: { width: 120, height: 45 },
    pbiTips: {
      visualType: 'Table / Matrix / Card',
      recommendedWidth: 120,
      recommendedHeight: 45,
      notes: 'Matches KPI Trend Line in Image 4. Features shaded area beneath the line.',
    },
    params: [
      { id: 'fillColor', label: 'Theme Color', type: 'color', defaultValue: '#3B82F6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const color = params.fillColor || '#3B82F6';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 45' width='100%' height='100%'>
  <defs>
    <linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='${color}' stop-opacity='0.35' />
      <stop offset='100%' stop-color='${color}' stop-opacity='0.0' />
    </linearGradient>
  </defs>
  <polygon points='5,40 5,28 25,18 45,26 65,12 85,20 105,10 115,15 115,40' fill='url(#areaGrad)' />
  <polyline points='5,28 25,18 45,26 65,12 85,20 105,10 115,15' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
  <circle cx='115' cy='15' r='3.5' fill='${color}' stroke='#FFFFFF' stroke-width='1.5' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Area_Sparkline') => {
      return buildDaxMeasure({
        measureName,
        description: 'Area sparkline with linear gradient fill and highlighted end dot.',
        configVars: [
          { name: '_Color', value: params.fillColor || '#3B82F6', type: 'color' },
        ],
        svgElements: [
          {
            name: '_Defs',
            expression: `"<defs><linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='" & _Color & "' stop-opacity='0.35'/><stop offset='100%' stop-color='" & _Color & "' stop-opacity='0.0'/></linearGradient></defs>"`,
          },
          { name: '_Area', expression: '"<polygon points=\'5,40 5,28 25,18 45,26 65,12 85,20 105,10 115,15 115,40\' fill=\'url(#areaGrad)\'/>"' },
          { name: '_Line', expression: '"<polyline points=\'5,28 25,18 45,26 65,12 85,20 105,10 115,15\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/>"' },
          { name: '_Dot', expression: '"<circle cx=\'115\' cy=\'15\' r=\'3.5\' fill=\'" & _Color & "\' stroke=\'#FFFFFF\' stroke-width=\'1.5\'/>"' },
        ],
        viewBox: '0 0 120 45',
      });
    },
  },

  {
    id: 'sparkline-dual-trend',
    name: 'Dual Trend Comparison',
    category: 'line',
    description: 'Two trend lines comparing Actual performance against Prior Year or Budget benchmark. Matches Image 4 KPI Trend Comparison.',
    tags: ['sparkline', 'trend', 'comparison', 'dual', 'prior-year', 'actual'],
    viewBox: '0 0 120 40',
    recommendedDimensions: { width: 120, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix / Card',
      recommendedWidth: 120,
      recommendedHeight: 40,
      notes: 'Matches Image 4 KPI Trend Comparison (8.1K Claims vs last year).',
    },
    params: [
      { id: 'actualColor', label: 'Actual Line Color', type: 'color', defaultValue: '#0F172A', daxVarName: '_ActualColor' },
      { id: 'benchmarkColor', label: 'Benchmark Line Color', type: 'color', defaultValue: '#94A3B8', daxVarName: '_BenchColor' },
    ],
    renderSvg: (params) => {
      const actualColor = params.actualColor || '#0F172A';
      const benchColor = params.benchmarkColor || '#94A3B8';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40' width='100%' height='100%'>
  <polyline points='5,24 25,26 45,20 65,22 85,18 105,22 115,20' fill='none' stroke='${benchColor}' stroke-width='1.5' stroke-dasharray='2,2' />
  <polyline points='5,30 25,18 45,24 65,12 85,14 105,8 115,10' fill='none' stroke='${actualColor}' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' />
  <circle cx='115' cy='10' r='3.5' fill='${actualColor}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Dual_Trend_Comparison') => {
      return buildDaxMeasure({
        measureName,
        description: 'Two trend lines comparing Actual against Prior Year or Budget benchmark.',
        configVars: [
          { name: '_ActualColor', value: params.actualColor || '#0F172A', type: 'color' },
          { name: '_BenchColor', value: params.benchmarkColor || '#94A3B8', type: 'color' },
        ],
        svgElements: [
          { name: '_BenchLine', expression: '"<polyline points=\'5,24 25,26 45,20 65,22 85,18 105,22 115,20\' fill=\'none\' stroke=\'" & _BenchColor & "\' stroke-width=\'1.5\' stroke-dasharray=\'2,2\'/>"' },
          { name: '_ActualLine', expression: '"<polyline points=\'5,30 25,18 45,24 65,12 85,14 105,8 115,10\' fill=\'none\' stroke=\'" & _ActualColor & "\' stroke-width=\'2.2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/>"' },
          { name: '_Dot', expression: '"<circle cx=\'115\' cy=\'10\' r=\'3.5\' fill=\'" & _ActualColor & "\'/>"' },
        ],
        viewBox: '0 0 120 40',
      });
    },
  },

  {
    id: 'sparkline-win-loss',
    name: 'Micro Trend Columns',
    category: 'line',
    description: 'Micro column sparkline displaying sequential period volume with highlighted latest bar.',
    tags: ['columns', 'bars', 'trend', 'sparkline', 'volume'],
    viewBox: '0 0 100 35',
    recommendedDimensions: { width: 100, height: 35 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 90,
      recommendedHeight: 35,
      notes: 'Matches Image 4 KPI Trend Bar. Great for showing 12-month mini bars inside table rows.',
    },
    params: [
      { id: 'barColor', label: 'Bar Color', type: 'color', defaultValue: '#CBD5E1', daxVarName: '_BarColor' },
      { id: 'highlightColor', label: 'Latest Bar Color', type: 'color', defaultValue: '#0F172A', daxVarName: '_HighlightColor' },
    ],
    renderSvg: (params) => {
      const barColor = params.barColor || '#CBD5E1';
      const highlightColor = params.highlightColor || '#0F172A';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 35' width='100%' height='100%'>
  <rect x='4' y='18' width='8' height='14' rx='2' fill='${barColor}' />
  <rect x='16' y='14' width='8' height='18' rx='2' fill='${barColor}' />
  <rect x='28' y='20' width='8' height='12' rx='2' fill='${barColor}' />
  <rect x='40' y='10' width='8' height='22' rx='2' fill='${barColor}' />
  <rect x='52' y='16' width='8' height='16' rx='2' fill='${barColor}' />
  <rect x='64' y='12' width='8' height='20' rx='2' fill='${barColor}' />
  <rect x='76' y='8' width='8' height='24' rx='2' fill='${barColor}' />
  <rect x='88' y='4' width='8' height='28' rx='2' fill='${highlightColor}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Trend_Columns') => {
      return buildDaxMeasure({
        measureName,
        description: 'Micro column sparkline displaying sequential period bars.',
        configVars: [
          { name: '_BarColor', value: params.barColor || '#CBD5E1', type: 'color' },
          { name: '_HighlightColor', value: params.highlightColor || '#0F172A', type: 'color' },
        ],
        svgElements: [
          {
            name: '_Bars',
            expression: `"<rect x='4' y='18' width='8' height='14' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='16' y='14' width='8' height='18' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='28' y='20' width='8' height='12' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='40' y='10' width='8' height='22' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='52' y='16' width='8' height='16' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='64' y='12' width='8' height='20' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='76' y='8' width='8' height='24' rx='2' fill='" & _BarColor & "'/>" &
    "<rect x='88' y='4' width='8' height='28' rx='2' fill='" & _HighlightColor & "'/>"`,
          },
        ],
        viewBox: '0 0 100 35',
      });
    },
  },

  // =========================================================================
  // 4. BARS & BULLETS (Image 4 References)
  // =========================================================================
  {
    id: 'bullet-chart-target',
    name: 'IBCS Bullet Chart',
    category: 'bar',
    description: 'IBCS-compliant horizontal bullet chart with actual value bar and target benchmark line marker. Matches Image 4 KPI Bullet.',
    tags: ['bullet', 'ibcs', 'bar', 'target', 'benchmark', 'comparison'],
    viewBox: '0 0 120 30',
    recommendedDimensions: { width: 120, height: 30 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 30,
      notes: 'Standard IBCS pattern for Actual vs Budget/Target comparisons.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 78, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'target', label: 'Target (%)', type: 'number', defaultValue: 85, min: 0, max: 100, step: 1, daxVarName: '_Target' },
      { id: 'barColor', label: 'Actual Bar Color', type: 'color', defaultValue: '#38BDF8', daxVarName: '_BarColor' },
      { id: 'targetColor', label: 'Target Marker Color', type: 'color', defaultValue: '#0F172A', daxVarName: '_TargetColor' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 78), 0, 100);
      const target = clamp(Number(params.target ?? 85), 0, 100);
      const barColor = params.barColor || '#38BDF8';
      const targetColor = params.targetColor || '#0F172A';
      const actualW = actual;
      const targetX = target;

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 30' width='100%' height='100%'>
  <rect x='10' y='6' width='100' height='18' rx='3' fill='#F1F5F9' />
  <rect x='10' y='8' width='${actualW}' height='14' rx='2' fill='${barColor}' />
  <line x1='${10 + targetX}' y1='4' x2='${10 + targetX}' y2='26' stroke='${targetColor}' stroke-width='2.5' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_IBCS_Bullet_Chart') => {
      return buildDaxMeasure({
        measureName,
        description: 'IBCS-compliant horizontal bullet chart with actual bar and target line marker.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 78, type: 'number', comment: 'Replace with [Actual Sales]' },
          { name: '_Target', value: params.target ?? 85, type: 'number', comment: 'Replace with [Sales Target]' },
          { name: '_BarColor', value: params.barColor || '#38BDF8', type: 'color' },
          { name: '_TargetColor', value: params.targetColor || '#0F172A', type: 'color' },
        ],
        calcVars: [
          { name: '_ActualWidth', expression: 'MIN( 100, MAX( 0, _Actual ) )' },
          { name: '_TargetX', expression: '10 + MIN( 100, MAX( 0, _Target ) )' },
        ],
        svgElements: [
          { name: '_Zone', expression: '"<rect x=\'10\' y=\'6\' width=\'100\' height=\'18\' rx=\'3\' fill=\'#F1F5F9\'/>"' },
          { name: '_Bar', expression: '"<rect x=\'10\' y=\'8\' width=\'" & _ActualWidth & "\' height=\'14\' rx=\'2\' fill=\'" & _BarColor & "\'/>"' },
          { name: '_TargetLine', expression: '"<line x1=\'" & _TargetX & "\' y1=\'4\' x2=\'" & _TargetX & "\' y2=\'26\' stroke=\'" & _TargetColor & "\' stroke-width=\'2.5\'/>"' },
        ],
        viewBox: '0 0 120 30',
      });
    },
  },

  {
    id: 'bar-simple-progress',
    name: 'Horizontal Data Bar',
    category: 'bar',
    description: 'Clean data progress bar with rounded ends and inline percentage label.',
    tags: ['bar', 'progress', 'horizontal', 'data-bar'],
    viewBox: '0 0 120 24',
    recommendedDimensions: { width: 120, height: 24 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 100,
      recommendedHeight: 24,
      notes: 'Matches Image 4 KPI Bar. Clean replacement for default conditional formatting data bars.',
    },
    params: [
      { id: 'actual', label: 'Progress (%)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Bar Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 65), 0, 100);
      const color = params.color || '#8B5CF6';
      const w = actual * 0.8;

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 24' width='100%' height='100%'>
  <rect x='4' y='6' width='80' height='12' rx='6' fill='#E2E8F0' />
  <rect x='4' y='6' width='${w}' height='12' rx='6' fill='${color}' />
  <text x='92' y='16' font-family='Segoe UI, sans-serif' font-size='11' font-weight='800' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Data_Bar') => {
      return buildDaxMeasure({
        measureName,
        description: 'Horizontal data bar with rounded pill track and inline percentage callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 65, type: 'number' },
          { name: '_Color', value: params.color || '#8B5CF6', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_BarWidth', expression: 'ROUND( _Normalized * 80, 1 )' },
          { name: '_Label', expression: 'FORMAT( _Actual, "0" ) & "%"' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<rect x=\'4\' y=\'6\' width=\'80\' height=\'12\' rx=\'6\' fill=\'#E2E8F0\'/>"' },
          { name: '_Bar', expression: '"<rect x=\'4\' y=\'6\' width=\'" & _BarWidth & "\' height=\'12\' rx=\'6\' fill=\'" & _Color & "\'/>"' },
          { name: '_Text', expression: '"<text x=\'92\' y=\'16\' font-family=\'Segoe UI, sans-serif\' font-size=\'11\' font-weight=\'800\' fill=\'#1E293B\'>" & _Label & "</text>"' },
        ],
        viewBox: '0 0 120 24',
      });
    },
  },

  {
    id: 'bar-diverging-variance',
    name: 'Diverging Variance Bar',
    category: 'bar',
    description: 'Diverging variance bar centered at zero: bars extend right (green/positive) or left (red/negative).',
    tags: ['diverging', 'variance', 'delta', 'bipolar', 'bar'],
    viewBox: '0 0 120 30',
    recommendedDimensions: { width: 120, height: 30 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 30,
      notes: 'Direct match for YoY / Budget variance columns with negative values.',
    },
    params: [
      { id: 'delta', label: 'Variance (+/- %)', type: 'number', defaultValue: 35, min: -100, max: 100, step: 1, daxVarName: '_Delta' },
      { id: 'positiveColor', label: 'Positive Color', type: 'color', defaultValue: '#10B981', daxVarName: '_PosColor' },
      { id: 'negativeColor', label: 'Negative Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_NegColor' },
    ],
    renderSvg: (params) => {
      const delta = clamp(Number(params.delta ?? 35), -100, 100);
      const isPos = delta >= 0;
      const barColor = isPos ? (params.positiveColor || '#10B981') : (params.negativeColor || '#EF4444');
      const w = Math.abs(delta) * 0.45;
      const x = isPos ? 60 : 60 - w;

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 30' width='100%' height='100%'>
  <line x1='60' y1='3' x2='60' y2='27' stroke='#94A3B8' stroke-width='1.5' stroke-dasharray='2,2' />
  <rect x='${x.toFixed(1)}' y='8' width='${w.toFixed(1)}' height='14' rx='2' fill='${barColor}' />
  <text x='${isPos ? (65 + w).toFixed(1) : (55 - w).toFixed(1)}' y='19' text-anchor='${isPos ? 'start' : 'end'}' font-family='Segoe UI, sans-serif' font-size='10' font-weight='800' fill='${barColor}'>${delta > 0 ? '+' : ''}${Math.round(delta)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Diverging_Variance') => {
      return buildDaxMeasure({
        measureName,
        description: 'Diverging variance bar extending left or right from a center zero axis.',
        configVars: [
          { name: '_Delta', value: params.delta ?? 35, type: 'number', comment: 'Replace with [Variance %]' },
          { name: '_PosColor', value: params.positiveColor || '#10B981', type: 'color' },
          { name: '_NegColor', value: params.negativeColor || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_IsPos', expression: '_Delta >= 0' },
          { name: '_Color', expression: 'IF( _IsPos, _PosColor, _NegColor )' },
          { name: '_Width', expression: 'ROUND( MIN( 45, ABS( _Delta ) * 0.45 ), 1 )' },
          { name: '_X', expression: 'IF( _IsPos, 60, 60 - _Width )' },
          { name: '_LabelX', expression: 'IF( _IsPos, 65 + _Width, 55 - _Width )' },
          { name: '_Anchor', expression: 'IF( _IsPos, "start", "end" )' },
          { name: '_Text', expression: 'IF( _Delta > 0, "+", "" ) & FORMAT( _Delta, "0" ) & "%"' },
        ],
        svgElements: [
          { name: '_ZeroLine', expression: '"<line x1=\'60\' y1=\'3\' x2=\'60\' y2=\'27\' stroke=\'#94A3B8\' stroke-width=\'1.5\' stroke-dasharray=\'2,2\'/>"' },
          { name: '_Bar', expression: '"<rect x=\'" & _X & "\' y=\'8\' width=\'" & _Width & "\' height=\'14\' rx=\'2\' fill=\'" & _Color & "\'/>"' },
          { name: '_Label', expression: '"<text x=\'" & _LabelX & "\' y=\'19\' text-anchor=\'" & _Anchor & "\' font-family=\'Segoe UI, sans-serif\' font-size=\'10\' font-weight=\'800\' fill=\'" & _Color & "\'>" & _Text & "</text>"' },
        ],
        viewBox: '0 0 120 30',
      });
    },
  },

  // =========================================================================
  // 5. DONUTS & RADIALS (Image 4 References)
  // =========================================================================
  {
    id: 'donut-kpi-metric',
    name: 'KPI Doughnut with Target Tick',
    category: 'donut',
    description: 'Doughnut chart with actual progress arc, target benchmark indicator tick, and centered value callout. Matches Image 4 KPI Doughnut.',
    tags: ['donut', 'doughnut', 'circle', 'radial', 'target', 'kpi'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 60, height: 60 },
    pbiTips: {
      visualType: 'New Card / Table / Matrix',
      recommendedWidth: 60,
      recommendedHeight: 60,
      notes: 'Matches KPI Doughnut in Image 4. Features actual percentage and target tick mark.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 40, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'target', label: 'Target (%)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_Target' },
      { id: 'color', label: 'Progress Color', type: 'color', defaultValue: '#38BDF8', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 40), 0, 100);
      const target = clamp(Number(params.target ?? 65), 0, 100);
      const color = params.color || '#38BDF8';
      const r = 36;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - actual / 100);

      const targetRad = (target * 3.6 - 90) * (Math.PI / 180);
      const tx1 = 50 + 29 * Math.cos(targetRad);
      const ty1 = 50 + 29 * Math.sin(targetRad);
      const tx2 = 50 + 43 * Math.cos(targetRad);
      const ty2 = 50 + 43 * Math.sin(targetRad);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='#E2E8F0' stroke-width='10' />
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${color}' stroke-width='10' stroke-dasharray='${c.toFixed(2)}' stroke-dashoffset='${offset.toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <line x1='${tx1.toFixed(1)}' y1='${ty1.toFixed(1)}' x2='${tx2.toFixed(1)}' y2='${ty2.toFixed(1)}' stroke='#1E293B' stroke-width='2.5' />
  <text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='20' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_KPI_Doughnut') => {
      return buildDaxMeasure({
        measureName,
        description: 'Doughnut chart with progress arc, target benchmark line, and center callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 40, type: 'number' },
          { name: '_Target', value: params.target ?? 65, type: 'number' },
          { name: '_Color', value: params.color || '#38BDF8', type: 'color' },
        ],
        calcVars: [
          { name: '_NormActual', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_NormTarget', expression: 'MIN( 1, MAX( 0, DIVIDE( _Target, 100, 0 ) ) )' },
          { name: '_Radius', expression: '36' },
          { name: '_Circumference', expression: '2 * PI() * _Radius' },
          { name: '_DashOffset', expression: '_Circumference * ( 1 - _NormActual )' },
          { name: '_TargetRad', expression: '( ( _NormTarget * 360 ) - 90 ) * ( PI() / 180 )' },
          { name: '_TX1', expression: 'ROUND( 50 + 29 * COS( _TargetRad ), 1 )' },
          { name: '_TY1', expression: 'ROUND( 50 + 29 * SIN( _TargetRad ), 1 )' },
          { name: '_TX2', expression: 'ROUND( 50 + 43 * COS( _TargetRad ), 1 )' },
          { name: '_TY2', expression: 'ROUND( 50 + 43 * SIN( _TargetRad ), 1 )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'#E2E8F0\' stroke-width=\'10\'/>"' },
          { name: '_Arc', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'10\' stroke-dasharray=\'" & ROUND( _Circumference, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
          { name: '_TargetTick', expression: '"<line x1=\'" & _TX1 & "\' y1=\'" & _TY1 & "\' x2=\'" & _TX2 & "\' y2=\'" & _TY2 & "\' stroke=\'#1E293B\' stroke-width=\'2.5\'/>"' },
          { name: '_Text', expression: '"<text x=\'50\' y=\'57\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'20\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'donut-segmented-dial',
    name: 'Segmented Radial Dial',
    category: 'donut',
    description: 'Multi-segment radial gauge divided into 5 distinct arcs indicating performance tiers.',
    tags: ['donut', 'radial', 'segmented', 'dial', 'tiers'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 60, height: 60 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 60,
      recommendedHeight: 60,
      notes: 'Clean segmented look for maturity levels or quintiles.',
    },
    params: [
      { id: 'tier', label: 'Active Segments (1-5)', type: 'number', defaultValue: 3, min: 1, max: 5, step: 1, daxVarName: '_Tiers' },
      { id: 'activeColor', label: 'Active Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_ActiveColor' },
    ],
    renderSvg: (params) => {
      const activeTiers = clamp(Number(params.tier ?? 3), 0, 5);
      const color = params.activeColor || '#8B5CF6';
      const segments: string[] = [];
      for (let i = 0; i < 5; i++) {
        const isActive = i < activeTiers;
        const startAngle = i * 72 - 90;
        const endAngle = startAngle + 56;
        const rad1 = startAngle * (Math.PI / 180);
        const rad2 = endAngle * (Math.PI / 180);
        const x1 = 50 + 36 * Math.cos(rad1);
        const y1 = 50 + 36 * Math.sin(rad1);
        const x2 = 50 + 36 * Math.cos(rad2);
        const y2 = 50 + 36 * Math.sin(rad2);
        segments.push(
          `<path d='M ${x1.toFixed(1)},${y1.toFixed(1)} A 36 36 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}' fill='none' stroke='${isActive ? color : '#E2E8F0'}' stroke-width='8' stroke-linecap='round' />`
        );
      }

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  ${segments.join('\n  ')}
  <text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='20' font-weight='900' fill='#1E293B'>${activeTiers}/5</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Segmented_Dial') => {
      return buildDaxMeasure({
        measureName,
        description: 'Segmented radial dial showing 1 to 5 active progress arcs.',
        configVars: [
          { name: '_ActiveTiers', value: params.tier ?? 3, type: 'number', comment: 'Score from 1 to 5' },
          { name: '_Color', value: params.activeColor || '#8B5CF6', type: 'color' },
        ],
        svgElements: [
          {
            name: '_Arcs',
            expression: `CONCATENATEX(
        GENERATESERIES( 0, 4, 1 ),
        VAR _Idx = [Value]
        VAR _IsActive = _Idx < _ActiveTiers
        VAR _Stroke = IF( _IsActive, _Color, "#E2E8F0" )
        VAR _StartAngle = ( _Idx * 72 ) - 90
        VAR _EndAngle = _StartAngle + 56
        VAR _Rad1 = _StartAngle * ( PI() / 180 )
        VAR _Rad2 = _EndAngle * ( PI() / 180 )
        VAR _X1 = ROUND( 50 + 36 * COS( _Rad1 ), 1 )
        VAR _Y1 = ROUND( 50 + 36 * SIN( _Rad1 ), 1 )
        VAR _X2 = ROUND( 50 + 36 * COS( _Rad2 ), 1 )
        VAR _Y2 = ROUND( 50 + 36 * SIN( _Rad2 ), 1 )
        RETURN
            "<path d='M " & _X1 & "," & _Y1 & " A 36 36 0 0 1 " & _X2 & "," & _Y2 & "' fill='none' stroke='" & _Stroke & "' stroke-width='8' stroke-linecap='round'/>",
        ""
    )`,
          },
          { name: '_Text', expression: '"<text x=\'50\' y=\'57\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'20\' font-weight=\'900\' fill=\'#1E293B\'>" & _ActiveTiers & "/5</text>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  // =========================================================================
  // 6. WAFFLES, RATINGS & DISCRETE INDICATORS (Image 4 References)
  // =========================================================================
  {
    id: 'waffle-10x10-grid',
    name: '10x10 Waffle Percentage Grid',
    category: 'waffle',
    description: '100-dot waffle chart representing percentage achievement with filled and unfilled dots. Matches Image 4 Waffle Text.',
    tags: ['waffle', 'grid', 'dots', 'percentage', 'discrete', 'matrix'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 50, height: 50 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 50,
      recommendedHeight: 50,
      notes: 'Matches Image 4 Waffle Text (Progress: 93%). Highly intuitive part-to-whole visual for tables.',
    },
    params: [
      { id: 'actual', label: 'Progress (%)', type: 'number', defaultValue: 93, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'activeColor', label: 'Active Dot Color', type: 'color', defaultValue: '#0F172A', daxVarName: '_ActiveColor' },
      { id: 'inactiveColor', label: 'Inactive Dot Color', type: 'color', defaultValue: '#E2E8F0', daxVarName: '_InactiveColor' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 93), 0, 100);
      const activeColor = params.activeColor || '#0F172A';
      const inactiveColor = params.inactiveColor || '#E2E8F0';

      const dots: string[] = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const index = row * 10 + col + 1;
          const isActive = index <= actual;
          const x = 7 + col * 9.5;
          const y = 7 + row * 9.5;
          dots.push(`<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='3.2' fill='${isActive ? activeColor : inactiveColor}' />`);
        }
      }

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  ${dots.join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Waffle_10x10') => {
      return buildDaxMeasure({
        measureName,
        description: '10x10 100-dot waffle progress grid for percentage visualization.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 93, type: 'number', comment: 'Percentage score from 0 to 100' },
          { name: '_ActiveColor', value: params.activeColor || '#0F172A', type: 'color' },
          { name: '_InactiveColor', value: params.inactiveColor || '#E2E8F0', type: 'color' },
        ],
        calcVars: [
          { name: '_Threshold', expression: 'ROUND( MIN( 100, MAX( 0, _Actual ) ), 0 )' },
        ],
        svgElements: [
          {
            name: '_Dots',
            expression: `CONCATENATEX(
        GENERATESERIES( 1, 100, 1 ),
        VAR _Idx = [Value]
        VAR _Col = MOD( _Idx - 1, 10 )
        VAR _Row = INT( ( _Idx - 1 ) / 10 )
        VAR _X = 7 + ( _Col * 9.5 )
        VAR _Y = 7 + ( _Row * 9.5 )
        VAR _Color = IF( _Idx <= _Threshold, _ActiveColor, _InactiveColor )
        RETURN
            "<circle cx='" & _X & "' cy='" & _Y & "' r='3.2' fill='" & _Color & "'/>",
        ""
    )`,
            comment: 'Generates 10x10 dot matrix dynamically based on threshold',
          },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'rating-5-stars',
    name: '5-Star Rating Visual',
    category: 'waffle',
    description: '5-star discrete rating visual with filled and unfilled stars. Matches Image 4 Star Rating Text.',
    tags: ['rating', 'stars', 'score', 'review', 'discrete'],
    viewBox: '0 0 120 28',
    recommendedDimensions: { width: 120, height: 28 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 100,
      recommendedHeight: 28,
      notes: 'Matches Image 4 Star Rating Text (Rating: 4, ★★★★☆). Great for customer satisfaction ratings.',
    },
    params: [
      { id: 'rating', label: 'Rating (1 to 5)', type: 'number', defaultValue: 4, min: 0, max: 5, step: 0.5, daxVarName: '_Rating' },
      { id: 'filledColor', label: 'Star Color', type: 'color', defaultValue: '#F59E0B', daxVarName: '_StarColor' },
    ],
    renderSvg: (params) => {
      const rating = clamp(Number(params.rating ?? 4), 0, 5);
      const color = params.filledColor || '#F59E0B';
      const starPath = 'M10 1.5 L12.6 6.8 L18.4 7.6 L14.2 11.7 L15.2 17.5 L10 14.8 L4.8 17.5 L5.8 11.7 L1.6 7.6 L7.4 6.8 Z';

      const stars: string[] = [];
      for (let i = 1; i <= 5; i++) {
        const isFilled = i <= rating;
        const x = (i - 1) * 23 + 4;
        stars.push(
          `<g transform='translate(${x}, 4) scale(1.1)'>
  <path d='${starPath}' fill='${isFilled ? color : '#E2E8F0'}' stroke='${isFilled ? color : '#CBD5E1'}' stroke-width='1' />
</g>`
        );
      }

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 28' width='100%' height='100%'>
  ${stars.join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Star_Rating') => {
      return buildDaxMeasure({
        measureName,
        description: '5-star discrete rating visual with active filled stars.',
        configVars: [
          { name: '_Rating', value: params.rating ?? 4, type: 'number', comment: 'Replace with [Average Star Rating]' },
          { name: '_StarColor', value: params.filledColor || '#F59E0B', type: 'color' },
        ],
        calcVars: [
          { name: '_StarPath', expression: `"M10 1.5 L12.6 6.8 L18.4 7.6 L14.2 11.7 L15.2 17.5 L10 14.8 L4.8 17.5 L5.8 11.7 L1.6 7.6 L7.4 6.8 Z"` },
        ],
        svgElements: [
          {
            name: '_Stars',
            expression: `CONCATENATEX(
        GENERATESERIES( 1, 5, 1 ),
        VAR _Idx = [Value]
        VAR _IsFilled = _Idx <= _Rating
        VAR _Fill = IF( _IsFilled, _StarColor, "#E2E8F0" )
        VAR _X = ( _Idx - 1 ) * 23 + 4
        RETURN
            "<g transform='translate(" & _X & ", 4) scale(1.1)'><path d='" & _StarPath & "' fill='" & _Fill & "' stroke='" & _Fill & "' stroke-width='1'/></g>",
        ""
    )`,
          },
        ],
        viewBox: '0 0 120 28',
      });
    },
  },

  {
    id: 'boolean-status-indicator',
    name: 'Boolean Pass/Fail Icon Badge',
    category: 'waffle',
    description: 'Dynamic boolean status visual showing a green checkmark (TRUE) or red cross (FALSE). Matches Image 4 Boolean Conditional Text.',
    tags: ['boolean', 'check', 'cross', 'pass', 'fail', 'kpi'],
    viewBox: '0 0 60 40',
    recommendedDimensions: { width: 60, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 60,
      recommendedHeight: 40,
      notes: 'Matches Image 4 Boolean Conditional Text (Ready to deploy? X or ✔).',
    },
    params: [
      { id: 'isPass', label: 'Status (Pass / Fail)', type: 'boolean', defaultValue: true, daxVarName: '_IsPass' },
      { id: 'passColor', label: 'Pass Color', type: 'color', defaultValue: '#10B981', daxVarName: '_PassColor' },
      { id: 'failColor', label: 'Fail Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_FailColor' },
    ],
    renderSvg: (params) => {
      const isPass = Boolean(params.isPass ?? true);
      const color = isPass ? (params.passColor || '#10B981') : (params.failColor || '#EF4444');

      if (isPass) {
        return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40' width='100%' height='100%'>
  <circle cx='30' cy='20' r='16' fill='${color}' fill-opacity='0.15' />
  <path d='M22 20 L28 26 L38 14' fill='none' stroke='${color}' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round' />
</svg>`;
      }

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40' width='100%' height='100%'>
  <circle cx='30' cy='20' r='16' fill='${color}' fill-opacity='0.15' />
  <line x1='22' y1='12' x2='38' y2='28' stroke='${color}' stroke-width='3.5' stroke-linecap='round' />
  <line x1='38' y1='12' x2='22' y2='28' stroke='${color}' stroke-width='3.5' stroke-linecap='round' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Boolean_Indicator') => {
      return buildDaxMeasure({
        measureName,
        description: 'Dynamic boolean indicator icon returning checkmark or cross badge.',
        configVars: [
          { name: '_IsPass', value: params.isPass ?? true, type: 'boolean', comment: 'Replace with [Is Deployable] or boolean condition' },
          { name: '_PassColor', value: params.passColor || '#10B981', type: 'color' },
          { name: '_FailColor', value: params.failColor || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_Color', expression: 'IF( _IsPass, _PassColor, _FailColor )' },
        ],
        svgElements: [
          {
            name: '_Icon',
            expression: `IF(
        _IsPass,
        "<circle cx='30' cy='20' r='16' fill='" & _Color & "' fill-opacity='0.15'/>" &
        "<path d='M22 20 L28 26 L38 14' fill='none' stroke='" & _Color & "' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/>",
        "<circle cx='30' cy='20' r='16' fill='" & _Color & "' fill-opacity='0.15'/>" &
        "<line x1='22' y1='12' x2='38' y2='28' stroke='" & _Color & "' stroke-width='3.5' stroke-linecap='round'/>" &
        "<line x1='38' y1='12' x2='22' y2='28' stroke='" & _Color & "' stroke-width='3.5' stroke-linecap='round'/>"
    )`,
          },
        ],
        viewBox: '0 0 60 40',
      });
    },
  },

  {
    id: 'counter-repeated-boxes',
    name: 'Repeated Indicator Badges',
    category: 'waffle',
    description: 'Visual indicator of discrete counts using repeated pill badges (e.g. 3 of 5 issues). Matches Image 4 Repeated Text XXX.',
    tags: ['counter', 'repeated', 'boxes', 'discrete', 'issues', 'count'],
    viewBox: '0 0 120 28',
    recommendedDimensions: { width: 120, height: 28 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 100,
      recommendedHeight: 28,
      notes: 'Matches Image 4 Repeated Text (XXX / # Issues). Shows discrete count out of 5.',
    },
    params: [
      { id: 'count', label: 'Active Count (1-5)', type: 'number', defaultValue: 3, min: 0, max: 5, step: 1, daxVarName: '_Count' },
      { id: 'color', label: 'Badge Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const count = clamp(Number(params.count ?? 3), 0, 5);
      const color = params.color || '#EF4444';
      const boxes: string[] = [];
      for (let i = 1; i <= 5; i++) {
        const isActive = i <= count;
        const x = (i - 1) * 23 + 4;
        boxes.push(
          `<rect x='${x}' y='4' width='18' height='20' rx='4' fill='${isActive ? color : '#F1F5F9'}' stroke='${isActive ? color : '#E2E8F0'}' stroke-width='1.5' />` +
          (isActive ? `<text x='${x + 9}' y='19' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='12' font-weight='900' fill='#FFFFFF'>✕</text>` : '')
        );
      }
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 28' width='100%' height='100%'>
  ${boxes.join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Repeated_Indicator_Boxes') => {
      return buildDaxMeasure({
        measureName,
        description: 'Repeated discrete box indicators showing count of items or severity.',
        configVars: [
          { name: '_Count', value: params.count ?? 3, type: 'number', comment: 'Replace with [Issue Count] (0-5)' },
          { name: '_Color', value: params.color || '#EF4444', type: 'color' },
        ],
        svgElements: [
          {
            name: '_Boxes',
            expression: `CONCATENATEX(
        GENERATESERIES( 1, 5, 1 ),
        VAR _Idx = [Value]
        VAR _IsActive = _Idx <= _Count
        VAR _Fill = IF( _IsActive, _Color, "#F1F5F9" )
        VAR _Stroke = IF( _IsActive, _Color, "#E2E8F0" )
        VAR _X = ( _Idx - 1 ) * 23 + 4
        VAR _Text = IF( _IsActive, "<text x='" & ( _X + 9 ) & "' y='19' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='12' font-weight='900' fill='#FFFFFF'>✕</text>", "" )
        RETURN
            "<rect x='" & _X & "' y='4' width='18' height='20' rx='4' fill='" & _Fill & "' stroke='" & _Stroke & "' stroke-width='1.5'/>" & _Text,
        ""
    )`,
          },
        ],
        viewBox: '0 0 120 28',
      });
    },
  },
];

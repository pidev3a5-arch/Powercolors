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
  // 1. KPI & BADGES (8 visuals)
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
          { name: '_Actual', value: params.actual ?? 75, type: 'number', comment: 'Replace with [Achievement %]' },
          { name: '_Color', value: params.color || '#84CC16', type: 'color' },
          { name: '_TrackColor', value: params.trackColor || '#E2E8F0', type: 'color' },
          { name: '_Thickness', value: params.strokeWidth ?? 10, type: 'number' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
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
          { name: '_Actual', value: params.actual ?? 100, type: 'number' },
          { name: '_Color', value: params.color || '#84CC16', type: 'color' },
          { name: '_TrackColor', value: params.trackColor || '#E2E8F0', type: 'color' },
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
          { name: '_MetricValue', value: params.value ?? '$1,482K', type: 'text' },
          { name: '_DeltaPct', value: params.delta ?? 12.4, type: 'number' },
          { name: '_Subtext', value: params.subtext ?? 'vs Target', type: 'text' },
          { name: '_PosColor', value: params.positiveColor || '#10B981', type: 'color' },
          { name: '_NegColor', value: params.negativeColor || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_IsPositive', expression: '_DeltaPct >= 0' },
          { name: '_Color', expression: 'IF( _IsPositive, _PosColor, _NegColor )' },
          { name: '_Arrow', expression: 'IF( _IsPositive, "▲", "▼" )' },
          { name: '_DeltaFormatted', expression: '_Arrow & " " & FORMAT( ABS( _DeltaPct ), "0.0" ) & "% " & _Subtext' },
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
          { name: '_Label', value: params.label ?? 'Active', type: 'text' },
          { name: '_Color', value: params.color || '#10B981', type: 'color' },
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

  {
    id: 'kpi-battery-status',
    name: 'Battery Capacity Indicator',
    category: 'kpi',
    description: 'Horizontal battery charge bar indicating storage, budget or inventory capacity remaining.',
    tags: ['battery', 'capacity', 'charge', 'storage', 'kpi'],
    viewBox: '0 0 100 35',
    recommendedDimensions: { width: 90, height: 32 },
    pbiTips: {
      visualType: 'Table / Matrix / Card',
      recommendedWidth: 90,
      recommendedHeight: 32,
      notes: 'Great for capacity tracking, inventory limits, and budget spend percentages.',
    },
    params: [
      { id: 'actual', label: 'Charge (%)', type: 'number', defaultValue: 75, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Fill Color', type: 'color', defaultValue: '#10B981', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 75), 0, 100);
      const color = params.color || '#10B981';
      const w = actual * 0.76;
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 35' width='100%' height='100%'>
  <rect x='4' y='6' width='82' height='23' rx='5' fill='none' stroke='#1E293B' stroke-width='2.5' />
  <rect x='88' y='12' width='5' height='11' rx='2' fill='#1E293B' />
  <rect x='7' y='9' width='${w.toFixed(1)}' height='17' rx='3' fill='${color}' />
  <text x='45' y='21' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='11' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Battery_Indicator') => {
      return buildDaxMeasure({
        measureName,
        description: 'Battery level indicator showing capacity or progress percentage.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 75, type: 'number', comment: 'Replace with [Capacity %]' },
          { name: '_Color', value: params.color || '#10B981', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_FillWidth', expression: 'ROUND( _Normalized * 76, 1 )' },
        ],
        svgElements: [
          { name: '_Shell', expression: '"<rect x=\'4\' y=\'6\' width=\'82\' height=\'23\' rx=\'5\' fill=\'none\' stroke=\'#1E293B\' stroke-width=\'2.5\'/><rect x=\'88\' y=\'12\' width=\'5\' height=\'11\' rx=\'2\' fill=\'#1E293B\'/>"' },
          { name: '_Bar', expression: '"<rect x=\'7\' y=\'9\' width=\'" & _FillWidth & "\' height=\'17\' rx=\'3\' fill=\'" & _Color & "\'/>"' },
          { name: '_Label', expression: '"<text x=\'45\' y=\'21\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'11\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 35',
      });
    },
  },

  {
    id: 'kpi-thermometer',
    name: 'Vertical Thermometer',
    category: 'kpi',
    description: 'Vertical mercury thermometer showing progress against a scale.',
    tags: ['thermometer', 'mercury', 'vertical', 'temperature', 'goal'],
    viewBox: '0 0 45 100',
    recommendedDimensions: { width: 45, height: 100 },
    pbiTips: {
      visualType: 'Table / Matrix / Card',
      recommendedWidth: 40,
      recommendedHeight: 80,
      notes: 'Classic fundraising or sales target thermometer.',
    },
    params: [
      { id: 'actual', label: 'Fill (%)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Mercury Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 65), 0, 100);
      const color = params.color || '#EF4444';
      const fillHeight = actual * 0.55;
      const topY = 65 - fillHeight;
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 45 100' width='100%' height='100%'>
  <rect x='17' y='8' width='11' height='62' rx='5.5' fill='#E2E8F0' />
  <circle cx='22.5' cy='78' r='14' fill='${color}' />
  <rect x='18' y='${topY.toFixed(1)}' width='9' height='${(78 - topY).toFixed(1)}' fill='${color}' />
  <circle cx='22.5' cy='78' r='10' fill='${color}' />
  <text x='22.5' y='82' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='9.5' font-weight='900' fill='#FFFFFF'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Thermometer') => {
      return buildDaxMeasure({
        measureName,
        description: 'Vertical mercury thermometer progress visual.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 65, type: 'number' },
          { name: '_Color', value: params.color || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_TopY', expression: 'ROUND( 65 - ( _Normalized * 55 ), 1 )' },
          { name: '_StemHeight', expression: 'ROUND( 78 - _TopY, 1 )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<rect x=\'17\' y=\'8\' width=\'11\' height=\'62\' rx=\'5.5\' fill=\'#E2E8F0\'/><circle cx=\'22.5\' cy=\'78\' r=\'14\' fill=\'" & _Color & "\'/>"' },
          { name: '_Stem', expression: '"<rect x=\'18\' y=\'" & _TopY & "\' width=\'9\' height=\'" & _StemHeight & "\' fill=\'" & _Color & "\'/>"' },
          { name: '_Text', expression: '"<text x=\'22.5\' y=\'82\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'9.5\' font-weight=\'900\' fill=\'#FFFFFF\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 45 100',
      });
    },
  },

  {
    id: 'kpi-signal-bars',
    name: 'Signal Strength Bars',
    category: 'kpi',
    description: '4-bar mobile signal strength indicator representing quality, tier or connectivity (1-4 bars).',
    tags: ['signal', 'bars', 'wifi', 'cellular', 'quality', 'kpi'],
    viewBox: '0 0 60 40',
    recommendedDimensions: { width: 60, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 50,
      recommendedHeight: 35,
      notes: 'Clean status visual for connectivity, data freshness, or tier ratings (1 to 4).',
    },
    params: [
      { id: 'bars', label: 'Active Bars (1-4)', type: 'number', defaultValue: 3, min: 0, max: 4, step: 1, daxVarName: '_Bars' },
      { id: 'color', label: 'Signal Color', type: 'color', defaultValue: '#3B82F6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const active = clamp(Number(params.bars ?? 3), 0, 4);
      const color = params.color || '#3B82F6';
      const heights = [8, 14, 21, 28];
      const barsSvg = heights.map((h, i) => {
        const isFilled = i < active;
        const x = 8 + i * 12;
        const y = 34 - h;
        return `<rect x='${x}' y='${y}' width='7' height='${h}' rx='2' fill='${isFilled ? color : '#E2E8F0'}' />`;
      });
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40' width='100%' height='100%'>
  ${barsSvg.join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Signal_Bars') => {
      return buildDaxMeasure({
        measureName,
        description: '4-bar cellular signal strength visual.',
        configVars: [
          { name: '_Bars', value: params.bars ?? 3, type: 'number', comment: 'Replace with score (0 to 4)' },
          { name: '_Color', value: params.color || '#3B82F6', type: 'color' },
        ],
        svgElements: [
          {
            name: '_BarsMarkup',
            expression: `"<rect x='8' y='26' width='7' height='8' rx='2' fill='" & IF( _Bars >= 1, _Color, "#E2E8F0" ) & "'/>" &
    "<rect x='20' y='20' width='7' height='14' rx='2' fill='" & IF( _Bars >= 2, _Color, "#E2E8F0" ) & "'/>" &
    "<rect x='32' y='13' width='7' height='21' rx='2' fill='" & IF( _Bars >= 3, _Color, "#E2E8F0" ) & "'/>" &
    "<rect x='44' y='6' width='7' height='28' rx='2' fill='" & IF( _Bars >= 4, _Color, "#E2E8F0" ) & "'/>"`,
          },
        ],
        viewBox: '0 0 60 40',
      });
    },
  },

  // =========================================================================
  // 2. GAUGES & DIALS (8 visuals)
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
  <path d='M 14,48 A 36 36 0 0 1 86,48' fill='none' stroke='${trackColor}' stroke-width='${thickness}' stroke-linecap='round' />
  <path d='M 14,48 A 36 36 0 0 1 86,48' fill='none' stroke='${color}' stroke-width='${thickness}' stroke-dasharray='${arcLength.toFixed(2)}' stroke-dashoffset='${fillOffset.toFixed(2)}' stroke-linecap='round' />
  <text x='50' y='60' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='17' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Gauge_With_Track') => {
      return buildDaxMeasure({
        measureName,
        description: 'Semicircular gauge with background track and bold percentage callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 55, type: 'number', comment: 'Actual percentage (0 to 100)' },
          { name: '_Color', value: params.color || '#FACC15', type: 'color' },
          { name: '_TrackColor', value: params.trackColor || '#E2E8F0', type: 'color' },
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
  <path d='M 14,50 A 36 36 0 0 1 86,50' fill='none' stroke='${outlineColor}' stroke-width='3.5' stroke-linecap='round' />
  <path d='M 14,50 A 36 36 0 0 1 86,50' fill='none' stroke='${color}' stroke-width='10' stroke-dasharray='${arcLength.toFixed(2)}' stroke-dashoffset='${fillOffset.toFixed(2)}' stroke-linecap='round' opacity='0.7' />
  <line x1='50' y1='50' x2='${nx.toFixed(1)}' y2='${ny.toFixed(1)}' stroke='${needleColor}' stroke-width='2.5' stroke-linecap='round' />
  <circle cx='50' cy='50' r='3.5' fill='${needleColor}' />
  <text x='50' y='64' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='15' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Gauge_With_Outline') => {
      return buildDaxMeasure({
        measureName,
        description: 'Semicircular gauge with outline rim, tinted progress sector, dynamic needle, and percentage callout.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 55, type: 'number' },
          { name: '_Color', value: params.color || '#FEF08A', type: 'color' },
          { name: '_RimColor', value: params.outlineColor || '#64748B', type: 'color' },
          { name: '_NeedleColor', value: params.needleColor || '#0F172A', type: 'color' },
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
          { name: '_Actual', value: params.actual ?? 40, type: 'number' },
          { name: '_Target', value: params.target ?? 53, type: 'number' },
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

  {
    id: 'gauge-horseshoe-270',
    name: '270° Horseshoe Dial',
    category: 'gauge',
    description: 'Wide 270-degree radial dial wrapping three-quarters of a circle with center percentage.',
    tags: ['gauge', 'horseshoe', 'dial', '270', 'radial', 'kpi'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 70, height: 70 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 70,
      recommendedHeight: 70,
      notes: 'Provides a larger visual sweep than a 180-degree half gauge.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 70, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Dial Color', type: 'color', defaultValue: '#F97316', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 70), 0, 100);
      const color = params.color || '#F97316';
      const r = 36;
      const c = 2 * Math.PI * r * 0.75; // 270 deg
      const fullCircumference = 2 * Math.PI * r;
      const offset = fullCircumference * 0.75 * (1 - actual / 100);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='#E2E8F0' stroke-width='8' stroke-dasharray='${c.toFixed(2)} ${fullCircumference.toFixed(2)}' stroke-linecap='round' transform='rotate(135 50 50)' />
  <circle cx='50' cy='50' r='${r}' fill='none' stroke='${color}' stroke-width='8' stroke-dasharray='${c.toFixed(2)} ${fullCircumference.toFixed(2)}' stroke-dashoffset='${offset.toFixed(2)}' stroke-linecap='round' transform='rotate(135 50 50)' />
  <text x='50' y='57' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='19' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Horseshoe_Dial') => {
      return buildDaxMeasure({
        measureName,
        description: '270-degree horseshoe dial with center percentage metric.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 70, type: 'number' },
          { name: '_Color', value: params.color || '#F97316', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_Radius', expression: '36' },
          { name: '_FullCircumference', expression: '2 * PI() * _Radius' },
          { name: '_ArcSweep', expression: '_FullCircumference * 0.75' },
          { name: '_DashOffset', expression: '_ArcSweep * ( 1 - _Normalized )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'#E2E8F0\' stroke-width=\'8\' stroke-dasharray=\'" & ROUND( _ArcSweep, 2 ) & " " & ROUND( _FullCircumference, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(135 50 50)\'/>"' },
          { name: '_Arc', expression: '"<circle cx=\'50\' cy=\'50\' r=\'" & _Radius & "\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'8\' stroke-dasharray=\'" & ROUND( _ArcSweep, 2 ) & " " & ROUND( _FullCircumference, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _DashOffset, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(135 50 50)\'/>"' },
          { name: '_Text', expression: '"<text x=\'50\' y=\'57\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'19\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'gauge-dual-needle',
    name: 'Dual Needle Comparison Gauge',
    category: 'gauge',
    description: 'Semicircular dial with two needle indicators comparing Actual performance against Target.',
    tags: ['gauge', 'needle', 'comparison', 'target', 'actual', 'dial'],
    viewBox: '0 0 100 68',
    recommendedDimensions: { width: 100, height: 68 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 90,
      recommendedHeight: 65,
      notes: 'Black needle shows Actual; colored needle shows Target or Benchmark.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 62, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'target', label: 'Target (%)', type: 'number', defaultValue: 80, min: 0, max: 100, step: 1, daxVarName: '_Target' },
      { id: 'actualColor', label: 'Actual Color', type: 'color', defaultValue: '#0F172A', daxVarName: '_ActualColor' },
      { id: 'targetColor', label: 'Target Color', type: 'color', defaultValue: '#EF4444', daxVarName: '_TargetColor' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 62), 0, 100);
      const target = clamp(Number(params.target ?? 80), 0, 100);
      const aColor = params.actualColor || '#0F172A';
      const tColor = params.targetColor || '#EF4444';

      const aRad = (180 - actual * 1.8) * (Math.PI / 180);
      const tRad = (180 - target * 1.8) * (Math.PI / 180);
      const ax = 50 + 36 * Math.cos(aRad);
      const ay = 52 - 36 * Math.sin(aRad);
      const tx = 50 + 32 * Math.cos(tRad);
      const ty = 52 - 32 * Math.sin(tRad);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 68' width='100%' height='100%'>
  <path d='M 14,52 A 36 36 0 0 1 86,52' fill='none' stroke='#E2E8F0' stroke-width='6' stroke-linecap='round' />
  <line x1='50' y1='52' x2='${tx.toFixed(1)}' y2='${ty.toFixed(1)}' stroke='${tColor}' stroke-width='2' stroke-linecap='round' stroke-dasharray='2,2' />
  <line x1='50' y1='52' x2='${ax.toFixed(1)}' y2='${ay.toFixed(1)}' stroke='${aColor}' stroke-width='2.8' stroke-linecap='round' />
  <circle cx='50' cy='52' r='4' fill='${aColor}' />
  <text x='50' y='65' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='11' font-weight='800' fill='#1E293B'>Act: ${Math.round(actual)}% | Tgt: ${Math.round(target)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Dual_Needle_Gauge') => {
      return buildDaxMeasure({
        measureName,
        description: 'Dual needle gauge comparing Actual vs Target pointers.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 62, type: 'number' },
          { name: '_Target', value: params.target ?? 80, type: 'number' },
          { name: '_ActualColor', value: params.actualColor || '#0F172A', type: 'color' },
          { name: '_TargetColor', value: params.targetColor || '#EF4444', type: 'color' },
        ],
        calcVars: [
          { name: '_ARad', expression: '( 180 - ( MIN( 1, DIVIDE( _Actual, 100, 0 ) ) * 180 ) ) * ( PI() / 180 )' },
          { name: '_TRad', expression: '( 180 - ( MIN( 1, DIVIDE( _Target, 100, 0 ) ) * 180 ) ) * ( PI() / 180 )' },
          { name: '_AX', expression: 'ROUND( 50 + 36 * COS( _ARad ), 1 )' },
          { name: '_AY', expression: 'ROUND( 52 - 36 * SIN( _ARad ), 1 )' },
          { name: '_TX', expression: 'ROUND( 50 + 32 * COS( _TRad ), 1 )' },
          { name: '_TY', expression: 'ROUND( 52 - 32 * SIN( _TRad ), 1 )' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<path d=\'M 14,52 A 36 36 0 0 1 86,52\' fill=\'none\' stroke=\'#E2E8F0\' stroke-width=\'6\' stroke-linecap=\'round\'/>"' },
          { name: '_TargetNeedle', expression: '"<line x1=\'50\' y1=\'52\' x2=\'" & _TX & "\' y2=\'" & _TY & "\' stroke=\'" & _TargetColor & "\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-dasharray=\'2,2\'/>"' },
          { name: '_ActualNeedle', expression: '"<line x1=\'50\' y1=\'52\' x2=\'" & _AX & "\' y2=\'" & _AY & "\' stroke=\'" & _ActualColor & "\' stroke-width=\'2.8\' stroke-linecap=\'round\'/><circle cx=\'50\' cy=\'52\' r=\'4\' fill=\'" & _ActualColor & "\'/>"' },
          { name: '_Label', expression: '"<text x=\'50\' y=\'65\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'11\' font-weight=\'800\' fill=\'#1E293B\'>Act: " & FORMAT( _Actual, "0" ) & "% | Tgt: " & FORMAT( _Target, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 68',
      });
    },
  },

  {
    id: 'gauge-linear-slider',
    name: 'Horizontal Linear Gauge',
    category: 'gauge',
    description: 'Horizontal linear slider meter with gradient track, pointer indicator, and numerical value.',
    tags: ['linear', 'gauge', 'slider', 'meter', 'horizontal'],
    viewBox: '0 0 120 36',
    recommendedDimensions: { width: 120, height: 36 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 110,
      recommendedHeight: 36,
      notes: 'Compact linear gauge alternative to semicircular dials.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Pointer Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 65), 0, 100);
      const color = params.color || '#8B5CF6';
      const pointerX = 10 + actual * 0.8;

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 36' width='100%' height='100%'>
  <rect x='10' y='14' width='80' height='8' rx='4' fill='#E2E8F0' />
  <rect x='10' y='14' width='${(actual * 0.8).toFixed(1)}' height='8' rx='4' fill='${color}' />
  <polygon points='${pointerX},7 ${pointerX - 4},13 ${pointerX + 4},13' fill='#1E293B' />
  <text x='100' y='21' font-family='Segoe UI, sans-serif' font-size='12' font-weight='900' fill='#1E293B'>${Math.round(actual)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Linear_Gauge') => {
      return buildDaxMeasure({
        measureName,
        description: 'Horizontal linear gauge meter with pointer.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 65, type: 'number' },
          { name: '_Color', value: params.color || '#8B5CF6', type: 'color' },
        ],
        calcVars: [
          { name: '_Normalized', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_BarWidth', expression: 'ROUND( _Normalized * 80, 1 )' },
          { name: '_PX', expression: '10 + _BarWidth' },
        ],
        svgElements: [
          { name: '_Track', expression: '"<rect x=\'10\' y=\'14\' width=\'80\' height=\'8\' rx=\'4\' fill=\'#E2E8F0\'/>"' },
          { name: '_Fill', expression: '"<rect x=\'10\' y=\'14\' width=\'" & _BarWidth & "\' height=\'8\' rx=\'4\' fill=\'" & _Color & "\'/>"' },
          { name: '_Pointer', expression: '"<polygon points=\'" & _PX & ",7 " & ( _PX - 4 ) & ",13 " & ( _PX + 4 ) & ",13\' fill=\'#1E293B\'/>"' },
          { name: '_Text', expression: '"<text x=\'100\' y=\'21\' font-family=\'Segoe UI, sans-serif\' font-size=\'12\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _Actual, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 120 36',
      });
    },
  },

  // =========================================================================
  // 3. LINES & SPARKLINES (7 visuals)
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

  {
    id: 'sparkline-stepped',
    name: 'Stepped Trend Staircase',
    category: 'line',
    description: 'Step-after discrete staircase sparkline ideal for pricing tiers or rate changes.',
    tags: ['stepped', 'sparkline', 'stairs', 'discrete', 'trend'],
    viewBox: '0 0 120 40',
    recommendedDimensions: { width: 120, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 40,
      notes: 'Best for discrete stage transitions or interest rate history.',
    },
    params: [
      { id: 'color', label: 'Step Line Color', type: 'color', defaultValue: '#059669', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const color = params.color || '#059669';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40' width='100%' height='100%'>
  <path d='M 10,32 H 35 V 24 H 65 V 15 H 90 V 8 H 112' fill='none' stroke='${color}' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' />
  <circle cx='112' cy='8' r='3.5' fill='${color}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Stepped_Sparkline') => {
      return buildDaxMeasure({
        measureName,
        description: 'Stepped staircase trend line for discrete rate changes.',
        configVars: [
          { name: '_Color', value: params.color || '#059669', type: 'color' },
        ],
        svgElements: [
          { name: '_Stairs', expression: '"<path d=\'M 10,32 H 35 V 24 H 65 V 15 H 90 V 8 H 112\' fill=\'none\' stroke=\'" & _Color & "\' stroke-width=\'2.2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/><circle cx=\'112\' cy=\'8\' r=\'3.5\' fill=\'" & _Color & "\'/>"' },
        ],
        viewBox: '0 0 120 40',
      });
    },
  },

  {
    id: 'sparkline-endpoints',
    name: 'Start/End Range Line',
    category: 'line',
    description: 'Minimalist sparkline showing starting dot, baseline connecting line, and ending dot with percentage change.',
    tags: ['endpoints', 'sparkline', 'delta', 'trend', 'minimal'],
    viewBox: '0 0 120 35',
    recommendedDimensions: { width: 120, height: 35 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 35,
      notes: 'Highlights start-to-end variance clearly without intermediate noise.',
    },
    params: [
      { id: 'delta', label: 'Delta (%)', type: 'number', defaultValue: 18.5, step: 0.1, daxVarName: '_Delta' },
      { id: 'color', label: 'Line Color', type: 'color', defaultValue: '#3B82F6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const delta = Number(params.delta ?? 18.5);
      const color = params.color || '#3B82F6';
      const isPos = delta >= 0;
      const endY = isPos ? 10 : 25;
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 35' width='100%' height='100%'>
  <line x1='15' y1='22' x2='75' y2='${endY}' stroke='${color}' stroke-width='2' stroke-linecap='round' />
  <circle cx='15' cy='22' r='3.5' fill='#94A3B8' />
  <circle cx='75' cy='${endY}' r='4' fill='${color}' />
  <text x='84' y='${endY + 4}' font-family='Segoe UI, sans-serif' font-size='11' font-weight='900' fill='${color}'>${delta > 0 ? '+' : ''}${delta.toFixed(1)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Endpoints_Sparkline') => {
      return buildDaxMeasure({
        measureName,
        description: 'Start/End endpoint variance sparkline with delta label.',
        configVars: [
          { name: '_Delta', value: params.delta ?? 18.5, type: 'number' },
          { name: '_Color', value: params.color || '#3B82F6', type: 'color' },
        ],
        calcVars: [
          { name: '_EndY', expression: 'IF( _Delta >= 0, 10, 25 )' },
          { name: '_Label', expression: 'IF( _Delta > 0, "+", "" ) & FORMAT( _Delta, "0.0" ) & "%"' },
        ],
        svgElements: [
          { name: '_Line', expression: '"<line x1=\'15\' y1=\'22\' x2=\'75\' y2=\'" & _EndY & "\' stroke=\'" & _Color & "\' stroke-width=\'2\' stroke-linecap=\'round\'/><circle cx=\'15\' cy=\'22\' r=\'3.5\' fill=\'#94A3B8\'/><circle cx=\'75\' cy=\'" & _EndY & "\' r=\'4\' fill=\'" & _Color & "\'/>"' },
          { name: '_Text', expression: '"<text x=\'84\' y=\'" & ( _EndY + 4 ) & "\' font-family=\'Segoe UI, sans-serif\' font-size=\'11\' font-weight=\'900\' fill=\'" & _Color & "\'>" & _Label & "</text>"' },
        ],
        viewBox: '0 0 120 35',
      });
    },
  },

  {
    id: 'sparkline-lollipop',
    name: 'Lollipop Trend Chart',
    category: 'line',
    description: 'Vertical stem lollipop visual with highlighted dots showing category distribution.',
    tags: ['lollipop', 'stem', 'dots', 'trend', 'distribution'],
    viewBox: '0 0 120 40',
    recommendedDimensions: { width: 120, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 40,
      notes: 'Based on Kurt Buhler / Data Goblins lollipop pattern for variance callouts.',
    },
    params: [
      { id: 'color', label: 'Dot Color', type: 'color', defaultValue: '#EC4899', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const color = params.color || '#EC4899';
      const points = [
        { x: 15, y: 18 },
        { x: 35, y: 26 },
        { x: 55, y: 12 },
        { x: 75, y: 22 },
        { x: 95, y: 8 },
      ];
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40' width='100%' height='100%'>
  <line x1='8' y1='34' x2='112' y2='34' stroke='#CBD5E1' stroke-width='1.5' />
  ${points.map((p) => `<line x1='${p.x}' y1='34' x2='${p.x}' y2='${p.y}' stroke='#CBD5E1' stroke-width='1.5' /><circle cx='${p.x}' cy='${p.y}' r='3.5' fill='${color}' />`).join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Lollipop_Trend') => {
      return buildDaxMeasure({
        measureName,
        description: 'Lollipop stem sparkline for discrete trend points.',
        configVars: [
          { name: '_Color', value: params.color || '#EC4899', type: 'color' },
        ],
        svgElements: [
          {
            name: '_Stems',
            expression: `"<line x1='8' y1='34' x2='112' y2='34' stroke='#CBD5E1' stroke-width='1.5'/>" &
    "<line x1='15' y1='34' x2='15' y2='18' stroke='#CBD5E1' stroke-width='1.5'/><circle cx='15' cy='18' r='3.5' fill='" & _Color & "'/>" &
    "<line x1='35' y1='34' x2='35' y2='26' stroke='#CBD5E1' stroke-width='1.5'/><circle cx='35' cy='26' r='3.5' fill='" & _Color & "'/>" &
    "<line x1='55' y1='34' x2='55' y2='12' stroke='#CBD5E1' stroke-width='1.5'/><circle cx='55' cy='12' r='3.5' fill='" & _Color & "'/>" &
    "<line x1='75' y1='34' x2='75' y2='22' stroke='#CBD5E1' stroke-width='1.5'/><circle cx='75' cy='22' r='3.5' fill='" & _Color & "'/>" &
    "<line x1='95' y1='34' x2='95' y2='8' stroke='#CBD5E1' stroke-width='1.5'/><circle cx='95' cy='8' r='3.5' fill='" & _Color & "'/>"`,
          },
        ],
        viewBox: '0 0 120 40',
      });
    },
  },

  // =========================================================================
  // 4. BARS & BULLETS (7 visuals)
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

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 30' width='100%' height='100%'>
  <rect x='10' y='6' width='100' height='18' rx='3' fill='#F1F5F9' />
  <rect x='10' y='8' width='${actual}' height='14' rx='2' fill='${barColor}' />
  <line x1='${10 + target}' y1='4' x2='${10 + target}' y2='26' stroke='${targetColor}' stroke-width='2.5' />
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
  <rect x='4' y='6' width='${w.toFixed(1)}' height='12' rx='6' fill='${color}' />
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

  {
    id: 'bar-overlapping-benchmark',
    name: 'Overlapping Actual vs Budget',
    category: 'bar',
    description: 'Overlapping bars comparing full budget outline with inner actual progress bar.',
    tags: ['overlapping', 'budget', 'benchmark', 'bar', 'variance'],
    viewBox: '0 0 120 30',
    recommendedDimensions: { width: 120, height: 30 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 30,
      notes: 'Based on Kurt Buhler / Data Goblins overlapping bars pattern.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 72, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'budget', label: 'Budget (%)', type: 'number', defaultValue: 90, min: 0, max: 100, step: 1, daxVarName: '_Budget' },
      { id: 'color', label: 'Actual Bar Color', type: 'color', defaultValue: '#2563EB', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 72), 0, 100);
      const budget = clamp(Number(params.budget ?? 90), 0, 100);
      const color = params.color || '#2563EB';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 30' width='100%' height='100%'>
  <rect x='10' y='6' width='${budget}' height='18' rx='4' fill='#E2E8F0' />
  <rect x='10' y='10' width='${actual}' height='10' rx='2' fill='${color}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Overlapping_Bars') => {
      return buildDaxMeasure({
        measureName,
        description: 'Overlapping actual vs budget progress bars.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 72, type: 'number' },
          { name: '_Budget', value: params.budget ?? 90, type: 'number' },
          { name: '_Color', value: params.color || '#2563EB', type: 'color' },
        ],
        calcVars: [
          { name: '_ActualW', expression: 'MIN( 100, MAX( 0, _Actual ) )' },
          { name: '_BudgetW', expression: 'MIN( 100, MAX( 0, _Budget ) )' },
        ],
        svgElements: [
          { name: '_BudgetBar', expression: '"<rect x=\'10\' y=\'6\' width=\'" & _BudgetW & "\' height=\'18\' rx=\'4\' fill=\'#E2E8F0\'/>"' },
          { name: '_ActualBar', expression: '"<rect x=\'10\' y=\'10\' width=\'" & _ActualW & "\' height=\'10\' rx=\'2\' fill=\'" & _Color & "\'/>"' },
        ],
        viewBox: '0 0 120 30',
      });
    },
  },

  {
    id: 'bar-stacked-100',
    name: '100% Stacked Proportion Bar',
    category: 'bar',
    description: 'Horizontal two-segment stacked bar showing proportion between 2 metrics (e.g. Online vs Store).',
    tags: ['stacked', 'proportion', 'part-to-whole', 'bar'],
    viewBox: '0 0 120 25',
    recommendedDimensions: { width: 120, height: 25 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 25,
      notes: 'Shows clean 2-segment proportional split.',
    },
    params: [
      { id: 'shareA', label: 'Segment A Share (%)', type: 'number', defaultValue: 60, min: 0, max: 100, step: 1, daxVarName: '_ShareA' },
      { id: 'colorA', label: 'Segment A Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_ColorA' },
      { id: 'colorB', label: 'Segment B Color', type: 'color', defaultValue: '#38BDF8', daxVarName: '_ColorB' },
    ],
    renderSvg: (params) => {
      const shareA = clamp(Number(params.shareA ?? 60), 0, 100);
      const colorA = params.colorA || '#8B5CF6';
      const colorB = params.colorB || '#38BDF8';
      const wA = shareA;
      const wB = 100 - shareA;
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 25' width='100%' height='100%'>
  <rect x='10' y='6' width='${wA}' height='14' rx='3' fill='${colorA}' />
  <rect x='${10 + wA}' y='6' width='${wB}' height='14' rx='3' fill='${colorB}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Stacked_Proportion') => {
      return buildDaxMeasure({
        measureName,
        description: '100% stacked two-segment proportion bar.',
        configVars: [
          { name: '_ShareA', value: params.shareA ?? 60, type: 'number' },
          { name: '_ColorA', value: params.colorA || '#8B5CF6', type: 'color' },
          { name: '_ColorB', value: params.colorB || '#38BDF8', type: 'color' },
        ],
        calcVars: [
          { name: '_WidthA', expression: 'MIN( 100, MAX( 0, _ShareA ) )' },
          { name: '_WidthB', expression: '100 - _WidthA' },
        ],
        svgElements: [
          { name: '_SegmentA', expression: '"<rect x=\'10\' y=\'6\' width=\'" & _WidthA & "\' height=\'14\' rx=\'3\' fill=\'" & _ColorA & "\'/>"' },
          { name: '_SegmentB', expression: '"<rect x=\'" & ( 10 + _WidthA ) & "\' y=\'6\' width=\'" & _WidthB & "\' height=\'14\' rx=\'3\' fill=\'" & _ColorB & "\'/>"' },
        ],
        viewBox: '0 0 120 25',
      });
    },
  },

  {
    id: 'bar-dumbbell-chart',
    name: 'Dumbbell Comparison Chart',
    category: 'bar',
    description: 'Dumbbell bar connecting baseline and current values with a connector line and colored circles.',
    tags: ['dumbbell', 'barbell', 'comparison', 'growth', 'delta'],
    viewBox: '0 0 120 30',
    recommendedDimensions: { width: 120, height: 30 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 30,
      notes: 'Excellent for showing change from Prior Year to Current Year.',
    },
    params: [
      { id: 'startVal', label: 'Start Value (%)', type: 'number', defaultValue: 35, min: 0, max: 100, step: 1, daxVarName: '_Start' },
      { id: 'endVal', label: 'End Value (%)', type: 'number', defaultValue: 75, min: 0, max: 100, step: 1, daxVarName: '_End' },
      { id: 'color', label: 'Current Dot Color', type: 'color', defaultValue: '#10B981', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const s = clamp(Number(params.startVal ?? 35), 0, 100);
      const e = clamp(Number(params.endVal ?? 75), 0, 100);
      const color = params.color || '#10B981';
      const x1 = 10 + s;
      const x2 = 10 + e;
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 30' width='100%' height='100%'>
  <line x1='${x1}' y1='15' x2='${x2}' y2='15' stroke='#94A3B8' stroke-width='3' stroke-linecap='round' />
  <circle cx='${x1}' cy='15' r='5' fill='#94A3B8' />
  <circle cx='${x2}' cy='15' r='6' fill='${color}' stroke='#FFFFFF' stroke-width='1.5' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Dumbbell_Chart') => {
      return buildDaxMeasure({
        measureName,
        description: 'Dumbbell comparison visual connecting baseline and current points.',
        configVars: [
          { name: '_Start', value: params.startVal ?? 35, type: 'number' },
          { name: '_End', value: params.endVal ?? 75, type: 'number' },
          { name: '_Color', value: params.color || '#10B981', type: 'color' },
        ],
        calcVars: [
          { name: '_X1', expression: '10 + MIN( 100, MAX( 0, _Start ) )' },
          { name: '_X2', expression: '10 + MIN( 100, MAX( 0, _End ) )' },
        ],
        svgElements: [
          { name: '_Connector', expression: '"<line x1=\'" & _X1 & "\' y1=\'15\' x2=\'" & _X2 & "\' y2=\'15\' stroke=\'#94A3B8\' stroke-width=\'3\' stroke-linecap=\'round\'/>"' },
          { name: '_Dots', expression: '"<circle cx=\'" & _X1 & "\' cy=\'15\' r=\'5\' fill=\'#94A3B8\'/><circle cx=\'" & _X2 & "\' cy=\'15\' r=\'6\' fill=\'" & _Color & "\' stroke=\'#FFFFFF\' stroke-width=\'1.5\'/>"' },
        ],
        viewBox: '0 0 120 30',
      });
    },
  },

  {
    id: 'bar-range-bullet',
    name: '3-Tier Benchmark Bullet',
    category: 'bar',
    description: 'Bullet chart featuring 3 qualitative benchmark background zones (Poor, Good, Excellent) with target and actual bar.',
    tags: ['bullet', 'qualitative', 'zones', 'benchmark', 'tiers'],
    viewBox: '0 0 120 30',
    recommendedDimensions: { width: 120, height: 30 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 120,
      recommendedHeight: 30,
      notes: 'Classic Stephen Few bullet chart with qualitative shading.',
    },
    params: [
      { id: 'actual', label: 'Actual (%)', type: 'number', defaultValue: 75, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'target', label: 'Target (%)', type: 'number', defaultValue: 85, min: 0, max: 100, step: 1, daxVarName: '_Target' },
    ],
    renderSvg: (params) => {
      const a = clamp(Number(params.actual ?? 75), 0, 100);
      const t = clamp(Number(params.target ?? 85), 0, 100);
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 30' width='100%' height='100%'>
  <rect x='10' y='6' width='100' height='18' fill='#F1F5F9' />
  <rect x='10' y='6' width='60' height='18' fill='#E2E8F0' />
  <rect x='10' y='6' width='30' height='18' fill='#CBD5E1' />
  <rect x='10' y='10' width='${a}' height='10' rx='1' fill='#1E293B' />
  <line x1='${10 + t}' y1='4' x2='${10 + t}' y2='26' stroke='#EF4444' stroke-width='2.5' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Tiered_Bullet') => {
      return buildDaxMeasure({
        measureName,
        description: 'Bullet chart with 3 qualitative shaded zones and target marker.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 75, type: 'number' },
          { name: '_Target', value: params.target ?? 85, type: 'number' },
        ],
        calcVars: [
          { name: '_ActualW', expression: 'MIN( 100, MAX( 0, _Actual ) )' },
          { name: '_TargetX', expression: '10 + MIN( 100, MAX( 0, _Target ) )' },
        ],
        svgElements: [
          { name: '_Zones', expression: '"<rect x=\'10\' y=\'6\' width=\'100\' height=\'18\' fill=\'#F1F5F9\'/><rect x=\'10\' y=\'6\' width=\'60\' height=\'18\' fill=\'#E2E8F0\'/><rect x=\'10\' y=\'6\' width=\'30\' height=\'18\' fill=\'#CBD5E1\'/>"' },
          { name: '_ActualBar', expression: '"<rect x=\'10\' y=\'10\' width=\'" & _ActualW & "\' height=\'10\' rx=\'1\' fill=\'#1E293B\'/>"' },
          { name: '_TargetMarker', expression: '"<line x1=\'" & _TargetX & "\' y1=\'4\' x2=\'" & _TargetX & "\' y2=\'26\' stroke=\'#EF4444\' stroke-width=\'2.5\'/>"' },
        ],
        viewBox: '0 0 120 30',
      });
    },
  },

  // =========================================================================
  // 5. DONUTS & RADIALS (5 visuals)
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

  {
    id: 'donut-concentric-dual',
    name: 'Concentric Dual Rings',
    category: 'donut',
    description: 'Nested dual progress rings (outer ring = Actual, inner ring = Benchmark or Prior Year).',
    tags: ['concentric', 'dual', 'nested', 'rings', 'donut', 'kpi'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 65, height: 65 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 65,
      recommendedHeight: 65,
      notes: 'Compact nested representation of 2 related percentages.',
    },
    params: [
      { id: 'actual', label: 'Outer (Actual %)', type: 'number', defaultValue: 82, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'target', label: 'Inner (Target %)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_Target' },
      { id: 'colorOuter', label: 'Outer Ring Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_ColorOut' },
      { id: 'colorInner', label: 'Inner Ring Color', type: 'color', defaultValue: '#38BDF8', daxVarName: '_ColorIn' },
    ],
    renderSvg: (params) => {
      const a = clamp(Number(params.actual ?? 82), 0, 100);
      const t = clamp(Number(params.target ?? 65), 0, 100);
      const cOut = params.colorOuter || '#8B5CF6';
      const cIn = params.colorInner || '#38BDF8';

      const r1 = 40;
      const r2 = 27;
      const c1 = 2 * Math.PI * r1;
      const c2 = 2 * Math.PI * r2;
      const off1 = c1 * (1 - a / 100);
      const off2 = c2 * (1 - t / 100);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r1}' fill='none' stroke='#E2E8F0' stroke-width='7' />
  <circle cx='50' cy='50' r='${r1}' fill='none' stroke='${cOut}' stroke-width='7' stroke-dasharray='${c1.toFixed(2)}' stroke-dashoffset='${off1.toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <circle cx='50' cy='50' r='${r2}' fill='none' stroke='#F1F5F9' stroke-width='6' />
  <circle cx='50' cy='50' r='${r2}' fill='none' stroke='${cIn}' stroke-width='6' stroke-dasharray='${c2.toFixed(2)}' stroke-dashoffset='${off2.toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Concentric_Dual_Rings') => {
      return buildDaxMeasure({
        measureName,
        description: 'Nested dual progress rings for Actual vs Target.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 82, type: 'number' },
          { name: '_Target', value: params.target ?? 65, type: 'number' },
          { name: '_ColorOut', value: params.colorOuter || '#8B5CF6', type: 'color' },
          { name: '_ColorIn', value: params.colorInner || '#38BDF8', type: 'color' },
        ],
        calcVars: [
          { name: '_NormOut', expression: 'MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) )' },
          { name: '_NormIn', expression: 'MIN( 1, MAX( 0, DIVIDE( _Target, 100, 0 ) ) )' },
          { name: '_C1', expression: '2 * PI() * 40' },
          { name: '_C2', expression: '2 * PI() * 27' },
          { name: '_Off1', expression: '_C1 * ( 1 - _NormOut )' },
          { name: '_Off2', expression: '_C2 * ( 1 - _NormIn )' },
        ],
        svgElements: [
          { name: '_OutRing', expression: '"<circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'#E2E8F0\' stroke-width=\'7\'/><circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'" & _ColorOut & "\' stroke-width=\'7\' stroke-dasharray=\'" & ROUND( _C1, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _Off1, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
          { name: '_InRing', expression: '"<circle cx=\'50\' cy=\'50\' r=\'27\' fill=\'none\' stroke=\'#F1F5F9\' stroke-width=\'6\'/><circle cx=\'50\' cy=\'50\' r=\'27\' fill=\'none\' stroke=\'" & _ColorIn & "\' stroke-width=\'6\' stroke-dasharray=\'" & ROUND( _C2, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _Off2, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  {
    id: 'donut-half-pie',
    name: 'Semicircular Split Donut',
    category: 'donut',
    description: 'Half-circle donut showing percentage split of two parts with labels.',
    tags: ['donut', 'split', 'semicircle', 'part-to-whole', 'kpi'],
    viewBox: '0 0 100 65',
    recommendedDimensions: { width: 90, height: 60 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 90,
      recommendedHeight: 60,
      notes: 'Shows 2-segment ratio inside a half-circle frame.',
    },
    params: [
      { id: 'shareA', label: 'Share A (%)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_ShareA' },
      { id: 'colorA', label: 'Color A', type: 'color', defaultValue: '#3B82F6', daxVarName: '_ColorA' },
      { id: 'colorB', label: 'Color B', type: 'color', defaultValue: '#F97316', daxVarName: '_ColorB' },
    ],
    renderSvg: (params) => {
      const shareA = clamp(Number(params.shareA ?? 65), 0, 100);
      const cA = params.colorA || '#3B82F6';
      const cB = params.colorB || '#F97316';
      const r = 36;
      const arcLen = Math.PI * r;
      const offA = arcLen * (1 - shareA / 100);

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 65' width='100%' height='100%'>
  <path d='M 14,48 A 36 36 0 0 1 86,48' fill='none' stroke='${cB}' stroke-width='10' stroke-linecap='round' />
  <path d='M 14,48 A 36 36 0 0 1 86,48' fill='none' stroke='${cA}' stroke-width='10' stroke-dasharray='${arcLen.toFixed(2)}' stroke-dashoffset='${offA.toFixed(2)}' stroke-linecap='round' />
  <text x='50' y='60' text-anchor='middle' font-family='Segoe UI, sans-serif' font-size='15' font-weight='900' fill='#1E293B'>${Math.round(shareA)}% / ${100 - Math.round(shareA)}%</text>
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Half_Split_Donut') => {
      return buildDaxMeasure({
        measureName,
        description: 'Semicircular split donut showing two-segment distribution.',
        configVars: [
          { name: '_ShareA', value: params.shareA ?? 65, type: 'number' },
          { name: '_ColorA', value: params.colorA || '#3B82F6', type: 'color' },
          { name: '_ColorB', value: params.colorB || '#F97316', type: 'color' },
        ],
        calcVars: [
          { name: '_NormA', expression: 'MIN( 1, MAX( 0, DIVIDE( _ShareA, 100, 0 ) ) )' },
          { name: '_ArcLen', expression: 'PI() * 36' },
          { name: '_OffA', expression: '_ArcLen * ( 1 - _NormA )' },
        ],
        svgElements: [
          { name: '_SegmentB', expression: '"<path d=\'M 14,48 A 36 36 0 0 1 86,48\' fill=\'none\' stroke=\'" & _ColorB & "\' stroke-width=\'10\' stroke-linecap=\'round\'/>"' },
          { name: '_SegmentA', expression: '"<path d=\'M 14,48 A 36 36 0 0 1 86,48\' fill=\'none\' stroke=\'" & _ColorA & "\' stroke-width=\'10\' stroke-dasharray=\'" & ROUND( _ArcLen, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _OffA, 2 ) & "\' stroke-linecap=\'round\'/>"' },
          { name: '_Label', expression: '"<text x=\'50\' y=\'60\' text-anchor=\'middle\' font-family=\'Segoe UI, sans-serif\' font-size=\'15\' font-weight=\'900\' fill=\'#1E293B\'>" & FORMAT( _ShareA, "0" ) & "% / " & FORMAT( 100 - _ShareA, "0" ) & "%</text>"' },
        ],
        viewBox: '0 0 100 65',
      });
    },
  },

  {
    id: 'donut-multi-ring',
    name: 'Triple Activity Ring',
    category: 'donut',
    description: 'Apple Fitness-style 3 concentric progress rings for tracking multiple goals simultaneously.',
    tags: ['activity', 'fitness', 'triple', 'concentric', 'goals', 'donut'],
    viewBox: '0 0 100 100',
    recommendedDimensions: { width: 70, height: 70 },
    pbiTips: {
      visualType: 'New Card / Table',
      recommendedWidth: 70,
      recommendedHeight: 70,
      notes: 'Tracks 3 related KPIs (e.g. Sales, Profit, Leads) in one single compact circle.',
    },
    params: [
      { id: 'ring1', label: 'Ring 1 (%)', type: 'number', defaultValue: 90, min: 0, max: 100, step: 1, daxVarName: '_R1' },
      { id: 'ring2', label: 'Ring 2 (%)', type: 'number', defaultValue: 65, min: 0, max: 100, step: 1, daxVarName: '_R2' },
      { id: 'ring3', label: 'Ring 3 (%)', type: 'number', defaultValue: 45, min: 0, max: 100, step: 1, daxVarName: '_R3' },
    ],
    renderSvg: (params) => {
      const v1 = clamp(Number(params.ring1 ?? 90), 0, 100);
      const v2 = clamp(Number(params.ring2 ?? 65), 0, 100);
      const v3 = clamp(Number(params.ring3 ?? 45), 0, 100);

      const r1 = 41; const r2 = 31; const r3 = 21;
      const c1 = 2 * Math.PI * r1;
      const c2 = 2 * Math.PI * r2;
      const c3 = 2 * Math.PI * r3;

      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <circle cx='50' cy='50' r='${r1}' fill='none' stroke='#EF4444' stroke-opacity='0.25' stroke-width='6' />
  <circle cx='50' cy='50' r='${r1}' fill='none' stroke='#EF4444' stroke-width='6' stroke-dasharray='${c1.toFixed(2)}' stroke-dashoffset='${(c1 * (1 - v1 / 100)).toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <circle cx='50' cy='50' r='${r2}' fill='none' stroke='#10B981' stroke-opacity='0.25' stroke-width='6' />
  <circle cx='50' cy='50' r='${r2}' fill='none' stroke='#10B981' stroke-width='6' stroke-dasharray='${c2.toFixed(2)}' stroke-dashoffset='${(c2 * (1 - v2 / 100)).toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
  <circle cx='50' cy='50' r='${r3}' fill='none' stroke='#38BDF8' stroke-opacity='0.25' stroke-width='6' />
  <circle cx='50' cy='50' r='${r3}' fill='none' stroke='#38BDF8' stroke-width='6' stroke-dasharray='${c3.toFixed(2)}' stroke-dashoffset='${(c3 * (1 - v3 / 100)).toFixed(2)}' stroke-linecap='round' transform='rotate(-90 50 50)' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Triple_Activity_Ring') => {
      return buildDaxMeasure({
        measureName,
        description: '3 concentric activity rings tracking three goals simultaneously.',
        configVars: [
          { name: '_R1', value: params.ring1 ?? 90, type: 'number' },
          { name: '_R2', value: params.ring2 ?? 65, type: 'number' },
          { name: '_R3', value: params.ring3 ?? 45, type: 'number' },
        ],
        calcVars: [
          { name: '_C1', expression: '2 * PI() * 41' },
          { name: '_C2', expression: '2 * PI() * 31' },
          { name: '_C3', expression: '2 * PI() * 21' },
          { name: '_Off1', expression: '_C1 * ( 1 - MIN( 1, DIVIDE( _R1, 100, 0 ) ) )' },
          { name: '_Off2', expression: '_C2 * ( 1 - MIN( 1, DIVIDE( _R2, 100, 0 ) ) )' },
          { name: '_Off3', expression: '_C3 * ( 1 - MIN( 1, DIVIDE( _R3, 100, 0 ) ) )' },
        ],
        svgElements: [
          { name: '_Ring1', expression: '"<circle cx=\'50\' cy=\'50\' r=\'41\' fill=\'none\' stroke=\'#EF4444\' stroke-opacity=\'0.25\' stroke-width=\'6\'/><circle cx=\'50\' cy=\'50\' r=\'41\' fill=\'none\' stroke=\'#EF4444\' stroke-width=\'6\' stroke-dasharray=\'" & ROUND( _C1, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _Off1, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
          { name: '_Ring2', expression: '"<circle cx=\'50\' cy=\'50\' r=\'31\' fill=\'none\' stroke=\'#10B981\' stroke-opacity=\'0.25\' stroke-width=\'6\'/><circle cx=\'50\' cy=\'50\' r=\'31\' fill=\'none\' stroke=\'#10B981\' stroke-width=\'6\' stroke-dasharray=\'" & ROUND( _C2, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _Off2, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
          { name: '_Ring3', expression: '"<circle cx=\'50\' cy=\'50\' r=\'21\' fill=\'none\' stroke=\'#38BDF8\' stroke-opacity=\'0.25\' stroke-width=\'6\'/><circle cx=\'50\' cy=\'50\' r=\'21\' fill=\'none\' stroke=\'#38BDF8\' stroke-width=\'6\' stroke-dasharray=\'" & ROUND( _C3, 2 ) & "\' stroke-dashoffset=\'" & ROUND( _Off3, 2 ) & "\' stroke-linecap=\'round\' transform=\'rotate(-90 50 50)\'/>"' },
        ],
        viewBox: '0 0 100 100',
      });
    },
  },

  // =========================================================================
  // 6. WAFFLES, RATINGS & DISCRETE INDICATORS (7 visuals)
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
    id: 'waffle-5x5-grid',
    name: '5x5 Micro Waffle Grid',
    category: 'waffle',
    description: 'Compact 25-dot waffle percentage grid designed for tighter table and matrix rows.',
    tags: ['waffle', '5x5', 'dots', 'compact', 'matrix'],
    viewBox: '0 0 60 60',
    recommendedDimensions: { width: 40, height: 40 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 40,
      recommendedHeight: 40,
      notes: 'Compact 25-unit grid (each dot represents 4%).',
    },
    params: [
      { id: 'actual', label: 'Progress (%)', type: 'number', defaultValue: 68, min: 0, max: 100, step: 1, daxVarName: '_Actual' },
      { id: 'color', label: 'Dot Color', type: 'color', defaultValue: '#8B5CF6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const actual = clamp(Number(params.actual ?? 68), 0, 100);
      const color = params.color || '#8B5CF6';
      const activeCount = Math.round((actual / 100) * 25);
      const dots: string[] = [];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const idx = r * 5 + c + 1;
          const isActive = idx <= activeCount;
          dots.push(`<circle cx='${8 + c * 11}' cy='${8 + r * 11}' r='4' fill='${isActive ? color : '#E2E8F0'}' />`);
        }
      }
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60' width='100%' height='100%'>
  ${dots.join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Waffle_5x5') => {
      return buildDaxMeasure({
        measureName,
        description: '5x5 compact 25-dot micro waffle chart.',
        configVars: [
          { name: '_Actual', value: params.actual ?? 68, type: 'number' },
          { name: '_Color', value: params.color || '#8B5CF6', type: 'color' },
        ],
        calcVars: [
          { name: '_ActiveDots', expression: 'ROUND( ( MIN( 1, MAX( 0, DIVIDE( _Actual, 100, 0 ) ) ) ) * 25, 0 )' },
        ],
        svgElements: [
          {
            name: '_Dots',
            expression: `CONCATENATEX(
        GENERATESERIES( 1, 25, 1 ),
        VAR _Idx = [Value]
        VAR _Col = MOD( _Idx - 1, 5 )
        VAR _Row = INT( ( _Idx - 1 ) / 5 )
        VAR _X = 8 + ( _Col * 11 )
        VAR _Y = 8 + ( _Row * 11 )
        VAR _Fill = IF( _Idx <= _ActiveDots, _Color, "#E2E8F0" )
        RETURN
            "<circle cx='" & _X & "' cy='" & _Y & "' r='4' fill='" & _Fill & "'/>",
        ""
    )`,
          },
        ],
        viewBox: '0 0 60 60',
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
    id: 'rating-5-circles',
    name: '5-Dot Rating Scale',
    category: 'waffle',
    description: 'Discrete 5-circle indicator bar for feedback scores or priority levels.',
    tags: ['rating', 'circles', 'dots', 'score', 'priority'],
    viewBox: '0 0 100 24',
    recommendedDimensions: { width: 100, height: 24 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 90,
      recommendedHeight: 24,
      notes: 'Minimalist alternative to stars for executive ratings.',
    },
    params: [
      { id: 'score', label: 'Score (1 to 5)', type: 'number', defaultValue: 3, min: 0, max: 5, step: 1, daxVarName: '_Score' },
      { id: 'color', label: 'Dot Color', type: 'color', defaultValue: '#3B82F6', daxVarName: '_Color' },
    ],
    renderSvg: (params) => {
      const score = clamp(Number(params.score ?? 3), 0, 5);
      const color = params.color || '#3B82F6';
      const dots: string[] = [];
      for (let i = 1; i <= 5; i++) {
        const isActive = i <= score;
        dots.push(`<circle cx='${10 + (i - 1) * 20}' cy='12' r='6' fill='${isActive ? color : '#E2E8F0'}' />`);
      }
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 24' width='100%' height='100%'>
  ${dots.join('\n  ')}
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Dot_Rating') => {
      return buildDaxMeasure({
        measureName,
        description: '5-dot discrete rating scale.',
        configVars: [
          { name: '_Score', value: params.score ?? 3, type: 'number' },
          { name: '_Color', value: params.color || '#3B82F6', type: 'color' },
        ],
        svgElements: [
          {
            name: '_Dots',
            expression: `CONCATENATEX(
        GENERATESERIES( 1, 5, 1 ),
        VAR _Idx = [Value]
        VAR _Fill = IF( _Idx <= _Score, _Color, "#E2E8F0" )
        VAR _CX = 10 + ( _Idx - 1 ) * 20
        RETURN
            "<circle cx='" & _CX & "' cy='12' r='6' fill='" & _Fill & "'/>",
        ""
    )`,
          },
        ],
        viewBox: '0 0 100 24',
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

  {
    id: 'status-traffic-light',
    name: '3-Light Traffic Signal',
    category: 'waffle',
    description: 'Vertical traffic light signal illuminating Red, Yellow, or Green according to metric status.',
    tags: ['traffic-light', 'status', 'signal', 'alert', 'discrete'],
    viewBox: '0 0 35 85',
    recommendedDimensions: { width: 35, height: 85 },
    pbiTips: {
      visualType: 'Table / Matrix',
      recommendedWidth: 30,
      recommendedHeight: 70,
      notes: 'Classic executive stoplight status indicator.',
    },
    params: [
      { id: 'status', label: 'Signal State (1=Red, 2=Yellow, 3=Green)', type: 'number', defaultValue: 3, min: 1, max: 3, step: 1, daxVarName: '_State' },
    ],
    renderSvg: (params) => {
      const state = Number(params.status ?? 3);
      const rFill = state === 1 ? '#EF4444' : '#334155';
      const yFill = state === 2 ? '#EAB308' : '#334155';
      const gFill = state === 3 ? '#10B981' : '#334155';
      return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 85' width='100%' height='100%'>
  <rect x='5' y='5' width='25' height='75' rx='12.5' fill='#0F172A' stroke='#334155' stroke-width='2' />
  <circle cx='17.5' cy='20' r='7.5' fill='${rFill}' />
  <circle cx='17.5' cy='42.5' r='7.5' fill='${yFill}' />
  <circle cx='17.5' cy='65' r='7.5' fill='${gFill}' />
</svg>`;
    },
    generateDax: (params, measureName = 'SVG_Traffic_Signal') => {
      return buildDaxMeasure({
        measureName,
        description: 'Vertical 3-lamp traffic light signal (1=Red, 2=Yellow, 3=Green).',
        configVars: [
          { name: '_State', value: params.status ?? 3, type: 'number', comment: '1 for Red, 2 for Yellow, 3 for Green' },
        ],
        svgElements: [
          {
            name: '_Lights',
            expression: `"<rect x='5' y='5' width='25' height='75' rx='12.5' fill='#0F172A' stroke='#334155' stroke-width='2'/>" &
    "<circle cx='17.5' cy='20' r='7.5' fill='" & IF( _State = 1, "#EF4444", "#334155" ) & "'/>" &
    "<circle cx='17.5' cy='42.5' r='7.5' fill='" & IF( _State = 2, "#EAB308", "#334155" ) & "'/>" &
    "<circle cx='17.5' cy='65' r='7.5' fill='" & IF( _State = 3, "#10B981", "#334155" ) & "'/>"`,
          },
        ],
        viewBox: '0 0 35 85',
      });
    },
  },
];

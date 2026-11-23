import { DenebSpecTemplate, DenebCategory } from './types';

export const DENEB_CATEGORIES: Array<{ id: DenebCategory | 'all'; label: string; badge: string }> = [
  { id: 'all', label: 'All Templates', badge: '20' },
  { id: 'kpi', label: 'KPI & Target Tracking', badge: '4' },
  { id: 'distribution', label: 'Distribution & Stats', badge: '4' },
  { id: 'ranking', label: 'Comparison & Ranking', badge: '4' },
  { id: 'part-to-whole', label: 'Part-to-Whole & Composition', badge: '4' },
  { id: 'trends', label: 'Time Series & Trends', badge: '4' },
];

export const DENEB_CATALOG: DenebSpecTemplate[] = [
  // =========================================================================
  // 1. KPI & Target Tracking
  // =========================================================================
  {
    id: 'bullet-chart',
    name: 'Executive Bullet Chart',
    description: 'Stephen Few compliant bullet graph with actual value bar, target marker line, and qualitative performance bands (60%, 85%, 100%).',
    category: 'kpi',
    badge: 'Executive',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Category', type: 'Column', dataType: 'nominal', description: 'Dimension (e.g. Region, Business Unit)' },
      { name: 'Actual', type: 'Measure', dataType: 'quantitative', description: 'Actual performance metric' },
      { name: 'Target', type: 'Measure', dataType: 'quantitative', description: 'Budget or target quota' },
      { name: 'MaxRange', type: 'Measure', dataType: 'quantitative', description: 'Scale upper bound' },
    ],
    sampleData: [
      { Category: 'North America', Actual: 85, Target: 90, Range3: 100, Range2: 80, Range1: 50 },
      { Category: 'Europe', Actual: 92, Target: 85, Range3: 100, Range2: 80, Range1: 50 },
      { Category: 'Asia Pacific', Actual: 68, Target: 75, Range3: 100, Range2: 80, Range1: 50 },
      { Category: 'Latin America', Actual: 78, Target: 70, Range3: 100, Range2: 80, Range1: 50 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      spacing: 10,
      facet: { row: { field: 'Category', type: 'nominal', header: { labelAngle: 0, labelAlign: 'left', labelFontWeight: 'bold' } } },
      spec: {
        layer: [
          { mark: { type: 'bar', color: '#E2E8F0', height: 24 }, encoding: { x: { field: 'Range3', type: 'quantitative', scale: { domain: [0, 100] }, axis: null } } },
          { mark: { type: 'bar', color: '#CBD5E1', height: 24 }, encoding: { x: { field: 'Range2', type: 'quantitative' } } },
          { mark: { type: 'bar', color: '#94A3B8', height: 24 }, encoding: { x: { field: 'Range1', type: 'quantitative' } } },
          { mark: { type: 'bar', color: '#8B5CF6', height: 12 }, encoding: { x: { field: 'Actual', type: 'quantitative', tooltip: true } } },
          { mark: { type: 'tick', color: '#1E293B', thickness: 3, size: 28 }, encoding: { x: { field: 'Target', type: 'quantitative', tooltip: true } } },
        ],
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const cTarget = '#1E293B';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 15)">
            <text x="0" y="8" font-size="10" font-weight="bold" fill="#64748B" font-family="sans-serif">North America</text>
            <rect x="90" y="0" width="210" height="14" fill="#F1F5F9" rx="2" />
            <rect x="90" y="0" width="168" height="14" fill="#E2E8F0" rx="2" />
            <rect x="90" y="0" width="105" height="14" fill="#CBD5E1" rx="2" />
            <rect x="90" y="3" width="178" height="8" fill="${c1}" rx="1" />
            <line x1="279" y1="-2" x2="279" y2="16" stroke="${cTarget}" stroke-width="3" stroke-linecap="round" />
          </g>
          <g transform="translate(10, 48)">
            <text x="0" y="8" font-size="10" font-weight="bold" fill="#64748B" font-family="sans-serif">Europe</text>
            <rect x="90" y="0" width="210" height="14" fill="#F1F5F9" rx="2" />
            <rect x="90" y="0" width="168" height="14" fill="#E2E8F0" rx="2" />
            <rect x="90" y="0" width="105" height="14" fill="#CBD5E1" rx="2" />
            <rect x="90" y="3" width="193" height="8" fill="${c1}" rx="1" />
            <line x1="268" y1="-2" x2="268" y2="16" stroke="${cTarget}" stroke-width="3" stroke-linecap="round" />
          </g>
          <g transform="translate(10, 81)">
            <text x="0" y="8" font-size="10" font-weight="bold" fill="#64748B" font-family="sans-serif">Asia Pacific</text>
            <rect x="90" y="0" width="210" height="14" fill="#F1F5F9" rx="2" />
            <rect x="90" y="0" width="168" height="14" fill="#E2E8F0" rx="2" />
            <rect x="90" y="0" width="105" height="14" fill="#CBD5E1" rx="2" />
            <rect x="90" y="3" width="142" height="8" fill="${c1}" rx="1" />
            <line x1="247" y1="-2" x2="247" y2="16" stroke="${cTarget}" stroke-width="3" stroke-linecap="round" />
          </g>
          <g transform="translate(10, 114)">
            <text x="0" y="8" font-size="10" font-weight="bold" fill="#64748B" font-family="sans-serif">Latin America</text>
            <rect x="90" y="0" width="210" height="14" fill="#F1F5F9" rx="2" />
            <rect x="90" y="0" width="168" height="14" fill="#E2E8F0" rx="2" />
            <rect x="90" y="0" width="105" height="14" fill="#CBD5E1" rx="2" />
            <rect x="90" y="3" width="163" height="8" fill="${c1}" rx="1" />
            <line x1="237" y1="-2" x2="237" y2="16" stroke="${cTarget}" stroke-width="3" stroke-linecap="round" />
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'radial-gauge-ring',
    name: 'Tiered Radial Gauge Ring',
    description: 'Compact radial gauge visualizing progress toward quota with background track, filled arc, and central percentage readout.',
    category: 'kpi',
    badge: 'Popular',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Metric', type: 'Column', dataType: 'nominal', description: 'KPI Name' },
      { name: 'CompletionRate', type: 'Measure', dataType: 'quantitative', description: 'Percentage completion (0 to 100)' },
    ],
    sampleData: [{ Metric: 'Annual Recurring Revenue', CompletionRate: 78.4 }],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        { mark: { type: 'arc', innerRadius: 55, outerRadius: 75, theta: 6.28318, color: '#E2E8F0' } },
        {
          mark: { type: 'arc', innerRadius: 55, outerRadius: 75, cornerRadius: 8 },
          encoding: {
            theta: { field: 'CompletionRate', type: 'quantitative', scale: { domain: [0, 100] } },
            color: { value: '#8B5CF6' },
          },
        },
        {
          mark: { type: 'text', fontSize: 24, fontWeight: 'bold', fill: '#1E293B', baseline: 'middle' },
          encoding: { text: { field: 'CompletionRate', type: 'quantitative', format: '.1f' } },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(160, 70)">
            <circle cx="0" cy="0" r="50" fill="none" stroke="#E2E8F0" stroke-width="14" />
            <circle cx="0" cy="0" r="50" fill="none" stroke="${c}" stroke-width="14" stroke-dasharray="314.15" stroke-dashoffset="69.1" stroke-linecap="round" transform="rotate(-90)" />
            <text x="0" y="5" text-anchor="middle" font-size="20" font-weight="900" fill="#1E293B" font-family="sans-serif">78%</text>
            <text x="0" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B" font-family="sans-serif">OF TARGET</text>
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'kpi-variance-bar',
    name: 'Variance Diverging Bar',
    description: 'Diverging variance bar visualizing positive (green/blue) and negative (red/orange) budget deviations from a central zero axis.',
    category: 'kpi',
    badge: 'Finance',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Division', type: 'Column', dataType: 'nominal', description: 'Business Division' },
      { name: 'VariancePct', type: 'Measure', dataType: 'quantitative', description: 'Variance % (+/-)' },
    ],
    sampleData: [
      { Division: 'Cloud SaaS', VariancePct: 18.5 },
      { Division: 'Consulting', VariancePct: -8.2 },
      { Division: 'Enterprise HW', VariancePct: -14.6 },
      { Division: 'Licensing', VariancePct: 12.3 },
      { Division: 'Support Services', VariancePct: 4.8 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'bar', cornerRadius: 4 },
      encoding: {
        y: { field: 'Division', type: 'nominal', axis: { title: null, domain: false } },
        x: { field: 'VariancePct', type: 'quantitative', axis: { title: 'Variance %', format: '+.1f' } },
        color: {
          condition: { test: 'datum.VariancePct >= 0', value: '#10B981' },
          value: '#EF4444',
        },
      },
    },
    renderPreviewSvg: (palette) => {
      const pos = palette[2] || '#10B981';
      const neg = palette[4] || '#EF4444';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="160" y1="10" x2="160" y2="130" stroke="#94A3B8" stroke-width="2" stroke-dasharray="2 2" />
          <g transform="translate(10, 20)">
            <text x="140" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B" font-family="sans-serif">Cloud SaaS</text>
            <rect x="150" y="0" width="75" height="14" fill="${pos}" rx="3" />
            <text x="230" y="10" font-size="9" font-weight="bold" fill="${pos}" font-family="sans-serif">+18.5%</text>
          </g>
          <g transform="translate(10, 44)">
            <text x="140" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B" font-family="sans-serif">Consulting</text>
            <rect x="115" y="0" width="35" height="14" fill="${neg}" rx="3" />
            <text x="75" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="${neg}" font-family="sans-serif">-8.2%</text>
          </g>
          <g transform="translate(10, 68)">
            <text x="140" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B" font-family="sans-serif">Hardware</text>
            <rect x="90" y="0" width="60" height="14" fill="${neg}" rx="3" />
            <text x="50" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="${neg}" font-family="sans-serif">-14.6%</text>
          </g>
          <g transform="translate(10, 92)">
            <text x="140" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B" font-family="sans-serif">Licensing</text>
            <rect x="150" y="0" width="55" height="14" fill="${pos}" rx="3" />
            <text x="210" y="10" font-size="9" font-weight="bold" fill="${pos}" font-family="sans-serif">+12.3%</text>
          </g>
          <g transform="translate(10, 116)">
            <text x="140" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B" font-family="sans-serif">Support</text>
            <rect x="150" y="0" width="25" height="14" fill="${pos}" rx="3" />
            <text x="180" y="10" font-size="9" font-weight="bold" fill="${pos}" font-family="sans-serif">+4.8%</text>
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'progress-tracker',
    name: 'Multi-Stage Milestone Stepper',
    description: 'Horizontal linear stepper tracking progression through stages (Qualified, Demo, Proposal, Closed) with duration labels.',
    category: 'kpi',
    badge: 'Pipeline',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Stage', type: 'Column', dataType: 'ordinal', description: 'Pipeline Stage' },
      { name: 'Value', type: 'Measure', dataType: 'quantitative', description: 'Stage Volume or Days' },
    ],
    sampleData: [
      { Stage: 'Lead', Days: 4, Status: 'Complete' },
      { Stage: 'Qualified', Days: 8, Status: 'Complete' },
      { Stage: 'Proposal', Days: 14, Status: 'In-Progress' },
      { Stage: 'Contract', Days: 6, Status: 'Pending' },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'bar', height: 28, cornerRadius: 4 },
      encoding: {
        x: { field: 'Days', type: 'quantitative', stack: 'zero' },
        color: { field: 'Stage', type: 'nominal' },
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const c2 = palette[1] || '#FBBF24';
      const c3 = palette[2] || '#34D399';
      const c4 = '#E2E8F0';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(15, 45)">
            <line x1="20" y1="20" x2="270" y2="20" stroke="#CBD5E1" stroke-width="4" />
            <line x1="20" y1="20" x2="185" y2="20" stroke="${c1}" stroke-width="4" />
            <!-- Node 1 -->
            <circle cx="20" cy="20" r="14" fill="${c1}" stroke="#1E293B" stroke-width="2" />
            <text x="20" y="24" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">✓</text>
            <text x="20" y="48" text-anchor="middle" font-size="9" font-weight="bold" fill="#1E293B">Lead</text>
            <!-- Node 2 -->
            <circle cx="100" cy="20" r="14" fill="${c2}" stroke="#1E293B" stroke-width="2" />
            <text x="100" y="24" text-anchor="middle" fill="#1E293B" font-size="10" font-weight="bold">✓</text>
            <text x="100" y="48" text-anchor="middle" font-size="9" font-weight="bold" fill="#1E293B">Demo</text>
            <!-- Node 3 -->
            <circle cx="185" cy="20" r="14" fill="${c3}" stroke="#1E293B" stroke-width="2" />
            <text x="185" y="24" text-anchor="middle" fill="#1E293B" font-size="10" font-weight="bold">●</text>
            <text x="185" y="48" text-anchor="middle" font-size="9" font-weight="bold" fill="#1E293B">Proposal</text>
            <!-- Node 4 -->
            <circle cx="270" cy="20" r="14" fill="${c4}" stroke="#94A3B8" stroke-width="2" />
            <text x="270" y="24" text-anchor="middle" fill="#64748B" font-size="10" font-weight="bold">4</text>
            <text x="270" y="48" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Closed</text>
          </g>
        </svg>
      `;
    },
  },

  // =========================================================================
  // 2. Distribution & Statistical
  // =========================================================================
  {
    id: 'box-whisker',
    name: 'Box & Whisker Distribution',
    description: 'Statistical distribution visual showing minimum, first quartile (Q1), median, third quartile (Q3), and maximum with outlier detection.',
    category: 'distribution',
    badge: 'Stats',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Group', type: 'Column', dataType: 'nominal', description: 'Categorical group' },
      { name: 'Measurement', type: 'Measure', dataType: 'quantitative', description: 'Numeric values' },
    ],
    sampleData: [
      { Group: 'Group A', Measurement: 45 },
      { Group: 'Group A', Measurement: 62 },
      { Group: 'Group A', Measurement: 78 },
      { Group: 'Group B', Measurement: 54 },
      { Group: 'Group B', Measurement: 88 },
      { Group: 'Group B', Measurement: 95 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'boxplot', extent: 'min-max', size: 36 },
      encoding: {
        x: { field: 'Group', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'Measurement', type: 'quantitative' },
        color: { field: 'Group', type: 'nominal' },
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const c2 = palette[1] || '#FBBF24';
      const c3 = palette[2] || '#34D399';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="120" x2="290" y2="120" stroke="#CBD5E1" stroke-width="1.5" />
          <!-- Box 1 -->
          <g transform="translate(70, 0)">
            <line x1="0" y1="20" x2="0" y2="110" stroke="#1E293B" stroke-width="1.5" />
            <line x1="-10" y1="20" x2="10" y2="20" stroke="#1E293B" stroke-width="1.5" />
            <line x1="-10" y1="110" x2="10" y2="110" stroke="#1E293B" stroke-width="1.5" />
            <rect x="-18" y="45" width="36" height="45" fill="${c1}" stroke="#1E293B" stroke-width="2" rx="2" />
            <line x1="-18" y1="65" x2="18" y2="65" stroke="#FFF" stroke-width="2.5" />
            <text x="0" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Segment A</text>
          </g>
          <!-- Box 2 -->
          <g transform="translate(160, 0)">
            <line x1="0" y1="10" x2="0" y2="115" stroke="#1E293B" stroke-width="1.5" />
            <line x1="-10" y1="10" x2="10" y2="10" stroke="#1E293B" stroke-width="1.5" />
            <line x1="-10" y1="115" x2="10" y2="115" stroke="#1E293B" stroke-width="1.5" />
            <rect x="-18" y="35" width="36" height="55" fill="${c2}" stroke="#1E293B" stroke-width="2" rx="2" />
            <line x1="-18" y1="60" x2="18" y2="60" stroke="#1E293B" stroke-width="2.5" />
            <text x="0" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Segment B</text>
          </g>
          <!-- Box 3 -->
          <g transform="translate(250, 0)">
            <line x1="0" y1="30" x2="0" y2="105" stroke="#1E293B" stroke-width="1.5" />
            <line x1="-10" y1="30" x2="10" y2="30" stroke="#1E293B" stroke-width="1.5" />
            <line x1="-10" y1="105" x2="10" y2="105" stroke="#1E293B" stroke-width="1.5" />
            <rect x="-18" y="55" width="36" height="35" fill="${c3}" stroke="#1E293B" stroke-width="2" rx="2" />
            <line x1="-18" y1="72" x2="18" y2="72" stroke="#1E293B" stroke-width="2.5" />
            <text x="0" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Segment C</text>
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'jitter-strip',
    name: 'Jitter / Strip Plot',
    description: 'Displays individual raw observation data points with subtle horizontal jittering to prevent overplotting while showing distribution density.',
    category: 'distribution',
    badge: 'Granular',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Cohort', type: 'Column', dataType: 'nominal', description: 'Category grouping' },
      { name: 'Score', type: 'Measure', dataType: 'quantitative', description: 'Individual score' },
    ],
    sampleData: [
      { Cohort: 'Alpha', Score: 24 },
      { Cohort: 'Alpha', Score: 28 },
      { Cohort: 'Alpha', Score: 31 },
      { Cohort: 'Beta', Score: 52 },
      { Cohort: 'Beta', Score: 58 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'circle', size: 50, opacity: 0.65 },
      encoding: {
        y: { field: 'Cohort', type: 'nominal' },
        x: { field: 'Score', type: 'quantitative' },
        color: { field: 'Cohort', type: 'nominal' },
        yOffset: { field: 'Score', type: 'quantitative', band: 0.5 },
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const c2 = palette[1] || '#FBBF24';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="20" x2="80" y2="120" stroke="#CBD5E1" stroke-width="1" />
          <text x="70" y="45" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Cohort A</text>
          <text x="70" y="95" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Cohort B</text>
          <!-- Cohort A points -->
          <circle cx="110" cy="42" r="5" fill="${c1}" opacity="0.7" />
          <circle cx="118" cy="46" r="4.5" fill="${c1}" opacity="0.6" />
          <circle cx="125" cy="38" r="5" fill="${c1}" opacity="0.75" />
          <circle cx="160" cy="44" r="5" fill="${c1}" opacity="0.7" />
          <circle cx="168" cy="40" r="6" fill="${c1}" opacity="0.8" />
          <circle cx="190" cy="45" r="4" fill="${c1}" opacity="0.6" />
          <circle cx="240" cy="41" r="5" fill="${c1}" opacity="0.7" />
          <!-- Cohort B points -->
          <circle cx="130" cy="92" r="5" fill="${c2}" opacity="0.7" />
          <circle cx="180" cy="96" r="5.5" fill="${c2}" opacity="0.7" />
          <circle cx="195" cy="88" r="4.5" fill="${c2}" opacity="0.65" />
          <circle cx="210" cy="93" r="6" fill="${c2}" opacity="0.8" />
          <circle cx="250" cy="91" r="5" fill="${c2}" opacity="0.75" />
          <circle cx="270" cy="95" r="4.5" fill="${c2}" opacity="0.6" />
        </svg>
      `;
    },
  },
  {
    id: 'histogram-distribution',
    name: 'Binned Frequency Histogram',
    description: 'Binned quantitative frequency distribution bar chart displaying count of transactions or clients across value brackets.',
    category: 'distribution',
    badge: 'Analytical',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Value', type: 'Measure', dataType: 'quantitative', description: 'Continuous numeric metric to bin' },
    ],
    sampleData: [
      { OrderAmount: 15 },
      { OrderAmount: 22 },
      { OrderAmount: 45 },
      { OrderAmount: 48 },
      { OrderAmount: 51 },
      { OrderAmount: 85 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'bar', cornerRadiusTopLeft: 4, cornerRadiusTopRight: 4 },
      encoding: {
        x: { bin: { maxbins: 15 }, field: 'OrderAmount', type: 'quantitative' },
        y: { aggregate: 'count', type: 'quantitative' },
        color: { value: '#8B5CF6' },
      },
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="115" x2="290" y2="115" stroke="#CBD5E1" stroke-width="1.5" />
          <rect x="40" y="95" width="28" height="20" fill="${c}" opacity="0.5" rx="2" />
          <rect x="72" y="70" width="28" height="45" fill="${c}" opacity="0.65" rx="2" />
          <rect x="104" y="40" width="28" height="75" fill="${c}" opacity="0.8" rx="2" />
          <rect x="136" y="20" width="28" height="95" fill="${c}" rx="2" />
          <rect x="168" y="35" width="28" height="80" fill="${c}" opacity="0.85" rx="2" />
          <rect x="200" y="60" width="28" height="55" fill="${c}" opacity="0.7" rx="2" />
          <rect x="232" y="85" width="28" height="30" fill="${c}" opacity="0.55" rx="2" />
          <rect x="264" y="100" width="28" height="15" fill="${c}" opacity="0.4" rx="2" />
        </svg>
      `;
    },
  },
  {
    id: 'error-bar-interval',
    name: 'Confidence Interval Error Bars',
    description: 'Displays mean estimated values with upper and lower error bounds, ideal for survey sampling, A/B testing, and scientific telemetry.',
    category: 'distribution',
    badge: 'Precision',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'ModelVariant', type: 'Column', dataType: 'nominal', description: 'Experiment variant' },
      { name: 'MeanRate', type: 'Measure', dataType: 'quantitative', description: 'Central mean estimate' },
      { name: 'LowerBound', type: 'Measure', dataType: 'quantitative', description: 'Lower 95% bound' },
      { name: 'UpperBound', type: 'Measure', dataType: 'quantitative', description: 'Upper 95% bound' },
    ],
    sampleData: [
      { ModelVariant: 'Control', Mean: 52, Lower: 46, Upper: 58 },
      { ModelVariant: 'Treatment A', Mean: 64, Lower: 59, Upper: 69 },
      { ModelVariant: 'Treatment B', Mean: 71, Lower: 65, Upper: 77 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'rule', strokeWidth: 2.5, color: '#1E293B' },
          encoding: {
            x: { field: 'ModelVariant', type: 'nominal' },
            y: { field: 'Lower', type: 'quantitative' },
            y2: { field: 'Upper' },
          },
        },
        {
          mark: { type: 'point', size: 120, filled: true, color: '#8B5CF6' },
          encoding: {
            x: { field: 'ModelVariant', type: 'nominal' },
            y: { field: 'Mean', type: 'quantitative' },
          },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="120" x2="290" y2="120" stroke="#CBD5E1" stroke-width="1.5" />
          <!-- Var 1 -->
          <g transform="translate(80, 0)">
            <line x1="0" y1="50" x2="0" y2="105" stroke="#1E293B" stroke-width="2" />
            <line x1="-8" y1="50" x2="8" y2="50" stroke="#1E293B" stroke-width="2" />
            <line x1="-8" y1="105" x2="8" y2="105" stroke="#1E293B" stroke-width="2" />
            <circle cx="0" cy="78" r="6" fill="${c}" stroke="#1E293B" stroke-width="2" />
            <text x="0" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Control</text>
          </g>
          <!-- Var 2 -->
          <g transform="translate(160, 0)">
            <line x1="0" y1="35" x2="0" y2="85" stroke="#1E293B" stroke-width="2" />
            <line x1="-8" y1="35" x2="8" y2="35" stroke="#1E293B" stroke-width="2" />
            <line x1="-8" y1="85" x2="8" y2="85" stroke="#1E293B" stroke-width="2" />
            <circle cx="0" cy="60" r="6" fill="${c}" stroke="#1E293B" stroke-width="2" />
            <text x="0" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Variant A</text>
          </g>
          <!-- Var 3 -->
          <g transform="translate(240, 0)">
            <line x1="0" y1="15" x2="0" y2="65" stroke="#1E293B" stroke-width="2" />
            <line x1="-8" y1="15" x2="8" y2="15" stroke="#1E293B" stroke-width="2" />
            <line x1="-8" y1="65" x2="8" y2="65" stroke="#1E293B" stroke-width="2" />
            <circle cx="0" cy="40" r="6" fill="${c}" stroke="#1E293B" stroke-width="2" />
            <text x="0" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Variant B</text>
          </g>
        </svg>
      `;
    },
  },

  // =========================================================================
  // 3. Comparison & Ranking
  // =========================================================================
  {
    id: 'lollipop-ranking',
    name: 'Categorical Lollipop Chart',
    description: 'Clean alternative to clustered bar charts featuring thin rule stems and emphasized circular callout badges.',
    category: 'ranking',
    badge: 'Popular',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Product', type: 'Column', dataType: 'nominal', description: 'Product item name' },
      { name: 'Revenue', type: 'Measure', dataType: 'quantitative', description: 'Total Revenue' },
    ],
    sampleData: [
      { Product: 'Power BI Premium', Revenue: 94 },
      { Product: 'Fabric F64', Revenue: 82 },
      { Product: 'Copilot Add-on', Revenue: 64 },
      { Product: 'Synapse Data Warehouse', Revenue: 48 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'rule', strokeWidth: 2, color: '#CBD5E1' },
          encoding: {
            y: { field: 'Product', type: 'nominal' },
            x: { field: 'Revenue', type: 'quantitative' },
          },
        },
        {
          mark: { type: 'point', size: 160, filled: true, color: '#8B5CF6' },
          encoding: {
            y: { field: 'Product', type: 'nominal' },
            x: { field: 'Revenue', type: 'quantitative' },
          },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 20)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Power BI Pro</text>
            <line x1="90" y1="8" x2="260" y2="8" stroke="#CBD5E1" stroke-width="2.5" />
            <circle cx="260" cy="8" r="7" fill="${c}" stroke="#1E293B" stroke-width="2" />
          </g>
          <g transform="translate(10, 48)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Fabric F64</text>
            <line x1="90" y1="8" x2="225" y2="8" stroke="#CBD5E1" stroke-width="2.5" />
            <circle cx="225" cy="8" r="7" fill="${c}" stroke="#1E293B" stroke-width="2" />
          </g>
          <g transform="translate(10, 76)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Copilot Studio</text>
            <line x1="90" y1="8" x2="185" y2="8" stroke="#CBD5E1" stroke-width="2.5" />
            <circle cx="185" cy="8" r="7" fill="${c}" stroke="#1E293B" stroke-width="2" />
          </g>
          <g transform="translate(10, 104)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">SQL Endpoint</text>
            <line x1="90" y1="8" x2="145" y2="8" stroke="#CBD5E1" stroke-width="2.5" />
            <circle cx="145" cy="8" r="7" fill="${c}" stroke="#1E293B" stroke-width="2" />
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'dumbbell-comparison',
    name: 'Dumbbell Dot Plot (CY vs PY)',
    description: 'Connected dot plot highlighting growth or contraction between Current Year and Prior Year across business segments.',
    category: 'ranking',
    badge: 'Comparison',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Channel', type: 'Column', dataType: 'nominal', description: 'Channel name' },
      { name: 'PriorYear', type: 'Measure', dataType: 'quantitative', description: 'Prior Year baseline' },
      { name: 'CurrentYear', type: 'Measure', dataType: 'quantitative', description: 'Current Year result' },
    ],
    sampleData: [
      { Channel: 'Direct Sales', PY: 45, CY: 68 },
      { Channel: 'Partners', PY: 60, CY: 82 },
      { Channel: 'Online Web', PY: 35, CY: 55 },
      { Channel: 'Resellers', PY: 50, CY: 42 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'rule', strokeWidth: 3, color: '#E2E8F0' },
          encoding: {
            y: { field: 'Channel', type: 'nominal' },
            x: { field: 'PY', type: 'quantitative' },
            x2: { field: 'CY' },
          },
        },
        {
          mark: { type: 'point', size: 100, filled: true, color: '#94A3B8' },
          encoding: { y: { field: 'Channel' }, x: { field: 'PY', type: 'quantitative' } },
        },
        {
          mark: { type: 'point', size: 120, filled: true, color: '#8B5CF6' },
          encoding: { y: { field: 'Channel' }, x: { field: 'CY', type: 'quantitative' } },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const cy = palette[0] || '#8B5CF6';
      const py = '#94A3B8';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 20)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Direct Sales</text>
            <line x1="140" y1="8" x2="230" y2="8" stroke="#CBD5E1" stroke-width="3" />
            <circle cx="140" cy="8" r="6" fill="${py}" />
            <circle cx="230" cy="8" r="6.5" fill="${cy}" stroke="#1E293B" stroke-width="1.5" />
          </g>
          <g transform="translate(10, 48)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Partner Channel</text>
            <line x1="170" y1="8" x2="260" y2="8" stroke="#CBD5E1" stroke-width="3" />
            <circle cx="170" cy="8" r="6" fill="${py}" />
            <circle cx="260" cy="8" r="6.5" fill="${cy}" stroke="#1E293B" stroke-width="1.5" />
          </g>
          <g transform="translate(10, 76)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Online Store</text>
            <line x1="120" y1="8" x2="200" y2="8" stroke="#CBD5E1" stroke-width="3" />
            <circle cx="120" cy="8" r="6" fill="${py}" />
            <circle cx="200" cy="8" r="6.5" fill="${cy}" stroke="#1E293B" stroke-width="1.5" />
          </g>
          <g transform="translate(10, 104)">
            <text x="80" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Resellers</text>
            <line x1="160" y1="8" x2="210" y2="8" stroke="#CBD5E1" stroke-width="3" />
            <circle cx="210" cy="8" r="6" fill="${py}" />
            <circle cx="160" cy="8" r="6.5" fill="${cy}" stroke="#1E293B" stroke-width="1.5" />
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'slope-graph',
    name: 'Multi-Cohort Slopegraph',
    description: 'Two-point time comparison showing velocity and trajectory shifts between Period 1 and Period 2 across market cohorts.',
    category: 'ranking',
    badge: 'Trends',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Cohort', type: 'Column', dataType: 'nominal', description: 'Cohort group' },
      { name: 'Period', type: 'Column', dataType: 'nominal', description: 'Time snapshot (T1, T2)' },
      { name: 'MarketShare', type: 'Measure', dataType: 'quantitative', description: 'Percentage share' },
    ],
    sampleData: [
      { Cohort: 'FinTech', Period: '2023', Share: 18 },
      { Cohort: 'FinTech', Period: '2024', Share: 32 },
      { Cohort: 'HealthTech', Period: '2023', Share: 28 },
      { Cohort: 'HealthTech', Period: '2024', Share: 22 },
      { Cohort: 'EdTech', Period: '2023', Share: 14 },
      { Cohort: 'EdTech', Period: '2024', Share: 19 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'line', point: true, strokeWidth: 3 },
      encoding: {
        x: { field: 'Period', type: 'nominal' },
        y: { field: 'Share', type: 'quantitative' },
        color: { field: 'Cohort', type: 'nominal' },
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const c2 = palette[1] || '#FBBF24';
      const c3 = palette[2] || '#34D399';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="20" x2="80" y2="120" stroke="#CBD5E1" stroke-width="1.5" />
          <line x1="240" y1="20" x2="240" y2="120" stroke="#CBD5E1" stroke-width="1.5" />
          <text x="80" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">2023</text>
          <text x="240" y="132" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">2024</text>
          <!-- Line 1: Growth -->
          <line x1="80" y1="90" x2="240" y2="35" stroke="${c1}" stroke-width="3" stroke-linecap="round" />
          <circle cx="80" cy="90" r="5" fill="${c1}" />
          <circle cx="240" cy="35" r="5" fill="${c1}" />
          <!-- Line 2: Slight Decline -->
          <line x1="80" y1="45" x2="240" y2="65" stroke="${c2}" stroke-width="3" stroke-linecap="round" />
          <circle cx="80" cy="45" r="5" fill="${c2}" />
          <circle cx="240" cy="65" r="5" fill="${c2}" />
          <!-- Line 3: Flat -->
          <line x1="80" y1="105" x2="240" y2="95" stroke="${c3}" stroke-width="3" stroke-linecap="round" />
          <circle cx="80" cy="105" r="5" fill="${c3}" />
          <circle cx="240" cy="95" r="5" fill="${c3}" />
        </svg>
      `;
    },
  },
  {
    id: 'diverging-bar',
    name: 'Net Sentiment Diverging Bar',
    description: 'Centered diverging bar chart measuring Net Promoter Score (NPS) or survey sentiment (-100% to +100%).',
    category: 'ranking',
    badge: 'NPS',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Question', type: 'Column', dataType: 'nominal', description: 'Survey question prompt' },
      { name: 'NetScore', type: 'Measure', dataType: 'quantitative', description: 'Net score index (-100 to 100)' },
    ],
    sampleData: [
      { Question: 'Product Usability', NetScore: 62 },
      { Question: 'Customer Support', NetScore: 48 },
      { Question: 'Pricing Value', NetScore: -24 },
      { Question: 'Feature Completeness', NetScore: 18 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'bar', height: 16, cornerRadius: 3 },
      encoding: {
        y: { field: 'Question', type: 'nominal' },
        x: { field: 'NetScore', type: 'quantitative', scale: { domain: [-100, 100] } },
        color: {
          condition: { test: 'datum.NetScore >= 0', value: '#10B981' },
          value: '#EF4444',
        },
      },
    },
    renderPreviewSvg: (palette) => {
      const pos = palette[2] || '#10B981';
      const neg = palette[4] || '#EF4444';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="160" y1="15" x2="160" y2="125" stroke="#CBD5E1" stroke-width="2" />
          <g transform="translate(10, 25)">
            <text x="145" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Usability</text>
            <rect x="160" y="0" width="70" height="14" fill="${pos}" rx="3" />
            <text x="235" y="11" font-size="8" font-weight="bold" fill="${pos}">+62</text>
          </g>
          <g transform="translate(10, 52)">
            <text x="145" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Support</text>
            <rect x="160" y="0" width="55" height="14" fill="${pos}" rx="3" />
            <text x="220" y="11" font-size="8" font-weight="bold" fill="${pos}">+48</text>
          </g>
          <g transform="translate(10, 79)">
            <text x="145" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Pricing</text>
            <rect x="125" y="0" width="35" height="14" fill="${neg}" rx="3" />
            <text x="120" y="11" text-anchor="end" font-size="8" font-weight="bold" fill="${neg}">-24</text>
          </g>
          <g transform="translate(10, 106)">
            <text x="145" y="10" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Features</text>
            <rect x="160" y="0" width="30" height="14" fill="${pos}" rx="3" />
            <text x="195" y="11" font-size="8" font-weight="bold" fill="${pos}">+18</text>
          </g>
        </svg>
      `;
    },
  },

  // =========================================================================
  // 4. Part-to-Whole & Composition
  // =========================================================================
  {
    id: 'waterfall-bridge',
    name: 'Financial P&L Waterfall Bridge',
    description: 'Corporate finance bridge explaining variance from Starting Revenue to Final Net Income with colored positive/negative steps.',
    category: 'part-to-whole',
    badge: 'Finance',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Step', type: 'Column', dataType: 'ordinal', description: 'Accounting step (Revenue, COGS, OpEx, Tax)' },
      { name: 'Amount', type: 'Measure', dataType: 'quantitative', description: 'Financial cash flow contribution' },
    ],
    sampleData: [
      { Step: 'Gross Rev', Amount: 100, Type: 'Start' },
      { Step: 'COGS', Amount: -35, Type: 'Negative' },
      { Step: 'OpEx', Amount: -25, Type: 'Negative' },
      { Step: 'R&D Credits', Amount: 10, Type: 'Positive' },
      { Step: 'Net Income', Amount: 50, Type: 'Total' },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'bar', width: 28, cornerRadius: 3 },
      encoding: {
        x: { field: 'Step', type: 'nominal', sort: null },
        y: { field: 'Amount', type: 'quantitative' },
        color: {
          field: 'Type',
          type: 'nominal',
          scale: {
            domain: ['Start', 'Positive', 'Negative', 'Total'],
            range: ['#8B5CF6', '#10B981', '#EF4444', '#1E293B'],
          },
        },
      },
    },
    renderPreviewSvg: (palette) => {
      const cStart = palette[0] || '#8B5CF6';
      const cPos = '#10B981';
      const cNeg = '#EF4444';
      const cTotal = '#1E293B';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="120" x2="300" y2="120" stroke="#CBD5E1" stroke-width="1.5" />
          <!-- Start: 100 -->
          <rect x="35" y="30" width="36" height="90" fill="${cStart}" rx="2" />
          <text x="53" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">Start</text>
          <!-- -35 -->
          <line x1="71" y1="30" x2="95" y2="30" stroke="#CBD5E1" stroke-dasharray="2 2" />
          <rect x="95" y="30" width="36" height="35" fill="${cNeg}" rx="2" />
          <text x="113" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">COGS</text>
          <!-- -25 -->
          <line x1="131" y1="65" x2="155" y2="65" stroke="#CBD5E1" stroke-dasharray="2 2" />
          <rect x="155" y="65" width="36" height="25" fill="${cNeg}" rx="2" />
          <text x="173" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">OpEx</text>
          <!-- +15 -->
          <line x1="191" y1="90" x2="215" y2="90" stroke="#CBD5E1" stroke-dasharray="2 2" />
          <rect x="215" y="75" width="36" height="15" fill="${cPos}" rx="2" />
          <text x="233" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">Other</text>
          <!-- Total: 55 -->
          <line x1="251" y1="75" x2="275" y2="75" stroke="#CBD5E1" stroke-dasharray="2 2" />
          <rect x="275" y="75" width="36" height="45" fill="${cTotal}" rx="2" />
          <text x="293" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">EBITDA</text>
        </svg>
      `;
    },
  },
  {
    id: 'heatmap-matrix',
    name: 'Activity Heatmap Matrix',
    description: '2D matrix intensity grid (e.g. Day of Week vs Hour of Day) with color gradient reflecting transactional density.',
    category: 'part-to-whole',
    badge: 'Dense',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Day', type: 'Column', dataType: 'ordinal', description: 'Day of Week' },
      { name: 'TimeSlot', type: 'Column', dataType: 'ordinal', description: 'Hour of Day' },
      { name: 'ActivityCount', type: 'Measure', dataType: 'quantitative', description: 'Transaction density count' },
    ],
    sampleData: [
      { Day: 'Mon', Slot: 'Morning', Count: 42 },
      { Day: 'Mon', Slot: 'Afternoon', Count: 78 },
      { Day: 'Tue', Slot: 'Morning', Count: 65 },
      { Day: 'Tue', Slot: 'Afternoon', Count: 92 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'rect', cornerRadius: 2 },
      encoding: {
        x: { field: 'Slot', type: 'nominal' },
        y: { field: 'Day', type: 'nominal' },
        color: { field: 'Count', type: 'quantitative', scale: { scheme: 'purples' } },
      },
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(40, 20)">
            <text x="-8" y="18" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Mon</text>
            <text x="-8" y="46" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Wed</text>
            <text x="-8" y="74" text-anchor="end" font-size="9" font-weight="bold" fill="#64748B">Fri</text>
            <!-- Matrix row 1 -->
            <rect x="0" y="5" width="38" height="20" fill="${c}" opacity="0.3" rx="2" />
            <rect x="42" y="5" width="38" height="20" fill="${c}" opacity="0.5" rx="2" />
            <rect x="84" y="5" width="38" height="20" fill="${c}" opacity="0.8" rx="2" />
            <rect x="126" y="5" width="38" height="20" fill="${c}" opacity="1.0" rx="2" />
            <rect x="168" y="5" width="38" height="20" fill="${c}" opacity="0.6" rx="2" />
            <rect x="210" y="5" width="38" height="20" fill="${c}" opacity="0.4" rx="2" />
            <!-- Matrix row 2 -->
            <rect x="0" y="32" width="38" height="20" fill="${c}" opacity="0.5" rx="2" />
            <rect x="42" y="32" width="38" height="20" fill="${c}" opacity="0.9" rx="2" />
            <rect x="84" y="32" width="38" height="20" fill="${c}" opacity="0.7" rx="2" />
            <rect x="126" y="32" width="38" height="20" fill="${c}" opacity="0.4" rx="2" />
            <rect x="168" y="32" width="38" height="20" fill="${c}" opacity="0.8" rx="2" />
            <rect x="210" y="32" width="38" height="20" fill="${c}" opacity="0.3" rx="2" />
            <!-- Matrix row 3 -->
            <rect x="0" y="59" width="38" height="20" fill="${c}" opacity="0.2" rx="2" />
            <rect x="42" y="59" width="38" height="20" fill="${c}" opacity="0.6" rx="2" />
            <rect x="84" y="59" width="38" height="20" fill="${c}" opacity="1.0" rx="2" />
            <rect x="126" y="59" width="38" height="20" fill="${c}" opacity="0.85" rx="2" />
            <rect x="168" y="59" width="38" height="20" fill="${c}" opacity="0.5" rx="2" />
            <rect x="210" y="59" width="38" height="20" fill="${c}" opacity="0.1" rx="2" />
            <!-- Col labels -->
            <text x="19" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">8am</text>
            <text x="61" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">10am</text>
            <text x="103" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">12pm</text>
            <text x="145" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">2pm</text>
            <text x="187" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">4pm</text>
            <text x="229" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748B">6pm</text>
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'marimekko-mosaic',
    name: 'Marimekko Segment Matrix',
    description: 'Two-dimensional market share chart with column widths proportional to segment revenue and vertical heights reflecting product mix.',
    category: 'part-to-whole',
    badge: 'Strategy',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'MarketSegment', type: 'Column', dataType: 'nominal', description: 'Industry Sector' },
      { name: 'ProductTier', type: 'Column', dataType: 'nominal', description: 'Pricing Tier' },
      { name: 'Revenue', type: 'Measure', dataType: 'quantitative', description: 'Volume' },
    ],
    sampleData: [
      { Segment: 'Enterprise', Tier: 'Gold', Revenue: 50 },
      { Segment: 'Enterprise', Tier: 'Silver', Revenue: 30 },
      { Segment: 'SMB', Tier: 'Gold', Revenue: 20 },
      { Segment: 'SMB', Tier: 'Silver', Revenue: 40 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'bar' },
      encoding: {
        x: { field: 'Segment', type: 'nominal' },
        y: { field: 'Revenue', type: 'quantitative', stack: 'normalize' },
        color: { field: 'Tier', type: 'nominal' },
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const c2 = palette[1] || '#FBBF24';
      const c3 = palette[2] || '#34D399';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(30, 20)">
            <!-- Col 1: Width 140 -->
            <rect x="0" y="0" width="140" height="55" fill="${c1}" stroke="#1E293B" stroke-width="1.5" />
            <rect x="0" y="55" width="140" height="40" fill="${c2}" stroke="#1E293B" stroke-width="1.5" />
            <text x="70" y="110" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Enterprise (65%)</text>
            <!-- Col 2: Width 80 -->
            <rect x="145" y="0" width="80" height="35" fill="${c1}" stroke="#1E293B" stroke-width="1.5" />
            <rect x="145" y="35" width="80" height="60" fill="${c3}" stroke="#1E293B" stroke-width="1.5" />
            <text x="185" y="110" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">Mid-Market</text>
            <!-- Col 3: Width 35 -->
            <rect x="230" y="0" width="35" height="95" fill="${c2}" stroke="#1E293B" stroke-width="1.5" />
            <text x="247" y="110" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748B">SMB</text>
          </g>
        </svg>
      `;
    },
  },
  {
    id: 'treemap-composition',
    name: 'Proportional Area Treemap',
    description: 'Nested hierarchical rectangles where rectangular surface area is strictly proportional to contribution or sales volume.',
    category: 'part-to-whole',
    badge: 'Visual',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Division', type: 'Column', dataType: 'nominal', description: 'Business department' },
      { name: 'Sales', type: 'Measure', dataType: 'quantitative', description: 'Sales volume' },
    ],
    sampleData: [
      { Division: 'Software', Sales: 520 },
      { Division: 'Services', Sales: 310 },
      { Division: 'Hardware', Sales: 180 },
      { Division: 'Cloud Storage', Sales: 120 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      mark: { type: 'rect' },
      encoding: {
        color: { field: 'Division', type: 'nominal' },
      },
    },
    renderPreviewSvg: (palette) => {
      const c1 = palette[0] || '#8B5CF6';
      const c2 = palette[1] || '#FBBF24';
      const c3 = palette[2] || '#34D399';
      const c4 = palette[3] || '#60A5FA';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 15)">
            <rect x="0" y="0" width="170" height="110" fill="${c1}" stroke="#1E293B" stroke-width="2" rx="4" />
            <text x="85" y="60" text-anchor="middle" font-size="11" font-weight="black" fill="#FFF">Software 48%</text>
            <rect x="175" y="0" width="105" height="65" fill="${c2}" stroke="#1E293B" stroke-width="2" rx="4" />
            <text x="227" y="38" text-anchor="middle" font-size="9" font-weight="bold" fill="#1E293B">Services 28%</text>
            <rect x="175" y="70" width="55" height="40" fill="${c3}" stroke="#1E293B" stroke-width="2" rx="4" />
            <text x="202" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#1E293B">HW 14%</text>
            <rect x="235" y="70" width="45" height="40" fill="${c4}" stroke="#1E293B" stroke-width="2" rx="4" />
            <text x="257" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#1E293B">Ops 10%</text>
          </g>
        </svg>
      `;
    },
  },

  // =========================================================================
  // 5. Time Series & Trends
  // =========================================================================
  {
    id: 'stepped-line-budget',
    name: 'Stepped Run-Rate vs Budget Line',
    description: 'Discrete step-function trajectory tracking monthly committed actuals with overlaid dashed linear budget target.',
    category: 'trends',
    badge: 'Popular',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Month', type: 'Column', dataType: 'temporal', description: 'Date or Month period' },
      { name: 'CommittedRunRate', type: 'Measure', dataType: 'quantitative', description: 'Step-wise actual spend' },
      { name: 'BudgetTarget', type: 'Measure', dataType: 'quantitative', description: 'Linear budget benchmark' },
    ],
    sampleData: [
      { Month: '2024-01', Actual: 20, Budget: 22 },
      { Month: '2024-02', Actual: 20, Budget: 24 },
      { Month: '2024-03', Actual: 35, Budget: 28 },
      { Month: '2024-04', Actual: 45, Budget: 35 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'line', interpolate: 'step-after', strokeWidth: 3, color: '#8B5CF6' },
          encoding: { x: { field: 'Month', type: 'temporal' }, y: { field: 'Actual', type: 'quantitative' } },
        },
        {
          mark: { type: 'line', strokeDash: [4, 4], strokeWidth: 2, color: '#64748B' },
          encoding: { x: { field: 'Month', type: 'temporal' }, y: { field: 'Budget', type: 'quantitative' } },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="115" x2="290" y2="115" stroke="#CBD5E1" stroke-width="1.5" />
          <!-- Budget target dashed -->
          <line x1="40" y1="100" x2="280" y2="25" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 4" />
          <!-- Step line actuals -->
          <path d="M 40 105 L 90 105 L 90 85 L 150 85 L 150 60 L 210 60 L 210 35 L 280 35" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="280" cy="35" r="5" fill="${c}" stroke="#1E293B" stroke-width="2" />
        </svg>
      `;
    },
  },
  {
    id: 'sparkline-minmax',
    name: 'Sparkline with Min / Max Callouts',
    description: 'High-density micro sparkline with automated colored callout dots spotlighting historical maximum peak and minimum trough.',
    category: 'trends',
    badge: 'Micro-Chart',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Day', type: 'Column', dataType: 'temporal', description: 'Daily timestamp' },
      { name: 'Value', type: 'Measure', dataType: 'quantitative', description: 'Daily metric' },
    ],
    sampleData: [
      { Day: '1', Val: 12 }, { Day: '2', Val: 19 }, { Day: '3', Val: 3 },
      { Day: '4', Val: 25 }, { Day: '5', Val: 18 }, { Day: '6', Val: 29 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'line', strokeWidth: 2.5, color: '#8B5CF6' },
          encoding: { x: { field: 'Day', type: 'nominal' }, y: { field: 'Val', type: 'quantitative' } },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M 30 80 Q 70 30 110 95 T 190 40 T 260 20 T 290 55" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" />
          <!-- Peak point -->
          <circle cx="260" cy="20" r="5.5" fill="#10B981" stroke="#1E293B" stroke-width="2" />
          <text x="260" y="12" text-anchor="middle" font-size="8" font-weight="black" fill="#10B981">MAX $29k</text>
          <!-- Trough point -->
          <circle cx="110" cy="95" r="5.5" fill="#EF4444" stroke="#1E293B" stroke-width="2" />
          <text x="110" y="112" text-anchor="middle" font-size="8" font-weight="black" fill="#EF4444">MIN $3k</text>
        </svg>
      `;
    },
  },
  {
    id: 'gradient-area',
    name: 'Gradient Filled Area Run-Rate',
    description: 'Smooth cubic spline curve with translucent vertical gradient fill for modern executive revenue and transaction tracking.',
    category: 'trends',
    badge: 'Aesthetic',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Date', type: 'Column', dataType: 'temporal', description: 'Continuous date axis' },
      { name: 'Revenue', type: 'Measure', dataType: 'quantitative', description: 'Monetary volume' },
    ],
    sampleData: [
      { Date: '2024-01-01', Revenue: 140 },
      { Date: '2024-02-01', Revenue: 210 },
      { Date: '2024-03-01', Revenue: 190 },
      { Date: '2024-04-01', Revenue: 320 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'area', interpolate: 'monotone', opacity: 0.35, color: '#8B5CF6' },
          encoding: { x: { field: 'Date', type: 'temporal' }, y: { field: 'Revenue', type: 'quantitative' } },
        },
        {
          mark: { type: 'line', interpolate: 'monotone', strokeWidth: 3, color: '#8B5CF6' },
          encoding: { x: { field: 'Date', type: 'temporal' }, y: { field: 'Revenue', type: 'quantitative' } },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${c}" stop-opacity="0.45" />
              <stop offset="100%" stop-color="${c}" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <path d="M 30 95 C 80 85, 120 40, 170 65 S 240 25, 290 30 L 290 120 L 30 120 Z" fill="url(#areaGrad)" />
          <path d="M 30 95 C 80 85, 120 40, 170 65 S 240 25, 290 30" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" />
          <circle cx="290" cy="30" r="5" fill="${c}" stroke="#1E293B" stroke-width="2" />
        </svg>
      `;
    },
  },
  {
    id: 'range-band-forecast',
    name: 'Forecast Corridor & Prediction Bands',
    description: 'Historical time-series transitioning into a central forecast trajectory flanked by shaded 80% and 95% confidence intervals.',
    category: 'trends',
    badge: 'AI / Forecast',
    provider: 'vegaLite',
    schemaUrl: 'https://vega.github.io/schema/vega-lite/v5.json',
    dataRoles: [
      { name: 'Month', type: 'Column', dataType: 'temporal', description: 'Timeline' },
      { name: 'ForecastMean', type: 'Measure', dataType: 'quantitative', description: 'Mean projection' },
      { name: 'UpperBand', type: 'Measure', dataType: 'quantitative', description: 'Upper confidence limit' },
      { name: 'LowerBand', type: 'Measure', dataType: 'quantitative', description: 'Lower confidence limit' },
    ],
    sampleData: [
      { Month: 'Jun', Val: 50, Lower: 50, Upper: 50 },
      { Month: 'Jul', Val: 55, Lower: 51, Upper: 59 },
      { Month: 'Aug', Val: 62, Lower: 54, Upper: 70 },
      { Month: 'Sep', Val: 68, Lower: 58, Upper: 78 },
    ],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: 'dataset' },
      layer: [
        {
          mark: { type: 'area', opacity: 0.25, color: '#8B5CF6' },
          encoding: {
            x: { field: 'Month', type: 'nominal' },
            y: { field: 'LowerBand', type: 'quantitative' },
            y2: { field: 'UpperBand' },
          },
        },
        {
          mark: { type: 'line', strokeWidth: 3, color: '#8B5CF6' },
          encoding: { x: { field: 'Month', type: 'nominal' }, y: { field: 'ForecastMean', type: 'quantitative' } },
        },
      ],
    },
    renderPreviewSvg: (palette) => {
      const c = palette[0] || '#8B5CF6';
      return `
        <svg viewBox="0 0 320 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="160" y1="15" x2="160" y2="120" stroke="#94A3B8" stroke-dasharray="3 3" />
          <text x="155" y="25" text-anchor="end" font-size="8" font-weight="bold" fill="#64748B">Historical</text>
          <text x="165" y="25" font-size="8" font-weight="bold" fill="#8B5CF6">AI Forecast</text>
          <!-- Shaded corridor -->
          <polygon points="160,65 220,40 285,25 285,100 220,85 160,65" fill="${c}" opacity="0.2" />
          <!-- History line -->
          <path d="M 30 100 Q 90 90 160 65" fill="none" stroke="#1E293B" stroke-width="3" />
          <!-- Forecast line -->
          <path d="M 160 65 L 220 58 L 285 52" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="5 3" />
          <circle cx="285" cy="52" r="5" fill="${c}" stroke="#1E293B" stroke-width="2" />
        </svg>
      `;
    },
  },
];

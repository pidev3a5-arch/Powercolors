import { LayoutVisualItem, LayoutDimension } from './layoutTypes';

export interface LayoutPresetDefinition {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'analytics' | 'financial' | 'mobile';
  badge: string;
  dimensions: LayoutDimension;
  visuals: LayoutVisualItem[];
}

export const CURATED_LAYOUT_PRESETS: LayoutPresetDefinition[] = [
  {
    id: 'executive-scorecard',
    name: 'Executive Scorecard',
    description: 'Header ribbon, 4 key performance BANs, revenue line trend, category donut, and summary table.',
    category: 'executive',
    badge: 'Popular',
    dimensions: { width: 1280, height: 720, preset: '1280x720' },
    visuals: [
      { id: 'v-title', name: 'Executive Header', type: 'shape-text', x: 24, y: 24, width: 440, height: 48, zIndex: 1, color: '#8B5CF6' },
      { id: 'v-kpi1', name: 'Total Revenue', type: 'kpi', x: 24, y: 88, width: 290, height: 112, zIndex: 2, color: '#FBBF24' },
      { id: 'v-kpi2', name: 'Gross Margin %', type: 'kpi', x: 330, y: 88, width: 290, height: 112, zIndex: 3, color: '#F472B6' },
      { id: 'v-kpi3', name: 'Active Customers', type: 'kpi', x: 636, y: 88, width: 290, height: 112, zIndex: 4, color: '#34D399' },
      { id: 'v-kpi4', name: 'Net Retention Rate', type: 'kpi', x: 942, y: 88, width: 314, height: 112, zIndex: 5, color: '#60A5FA' },
      { id: 'v-trend', name: 'Monthly Trend vs Budget', type: 'line-chart', x: 24, y: 216, width: 760, height: 264, zIndex: 6, color: '#8B5CF6' },
      { id: 'v-mix', name: 'Product Revenue Mix', type: 'donut-chart', x: 800, y: 216, width: 456, height: 264, zIndex: 7, color: '#34D399' },
      { id: 'v-table', name: 'Channel Detail Table', type: 'table', x: 24, y: 496, width: 1232, height: 200, zIndex: 8, color: '#FB7185' },
    ],
  },
  {
    id: 'analytics-split',
    name: 'Slicer Ribbon + 2x2 Matrix',
    description: 'Dedicated left-hand filter navigation bar with a clean 2x2 analytics quadrant grid.',
    category: 'analytics',
    badge: 'Deep Dive',
    dimensions: { width: 1280, height: 720, preset: '1280x720' },
    visuals: [
      { id: 'v-slicer-1', name: 'Date Range Slicer', type: 'slicer', x: 24, y: 24, width: 220, height: 140, zIndex: 1, color: '#F97316' },
      { id: 'v-slicer-2', name: 'Region / Segment Slicer', type: 'slicer', x: 24, y: 180, width: 220, height: 220, zIndex: 2, color: '#F97316' },
      { id: 'v-slicer-3', name: 'Product Hierarchy', type: 'slicer', x: 24, y: 416, width: 220, height: 280, zIndex: 3, color: '#F97316' },
      { id: 'v-q1', name: 'Sales by Category', type: 'bar-chart', x: 268, y: 24, width: 480, height: 324, zIndex: 4, color: '#60A5FA' },
      { id: 'v-q2', name: 'Profitability Matrix', type: 'matrix', x: 764, y: 24, width: 492, height: 324, zIndex: 5, color: '#8B5CF6' },
      { id: 'v-q3', name: 'Variance Analysis', type: 'waterfall', x: 268, y: 364, width: 480, height: 332, zIndex: 6, color: '#2DD4BF' },
      { id: 'v-q4', name: 'Customer Cohort Line', type: 'line-chart', x: 764, y: 364, width: 492, height: 332, zIndex: 7, color: '#F472B6' },
    ],
  },
  {
    id: 'hero-storyline',
    name: 'Hero Visual + 3 Columns',
    description: 'Large top visual for focal executive storytelling, with 3 supporting breakdown columns below.',
    category: 'analytics',
    badge: 'Storyline',
    dimensions: { width: 1280, height: 720, preset: '1280x720' },
    visuals: [
      { id: 'v-header', name: 'Market Overview Header', type: 'shape-text', x: 24, y: 24, width: 600, height: 44, zIndex: 1, color: '#8B5CF6' },
      { id: 'v-hero', name: 'Primary Revenue Run-Rate Trend', type: 'line-chart', x: 24, y: 84, width: 1232, height: 336, zIndex: 2, color: '#8B5CF6' },
      { id: 'v-col1', name: 'Regional Breakdown', type: 'column-chart', x: 24, y: 436, width: 394, height: 260, zIndex: 3, color: '#38BDF8' },
      { id: 'v-col2', name: 'Product Contribution', type: 'bar-chart', x: 442, y: 436, width: 394, height: 260, zIndex: 4, color: '#34D399' },
      { id: 'v-col3', name: 'Channel Performance', type: 'donut-chart', x: 860, y: 436, width: 396, height: 260, zIndex: 5, color: '#FBBF24' },
    ],
  },
  {
    id: 'financial-matrix-bans',
    name: 'P&L Financial Matrix & Waterfall',
    description: 'Dedicated financial reporting layout with summary BANs, formal P&L matrix, and variance waterfall.',
    category: 'financial',
    badge: 'Finance',
    dimensions: { width: 1280, height: 720, preset: '1280x720' },
    visuals: [
      { id: 'v-fin-kpi1', name: 'Operating Income', type: 'kpi', x: 24, y: 24, width: 390, height: 110, zIndex: 1, color: '#10B981' },
      { id: 'v-fin-kpi2', name: 'EBITDA Actual vs Budget', type: 'kpi', x: 438, y: 24, width: 390, height: 110, zIndex: 2, color: '#F59E0B' },
      { id: 'v-fin-kpi3', name: 'Free Cash Flow', type: 'kpi', x: 852, y: 24, width: 404, height: 110, zIndex: 3, color: '#6366F1' },
      { id: 'v-matrix', name: 'Detailed Statement Matrix (P&L)', type: 'matrix', x: 24, y: 150, width: 720, height: 546, zIndex: 4, color: '#E11D48' },
      { id: 'v-waterfall', name: 'Variance Reconciliation Waterfall', type: 'waterfall', x: 760, y: 150, width: 496, height: 264, zIndex: 5, color: '#2DD4BF' },
      { id: 'v-gauge', name: 'Budget Execution Gauge', type: 'gauge', x: 760, y: 430, width: 496, height: 266, zIndex: 6, color: '#EC4899' },
    ],
  },
  {
    id: 'mobile-portrait',
    name: 'Power BI Mobile Portrait (390 × 844)',
    description: 'Optimized vertical single-column card stack tailored specifically for Power BI Mobile view.',
    category: 'mobile',
    badge: 'Mobile App',
    dimensions: { width: 390, height: 844, preset: '390x844' },
    visuals: [
      { id: 'v-mob-title', name: 'Mobile Header', type: 'shape-text', x: 16, y: 16, width: 358, height: 44, zIndex: 1, color: '#8B5CF6' },
      { id: 'v-mob-kpi1', name: 'Net Revenue BAN', type: 'kpi', x: 16, y: 72, width: 358, height: 104, zIndex: 2, color: '#FBBF24' },
      { id: 'v-mob-kpi2', name: 'Active Orders', type: 'kpi', x: 16, y: 188, width: 358, height: 104, zIndex: 3, color: '#34D399' },
      { id: 'v-mob-trend', name: '7-Day Trend Sparkline', type: 'line-chart', x: 16, y: 304, width: 358, height: 210, zIndex: 4, color: '#8B5CF6' },
      { id: 'v-mob-bar', name: 'Top 5 Categories', type: 'bar-chart', x: 16, y: 526, width: 358, height: 190, zIndex: 5, color: '#60A5FA' },
      { id: 'v-mob-slicer', name: 'Period Switcher', type: 'slicer', x: 16, y: 728, width: 358, height: 100, zIndex: 6, color: '#F97316' },
    ],
  },
];

export type PbiVisualType =
  | 'card'
  | 'multi-card'
  | 'bar-chart'
  | 'column-chart'
  | 'line-chart'
  | 'area-chart'
  | 'donut-chart'
  | 'pie-chart'
  | 'table'
  | 'matrix'
  | 'slicer'
  | 'kpi'
  | 'gauge'
  | 'waterfall'
  | 'treemap'
  | 'decomp-tree'
  | 'shape-text'
  | 'custom';

export interface PbiVisualTypeMeta {
  type: PbiVisualType;
  label: string;
  category: 'kpi' | 'chart' | 'tabular' | 'filter' | 'advanced';
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  badgeBg: string;
  badgeText: string;
}

export const VISUAL_TYPES_CATALOG: PbiVisualTypeMeta[] = [
  {
    type: 'kpi',
    label: 'KPI Card (New)',
    category: 'kpi',
    icon: 'Sparkles',
    defaultWidth: 280,
    defaultHeight: 120,
    badgeBg: '#FBBF24',
    badgeText: '#1E293B',
  },
  {
    type: 'card',
    label: 'Single Value Card',
    category: 'kpi',
    icon: 'CreditCard',
    defaultWidth: 200,
    defaultHeight: 100,
    badgeBg: '#F472B6',
    badgeText: '#FFFFFF',
  },
  {
    type: 'multi-card',
    label: 'Multi-Row Card',
    category: 'kpi',
    icon: 'LayoutList',
    defaultWidth: 320,
    defaultHeight: 140,
    badgeBg: '#F59E0B',
    badgeText: '#FFFFFF',
  },
  {
    type: 'gauge',
    label: 'Gauge / Radial',
    category: 'kpi',
    icon: 'Gauge',
    defaultWidth: 240,
    defaultHeight: 160,
    badgeBg: '#EC4899',
    badgeText: '#FFFFFF',
  },
  {
    type: 'bar-chart',
    label: 'Clustered Bar Chart',
    category: 'chart',
    icon: 'BarChart2',
    defaultWidth: 440,
    defaultHeight: 280,
    badgeBg: '#60A5FA',
    badgeText: '#1E293B',
  },
  {
    type: 'column-chart',
    label: 'Clustered Column Chart',
    category: 'chart',
    icon: 'BarChart',
    defaultWidth: 440,
    defaultHeight: 280,
    badgeBg: '#38BDF8',
    badgeText: '#1E293B',
  },
  {
    type: 'line-chart',
    label: 'Line Trend Chart',
    category: 'chart',
    icon: 'TrendingUp',
    defaultWidth: 500,
    defaultHeight: 260,
    badgeBg: '#8B5CF6',
    badgeText: '#FFFFFF',
  },
  {
    type: 'area-chart',
    label: 'Area Trend Chart',
    category: 'chart',
    icon: 'Activity',
    defaultWidth: 500,
    defaultHeight: 260,
    badgeBg: '#A78BFA',
    badgeText: '#1E293B',
  },
  {
    type: 'donut-chart',
    label: 'Donut / Ring Chart',
    category: 'chart',
    icon: 'PieChart',
    defaultWidth: 320,
    defaultHeight: 260,
    badgeBg: '#34D399',
    badgeText: '#1E293B',
  },
  {
    type: 'pie-chart',
    label: 'Pie Chart',
    category: 'chart',
    icon: 'Disc',
    defaultWidth: 320,
    defaultHeight: 260,
    badgeBg: '#10B981',
    badgeText: '#FFFFFF',
  },
  {
    type: 'waterfall',
    label: 'Waterfall Chart',
    category: 'chart',
    icon: 'Sliders',
    defaultWidth: 480,
    defaultHeight: 280,
    badgeBg: '#2DD4BF',
    badgeText: '#1E293B',
  },
  {
    type: 'treemap',
    label: 'Treemap',
    category: 'chart',
    icon: 'Grid',
    defaultWidth: 400,
    defaultHeight: 260,
    badgeBg: '#06B6D4',
    badgeText: '#FFFFFF',
  },
  {
    type: 'table',
    label: 'Detailed Table',
    category: 'tabular',
    icon: 'Table',
    defaultWidth: 580,
    defaultHeight: 320,
    badgeBg: '#FB7185',
    badgeText: '#FFFFFF',
  },
  {
    type: 'matrix',
    label: 'Financial Matrix',
    category: 'tabular',
    icon: 'Grid',
    defaultWidth: 620,
    defaultHeight: 360,
    badgeBg: '#E11D48',
    badgeText: '#FFFFFF',
  },
  {
    type: 'slicer',
    label: 'Filter Slicer / Button',
    category: 'filter',
    icon: 'Filter',
    defaultWidth: 220,
    defaultHeight: 180,
    badgeBg: '#F97316',
    badgeText: '#FFFFFF',
  },
  {
    type: 'decomp-tree',
    label: 'Decomposition Tree',
    category: 'advanced',
    icon: 'GitBranch',
    defaultWidth: 600,
    defaultHeight: 360,
    badgeBg: '#6366F1',
    badgeText: '#FFFFFF',
  },
  {
    type: 'shape-text',
    label: 'Header / Text / Banner',
    category: 'advanced',
    icon: 'Type',
    defaultWidth: 400,
    defaultHeight: 60,
    badgeBg: '#94A3B8',
    badgeText: '#1E293B',
  },
  {
    type: 'custom',
    label: 'Custom Visual / HTML / SVG',
    category: 'advanced',
    icon: 'Box',
    defaultWidth: 340,
    defaultHeight: 220,
    badgeBg: '#CBD5E1',
    badgeText: '#1E293B',
  },
];

export interface LayoutVisualItem {
  id: string;
  name: string;
  type: PbiVisualType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  color?: string;
  locked?: boolean;
  notes?: string;
}

export type LayoutResolutionPreset = '1280x720' | '1920x1080' | '1440x900' | '1024x768' | '390x844' | 'custom';

export interface LayoutDimension {
  width: number;
  height: number;
  preset: LayoutResolutionPreset;
}

export interface GridSnapConfig {
  enabled: boolean;
  size: number; // e.g. 8 or 16
  showGrid: boolean;
}

export interface ReportLayoutState {
  name: string;
  dimensions: LayoutDimension;
  grid: GridSnapConfig;
  backgroundColor: string;
  visuals: LayoutVisualItem[];
}

export const RESOLUTION_PRESETS: { preset: LayoutResolutionPreset; label: string; width: number; height: number; aspect: string }[] = [
  { preset: '1280x720', label: '16:9 Standard HD (1280 × 720)', width: 1280, height: 720, aspect: '16:9' },
  { preset: '1920x1080', label: '16:9 Full HD (1920 × 1080)', width: 1920, height: 1080, aspect: '16:9' },
  { preset: '1440x900', label: '16:10 Laptop (1440 × 900)', width: 1440, height: 900, aspect: '16:10' },
  { preset: '1024x768', label: '4:3 Compact (1024 × 768)', width: 1024, height: 768, aspect: '4:3' },
  { preset: '390x844', label: 'Mobile Portrait View (390 × 844)', width: 390, height: 844, aspect: '9:19.5' },
];

export const DEFAULT_LAYOUT_STATE: ReportLayoutState = {
  name: 'Sales Performance Dashboard',
  dimensions: {
    width: 1280,
    height: 720,
    preset: '1280x720',
  },
  grid: {
    enabled: true,
    size: 8,
    showGrid: true,
  },
  backgroundColor: '#F8FAFC',
  visuals: [
    {
      id: 'vis-header',
      name: 'Report Title & Period',
      type: 'shape-text',
      x: 24,
      y: 24,
      width: 480,
      height: 48,
      zIndex: 1,
      color: '#8B5CF6',
    },
    {
      id: 'vis-kpi-1',
      name: 'Total Revenue BAN',
      type: 'kpi',
      x: 24,
      y: 88,
      width: 290,
      height: 120,
      zIndex: 2,
      color: '#FBBF24',
    },
    {
      id: 'vis-kpi-2',
      name: 'Gross Margin %',
      type: 'kpi',
      x: 330,
      y: 88,
      width: 290,
      height: 120,
      zIndex: 3,
      color: '#F472B6',
    },
    {
      id: 'vis-kpi-3',
      name: 'Active Customers',
      type: 'kpi',
      x: 636,
      y: 88,
      width: 290,
      height: 120,
      zIndex: 4,
      color: '#34D399',
    },
    {
      id: 'vis-kpi-4',
      name: 'Avg Order Value',
      type: 'kpi',
      x: 942,
      y: 88,
      width: 314,
      height: 120,
      zIndex: 5,
      color: '#60A5FA',
    },
    {
      id: 'vis-chart-1',
      name: 'Revenue vs Target Trend',
      type: 'line-chart',
      x: 24,
      y: 224,
      width: 760,
      height: 260,
      zIndex: 6,
      color: '#8B5CF6',
    },
    {
      id: 'vis-chart-2',
      name: 'Revenue by Category',
      type: 'donut-chart',
      x: 800,
      y: 224,
      width: 456,
      height: 260,
      zIndex: 7,
      color: '#34D399',
    },
    {
      id: 'vis-table-1',
      name: 'Regional Breakdown Table',
      type: 'table',
      x: 24,
      y: 500,
      width: 1232,
      height: 196,
      zIndex: 8,
      color: '#FB7185',
    },
  ],
};

/**
 * Snaps a pixel value to the configured grid interval if snap is enabled.
 */
export function snapToGrid(value: number, gridSize: number, enabled = true): number {
  if (!enabled || gridSize <= 1) return Math.round(value);
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Clamps coordinates within canvas bounds.
 */
export function clampCoordinates(
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; width: number; height: number } {
  const minW = 40;
  const minH = 30;
  const clampedWidth = Math.max(minW, Math.min(width, canvasWidth));
  const clampedHeight = Math.max(minH, Math.min(height, canvasHeight));
  const clampedX = Math.max(0, Math.min(x, canvasWidth - clampedWidth));
  const clampedY = Math.max(0, Math.min(y, canvasHeight - clampedHeight));
  return { x: clampedX, y: clampedY, width: clampedWidth, height: clampedHeight };
}

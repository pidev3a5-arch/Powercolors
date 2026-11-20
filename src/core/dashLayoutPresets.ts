import {
  LayoutPresetType,
  NavBarConfig,
  VisualContainerConfig,
} from './dashTypes';

export interface LayoutPresetInfo {
  type: LayoutPresetType;
  name: string;
  description: string;
  containerCount: number;
}

export const LAYOUT_PRESETS_CATALOG: LayoutPresetInfo[] = [
  {
    type: 'executive-overview',
    name: 'Executive Overview',
    description: 'Top KPI summary metrics + 2 balanced deep-dive charts',
    containerCount: 6,
  },
  {
    type: 'grid-2x2',
    name: '2×2 Quad Grid',
    description: 'Four equal quadrant visual zones for balanced multi-category analysis',
    containerCount: 4,
  },
  {
    type: 'three-column',
    name: '3-Column Slice',
    description: 'Three vertical analysis columns for comparative reporting',
    containerCount: 3,
  },
  {
    type: 'dense-analytics',
    name: 'Dense Analytics',
    description: 'KPI strip + 3 mid-tier charts + wide bottom table or matrix',
    containerCount: 8,
  },
  {
    type: 'single-hero',
    name: 'Hero Focus',
    description: 'Header overview strip + large expansive central visual container',
    containerCount: 2,
  },
];

/**
 * Calculates responsive pixel coordinates for visual container shapes
 * based on selected layout preset, canvas resolution, and navigation bar orientation.
 */
export function generateLayoutContainers(
  preset: LayoutPresetType,
  canvasWidth: number,
  canvasHeight: number,
  navBar: NavBarConfig
): VisualContainerConfig[] {
  // Determine usable bounds taking nav bar into account
  let usableX = 0;
  let usableY = 0;
  let usableWidth = canvasWidth;
  let usableHeight = canvasHeight;

  if (navBar.show) {
    if (navBar.orientation === 'left') {
      usableX = navBar.size;
      usableWidth = canvasWidth - navBar.size;
    } else {
      usableY = navBar.size;
      usableHeight = canvasHeight - navBar.size;
    }
  }

  // Margin and gap scaling based on resolution
  const isHighRes = canvasWidth >= 1920;
  const padding = isHighRes ? 28 : 20;
  const gap = isHighRes ? 20 : 16;

  const contentX = usableX + padding;
  const contentY = usableY + padding;
  const contentW = Math.max(100, usableWidth - 2 * padding);
  const contentH = Math.max(100, usableHeight - 2 * padding);

  switch (preset) {
    case 'executive-overview': {
      // 4 Top KPI Cards
      const kpiCount = 4;
      const kpiGapTotal = (kpiCount - 1) * gap;
      const kpiW = Math.floor((contentW - kpiGapTotal) / kpiCount);
      const kpiH = Math.min(130, Math.floor(contentH * 0.22));

      const kpis: VisualContainerConfig[] = [
        {
          id: 'container-kpi-1',
          title: 'Total Revenue',
          subtitle: 'Gross sales YTD vs target',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: kpiW,
          height: kpiH,
        },
        {
          id: 'container-kpi-2',
          title: 'Active Customers',
          subtitle: '30-day active user cohort',
          showTitle: true,
          showSubtitle: true,
          x: contentX + (kpiW + gap),
          y: contentY,
          width: kpiW,
          height: kpiH,
        },
        {
          id: 'container-kpi-3',
          title: 'Gross Margin %',
          subtitle: 'Net profitability ratio',
          showTitle: true,
          showSubtitle: true,
          x: contentX + 2 * (kpiW + gap),
          y: contentY,
          width: kpiW,
          height: kpiH,
        },
        {
          id: 'container-kpi-4',
          title: 'NPS Satisfaction',
          subtitle: 'Quarterly CSAT index',
          showTitle: true,
          showSubtitle: true,
          x: contentX + 3 * (kpiW + gap),
          y: contentY,
          width: contentW - 3 * (kpiW + gap), // absorbs rounding remainder
          height: kpiH,
        },
      ];

      // 2 Main Charts below
      const mainY = contentY + kpiH + gap;
      const mainH = contentH - kpiH - gap;
      const leftW = Math.floor((contentW - gap) * 0.62);
      const rightW = contentW - gap - leftW;

      const mainCharts: VisualContainerConfig[] = [
        {
          id: 'container-main-1',
          title: 'Monthly Revenue & Trend',
          subtitle: 'Comparison by business category',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: mainY,
          width: leftW,
          height: mainH,
        },
        {
          id: 'container-main-2',
          title: 'Regional Breakdown',
          subtitle: 'Performance by geographical territory',
          showTitle: true,
          showSubtitle: true,
          x: contentX + leftW + gap,
          y: mainY,
          width: rightW,
          height: mainH,
        },
      ];

      return [...kpis, ...mainCharts];
    }

    case 'grid-2x2': {
      const colW = Math.floor((contentW - gap) / 2);
      const rowH = Math.floor((contentH - gap) / 2);

      return [
        {
          id: 'container-quad-1',
          title: 'Top Performers',
          subtitle: 'By sales revenue & units',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: colW,
          height: rowH,
        },
        {
          id: 'container-quad-2',
          title: 'Trend Analysis',
          subtitle: 'Daily volume over time',
          showTitle: true,
          showSubtitle: true,
          x: contentX + colW + gap,
          y: contentY,
          width: contentW - colW - gap,
          height: rowH,
        },
        {
          id: 'container-quad-3',
          title: 'Segment Contribution',
          subtitle: 'Share of overall growth',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY + rowH + gap,
          width: colW,
          height: contentH - rowH - gap,
        },
        {
          id: 'container-quad-4',
          title: 'Operational Health',
          subtitle: 'Service level compliance',
          showTitle: true,
          showSubtitle: true,
          x: contentX + colW + gap,
          y: contentY + rowH + gap,
          width: contentW - colW - gap,
          height: contentH - rowH - gap,
        },
      ];
    }

    case 'three-column': {
      const colCount = 3;
      const totalGap = (colCount - 1) * gap;
      const colW = Math.floor((contentW - totalGap) / colCount);

      return [
        {
          id: 'container-col-1',
          title: 'Acquisition Funnel',
          subtitle: 'Lead conversion & inbound traffic',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: colW,
          height: contentH,
        },
        {
          id: 'container-col-2',
          title: 'Engagement & Retention',
          subtitle: 'Product adoption & weekly cohorts',
          showTitle: true,
          showSubtitle: true,
          x: contentX + (colW + gap),
          y: contentY,
          width: colW,
          height: contentH,
        },
        {
          id: 'container-col-3',
          title: 'Monetization & LTV',
          subtitle: 'Expansion revenue & renewals',
          showTitle: true,
          showSubtitle: true,
          x: contentX + 2 * (colW + gap),
          y: contentY,
          width: contentW - 2 * (colW + gap),
          height: contentH,
        },
      ];
    }

    case 'dense-analytics': {
      // Row 1: 4 KPIs
      const kpiCount = 4;
      const kpiW = Math.floor((contentW - (kpiCount - 1) * gap) / kpiCount);
      const kpiH = Math.min(105, Math.floor(contentH * 0.18));

      const row1: VisualContainerConfig[] = [
        {
          id: 'dense-kpi-1',
          title: 'ARR',
          subtitle: 'Annualized run-rate',
          showTitle: true,
          showSubtitle: false,
          x: contentX,
          y: contentY,
          width: kpiW,
          height: kpiH,
        },
        {
          id: 'dense-kpi-2',
          title: 'Net Retention',
          subtitle: 'NDR trailing 12 mo',
          showTitle: true,
          showSubtitle: false,
          x: contentX + (kpiW + gap),
          y: contentY,
          width: kpiW,
          height: kpiH,
        },
        {
          id: 'dense-kpi-3',
          title: 'CAC Payback',
          subtitle: 'Months to recover CAC',
          showTitle: true,
          showSubtitle: false,
          x: contentX + 2 * (kpiW + gap),
          y: contentY,
          width: kpiW,
          height: kpiH,
        },
        {
          id: 'dense-kpi-4',
          title: 'Gross Margin',
          subtitle: 'Trailing margin',
          showTitle: true,
          showSubtitle: false,
          x: contentX + 3 * (kpiW + gap),
          y: contentY,
          width: contentW - 3 * (kpiW + gap),
          height: kpiH,
        },
      ];

      // Row 2: 3 Medium Charts
      const row2Y = contentY + kpiH + gap;
      const row2H = Math.floor((contentH - kpiH - 2 * gap) * 0.52);
      const row2Count = 3;
      const row2W = Math.floor((contentW - (row2Count - 1) * gap) / row2Count);

      const row2: VisualContainerConfig[] = [
        {
          id: 'dense-chart-1',
          title: 'Revenue Distribution',
          subtitle: 'By product line',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: row2Y,
          width: row2W,
          height: row2H,
        },
        {
          id: 'dense-chart-2',
          title: 'Monthly Velocity',
          subtitle: 'Deals closed & pipeline',
          showTitle: true,
          showSubtitle: true,
          x: contentX + (row2W + gap),
          y: row2Y,
          width: row2W,
          height: row2H,
        },
        {
          id: 'dense-chart-3',
          title: 'Customer Health Index',
          subtitle: 'Support escalations vs baseline',
          showTitle: true,
          showSubtitle: true,
          x: contentX + 2 * (row2W + gap),
          y: row2Y,
          width: contentW - 2 * (row2W + gap),
          height: row2H,
        },
      ];

      // Row 3: Wide Data Table / Matrix
      const row3Y = row2Y + row2H + gap;
      const row3H = contentH - (kpiH + gap) - (row2H + gap);

      const row3: VisualContainerConfig[] = [
        {
          id: 'dense-table-1',
          title: 'Detailed Account Matrix',
          subtitle: 'Key account level metrics & contract renewals',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: row3Y,
          width: contentW,
          height: row3H,
        },
      ];

      return [...row1, ...row2, ...row3];
    }

    case 'single-hero': {
      const topH = Math.min(120, Math.floor(contentH * 0.18));
      const heroY = contentY + topH + gap;
      const heroH = contentH - topH - gap;

      return [
        {
          id: 'hero-header',
          title: 'Executive KPI Summary',
          subtitle: 'Consolidated performance overview',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: contentW,
          height: topH,
        },
        {
          id: 'hero-main',
          title: 'Comprehensive Performance Analysis',
          subtitle: 'Interactive multi-dimensional view',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: heroY,
          width: contentW,
          height: heroH,
        },
      ];
    }

    default:
      return [];
  }
}

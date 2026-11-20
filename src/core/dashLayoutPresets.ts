import {
  LayoutPresetType,
  NavBarConfig,
  VisualContainerConfig,
  PageTitleItem,
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
  // 4 New Presets
  {
    type: 'kpi-ribbon-grid',
    name: 'KPI Ribbon + 2×2 Grid',
    description: 'Full-width top KPI ribbon banner + 4 equal quadrant charts below',
    containerCount: 5,
  },
  {
    type: 'left-focus-split',
    name: 'Left Focus Split',
    description: '1 dominant master deep-dive chart on left + 2 stacked charts on right',
    containerCount: 3,
  },
  {
    type: 'top-storyline',
    name: 'Storyline Flow',
    description: 'Full-width executive storyline header + 3 funnel / process cards below',
    containerCount: 4,
  },
  {
    type: 'multi-tier-matrix',
    name: 'Multi-Tier Matrix',
    description: '3 top KPI cards + 2 comparison charts + 2 breakdown matrix cards',
    containerCount: 7,
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
  navBar: NavBarConfig,
  pageTitles?: PageTitleItem[]
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

  // Check if any active page titles are positioned at the top or bottom
  const hasTopTitle =
    pageTitles &&
    pageTitles.some(
      (pt) =>
        (pt.position === 'top-right' || pt.position === 'top-left') &&
        ((pt.title && pt.title.trim().length > 0) || (pt.subtitle && pt.subtitle.trim().length > 0))
    );
  const hasBottomTitle =
    pageTitles &&
    pageTitles.some(
      (pt) =>
        (pt.position === 'bottom-right' || pt.position === 'bottom-left') &&
        ((pt.title && pt.title.trim().length > 0) || (pt.subtitle && pt.subtitle.trim().length > 0))
    );

  const topHeaderH = hasTopTitle ? (isHighRes ? 68 : 56) : 0;
  const bottomHeaderH = hasBottomTitle ? (isHighRes ? 44 : 36) : 0;

  const contentX = usableX + padding;
  const contentY = usableY + padding + topHeaderH;
  const contentW = Math.max(100, usableWidth - 2 * padding);
  const contentH = Math.max(100, usableHeight - 2 * padding - topHeaderH - bottomHeaderH);

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
          width: contentW - 3 * (kpiW + gap),
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
      const kpiCount = 4;
      const kpiW = Math.floor((contentW - (kpiCount - 1) * gap) / kpiCount);
      const kpiH = Math.min(105, Math.floor(contentH * 0.18));

      const row1: VisualContainerConfig[] = [
        {
          id: 'dense-kpi-1',
          title: 'ARR Run-Rate',
          subtitle: 'Annualized revenue',
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
          subtitle: 'Trailing margin %',
          showTitle: true,
          showSubtitle: false,
          x: contentX + 3 * (kpiW + gap),
          y: contentY,
          width: contentW - 3 * (kpiW + gap),
          height: kpiH,
        },
      ];

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

    // 4 NEW LAYOUT PRESETS
    case 'kpi-ribbon-grid': {
      const ribbonH = Math.min(115, Math.floor(contentH * 0.20));
      const gridY = contentY + ribbonH + gap;
      const gridH = contentH - ribbonH - gap;
      const quadW = Math.floor((contentW - gap) / 2);
      const quadH = Math.floor((gridH - gap) / 2);

      return [
        {
          id: 'kpi-ribbon-bar',
          title: 'Global Performance Banner',
          subtitle: 'Key metrics snapshot across business units',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: contentW,
          height: ribbonH,
        },
        {
          id: 'kpi-grid-1',
          title: 'Sales Trajectory',
          subtitle: 'Revenue vs forecast',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: gridY,
          width: quadW,
          height: quadH,
        },
        {
          id: 'kpi-grid-2',
          title: 'Category Share',
          subtitle: 'Volume breakdown',
          showTitle: true,
          showSubtitle: true,
          x: contentX + quadW + gap,
          y: gridY,
          width: contentW - quadW - gap,
          height: quadH,
        },
        {
          id: 'kpi-grid-3',
          title: 'Customer Cohorts',
          subtitle: 'Acquisition & churn',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: gridY + quadH + gap,
          width: quadW,
          height: gridH - quadH - gap,
        },
        {
          id: 'kpi-grid-4',
          title: 'Regional Margins',
          subtitle: 'EBITDA contribution',
          showTitle: true,
          showSubtitle: true,
          x: contentX + quadW + gap,
          y: gridY + quadH + gap,
          width: contentW - quadW - gap,
          height: gridH - quadH - gap,
        },
      ];
    }

    case 'left-focus-split': {
      const leftColW = Math.floor((contentW - gap) * 0.54);
      const rightColW = contentW - gap - leftColW;
      const rightRowH = Math.floor((contentH - gap) / 2);

      return [
        {
          id: 'focus-master',
          title: 'Primary Trend & Forecast',
          subtitle: 'Deep-dive analytical view with multi-axis correlation',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: leftColW,
          height: contentH,
        },
        {
          id: 'focus-top-right',
          title: 'Top Segment Breakdown',
          subtitle: 'Performance distribution',
          showTitle: true,
          showSubtitle: true,
          x: contentX + leftColW + gap,
          y: contentY,
          width: rightColW,
          height: rightRowH,
        },
        {
          id: 'focus-bottom-right',
          title: 'Variance & Target Matrix',
          subtitle: 'Actuals vs budget delta',
          showTitle: true,
          showSubtitle: true,
          x: contentX + leftColW + gap,
          y: contentY + rightRowH + gap,
          width: rightColW,
          height: contentH - rightRowH - gap,
        },
      ];
    }

    case 'top-storyline': {
      const storyBannerH = Math.min(160, Math.floor(contentH * 0.28));
      const stageY = contentY + storyBannerH + gap;
      const stageH = contentH - storyBannerH - gap;
      const stageCount = 3;
      const stageW = Math.floor((contentW - (stageCount - 1) * gap) / stageCount);

      return [
        {
          id: 'story-header',
          title: 'Strategic Objectives & Executive Summary',
          subtitle: 'Quarterly milestones and high-level KPIs overview',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: contentW,
          height: storyBannerH,
        },
        {
          id: 'stage-1',
          title: 'Stage 1: Inbound & Reach',
          subtitle: 'Market engagement & top funnel',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: stageY,
          width: stageW,
          height: stageH,
        },
        {
          id: 'stage-2',
          title: 'Stage 2: Conversion & Value',
          subtitle: 'Deal progression & qualified leads',
          showTitle: true,
          showSubtitle: true,
          x: contentX + (stageW + gap),
          y: stageY,
          width: stageW,
          height: stageH,
        },
        {
          id: 'stage-3',
          title: 'Stage 3: Retention & LTV',
          subtitle: 'Customer health & renewal rates',
          showTitle: true,
          showSubtitle: true,
          x: contentX + 2 * (stageW + gap),
          y: stageY,
          width: contentW - 2 * (stageW + gap),
          height: stageH,
        },
      ];
    }

    case 'multi-tier-matrix': {
      // Row 1: 3 KPI cards
      const r1Count = 3;
      const r1W = Math.floor((contentW - (r1Count - 1) * gap) / r1Count);
      const r1H = Math.min(115, Math.floor(contentH * 0.20));

      const row1: VisualContainerConfig[] = [
        {
          id: 'tier-kpi-1',
          title: 'Gross Margin',
          subtitle: 'Trailing 12 Months',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: contentY,
          width: r1W,
          height: r1H,
        },
        {
          id: 'tier-kpi-2',
          title: 'Operating Cash Flow',
          subtitle: 'QoQ Trend',
          showTitle: true,
          showSubtitle: true,
          x: contentX + (r1W + gap),
          y: contentY,
          width: r1W,
          height: r1H,
        },
        {
          id: 'tier-kpi-3',
          title: 'EBITDA Run-Rate',
          subtitle: 'Normalized profit',
          showTitle: true,
          showSubtitle: true,
          x: contentX + 2 * (r1W + gap),
          y: contentY,
          width: contentW - 2 * (r1W + gap),
          height: r1H,
        },
      ];

      // Row 2: 2 comparison charts (50/50)
      const r2Y = contentY + r1H + gap;
      const r2H = Math.floor((contentH - r1H - 2 * gap) * 0.48);
      const r2W = Math.floor((contentW - gap) / 2);

      const row2: VisualContainerConfig[] = [
        {
          id: 'tier-chart-1',
          title: 'Product Line Variance',
          subtitle: 'Budget vs Actuals',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: r2Y,
          width: r2W,
          height: r2H,
        },
        {
          id: 'tier-chart-2',
          title: 'Regional Revenue',
          subtitle: 'Territory performance',
          showTitle: true,
          showSubtitle: true,
          x: contentX + r2W + gap,
          y: r2Y,
          width: contentW - r2W - gap,
          height: r2H,
        },
      ];

      // Row 3: 2 breakdown matrix cards (40/60)
      const r3Y = r2Y + r2H + gap;
      const r3H = contentH - (r1H + gap) - (r2H + gap);
      const r3LeftW = Math.floor((contentW - gap) * 0.40);
      const r3RightW = contentW - gap - r3LeftW;

      const row3: VisualContainerConfig[] = [
        {
          id: 'tier-breakdown-1',
          title: 'Segment Mix',
          subtitle: 'Customer breakdown',
          showTitle: true,
          showSubtitle: true,
          x: contentX,
          y: r3Y,
          width: r3LeftW,
          height: r3H,
        },
        {
          id: 'tier-breakdown-2',
          title: 'Account Detail Ledger',
          subtitle: 'Top customer transactions',
          showTitle: true,
          showSubtitle: true,
          x: contentX + r3LeftW + gap,
          y: r3Y,
          width: r3RightW,
          height: r3H,
        },
      ];

      return [...row1, ...row2, ...row3];
    }

    default:
      return [];
  }
}

/**
 * Smart Auto-Arrangement: Automatically reorganizes any list of containers
 * into a balanced, non-overlapping grid that fits within the usable canvas area.
 */
export function autoArrangeContainers(
  containers: VisualContainerConfig[],
  canvasWidth: number,
  canvasHeight: number,
  navBar: NavBarConfig,
  pageTitles?: PageTitleItem[]
): VisualContainerConfig[] {
  if (containers.length === 0) return [];

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

  const isHighRes = canvasWidth >= 1920;
  const padding = isHighRes ? 28 : 20;
  const gap = isHighRes ? 20 : 16;

  const hasTopTitle =
    pageTitles &&
    pageTitles.some(
      (pt) =>
        (pt.position === 'top-right' || pt.position === 'top-left') &&
        ((pt.title && pt.title.trim().length > 0) || (pt.subtitle && pt.subtitle.trim().length > 0))
    );
  const hasBottomTitle =
    pageTitles &&
    pageTitles.some(
      (pt) =>
        (pt.position === 'bottom-right' || pt.position === 'bottom-left') &&
        ((pt.title && pt.title.trim().length > 0) || (pt.subtitle && pt.subtitle.trim().length > 0))
    );

  const topHeaderH = hasTopTitle ? (isHighRes ? 68 : 56) : 0;
  const bottomHeaderH = hasBottomTitle ? (isHighRes ? 44 : 36) : 0;

  const contentX = usableX + padding;
  const contentY = usableY + padding + topHeaderH;
  const contentW = Math.max(100, usableWidth - 2 * padding);
  const contentH = Math.max(100, usableHeight - 2 * padding - topHeaderH - bottomHeaderH);

  const count = containers.length;

  // Decide grid rows and cols based on container count
  let cols = 1;
  let rows = 1;

  if (count <= 2) {
    cols = count;
    rows = 1;
  } else if (count <= 4) {
    cols = 2;
    rows = Math.ceil(count / 2);
  } else if (count <= 6) {
    cols = 3;
    rows = 2;
  } else if (count <= 9) {
    cols = 3;
    rows = 3;
  } else {
    cols = 4;
    rows = Math.ceil(count / 4);
  }

  const cellW = Math.floor((contentW - (cols - 1) * gap) / cols);
  const cellH = Math.floor((contentH - (rows - 1) * gap) / rows);

  return containers.map((c, index) => {
    const colIdx = index % cols;
    const rowIdx = Math.floor(index / cols);

    const x = contentX + colIdx * (cellW + gap);
    const y = contentY + rowIdx * (cellH + gap);

    // If last row has fewer items, stretch the last item
    const isLastItem = index === count - 1;
    const remainingInRow = cols - (count % cols);
    const width = isLastItem && remainingInRow > 0 && remainingInRow < cols
      ? contentW - (colIdx * (cellW + gap))
      : cellW;

    return {
      ...c,
      x,
      y,
      width,
      height: cellH,
    };
  });
}

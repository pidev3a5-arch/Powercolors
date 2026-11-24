export type KpiCardStyle =
  | 'neo-pop'
  | 'clean-white'
  | 'executive-dark'
  | 'glass-modern'
  | 'gradient-accent';

export type KpiTrendDirection = 'up' | 'down' | 'neutral';

export type KpiPolarity = 'good-up' | 'good-down' | 'neutral';

export type KpiMicroChartType =
  | 'none'
  | 'sparkline'
  | 'sparkarea'
  | 'progress-ring'
  | 'progress-bar'
  | 'bullet';

export type KpiBadgeStyle = 'solid' | 'subtle-tint' | 'outline' | 'pill-minimal';

export type KpiIconPosition = 'top-right' | 'top-left' | 'left-metric' | 'badge-corner';

export interface KpiCardConfig {
  id: string;
  name: string;
  description?: string;
  styleVariant: KpiCardStyle;

  // Dimensions & Container
  width: number;
  height: number;
  cornerRadius: number;
  borderWidth: number;
  borderColor: string;
  bgColor: string;
  shadowOffset: number;
  shadowColor: string;

  // Accent Bar
  showAccentBar: boolean;
  accentBarPosition: 'top' | 'left';
  accentBarColor: string;
  accentBarThickness: number;

  // Category / Header
  category: string;
  showCategory: boolean;
  categoryColor: string;
  categoryFontSize: number;
  categoryFontWeight: 'bold' | 'black' | 'medium';

  // Subtitle / Period
  subtitle: string;
  showSubtitle: boolean;
  subtitleColor: string;

  // Primary Metric
  value: string;
  unitSuffix: string;
  valueColor: string;
  valueFontSize: number;
  valueFontWeight: 'bold' | 'black' | 'extrabold';
  fontFamily: string;

  // Comparison & Target
  showTarget: boolean;
  targetLabel: string;
  targetValue: string;
  targetColor: string;

  // Variance / Delta Badge
  showBadge: boolean;
  badgeText: string;
  trendDirection: KpiTrendDirection;
  polarity: KpiPolarity;
  badgeStyle: KpiBadgeStyle;
  badgeBgColor?: string;
  badgeTextColor?: string;

  // Micro-Chart Graphic
  chartType: KpiMicroChartType;
  sparkPoints: number[];
  sparkColor: string;
  sparkAreaOpacity: number;
  sparkStrokeWidth: number;
  showPulseDot: boolean;
  progressValue: number; // 0 - 100
  progressMax: number;   // usually 100
  progressBarColor: string;

  // Icon System
  showIcon: boolean;
  iconName: string;
  iconPosition: KpiIconPosition;
  iconColor: string;
  iconBgColor?: string;
  iconSize: number;
  iconBadge: boolean;
  customIconSvg?: string;
}

export interface KpiCardPreset {
  id: string;
  name: string;
  description: string;
  category: 'Executive' | 'Finance' | 'Sales' | 'SaaS & Growth' | 'Operations' | 'Customer';
  config: KpiCardConfig;
}

export interface KpiScorecardConfig {
  name: string;
  gap: number;
  cards: KpiCardConfig[];
}

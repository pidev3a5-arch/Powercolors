export type IconCategory =
  | 'navigation'
  | 'finance'
  | 'analytics'
  | 'status'
  | 'logistics';

export interface SvgIconItem {
  id: string;
  name: string;
  category: IconCategory;
  tags: string[];
  viewBox?: string;
  // SVG inner paths and elements without the outer <svg> wrapper
  body: string;
  strokeWidth?: number;
  isFilled?: boolean;
}

export type IconBadgeStyle = 'none' | 'soft-rounded' | 'circle' | 'square-outline';

export interface IconCustomization {
  color: string;
  size: number; // 16, 20, 24, 32, 48, 64
  strokeWidth: number; // 1.5, 2, 2.5
  badgeStyle: IconBadgeStyle;
  badgeBgColor?: string;
}

export interface IconCategoryMeta {
  id: IconCategory;
  label: string;
  description: string;
  count?: number;
}

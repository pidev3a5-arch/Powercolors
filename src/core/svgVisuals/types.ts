export type VisualCategory =
  | 'kpi'
  | 'gauge'
  | 'line'
  | 'bar'
  | 'donut'
  | 'waffle';

export type VisualParamType = 'number' | 'color' | 'text' | 'boolean' | 'select';

export interface VisualParam {
  id: string;
  label: string;
  type: VisualParamType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
  description?: string;
  daxVarName: string;
}

export interface PbiTips {
  visualType: string;
  recommendedWidth?: number;
  recommendedHeight?: number;
  notes: string;
}

export interface SvgVisualDefinition {
  id: string;
  name: string;
  category: VisualCategory;
  description: string;
  tags: string[];
  viewBox: string;
  recommendedDimensions: { width: number; height: number };
  params: VisualParam[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSvg: (params: Record<string, any>) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateDax: (params: Record<string, any>, measureName?: string) => string;
  pbiTips?: PbiTips;
}

export interface SvgCategoryInfo {
  id: VisualCategory | 'all';
  label: string;
  description: string;
  iconName: string;
}

export interface SvgToDaxOptions {
  measureName?: string;
  extractColors?: boolean;
}

export interface SvgToDaxResult {
  measureName: string;
  daxCode: string;
  sanitizedSvg: string;
  detectedColors: string[];
  error?: string;
}

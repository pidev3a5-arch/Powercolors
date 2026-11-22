export type DaxCategory =
  | 'time-intelligence'
  | 'rankings-pareto'
  | 'dynamic-titles'
  | 'kpi-logic'
  | 'conditional-formatting'
  | 'metric-switching';

export interface DaxParameter {
  id: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  description: string;
  type: 'measure' | 'column' | 'table' | 'number' | 'text';
}

export interface DaxTemplate {
  id: string;
  name: string;
  category: DaxCategory;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  templateDax: string; // DAX code with {{param_id}} interpolation tokens
  parameters: DaxParameter[];
  outputType: 'Currency / Number' | 'Percentage' | 'Text / String' | 'Color Hex' | 'Integer';
  powerBiTips: {
    recommendedVisual: string;
    formatString?: string;
    performanceNote: string;
    bestPractice: string;
  };
}

export interface DaxCategoryMeta {
  id: DaxCategory;
  label: string;
  description: string;
  iconName: string;
}

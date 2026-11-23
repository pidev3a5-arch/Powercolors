export type DenebCategory = 'kpi' | 'distribution' | 'ranking' | 'part-to-whole' | 'trends';

export interface DenebDataField {
  name: string;
  type: 'Column' | 'Measure';
  dataType: 'nominal' | 'quantitative' | 'temporal' | 'ordinal';
  description: string;
}

export interface DenebSpecTemplate {
  id: string;
  name: string;
  description: string;
  category: DenebCategory;
  badge: string;
  provider: 'vegaLite' | 'vega';
  schemaUrl: string;
  dataRoles: DenebDataField[];
  sampleData: Record<string, any>[];
  spec: Record<string, any>;
  renderPreviewSvg: (palette: string[]) => string;
}

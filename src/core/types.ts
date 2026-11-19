export type RGB = [number, number, number];

export interface ColorSwatch {
  id: string;
  hex: string;
  rgb: RGB;
  luminance: number;
  contrastOnLight: number;
  contrastOnDark: number;
  isLocked?: boolean;
}

export interface StructuralColors {
  background: string;
  foreground: string;
  tableAccent: string;
  good: string;
  bad: string;
  neutral: string;
}

export interface TextClassStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
}

export interface ThemeCustomizationOptions {
  fontFamily: 'Segoe UI' | 'Aptos' | 'DIN' | 'Arial' | 'Calibri';
  showVisualBorders: boolean;
  showVisualDropShadow: boolean;
}

export interface PowerBITheme {
  $schema: string;
  name: string;
  dataColors: string[];
  background: string;
  foreground: string;
  tableAccent: string;
  good: string;
  bad: string;
  neutral: string;
  textClasses: {
    title: TextClassStyle;
    label: TextClassStyle;
    callout: TextClassStyle;
    header: TextClassStyle;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visualStyles: Record<string, any>;
}

export interface ExtractionResult {
  dataColors: ColorSwatch[];
  structural: StructuralColors;
  dominantColor: string;
  durationMs: number;
  pixelCount: number;
}

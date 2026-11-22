export type CvdType = 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia';

export interface CvdMeta {
  type: CvdType;
  label: string;
  populationRate: string;
  description: string;
  affectedColors: string;
}

export type WcagLevel = 'AAA' | 'AA' | 'AA-Large' | 'Fail';

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  normalText: {
    aa: boolean; // >= 4.5:1
    aaa: boolean; // >= 7.0:1
  };
  largeText: {
    aa: boolean; // >= 3.0:1
    aaa: boolean; // >= 4.5:1
  };
  graphicalObject: {
    aa: boolean; // >= 3.0:1 (WCAG 2.1 Non-Text Contrast)
  };
  overallLevel: WcagLevel;
  suggestedFix?: {
    originalHex: string;
    suggestedHex: string;
    newRatio: number;
    targetRatio: number;
    deltaE: number;
  };
}

export interface CvdConflict {
  colorA: string;
  colorB: string;
  indexA: number;
  indexB: number;
  cvdType: CvdType;
  simulatedA: string;
  simulatedB: string;
  deltaE: number;
  severity: 'high' | 'medium'; // high: deltaE < 8, medium: deltaE < 14
}

export interface BackgroundPreset {
  id: string;
  name: string;
  hex: string;
  isDark: boolean;
  category: 'canvas' | 'card' | 'custom';
}

export interface AccessibilityAuditSummary {
  totalColors: number;
  totalBackgrounds: number;
  totalChecks: number;
  passedGraphicalCount: number; // >= 3:1
  passedTextCount: number; // >= 4.5:1
  failedCount: number;
  complianceScore: number; // 0 - 100 percentage
  cvdConflictCount: number;
  worstContrastRatio: number;
  bestContrastRatio: number;
}

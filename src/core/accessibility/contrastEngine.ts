import chroma from 'chroma-js';
import { ContrastResult, WcagLevel, BackgroundPreset, AccessibilityAuditSummary } from './types';

/**
 * Standard WCAG 2.1 Contrast Calculation
 * Returns ratio rounded to 2 decimal places (1.00 to 21.00)
 */
export function getContrastRatio(foreground: string, background: string): number {
  try {
    if (!chroma.valid(foreground) || !chroma.valid(background)) return 1.0;
    const ratio = chroma.contrast(foreground, background);
    return Math.round(ratio * 100) / 100;
  } catch {
    return 1.0;
  }
}

/**
 * Determine overall WCAG compliance level
 */
export function determineWcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3.0) return 'AA-Large'; // Also passes Non-Text Graphical Objects (WCAG 2.1 SC 1.4.11)
  return 'Fail';
}

/**
 * Suggest an accessible color by adjusting lightness in LCH color space,
 * preserving perceived hue and chroma as much as possible.
 */
export function suggestAccessibleColor(
  foreground: string,
  background: string,
  targetRatio = 3.0
): { suggestedHex: string; newRatio: number; deltaE: number } | null {
  try {
    if (!chroma.valid(foreground) || !chroma.valid(background)) return null;

    const currentRatio = chroma.contrast(foreground, background);
    if (currentRatio >= targetRatio) {
      return {
        suggestedHex: chroma(foreground).hex().toUpperCase(),
        newRatio: Math.round(currentRatio * 100) / 100,
        deltaE: 0,
      };
    }

    const bgLuminance = chroma(background).luminance();
    const shouldDarken = bgLuminance >= 0.35; // Light background -> darken foreground, Dark background -> lighten foreground

    const [l, c, h] = chroma(foreground).lch();
    const step = shouldDarken ? -2 : 2;
    let bestHex = foreground;
    let bestRatio = currentRatio;

    // Search lightness iteratively
    for (let currentL = l + step; shouldDarken ? currentL >= 2 : currentL <= 98; currentL += step) {
      try {
        const candidate = chroma.lch(currentL, c, isNaN(h) ? 0 : h);
        const ratio = chroma.contrast(candidate, background);
        if (ratio >= targetRatio) {
          bestHex = candidate.hex().toUpperCase();
          bestRatio = Math.round(ratio * 100) / 100;
          break;
        }
      } catch {
        continue;
      }
    }

    // If still hasn't reached target ratio (e.g. saturated yellow on white), try pure lightness clamping
    if (bestRatio < targetRatio) {
      const fallbackTarget = shouldDarken ? '#0F172A' : '#FFFFFF';
      bestHex = chroma.mix(foreground, fallbackTarget, 0.45).hex().toUpperCase();
      bestRatio = Math.round(chroma.contrast(bestHex, background) * 100) / 100;
    }

    const deltaE = Math.round(chroma.deltaE(foreground, bestHex) * 10) / 10;
    return {
      suggestedHex: bestHex,
      newRatio: bestRatio,
      deltaE,
    };
  } catch {
    return null;
  }
}

/**
 * Comprehensive evaluation of a color pair against WCAG 2.1 standards
 */
export function evaluateContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const normalText = {
    aa: ratio >= 4.5,
    aaa: ratio >= 7.0,
  };
  const largeText = {
    aa: ratio >= 3.0,
    aaa: ratio >= 4.5,
  };
  const graphicalObject = {
    aa: ratio >= 3.0, // Non-text contrast for charts and UI components
  };

  const overallLevel = determineWcagLevel(ratio);

  let suggestedFix: ContrastResult['suggestedFix'] = undefined;
  if (ratio < 3.0) {
    const fix = suggestAccessibleColor(foreground, background, 3.0);
    if (fix) {
      suggestedFix = {
        originalHex: foreground,
        suggestedHex: fix.suggestedHex,
        newRatio: fix.newRatio,
        targetRatio: 3.0,
        deltaE: fix.deltaE,
      };
    }
  }

  return {
    foreground,
    background,
    ratio,
    normalText,
    largeText,
    graphicalObject,
    overallLevel,
    suggestedFix,
  };
}

/**
 * Audit summary across all palette colors and backgrounds
 */
export function generateAuditSummary(
  palette: string[],
  backgrounds: BackgroundPreset[],
  cvdConflictCount = 0
): AccessibilityAuditSummary {
  let passedGraphicalCount = 0;
  let passedTextCount = 0;
  let failedCount = 0;
  let worstRatio = 21.0;
  let bestRatio = 1.0;

  let totalChecks = 0;

  for (const color of palette) {
    for (const bg of backgrounds) {
      totalChecks++;
      const ratio = getContrastRatio(color, bg.hex);

      if (ratio < worstRatio) worstRatio = ratio;
      if (ratio > bestRatio) bestRatio = ratio;

      if (ratio >= 4.5) {
        passedTextCount++;
        passedGraphicalCount++;
      } else if (ratio >= 3.0) {
        passedGraphicalCount++;
      } else {
        failedCount++;
      }
    }
  }

  // Score weighting: 70% graphical pass rate + 30% text pass rate - penalty for CVD conflicts
  const graphicalPassRate = totalChecks > 0 ? (passedGraphicalCount / totalChecks) * 100 : 0;
  const textPassRate = totalChecks > 0 ? (passedTextCount / totalChecks) * 100 : 0;
  const cvdPenalty = Math.min(cvdConflictCount * 4, 20);

  const rawScore = graphicalPassRate * 0.7 + textPassRate * 0.3 - cvdPenalty;
  const complianceScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    totalColors: palette.length,
    totalBackgrounds: backgrounds.length,
    totalChecks,
    passedGraphicalCount,
    passedTextCount,
    failedCount,
    complianceScore,
    cvdConflictCount,
    worstContrastRatio: totalChecks > 0 ? worstRatio : 1.0,
    bestContrastRatio: totalChecks > 0 ? bestRatio : 1.0,
  };
}

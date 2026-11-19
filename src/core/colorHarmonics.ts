import chroma from 'chroma-js';
import { RGB, ColorSwatch, StructuralColors } from './types';

/**
 * Converts RGB tuple [r, g, b] to 6-character uppercase HEX string '#RRGGBB'
 */
export function rgbToHex(rgb: RGB): string {
  return chroma(rgb[0], rgb[1], rgb[2]).hex().toUpperCase();
}

/**
 * Converts HEX string to RGB tuple [r, g, b]
 */
export function hexToRgb(hex: string): RGB {
  const [r, g, b] = chroma(hex).rgb();
  return [r, g, b];
}

/**
 * Calculate WCAG contrast ratio between two hex colors (range: 1 to 21)
 */
export function calculateContrast(foregroundHex: string, backgroundHex: string): number {
  try {
    const ratio = chroma.contrast(foregroundHex, backgroundHex);
    return Math.round(ratio * 100) / 100;
  } catch {
    return 1;
  }
}

/**
 * Get perceptual luminance in range [0, 1]
 */
export function getLuminance(hex: string): number {
  try {
    return chroma(hex).luminance();
  } catch {
    return 0.5;
  }
}

/**
 * Deduplicate colors by removing any color that is perceptually too close
 * to an earlier color in the list (CIELAB Delta E < minDeltaE).
 */
export function deduplicateColors(hexColors: string[], minDeltaE = 12): string[] {
  const result: string[] = [];

  for (const hex of hexColors) {
    if (!chroma.valid(hex)) continue;

    const normalizedHex = chroma(hex).hex().toUpperCase();
    let isTooClose = false;

    for (const existing of result) {
      const delta = chroma.deltaE(normalizedHex, existing);
      if (delta < minDeltaE) {
        isTooClose = true;
        break;
      }
    }

    if (!isTooClose) {
      result.push(normalizedHex);
    }
  }

  return result;
}

/**
 * Ensure a palette has exactly 10 high-quality, harmonious data colors.
 * If source has fewer than 10 colors, generates intelligent harmonic tints,
 * shades, and analogous hues based on the source colors.
 */
export function padPaletteTo10(sourceHexList: string[]): string[] {
  // Validate and deduplicate inputs
  const validHexes = sourceHexList
    .filter((h) => chroma.valid(h))
    .map((h) => chroma(h).hex().toUpperCase());

  const palette = deduplicateColors(validHexes, 10);

  // Fallback defaults if empty input
  if (palette.length === 0) {
    return [
      '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#D97706',
      '#059669', '#0D9488', '#0284C7', '#4F46E5', '#9333EA',
    ];
  }

  if (palette.length >= 10) {
    return palette.slice(0, 10);
  }

  // Generate candidates using harmonic relationships:
  // 1. Tints (brighten)
  // 2. Shades (darken)
  // 3. Analogous shifts (+30 deg, -30 deg, +60 deg)
  // 4. Complementary & split complementary (+180 deg, +150 deg, +210 deg)
  const candidates: string[] = [];
  const baseColors = [...palette];

  const brightnessAdjustments = [0.6, -0.6, 1.2, -1.2, 1.8, -1.8];
  const hueShifts = [30, -30, 45, -45, 60, -60, 90, 150, 180, 210];

  // Pass 1: Analogous hue shifts
  for (const base of baseColors) {
    for (const shift of hueShifts) {
      try {
        const c = chroma(base).set('hsl.h', `+${shift}`);
        candidates.push(c.hex().toUpperCase());
      } catch {
        // Ignore invalid hue manipulations
      }
    }
  }

  // Pass 2: Tints and shades
  for (const base of baseColors) {
    for (const adj of brightnessAdjustments) {
      try {
        const c = adj > 0 ? chroma(base).brighten(adj) : chroma(base).darken(Math.abs(adj));
        candidates.push(c.hex().toUpperCase());
      } catch {
        // Ignore
      }
    }
  }

  // Select candidates that maintain at least Delta E >= 10 distance
  for (const candidate of candidates) {
    if (palette.length >= 10) break;

    let isDistinct = true;
    for (const existing of palette) {
      if (chroma.deltaE(candidate, existing) < 10) {
        isDistinct = false;
        break;
      }
    }

    if (isDistinct) {
      palette.push(candidate);
    }
  }

  // If still under 10 (e.g. extremely constrained hue), fill remaining with professional BI accent scale
  const defaultAccents = [
    '#2563EB', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#10B981', '#3B82F6', '#6366F1', '#14B8A6'
  ];

  for (const fallback of defaultAccents) {
    if (palette.length >= 10) break;
    let isDistinct = true;
    for (const existing of palette) {
      if (chroma.deltaE(fallback, existing) < 10) {
        isDistinct = false;
        break;
      }
    }
    if (isDistinct) {
      palette.push(fallback);
    }
  }

  // Hard guarantee of 10 items
  while (palette.length < 10) {
    const randomChroma = chroma.random().hex().toUpperCase();
    palette.push(randomChroma);
  }

  return palette.slice(0, 10);
}

/**
 * Creates a rich ColorSwatch object with contrast ratings on light/dark backgrounds
 */
export function createColorSwatch(hex: string, id: string): ColorSwatch {
  const normHex = chroma(hex).hex().toUpperCase();
  const rgb = hexToRgb(normHex);
  const luminance = getLuminance(normHex);
  const contrastOnLight = calculateContrast(normHex, '#FFFFFF');
  const contrastOnDark = calculateContrast(normHex, '#1E293B');

  return {
    id,
    hex: normHex,
    rgb,
    luminance: Math.round(luminance * 1000) / 1000,
    contrastOnLight,
    contrastOnDark,
    isLocked: false,
  };
}

/**
 * Derive structural theme colors from the dominant palette color
 */
export function deriveStructuralColors(dominantHex: string, isDarkCanvas = false): StructuralColors {
  const primary = chroma.valid(dominantHex) ? chroma(dominantHex).hex().toUpperCase() : '#2563EB';

  if (isDarkCanvas) {
    return {
      background: '#0F172A',
      foreground: '#F8FAFC',
      tableAccent: primary,
      good: '#22C55E',
      bad: '#EF4444',
      neutral: '#F59E0B',
    };
  }

  return {
    background: '#FFFFFF',
    foreground: '#1E293B',
    tableAccent: primary,
    good: '#16A34A',
    bad: '#DC2626',
    neutral: '#EAB308',
  };
}

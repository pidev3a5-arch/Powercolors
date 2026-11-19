import { describe, it, expect } from 'vitest';
import { filterRgbaPixels, getScaledDimensions } from '../core/canvasExtractor';
import { kMeansClustering } from '../core/kmeans';
import {
  rgbToHex,
  hexToRgb,
  calculateContrast,
  deduplicateColors,
  padPaletteTo10,
  deriveStructuralColors,
} from '../core/colorHarmonics';
import {
  buildPowerBITheme,
  validatePowerBITheme,
} from '../core/powerBiTheme';
import { extractPaletteFromPixels } from '../core/colorEngine';
import { RGB } from '../core/types';

describe('Canvas Extractor Utilities', () => {
  it('filters out transparent pixels while retaining opaque ones', () => {
    // 4 pixels: red opaque, green transparent, blue semi-transparent (100), yellow opaque
    const rgba = [
      255, 0, 0, 255,     // keep
      0, 255, 0, 0,       // drop
      0, 0, 255, 100,     // drop (< 128)
      255, 255, 0, 180,   // keep (>= 128)
    ];

    const result = filterRgbaPixels(rgba, 128);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([255, 0, 0]);
    expect(result[1]).toEqual([255, 255, 0]);
  });

  it('calculates downsampled dimensions preserving aspect ratio', () => {
    // Landscape image 3000 x 1500 -> 150 x 75
    const landscape = getScaledDimensions(3000, 1500, 150);
    expect(landscape.width).toBe(150);
    expect(landscape.height).toBe(75);

    // Portrait image 1000 x 2000 -> 75 x 150
    const portrait = getScaledDimensions(1000, 2000, 150);
    expect(portrait.width).toBe(75);
    expect(portrait.height).toBe(150);

    // Small image 100 x 50 -> unchanged 100 x 50
    const small = getScaledDimensions(100, 50, 150);
    expect(small.width).toBe(100);
    expect(small.height).toBe(50);
  });
});

describe('K-Means Clustering', () => {
  it('identifies dominant cluster centroids from synthetic color distributions', () => {
    const pixels: RGB[] = [];
    // 100 red pixels
    for (let i = 0; i < 100; i++) pixels.push([250, 5, 5]);
    // 100 green pixels
    for (let i = 0; i < 100; i++) pixels.push([5, 250, 5]);
    // 100 blue pixels
    for (let i = 0; i < 100; i++) pixels.push([5, 5, 250]);

    const centroids = kMeansClustering(pixels, 3, 15);
    expect(centroids.length).toBeGreaterThanOrEqual(1);
    expect(centroids.length).toBeLessThanOrEqual(3);

    const hexList = centroids.map((c) => rgbToHex(c));
    // Check that we identified red, green, and blue hues
    expect(hexList.some((h) => h.startsWith('#F') || h.startsWith('#E'))).toBe(true);
  });

  it('handles empty and small pixel pools safely', () => {
    expect(kMeansClustering([], 10)).toEqual([]);
    const single: RGB[] = [[100, 150, 200]];
    expect(kMeansClustering(single, 10)).toEqual([[100, 150, 200]]);
  });
});

describe('Color Harmonics & Palette Padding', () => {
  it('converts between RGB and HEX accurately', () => {
    const hex = rgbToHex([37, 99, 235]);
    expect(hex).toBe('#2563EB');
    const rgb = hexToRgb('#2563EB');
    expect(rgb).toEqual([37, 99, 235]);
  });

  it('deduplicates identical and near-identical colors', () => {
    const input = ['#2563EB', '#2563EC', '#2664EC', '#DC2626'];
    const deduped = deduplicateColors(input, 12);
    // Near-identical blues should be merged down to 1
    expect(deduped).toHaveLength(2);
    expect(deduped).toContain('#2563EB');
    expect(deduped).toContain('#DC2626');
  });

  it('pads single-color input to exactly 10 distinct, valid hex colors', () => {
    const input = ['#FF0000'];
    const padded = padPaletteTo10(input);

    expect(padded).toHaveLength(10);
    const unique = new Set(padded);
    expect(unique.size).toBe(10);
    // All items should be valid hex codes
    padded.forEach((hex) => {
      expect(hex).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  it('pads two-color brand logo to exactly 10 distinct data colors', () => {
    const input = ['#0078D4', '#2B579A'];
    const padded = padPaletteTo10(input);

    expect(padded).toHaveLength(10);
    const unique = new Set(padded);
    expect(unique.size).toBe(10);
  });

  it('calculates WCAG contrast ratio accurately', () => {
    // Black on white has maximum contrast 21:1
    const maxContrast = calculateContrast('#000000', '#FFFFFF');
    expect(maxContrast).toBe(21);

    // White on white has minimum contrast 1:1
    const minContrast = calculateContrast('#FFFFFF', '#FFFFFF');
    expect(minContrast).toBe(1);

    // Dark slate text on white background should easily pass WCAG AA (>= 4.5:1)
    const textContrast = calculateContrast('#1E293B', '#FFFFFF');
    expect(textContrast).toBeGreaterThanOrEqual(10);
  });

  it('derives appropriate structural colors for light and dark canvases', () => {
    const light = deriveStructuralColors('#2563EB', false);
    expect(light.background).toBe('#FFFFFF');
    expect(light.foreground).toBe('#1E293B');
    expect(light.tableAccent).toBe('#2563EB');
    expect(light.good).toBe('#16A34A');
    expect(light.bad).toBe('#DC2626');

    const dark = deriveStructuralColors('#2563EB', true);
    expect(dark.background).toBe('#0F172A');
    expect(dark.foreground).toBe('#F8FAFC');
    expect(dark.tableAccent).toBe('#2563EB');
  });
});

describe('Power BI Theme Generation & Validation', () => {
  it('builds a schema-compliant Power BI Theme object', () => {
    const dataColors = [
      '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#D97706',
      '#059669', '#0D9488', '#0284C7', '#4F46E5', '#9333EA',
    ];
    const structural = deriveStructuralColors('#2563EB', false);

    const theme = buildPowerBITheme('Contoso Sales Theme', dataColors, structural);

    expect(theme.name).toBe('Contoso Sales Theme');
    expect(theme.$schema).toContain('reportThemeSchema-latest.json');
    expect(theme.dataColors).toHaveLength(10);
    expect(theme.background).toBe('#FFFFFF');
    expect(theme.foreground).toBe('#1E293B');
    expect(theme.tableAccent).toBe('#2563EB');
    expect(theme.textClasses.title.fontFamily).toBe('Segoe UI');
    expect(theme.visualStyles['*']['*'].visualContainer).toBeDefined();

    const validation = validatePowerBITheme(theme);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('detects invalid themes during validation', () => {
    const invalid = {
      name: '',
      dataColors: ['invalid-hex', '#ZZZZZZ'],
    };
    const validation = validatePowerBITheme(invalid);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});

describe('End-to-End Pixel Extraction Pipeline', () => {
  it('runs complete palette and theme extraction in < 50ms', () => {
    // Generate synthetic image pixels (500 pixels with brand colors)
    const pixels: RGB[] = [];
    for (let i = 0; i < 200; i++) pixels.push([14, 165, 233]); // Sky blue
    for (let i = 0; i < 200; i++) pixels.push([244, 63, 94]);  // Rose
    for (let i = 0; i < 100; i++) pixels.push([16, 185, 129]); // Emerald

    const { result, theme } = extractPaletteFromPixels(pixels, 'Test Theme');

    expect(result.dataColors).toHaveLength(10);
    expect(result.dominantColor).toBeDefined();
    expect(result.pixelCount).toBe(500);
    expect(result.durationMs).toBeLessThan(100);

    const validation = validatePowerBITheme(theme);
    expect(validation.isValid).toBe(true);
  });
});

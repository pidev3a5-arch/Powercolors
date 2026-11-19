import { RGB, ExtractionResult, PowerBITheme, ColorSwatch } from './types';
import { kMeansClustering } from './kmeans';
import {
  rgbToHex,
  padPaletteTo10,
  createColorSwatch,
  deriveStructuralColors,
} from './colorHarmonics';
import {
  loadHtmlImage,
  extractPixelsFromImage,
} from './canvasExtractor';
import { buildPowerBITheme } from './powerBiTheme';

/**
 * Core extraction pipeline from raw RGB pixels.
 * Useful for automated testing and headless environments.
 */
export function extractPaletteFromPixels(
  pixels: RGB[],
  themeName = 'PowerColors Custom Theme',
  isDarkCanvas = false
): { result: ExtractionResult; theme: PowerBITheme } {
  const startTime = performance.now();

  // 1. Run K-Means clustering to find up to 10 centroids
  const rawCentroids = kMeansClustering(pixels, 10, 20);

  // 2. Convert centroids to hex
  const rawHexColors = rawCentroids.map((c) => rgbToHex(c));

  // 3. Ensure exactly 10 distinct, harmonic colors
  const dataColorHexes = padPaletteTo10(rawHexColors);

  // 4. Wrap into rich ColorSwatch items
  const dataColors: ColorSwatch[] = dataColorHexes.map((hex, idx) =>
    createColorSwatch(hex, `swatch-${idx + 1}`)
  );

  // 5. Identify dominant primary color (first swatch)
  const dominantColor = dataColors[0]?.hex || '#2563EB';

  // 6. Derive structural theme colors
  const structural = deriveStructuralColors(dominantColor, isDarkCanvas);

  // 7. Build Power BI Theme JSON object
  const theme = buildPowerBITheme(themeName, dataColorHexes, structural);

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  const result: ExtractionResult = {
    dataColors,
    structural,
    dominantColor,
    durationMs,
    pixelCount: pixels.length,
  };

  return { result, theme };
}

/**
 * End-to-end extraction from a File, Blob, or image URL
 */
export async function extractThemeFromImage(
  source: File | Blob | string,
  themeName = 'PowerColors Custom Theme',
  isDarkCanvas = false
): Promise<{ result: ExtractionResult; theme: PowerBITheme }> {
  const { img, cleanup } = await loadHtmlImage(source);
  try {
    const pixels = extractPixelsFromImage(img, 150);
    return extractPaletteFromPixels(pixels, themeName, isDarkCanvas);
  } finally {
    cleanup();
  }
}

import { RGB } from './types';

/**
 * Filter raw RGBA flat byte buffer into RGB tuples,
 * discarding transparent/semi-transparent pixels.
 */
export function filterRgbaPixels(
  data: Uint8ClampedArray | number[],
  minAlpha = 128
): RGB[] {
  const pixels: RGB[] = [];
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const alpha = data[i + 3];
    if (alpha >= minAlpha) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  return pixels;
}

/**
 * Computes downsampled dimensions preserving aspect ratio
 */
export function getScaledDimensions(
  width: number,
  height: number,
  maxDimension = 150
): { width: number; height: number } {
  if (width <= 0 || height <= 0) {
    return { width: 1, height: 1 };
  }

  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  if (width > height) {
    const ratio = height / width;
    return {
      width: maxDimension,
      height: Math.max(1, Math.round(maxDimension * ratio)),
    };
  } else {
    const ratio = width / height;
    return {
      width: Math.max(1, Math.round(maxDimension * ratio)),
      height: maxDimension,
    };
  }
}

/**
 * Loads an HTMLImageElement from a File, Blob, or URL string in the browser
 */
export function loadHtmlImage(source: File | Blob | string): Promise<{ img: HTMLImageElement; cleanup: () => void }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl: string | null = null;

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    };

    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      resolve({ img, cleanup });
    };

    img.onerror = (err) => {
      cleanup();
      reject(new Error(`Failed to load image: ${err}`));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    }
  });
}

/**
 * Extracts downsampled RGB pixels from an HTMLImageElement using an offscreen Canvas
 */
export function extractPixelsFromImage(
  img: HTMLImageElement,
  maxDimension = 150
): RGB[] {
  const { width, height } = getScaledDimensions(img.naturalWidth || img.width, img.naturalHeight || img.height, maxDimension);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not obtain 2D rendering context from canvas');
  }

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  return filterRgbaPixels(imageData.data);
}

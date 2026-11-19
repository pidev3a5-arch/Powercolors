import { RGB } from './types';

/**
 * Euclidean distance in RGB space
 */
export function rgbDistance(c1: RGB, c2: RGB): number {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Fast K-Means clustering algorithm for RGB pixel arrays.
 * Extracts `k` dominant cluster centroids.
 */
export function kMeansClustering(pixels: RGB[], k = 10, maxIterations = 20): RGB[] {
  if (pixels.length === 0) {
    return [];
  }

  // If fewer unique pixels than k, return all unique pixels
  const uniquePixelMap = new Map<string, RGB>();
  for (const p of pixels) {
    const key = `${p[0]},${p[1]},${p[2]}`;
    if (!uniquePixelMap.has(key)) {
      uniquePixelMap.set(key, p);
    }
  }

  const uniquePixels = Array.from(uniquePixelMap.values());
  if (uniquePixels.length <= k) {
    return uniquePixels;
  }

  // 1. Initialize centroids with k-means++ style spread
  const centroids: RGB[] = [];
  // First centroid chosen randomly
  const firstIdx = Math.floor(Math.random() * uniquePixels.length);
  centroids.push([...uniquePixels[firstIdx]]);

  while (centroids.length < k) {
    // Find point with maximum minimum distance to existing centroids
    let maxDist = -1;
    let bestCandidate: RGB = uniquePixels[0];

    // Subsample candidate pool for speed if uniquePixels is large
    const sampleSize = Math.min(uniquePixels.length, 200);
    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor(Math.random() * uniquePixels.length);
      const candidate = uniquePixels[idx];
      let minDist = Infinity;

      for (const c of centroids) {
        const d = rgbDistance(candidate, c);
        if (d < minDist) {
          minDist = d;
        }
      }

      if (minDist > maxDist) {
        maxDist = minDist;
        bestCandidate = candidate;
      }
    }

    centroids.push([...bestCandidate]);
  }

  // 2. Iterative optimization
  const assignments = new Int32Array(pixels.length);
  let iteration = 0;
  let changed = true;

  while (changed && iteration < maxIterations) {
    iteration++;
    changed = false;

    // Step A: Assign pixels to nearest centroid
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i];
      let bestDist = Infinity;
      let bestCluster = 0;

      for (let j = 0; j < k; j++) {
        const dist = rgbDistance(p, centroids[j]);
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = j;
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    // Step B: Recalculate centroids
    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Uint32Array(k);

    for (let i = 0; i < pixels.length; i++) {
      const cluster = assignments[i];
      const p = pixels[i];
      sums[cluster][0] += p[0];
      sums[cluster][1] += p[1];
      sums[cluster][2] += p[2];
      counts[cluster]++;
    }

    for (let j = 0; j < k; j++) {
      if (counts[j] > 0) {
        centroids[j] = [
          Math.round(sums[j][0] / counts[j]),
          Math.round(sums[j][1] / counts[j]),
          Math.round(sums[j][2] / counts[j]),
        ];
      } else {
        // Empty cluster: re-seed with a random pixel
        const randomPixel = uniquePixels[Math.floor(Math.random() * uniquePixels.length)];
        centroids[j] = [...randomPixel];
      }
    }
  }

  return centroids;
}

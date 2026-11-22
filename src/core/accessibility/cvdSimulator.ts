import chroma from 'chroma-js';
import { CvdType, CvdMeta, CvdConflict } from './types';

export const CVD_CATALOG: CvdMeta[] = [
  {
    type: 'normal',
    label: 'Standard Vision',
    populationRate: '92% of world population',
    description: 'Standard trichromatic vision with all three cone photoreceptors functioning normally.',
    affectedColors: 'None (full dynamic color spectrum).',
  },
  {
    type: 'deuteranopia',
    label: 'Deuteranopia (Green-Blind)',
    populationRate: '~6% of males, 0.4% of females',
    description: 'Missing or anomalous M-cones (green). The most widespread form of color vision deficiency.',
    affectedColors: 'Red, green, yellow, brown, and orange blend into muted olive and khaki tones.',
  },
  {
    type: 'protanopia',
    label: 'Protanopia (Red-Blind)',
    populationRate: '~1% of males, 0.02% of females',
    description: 'Missing or anomalous L-cones (red). Red wavelengths appear significantly darker or black.',
    affectedColors: 'Reds, oranges, and yellows appear muted; deep reds appear very dark or brownish.',
  },
  {
    type: 'tritanopia',
    label: 'Tritanopia (Blue-Yellow Blind)',
    populationRate: '~0.01% of all individuals',
    description: 'Rare deficiency involving S-cones (blue). Affects males and females equally.',
    affectedColors: 'Blues and greens confuse; yellows appear pink, violet, or light grey.',
  },
  {
    type: 'achromatopsia',
    label: 'Achromatopsia (Total Monochromacy)',
    populationRate: '~0.003% of population',
    description: 'Complete lack of cone function; vision is restricted entirely to rods and luminance.',
    affectedColors: 'All hues disappear; only light and dark grayscale tones are perceived.',
  },
];

// Linear RGB to LMS and Simulation Matrices (Machado et al. 2009 / Vienot et al.)
// We apply matrix transformations to gamma-expanded linear RGB channels.
function sRGBtoLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSRGB(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, Math.round(v * 255)));
}

type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

// Standard Vienot et al. / Brettel linear RGB projection matrices for CVD simulation
const CVD_MATRICES: Record<Exclude<CvdType, 'normal' | 'achromatopsia'>, Matrix3x3> = {
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

/**
 * Simulate Color Vision Deficiency for a single hex color
 */
export function simulateCvd(hex: string, type: CvdType): string {
  try {
    if (!chroma.valid(hex)) return hex;
    if (type === 'normal') return chroma(hex).hex().toUpperCase();

    // Achromatopsia: perceptual luminance grayscale
    if (type === 'achromatopsia') {
      const lum = chroma(hex).luminance();
      const gray = Math.round(Math.pow(lum, 1 / 2.2) * 255);
      return chroma(gray, gray, gray).hex().toUpperCase();
    }

    const [r, g, b] = chroma(hex).rgb();
    const lr = sRGBtoLinear(r);
    const lg = sRGBtoLinear(g);
    const lb = sRGBtoLinear(b);

    const matrix = CVD_MATRICES[type];
    const simLr = matrix[0][0] * lr + matrix[0][1] * lg + matrix[0][2] * lb;
    const simLg = matrix[1][0] * lr + matrix[1][1] * lg + matrix[1][2] * lb;
    const simLb = matrix[2][0] * lr + matrix[2][1] * lg + matrix[2][2] * lb;

    const simR = linearToSRGB(simLr);
    const simG = linearToSRGB(simLg);
    const simB = linearToSRGB(simLb);

    return chroma(simR, simG, simB).hex().toUpperCase();
  } catch {
    return hex;
  }
}

/**
 * Detect pairwise color conflicts where two distinct colors look almost identical
 * to users with color vision deficiency (CIELAB Delta E < threshold).
 */
export function detectCvdConflicts(palette: string[], minDeltaE = 11): CvdConflict[] {
  const conflicts: CvdConflict[] = [];
  const testTypes: CvdType[] = ['deuteranopia', 'protanopia', 'tritanopia'];

  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const colorA = palette[i];
      const colorB = palette[j];

      // Original Delta E (how different they look to normal eyes)
      const origDeltaE = chroma.deltaE(colorA, colorB);
      if (origDeltaE < 12) continue; // Already nearly identical in normal vision, skip

      for (const cvdType of testTypes) {
        const simA = simulateCvd(colorA, cvdType);
        const simB = simulateCvd(colorB, cvdType);

        const simDeltaE = chroma.deltaE(simA, simB);
        if (simDeltaE < minDeltaE) {
          conflicts.push({
            colorA,
            colorB,
            indexA: i,
            indexB: j,
            cvdType,
            simulatedA: simA,
            simulatedB: simB,
            deltaE: Math.round(simDeltaE * 10) / 10,
            severity: simDeltaE < 6 ? 'high' : 'medium',
          });
        }
      }
    }
  }

  return conflicts;
}

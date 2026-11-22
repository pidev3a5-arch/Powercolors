export type HarmonyMode =
  | 'analogous'
  | 'monochromatic'
  | 'triadic'
  | 'tetradic'
  | 'complementary'
  | 'split-complementary'
  | 'golden-ratio';

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface HarmonyColor {
  hex: string;
  name: string;
  hsl: HSL;
  role: 'Base' | 'Accent 1' | 'Accent 2' | 'Secondary' | 'Support' | 'Highlight';
  contrastOnWhite: number;
  contrastOnDark: number;
  shades: {
    level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    hex: string;
  }[];
}

export interface HarmonyPalette {
  baseHex: string;
  mode: HarmonyMode;
  name: string;
  colors: HarmonyColor[];
}

export interface HarmonyPresetSeed {
  name: string;
  hex: string;
  mode: HarmonyMode;
  vibe: string;
}

import { HarmonyMode, HarmonyPalette, HarmonyColor, HSL, HarmonyPresetSeed } from './types';
import { PowerBITheme } from '../types';
import { POWER_BI_THEME_SCHEMA_URL } from '../powerBiTheme';

export const HARMONY_PRESET_SEEDS: HarmonyPresetSeed[] = [
  { name: 'Royal Cobalt', hex: '#2563EB', mode: 'triadic', vibe: 'Executive Corporate & Tech' },
  { name: 'Electric Violet', hex: '#8B5CF6', mode: 'split-complementary', vibe: 'Modern Creative & SaaS' },
  { name: 'Emerald Mint', hex: '#059669', mode: 'analogous', vibe: 'Sustainability & Healthcare' },
  { name: 'Sunset Coral', hex: '#F43F5E', mode: 'complementary', vibe: 'High Impact Sales & Retail' },
  { name: 'Nordic Arctic Teal', hex: '#0EA5E9', mode: 'tetradic', vibe: 'Clean Logistics & IoT' },
  { name: 'Amber Gold', hex: '#D97706', mode: 'golden-ratio', vibe: 'Wealth & Asset Management' },
  { name: 'Obsidian Slate', hex: '#475569', mode: 'monochromatic', vibe: 'Minimalist Engineering' },
];

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h = h / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  if (sNorm === 0) {
    const gray = Math.round(lNorm * 255);
    return [gray, gray, gray];
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255);

  return [r, g, b];
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrast(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// 9-Step Shade & Tint Ladder (50 to 900)
export function generateShades(h: number, s: number, baseL: number): HarmonyColor['shades'] {
  const shadeSteps: Array<{ level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; targetL: number }> = [
    { level: 50, targetL: 95 },
    { level: 100, targetL: 90 },
    { level: 200, targetL: 80 },
    { level: 300, targetL: 70 },
    { level: 400, targetL: 60 },
    { level: 500, targetL: baseL },
    { level: 600, targetL: Math.max(10, baseL - 10) },
    { level: 700, targetL: Math.max(10, baseL - 20) },
    { level: 800, targetL: Math.max(8, baseL - 30) },
    { level: 900, targetL: Math.max(5, baseL - 40) },
  ];

  return shadeSteps.map(({ level, targetL }) => ({
    level,
    hex: hslToHex(h, s, targetL),
  }));
}

export function generateHarmonyPalette(baseHex: string, mode: HarmonyMode): HarmonyPalette {
  const [r, g, b] = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  interface RawColorSpec {
    h: number;
    s: number;
    l: number;
    role: HarmonyColor['role'];
    name: string;
  }

  const specs: RawColorSpec[] = [];

  switch (mode) {
    case 'analogous':
      specs.push(
        { h, s, l, role: 'Base', name: 'Dominant Base' },
        { h: (h + 30) % 360, s, l, role: 'Accent 1', name: 'Analogous +30°' },
        { h: (h + 60) % 360, s: Math.max(20, s - 5), l, role: 'Secondary', name: 'Analogous +60°' },
        { h: (h - 30 + 360) % 360, s, l, role: 'Accent 2', name: 'Analogous -30°' },
        { h: (h - 60 + 360) % 360, s: Math.max(20, s - 10), l, role: 'Support', name: 'Analogous -60°' }
      );
      break;

    case 'monochromatic':
      specs.push(
        { h, s, l, role: 'Base', name: 'Base Tone' },
        { h, s: Math.min(100, s + 15), l: Math.min(85, l + 20), role: 'Highlight', name: 'Light Tint' },
        { h, s: Math.max(15, s - 10), l: Math.min(75, l + 10), role: 'Secondary', name: 'Soft Accent' },
        { h, s: Math.min(100, s + 5), l: Math.max(20, l - 15), role: 'Accent 1', name: 'Deep Shade' },
        { h, s: Math.max(10, s - 25), l: Math.max(12, l - 25), role: 'Support', name: 'Dark Anchor' }
      );
      break;

    case 'triadic':
      specs.push(
        { h, s, l, role: 'Base', name: 'Primary Base' },
        { h: (h + 120) % 360, s, l, role: 'Accent 1', name: 'Triad Right (+120°)' },
        { h: (h + 240) % 360, s, l, role: 'Accent 2', name: 'Triad Left (+240°)' },
        { h: (h + 120) % 360, s: Math.max(20, s - 20), l: Math.min(80, l + 15), role: 'Secondary', name: 'Triad Soft Tint' },
        { h: (h + 240) % 360, s: Math.max(20, s - 10), l: Math.max(20, l - 15), role: 'Support', name: 'Triad Anchor' }
      );
      break;

    case 'tetradic':
      specs.push(
        { h, s, l, role: 'Base', name: 'Primary Base' },
        { h: (h + 90) % 360, s, l, role: 'Accent 1', name: 'Square 90°' },
        { h: (h + 180) % 360, s, l, role: 'Secondary', name: 'Opposite 180°' },
        { h: (h + 270) % 360, s, l, role: 'Accent 2', name: 'Square 270°' },
        { h: (h + 45) % 360, s: Math.max(20, s - 15), l: Math.min(82, l + 12), role: 'Highlight', name: 'Harmonic Bridge' }
      );
      break;

    case 'complementary':
      specs.push(
        { h, s, l, role: 'Base', name: 'Base Primary' },
        { h: (h + 180) % 360, s, l, role: 'Accent 1', name: 'Direct Complement (+180°)' },
        { h, s: Math.max(15, s - 20), l: Math.min(85, l + 18), role: 'Secondary', name: 'Base Soft Tint' },
        { h: (h + 180) % 360, s: Math.max(20, s - 15), l: Math.min(82, l + 12), role: 'Highlight', name: 'Complement Tint' },
        { h: (h + 180) % 360, s: Math.min(100, s + 10), l: Math.max(18, l - 18), role: 'Support', name: 'Complement Shade' }
      );
      break;

    case 'split-complementary':
      specs.push(
        { h, s, l, role: 'Base', name: 'Primary Base' },
        { h: (h + 150) % 360, s, l, role: 'Accent 1', name: 'Split Right (+150°)' },
        { h: (h + 210) % 360, s, l, role: 'Accent 2', name: 'Split Left (+210°)' },
        { h: (h + 150) % 360, s: Math.max(20, s - 15), l: Math.min(82, l + 15), role: 'Secondary', name: 'Split Warm Tint' },
        { h: (h + 210) % 360, s: Math.max(20, s - 15), l: Math.max(20, l - 15), role: 'Support', name: 'Split Deep Shade' }
      );
      break;

    case 'golden-ratio':
    default:
      specs.push(
        { h, s, l, role: 'Base', name: 'Golden Seed' },
        { h: (h + 137.5) % 360, s, l, role: 'Accent 1', name: 'Phi Spiral 1 (+137.5°)' },
        { h: (h + 275) % 360, s, l, role: 'Accent 2', name: 'Phi Spiral 2 (+275°)' },
        { h: (h + 52.5) % 360, s: Math.max(20, s - 10), l: Math.min(80, l + 15), role: 'Secondary', name: 'Golden Resonator' },
        { h: (h + 190) % 360, s: Math.max(20, s - 20), l: Math.max(22, l - 15), role: 'Support', name: 'Golden Anchor' }
      );
      break;
  }

  const colors: HarmonyColor[] = specs.map((spec) => {
    const hex = hslToHex(spec.h, spec.s, spec.l);
    return {
      hex,
      name: spec.name,
      role: spec.role,
      hsl: { h: Math.round(spec.h), s: Math.round(spec.s), l: Math.round(spec.l) },
      contrastOnWhite: getContrast(hex, '#FFFFFF'),
      contrastOnDark: getContrast(hex, '#1E293B'),
      shades: generateShades(spec.h, spec.s, spec.l),
    };
  });

  const modeTitles: Record<HarmonyMode, string> = {
    analogous: 'Analogous Flow',
    monochromatic: 'Monochromatic Precision',
    triadic: 'Triadic Dynamic',
    tetradic: 'Tetradic Spectrum',
    complementary: 'Complementary Contrast',
    'split-complementary': 'Split-Complementary Nuance',
    'golden-ratio': 'Golden Ratio Phi Spiral',
  };

  return {
    baseHex: baseHex.toUpperCase(),
    mode,
    name: `${modeTitles[mode]} (${baseHex.toUpperCase()})`,
    colors,
  };
}

export function buildPowerBiThemeFromHarmony(
  palette: HarmonyPalette,
  themeName: string = 'Harmony Theme'
): PowerBITheme {
  // Ensure we expand to 10 data colors for full Power BI standard compliance
  const primaryHexes = palette.colors.map((c) => c.hex);
  const shadeHexes = palette.colors.flatMap((c) => [c.shades[3].hex, c.shades[6].hex]);
  const combined = Array.from(new Set([...primaryHexes, ...shadeHexes]));
  const dataColors = combined.slice(0, 10);
  while (dataColors.length < 10) {
    dataColors.push(palette.colors[0].hex);
  }

  return {
    $schema: POWER_BI_THEME_SCHEMA_URL,
    name: themeName,
    dataColors,
    background: '#FFFFFF',
    foreground: '#1E293B',
    tableAccent: dataColors[0],
    good: '#10B981',
    bad: '#EF4444',
    neutral: '#F59E0B',
    textClasses: {
      title: { fontFace: 'Segoe UI', fontSize: 14, color: '#1E293B' },
      label: { fontFace: 'Segoe UI', fontSize: 10, color: '#64748B' },
      callout: { fontFace: 'Segoe UI', fontSize: 24, color: '#1E293B' },
      header: { fontFace: 'Segoe UI', fontSize: 12, color: '#1E293B' },
    },
    visualStyles: {
      '*': {
        '*': {
          visualHeader: [{ show: true }],
          outlines: [{ show: false }],
        },
      },
    },
  };
}

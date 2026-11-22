import { describe, it, expect } from 'vitest';
import {
  generateHarmonyPalette,
  buildPowerBiThemeFromHarmony,
  hexToRgb,
  rgbToHsl,
  hslToHex,
  getContrast,
  HARMONY_PRESET_SEEDS,
} from '../core/paletteHarmony/harmonyEngine';

describe('Palette Harmony Generator Engine', () => {
  it('converts between HEX, RGB, and HSL accurately', () => {
    const hex = '#8B5CF6';
    const [r, g, b] = hexToRgb(hex);
    expect(r).toBe(139);
    expect(g).toBe(92);
    expect(b).toBe(246);

    const { h, s, l } = rgbToHsl(r, g, b);
    expect(h).toBeGreaterThanOrEqual(255);
    expect(h).toBeLessThanOrEqual(265);

    const backToHex = hslToHex(h, s, l);
    const [br, bg, bb] = hexToRgb(backToHex);
    expect(Math.abs(br - r)).toBeLessThanOrEqual(2);
    expect(Math.abs(bg - g)).toBeLessThanOrEqual(2);
    expect(Math.abs(bb - b)).toBeLessThanOrEqual(2);
  });

  it('calculates WCAG 2.1 relative contrast ratios correctly', () => {
    const whiteOnBlack = getContrast('#FFFFFF', '#000000');
    expect(whiteOnBlack).toBe(21);

    const whiteOnWhite = getContrast('#FFFFFF', '#FFFFFF');
    expect(whiteOnWhite).toBe(1);

    const violetOnWhite = getContrast('#8B5CF6', '#FFFFFF');
    expect(violetOnWhite).toBeGreaterThan(3);
  });

  it('generates harmonic palettes across all 7 color theory modes', () => {
    const modes = [
      'analogous',
      'monochromatic',
      'triadic',
      'tetradic',
      'complementary',
      'split-complementary',
      'golden-ratio',
    ] as const;

    for (const mode of modes) {
      const palette = generateHarmonyPalette('#2563EB', mode);
      expect(palette.baseHex).toBe('#2563EB');
      expect(palette.mode).toBe(mode);
      expect(palette.colors.length).toBeGreaterThanOrEqual(5);

      for (const color of palette.colors) {
        expect(color.hex).toMatch(/^#[0-9A-F]{6}$/i);
        expect(color.shades.length).toBe(10);
        expect(color.contrastOnWhite).toBeGreaterThan(0);
        expect(color.contrastOnDark).toBeGreaterThan(0);
      }
    }
  });

  it('builds a compliant 10-color Power BI theme JSON from harmony palette', () => {
    const palette = generateHarmonyPalette('#8B5CF6', 'split-complementary');
    const theme = buildPowerBiThemeFromHarmony(palette, 'Test Harmonic Theme');

    expect(theme.name).toBe('Test Harmonic Theme');
    expect(theme.dataColors.length).toBe(10);
    expect(theme.$schema).toContain('reportThemeSchema');
    expect(theme.good).toBe('#10B981');
    expect(theme.bad).toBe('#EF4444');
    expect(theme.textClasses).toBeDefined();
  });

  it('provides curated seed presets for executive themes', () => {
    expect(HARMONY_PRESET_SEEDS.length).toBeGreaterThanOrEqual(6);
    for (const seed of HARMONY_PRESET_SEEDS) {
      expect(seed.hex).toMatch(/^#[0-9A-F]{6}$/i);
      expect(seed.mode).toBeTruthy();
    }
  });
});

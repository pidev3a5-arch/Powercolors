import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  determineWcagLevel,
  suggestAccessibleColor,
  evaluateContrast,
  generateAuditSummary,
} from '../core/accessibility/contrastEngine';
import {
  simulateCvd,
  detectCvdConflicts,
  CVD_CATALOG,
} from '../core/accessibility/cvdSimulator';
import {
  ACCESSIBLE_PALETTE_PRESETS,
  DEFAULT_BACKGROUND_PRESETS,
} from '../core/accessibility/accessiblePresets';

describe('WCAG 2.1 Contrast Engine', () => {
  it('calculates exact contrast ratios for black, white, and standard colors', () => {
    expect(getContrastRatio('#000000', '#FFFFFF')).toBe(21);
    expect(getContrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
    expect(getContrastRatio('#1E293B', '#FFFFFF')).toBeGreaterThan(10);
  });

  it('correctly maps contrast ratios to WCAG levels', () => {
    expect(determineWcagLevel(7.5)).toBe('AAA');
    expect(determineWcagLevel(4.6)).toBe('AA');
    expect(determineWcagLevel(3.2)).toBe('AA-Large');
    expect(determineWcagLevel(2.8)).toBe('Fail');
  });

  it('suggests compliant darker shades for low-contrast colors on light backgrounds', () => {
    // #FDE047 (light yellow) has poor contrast on white (< 1.5:1)
    const fix = suggestAccessibleColor('#FDE047', '#FFFFFF', 3.0);
    expect(fix).not.toBeNull();
    if (fix) {
      expect(fix.newRatio).toBeGreaterThanOrEqual(3.0);
      expect(getContrastRatio(fix.suggestedHex, '#FFFFFF')).toBeGreaterThanOrEqual(3.0);
    }
  });

  it('suggests compliant lighter shades for low-contrast colors on dark backgrounds', () => {
    // #1E293B on #0F172A has very poor contrast (< 1.5:1)
    const fix = suggestAccessibleColor('#1E293B', '#0F172A', 3.0);
    expect(fix).not.toBeNull();
    if (fix) {
      expect(fix.newRatio).toBeGreaterThanOrEqual(3.0);
      expect(getContrastRatio(fix.suggestedHex, '#0F172A')).toBeGreaterThanOrEqual(3.0);
    }
  });

  it('evaluates comprehensive contrast metrics and flags graphical / text compliance', () => {
    const res = evaluateContrast('#2563EB', '#FFFFFF');
    expect(res.foreground).toBe('#2563EB');
    expect(res.background).toBe('#FFFFFF');
    expect(res.ratio).toBeGreaterThan(4.0);
    expect(res.graphicalObject.aa).toBe(true);
  });

  it('generates a full audit summary with compliance score and counts', () => {
    const palette = ACCESSIBLE_PALETTE_PRESETS[0].colors; // Bang Wong
    const summary = generateAuditSummary(palette, DEFAULT_BACKGROUND_PRESETS, 0);

    expect(summary.totalColors).toBe(10);
    expect(summary.totalBackgrounds).toBe(5);
    expect(summary.totalChecks).toBe(50);
    expect(summary.complianceScore).toBeGreaterThan(50);
  });
});

describe('Color Vision Deficiency (CVD) Simulation Engine', () => {
  it('returns unchanged color for normal vision', () => {
    const hex = '#2563EB';
    expect(simulateCvd(hex, 'normal')).toBe(hex);
  });

  it('simulates grayscale for Achromatopsia', () => {
    const red = '#EF4444';
    const simulated = simulateCvd(red, 'achromatopsia');
    expect(simulated).toMatch(/^#[0-9A-F]{6}$/);

    // In grayscale, R, G, and B should be virtually equal
    const r = parseInt(simulated.slice(1, 3), 16);
    const g = parseInt(simulated.slice(3, 5), 16);
    const b = parseInt(simulated.slice(5, 7), 16);
    expect(Math.abs(r - g)).toBeLessThanOrEqual(2);
    expect(Math.abs(g - b)).toBeLessThanOrEqual(2);
  });

  it('simulates Deuteranopia and Protanopia accurately', () => {
    const green = '#22C55E';
    const deut = simulateCvd(green, 'deuteranopia');
    const prot = simulateCvd(green, 'protanopia');
    const trit = simulateCvd(green, 'tritanopia');

    expect(deut).not.toBe(green);
    expect(prot).not.toBe(green);
    expect(trit).not.toBe(green);
  });

  it('detects severe red-green conflicts in colorblind simulation', () => {
    // Problematic palette with conflicting red and brownish-green
    const problematicPalette = ['#B91C1C', '#847525', '#2563EB'];
    const conflicts = detectCvdConflicts(problematicPalette, 12);

    expect(conflicts.length).toBeGreaterThan(0);
    const hasDeuteranopiaConflict = conflicts.some(
      (c) => c.cvdType === 'deuteranopia' && (c.colorA === '#B91C1C' || c.colorB === '#B91C1C')
    );
    expect(hasDeuteranopiaConflict).toBe(true);
  });

  it('has comprehensive catalog metadata for all 5 CVD types', () => {
    expect(CVD_CATALOG.length).toBe(5);
    expect(CVD_CATALOG.map((c) => c.type)).toContain('deuteranopia');
    expect(CVD_CATALOG.map((c) => c.type)).toContain('protanopia');
    expect(CVD_CATALOG.map((c) => c.type)).toContain('tritanopia');
    expect(CVD_CATALOG.map((c) => c.type)).toContain('achromatopsia');
  });
});

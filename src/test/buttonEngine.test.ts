import { describe, it, expect } from 'vitest';
import {
  generateButtonSvg,
  resolveCornerRadius,
  generateButtonDaxExpression,
  exportButtonBundleZip,
} from '../core/button/buttonEngine';
import { CURATED_BUTTON_PRESETS } from '../core/button/presets';
import { ButtonConfig } from '../core/button/types';

describe('Button Studio Engine', () => {
  const sampleConfig: ButtonConfig = {
    id: 'test-btn',
    name: 'Test Button',
    type: 'nav',
    styleVariant: 'neo-pop',
    width: 160,
    height: 40,
    cornerRadius: 'pill',
    showTitle: true,
    title: 'Executive Nav',
    fontFamily: 'Segoe UI',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    showBadge: true,
    badgeText: 'New',
    badgeBgColor: '#FBBF24',
    badgeTextColor: '#1E293B',
    showIcon: true,
    iconName: 'nav-home',
    iconPosition: 'left',
    iconSize: 16,
    fillColor: '#8B5CF6',
    borderColor: '#1E293B',
    borderWidth: 2,
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    hasShadow: true,
    shadowColor: '#1E293B',
    shadowOffset: 2,
    stateOverrides: {
      hover: {
        fillColor: '#7C3AED',
        offsetY: -1,
        shadowOffset: 3,
      },
      pressed: {
        fillColor: '#6D28D9',
        offsetY: 2,
        shadowOffset: 1,
      },
      inactive: {
        fillColor: '#F8FAFC',
        textColor: '#64748B',
      },
      disabled: {
        fillColor: '#E2E8F0',
        textColor: '#94A3B8',
      },
    },
  };

  it('generates compliant SVG markup for default state', () => {
    const svg = generateButtonSvg(sampleConfig, 'default');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('Executive Nav');
    expect(svg).toContain('New');
    expect(svg).toContain('#8B5CF6');
  });

  it('generates distinct styles for all 5 button states', () => {
    const defaultSvg = generateButtonSvg(sampleConfig, 'default');
    const hoverSvg = generateButtonSvg(sampleConfig, 'hover');
    const pressedSvg = generateButtonSvg(sampleConfig, 'pressed');
    const inactiveSvg = generateButtonSvg(sampleConfig, 'inactive');
    const disabledSvg = generateButtonSvg(sampleConfig, 'disabled');

    expect(hoverSvg).toContain('#7C3AED');
    expect(pressedSvg).toContain('#6D28D9');
    expect(inactiveSvg).toContain('#F8FAFC');
    expect(disabledSvg).toContain('#E2E8F0');
    expect(disabledSvg).toContain('opacity="0.55"');

    // Distinct SVGs
    expect(defaultSvg).not.toEqual(hoverSvg);
    expect(hoverSvg).not.toEqual(pressedSvg);
    expect(pressedSvg).not.toEqual(disabledSvg);
  });

  it('correctly calculates corner radiuses', () => {
    expect(resolveCornerRadius('square', 40)).toBe(0);
    expect(resolveCornerRadius('subtle', 40)).toBe(6);
    expect(resolveCornerRadius('smooth', 40)).toBe(12);
    expect(resolveCornerRadius('rounded', 40)).toBe(18);
    expect(resolveCornerRadius('pill', 40)).toBe(20);
    expect(resolveCornerRadius('subtle', 40, 25)).toBe(25);
  });

  it('generates DAX measure expression with Image URL category', () => {
    const dax = generateButtonDaxExpression(sampleConfig, 'default');
    expect(dax).toContain('// Power BI Button Measure');
    expect(dax).toContain('data:image/svg+xml;utf8,');
    expect(dax).toContain('Button_Test_Button_default');
  });

  it('generates 4-state Power BI Desktop zip bundle with README', async () => {
    const zipBlob = await exportButtonBundleZip(sampleConfig, ['default', 'hover', 'pressed', 'disabled']);
    expect(zipBlob).toBeDefined();
    expect(zipBlob.size).toBeGreaterThan(500);
  });

  it('contains exactly 18 curated button presets', () => {
    expect(CURATED_BUTTON_PRESETS.length).toBe(18);
    for (const preset of CURATED_BUTTON_PRESETS) {
      const svg = generateButtonSvg(preset.config, 'default');
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      if (preset.config.showTitle) {
        expect(svg).toContain(preset.config.title);
      }
    }
  });

  it('handles horizontal text and icon alignment (left, center, right)', () => {
    const leftBtn = generateButtonSvg({ ...sampleConfig, textAlign: 'left' }, 'default');
    const centerBtn = generateButtonSvg({ ...sampleConfig, textAlign: 'center' }, 'default');
    const rightBtn = generateButtonSvg({ ...sampleConfig, textAlign: 'right' }, 'default');

    expect(leftBtn).toContain('<svg');
    expect(centerBtn).toContain('<svg');
    expect(rightBtn).toContain('<svg');
    // Each alignment yields different coordinate offsets for icon and text
    expect(leftBtn).not.toEqual(centerBtn);
    expect(centerBtn).not.toEqual(rightBtn);
  });

  it('supports custom imported SVG icons with sanitization', () => {
    const customMarkup = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    const btnWithCustomIcon = generateButtonSvg(
      {
        ...sampleConfig,
        customIconSvg: customMarkup,
      },
      'default'
    );

    expect(btnWithCustomIcon).toContain('points="5 3 19 12 5 21 5 3"');
  });

  it('supports Poppins and Outfit font families in button rendering', () => {
    const poppinsBtn = generateButtonSvg({ ...sampleConfig, fontFamily: 'Poppins' }, 'default');
    const outfitBtn = generateButtonSvg({ ...sampleConfig, fontFamily: 'Outfit' }, 'default');

    expect(poppinsBtn).toContain('font-family="Poppins');
    expect(outfitBtn).toContain('font-family="Outfit');
  });
});

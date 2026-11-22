import { describe, it, expect } from 'vitest';
import { SVG_ICONS_COLLECTION, ICON_CATEGORIES } from '../core/iconLibrary/icons';
import {
  DEFAULT_ICON_CUSTOMIZATION,
  generateRawSvg,
  generateDaxIconMeasure,
} from '../core/iconLibrary/daxIconEngine';

describe('Icon Library & SVG Picker Engine', () => {
  it('loads 100+ production vector icons across 5 categories', () => {
    expect(SVG_ICONS_COLLECTION.length).toBeGreaterThanOrEqual(100);
    expect(ICON_CATEGORIES.length).toBe(5);

    for (const cat of ICON_CATEGORIES) {
      const inCat = SVG_ICONS_COLLECTION.filter((i) => i.category === cat.id);
      expect(inCat.length).toBeGreaterThanOrEqual(15);
    }
  });

  it('renders valid SVG markup with custom colors and sizes', () => {
    const icon = SVG_ICONS_COLLECTION[0];
    const custom = {
      ...DEFAULT_ICON_CUSTOMIZATION,
      color: '#10B981',
      size: 32,
      strokeWidth: 2.5,
    };

    const svg = generateRawSvg(icon, custom);
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
    expect(svg).toContain('stroke="#10B981"');
    expect(svg).toContain('stroke-width="2.5"');
  });

  it('generates badge containers (rounded, circle, outline)', () => {
    const icon = SVG_ICONS_COLLECTION[0];

    const roundedSvg = generateRawSvg(icon, {
      ...DEFAULT_ICON_CUSTOMIZATION,
      badgeStyle: 'soft-rounded',
    });
    expect(roundedSvg).toContain('<rect');

    const circleSvg = generateRawSvg(icon, {
      ...DEFAULT_ICON_CUSTOMIZATION,
      badgeStyle: 'circle',
    });
    expect(circleSvg).toContain('<circle');

    const outlineSvg = generateRawSvg(icon, {
      ...DEFAULT_ICON_CUSTOMIZATION,
      badgeStyle: 'square-outline',
    });
    expect(outlineSvg).toContain('<rect');
  });

  it('generates a copy-paste Power BI DAX Measure with ImageUrl Data Category', () => {
    const icon = SVG_ICONS_COLLECTION.find((i) => i.id === 'fin-dollar')!;
    expect(icon).toBeDefined();

    const dax = generateDaxIconMeasure(icon, DEFAULT_ICON_CUSTOMIZATION, 'Revenue Icon Measure');
    expect(dax).toContain('Revenue Icon Measure =');
    expect(dax).toContain('data:image/svg+xml;utf8,');
    expect(dax).toContain('%238B5CF6'); // URL-safe encoded hex for Power BI
    expect(dax).toContain('Image URL'); // Power BI instructions comment
  });
});

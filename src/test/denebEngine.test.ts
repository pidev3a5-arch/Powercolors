import { describe, it, expect } from 'vitest';
import {
  injectThemePaletteIntoSpec,
  generatePbirDenebVisualJson,
  DENEB_CUSTOM_VISUAL_GUID,
} from '../core/deneb/denebEngine';
import { DENEB_CATALOG, DENEB_CATEGORIES } from '../core/deneb/catalog';

describe('Deneb & Vega-Lite Custom Visual Engine & Catalog', () => {
  it('contains comprehensive catalog of certified Deneb templates', () => {
    expect(DENEB_CATALOG.length).toBeGreaterThanOrEqual(15);
    expect(DENEB_CATEGORIES.length).toBe(6);

    DENEB_CATALOG.forEach((template) => {
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
      expect(template.spec).toBeDefined();
      expect(template.spec.$schema).toBeDefined();
      expect(template.dataRoles.length).toBeGreaterThan(0);
      expect(typeof template.renderPreviewSvg).toBe('function');

      // Test preview rendering with sample palette
      const svg = template.renderPreviewSvg(['#8B5CF6', '#FBBF24', '#34D399']);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });
  });

  it('injects active theme palette hexes into Vega-Lite spec color range', () => {
    const testSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      mark: 'bar',
      encoding: {
        x: { field: 'Category', type: 'nominal' },
        y: { field: 'Sales', type: 'quantitative' },
        color: {
          field: 'Category',
          type: 'nominal',
          scale: { range: ['#000', '#111'] },
        },
      },
    };

    const newPalette = ['#8B5CF6', '#F472B6', '#34D399'];
    const injected = injectThemePaletteIntoSpec(testSpec, newPalette);

    expect(injected.encoding.color.scale.range).toEqual(newPalette);
    expect(injected.config.range.category).toEqual(newPalette);
  });

  it('generates compliant PBIR visual.json containing Deneb GUID and escaped spec', () => {
    const bulletTemplate = DENEB_CATALOG.find((t) => t.id === 'bullet-chart')!;
    expect(bulletTemplate).toBeDefined();

    const pbirJson = generatePbirDenebVisualJson(bulletTemplate, {
      visualName: 'ExecutiveBulletChart',
      position: { x: 40, y: 50, width: 640, height: 380, z: 2 },
      palette: ['#8B5CF6', '#FBBF24'],
    });

    const parsed = JSON.parse(pbirJson);

    expect(parsed.name).toBe('ExecutiveBulletChart');
    expect(parsed.position.x).toBe(40);
    expect(parsed.position.y).toBe(50);
    expect(parsed.position.width).toBe(640);
    expect(parsed.position.height).toBe(380);
    expect(parsed.position.z).toBe(2);

    // Verify official Deneb GUID
    expect(parsed.visual.visualType).toBe(DENEB_CUSTOM_VISUAL_GUID);

    // Verify developer objects contain spec expression
    expect(parsed.visual.objects.developer).toBeDefined();
    const specExpr = parsed.visual.objects.developer[0].properties.spec.expr.Literal.Value;
    expect(specExpr).toContain('https://vega.github.io/schema/vega-lite/v5.json');
  });
});

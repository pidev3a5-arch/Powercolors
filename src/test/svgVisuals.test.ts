import { describe, it, expect } from 'vitest';
import { SVG_VISUALS_CATALOG, SVG_CATEGORIES } from '../core/svgVisuals/catalog';
import { convertRawSvgToDax } from '../core/svgVisuals/svgToDaxConverter';
import { buildDaxMeasure, sanitizeSvgForDax, formatDaxMeasureName } from '../core/svgVisuals/daxGenerator';
import { getPaginationRange } from '../core/svgVisuals/pagination';

describe('SVG Visuals Catalog & DAX Generator (Phase 8)', () => {
  it('should have all expected categories configured', () => {
    expect(SVG_CATEGORIES.length).toBeGreaterThanOrEqual(6);
    const catIds = SVG_CATEGORIES.map((c) => c.id);
    expect(catIds).toContain('kpi');
    expect(catIds).toContain('gauge');
    expect(catIds).toContain('line');
    expect(catIds).toContain('bar');
    expect(catIds).toContain('donut');
    expect(catIds).toContain('waffle');
  });

  it('should contain at least 50 rich micro-visuals in the catalog', () => {
    expect(SVG_VISUALS_CATALOG.length).toBeGreaterThanOrEqual(50);
  });

  it('should contain at least 16 KPI and executive card visuals inspired by Sebastine Amede collection', () => {
    const kpiVisuals = SVG_VISUALS_CATALOG.filter((v) => v.category === 'kpi');
    expect(kpiVisuals.length).toBeGreaterThanOrEqual(16);

    const expectedExecutiveCardIds = [
      'kpi-card-columns-minmax',
      'kpi-card-area-sparkline',
      'kpi-card-dual-trendline',
      'kpi-card-variance-columns',
      'kpi-card-combo-line-variance',
      'kpi-card-lollipop-variance',
      'kpi-card-stepped-area',
      'kpi-card-benchmark-horizon',
    ];

    for (const cardId of expectedExecutiveCardIds) {
      const card = kpiVisuals.find((v) => v.id === cardId);
      expect(card).toBeDefined();
      expect(card?.viewBox).toBe('0 0 170 120');
      expect(card?.recommendedDimensions).toEqual({ width: 170, height: 120 });

      // Verify SVG rendering
      const defaultParams: Record<string, unknown> = {};
      card?.params.forEach((p) => {
        defaultParams[p.id] = p.defaultValue;
      });
      const svg = card?.renderSvg(defaultParams);
      expect(svg).toContain("viewBox='0 0 170 120'");
      expect(svg).toContain('$95,926');
      expect(svg).toContain('Profit as at 30/12/2024');

      // Verify DAX generation
      const dax = card?.generateDax(defaultParams, `[${card.name}]`);
      expect(dax).toContain(`[${card?.name}] = `);
      expect(dax).toContain('Image URL');
      expect(dax).toContain('VAR _Title = "Profit as at 30/12/2024"');
      expect(dax).toContain('VAR _MetricValue = "$95,926"');
      expect(dax).toContain('RETURN');
    }
  });

  it('every visual should render valid SVG XML with default parameters', () => {
    for (const visual of SVG_VISUALS_CATALOG) {
      const defaultParams: Record<string, unknown> = {};
      for (const p of visual.params) {
        defaultParams[p.id] = p.defaultValue;
      }
      const svg = visual.renderSvg(defaultParams);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain("xmlns='http://www.w3.org/2000/svg'");
      expect(svg).toContain('viewBox');
    }
  });

  it('every visual should generate compliant Power BI DAX with Image URL instructions', () => {
    for (const visual of SVG_VISUALS_CATALOG) {
      const defaultParams: Record<string, unknown> = {};
      for (const p of visual.params) {
        defaultParams[p.id] = p.defaultValue;
      }
      const measureName = `Test_${visual.id.replace(/-/g, '_')}`;
      const dax = visual.generateDax(defaultParams, measureName);

      expect(dax.startsWith(`${measureName} = `)).toBe(true);
      expect(dax).toContain('Image URL');
      expect(dax).toContain('data:image/svg+xml;utf8,');
      expect(dax).toContain('VAR ');
      expect(dax).toContain('RETURN');
    }
  });

  it('formatDaxMeasureName should handle spaces, brackets, and identifiers for DAX compliance', () => {
    // Plain identifier remains unchanged
    expect(formatDaxMeasureName('SVG_Metric_Callout')).toBe('SVG_Metric_Callout');

    // Names with spaces are safely wrapped in square brackets [ ... ]
    expect(formatDaxMeasureName('SVG Metric Callout with Delta Arrow')).toBe('[SVG Metric Callout with Delta Arrow]');
    expect(formatDaxMeasureName('Sales % Variance')).toBe('[Sales % Variance]');

    // Already bracketed names stay untouched
    expect(formatDaxMeasureName('[My Custom Measure]')).toBe('[My Custom Measure]');

    // Empty or falsy falls back safely
    expect(formatDaxMeasureName('')).toBe('Custom_SVG_Measure');
  });

  it('buildDaxMeasure MUST place measure name on Line 1 for Power BI Desktop formula bar compatibility', () => {
    const daxWithSpaces = buildDaxMeasure({
      measureName: 'SVG Metric Callout with Delta Arrow',
      description: 'Test metric callout',
      configVars: [{ name: '_Val', value: 100, type: 'number' }],
      svgElements: [{ name: '_El', expression: '"<rect/>"' }],
      viewBox: '0 0 100 100',
    });

    const lines = daxWithSpaces.split('\n');
    // Line 1 MUST be the bracketed measure identifier and =
    expect(lines[0]).toBe('[SVG Metric Callout with Delta Arrow] = ');
    // Line 2 MUST be comments, NOT preceding line 1
    expect(lines[1]).toContain('-- ==========================================================');
  });

  it('direct reference visuals (gauge-with-track, gauge-with-outline-needle, kpi-ring-checkpoint) exist and behave accurately', () => {
    const trackGauge = SVG_VISUALS_CATALOG.find((v) => v.id === 'gauge-with-track');
    expect(trackGauge).toBeDefined();
    const svgTrack = trackGauge!.renderSvg({ actual: 40 });
    expect(svgTrack).toContain('40%');
    expect(svgTrack).toContain('d=\'M 14,48 A 36 36 0 0 1 86,48\'');

    const needleGauge = SVG_VISUALS_CATALOG.find((v) => v.id === 'gauge-with-outline-needle');
    expect(needleGauge).toBeDefined();
    const svgNeedle = needleGauge!.renderSvg({ actual: 55 });
    expect(svgNeedle).toContain('55%');
    expect(svgNeedle).toContain('<line x1=\'50\' y1=\'50\'');

    const checkpoint = SVG_VISUALS_CATALOG.find((v) => v.id === 'kpi-ring-checkpoint');
    expect(checkpoint).toBeDefined();
    const svg100 = checkpoint!.renderSvg({ actual: 100 });
    expect(svg100).toContain('<path d=\'M33 50 L45 62 L67 38\''); // checkmark
    const svg75 = checkpoint!.renderSvg({ actual: 75 });
    expect(svg75).toContain('75%');
  });

  it('buildDaxMeasure should format and assemble VAR blocks cleanly', () => {
    const dax = buildDaxMeasure({
      measureName: 'Custom_Measure',
      description: 'Test measure',
      configVars: [
        { name: '_Actual', value: 50, type: 'number', comment: 'Sales amount' },
        { name: '_Color', value: '#8B5CF6', type: 'color' },
      ],
      svgElements: [
        { name: '_Rect', expression: '"<rect width=\'100\' height=\'20\' fill=\'" & _Color & "\'/>"' },
      ],
      viewBox: '0 0 100 20',
    });

    expect(dax).toContain('Custom_Measure =');
    expect(dax).toContain('VAR _Actual = 50  -- Sales amount');
    expect(dax).toContain('VAR _Color = "#8B5CF6"');
    expect(dax).toContain('RETURN');
    expect(dax).toContain('& _Rect');
  });

  it('sanitizeSvgForDax should normalize spacing and convert double quotes to single quotes', () => {
    const raw = '<svg width="100" height="50">\n  <circle cx="50" cy="25" r="20"/>\n</svg>';
    const sanitized = sanitizeSvgForDax(raw);
    expect(sanitized).not.toContain('"');
    expect(sanitized).toContain("width='100'");
    expect(sanitized).toContain("cx='50'");
  });

  it('convertRawSvgToDax should convert arbitrary SVG to a valid Power BI DAX measure', () => {
    const sampleSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#2563EB" stroke="#1E293B" stroke-width="2" />
      <text x="50" y="55" fill="#FFFFFF">Hello</text>
    </svg>`;

    const res = convertRawSvgToDax(sampleSvg, { measureName: 'My_Imported_Visual' });
    expect(res.error).toBeUndefined();
    expect(res.measureName).toBe('My_Imported_Visual');
    expect(res.daxCode.startsWith('My_Imported_Visual = ')).toBe(true);
    expect(res.daxCode).toContain('data:image/svg+xml;utf8,');
    expect(res.daxCode).toContain('Image URL');
    expect(res.detectedColors).toContain('#2563EB');
    expect(res.detectedColors).toContain('#1E293B');
    expect(res.detectedColors).toContain('#FFFFFF');
  });

  it('convertRawSvgToDax should handle invalid or empty input gracefully', () => {
    const resEmpty = convertRawSvgToDax('');
    expect(resEmpty.error).toBeDefined();

    const resInvalid = convertRawSvgToDax('<div>Not an svg</div>');
    expect(resInvalid.error).toBeDefined();
    expect(resInvalid.daxCode).toBe('');
  });

  it('getPaginationRange should compute accurate pagination pages and ellipsis matching reference design', () => {
    // Small page counts: all pages visible
    expect(getPaginationRange(1, 1)).toEqual([1]);
    expect(getPaginationRange(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);

    // Many pages, on first page
    const firstRange = getPaginationRange(1, 20);
    expect(firstRange).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 20]);

    // Many pages, on middle page
    const middleRange = getPaginationRange(10, 25);
    expect(middleRange).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 25]);

    // Many pages, on last page
    const lastRange = getPaginationRange(20, 20);
    expect(lastRange).toEqual([1, '...', 14, 15, 16, 17, 18, 19, 20]);
  });
});

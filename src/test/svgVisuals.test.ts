import { describe, it, expect } from 'vitest';
import { SVG_VISUALS_CATALOG, SVG_CATEGORIES } from '../core/svgVisuals/catalog';
import { convertRawSvgToDax } from '../core/svgVisuals/svgToDaxConverter';
import { buildDaxMeasure, sanitizeSvgForDax } from '../core/svgVisuals/daxGenerator';

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

  it('should contain at least 40 rich micro-visuals in the catalog', () => {
    expect(SVG_VISUALS_CATALOG.length).toBeGreaterThanOrEqual(40);
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

      expect(dax).toContain(measureName);
      expect(dax).toContain('Image URL');
      expect(dax).toContain('data:image/svg+xml;utf8,');
      expect(dax).toContain('VAR ');
      expect(dax).toContain('RETURN');
    }
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
    expect(res.daxCode).toContain('My_Imported_Visual =');
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
});

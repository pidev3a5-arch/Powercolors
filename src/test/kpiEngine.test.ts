import { describe, it, expect } from 'vitest';
import {
  generateKpiCardSvg,
  generateKpiDaxMeasure,
  generateKpiPbirSnippet,
  generateScorecardSvg,
  resolveBadgeColors,
  generateSparklinePaths,
} from '../core/kpiCard/kpiEngine';
import { KPI_PRESETS } from '../core/kpiCard/catalog';

describe('KPI Card Engine & Generator', () => {
  const sampleCard = KPI_PRESETS[0].config;

  it('renders a valid SVG for a KPI card with correct dimensions and viewbox', () => {
    const svg = generateKpiCardSvg(sampleCard);
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 294 144"'); // 290w + 4 shadow, 140h + 4 shadow
    expect(svg).toContain('MONTHLY REVENUE');
    expect(svg).toContain('$1,248,500');
    expect(svg).toContain('+8.6%');
    expect(svg).toContain('</svg>');
  });

  it('resolves badge colors correctly based on polarity and trend direction', () => {
    // Normal good-up: up is green, down is red
    const upGood = resolveBadgeColors('up', 'good-up', 'subtle-tint');
    expect(upGood.arrow).toBe('▲');
    expect(upGood.text).toBe('#15803D');

    const downGood = resolveBadgeColors('down', 'good-up', 'subtle-tint');
    expect(downGood.arrow).toBe('▼');
    expect(downGood.text).toBe('#B91C1C');

    // Inverse good-down (e.g. Churn/Costs): down is green, up is red
    const churnDown = resolveBadgeColors('down', 'good-down', 'subtle-tint');
    expect(churnDown.arrow).toBe('▼');
    expect(churnDown.text).toBe('#15803D'); // green!

    const churnUp = resolveBadgeColors('up', 'good-down', 'subtle-tint');
    expect(churnUp.arrow).toBe('▲');
    expect(churnUp.text).toBe('#B91C1C'); // red!
  });

  it('generates smooth sparkline and spark-area paths from data points', () => {
    const points = [10, 20, 15, 30, 25, 40];
    const { linePath, areaPath, lastPoint } = generateSparklinePaths(points, 100, 50, 4);
    expect(linePath).toContain('M');
    expect(linePath).toContain('Q');
    expect(areaPath).toContain('Z');
    expect(lastPoint.x).toBe(96);
  });

  it('generates valid Power BI DAX Image URL measure syntax', () => {
    const dax = generateKpiDaxMeasure(sampleCard);
    expect(dax).toContain('data:image/svg+xml;utf8,');
    expect(dax).toContain('VAR _CurrentValue');
    expect(dax).toContain('RETURN');
    expect(dax).toContain('Data Category');
  });

  it('generates schema-compliant PBIR visual container JSON snippet', () => {
    const pbirJson = generateKpiPbirSnippet(sampleCard);
    const parsed = JSON.parse(pbirJson);
    expect(parsed).toHaveProperty('$schema');
    expect(parsed.visual.visualType).toBe('image');
    expect(parsed.position.width).toBe(290);
  });

  it('renders multi-card executive scorecard SVG bundle', () => {
    const cards = [KPI_PRESETS[0].config, KPI_PRESETS[1].config, KPI_PRESETS[2].config];
    const scorecardSvg = generateScorecardSvg(cards, 16);
    expect(scorecardSvg).toContain('<svg');
    expect(scorecardSvg).toContain('MONTHLY REVENUE');
    expect(scorecardSvg).toContain('QUOTA ATTAINMENT');
    expect(scorecardSvg).toContain('NET RETENTION RATE');
    expect(scorecardSvg).toContain('</svg>');
  });

  it('renders radial progress ring and bullet charts correctly', () => {
    const radialPreset = KPI_PRESETS[1].config;
    const radialSvg = generateKpiCardSvg(radialPreset);
    expect(radialSvg).toContain('stroke-dasharray');
    expect(radialSvg).toContain('stroke-dashoffset');

    const bulletPreset = KPI_PRESETS[3].config;
    const bulletSvg = generateKpiCardSvg(bulletPreset);
    expect(bulletSvg).toContain('OF GOAL');
  });

  it('renders bar-chart, semi-gauge, stepped-area, lollipop, and waffle micro-charts', () => {
    // Bar chart
    const barCard = { ...sampleCard, chartType: 'bar-chart' as const, sparkPoints: [30, 50, 70, 90] };
    const barSvg = generateKpiCardSvg(barCard);
    expect(barSvg).toContain('<rect');

    // Semi-gauge (Speedometer)
    const gaugeCard = { ...sampleCard, chartType: 'semi-gauge' as const, progressValue: 88 };
    const gaugeSvg = generateKpiCardSvg(gaugeCard);
    expect(gaugeSvg).toContain('GAUGE');
    expect(gaugeSvg).toContain('A 24 24');

    // Stepped area
    const stepCard = { ...sampleCard, chartType: 'stepped-area' as const, sparkPoints: [100, 80, 60, 40] };
    const stepSvg = generateKpiCardSvg(stepCard);
    expect(stepSvg).toContain('H ');
    expect(stepSvg).toContain('V ');

    // Lollipop
    const lollipopCard = { ...sampleCard, chartType: 'lollipop' as const, sparkPoints: [20, 40, 60] };
    const lollipopSvg = generateKpiCardSvg(lollipopCard);
    expect(lollipopSvg).toContain('stroke-dasharray="2 2"');

    // Waffle grid
    const waffleCard = { ...sampleCard, chartType: 'waffle' as const, progressValue: 70 };
    const waffleSvg = generateKpiCardSvg(waffleCard);
    expect(waffleSvg).toContain('70%');
  });

  it('toggles drop shadow on and off cleanly', () => {
    // Shadow ON
    const withShadow = generateKpiCardSvg({ ...sampleCard, showShadow: true, shadowOffset: 4 });
    expect(withShadow).toContain('viewBox="0 0 294 144"');
    expect(withShadow).toContain('<rect x="4" y="4"');

    // Shadow OFF
    const withoutShadow = generateKpiCardSvg({ ...sampleCard, showShadow: false, shadowOffset: 4 });
    expect(withoutShadow).toContain('viewBox="0 0 290 140"');
    expect(withoutShadow).not.toContain('<rect x="4" y="4"');
  });

  it('always places the instruction comment block immediately after the measure name in DAX', () => {
    const dax = generateKpiDaxMeasure(sampleCard);
    const measureName = sampleCard.name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    // Verify measureName is followed by " = \n/*\n  ============================================================================="
    expect(dax.startsWith(measureName)).toBe(true);
    expect(dax).toContain(`${measureName} = \n/*\n  =============================================================================`);
    expect(dax).toContain('HOW TO USE IN POWER BI DESKTOP:');
    expect(dax).toContain('Data Category');
  });
});

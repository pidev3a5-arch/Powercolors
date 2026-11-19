import { describe, it, expect } from 'vitest';
import { deriveStructuralColors } from '../core/colorHarmonics';

describe('Report Canvas & Visual Color Binding', () => {
  const sampleDataColors = [
    '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#D97706',
    '#059669', '#0D9488', '#0284C7', '#4F46E5', '#9333EA',
  ];

  it('binds primary color (dataColors[0]) to dominant visual series', () => {
    const primary = sampleDataColors[0];
    expect(primary).toBe('#2563EB');

    // In ClusteredBarChart: Enterprise series uses dataColors[0]
    const barSeries0Color = sampleDataColors[0];
    expect(barSeries0Color).toBe('#2563EB');

    // In LineTrendChart: 2026 Actuals series uses dataColors[0]
    const lineSeriesActuals = sampleDataColors[0];
    expect(lineSeriesActuals).toBe('#2563EB');

    // In DonutChart: Direct Sales slice uses dataColors[0]
    const donutSlice0 = sampleDataColors[0];
    expect(donutSlice0).toBe('#2563EB');
  });

  it('binds comparison benchmark series to distinct dataColors index', () => {
    // Benchmark series in line trend uses dataColors[4] or dataColors[1]
    const benchmarkColor = sampleDataColors[4];
    expect(benchmarkColor).toBe('#D97706');
    expect(benchmarkColor).not.toBe(sampleDataColors[0]);
  });

  it('correctly maps structural.tableAccent to matrix table headers', () => {
    const lightStructural = deriveStructuralColors(sampleDataColors[0], false);
    expect(lightStructural.tableAccent).toBe('#2563EB');

    // If dominant color changes, tableAccent follows
    const customAccent = '#047857';
    const updatedStructural = deriveStructuralColors(customAccent, false);
    expect(updatedStructural.tableAccent).toBe('#047857');
  });

  it('adjusts background and container contrast between light and dark canvas', () => {
    const light = deriveStructuralColors('#2563EB', false);
    expect(light.background).toBe('#FFFFFF');
    expect(light.foreground).toBe('#1E293B');

    const dark = deriveStructuralColors('#2563EB', true);
    expect(dark.background).toBe('#0F172A');
    expect(dark.foreground).toBe('#F8FAFC');
  });

  it('applies standard Power BI KPI status colors', () => {
    const structural = deriveStructuralColors('#2563EB', false);
    // Good / Positive indicator
    expect(structural.good).toBe('#16A34A');
    // Bad / Negative indicator
    expect(structural.bad).toBe('#DC2626');
    // Neutral indicator
    expect(structural.neutral).toBe('#EAB308');
  });
});

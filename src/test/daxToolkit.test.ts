import { describe, it, expect } from 'vitest';
import { DAX_CATALOG, DAX_CATEGORIES } from '../core/daxToolkit/catalog';
import { interpolateDax, createDaxFileBlob } from '../core/daxToolkit/daxEngine';

describe('DAX Measure Toolkit Catalog & Engine', () => {
  it('loads valid DAX templates across all 6 categories', () => {
    expect(DAX_CATALOG.length).toBeGreaterThanOrEqual(15);
    expect(DAX_CATEGORIES.length).toBe(6);

    for (const cat of DAX_CATEGORIES) {
      const matching = DAX_CATALOG.filter((t) => t.category === cat.id);
      expect(matching.length).toBeGreaterThan(0);
    }
  });

  it('interpolates DAX parameters with default values when none provided', () => {
    const ytd = DAX_CATALOG.find((t) => t.id === 'ytd-measure');
    expect(ytd).toBeDefined();

    if (ytd) {
      const interpolated = interpolateDax(ytd, {});
      expect(interpolated).toContain('Sales YTD =');
      expect(interpolated).toContain('[Total Sales]');
      expect(interpolated).toContain("'Date'[Date]");
    }
  });

  it('interpolates DAX parameters with custom user substitutions', () => {
    const ytd = DAX_CATALOG.find((t) => t.id === 'ytd-measure');
    expect(ytd).toBeDefined();

    if (ytd) {
      const customParams = {
        measure_name: 'Revenue YTD',
        base_measure: '[Gross Revenue]',
        date_column: "'Calendar'[FullDate]",
      };
      const interpolated = interpolateDax(ytd, customParams);
      expect(interpolated).toContain('Revenue YTD =');
      expect(interpolated).toContain('[Gross Revenue]');
      expect(interpolated).toContain("'Calendar'[FullDate]");
      expect(interpolated).not.toContain('Sales YTD');
    }
  });

  it('generates a downloadable .dax file blob with metadata comments', async () => {
    const ytd = DAX_CATALOG[0];
    const daxCode = interpolateDax(ytd, {});
    const blob = createDaxFileBlob(ytd.name, daxCode);

    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(50);
    const text = await blob.text();
    expect(text).toContain('// PowerLab DAX Measure:');
    expect(text).toContain(daxCode);
  });

  it('ensures every template contains valid metadata and Power BI tips', () => {
    for (const item of DAX_CATALOG) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.templateDax).toContain('=');
      expect(item.parameters.length).toBeGreaterThan(0);
      expect(item.powerBiTips.recommendedVisual).toBeTruthy();
      expect(item.powerBiTips.performanceNote).toBeTruthy();
    }
  });
});

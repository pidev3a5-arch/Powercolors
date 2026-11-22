import { describe, it, expect } from 'vitest';
import {
  snapToGrid,
  clampCoordinates,
  DEFAULT_LAYOUT_STATE,
  VISUAL_TYPES_CATALOG,
  RESOLUTION_PRESETS,
  LayoutVisualItem,
} from '../core/layoutTypes';
import {
  generateCoordinatesMarkdownTable,
  generateCoordinatesCsv,
  generatePbirPositionsJson,
  exportLayoutStateToJson,
  importLayoutStateFromJson,
} from '../core/layoutExport';
import { CURATED_LAYOUT_PRESETS } from '../core/layoutPresets';

describe('Report Layout Planner Core & Calculation Engine', () => {
  it('correctly snaps coordinates to grid intervals', () => {
    expect(snapToGrid(17, 8, true)).toBe(16);
    expect(snapToGrid(21, 8, true)).toBe(24);
    expect(snapToGrid(24, 8, true)).toBe(24);
    expect(snapToGrid(17, 8, false)).toBe(17);
    expect(snapToGrid(35, 10, true)).toBe(40);
  });

  it('clamps coordinates to stay within canvas boundaries', () => {
    // Canvas 1280x720
    const outRight = clampCoordinates(1200, 100, 200, 100, 1280, 720);
    expect(outRight.x).toBe(1080); // 1280 - 200
    expect(outRight.width).toBe(200);

    const outBottom = clampCoordinates(100, 700, 200, 100, 1280, 720);
    expect(outBottom.y).toBe(620); // 720 - 100

    const negativeCoords = clampCoordinates(-50, -30, 200, 100, 1280, 720);
    expect(negativeCoords.x).toBe(0);
    expect(negativeCoords.y).toBe(0);

    // Min dimensions enforcement
    const tooSmall = clampCoordinates(10, 10, 10, 10, 1280, 720);
    expect(tooSmall.width).toBe(40);
    expect(tooSmall.height).toBe(30);
  });

  it('contains comprehensive visual catalog definitions', () => {
    expect(VISUAL_TYPES_CATALOG.length).toBeGreaterThanOrEqual(15);
    const types = VISUAL_TYPES_CATALOG.map((v) => v.type);
    expect(types).toContain('card');
    expect(types).toContain('kpi');
    expect(types).toContain('bar-chart');
    expect(types).toContain('line-chart');
    expect(types).toContain('matrix');
    expect(types).toContain('slicer');
  });

  it('provides standard resolution presets with correct aspect ratios', () => {
    const p1280 = RESOLUTION_PRESETS.find((r) => r.preset === '1280x720');
    expect(p1280).toBeDefined();
    expect(p1280?.width).toBe(1280);
    expect(p1280?.height).toBe(720);

    const mobile = RESOLUTION_PRESETS.find((r) => r.preset === '390x844');
    expect(mobile).toBeDefined();
    expect(mobile?.width).toBe(390);
    expect(mobile?.height).toBe(844);
  });

  it('generates formatted Markdown coordinates table', () => {
    const testVisuals: LayoutVisualItem[] = [
      { id: 'v1', name: 'Revenue BAN', type: 'kpi', x: 24, y: 32, width: 280, height: 120, zIndex: 1 },
      { id: 'v2', name: 'Sales Trend', type: 'line-chart', x: 24, y: 168, width: 800, height: 300, zIndex: 2 },
    ];
    const md = generateCoordinatesMarkdownTable(testVisuals, { width: 1280, height: 720, preset: '1280x720' });

    expect(md).toContain('| # | Visual Name | Visual Type | Horizontal (X) | Vertical (Y) | Width (px) | Height (px) | Z-Order |');
    expect(md).toContain('| 1 | Revenue BAN | kpi | 24 px | 32 px | 280 px | 120 px | 1 |');
    expect(md).toContain('| 2 | Sales Trend | line-chart | 24 px | 168 px | 800 px | 300 px | 2 |');
    expect(md).toContain('General → Properties → Size & Position');
  });

  it('generates well-formed CSV coordinate records', () => {
    const testVisuals: LayoutVisualItem[] = [
      { id: 'v1', name: 'Sales, Target & Gap', type: 'bar-chart', x: 40, y: 50, width: 500, height: 300, zIndex: 1 },
    ];
    const csv = generateCoordinatesCsv(testVisuals, { width: 1280, height: 720, preset: '1280x720' });

    expect(csv).toContain('Index,Name,Type,Horizontal_X,Vertical_Y,Width,Height,Z_Order');
    expect(csv).toContain('1,"Sales, Target & Gap",bar-chart,40,50,500,300,1');
  });

  it('generates PBIR visual position JSON objects', () => {
    const testVisuals: LayoutVisualItem[] = [
      { id: 'v1', name: 'Total Profit', type: 'card', x: 100, y: 200, width: 300, height: 150, zIndex: 1 },
    ];
    const pbirJson = generatePbirPositionsJson(testVisuals);
    const parsed = JSON.parse(pbirJson);

    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('Total Profit');
    expect(parsed[0].position.x).toBe(100);
    expect(parsed[0].position.y).toBe(200);
    expect(parsed[0].position.width).toBe(300);
    expect(parsed[0].position.height).toBe(150);
  });

  it('handles lossless JSON state export and import', () => {
    const json = exportLayoutStateToJson(DEFAULT_LAYOUT_STATE);
    expect(json).toContain('"app": "PowerLab Report Layout Planner"');

    const imported = importLayoutStateFromJson(json);
    expect(imported.name).toBe(DEFAULT_LAYOUT_STATE.name);
    expect(imported.dimensions.width).toBe(1280);
    expect(imported.visuals.length).toBe(DEFAULT_LAYOUT_STATE.visuals.length);
    expect(imported.visuals[0].name).toBe(DEFAULT_LAYOUT_STATE.visuals[0].name);
  });

  it('validates all curated layout presets have visuals within canvas bounds', () => {
    CURATED_LAYOUT_PRESETS.forEach((preset) => {
      expect(preset.visuals.length).toBeGreaterThan(0);
      preset.visuals.forEach((vis) => {
        expect(vis.x).toBeGreaterThanOrEqual(0);
        expect(vis.y).toBeGreaterThanOrEqual(0);
        expect(vis.x + vis.width).toBeLessThanOrEqual(preset.dimensions.width);
        expect(vis.y + vis.height).toBeLessThanOrEqual(preset.dimensions.height);
      });
    });
  });
});

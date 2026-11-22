import { describe, it, expect } from 'vitest';
import { adaptLayoutPresetToCanvas } from '../core/adaptLayoutPreset';
import { CURATED_LAYOUT_PRESETS } from '../core/layoutPresets';
import { DashCanvasState, DEFAULT_DASH_CANVAS_STATE } from '../core/dashTypes';

describe('Layout Preset Adaptation to Nav Bar & Page Header', () => {
  it('places all cards completely to the right of left navigation bar', () => {
    const heroPreset = CURATED_LAYOUT_PRESETS.find((p) => p.id === 'hero-storyline')!;
    expect(heroPreset).toBeDefined();

    const stateWithLeftNav: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      dimensions: { width: 1920, height: 1080, preset: '1920x1080' },
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        show: true,
        orientation: 'left',
        size: 240,
        backgroundColor: '#0F172A',
        reportTitle: 'Report Menu',
      },
      pageTitles: [],
    };

    const adaptedContainers = adaptLayoutPresetToCanvas(heroPreset, stateWithLeftNav);

    expect(adaptedContainers.length).toBeGreaterThan(0);
    // Every single container must start to the right of navBar.size (240px)
    for (const c of adaptedContainers) {
      expect(c.x).toBeGreaterThanOrEqual(240);
      expect(c.x + c.width).toBeLessThanOrEqual(1920);
    }
  });

  it('places all cards completely below page header title when present', () => {
    const heroPreset = CURATED_LAYOUT_PRESETS.find((p) => p.id === 'hero-storyline')!;

    const stateWithHeaderAndLeftNav: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      dimensions: { width: 1920, height: 1080, preset: '1920x1080' },
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        show: true,
        orientation: 'left',
        size: 225,
        backgroundColor: '#0F172A',
        reportTitle: 'Report Menu',
      },
      pageTitles: [
        {
          id: 'title-1',
          title: 'Executive Sales Overview',
          subtitle: 'Live Fabric Data',
          position: 'top-left',
          titleSize: 22,
          subtitleSize: 13,
          titleColor: '#1E293B',
          subtitleColor: '#64748B',
        },
      ],
    };

    const adaptedContainers = adaptLayoutPresetToCanvas(heroPreset, stateWithHeaderAndLeftNav);

    // Every container must be to the right of the navbar and below the header title
    for (const c of adaptedContainers) {
      expect(c.x).toBeGreaterThanOrEqual(225);
      expect(c.y).toBeGreaterThanOrEqual(80); // Below the 72px header + padding
      expect(c.y + c.height).toBeLessThanOrEqual(1080);
    }

    // The redundant "Market Overview Header" shape-text card should be omitted
    const hasRedundantHeader = adaptedContainers.some((c) => c.title === 'Market Overview Header');
    expect(hasRedundantHeader).toBe(false);

    // The main hero chart should be the top-most card
    const heroChart = adaptedContainers.find((c) => c.title === 'Primary Revenue Run-Rate Trend');
    expect(heroChart).toBeDefined();
    if (heroChart) {
      expect(heroChart.width).toBeGreaterThan(1500); // Expands to fill available 1600+ width
    }
  });

  it('respects top navigation bar orientation', () => {
    const scorecardPreset = CURATED_LAYOUT_PRESETS.find((p) => p.id === 'executive-scorecard')!;

    const stateWithTopNav: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      dimensions: { width: 1280, height: 720, preset: '1280x720' },
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        show: true,
        orientation: 'top',
        size: 70,
        backgroundColor: '#0F172A',
        reportTitle: 'Report Menu',
      },
      pageTitles: [],
    };

    const adaptedContainers = adaptLayoutPresetToCanvas(scorecardPreset, stateWithTopNav);

    for (const c of adaptedContainers) {
      expect(c.y).toBeGreaterThanOrEqual(70); // Below 70px top ribbon
      expect(c.y + c.height).toBeLessThanOrEqual(720);
    }
  });
});

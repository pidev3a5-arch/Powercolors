import { describe, it, expect } from 'vitest';
import { generateDashSvg, escapeXml } from '../core/dashSvgExport';
import { DashCanvasState, DEFAULT_DASH_CANVAS_STATE } from '../core/dashTypes';
import { generateLayoutContainers, autoArrangeContainers } from '../core/dashLayoutPresets';
import { READY_DESIGN_PRESETS } from '../core/dashDesignPresets';

describe('Dash SVG Canvas Export & Layout Engine', () => {
  it('escapes XML special characters properly', () => {
    expect(escapeXml('Sales & Operations')).toBe('Sales &amp; Operations');
    expect(escapeXml('<script>alert("test")</script>')).toBe(
      '&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;'
    );
    expect(escapeXml("User's Report")).toBe('User&apos;s Report');
  });

  it('generates well-formed SVG with matching dimensions and viewBox', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      dimensions: {
        width: 1280,
        height: 720,
        preset: '1280x720',
      },
    };
    state.containers = generateLayoutContainers(
      state.layoutPreset,
      state.dimensions.width,
      state.dimensions.height,
      state.navBar
    );

    const svg = generateDashSvg(state);

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 1280 720"');
    expect(svg).toContain('width="1280"');
    expect(svg).toContain('height="720"');
    expect(svg).toContain('</svg>');
    expect(svg).toContain(state.backgroundColor);
  });

  it('generates 1920x1080 Full HD canvas properly', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      dimensions: {
        width: 1920,
        height: 1080,
        preset: '1920x1080',
      },
    };
    state.containers = generateLayoutContainers(
      state.layoutPreset,
      state.dimensions.width,
      state.dimensions.height,
      state.navBar
    );

    const svg = generateDashSvg(state);
    expect(svg).toContain('viewBox="0 0 1920 1080"');
    expect(svg).toContain('width="1920"');
    expect(svg).toContain('height="1080"');
  });

  it('renders Left sidebar with MENU and GENERAL dual sections', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        show: true,
        orientation: 'left',
        size: 240,
        backgroundColor: '#0F172A',
        textColor: '#FFFFFF',
        accentColor: '#8B5CF6',
        reportTitle: 'Financial Overview',
        logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        buttons: [
          { id: 'btn-1', label: 'Summary', icon: 'home', isActive: true, section: 'menu' },
          { id: 'btn-2', label: 'Revenue', icon: 'dollar-sign', isActive: false, section: 'menu' },
          { id: 'btn-gen-1', label: 'Settings', icon: 'settings', isActive: false, section: 'general' },
          { id: 'btn-gen-2', label: 'Help', icon: 'help-circle', isActive: false, section: 'general' },
        ],
      },
    };
    state.containers = generateLayoutContainers(
      state.layoutPreset,
      state.dimensions.width,
      state.dimensions.height,
      state.navBar
    );

    const svg = generateDashSvg(state);

    expect(svg).toContain('<rect x="0" y="0" width="240" height="720" fill="#0F172A" />');
    expect(svg).toContain('Financial Overview');
    expect(svg).toContain('MENU');
    expect(svg).toContain('GENERAL');
    expect(svg).toContain('Summary');
    expect(svg).toContain('Settings');
    expect(svg).toContain('Help');
  });

  it('renders Top header navigation bar horizontally', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        show: true,
        orientation: 'top',
        size: 80,
        backgroundColor: '#1E293B',
        textColor: '#FFFFFF',
        accentColor: '#F472B6',
        reportTitle: 'Sales Performance',
        logoUrl: null,
        buttons: [
          { id: 'btn-1', label: 'Dash', icon: 'layout-grid', isActive: true, section: 'menu' },
          { id: 'btn-2', label: 'Trends', icon: 'trending-up', isActive: false, section: 'menu' },
          { id: 'btn-gen-1', label: 'Settings', icon: 'settings', isActive: false, section: 'general' },
        ],
      },
    };
    state.containers = generateLayoutContainers(
      state.layoutPreset,
      state.dimensions.width,
      state.dimensions.height,
      state.navBar
    );

    const svg = generateDashSvg(state);

    expect(svg).toContain('<rect x="0" y="0" width="1280" height="80" fill="#1E293B" />');
    expect(svg).toContain('Sales Performance');
    expect(svg).toContain('Dash');
    expect(svg).toContain('Settings');
  });

  it('renders custom Page Titles and Subtitles in designated positions', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      pageTitles: [
        {
          id: 'title-1',
          title: 'Top Right Executive Stamp',
          subtitle: 'Live API Telemetry',
          position: 'top-right',
          titleColor: '#0F172A',
        },
        {
          id: 'title-2',
          title: 'Confidential Internal',
          subtitle: 'Do not distribute',
          position: 'bottom-left',
          titleColor: '#DC2626',
        },
      ],
    };
    state.containers = generateLayoutContainers(
      state.layoutPreset,
      state.dimensions.width,
      state.dimensions.height,
      state.navBar,
      state.pageTitles
    );

    const svg = generateDashSvg(state);
    expect(svg).toContain('Top Right Executive Stamp');
    expect(svg).toContain('Live API Telemetry');
    expect(svg).toContain('Confidential Internal');
    expect(svg).toContain('Do not distribute');

    // Verify SVG order: Page Titles must be rendered AFTER Visual Container Slots
    // so card rects never occlude page titles
    const slotsIndex = svg.indexOf('<!-- Visual Container Slots -->');
    const titlesIndex = svg.indexOf('<!-- Page Titles -->');
    expect(slotsIndex).toBeGreaterThan(-1);
    expect(titlesIndex).toBeGreaterThan(-1);
    expect(titlesIndex).toBeGreaterThan(slotsIndex);

    // Verify top containers start below the top header title area (y >= 70)
    for (const c of state.containers) {
      expect(c.y).toBeGreaterThanOrEqual(70);
    }
  });

  it('renders DEFAULT_DASH_CANVAS_STATE with visible default page header titles', () => {
    const initial = { ...DEFAULT_DASH_CANVAS_STATE };
    initial.containers = generateLayoutContainers(
      initial.layoutPreset,
      initial.dimensions.width,
      initial.dimensions.height,
      initial.navBar,
      initial.pageTitles
    );

    const svg = generateDashSvg(initial);
    expect(svg).toContain('Executive Sales Overview');
    expect(svg).toContain('Live Fabric Data • Real-Time KPIs');

    const slotsIndex = svg.indexOf('<!-- Visual Container Slots -->');
    const titlesIndex = svg.indexOf('<!-- Page Titles -->');
    expect(titlesIndex).toBeGreaterThan(slotsIndex);
  });

  it('supports 4 new layout presets correctly', () => {
    const presets = ['kpi-ribbon-grid', 'left-focus-split', 'top-storyline', 'multi-tier-matrix'] as const;

    for (const preset of presets) {
      const containers = generateLayoutContainers(
        preset,
        1280,
        720,
        DEFAULT_DASH_CANVAS_STATE.navBar
      );
      expect(containers.length).toBeGreaterThan(0);
      // Ensure all containers are within bounds
      for (const c of containers) {
        expect(c.x).toBeGreaterThanOrEqual(DEFAULT_DASH_CANVAS_STATE.navBar.size);
        expect(c.x + c.width).toBeLessThanOrEqual(1280);
        expect(c.y + c.height).toBeLessThanOrEqual(720);
      }
    }
  });

  it('applies ready-made complete design presets cleanly', () => {
    const initial = { ...DEFAULT_DASH_CANVAS_STATE };
    for (const preset of READY_DESIGN_PRESETS) {
      const updated = preset.apply(initial);
      expect(updated.backgroundColor).toBe(preset.backgroundColor);
      expect(updated.navBar.backgroundColor).toBe(preset.navColor);
      expect(updated.containerStyle.backgroundColor).toBe(preset.cardColor);
    }
  });

  it('auto-arranges containers without overlap', () => {
    const rawContainers = [
      { id: '1', title: 'A', subtitle: '', showTitle: true, showSubtitle: false, x: 0, y: 0, width: 100, height: 100 },
      { id: '2', title: 'B', subtitle: '', showTitle: true, showSubtitle: false, x: 0, y: 0, width: 100, height: 100 },
      { id: '3', title: 'C', subtitle: '', showTitle: true, showSubtitle: false, x: 0, y: 0, width: 100, height: 100 },
      { id: '4', title: 'D', subtitle: '', showTitle: true, showSubtitle: false, x: 0, y: 0, width: 100, height: 100 },
    ];

    const arranged = autoArrangeContainers(rawContainers, 1280, 720, DEFAULT_DASH_CANVAS_STATE.navBar);
    expect(arranged.length).toBe(4);
    // Each container should have a unique non-zero position
    expect(arranged[1].x).toBeGreaterThan(arranged[0].x);
    expect(arranged[2].y).toBeGreaterThan(arranged[0].y);
  });
});

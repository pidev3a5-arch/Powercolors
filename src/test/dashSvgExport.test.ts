import { describe, it, expect } from 'vitest';
import { generateDashSvg, escapeXml } from '../core/dashSvgExport';
import { DashCanvasState, DEFAULT_DASH_CANVAS_STATE } from '../core/dashTypes';
import { generateLayoutContainers } from '../core/dashLayoutPresets';

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

  it('renders Left sidebar navigation bar with custom size, title, and buttons', () => {
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
          { id: 'btn-1', label: 'Summary', icon: 'home', isActive: true },
          { id: 'btn-2', label: 'Revenue', icon: 'dollar-sign', isActive: false },
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
    expect(svg).toContain('Summary');
    expect(svg).toContain('Revenue');
    expect(svg).toContain('<image x="18" y="20" width="34" height="34"');
    // Active button pill
    expect(svg).toContain('<rect x="14" y="88" width="212" height="38" rx="8" fill="#8B5CF6" />');
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
          { id: 'btn-1', label: 'Dash', icon: 'layout-grid', isActive: true },
          { id: 'btn-2', label: 'Trends', icon: 'trending-up', isActive: false },
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
    expect(svg).toContain('Trends');
  });

  it('renders visual containers with titles and subtitles', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      containers: [
        {
          id: 'card-1',
          title: 'Total Gross Profit',
          subtitle: 'Q3 Comparison',
          showTitle: true,
          showSubtitle: true,
          x: 230,
          y: 20,
          width: 300,
          height: 150,
        },
      ],
    };

    const svg = generateDashSvg(state);

    expect(svg).toContain('Total Gross Profit');
    expect(svg).toContain('Q3 Comparison');
    expect(svg).toContain('<rect x="230" y="20" width="300" height="150"');
  });

  it('respects hidden titles and subtitles', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      containers: [
        {
          id: 'card-silent',
          title: 'Hidden Header Title',
          subtitle: 'Hidden Subtitle',
          showTitle: false,
          showSubtitle: false,
          x: 230,
          y: 20,
          width: 300,
          height: 150,
        },
      ],
    };

    const svg = generateDashSvg(state);

    expect(svg).not.toContain('Hidden Header Title');
    expect(svg).not.toContain('Hidden Subtitle');
  });
});

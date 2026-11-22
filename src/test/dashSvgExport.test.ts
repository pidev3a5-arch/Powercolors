import { describe, it, expect } from 'vitest';
import { generateDashSvg, escapeXml, getDefaultSvgFilename } from '../core/dashSvgExport';
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

  it('renders DEFAULT_DASH_CANVAS_STATE with visible default page header titles in top-left', () => {
    const initial = { ...DEFAULT_DASH_CANVAS_STATE };
    expect(initial.pageTitles[0].position).toBe('top-left');

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

  it('supports 1024x768 and 1440x900 aspect ratio presets cleanly', () => {
    const presets = [
      { width: 1024, height: 768, preset: '1024x768' as const },
      { width: 1440, height: 900, preset: '1440x900' as const },
    ];

    for (const p of presets) {
      const state: DashCanvasState = {
        ...DEFAULT_DASH_CANVAS_STATE,
        dimensions: p,
      };
      state.containers = generateLayoutContainers(
        state.layoutPreset,
        p.width,
        p.height,
        state.navBar,
        state.pageTitles
      );
      const svg = generateDashSvg(state);
      expect(svg).toContain(`viewBox="0 0 ${p.width} ${p.height}"`);
      expect(svg).toContain(`width="${p.width}"`);
      expect(svg).toContain(`height="${p.height}"`);
    }
  });

  it('renders custom slot divider, title size/color, and subtitle size/color', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      containers: [
        {
          id: 'slot-1',
          title: 'Custom Title',
          subtitle: 'Custom Subtitle',
          showTitle: true,
          showSubtitle: true,
          x: 250,
          y: 100,
          width: 300,
          height: 200,
          titleSize: 19,
          titleColor: '#E11D48',
          subtitleSize: 13,
          subtitleColor: '#4F46E5',
          showDivider: true,
          dividerColor: '#F59E0B',
          dividerThickness: 3,
        },
      ],
    };

    const svg = generateDashSvg(state);
    expect(svg).toContain('font-size="19"');
    expect(svg).toContain('fill="#E11D48"');
    expect(svg).toContain('font-size="13"');
    expect(svg).toContain('fill="#4F46E5"');
    expect(svg).toContain('stroke="#F59E0B"');
    expect(svg).toContain('stroke-width="3"');
  });

  it('supports hiding slot divider when showDivider is false', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      containers: [
        {
          id: 'slot-no-div',
          title: 'No Divider Slot',
          subtitle: 'Clean look',
          showTitle: true,
          showSubtitle: true,
          x: 250,
          y: 100,
          width: 300,
          height: 200,
          showDivider: false,
        },
      ],
    };

    const svg = generateDashSvg(state);
    expect(svg).not.toContain('stroke-dasharray="4 2"');
  });

  it('renders custom reportTitleSize and respects showButtonIcons toggle', () => {
    const stateWithIconsOff: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        reportTitle: 'Custom Sized Brand',
        reportTitleSize: 21,
        showButtonIcons: false,
      },
    };

    const svg = generateDashSvg(stateWithIconsOff);
    expect(svg).toContain('Custom Sized Brand');
    expect(svg).toContain('font-size="21"');
    // When icons are disabled on left nav, label starts at x="24" without svg icon group
    expect(svg).toContain('x="24"');
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

  it('applies ready-made complete design presets with Blank Canvas first and 3 new left-nav themes', () => {
    expect(READY_DESIGN_PRESETS.length).toBe(9);

    // Requirement 4: Blank Canvas is the first preset
    expect(READY_DESIGN_PRESETS[0].id).toBe('blank-page');
    expect(READY_DESIGN_PRESETS[0].slotCount).toBe(0);

    // Requirement 4: emerald-growth and pure-no-nav removed
    expect(READY_DESIGN_PRESETS.find((p) => p.id === 'emerald-growth')).toBeUndefined();
    expect(READY_DESIGN_PRESETS.find((p) => p.id === 'pure-no-nav')).toBeUndefined();

    // Ready design presets check
    const citronPreset = READY_DESIGN_PRESETS.find((p) => p.id === 'citron-obsidian');
    const pastelPreset = READY_DESIGN_PRESETS.find((p) => p.id === 'pastel-horizon');
    const cobaltPreset = READY_DESIGN_PRESETS.find((p) => p.id === 'cobalt-sapphire');
    const rachPreset = READY_DESIGN_PRESETS.find((p) => p.id === 'rach-dash');
    const cyberPreset = READY_DESIGN_PRESETS.find((p) => p.id === 'cyber-crimson');
    const nordicPreset = READY_DESIGN_PRESETS.find((p) => p.id === 'nordic-frost');

    expect(citronPreset).toBeDefined();
    expect(citronPreset?.navType).toBe('left');
    expect(pastelPreset).toBeDefined();
    expect(pastelPreset?.navType).toBe('left');
    expect(cobaltPreset).toBeDefined();
    expect(cobaltPreset?.navType).toBe('left');
    expect(rachPreset).toBeDefined();
    expect(rachPreset?.name).toBe('Rach Dash');
    expect(rachPreset?.defaultResolution).toBe('1920x1080');
    expect(cyberPreset?.defaultResolution).toBe('1920x1080');
    expect(nordicPreset?.defaultResolution).toBe('1920x1080');
    expect(READY_DESIGN_PRESETS.find((p) => p.id === 'modern-midnight')).toBeUndefined();

    expect(DEFAULT_DASH_CANVAS_STATE.containerStyle.showDropShadow).toBe(false);

    const initial = { ...DEFAULT_DASH_CANVAS_STATE };
    for (const preset of READY_DESIGN_PRESETS) {
      const updated = preset.apply(initial);
      expect(updated.backgroundColor).toBe(preset.backgroundColor);
      expect(updated.layoutPreset).toBe(preset.layoutPreset);
      expect(updated.typography.fontFamily).toBe(preset.fontFamily);
      expect(updated.containerStyle.showDropShadow).toBe(false);
      // Requirement: reportTitle must be "Report Title" for all ready designs
      expect(updated.navBar.reportTitle).toBe('Report Title');
      if (preset.id === 'blank-page') {
        expect(updated.containers).toEqual([]);
        expect(updated.navBar.show).toBe(false);
      } else {
        // Requirement 3: Every ready design must always have a header title at top-left
        expect(updated.pageTitles.length).toBeGreaterThan(0);
        expect(updated.pageTitles[0].position).toBe('top-left');

        // Requirement 3: Selection 1 must have settings icon instead of filter
        const selectionBtn = updated.navBar.buttons.find(
          (b) => b.label.includes('Selection #1') || b.label.includes('Selection 1')
        );
        if (selectionBtn) {
          expect(selectionBtn.icon).toBe('settings');
        }
      }

      if (['rach-dash', 'cyber-crimson', 'nordic-frost'].includes(preset.id)) {
        // Requirement 2 & 4: 1920x1080 Full HD aspect ratio
        expect(updated.dimensions.width).toBe(1920);
        expect(updated.dimensions.height).toBe(1080);
        expect(updated.dimensions.preset).toBe('1920x1080');
      }
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

  it('formats SVG download filename with exactly ONE underscore between Report Title and Page Header Title', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        reportTitle: 'Sales Performance',
      },
      pageTitles: [
        {
          id: 'title-1',
          title: 'Q4 Summary',
          subtitle: 'Global Metrics',
          position: 'top-left',
          titleSize: 22,
          subtitleSize: 13,
          titleColor: '#0F172A',
          subtitleColor: '#64748B',
        },
      ],
    };

    const defaultFilename = getDefaultSvgFilename(state);
    expect(defaultFilename).toBe('Sales Performance_Q4 Summary.svg');
    // Verify only ONE underscore exists in the entire filename
    const underscoreCount = (defaultFilename.match(/_/g) || []).length;
    expect(underscoreCount).toBe(1);

    // Test with title containing internal underscores and special chars
    const stateWithUnderscores: DashCanvasState = {
      ...state,
      navBar: {
        ...state.navBar,
        reportTitle: 'Sales_Performance : Q1',
      },
      pageTitles: [
        {
          ...state.pageTitles[0],
          title: 'Regional_Summary / Global*',
        },
      ],
    };
    const cleanedFilename = getDefaultSvgFilename(stateWithUnderscores);
    expect(cleanedFilename).toBe('Sales Performance Q1_Regional Summary Global.svg');
    const cleanedCount = (cleanedFilename.match(/_/g) || []).length;
    expect(cleanedCount).toBe(1);
  });

  it('renders KPI card icon badges with custom color, background, and icon type in SVG', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      containers: [
        {
          id: 'kpi-rev',
          title: 'Total Revenue',
          subtitle: 'Annualized',
          showTitle: true,
          showSubtitle: true,
          x: 230,
          y: 80,
          width: 240,
          height: 120,
          showKpiIcon: true,
          kpiIconType: 'dollar',
          kpiIconPosition: 'top-right',
          kpiIconBgColor: '#2563EB',
          kpiIconColor: '#FFFFFF',
        },
        {
          id: 'kpi-growth',
          title: 'YoY Growth',
          subtitle: '+18.6%',
          showTitle: true,
          showSubtitle: true,
          x: 490,
          y: 80,
          width: 240,
          height: 120,
          showKpiIcon: true,
          kpiIconType: 'trending-up',
          kpiIconPosition: 'top-right',
          kpiIconBgColor: '#16A34A',
          kpiIconColor: '#FFFFFF',
        },
        {
          id: 'kpi-users',
          title: 'Active Customers',
          subtitle: '142,850',
          showTitle: true,
          showSubtitle: true,
          x: 750,
          y: 80,
          width: 240,
          height: 120,
          showKpiIcon: true,
          kpiIconType: 'users',
          kpiIconPosition: 'top-right',
          kpiIconBgColor: '#DB2777',
          kpiIconColor: '#FFFFFF',
        },
      ],
    };

    const svg = generateDashSvg(state);
    expect(svg).toContain('<!-- KPI Icon Badge (dollar at top-right) -->');
    expect(svg).toContain('fill="#2563EB"');
    expect(svg).toContain('fill-opacity="0.5"');
    // Ensure black border is removed from badge circle
    expect(svg).toContain('<circle cx="448" cy="102" r="13.5" fill="#2563EB" fill-opacity="0.5" />');
    expect(svg).toContain('>$</text>');

    expect(svg).toContain('<!-- KPI Icon Badge (trending-up at top-right) -->');
    expect(svg).toContain('fill="#16A34A"');

    expect(svg).toContain('<!-- KPI Icon Badge (users at top-right) -->');
    expect(svg).toContain('fill="#DB2777"');
  });

  it('offsets title and subtitle horizontally when KPI icon is placed in top-left', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      containers: [
        {
          id: 'kpi-top-left',
          title: 'Left Metric',
          subtitle: 'Subtitle Info',
          showTitle: true,
          showSubtitle: true,
          x: 100,
          y: 50,
          width: 300,
          height: 140,
          showKpiIcon: true,
          kpiIconType: 'dollar',
          kpiIconPosition: 'top-left',
          kpiIconBgColor: '#2563EB',
          kpiIconColor: '#FFFFFF',
        },
        {
          id: 'kpi-top-right',
          title: 'Right Metric',
          subtitle: 'Subtitle Info',
          showTitle: true,
          showSubtitle: true,
          x: 450,
          y: 50,
          width: 300,
          height: 140,
          showKpiIcon: true,
          kpiIconType: 'dollar',
          kpiIconPosition: 'top-right',
          kpiIconBgColor: '#2563EB',
          kpiIconColor: '#FFFFFF',
        },
      ],
    };

    const svg = generateDashSvg(state);
    // When icon is in top-left: titleX is 100 + 46 = 146 to avoid overlap with badge
    expect(svg).toContain('<text x="146" y="74"');
    expect(svg).toContain('Left Metric</text>');

    // When icon is in top-right: titleX is 450 + 16 = 466 (standard offset)
    expect(svg).toContain('<text x="466" y="74"');
    expect(svg).toContain('Right Metric</text>');
  });

  it('triggers download via powerlab:download-dash-svg event only on demand', () => {
    const target = typeof window !== 'undefined' ? window : new EventTarget();
    let eventReceived = 0;
    const listener = () => {
      eventReceived++;
    };

    target.addEventListener('powerlab:download-dash-svg', listener);

    // Initial state: no event fired
    expect(eventReceived).toBe(0);

    // Dispatched only when button clicked
    target.dispatchEvent(new CustomEvent('powerlab:download-dash-svg'));
    expect(eventReceived).toBe(1);

    target.removeEventListener('powerlab:download-dash-svg', listener);
  });

  it('renders primary report navigation buttons with custom font-size, bold and italic styles', () => {
    const customState: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        buttonFontSize: 14,
        buttonFontBold: false, // Normal weight (400)
        buttonFontItalic: true, // Italic style
        buttons: [
          { id: 'btn-1', label: 'Executive', icon: 'home', isActive: false, section: 'menu' },
          { id: 'btn-2', label: 'Financials', icon: 'bar-chart', isActive: true, section: 'menu', bold: true }, // Override bold
        ],
      },
    };

    const svg = generateDashSvg(customState);
    // Button 1: 14px, normal weight 400, italic
    expect(svg).toContain('font-size="14" font-weight="400" font-style="italic"');
    expect(svg).toContain('>Executive</text>');

    // Button 2: 14px, overridden bold (700 when active), italic
    expect(svg).toContain('font-size="14" font-weight="700" font-style="italic"');
    expect(svg).toContain('>Financials</text>');
  });

  it('triggers copy via powerlab:copy-dash-svg event only on demand', () => {
    const target = typeof window !== 'undefined' ? window : new EventTarget();
    let eventReceived = 0;
    const listener = () => {
      eventReceived++;
    };

    target.addEventListener('powerlab:copy-dash-svg', listener);

    expect(eventReceived).toBe(0);
    target.dispatchEvent(new CustomEvent('powerlab:copy-dash-svg'));
    expect(eventReceived).toBe(1);

    target.removeEventListener('powerlab:copy-dash-svg', listener);
  });

  it('renders Left sidebar as compact icon-only rail when showButtonLabels and showReportTitle are false', () => {
    const compactState: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        orientation: 'left',
        size: 68,
        showReportTitle: false,
        showButtonLabels: false,
        showButtonIcons: true,
        reportTitle: 'Executive Sales',
        buttons: [
          { id: 'btn-1', label: 'Overview', icon: 'home', isActive: true, section: 'menu' },
          { id: 'btn-2', label: 'Reports', icon: 'bar-chart', isActive: false, section: 'menu' },
          { id: 'btn-gen-1', label: 'Settings', icon: 'settings', isActive: false, section: 'general' },
        ],
      },
    };

    const svg = generateDashSvg(compactState);
    expect(svg).toContain('<rect x="0" y="0" width="68" height="720"');
    // Report title text should NOT be rendered
    expect(svg).not.toContain('Executive Sales</text>');
    // Button labels should NOT be rendered as text elements
    expect(svg).not.toContain('>Overview</text>');
    expect(svg).not.toContain('>Reports</text>');
    expect(svg).not.toContain('>Settings</text>');
    // Section headers "MENU" and "GENERAL" should NOT be rendered in compact rail
    expect(svg).not.toContain('>MENU</text>');
    expect(svg).not.toContain('>GENERAL</text>');
    // But SVG vector paths for icons ARE rendered
    expect(svg).toContain('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z');
  });

  it('renders independently when showReportTitle is false and showButtonLabels is true', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        orientation: 'left',
        size: 210,
        showReportTitle: false,
        showButtonLabels: true,
        reportTitle: 'Hidden Report Title',
        buttons: [
          { id: 'btn-1', label: 'Overview', icon: 'home', isActive: true, section: 'menu' },
        ],
      },
    };

    const svg = generateDashSvg(state);
    // Report title text should NOT be rendered
    expect(svg).not.toContain('Hidden Report Title</text>');
    // Button label SHOULD be rendered
    expect(svg).toContain('>Overview</text>');
  });

  it('renders independently when showReportTitle is true and showButtonLabels is false', () => {
    const state: DashCanvasState = {
      ...DEFAULT_DASH_CANVAS_STATE,
      navBar: {
        ...DEFAULT_DASH_CANVAS_STATE.navBar,
        orientation: 'left',
        size: 210,
        showReportTitle: true,
        showButtonLabels: false,
        reportTitle: 'Visible Report Title',
        buttons: [
          { id: 'btn-1', label: 'Overview', icon: 'home', isActive: true, section: 'menu' },
        ],
      },
    };

    const svg = generateDashSvg(state);
    // Report title text SHOULD be rendered
    expect(svg).toContain('Visible Report Title</text>');
    // Button label should NOT be rendered
    expect(svg).not.toContain('>Overview</text>');
  });
});

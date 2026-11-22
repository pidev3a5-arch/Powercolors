import {
  DashCanvasState,
  DEFAULT_DASH_CANVAS_STATE,
  VisualContainerConfig,
  NavBarConfig,
  PageTitleItem,
  CanvasDimension,
  DashCanvasContainerStyle,
  LayoutPresetType,
  DashTypographyConfig,
} from './dashTypes';
import { decodeBase64Utf8 } from './dashSvgExport';

/**
 * Validates and sanitizes an untrusted or partial object into a complete, guaranteed valid DashCanvasState.
 */
export function sanitizeDashCanvasState(obj: unknown): DashCanvasState {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Imported data is not a valid Dash Canvas state object.');
  }

  const raw = obj as Partial<DashCanvasState>;

  // Dimensions
  const width =
    typeof raw.dimensions?.width === 'number' && raw.dimensions.width > 0
      ? Math.round(raw.dimensions.width)
      : DEFAULT_DASH_CANVAS_STATE.dimensions.width;
  const height =
    typeof raw.dimensions?.height === 'number' && raw.dimensions.height > 0
      ? Math.round(raw.dimensions.height)
      : DEFAULT_DASH_CANVAS_STATE.dimensions.height;
  const preset = raw.dimensions?.preset || '1280x720';

  const dimensions: CanvasDimension = { width, height, preset };

  // Background color
  const backgroundColor =
    typeof raw.backgroundColor === 'string' && raw.backgroundColor.trim()
      ? raw.backgroundColor.trim()
      : DEFAULT_DASH_CANVAS_STATE.backgroundColor;

  // NavBar Config
  const defaultNav = DEFAULT_DASH_CANVAS_STATE.navBar;
  const rawNav = (raw.navBar || {}) as Partial<NavBarConfig>;
  const navBar: NavBarConfig = {
    show: rawNav.show !== undefined ? Boolean(rawNav.show) : defaultNav.show,
    orientation: rawNav.orientation === 'top' ? 'top' : 'left',
    size: typeof rawNav.size === 'number' && rawNav.size > 0 ? Math.round(rawNav.size) : defaultNav.size,
    backgroundColor: rawNav.backgroundColor || defaultNav.backgroundColor,
    textColor: rawNav.textColor || defaultNav.textColor,
    accentColor: rawNav.accentColor || defaultNav.accentColor,
    reportTitle: typeof rawNav.reportTitle === 'string' ? rawNav.reportTitle : defaultNav.reportTitle,
    reportTitleSize: rawNav.reportTitleSize || defaultNav.reportTitleSize,
    showButtonIcons: rawNav.showButtonIcons !== undefined ? Boolean(rawNav.showButtonIcons) : defaultNav.showButtonIcons,
    showButtonLabels: rawNav.showButtonLabels !== undefined ? Boolean(rawNav.showButtonLabels) : defaultNav.showButtonLabels,
    showReportTitle: rawNav.showReportTitle !== undefined ? Boolean(rawNav.showReportTitle) : defaultNav.showReportTitle,
    buttonFontSize: rawNav.buttonFontSize || defaultNav.buttonFontSize,
    buttonFontBold: rawNav.buttonFontBold !== undefined ? Boolean(rawNav.buttonFontBold) : defaultNav.buttonFontBold,
    buttonFontItalic: rawNav.buttonFontItalic !== undefined ? Boolean(rawNav.buttonFontItalic) : defaultNav.buttonFontItalic,
    logoUrl: rawNav.logoUrl || null,
    buttons: Array.isArray(rawNav.buttons) && rawNav.buttons.length > 0
      ? rawNav.buttons.map((b, i) => ({
          id: b.id || `btn-${i + 1}`,
          label: b.label || `Tab ${i + 1}`,
          icon: b.icon || 'home',
          isActive: Boolean(b.isActive),
          section: b.section === 'general' ? 'general' : 'menu',
        }))
      : defaultNav.buttons,
  };

  // Container Style
  const defaultStyle = DEFAULT_DASH_CANVAS_STATE.containerStyle;
  const rawStyle = (raw.containerStyle || {}) as Partial<DashCanvasContainerStyle>;
  const containerStyle: DashCanvasContainerStyle = {
    backgroundColor: rawStyle.backgroundColor || defaultStyle.backgroundColor,
    borderColor: rawStyle.borderColor || defaultStyle.borderColor,
    showBorder: rawStyle.showBorder !== undefined ? Boolean(rawStyle.showBorder) : defaultStyle.showBorder,
    borderWidth: typeof rawStyle.borderWidth === 'number' ? rawStyle.borderWidth : defaultStyle.borderWidth,
    cornerRadius: typeof rawStyle.cornerRadius === 'number' ? rawStyle.cornerRadius : defaultStyle.cornerRadius,
    showDropShadow: rawStyle.showDropShadow !== undefined ? Boolean(rawStyle.showDropShadow) : defaultStyle.showDropShadow,
    shadowColor: rawStyle.shadowColor || defaultStyle.shadowColor,
  };

  // Containers (Visual Slots)
  const containers: VisualContainerConfig[] = Array.isArray(raw.containers)
    ? raw.containers.map((c, i) => ({
        id: c.id || `slot-${i + 1}`,
        title: typeof c.title === 'string' ? c.title : `Slot ${i + 1}`,
        subtitle: typeof c.subtitle === 'string' ? c.subtitle : '',
        showTitle: c.showTitle !== undefined ? Boolean(c.showTitle) : true,
        showSubtitle: c.showSubtitle !== undefined ? Boolean(c.showSubtitle) : true,
        titleSize: typeof c.titleSize === 'number' ? c.titleSize : undefined,
        titleColor: typeof c.titleColor === 'string' ? c.titleColor : undefined,
        subtitleSize: typeof c.subtitleSize === 'number' ? c.subtitleSize : undefined,
        subtitleColor: typeof c.subtitleColor === 'string' ? c.subtitleColor : undefined,
        x: typeof c.x === 'number' ? Math.round(c.x) : 20,
        y: typeof c.y === 'number' ? Math.round(c.y) : 20,
        width: typeof c.width === 'number' && c.width > 0 ? Math.round(c.width) : 200,
        height: typeof c.height === 'number' && c.height > 0 ? Math.round(c.height) : 150,
        backgroundColor: c.backgroundColor || undefined,
        borderColor: c.borderColor || undefined,
        borderWidth: c.borderWidth || undefined,
        showBorder: c.showBorder !== undefined ? Boolean(c.showBorder) : undefined,
      }))
    : [];

  // Typography
  const defaultTypo = DEFAULT_DASH_CANVAS_STATE.typography;
  const rawTypo = (raw.typography || {}) as Partial<DashTypographyConfig>;
  const typography: DashTypographyConfig = {
    fontFamily: rawTypo.fontFamily || defaultTypo.fontFamily,
    titleSize: typeof rawTypo.titleSize === 'number' ? rawTypo.titleSize : defaultTypo.titleSize,
    titleColor: rawTypo.titleColor || defaultTypo.titleColor,
    subtitleSize: typeof rawTypo.subtitleSize === 'number' ? rawTypo.subtitleSize : defaultTypo.subtitleSize,
    subtitleColor: rawTypo.subtitleColor || defaultTypo.subtitleColor,
  };

  // Page Titles
  const pageTitles: PageTitleItem[] = Array.isArray(raw.pageTitles)
    ? raw.pageTitles.map((pt, i) => ({
        id: pt.id || `title-${i + 1}`,
        title: pt.title || 'Page Header',
        subtitle: pt.subtitle || '',
        position: pt.position || 'top-left',
        titleSize: typeof pt.titleSize === 'number' ? pt.titleSize : 18,
        titleColor: pt.titleColor || typography.titleColor,
        subtitleSize: typeof pt.subtitleSize === 'number' ? pt.subtitleSize : 11.5,
        subtitleColor: pt.subtitleColor || typography.subtitleColor,
      }))
    : [];

  // Layout Preset
  const VALID_PRESETS: LayoutPresetType[] = [
    'executive-overview',
    'grid-2x2',
    'three-column',
    'dense-analytics',
    'single-hero',
    'kpi-ribbon-grid',
    'left-focus-split',
    'top-storyline',
    'multi-tier-matrix',
  ];
  const layoutPreset: LayoutPresetType =
    raw.layoutPreset && VALID_PRESETS.includes(raw.layoutPreset)
      ? raw.layoutPreset
      : 'executive-overview';

  return {
    dimensions,
    backgroundColor,
    navBar,
    containerStyle,
    containers,
    typography,
    pageTitles,
    layoutPreset,
  };
}

/**
 * Fallback parser that reads standard SVG markup elements to reconstruct a DashCanvasState.
 * Used for SVGs generated before state metadata was embedded or external SVG wallpapers.
 */
export function parseSvgMarkupHeuristics(svgString: string): DashCanvasState {
  // Extract width and height from viewBox or width/height attributes
  let width = 1280;
  let height = 720;

  const viewBoxMatch = svgString.match(/viewBox=["']\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);
  if (viewBoxMatch) {
    const vbW = parseFloat(viewBoxMatch[3]);
    const vbH = parseFloat(viewBoxMatch[4]);
    if (vbW > 0 && vbH > 0) {
      width = Math.round(vbW);
      height = Math.round(vbH);
    }
  } else {
    const wMatch = svgString.match(/<svg[^>]*\bwidth=["']([0-9.]+)(?:px)?["']/i);
    const hMatch = svgString.match(/<svg[^>]*\bheight=["']([0-9.]+)(?:px)?["']/i);
    if (wMatch && hMatch) {
      width = Math.round(parseFloat(wMatch[1])) || 1280;
      height = Math.round(parseFloat(hMatch[1])) || 720;
    }
  }

  // Detect background color from first rect matching canvas width/height
  let backgroundColor = '#F8FAFC';
  const bgRegex = new RegExp(`<rect[^>]*\\bwidth=["'](?:100%|${width})["'][^>]*\\bfill=["']([^"']+)["']`, 'i');
  const bgRectMatch = svgString.match(bgRegex);
  if (bgRectMatch && bgRectMatch[1] && bgRectMatch[1] !== 'none') {
    backgroundColor = bgRectMatch[1];
  } else {
    const anyBgMatch = svgString.match(/<rect[^>]*\bwidth=["']([0-9.]+)["'][^>]*\bheight=["']([0-9.]+)["'][^>]*\bfill=["']([^"']+)["']/i);
    if (anyBgMatch && parseFloat(anyBgMatch[1]) >= width * 0.9 && anyBgMatch[3] !== 'none') {
      backgroundColor = anyBgMatch[3];
    }
  }

  // Detect Navigation Bar
  const defaultNav = DEFAULT_DASH_CANVAS_STATE.navBar;
  let navOrientation: 'left' | 'top' = 'left';
  let navSize = 210;
  let navBgColor = defaultNav.backgroundColor;
  let hasNav = false;

  // Check left nav rect
  const navMatch = svgString.match(/<rect[^>]*\bx=["']0["'][^>]*\by=["']0["'][^>]*\bwidth=["']([0-9.]+)["'][^>]*\bheight=["']([0-9.]+)["'][^>]*\bfill=["']([^"']+)["']/i);
  if (navMatch) {
    const rW = parseFloat(navMatch[1]);
    const rH = parseFloat(navMatch[2]);
    const fill = navMatch[3];
    if (rW < width * 0.45 && rH >= height * 0.8) {
      hasNav = true;
      navOrientation = 'left';
      navSize = Math.round(rW);
      navBgColor = fill;
    } else if (rH < height * 0.35 && rW >= width * 0.8) {
      hasNav = true;
      navOrientation = 'top';
      navSize = Math.round(rH);
      navBgColor = fill;
    }
  }

  // Extract visual slots (containers)
  const containers: VisualContainerConfig[] = [];
  let cornerRadius = 12;

  const extractAttributes = (tag: string) => {
    const getAttr = (name: string) => {
      const m = tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'));
      return m ? m[1] : null;
    };
    return {
      id: getAttr('data-slot-id'),
      x: parseFloat(getAttr('x') || '0'),
      y: parseFloat(getAttr('y') || '0'),
      width: parseFloat(getAttr('width') || '0'),
      height: parseFloat(getAttr('height') || '0'),
      rx: parseFloat(getAttr('rx') || '12'),
      fill: getAttr('fill'),
      stroke: getAttr('stroke'),
      strokeWidth: parseFloat(getAttr('stroke-width') || '2'),
    };
  };

  // 1. Look for rects with class="dash-visual-slot"
  const slotRegex = /<rect[^>]*class=["'][^"']*dash-visual-slot[^"']*["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  let foundSlotsWithClass = false;

  while ((match = slotRegex.exec(svgString)) !== null) {
    foundSlotsWithClass = true;
    const attrs = extractAttributes(match[0]);
    if (attrs.width > 50 && attrs.height > 50) {
      cornerRadius = attrs.rx;
      containers.push({
        id: attrs.id || `slot-${containers.length + 1}`,
        title: `Slot ${containers.length + 1}`,
        subtitle: '',
        showTitle: true,
        showSubtitle: false,
        x: Math.round(attrs.x),
        y: Math.round(attrs.y),
        width: Math.round(attrs.width),
        height: Math.round(attrs.height),
      });
    }
  }

  // 2. If no slots with class, parse all non-background, non-nav rects
  if (!foundSlotsWithClass) {
    const allRectsRegex = /<rect[^>]*>/gi;
    let rMatch: RegExpExecArray | null;
    while ((rMatch = allRectsRegex.exec(svgString)) !== null) {
      const tag = rMatch[0];
      // Skip drop shadow opacity rects
      if (/opacity=["'](?:0\.[1-4])["']/i.test(tag)) continue;
      const attrs = extractAttributes(tag);
      // Skip full canvas background
      if (attrs.width >= width * 0.95 && attrs.height >= height * 0.95) continue;
      // Skip nav bar
      if (hasNav) {
        if (navOrientation === 'left' && attrs.x <= 0 && attrs.height >= height * 0.8) continue;
        if (navOrientation === 'top' && attrs.y <= 0 && attrs.width >= width * 0.8) continue;
      }
      // Skip tiny icon or button rects
      if (attrs.width < 70 || attrs.height < 60) continue;
      if (hasNav && navOrientation === 'left' && attrs.x < navSize) continue;
      if (hasNav && navOrientation === 'top' && attrs.y < navSize) continue;

      cornerRadius = attrs.rx || cornerRadius;
      containers.push({
        id: `slot-${containers.length + 1}`,
        title: `Slot ${containers.length + 1}`,
        subtitle: '',
        showTitle: true,
        showSubtitle: false,
        x: Math.round(attrs.x),
        y: Math.round(attrs.y),
        width: Math.round(attrs.width),
        height: Math.round(attrs.height),
      });
    }
  }

  return sanitizeDashCanvasState({
    dimensions: { width, height, preset: `${width}x${height}` as any },
    backgroundColor,
    navBar: {
      ...defaultNav,
      show: hasNav,
      orientation: navOrientation,
      size: navSize,
      backgroundColor: navBgColor,
    },
    containerStyle: {
      ...DEFAULT_DASH_CANVAS_STATE.containerStyle,
      cornerRadius,
    },
    containers,
    layoutPreset: 'custom',
  });
}

/**
 * Main parse function: parses SVG string, checking embedded metadata first,
 * then falling back to heuristic XML/SVG element extraction.
 */
export function parseDashSvg(svgString: string): DashCanvasState {
  if (!svgString || typeof svgString !== 'string') {
    throw new Error('Please provide valid SVG string content.');
  }

  // 1. Try extracting embedded base64 state from <metadata ... data-state="...">
  const dataStateMatch = svgString.match(/<metadata[^>]*data-state=["']([^"']+)["']/i);
  if (dataStateMatch && dataStateMatch[1]) {
    try {
      const jsonStr = decodeBase64Utf8(dataStateMatch[1]);
      const parsed = JSON.parse(jsonStr);
      return sanitizeDashCanvasState(parsed);
    } catch (e) {
      console.warn('Failed to parse base64 metadata in SVG, falling back to CDATA/heuristic:', e);
    }
  }

  // 2. Try extracting CDATA JSON from <metadata id="powerlab-dash-state"...>
  const cdataMatch = svgString.match(
    /<metadata[^>]*id=["']powerlab-dash-(?:state|config)["'][^>]*>[\s\S]*?<!\[CDATA\[([\s\S]*?)\]\]>[\s\S]*?<\/metadata>/i
  );
  if (cdataMatch && cdataMatch[1]) {
    try {
      const parsed = JSON.parse(cdataMatch[1].trim());
      return sanitizeDashCanvasState(parsed);
    } catch (e) {
      console.warn('Failed to parse CDATA metadata in SVG:', e);
    }
  }

  // 3. Fallback to heuristic parser
  return parseSvgMarkupHeuristics(svgString);
}

/**
 * Imports an SVG file from user's filesystem and returns parsed DashCanvasState
 */
export async function importDashSvgFile(file: File): Promise<DashCanvasState> {
  if (!file) {
    throw new Error('No file provided.');
  }
  if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
    throw new Error('Please select a valid SVG file (.svg).');
  }

  const text = await file.text();
  return parseDashSvg(text);
}

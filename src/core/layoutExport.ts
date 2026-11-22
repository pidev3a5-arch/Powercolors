import { LayoutVisualItem, LayoutDimension, ReportLayoutState, DEFAULT_LAYOUT_STATE } from './layoutTypes';

/**
 * Generates a clean Markdown table with exact pixel coordinates for documentation or sharing.
 */
export function generateCoordinatesMarkdownTable(
  visuals: LayoutVisualItem[],
  dimensions: LayoutDimension
): string {
  const lines: string[] = [
    `### Power BI Visual Coordinates Reference (${dimensions.width} × ${dimensions.height} px)`,
    '',
    '| # | Visual Name | Visual Type | Horizontal (X) | Vertical (Y) | Width (px) | Height (px) | Z-Order |',
    '|---|-------------|-------------|---------------:|-------------:|-----------:|------------:|--------:|',
  ];

  visuals.forEach((v, index) => {
    lines.push(
      `| ${index + 1} | ${v.name} | ${v.type} | ${v.x} px | ${v.y} px | ${v.width} px | ${v.height} px | ${v.zIndex} |`
    );
  });

  lines.push('');
  lines.push('> **Power BI Desktop Tip**: In the Format pane, expand **General → Properties → Size & Position** to enter these exact values.');
  return lines.join('\n');
}

/**
 * Generates CSV string for exporting coordinates to Excel or Google Sheets.
 */
export function generateCoordinatesCsv(
  visuals: LayoutVisualItem[],
  dimensions: LayoutDimension
): string {
  const rows: string[] = [
    `# Canvas Resolution: ${dimensions.width}x${dimensions.height}`,
    'Index,Name,Type,Horizontal_X,Vertical_Y,Width,Height,Z_Order',
  ];

  visuals.forEach((v, i) => {
    const escapedName = `"${v.name.replace(/"/g, '""')}"`;
    rows.push(`${i + 1},${escapedName},${v.type},${v.x},${v.y},${v.width},${v.height},${v.zIndex}`);
  });

  return rows.join('\n');
}

/**
 * Generates PBIR position JSON mapping for all visuals.
 */
export function generatePbirPositionsJson(visuals: LayoutVisualItem[]): string {
  const result = visuals.map((v) => ({
    name: v.name,
    visualType: v.type,
    position: {
      x: v.x,
      y: v.y,
      width: v.width,
      height: v.height,
      z: v.zIndex,
    },
  }));
  return JSON.stringify(result, null, 2);
}

/**
 * Serializes the full layout state to a clean JSON string.
 */
export function exportLayoutStateToJson(state: ReportLayoutState): string {
  return JSON.stringify(
    {
      app: 'PowerLab Report Layout Planner',
      version: 1,
      createdAt: new Date().toISOString(),
      state,
    },
    null,
    2
  );
}

/**
 * Parses and sanitizes imported JSON layout state with safe fallbacks.
 */
export function importLayoutStateFromJson(jsonString: string): ReportLayoutState {
  try {
    const parsed = JSON.parse(jsonString);
    const raw = (parsed.state || parsed) as Partial<ReportLayoutState>;

    const width = typeof raw.dimensions?.width === 'number' && raw.dimensions.width > 0
      ? raw.dimensions.width
      : DEFAULT_LAYOUT_STATE.dimensions.width;
    const height = typeof raw.dimensions?.height === 'number' && raw.dimensions.height > 0
      ? raw.dimensions.height
      : DEFAULT_LAYOUT_STATE.dimensions.height;
    const preset = raw.dimensions?.preset || '1280x720';

    const visuals: LayoutVisualItem[] = Array.isArray(raw.visuals)
      ? raw.visuals.map((v, i) => ({
          id: v.id || `vis-${i + 1}`,
          name: v.name || `Visual ${i + 1}`,
          type: v.type || 'card',
          x: typeof v.x === 'number' ? Math.round(v.x) : 24,
          y: typeof v.y === 'number' ? Math.round(v.y) : 24,
          width: typeof v.width === 'number' && v.width > 0 ? Math.round(v.width) : 200,
          height: typeof v.height === 'number' && v.height > 0 ? Math.round(v.height) : 100,
          zIndex: typeof v.zIndex === 'number' ? v.zIndex : i + 1,
          color: v.color || undefined,
          locked: Boolean(v.locked),
          notes: v.notes || undefined,
        }))
      : DEFAULT_LAYOUT_STATE.visuals;

    return {
      name: typeof raw.name === 'string' ? raw.name : 'Imported Report Layout',
      dimensions: { width, height, preset },
      grid: {
        enabled: raw.grid?.enabled !== undefined ? Boolean(raw.grid.enabled) : true,
        size: typeof raw.grid?.size === 'number' ? raw.grid.size : 8,
        showGrid: raw.grid?.showGrid !== undefined ? Boolean(raw.grid.showGrid) : true,
      },
      backgroundColor: raw.backgroundColor || '#F8FAFC',
      visuals,
    };
  } catch (err) {
    throw new Error('Failed to parse layout JSON: Invalid JSON or corrupted format.');
  }
}

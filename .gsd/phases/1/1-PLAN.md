---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Core Layout Planner Types, Presets & Coordinate Export Engine

<objective>
Build the core data structures, resolution configurations, grid alignment utilities, layout presets, and coordinate export engines (Markdown table, CSV, JSON, and PBIR coordinates) for the Power BI Report Layout Planner.
</objective>

<tasks>
<task id="1.1.1">
Create `src/core/layoutTypes.ts` defining:
- Supported Power BI visual types: `card`, `bar-chart`, `column-chart`, `line-chart`, `area-chart`, `donut-chart`, `table`, `matrix`, `slicer`, `kpi`, `gauge`, `decomposition-tree`, `custom`
- Visual layout item interface: `LayoutVisualItem` (id, name, type, x, y, width, height, zIndex, color, locked, notes)
- Canvas resolution configs: `LayoutResolutionPreset` (1280x720, 1920x1080, 1440x900, 1024x768, 390x844 mobile)
- Grid configuration: snap-to-grid intervals (4px, 8px, 10px, 16px), guide lines, padding/margin
- State interface: `ReportLayoutState` with default starting configuration
</task>

<task id="1.1.2">
Create `src/core/layoutPresets.ts` with curated Power BI layout architectures:
- Executive Scorecard (Top KPI cards + 2 main chart slots + summary table)
- Analytics Split (Left slicer ribbon + 2x2 analytic matrix)
- Storyline Flow (Hero visual on top + 3-column breakdown)
- Financial Matrix & BANs (High-density matrix with variance cards)
- Mobile Portrait Layout (Optimized for Power BI Mobile view 390x844)
</task>

<task id="1.1.3">
Create `src/core/layoutExport.ts` implementing:
- `generateCoordinatesMarkdownTable(visuals)`: Markdown table with exact X, Y, Width, Height, Type
- `generateCoordinatesCsv(visuals)`: CSV formatted string for Excel/Sheets
- `generatePbirPositionSnippet(visual)`: Standard PBIR `visual.json` position snippet
- `copyCoordinatesToClipboard(...)` helper
- State export to JSON and import from JSON
</task>

<task id="1.1.4">
Write unit tests in `src/test/layoutPlanner.test.ts` testing coordinate calculations, grid snapping, preset generation, and export formats. Verify `npm test` passes.
</task>
</tasks>

<verify>
Run `npm test` to verify all layout planner unit tests pass with 0 errors.
</verify>

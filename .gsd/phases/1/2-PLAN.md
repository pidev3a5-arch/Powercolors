---
phase: 1
plan: 2
wave: 2
---

# Plan 1.2: Interactive Layout Canvas UI, Visual Blocks & Page Integration

<objective>
Build the interactive visual layout canvas with drag/drop, resize handles, visual type badges, coordinate inspector panel, quick-add visual palette, layout preset picker, and the main `ReportLayoutPlannerPage.tsx`.
</objective>

<tasks>
<task id="1.2.1">
Create `src/components/layout/LayoutCanvas.tsx`:
- Render interactive canvas with zoom controls (fit, zoom slider, reset) and background grid pattern
- Render visual rectangles with Neo-brutalist styling, type icons, titles, and live coordinate badges (X, Y, W, H)
- Drag-and-drop movement with optional grid-snapping (8px default)
- 8-point resize handles (corners and edges) with minimum width/height constraints
- Selection state, multi-select / active visual highlight
</task>

<task id="1.2.2">
Create `src/components/layout/LayoutSidebar.tsx`:
- Visual Type Palette: 1-click add card, bar chart, line chart, table, slicer, etc.
- Selected Visual Inspector: Fine-tune X, Y, Width, Height with numeric inputs, rename, change visual type, delete, lock/unlock
- Canvas Settings: Resolution picker (1280x720, 1920x1080), grid snap toggle & grid size (8px, 16px), background color
- Curated Layout Presets: 1-click apply pre-built layouts
</task>

<task id="1.2.3">
Create `src/components/layout/LayoutExportModal.tsx`:
- View and copy coordinates table (Markdown, CSV, JSON, PBIR)
- Copy all coordinates button with toast notification
- Step-by-step instructions on applying exact coordinates in Power BI Desktop (*Format Visual → Properties → Position: Horizontal, Vertical, Width, Height*)
</task>

<task id="1.2.4">
Create `src/pages/ReportLayoutPlannerPage.tsx`:
- Top page header with actions: Add Visual, Presets, Clear, Export Coordinates, Reset
- Wire up state management (visuals array, selectedId, history undo/redo)
- Connect to `App.tsx` routing as `'layout-planner'`
- Update `App.tsx` and types to support the new page
</task>
</tasks>

<verify>
Run `npm run build` and `npm test` to ensure clean TypeScript compilation and 100% test passing.
</verify>

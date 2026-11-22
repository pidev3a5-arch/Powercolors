---
phase: 7
plan: 2
wave: 2
depends_on:
  - 7.1
files_modified:
  - src/core/dashLayoutPresets.ts
  - src/components/dash/DashCanvasControls.tsx
  - src/components/dash/DashContainerConfig.tsx
autonomous: true

must_haves:
  truths:
    - User can select canvas resolution from dropdown (1280x720, 1920x1080, custom WxH) and pick canvas background color.
    - User can choose from standard Power BI visual layout templates (Executive Overview, 2x2 Grid, 3-Column, Dense Analytics) or add/remove containers.
    - Visual container shapes automatically calculate responsive pixel bounds taking nav bar position and padding into account.
    - User can toggle title and subtitle for each container shape and customize text.
  artifacts:
    - src/core/dashLayoutPresets.ts
    - src/components/dash/DashCanvasControls.tsx
    - src/components/dash/DashContainerConfig.tsx
---

# Plan 7.2: Canvas Layout Presets & Visual Shapes Grid Builder

<objective>
Implement canvas dimension management, layout preset generation, and visual container card configuration. Report authors can easily pick between common Power BI dashboard layouts, customize container shapes, and toggle card header titles/subtitles.

Purpose: Empowers users to structure their report canvas with organized visual zones without manual pixel positioning.
Output: `dashLayoutPresets.ts`, `DashCanvasControls.tsx`, and `DashContainerConfig.tsx`.
</objective>

<context>
- .gsd/ROADMAP.md
- src/core/dashTypes.ts
- src/components/dash/DashNavControls.tsx
</context>

<tasks>

<task type="auto">
  <name>Build Layout Presets Generator & Coordinate Calculator</name>
  <files>src/core/dashLayoutPresets.ts</files>
  <action>
    - Create `src/core/dashLayoutPresets.ts`:
      - Helper function `generateLayoutContainers(preset: LayoutPresetType, canvasWidth: number, canvasHeight: number, navBar: NavBarConfig)`:
        - `executive-overview`: Top row with 3 or 4 KPI cards, left primary chart zone, right secondary chart zone.
        - `grid-2x2`: 4 equal visual quadrant cards.
        - `three-column`: 3 vertical column containers.
        - `dense-analytics`: Top KPI row + 3-card middle tier + wide bottom matrix zone.
        - `single-hero`: 1 top summary banner + 1 large central visual zone.
      - Automatically offsets container coordinates based on whether the navigation bar is on the Left (x shifted right) or Top (y shifted down).
      - Provides sensible default titles ("Revenue vs Target", "Regional Breakdown", "KPI Summary", etc.) and subtitles.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Layout preset generator computes exact container geometries dynamically.</done>
</task>

<task type="auto">
  <name>Build DashCanvasControls Component</name>
  <files>src/components/dash/DashCanvasControls.tsx</files>
  <action>
    - Create `src/components/dash/DashCanvasControls.tsx`:
      - Canvas Resolution Dropdown:
        - `1280 × 720 (16:9 Standard Power BI)`
        - `1920 × 1080 (16:9 Full HD)`
        - `Custom Dimensions` (with numeric width and height inputs).
      - Canvas Background Color picker (with warm cream, pure white, dark slate, and cool gray quick presets).
      - Layout Preset Selector: Buttons/cards for each layout template with mini-grid visual preview icons.
      - Container style controls: Corner radius (sharp 0px, subtle 8px, rounded 16px), border color, container background color, and card shadow toggle.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>DashCanvasControls offers intuitive canvas size and layout preset selection.</done>
</task>

<task type="auto">
  <name>Build DashContainerConfig Component</name>
  <files>src/components/dash/DashContainerConfig.tsx</files>
  <action>
    - Create `src/components/dash/DashContainerConfig.tsx`:
      - List of active visual container shapes with slot indices (`Card 1`, `Chart 2`, etc.).
      - Title toggle switch + text input for title (e.g., "Monthly Sales Performance").
      - Subtitle toggle switch + text input for subtitle (e.g., "YTD comparison against budget").
      - Individual container delete and duplicate buttons.
      - Quick "+ Add Container" button for modular layout expansion.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>DashContainerConfig allows fine-grained customization of visual slots and titles.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Run `npx tsc --noEmit` — 0 TypeScript errors.
- [ ] Switching between layout presets updates visual container bounds accurately without nav bar collisions.
- [ ] Toggling container titles and subtitles updates the active state immediately.
</verification>

<success_criteria>
Users can select canvas resolutions, pick background colors, switch layout presets, and toggle/edit title and subtitle placeholders for every visual shape.
</success_criteria>

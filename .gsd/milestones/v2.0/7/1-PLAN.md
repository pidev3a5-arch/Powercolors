---
phase: 7
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/core/dashTypes.ts
  - src/components/dash/DashNavControls.tsx
  - src/components/dash/IconPickerModal.tsx
autonomous: true

must_haves:
  truths:
    - User can configure canvas resolution presets (1280x720, 1920x1080, custom) and canvas background color.
    - User can enable or configure a navigation bar in either Left or Top orientation, with custom size and background color.
    - User can upload a brand logo and specify a report title to display inside the navigation bar.
    - User can manage navigation buttons (add, delete, reorder, edit labels) and pick icons from an embedded icon pack.
  artifacts:
    - src/core/dashTypes.ts
    - src/components/dash/DashNavControls.tsx
    - src/components/dash/IconPickerModal.tsx
---

# Plan 7.1: Dash Generator Core State, Resolution & Navigation Bar Engine

<objective>
Establish the foundational data structures, state management, and navigation bar customization controls for the Dash Canvas Generator. Report authors can configure canvas dimensions, toggle and customize top/left navigation ribbons, upload brand logos, set report titles, and select navigation button icons from a curated Power BI icon pack.

Purpose: Provides the core configuration engine for Power BI canvas wallpaper layouts.
Output: `dashTypes.ts`, `DashNavControls.tsx`, and `IconPickerModal.tsx`.
</objective>

<context>
- .gsd/ROADMAP.md
- src/core/types.ts
- src/index.css
</context>

<tasks>

<task type="auto">
  <name>Define Dash Generator Core Types & Icon Catalog</name>
  <files>src/core/dashTypes.ts</files>
  <action>
    - Create `src/core/dashTypes.ts`:
      - `CanvasResolution`: `'1280x720' | '1920x1080' | 'custom'` with width and height in px.
      - `NavBarOrientation`: `'left' | 'top'`.
      - `NavButtonConfig`: `{ id: string; label: string; icon: string; isActive?: boolean }`.
      - `NavBarConfig`:
        ```typescript
        export interface NavBarConfig {
          show: boolean;
          orientation: NavBarOrientation;
          size: number; // width in px for left, height in px for top
          backgroundColor: string;
          textColor: string;
          accentColor: string;
          reportTitle: string;
          logoUrl: string | null;
          buttons: NavButtonConfig[];
        }
        ```
      - `VisualContainerConfig`: `{ id: string; x: number; y: number; width: number; height: number; title: string; subtitle: string; showTitle: boolean; showSubtitle: boolean; backgroundColor?: string; }`.
      - `DashCanvasState`: Combined state interface for canvas, nav bar, and containers.
      - Curated icon pack list (`AVAILABLE_NAV_ICONS`) with common Power BI navigation icons: `home`, `bar-chart`, `line-chart`, `pie-chart`, `trending-up`, `users`, `dollar-sign`, `calendar`, `settings`, `filter`, `layers`, `database`, `shopping-bag`, `bell`, `file-text`, `globe`, `table`, `layout-grid`.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Dash Generator data structures and icon registry compile cleanly.</done>
</task>

<task type="auto">
  <name>Build IconPickerModal Component</name>
  <files>src/components/dash/IconPickerModal.tsx</files>
  <action>
    - Create `src/components/dash/IconPickerModal.tsx`:
      - Tactile modal adhering to Playful Geometric styling (2px border, hard drop shadow, dot grid).
      - Search input to filter icons by name.
      - Interactive grid of selectable Lucide icons with clean active state indicators.
      - Confirm selection callback `(iconName: string) => void` and cancel callback.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Icon picker modal renders searchable icon options with smooth selection.</done>
</task>

<task type="auto">
  <name>Build DashNavControls & Logo Uploader</name>
  <files>src/components/dash/DashNavControls.tsx</files>
  <action>
    - Create `src/components/dash/DashNavControls.tsx`:
      - Orientation selector: Left vs Top nav bar toggle.
      - Navigation bar thickness/size slider and color pickers (background, text, active accent).
      - Logo image uploader: supports drag-and-drop or file pick (PNG, SVG, JPG), downsamples/reads as data URL, with remove button.
      - Report title input field with character limit and live update.
      - Navigation button list editor:
        - Add button ("+ Add Page Tab").
        - Reorder buttons up/down.
        - Edit button label in place.
        - Click icon badge to trigger `IconPickerModal`.
        - Delete button.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>DashNavControls allows full configuration of navigation ribbons, logo, and page tabs.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Run `npx tsc --noEmit` — 0 TypeScript errors.
- [ ] Run `npm test` — all existing 29 tests pass.
- [ ] Navigation controls render and update `DashCanvasState` reactively.
</verification>

<success_criteria>
Core data types are defined, navigation bar orientation/sizing/colors are configurable, logo can be uploaded, and navigation buttons can be added with custom labels and icons.
</success_criteria>

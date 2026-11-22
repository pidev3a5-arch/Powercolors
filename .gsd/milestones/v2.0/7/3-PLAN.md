---
phase: 7
plan: 3
wave: 3
depends_on:
  - 7.1
  - 7.2
files_modified:
  - src/core/dashSvgExport.ts
  - src/components/dash/DashSvgCanvas.tsx
  - src/pages/DashGeneratorPage.tsx
  - src/test/dashSvgExport.test.ts
autonomous: true

must_haves:
  truths:
    - User can preview the assembled canvas layout in real time with vector precision.
    - SVG accurately reflects all user settings: resolution, background, nav bar (top or left), logo, report title, navigation buttons with icons, visual container shapes, and titles/subtitles.
    - User can download the canvas as a standalone `.svg` file ready for Power BI Desktop background import.
    - User can copy raw SVG markup to clipboard.
    - Unit tests verify that exported SVG is well-formed XML and contains all configured elements.
  artifacts:
    - src/core/dashSvgExport.ts
    - src/components/dash/DashSvgCanvas.tsx
    - src/pages/DashGeneratorPage.tsx
    - src/test/dashSvgExport.test.ts
---

# Plan 7.3: Real-Time Vector SVG Canvas Preview & 1-Click Power BI SVG Export

<objective>
Assemble the full Dash Canvas Generator workspace in `DashGeneratorPage.tsx`. Render a live vector SVG preview reflecting all nav bar, branding, button, and container configurations. Generate clean, standalone, optimized SVG code and provide 1-click download for Power BI Desktop page wallpaper import, supported by thorough unit tests.

Purpose: Completes Phase 7 by delivering the final production SVG generation engine and interactive studio workspace.
Output: `dashSvgExport.ts`, `DashSvgCanvas.tsx`, `DashGeneratorPage.tsx`, and `dashSvgExport.test.ts`.
</objective>

<context>
- .gsd/ROADMAP.md
- src/core/dashTypes.ts
- src/core/dashLayoutPresets.ts
- src/components/dash/DashNavControls.tsx
- src/components/dash/DashCanvasControls.tsx
- src/pages/DashGeneratorPage.tsx
</context>

<tasks>

<task type="auto">
  <name>Build Standalone Vector SVG Serializer</name>
  <files>src/core/dashSvgExport.ts</files>
  <action>
    - Create `src/core/dashSvgExport.ts`:
      - `generateDashSvg(state: DashCanvasState): string`:
        - Generates valid XML `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">`.
        - Embeds font styling (`font-family="Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"`).
        - Renders main canvas background `<rect width="100%" height="100%" fill="{canvasBg}" />`.
        - Renders Navigation Bar:
          - Background `<rect ... />` with drop shadow or border line separator.
          - Logo `<image href="{logoUrl}" ... />` if present.
          - Report Title text `<text ...>{reportTitle}</text>`.
          - Navigation Buttons: container pill/rect, embedded SVG icon path for each Lucide icon, and button label text.
        - Renders Visual Container Slots:
          - Rounded rectangle `<rect rx="{radius}" fill="{cardBg}" stroke="{borderColor}" ... />`.
          - Optional container header background / divider line.
          - Optional Title text (`<text font-weight="700" ...>{title}</text>`).
          - Optional Subtitle text (`<text font-size="12" opacity="0.7" ...>{subtitle}</text>`).
      - Client-side download helper `downloadDashSvg(state: DashCanvasState, filename?: string): void`.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>SVG serializer produces clean, well-formed vector markup matching all layout properties.</done>
</task>

<task type="auto">
  <name>Build Interactive DashSvgCanvas Preview Component</name>
  <files>src/components/dash/DashSvgCanvas.tsx</files>
  <action>
    - Create `src/components/dash/DashSvgCanvas.tsx`:
      - Renders an interactive, responsive vector canvas container with a dot-grid canvas frame.
      - Displays live resolution badge (e.g. `1280 × 720 px (16:9 Standard)`).
      - Renders SVG inline with exact aspect ratio scaling.
      - Interactive hover feedback on visual slots indicating dimensions and zone type.
      - Zoom / Scale controls (`Fit to Window`, `100% Actual Size`) for comfortable viewing on any monitor.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>DashSvgCanvas previews the wallpaper design with vector fidelity.</done>
</task>

<task type="auto">
  <name>Assemble DashGeneratorPage & Author Unit Tests</name>
  <files>src/pages/DashGeneratorPage.tsx, src/test/dashSvgExport.test.ts</files>
  <action>
    - Update `src/pages/DashGeneratorPage.tsx`:
      - Replace placeholder frame with full interactive workspace.
      - Top action bar: Quick layout preset chips, Copy SVG Code, and Download SVG Background button (`bg-[#F472B6]` candy button).
      - Two-column responsive studio layout:
        - Left / Control Panel (Tabbed or Accordion):
          1. Canvas & Layout (Resolution, background, presets, styling)
          2. Navigation Bar (Top/Left, size, colors, logo, title)
          3. Nav Buttons & Icons (Tab count, labels, Lucide icon picker)
          4. Visual Containers (Title/subtitle toggles, custom labels)
        - Right / Main Viewport:
          - `DashSvgCanvas` live preview.
          - Power BI Desktop import instructions card (Step-by-step guidance on setting canvas background in Power BI: `Format Page > Canvas background > Image > Fit: Fit, Transparency: 0%`).
    - Create `src/test/dashSvgExport.test.ts`:
      - Test SVG generation for 1280x720 and 1920x1080 resolutions.
      - Test Left and Top navigation bars.
      - Test navigation buttons and icon path inclusion.
      - Test visual containers with and without titles/subtitles.
      - Test that exported SVG string is valid XML and contains no undefined tokens.
  </action>
  <verify>npm test && npm run build</verify>
  <done>Dash Generator is fully operational, passes all unit tests, and compiles cleanly.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Run `npm test` — all unit tests pass (including new `dashSvgExport.test.ts`).
- [ ] Run `npm run build` — TypeScript and Vite production bundle compile with 0 errors.
- [ ] User can customize canvas, nav bar, buttons, and containers, and download `.svg`.
</verification>

<success_criteria>
Full Dash Canvas Generator is live in the application, producing verified, beautiful Power BI background SVGs with 1-click export.
</success_criteria>

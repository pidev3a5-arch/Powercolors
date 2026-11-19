---
phase: 3
plan: 2
wave: 2
depends_on: [1]
---

# Plan 3.2: Report Canvas Assembly, State Synchronization & Testing

## Objective
Assemble the visual components into an authentic Power BI Report Canvas layout, wire real-time state synchronization with the palette editor, and verify functionality with automated tests.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- .gsd/phases/3/1-PLAN.md
- src/App.tsx

## Tasks

<task type="auto">
  <name>Build ReportCanvas Layout Component</name>
  <files>src/components/ReportCanvas.tsx</files>
  <action>
    - Create `ReportCanvas.tsx`:
      - Simulates a full Power BI report page: top filter/header ribbon, KPI summary row, 2-column chart grid, and bottom table matrix.
      - Canvas background dynamically bound to `structural.background` (`#FFFFFF` or `#0F172A`).
      - Quick view toggles: "Desktop 16:9 View" vs "Stacked View".
      - Power BI page title bar with breadcrumbs and report author watermark.
  </action>
  <verify>npm run build</verify>
  <done>Report canvas integrates all visuals and updates dynamically with theme edits.</done>
</task>

<task type="auto">
  <name>Integrate Canvas into App.tsx & Add Unit Tests</name>
  <files>src/App.tsx, src/test/reportCanvas.test.ts</files>
  <action>
    - Replace placeholder section in `App.tsx` with live `ReportCanvas`.
    - Ensure swatch drag/drop, hex edits, or image uploads instantly repaint the mock visuals.
    - Write unit tests in `src/test/reportCanvas.test.ts` verifying:
      1. Correct color assignments to chart series (dataColors[0] through dataColors[9]).
      2. Table accent background application on table headers.
      3. Light and dark theme class assignments.
  </action>
  <verify>npm test</verify>
  <done>All tests pass with 100% pass rate and build succeeds.</done>
</task>

## Success Criteria
- [ ] Changing any hex code in the palette strip immediately updates the corresponding chart series or table header in the mock canvas.
- [ ] Toggling between Light and Dark canvas changes container backgrounds, borders, and text colors properly.
- [ ] All unit tests pass cleanly.

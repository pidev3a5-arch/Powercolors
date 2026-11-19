---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Power BI Visual Components

## Objective
Build realistic mock Power BI visual components that dynamically bind to the extracted 10-color data palette and structural theme properties: KPI summary cards, clustered bar/column chart, multi-line trend chart, category donut chart, and a styled matrix table.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- src/core/types.ts
- src/components/ColorSwatchCard.tsx

## Tasks

<task type="auto">
  <name>Build Power BI Visual Container & KPI Cards</name>
  <files>src/components/visuals/VisualContainer.tsx, src/components/visuals/KpiCardRow.tsx</files>
  <action>
    - Create `VisualContainer.tsx`:
      - Simulates Power BI modern visual container styling (subtle border, card background, title, subtitle, visual header icons for filter/more options).
      - Respects light canvas (`#FFFFFF` background, `#E2E8F0` border, `#1E293B` text) vs dark canvas (`#1E293B` container, `#334155` border, `#F8FAFC` text).
    - Create `KpiCardRow.tsx`:
      - 4 KPI metric cards: Total Revenue, YoY Growth, Active Accounts, Profit Margin.
      - Dynamic binding to `structural.good`, `structural.bad`, and `dataColors[0]`.
      - Mini trend sparklines and status badges.
  </action>
  <verify>npm run build</verify>
  <done>VisualContainer and KPI Cards compile cleanly and render responsive layout.</done>
</task>

<task type="auto">
  <name>Build SVG Chart Visuals (Bar, Line, Donut, Matrix)</name>
  <files>src/components/visuals/ClusteredBarChart.tsx, src/components/visuals/LineTrendChart.tsx, src/components/visuals/DonutChart.tsx, src/components/visuals/StyledMatrixTable.tsx</files>
  <action>
    - Create `ClusteredBarChart.tsx`:
      - Categorical bar chart rendering regional product categories with `dataColors[0..3]`.
      - Interactive hover tooltips showing values and category labels.
    - Create `LineTrendChart.tsx`:
      - 6-month performance trend with SVG path curves, gridlines, data points, and legend using `dataColors[0]` and `dataColors[4]`.
    - Create `DonutChart.tsx`:
      - Proportional donut breakdown using `dataColors[0..4]` with center KPI label and interactive hover highlight.
    - Create `StyledMatrixTable.tsx`:
      - Power BI table visual with column headers styled with `tableAccent` and alternating row striping.
  </action>
  <verify>npm run build</verify>
  <done>All SVG charts render with dynamic theme colors without external chart library bloat.</done>
</task>

## Success Criteria
- [ ] Visuals mimic real Power BI Desktop formatting pane output.
- [ ] Zero heavy third-party charting libraries required (pure performant SVG).
- [ ] All colors update instantaneously as swatches are modified or swapped.

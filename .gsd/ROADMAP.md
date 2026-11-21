# ROADMAP.md

> **Current Milestone**: v3.0 - SVG Visual Maker & Power BI DAX Studio
> **Current Phase**: Phase 8: Core SVG Visual Library & DAX Generation Engine
> **Goal**: Empower Power BI developers to generate dozens of SVG micro-visuals as error-free DAX measures with Image URL category, plus convert imported SVGs into DAX.

## Must-Haves (Milestone v3.0)
- [x] Curated library of dozens of Power BI SVG visuals across categories: KPI, Gauge, Line, Bar, Donut, Waffle/Rating
- [x] Gauge with track and Gauge with outline & needle (40%, 55%, 80%) inspired by references
- [x] Circular ring progress with % and checkmarks inspired by references
- [x] Real-time parameter customizer (value, target, min/max, colors, dimensions)
- [x] 1-click Power BI DAX Measure Generator (`VAR _Actual = ...`, properly escaped quotes and `%23` encoding)
- [x] 1-click Copy DAX Measure, Copy Raw SVG, and Download SVG
- [x] SVG to DAX Converter tab: import/paste custom SVG and generate copyable DAX measure
- [x] Search box & category chips filter
- [x] Full integration into PowerLab header navigation, mobile menu, and landing page

## Phases

### Phase 1: Project Scaffolding & Core Color Engine
**Status**: 🟩 Completed

### Phase 2: Palette Management & Customization UI
**Status**: 🟩 Completed

### Phase 3: Live Power BI Visuals Mock Canvas
**Status**: 🟩 Completed

### Phase 4: Theme JSON Generator & Export
**Status**: 🟩 Completed

### Phase 5: Polish, Verification & Production Readiness
**Status**: 🟩 Completed

### Phase 6: Multi-Page Navigation & Landing Page
**Status**: 🟩 Completed

### Phase 7: Dashboard SVG Canvas Builder (Dash Generator)
**Status**: 🟩 Completed

---

### Phase 8: Core SVG Visual Library & DAX Generation Engine
**Status**: 🟩 Completed
**Objective**: Build the library of SVG visual templates (gauges, KPI rings, sparklines, bullet bars, waffles), the DAX code serializer with clean VAR substitutions and quote escaping, and the custom SVG-to-DAX parser.

### Phase 9: SVG Visual Maker UI, Gallery & Customizer
**Status**: 🟩 Completed
**Objective**: Build `SvgVisualMakerPage.tsx` with Visual Gallery, category filters, search box, live preview parameter sliders, DAX code display, and the Import/Convert SVG tab.

### Phase 10: Routing Integration, Landing Showcase & Verification
**Status**: 🟩 Completed
**Objective**: Connect navigation header, mobile menu, and landing page showcases to SVG Visual Maker, and verify across desktop/mobile viewports with automated unit tests.  

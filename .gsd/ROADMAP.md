# ROADMAP.md

> **Current Milestone**: v4.0 — Report Layout Planner, Color Accessibility Checker & DAX Measure Toolkit
> **Current Phase**: Phase 4: Navigation Integration, Landing Page & Verification
> **Goal**: Add three high-value tools to PowerLab — a visual drag-and-drop report layout planner directly baked into Dash Canvas SVG wallpaper, a WCAG 2.1 AA/AAA accessibility checker with colorblind CVD simulation & auto-fix, and a curated DAX measure template toolkit with live parameter substitution.

## Must-Haves (Milestone v4.0)
- [x] **Report Layout Planner (4th Tab in Dash Canvas)**: drag-and-drop grid for designing Power BI visual placement directly linked to Dash Canvas SVG background slots
- [x] Copy all coordinates as a reference table for precise visual positioning in Power BI Desktop
- [x] Export layout coordinates as PBIR `visual.json` position snippets, Markdown, and CSV
- [x] **Color Accessibility Checker page**: WCAG AA/AAA and Non-Text UI contrast matrix (3.0:1) for all theme palette colors against every background
- [x] Colorblind simulation (Deuteranopia, Protanopia, Tritanopia, Achromatopsia) with live preview
- [x] Auto-suggest color fixes for failing contrast pairs with 1-click apply to palette
- [x] **DAX Measure Toolkit page**: curated library of ready-to-copy DAX measure templates (Time Intelligence, Rankings, Dynamic Titles, KPI Logic, Conditional Formatting, Metric Switching)
- [x] Live placeholder substitution (replace `[Measure]`, `'Date'[Date]`, etc. with user's actual model fields)
- [x] Copy formatted DAX and download single `.dax` or multi-measure category bundles
- [x] Full integration into PowerLab header navigation, mobile menu, and landing page
- [x] All 93 unit tests passing + clean production build

## Nice-to-Haves
- [x] Export layout coordinates as PBIR `visual.json` position snippets
- [x] Snap-to-grid (8px) and coordinate pill overlays in Report Layout Planner
- [x] Single source of truth: Layout Planner cards are baked directly into downloaded Dash Canvas SVG wallpaper
- [x] Export Accessibility Audit Report Card as Markdown and downloadable theme JSON
- [x] Live Power BI Visual Preview Simulator with CVD modes

## Phases

### Phase 1: Report Layout Planner
**Status**: 🟩 Completed
**Objective**: Build layout planner with drag-and-drop canvas, 8-point handles, 8px snap grid, coordinate inspector, presets, and PBIR export, unified directly as Tab 4 inside Dash Canvas as requested.

### Phase 2: Color Accessibility Checker
**Status**: 🟩 Completed
**Objective**: Build a page that imports theme palettes and provides a WCAG 2.1 AA/AAA contrast matrix (3.0:1 non-text & 4.5:1 text), colorblind simulations (Deuteranopia, Protanopia, Tritanopia, Achromatopsia), pairwise conflict detection, and auto-fix color suggestions.

### Phase 3: DAX Measure Toolkit
**Status**: 🟩 Completed
**Objective**: Build a curated library page of production-grade DAX measures across 6 categories with live parameter substitution, Power BI best-practice tips, and one-click copy and .dax bundle exports.

### Phase 4: Navigation Integration, Landing Page & Verification
**Status**: 🟩 Completed
**Objective**: Wire all workspaces into header navigation, landing page 5-workspace spotlight, and Theme Studio "Audit WCAG" bridge. 93/93 unit tests passing and clean Vite production build.

## Completed Milestones

### v3.0 — SVG Visual Maker & Power BI DAX Studio ✅
### v2.0 — Multi-Page & Dashboard SVG Generator ✅
### v1.0 — Theme Studio & Color Engine ✅

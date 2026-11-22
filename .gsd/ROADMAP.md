# ROADMAP.md

> **Current Milestone**: v4.0 — Report Layout Planner, Color Accessibility Checker & DAX Measure Toolkit
> **Current Phase**: Phase 2: Color Accessibility Checker
> **Goal**: Add three high-value pages to PowerLab — a visual drag-and-drop report layout planner with exact PBI pixel coordinates, a WCAG accessibility checker with colorblind simulation, and a curated DAX measure template toolkit.

## Must-Haves (Milestone v4.0)
- [x] **Report Layout Planner page**: drag-and-drop grid for designing Power BI report visual placement with exact X, Y, Width, Height coordinates
- [x] Copy all coordinates as a reference table for precise visual positioning in Power BI Desktop
- [x] Export layout coordinates as PBIR `visual.json` position snippets
- [ ] **Color Accessibility Checker page**: WCAG AA/AAA contrast matrix for all theme palette colors against every background
- [ ] Colorblind simulation (Deuteranopia, Protanopia, Tritanopia) with live preview
- [ ] Auto-suggest color fixes for failing contrast pairs
- [ ] **DAX Measure Toolkit page**: curated library of ready-to-copy DAX measure templates (Time Intelligence, Rankings, Dynamic Titles, KPI Logic, Conditional Formatting)
- [ ] Live placeholder substitution (replace `[Sales]` with user's actual measure name)
- [ ] Copy formatted DAX and download as `.dax` file
- [ ] Full integration into PowerLab header navigation, mobile menu, and landing page
- [ ] All existing tests still passing + new tests for each page

## Nice-to-Haves
- [x] Export layout coordinates as PBIR `visual.json` position snippets
- [ ] Export Accessibility Report Card as PNG
- [x] Snap-to-grid and alignment guides in Report Layout Planner
- [ ] Pair with Dash Canvas wallpaper — overlay layout grid on top of wallpaper preview

## Phases

### Phase 1: Report Layout Planner
**Status**: 🟩 Completed
**Objective**: Build a new page where users design Power BI report visual placement on a pixel-accurate canvas (1280×720, 1920×1080, etc.). Drag-and-drop rectangles representing visuals, each showing exact X/Y/W/H coordinates. One-click copy all positions as a reference table.

### Phase 2: Color Accessibility Checker
**Status**: ⬜ Not Started
**Objective**: Build a page that imports a theme palette (from Theme Studio or JSON upload) and shows a WCAG AA/AAA contrast matrix for every data color against canvas, card, and dark backgrounds. Add colorblind simulation filters and auto-fix suggestions.

### Phase 3: DAX Measure Toolkit
**Status**: ⬜ Not Started
**Objective**: Build a curated library page of 30+ DAX measure templates across categories (Time Intelligence, Rankings, Dynamic Titles, KPI Logic, Conditional Formatting). Each template has a live editor with placeholder substitution and one-click copy/download.

### Phase 4: Navigation Integration, Landing Page & Verification
**Status**: ⬜ Not Started
**Objective**: Wire all three new pages into the header navigation, mobile menu, and landing page feature grid. Add unit tests for each page's core logic. Run full verification across desktop and mobile viewports.

## Completed Milestones

### v3.0 — SVG Visual Maker & Power BI DAX Studio ✅
### v2.0 — Multi-Page & Dashboard SVG Generator ✅
### v1.0 — Theme Studio & Color Engine ✅

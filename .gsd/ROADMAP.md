# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Client-side image ingestion supporting drag-and-drop, file browsing, and clipboard paste
- [ ] In-browser K-Means clustering producing a balanced 10-color data palette in <100ms
- [ ] Intelligent color harmonics fallback when source images have fewer than 10 colors
- [ ] Auto-derived structural colors (background, foreground, tableAccent, KPI good/bad/neutral)
- [ ] Interactive palette toolbar: swatch editing, reordering, lock, and contrast indicators
- [ ] Realistic Power BI mock canvas with KPI cards, bar chart, line chart, donut chart, and matrix
- [ ] Schema-compliant Power BI Theme JSON generation and one-click download / copy

## Phases

### Phase 1: Project Scaffolding & Core Color Engine
**Status**: ⬜ Not Started  
**Objective**: Set up the Vite + React + TypeScript + Tailwind CSS workspace; implement Canvas pixel extraction, fast K-Means quantization, Chroma.js harmonics/palette padding, and structural color derivation.  
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05  

### Phase 2: Palette Management & Customization UI
**Status**: ⬜ Not Started  
**Objective**: Build image upload zone (drag-and-drop, paste, file dialog, presets), 10-swatch palette strip with HEX/RGB inputs, color picker modal, swatch reordering/swapping, and WCAG contrast status.  
**Requirements**: REQ-06, REQ-07, REQ-08  

### Phase 3: Live Power BI Visuals Mock Canvas
**Status**: ⬜ Not Started  
**Objective**: Create an interactive Power BI report canvas preview simulating real visuals (KPI metric cards, clustered bar chart, line trend, donut breakdown, styled table) with Light/Dark canvas theme toggling.  
**Requirements**: REQ-09, REQ-10  

### Phase 4: Theme JSON Generator & Export
**Status**: ⬜ Not Started  
**Objective**: Implement Microsoft-compliant Power BI theme JSON builder (`$schema`, `name`, `dataColors`, `background`, `foreground`, `tableAccent`, `visualStyles`), theme naming, JSON syntax highlighter/preview, copy-to-clipboard, and `.json` file download.  
**Requirements**: REQ-11, REQ-12, REQ-13, REQ-14  

### Phase 5: Polish, Sample Presets & Production Build
**Status**: ⬜ Not Started  
**Objective**: Add sample images (tech brand, corporate, nature, vibrant), responsive mobile/desktop layout refinements, tooltips, and verify production build.  
**Requirements**: Full verification across all REQ items  

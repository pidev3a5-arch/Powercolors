# ROADMAP.md

> **Current Phase**: Phase 5 (Final Polish & Production Verification)
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [x] Client-side image downsampling and RGBA extraction with alpha transparency filter
- [x] In-browser K-Means clustering producing a balanced 10-color data palette in <100ms
- [x] Intelligent color harmonics fallback when source images have fewer than 10 colors
- [x] Auto-derived structural colors (background, foreground, tableAccent, KPI good/bad/neutral)
- [x] Interactive palette toolbar: swatch editing, reordering, lock, and contrast indicators
- [x] Realistic Power BI mock canvas with KPI cards, bar chart, line chart, donut chart, and matrix
- [x] Schema-compliant Power BI Theme JSON generation function, modal inspector, and 1-click download
- [x] Site logo added (`LOGO3008 - POWERBI.png`)
- [x] Creator & reviewer attribution in footer with LinkedIn link (Rachwen Mosbehi)
- [x] Site-wide Light and Dark mode with Light Mode as default

## Phases

### Phase 1: Project Scaffolding & Core Color Engine
**Status**: 🟩 Completed  
**Objective**: Set up the Vite + React + TypeScript + Tailwind CSS workspace; implement Canvas pixel extraction, fast K-Means quantization, Chroma.js harmonics/palette padding, and structural color derivation.  
**Requirements**: REQ-02, REQ-03, REQ-04, REQ-05, REQ-12  

### Phase 2: Palette Management & Customization UI
**Status**: 🟩 Completed  
**Objective**: Build image upload zone (drag-and-drop, paste, file dialog, presets), 10-swatch palette strip with HEX/RGB inputs, color picker modal, swatch reordering/swapping, and WCAG contrast status.  
**Requirements**: REQ-01, REQ-06, REQ-07, REQ-08, REQ-10, REQ-11, REQ-13, REQ-14  

### Phase 3: Live Power BI Visuals Mock Canvas
**Status**: 🟩 Completed  
**Objective**: Create an interactive Power BI report canvas preview simulating real visuals (KPI metric cards, clustered bar chart, line trend, donut breakdown, styled table) with Light/Dark canvas theme toggling.  
**Requirements**: REQ-09, REQ-10  

### Phase 4: Theme JSON Generator & Export (and Inspector)
**Status**: 🟩 Completed  
**Objective**: Modal JSON viewer with syntax highlighting, schema validation status, typography/visualContainer customizations, official site logo, creator attribution, and site light/dark mode.  
**Requirements**: REQ-11, REQ-12, REQ-13, REQ-14  

### Phase 5: Polish, Verification & Production Readiness
**Status**: ⬜ Ready to Finalize  
**Objective**: Comprehensive end-to-end verification across all features and test suites.  
**Requirements**: Full verification across all REQ items  

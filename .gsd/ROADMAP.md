# ROADMAP.md

> **Current Phase**: Phase 6 (Multi-Page Navigation & Landing Page) - Planned
> **Milestone**: v2.0 - In Progress

## Must-Haves (from SPEC)
- [x] Client-side image downsampling and RGBA extraction with alpha transparency filter
- [x] In-browser K-Means clustering producing a balanced 10-color data palette in <100ms
- [x] Intelligent color harmonics fallback when source images have fewer than 10 colors
- [x] Auto-derived structural colors (background, foreground, tableAccent, KPI good/bad/neutral)
- [x] Interactive palette toolbar: swatch editing, reordering, lock, and contrast indicators
- [x] Realistic Power BI mock canvas with KPI cards, bar chart, line chart, donut chart, and matrix
- [x] Schema-compliant Power BI Theme JSON generation function, modal inspector, and 1-click download
- [x] Official site logo added (`public/logo.png`) transparent and borderless
- [x] Creator & reviewer attribution in footer with LinkedIn link (Rachwen Mosbehi)
- [x] Site-wide Light and Dark mode with Light Mode as default
- [x] Rebranded to PowerLab with Playful Geometric design language and official schema compliance
- [ ] Multi-page client-side architecture (Landing Page, Theme Generator, Dash Generator)
- [ ] Playful Geometric Landing Page showcasing both Power BI design tools with engaging CTAs
- [ ] Dash Generator: Canvas resolution presets (1280x720, 1920x1080, custom) and canvas background color
- [ ] Dash Generator: Configurable navigation bar (top or left orientation, custom color, and size)
- [ ] Dash Generator: Report branding with logo upload and report title inside the nav bar
- [ ] Dash Generator: Interactive navigation buttons builder (button count, labels, and Lucide icon picker)
- [ ] Dash Generator: Card slots & visual shapes layout builder with configurable title/subtitle toggles
- [ ] Dash Generator: Real-time SVG canvas live preview and 1-click Power BI background `.svg` export

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
**Status**: 🟩 Completed  
**Objective**: Comprehensive end-to-end verification across all features and test suites, rebrand to PowerLab, and final production delivery.  
**Requirements**: Full verification across all REQ items  

---

### Phase 6: Multi-Page Navigation & Landing Page
**Status**: 🟨 In Progress (Planned)  
**Objective**: Introduce multi-page navigation to support three distinct views: a playful, high-converting Landing Page, the existing Theme Generator studio, and the new Dash Generator.  
**Depends on**: Phase 5  

**Plans**:
- [ ] **Plan 6.1**: Multi-Page Routing Architecture & Navigation Shell (`.gsd/phases/6/1-PLAN.md`)
- [ ] **Plan 6.2**: High-Converting Playful Geometric Landing Page (`.gsd/phases/6/2-PLAN.md`)

**Verification**:
- Automated test suite passes (`npm test`)
- Production build compiles cleanly (`npm run build`)
- Visual verification across mobile (360px & 390px) and desktop (1440px) viewports

---

### Phase 7: Dashboard SVG Canvas Builder (Dash Generator)
**Status**: ⬜ Not Started  
**Objective**: Build an interactive Power BI SVG Canvas Background Generator allowing report authors to configure canvas resolution, top/left navigation bar, logo, page navigation buttons with icon picker, visual card slots with titles/subtitles, and export a pixel-perfect .svg for Power BI page background.  
**Depends on**: Phase 6  

**Tasks**:
- [ ] TBD (run /plan 7 to create)

**Verification**:
- TBD  

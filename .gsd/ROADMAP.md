# ROADMAP.md

> **Current Milestone**: v5.0 — Fabric PBIP Project Studio & Deneb Vega-Lite Custom Visual Spec Studio
> **Current Status**: Completed & Verified on branch `feat/v5-pbip-deneb-studio`
> **Goal**: Equip PowerLab with two high-leverage developer engines: (1) Fabric PBIP & Report Automation Studio for scaffolding complete, openable Microsoft Fabric Power BI Project (.pbip) folder structures, definition.pbir, registered theme resources, and visual layouts with 1-click zip export; (2) Deneb & Vega-Lite Custom Visual Spec Studio for authoring, customizing, live previewing, and exporting certified Vega-Lite specs with PowerLab palette integration and PBIR visual.json generation.

## Must-Haves (Milestone v5.0)
- [x] **Fabric PBIP Core Scaffolder**: Generate compliant `.pbip` folder structures (`<Name>.pbip`, `<Name>.Report/definition.pbir`, `definition/version.json`, `definition/report.json`, `definition/pages/pages.json`, `page.json`, `visuals/`, `StaticResources/RegisteredResources/`, `.platform`)
- [x] **Dash Canvas to PBIP Export**: Export active wallpaper background + all visual containers directly into a fully structured, ready-to-open Power BI Project (`.pbip.zip`)
- [x] **PBIP Connection & Config Flexibility**: Support `byConnection` (Fabric lakehouse/semantic model) and `byPath` (local model) modes, customizable page names, canvas dimensions, and embedded theme JSON
- [x] **Deneb Vega-Lite Spec Catalog**: Curated library of 20+ certified, high-impact Vega-Lite/Vega visual templates (Bullet charts with target bands, Lollipop/Dumbbell charts, Radial gauge rings, Jitter distribution, Waterfall, Matrix heatmap)
- [x] **Deneb Visual Studio Page**: Interactive workspace with search, category filtering, live template SVG preview, and schema-compliant Vega-Lite spec editor
- [x] **Live Theme Palette Injection**: Seamlessly bind active PowerLab color palette swatches into Deneb spec color scales (`scale.range`)
- [x] **PBIR Visual JSON Generation**: 1-click generation of Deneb PBIR `visual.json` with official GUID (`deneb7E15AEF80B9E4D4F8E12924291ECE89A`) and formatted config
- [x] **Navigation & Landing Page Integration**: Unified into top navigation bar, landing page developer journey, and cross-workspace switchers
- [x] **Testing & Quality Gate**: 100% test pass rate across all suites, zero TypeScript errors, clean Vite production build

## Nice-to-Haves
- [x] In-browser file tree preview showing the generated PBIP directory hierarchy
- [x] Raw JSON vs formatted Vega-Lite code viewer with syntax highlighting
- [x] Direct "Send Layout to PBIP Studio" button in Dash Canvas Layout Planner

## Phases

### Phase 1: Fabric PBIP & Report Automation Core Engine
**Status**: ✅ Completed
**Objective**: Build `src/core/pbip/` core library for generating schema-valid PBIP project directory models, `definition.pbir`, `report.json`, `pages.json`, `page.json`, `visual.json`, registered theme JSON, and JSZip export.

### Phase 2: Deneb & Vega-Lite Custom Visual Spec Engine & Catalog
**Status**: ✅ Completed
**Objective**: Build `src/core/deneb/` with 20+ production-grade Vega-Lite specs, theme palette integration, parameter binding schemas, and PBIR Deneb `visual.json` formatter.

### Phase 3: Deneb Vega-Lite Visual Studio Page
**Status**: ✅ Completed
**Objective**: Build `src/pages/DenebStudioPage.tsx` with search, category filters, template cards, interactive live preview simulator, custom parameter tuning, and one-click copy/download.

### Phase 4: Fabric PBIP Studio Page & Dash Canvas Integration
**Status**: ✅ Completed
**Objective**: Build `src/pages/PbipStudioPage.tsx` with project configuration, interactive folder tree visualizer, file code inspector, and integrate 1-click PBIP export into Dash Canvas.

### Phase 5: Navigation, Landing Page Integration, Testing & Verification
**Status**: ✅ Completed
**Objective**: Wire both studios into header navigation, landing page roadmap, cross-workspace quick switchers, test suites, and verify production build.

## Completed Milestones

### v4.0 — Report Layout Planner, Color Accessibility Checker & DAX Measure Toolkit ✅
### v3.0 — SVG Visual Maker & Power BI DAX Studio ✅
### v2.0 — Multi-Page & Dashboard SVG Generator ✅
### v1.0 — Theme Studio & Color Engine ✅

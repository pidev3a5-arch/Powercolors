# DECISIONS.md — Architecture Decision Records

> **Purpose**: Log significant technical decisions and their rationale.

## Decisions

### [DECISION-001] Client-Side Architecture (React + Vite + TypeScript)

**Date**: 2026-11-19  
**Status**: Accepted  

#### Context
We need a web application to extract color palettes from images and output Power BI Theme JSON files for Power BI developers. Images may contain confidential corporate logos or brand guidelines.

#### Decision
Build a 100% client-side Single Page Application (SPA) using React, TypeScript, Vite, and Tailwind CSS. All pixel processing occurs directly in the browser via HTML5 Canvas.

#### Rationale
- Zero backend requirement; can be deployed free to GitHub Pages, Vercel, or Netlify.
- Maximum privacy: user images and brand assets never leave their local browser.
- Instant, sub-second extraction without network upload latency.

#### Consequences
- Processing is bounded by client device memory and CPU (mitigated by canvas downsampling).

#### Alternatives Considered
- Python Flask/FastAPI backend with OpenCV/scikit-learn (rejected due to server overhead, upload latency, and privacy concerns).

---

### [DECISION-002] Color Extraction: Canvas Downsampling + K-Means + Chroma.js

**Date**: 2026-11-19  
**Status**: Accepted  

#### Context
Images uploaded by users can be high resolution (4K/8K photos or multi-megabyte PNGs). Running clustering on millions of pixels on the main UI thread causes freezing. Transparent logos need special handling.

#### Decision
1. Downscale the source image onto an offscreen HTML5 `<canvas>` with a maximum dimension of 150–200px.
2. Filter out transparent and semi-transparent pixels (`alpha < 128`).
3. Apply K-Means clustering to find 10 cluster centroids in RGB space.
4. Use Chroma.js to deduplicate near-identical shades (CIELAB distance) and generate harmonic tints/shades if the source has fewer than 10 natural colors.

#### Rationale
- Reduces pixel sample count to ~30,000, converging in <30ms with zero UI jank.
- Cleanly handles transparent logos without polluting the palette with transparent/black artifacts.
- Guarantees 10 distinct, usable data colors every time.

#### Alternatives Considered
- Median Cut (ColorThief): Often oversamples flat background areas and misses small accent brand colors.

---

### [DECISION-003] Power BI Theme Schema Compliance

**Date**: 2026-11-19  
**Status**: Accepted  

#### Context
Power BI Desktop requires a strict JSON structure for custom report themes.

#### Decision
Output JSON adhering to the Microsoft Power BI Report Theme schema, containing `$schema`, `name`, `dataColors` (10 items), `background`, `foreground`, `tableAccent`, `good`, `bad`, `neutral`, and `textClasses`.

#### Rationale
- Guaranteed compatibility with Power BI Desktop's *View → Themes → Browse for themes* feature.
- Seamless developer experience with no import warnings or errors.

---

*Last updated: 2026-11-19*

---
phase: 1
plan: 2
wave: 2
depends_on: [1]
---

# Plan 1.2: Core Color Extraction Engine & Unit Tests

## Objective
Implement client-side Canvas pixel downsampling, K-Means clustering, Chroma.js deduplication, 10-color harmonic completion, and structural color derivation, verified with automated unit tests.

## Context
- .gsd/SPEC.md
- .gsd/RESEARCH.md
- .gsd/REQUIREMENTS.md
- .gsd/phases/1/1-PLAN.md

## Tasks

<task type="auto">
  <name>Implement Canvas Downsampling & Pixel Extractor</name>
  <files>src/core/types.ts, src/core/canvasExtractor.ts</files>
  <action>
    - Define domain types in `types.ts` (`RGB`, `HEX`, `ColorSwatch`, `StructuralColors`, `PowerBITheme`, `ExtractionOptions`).
    - Implement `loadImage(source: File | Blob | string): Promise<HTMLImageElement>`.
    - Implement `extractPixels(img: HTMLImageElement, maxSize?: number): RGB[]`:
      - Scale image down to max dimension (e.g. 150px) maintaining aspect ratio.
      - Render onto an offscreen canvas and fetch RGBA pixel data via `getImageData`.
      - Filter out transparent/semi-transparent pixels (`alpha < 128`).
      - Return sanitized array of `RGB` tuples.
  </action>
  <verify>npm run build</verify>
  <done>Pixel extraction accurately scales images and removes transparent pixels.</done>
</task>

<task type="auto">
  <name>Implement K-Means Clustering & Harmonic Padding Engine</name>
  <files>src/core/kmeans.ts, src/core/colorHarmonics.ts, src/core/colorEngine.ts</files>
  <action>
    - Implement K-Means clustering in `kmeans.ts` with convergence tolerance or max iterations (20).
    - Implement `colorHarmonics.ts`:
      - Deduplication: filter out colors closer than threshold Delta E.
      - Palette padding: if cluster count < 10, use Chroma.js to generate harmonious tints, shades, and analogous variants until exactly 10 distinct data colors are produced.
      - Sort colors by perceptual lightness or visual prominence.
    - Implement structural color derivation in `colorEngine.ts`:
      - `background`: `#FFFFFF` (light mode default) or `#1E293B` (dark mode).
      - `foreground`: Contrast-tested text color (WCAG AA).
      - `tableAccent`: Dominant primary brand color.
      - KPI status colors: `good` (#16A34A), `bad` (#DC2626), `neutral` (#EAB308).
  </action>
  <verify>npm run build</verify>
  <done>Engine always returns exactly 10 distinct dataColors and valid structural colors.</done>
</task>

<task type="auto">
  <name>Write Comprehensive Unit Tests for Color Engine</name>
  <files>src/test/colorEngine.test.ts</files>
  <action>
    - Write unit tests for:
      1. K-Means clustering on known synthetic pixel distributions.
      2. Deduplication of near-identical hex colors.
      3. Palette padding ensuring exactly 10 distinct colors when input has only 1, 2, or 3 colors.
      4. Structural color contrast validation (WCAG AA minimum 4.5:1 ratio for text against background).
      5. Full color extraction pipeline end-to-end.
  </action>
  <verify>npm test</verify>
  <done>All unit tests pass with 100% pass rate.</done>
</task>

## Success Criteria
- [ ] Color engine guarantees an array of exactly 10 dataColors for any image input.
- [ ] Low-color images (e.g. 2-color logos) generate pleasing, harmonic palettes.
- [ ] Structural colors are generated with verified contrast against canvas background.
- [ ] All unit tests pass cleanly.

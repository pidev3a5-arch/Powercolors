---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Image Ingestion & Preset System

## Objective
Implement a multi-channel image upload component supporting drag-and-drop, native file selection, global clipboard paste (`Ctrl+V` for screenshot workflows), and pre-packaged sample presets for instantaneous testing.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- src/core/canvasExtractor.ts
- src/core/colorEngine.ts

## Tasks

<task type="auto">
  <name>Build ImageUploader Component with Clipboard & Drag-and-Drop</name>
  <files>src/components/ImageUploader.tsx</files>
  <action>
    - Create `ImageUploader.tsx` supporting:
      1. Drag and drop with animated hover state and MIME validation (image/*).
      2. File dialog input button (PNG, JPG, WebP, SVG).
      3. Global window paste listener (`Ctrl+V`) to directly process clipboard screenshots (e.g. from Snipping Tool).
      4. Visual preview card displaying the loaded image thumbnail, dimensions, file name, and "Change Image" button.
      5. Error handling for non-image files or corrupted images.
  </action>
  <verify>npm run build</verify>
  <done>Images can be loaded via drag-and-drop, file dialog, or clipboard paste.</done>
</task>

<task type="auto">
  <name>Add Sample Preset Selector</name>
  <files>src/data/samplePresets.ts, src/components/ImageUploader.tsx</files>
  <action>
    - Create `src/data/samplePresets.ts` containing curated lightweight sample SVG/DataURI presets:
      1. "Modern Tech" (vibrant blues and cyan)
      2. "Corporate FinTech" (deep navy, emerald, and gold)
      3. "Sunset Analytics" (warm coral, amber, and purple)
      4. "Eco Forest" (earthy greens and teal)
    - Add quick-select preset chips beneath the upload zone so users can test immediately.
  </action>
  <verify>npm run build</verify>
  <done>Clicking a sample preset immediately triggers color extraction.</done>
</task>

## Success Criteria
- [ ] Drag-and-drop works smoothly across modern browsers.
- [ ] Pasting a screenshot with Ctrl+V immediately ingests the image.
- [ ] Sample presets allow 1-click testing without external files.

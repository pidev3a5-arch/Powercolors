---
phase: 2
plan: 2
wave: 2
depends_on: [1]
---

# Plan 2.2: Interactive 10-Swatch Palette Strip & Controls

## Objective
Build the interactive 10-swatch palette display allowing users to edit hex codes, open color pickers, reorder/swap swatches, lock preferred colors, and evaluate WCAG contrast against canvas backgrounds.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- src/core/types.ts
- src/core/colorHarmonics.ts

## Tasks

<task type="auto">
  <name>Build ColorSwatchCard & PaletteStrip Components</name>
  <files>src/components/ColorSwatchCard.tsx, src/components/PaletteStrip.tsx</files>
  <action>
    - Build `ColorSwatchCard`:
      1. Large color preview block with sequence number badge (`#1` to `#10`).
      2. Inline editable HEX input with validation.
      3. Hidden native `<input type="color">` triggered by clicking the swatch.
      4. Lock/Unlock toggle button (preserves swatch during re-extractions).
      5. Left/Right move buttons to change series order.
      6. Quick copy hex button with visual "Copied!" feedback.
    - Build `PaletteStrip`:
      1. Horizontal scrollable / responsive grid container for all 10 swatches.
      2. Toolbar actions: "Shuffle / Reverse Order", "Reset to Extracted", "Lock All / Unlock All".
  </action>
  <verify>npm run build</verify>
  <done>Swatches display sequence, allow hex editing, color picking, and reordering.</done>
</task>

<task type="auto">
  <name>Implement WCAG Contrast Badges & Canvas Theme Switcher</name>
  <files>src/components/ContrastBadge.tsx, src/components/ThemeControls.tsx</files>
  <action>
    - Create `ContrastBadge.tsx`:
      - Shows contrast ratio (e.g. "4.8:1").
      - Computes compliance level: "AAA" (>= 7:1), "AA" (>= 4.5:1), "AA Large / Graphical" (>= 3:1), or "Low Contrast" (< 3:1).
    - Create `ThemeControls.tsx`:
      - Editable Theme Name input.
      - Canvas Background toggle (Light `#FFFFFF` vs Dark `#0F172A`).
      - Contrast overview badge showing overall palette legibility.
  </action>
  <verify>npm run build</verify>
  <done>Contrast ratios compute dynamically against the selected canvas background.</done>
</task>

<task type="auto">
  <name>Integrate Palette State in App.tsx & Add Unit Tests</name>
  <files>src/App.tsx, src/test/paletteManagement.test.ts</files>
  <action>
    - Wire up `App.tsx` with unified state management:
      - Upload image -> automatic extraction -> updates 10 swatches.
      - Handling locked swatches on re-extraction.
      - Swatch swap / reorder operations.
      - Canvas background toggling.
    - Add unit tests in `src/test/paletteManagement.test.ts` for palette reordering, locked color retention, and hex updates.
  </action>
  <verify>npm test</verify>
  <done>All tests pass and the interactive UI functions seamlessly in the browser.</done>
</task>

## Success Criteria
- [ ] Users can edit any of the 10 swatches using text input or native color picker.
- [ ] Swatch sequence can be shifted left/right to adjust Power BI series order.
- [ ] Locked colors are preserved when re-extracting or re-ordering.
- [ ] WCAG contrast ratings update live with canvas light/dark switch.

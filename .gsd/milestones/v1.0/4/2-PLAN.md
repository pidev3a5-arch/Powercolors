---
phase: 4
plan: 2
wave: 2
depends_on: [1]
---

# Plan 4.2: Advanced Visual Styles & Typography Customizer

## Objective
Enable Power BI report creators to customize font families (Segoe UI, Aptos, Arial, DIN, Calibri) and visual container rules (borders, shadows, padding) directly within the theme, verifying output with automated tests.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- .gsd/phases/4/1-PLAN.md
- src/core/powerBiTheme.ts

## Tasks

<task type="auto">
  <name>Extend Theme Options & Typography Support</name>
  <files>src/core/types.ts, src/core/powerBiTheme.ts</files>
  <action>
    - Add `ThemeCustomizationOptions` interface to `types.ts`:
      - `fontFamily`: 'Segoe UI' | 'Aptos' | 'DIN' | 'Arial' | 'Calibri'
      - `showVisualBorders`: boolean
      - `showVisualDropShadow`: boolean
      - `borderRadius`: number
    - Update `buildPowerBITheme` to incorporate font family into `textClasses` (title, label, callout, header) and visualContainer properties.
  </action>
  <verify>npm run build</verify>
  <done>Theme builder integrates font family and visualContainer properties cleanly.</done>
</task>

<task type="auto">
  <name>Build Advanced Theme Customizer Controls & Wire to App.tsx</name>
  <files>src/components/ThemeCustomizer.tsx, src/App.tsx</files>
  <action>
    - Create `ThemeCustomizer.tsx`:
      - Font family picker dropdown.
      - Toggles for Visual Container Border and Drop Shadow.
    - Wire into `App.tsx` and integrate with `JsonThemeModal` and `ReportCanvas`.
  </action>
  <verify>npm run build</verify>
  <done>Custom options reactively update theme JSON and canvas appearance.</done>
</task>

<task type="auto">
  <name>Add Unit Tests for Theme Customization and Export</name>
  <files>src/test/themeExport.test.ts</files>
  <action>
    - Write unit tests in `src/test/themeExport.test.ts` verifying:
      1. Custom font family propagation to `textClasses`.
      2. Drop shadow and border flags propagation to `visualStyles`.
      3. Complete schema validation of customized themes.
      4. Safe file slug naming for various special character inputs.
  </action>
  <verify>npm test</verify>
  <done>All unit tests pass with 100% pass rate.</done>
</task>

## Success Criteria
- [ ] Changing font family updates the `textClasses` object in the generated theme JSON.
- [ ] Toggling container borders and drop shadows updates the `visualStyles` object.
- [ ] All unit tests pass cleanly.

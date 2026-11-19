---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Theme JSON Inspector Modal & Schema Validation

## Objective
Build an interactive modal dialog allowing Power BI developers to inspect, syntax-highlight, validate against Microsoft's schema, copy, and download the full Power BI Theme JSON.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- src/core/powerBiTheme.ts
- src/core/types.ts

## Tasks

<task type="auto">
  <name>Build JsonThemeModal Component with Code Viewer</name>
  <files>src/components/JsonThemeModal.tsx</files>
  <action>
    - Create `JsonThemeModal.tsx`:
      - Accessible modal overlay with backdrop blur.
      - Syntax-styled JSON code viewer with copy-to-clipboard and formatted download actions.
      - Display file size and slugified export filename (e.g. `contoso-sales-theme.json`).
      - Step-by-step guidance on how to import into Power BI Desktop (*View → Themes → Browse for themes*).
  </action>
  <verify>npm run build</verify>
  <done>Modal renders formatted JSON with working copy and download actions.</done>
</task>

<task type="auto">
  <name>Build Schema Validation Checklist</name>
  <files>src/components/SchemaValidationCard.tsx, src/core/powerBiTheme.ts</files>
  <action>
    - Create `SchemaValidationCard.tsx`:
      - Runs `validatePowerBITheme` and displays an interactive compliance badge.
      - Displays itemized checklist: Schema URL, 10 valid HEX dataColors, Structural background/foreground/tableAccent, KPI statuses, textClasses.
  </action>
  <verify>npm run build</verify>
  <done>Validates current theme state against Microsoft schema requirements.</done>
</task>

## Success Criteria
- [ ] Users can open the JSON inspector from the top navigation bar or export button.
- [ ] Schema validation provides instant green-light verification before downloading.
- [ ] Downloading creates a clean, valid `.json` file.

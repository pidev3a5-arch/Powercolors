# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A modern, privacy-first, client-side web application that enables Power BI developers to upload any image (logos, branding guidelines, screenshots, photos) and instantly extract a cohesive 10-color data palette alongside structural theme colors (background, text, cards, table accents), preview the theme on realistic Power BI visual mocks, customize individual swatches, and export an official Power BI Theme JSON file ready to import directly into Power BI Desktop.

## Goals
1. **Client-Side Image Ingestion & Processing**: Support drag-and-drop, file browsing, and clipboard paste for images (PNG, JPEG, WebP, SVG) with 100% in-browser processing for instant speed and data privacy.
2. **Intelligent 10-Color Palette Extraction**: Quantize and extract 10 distinct, balanced data colors suitable for data visualization, plus automatically derive structural report colors (canvas background, text/foreground, card containers, table accents).
3. **Interactive Palette Customization**: Allow users to inspect hex/RGB values, reorder colors, lock favorites, manually adjust hex values with a color picker, and check color contrast/readability.
4. **Live Power BI Visual Preview**: Provide an interactive mock report canvas simulating standard Power BI visuals (KPI cards, stacked/clustered bar charts, line trends, donut charts, and styled tables) that react live to palette changes.
5. **Compliant Power BI Theme Export**: Generate and download a standard, schema-compliant Power BI Theme JSON file with custom naming, verified to import seamlessly via *View → Themes → Browse for themes* in Power BI Desktop.

## Non-Goals (Out of Scope)
- Cloud image hosting or user authentication backend (app is fully static and client-side).
- Direct Power BI Service XMLA / REST API publishing (focus is on downloadable theme JSON).
- PBIR report template creation or report layout builder.
- Automatic vectorization or image editing features beyond palette extraction.

## Users
Power BI report developers, BI consultants, and data analysts who need to quickly create professional, brand-accurate, accessible Power BI report themes from company logos, marketing assets, or design guidelines without manually sampling hex codes.

## Constraints
- **Platform**: Modern web browser (Chrome, Edge, Firefox, Safari).
- **Architecture**: Single Page Application (SPA) using React, TypeScript, Vite, and Tailwind CSS.
- **Power BI Compatibility**: Strictly adheres to the Microsoft Power BI Desktop theme JSON schema (`name`, `dataColors`, `background`, `foreground`, `tableAccent`, `visualStyles`).
- **Privacy**: No user assets or images leave the user's browser.

## Success Criteria
- [ ] Users can upload, drag-and-drop, or paste any common image format and see extracted colors in under 1 second.
- [ ] Exactly 10 harmonious data colors are extracted and ordered by visual prominence and contrast.
- [ ] Extracted JSON file imports into Power BI Desktop with zero syntax or format errors.
- [ ] Mock Power BI visuals accurately reflect real-world report aesthetics and update instantly.
- [ ] Users can edit/reorder any swatch before exporting.

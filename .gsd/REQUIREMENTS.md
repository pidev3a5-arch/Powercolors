# REQUIREMENTS.md

## Requirements Matrix

| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | Drag-and-drop, file browsing, and clipboard paste image input supporting PNG, JPG/JPEG, WebP, and SVG | SPEC Goal 1 | Satisfied |
| REQ-02 | Client-side HTML5 Canvas downsampling (<200px) and RGBA pixel extraction with transparency filter (`alpha >= 128`) | SPEC Goal 1 | Satisfied |
| REQ-03 | K-Means color quantization algorithm extracting 10 distinct dominant clusters in <100ms in-browser | SPEC Goal 2 | Satisfied |
| REQ-04 | Intelligent palette padding/harmonics (using Chroma.js) when an image contains fewer than 10 distinct colors | SPEC Goal 2 | Satisfied |
| REQ-05 | Automatic derivation of structural colors (`background`, `foreground`, `tableAccent`, `good`, `bad`, `neutral`) with light/dark contrast verification | SPEC Goal 2 | Satisfied |
| REQ-06 | Interactive color palette strip displaying 10 swatches with HEX/RGB, copy-to-clipboard, and manual color picker editing | SPEC Goal 3 | Satisfied |
| REQ-07 | Drag-to-reorder, swap, or lock individual swatches in the 10-color dataColors sequence | SPEC Goal 3 | Satisfied |
| REQ-08 | Contrast ratio indicator (WCAG AA/AAA) between data colors and report background | SPEC Goal 3 | Satisfied |
| REQ-09 | Live interactive Power BI report canvas preview including KPI cards, Bar/Column chart, Line chart, Donut chart, and Table/Matrix visual | SPEC Goal 4 | Pending |
| REQ-10 | Light/Dark canvas preview toggle to visualize report appearance on light and dark backgrounds | SPEC Goal 4 | Satisfied |
| REQ-11 | Editable Theme Name input with instant slugified filename generation | SPEC Goal 5 | Satisfied |
| REQ-12 | Generation of schema-compliant Power BI Theme JSON with `$schema`, `name`, `dataColors` (10 items), structural colors, and `textClasses` | SPEC Goal 5 | Satisfied |
| REQ-13 | One-click `.json` theme download button with browser Blob export | SPEC Goal 5 | Satisfied |
| REQ-14 | One-click "Copy JSON" to clipboard with toast notification | SPEC Goal 5 | Satisfied |

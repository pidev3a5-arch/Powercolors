# RESEARCH.md — Architecture & Technical Investigation

## 1. Color Extraction & Quantization in the Browser

### Algorithms Compared
- **Median Cut Quantization (MMCQ / quantize / ColorThief)**:
  - *Pros*: Fast, deterministic, divides color box into octrees/cubes with equal number of pixels.
  - *Cons*: Can over-represent background/dominant flat colors while missing accent colors in logos or brand guidelines.
- **K-Means Clustering with HTML5 Canvas (Selected Approach)**:
  - *Pros*: Finds true perceptual cluster centroids of dominant colors.
  - *Optimization*: Downsample image to a max dimension of 150–200px before pixel extraction. Reduces pixel count from ~8M (4K) to ~30k pixels, making K-Means converge in < 30ms directly in the browser thread.
  - *Alpha filtering*: Discard transparent/near-transparent pixels (`alpha < 128`), essential for transparent PNG/SVG logos.

### Palette Balancing & Chroma.js Integration
- **Deduplication via Color Distance (Delta E / CIELAB)**:
  - Ensure extracted colors are visually distinct by enforcing a minimum perceptual distance.
- **Palette Completion for Low-Color Images**:
  - When an image (e.g. a 2-color brand logo) does not naturally have 10 distinct colors, use Chroma.js to intelligently generate harmonic tints, shades, or analogous tones so `dataColors` is always populated with 10 high-quality, distinct colors.
- **Perceptual Sorting**:
  - Sort colors by perceptual luminance (`lch.l`) or hue for visual harmony in charts.

---

## 2. Power BI Theme JSON Specification

### Official Schema & Structure
Power BI Desktop accepts a custom theme via *View → Themes → Browse for themes*. The theme JSON adheres to the Microsoft Power BI Report Theme JSON Schema (`reportThemeSchema-latest.json`):

```json
{
  "name": "Custom Extracted Theme",
  "$schema": "https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-latest.json",
  "dataColors": [
    "#2563EB", "#7C3AED", "#DB2777", "#EA580C", "#D97706",
    "#059669", "#0D9488", "#0284C7", "#4F46E5", "#9333EA"
  ],
  "background": "#FFFFFF",
  "foreground": "#1E293B",
  "tableAccent": "#2563EB",
  "good": "#16A34A",
  "bad": "#DC2626",
  "neutral": "#EAB308",
  "textClasses": {
    "title": { "fontFamily": "Segoe UI", "fontSize": 12, "color": "#1E293B" },
    "label": { "fontFamily": "Segoe UI", "fontSize": 10, "color": "#475569" }
  },
  "visualStyles": {
    "*": {
      "*": {
        "visualContainer": [{
          "dropShadow": { "show": false },
          "border": { "show": true, "color": { "solid": { "color": "#E2E8F0" } } }
        }]
      }
    }
  }
}
```

### Key Elements for Power BI Developers
1. **`dataColors`**: Exactly 10 HEX color strings used sequentially for series in bar charts, column charts, pie/donut charts, and scatter plots.
2. **Structural Colors**: `background` (canvas/page background), `foreground` (default labels/text), and `tableAccent` (matrix headers, table highlights).
3. **KPI Indicators**: `good`, `bad`, and `neutral` for status metrics.

---

## 3. Technology Choices & Rationale

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | React 19 + TypeScript + Vite | Ultra-fast development, static build, robust type safety. |
| **Styling** | Tailwind CSS | Rapid prototyping, responsive utilities, seamless dark/light styling. |
| **Icons** | Lucide React | Modern, clean UI iconography. |
| **Color Engine** | Chroma.js | Industry standard for color conversions, CIELAB delta, contrast ratios, and palette harmonics. |
| **Quantization** | Custom Downsampled Canvas K-Means + Alpha Filtering | Zero third-party runtime dependencies for extraction, fast execution, custom tuning for 10 data colors. |
| **Delivery** | Static Client-Side SPA | 100% private, zero server footprint, deployable to GitHub Pages/Vercel/Netlify. |

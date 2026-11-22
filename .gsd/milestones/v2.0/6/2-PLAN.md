---
phase: 6
plan: 2
wave: 2
depends_on:
  - 6.1
files_modified:
  - src/components/LandingHero.tsx
  - src/components/FeatureGrid.tsx
  - src/pages/LandingPage.tsx
  - src/App.tsx
autonomous: true

must_haves:
  truths:
    - Landing Page is the default landing view welcoming users to PowerLab.
    - Page features high-converting hero section with Playful Geometric aesthetic (Memphis confetti, 2px borders, hard drop shadows, candy buttons).
    - Features showcase spotlights both Theme Generator and Dash Generator with direct launch CTAs.
    - Responsive on mobile (360px+), tablet, and desktop viewports.
  artifacts:
    - src/pages/LandingPage.tsx
    - src/components/LandingHero.tsx
    - src/components/FeatureGrid.tsx
---

# Plan 6.2: High-Converting Playful Geometric Landing Page

<objective>
Build a vibrant, conversion-oriented Landing Page for PowerLab that introduces the platform as an all-in-one Power BI design companion. Showcase both core suites: the Theme Generator (palette extraction and official schema JSON) and the Dash Generator (canvas layout and SVG background builder), guiding users seamlessly into each tool.

Purpose: Gives PowerLab a world-class front door that immediately communicates value, establishes design authority, and routes report creators to the right design tool.
Output: `LandingHero.tsx`, `FeatureGrid.tsx`, and `LandingPage.tsx`.
</objective>

<context>
- .gsd/ROADMAP.md
- src/App.tsx
- src/core/types.ts
- src/index.css
</context>

<tasks>

<task type="auto">
  <name>Build LandingHero with Tactile CTAs and Interactive Teaser</name>
  <files>src/components/LandingHero.tsx</files>
  <action>
    - Create `src/components/LandingHero.tsx`:
      - Bold headline in Outfit font: *"The Playful Power BI Design Studio"*.
      - Subtitle in Plus Jakarta Sans: *"Generate official 10-color report themes and custom SVG canvas backgrounds in seconds — 100% in-browser privacy."*
      - Two prominent candy button CTAs:
        1. **Launch Theme Generator** (`bg-[#8B5CF6]` violet candy button with palette icon).
        2. **Build Canvas SVG** (`bg-[#F472B6]` hot pink candy button with layout icon).
      - Interactive visual teaser / sticker mockup previewing real Power BI visuals, color swatches, and dashboard grid geometry with hard offset shadows.
      - Trust badges: "Official PBI Schema", "Zero Cloud Storage", "100% Free & Open Source".
    AVOID: Generic corporate illustrations or blurry drop shadows; stick strictly to the Playful Geometric design tokens (2px solid `#1E293B`, offset hard shadows, dot grid background).
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>LandingHero renders with responsive typography, candy CTAs, and tactile visual teaser.</done>
</task>

<task type="auto">
  <name>Build FeatureGrid & 3-Step Workflow Section</name>
  <files>src/components/FeatureGrid.tsx</files>
  <action>
    - Create `src/components/FeatureGrid.tsx`:
      - **Tool Spotlight 1: Theme Generator**
        - Color extraction from logos & screenshots with K-Means.
        - Automated WCAG contrast ratio scoring & locks.
        - Guaranteed schema-compliant Power BI Theme JSON.
        - CTA button: "Open Theme Studio →".
      - **Tool Spotlight 2: Dash Generator (Power BI Canvas SVG)**
        - Empty canvas layout builder with 1280x720 and 1920x1080 presets.
        - Top and Left navigation bars with custom report branding & icon packs.
        - Modular visual containers with customizable titles/subtitles.
        - 1-click pixel-perfect `.svg` background export for Power BI wallpaper.
        - CTA button: "Explore Dash Canvas →".
      - **How It Works / 3-Step Walkthrough**:
        - Step 1: Upload brand logo or pick canvas layout.
        - Step 2: Customize swatches, nav buttons, and card slots.
        - Step 3: Export verified `.json` theme or `.svg` canvas into Power BI Desktop.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>FeatureGrid component compiles and cleanly presents both product capabilities.</done>
</task>

<task type="auto">
  <name>Assemble LandingPage & Wire Page Transitions</name>
  <files>src/pages/LandingPage.tsx, src/App.tsx</files>
  <action>
    - Create `src/pages/LandingPage.tsx`:
      - Combine `LandingHero`, `FeatureGrid`, and a bottom call-to-action banner ("Ready to elevate your Power BI reports?").
      - Hook up all CTA click events to `onNavigate('theme-generator')` and `onNavigate('dash-generator')`.
    - Update `src/App.tsx`:
      - Mount `LandingPage` as the default landing view.
      - Add smooth scrolling to top when switching pages.
  </action>
  <verify>npm test && npm run build</verify>
  <done>Landing page is fully navigable, beautiful on all device sizes, and passes all tests.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Run `npm test` — all test suites pass with 0 regressions.
- [ ] Run `npm run build` — production build succeeds with 0 TypeScript errors.
- [ ] Test mobile viewport (360px & 390px) to verify no horizontal overflow or clipping.
</verification>

<success_criteria>
- [ ] PowerLab welcomes visitors with an engaging, high-taste Playful Geometric landing page.
- [ ] Both core design tools (Theme Generator and Dash Generator) have prominent launch points.
- [ ] Full navigation flow functions seamlessly between Landing, Theme Studio, and Dash Canvas.
</success_criteria>

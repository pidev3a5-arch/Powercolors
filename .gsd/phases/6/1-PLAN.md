---
phase: 6
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/core/types.ts
  - src/components/NavigationHeader.tsx
  - src/pages/ThemeGeneratorPage.tsx
  - src/pages/DashGeneratorPage.tsx
  - src/App.tsx
autonomous: true

must_haves:
  truths:
    - User can switch between Landing Page, Theme Generator, and Dash Generator via top navigation tabs.
    - The existing Theme Generator studio (palette extraction, swatch customization, live canvas, JSON modal, theme download) remains 100% functional with zero regressions.
    - Navigation header is responsive, tactile, and adheres to Playful Geometric design tokens.
  artifacts:
    - src/pages/ThemeGeneratorPage.tsx
    - src/pages/DashGeneratorPage.tsx
    - src/components/NavigationHeader.tsx
---

# Plan 6.1: Multi-Page Routing Architecture & Navigation Shell

<objective>
Introduce a modular client-side page routing architecture to support three distinct app views: Landing Page, Theme Generator, and Dash Generator. Extract the current Theme Studio into an isolated page component, build a responsive Playful Geometric navigation header, and provide a placeholder view for the Dash Generator.

Purpose: Transforms PowerLab from a single-screen utility into an integrated Power BI design suite with dedicated workspaces for themes and dashboard backgrounds.
Output: `NavigationHeader.tsx`, `ThemeGeneratorPage.tsx`, `DashGeneratorPage.tsx`, and a refactored `App.tsx` router shell.
</objective>

<context>
- .gsd/ROADMAP.md
- src/App.tsx
- src/core/types.ts
- src/index.css
</context>

<tasks>

<task type="auto">
  <name>Define App Routing Types & Navigation State</name>
  <files>src/core/types.ts</files>
  <action>
    - Add page identifier type to `src/core/types.ts`:
      ```typescript
      export type AppPage = 'landing' | 'theme-generator' | 'dash-generator';
      ```
    - Ensure all existing types remain backward-compatible.
    AVOID: Complex external routing libraries (react-router, etc.) because PowerLab is a fast client-side SPA with state synchronization best managed through lightweight reactive state and hash/view switching.
  </action>
  <verify>npm test</verify>
  <done>AppPage type is defined and exported without breaking existing types.</done>
</task>

<task type="auto">
  <name>Extract Theme Studio into ThemeGeneratorPage Component</name>
  <files>src/pages/ThemeGeneratorPage.tsx</files>
  <action>
    - Create `src/pages/ThemeGeneratorPage.tsx`:
      - Move the main Theme Studio content (hero title, image dropzone, presets, palette strip, theme controls, live mock canvas, and secondary download card) from `App.tsx` into this page component.
      - Receive `onNavigate(page: AppPage)` prop so user can jump to the Dash Generator or back to Landing.
      - Ensure all existing callbacks, image extraction, swatch locks, and theme synchronization remain completely intact.
    AVOID: Breaking existing props or modifying child components unnecessarily.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>ThemeGeneratorPage compiles cleanly as a self-contained page component.</done>
</task>

<task type="auto">
  <name>Build Responsive Playful Geometric Navigation Header & Shell</name>
  <files>src/components/NavigationHeader.tsx, src/pages/DashGeneratorPage.tsx, src/App.tsx</files>
  <action>
    - Create `src/components/NavigationHeader.tsx`:
      - Logo with `LOGO - POWERBI BLQ.png` and wordmark `PowerLab`.
      - Navigation tabs: `Home` (`'landing'`), `Theme Studio` (`'theme-generator'`), and `Dash Canvas` (`'dash-generator'`) with active tactile candy pill styling (`bg-[#8B5CF6] text-white` with hard shadow when active).
      - Action toolbar with theme switcher (sun/moon), JSON inspector button, and quick-download actions when on Theme Studio page.
      - Mobile drawer / compact selector so all 3 pages are reachable on narrow screens without collision.
    - Create `src/pages/DashGeneratorPage.tsx`:
      - A welcoming placeholder workspace introducing the upcoming Dash Generator capabilities (canvas layout, nav bar, visual slots, SVG export) with a "Coming in Phase 7" badge and quick link to the Theme Studio.
    - Update `src/App.tsx`:
      - Wire `currentPage` state (persisted in localStorage or default to `'landing'`).
      - Render `NavigationHeader`, current active page (`LandingPage` / `ThemeGeneratorPage` / `DashGeneratorPage`), and common playful footer.
  </action>
  <verify>npm test && npm run build</verify>
  <done>User can switch between pages smoothly and existing unit tests pass 100%.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Run `npm test` — all 29 tests pass.
- [ ] Run `npm run build` — TypeScript and Vite production bundle compile with 0 errors.
- [ ] Clicking nav tabs switches between pages smoothly without page reload.
</verification>

<success_criteria>
- [ ] Three accessible views exist in the navigation hierarchy.
- [ ] Existing palette generation, contrast checks, and Power BI theme export functions work identically without regressions.
</success_criteria>

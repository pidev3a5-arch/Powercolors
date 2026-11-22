import React from 'react';
import {
  Palette,
  Layout,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Terminal,
  Wand2,
  Image,
  Compass,
  Check,
} from 'lucide-react';
import { AppPage } from '../core/types';

interface FeatureGridProps {
  onNavigate: (page: AppPage) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onNavigate }) => {
  const journeyStages = [
    {
      step: '01',
      title: 'Brand & Palette Architecture',
      subtitle: 'Theme Studio & Palette Harmony',
      desc: 'Ingest company branding or explore color-wheel harmonies to establish 10 compliant data colors with full WCAG contrast.',
      page: 'theme-generator' as AppPage,
      color: '#8B5CF6',
      badge: 'Theme Architecture',
    },
    {
      step: '02',
      title: 'Canvas Wallpaper & Grid Shell',
      subtitle: 'Dash Canvas & Layout Planner',
      desc: 'Design pixel-accurate 16:9/4:3 SVG wallpapers with navigation ribbons, header clearance, and 8px snap-to-grid card slots.',
      page: 'dash-generator' as AppPage,
      color: '#F472B6',
      badge: 'Canvas Layout',
    },
    {
      step: '03',
      title: 'Micro-Visuals & Icon System',
      subtitle: 'SVG Visual Maker & Icon Library',
      desc: 'Inject inline DAX sparklines, bullet bars, and 120+ vector icons into tables & cards using the Image URL data category.',
      page: 'icon-library' as AppPage,
      color: '#38BDF8',
      badge: 'Visual Storytelling',
    },
    {
      step: '04',
      title: 'Analytical Modeling & DAX Logic',
      subtitle: 'DAX Measure Toolkit (56 Measures)',
      desc: 'Deploy 56 battle-tested measures for 3-state conditional formatting, dynamic slicer headers, Pareto ABC, CAGR, and time intelligence.',
      page: 'dax-toolkit' as AppPage,
      color: '#FBBF24',
      badge: 'DAX Modeling',
    },
    {
      step: '05',
      title: 'Executive C-Suite Delivery',
      subtitle: 'Zero Clutter & Instant Clarity',
      desc: 'Import your theme.json, SVG background, and DAX measures into Power BI Desktop for a presentation-grade report in under 5 seconds.',
      page: 'landing' as AppPage,
      color: '#34D399',
      badge: 'Production Delivery',
    },
  ];

  return (
    <div className="w-full space-y-16 py-6">
      {/* SECTION 1: THE POWER BI DEVELOPER ROADMAP */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 text-xs font-heading font-black border border-[#8B5CF6]/30">
            <Compass className="w-3.5 h-3.5" />
            <span>THE END-TO-END POWER BI DEVELOPER PLAYBOOK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight">
            The 5-Stage Journey to Report Perfection
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Stop starting Power BI projects with a blank white screen and disconnected measures. Follow this battle-tested roadmap from raw client requirements to executive delivery.
          </p>
        </div>

        {/* 5-Stage Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {journeyStages.map((stage, idx) => (
            <div
              key={stage.step}
              onClick={() => stage.page !== 'landing' && onNavigate(stage.page)}
              className={`pop-card group relative p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] flex flex-col justify-between space-y-4 transition-all ${
                stage.page !== 'landing' ? 'cursor-pointer hover:-translate-y-1' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="w-8 h-8 rounded-xl border-2 border-[#1E293B] flex items-center justify-center text-xs font-heading font-black text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.step}
                  </span>
                  <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-[#1E293B]/20">
                    {stage.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-heading font-black text-[#1E293B] dark:text-white leading-snug">
                    {stage.title}
                  </h3>
                  <span className="text-[11px] font-heading font-bold text-[#8B5CF6] block mt-1">
                    {stage.subtitle}
                  </span>
                </div>

                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {stage.page !== 'landing' ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(stage.page);
                  }}
                  className="pop-btn w-full inline-flex items-center justify-between px-3 py-2 rounded-xl text-xs font-heading font-black bg-slate-50 dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] group-hover:bg-[#FBBF24] transition-all cursor-pointer"
                >
                  <span>Enter Stage {idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              ) : (
                <div className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-600/40">
                  <Check className="w-3.5 h-3.5" />
                  <span>Production Ready</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: SIX SPECIALIZED WORKSPACES */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] text-xs font-heading font-black border border-[#34D399]/30">
            <span>SUITE OF POWER BI SPECIALIZED WORKSPACES</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white">
            Everything You Need in One Unified Studio
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Switch effortlessly between theme quantization, color harmonies, canvas layout planning, SVG micro-charts, icon picker, and 56 DAX calculation patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {/* Workspace 1: Theme Studio */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Palette className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] border border-[#34D399]/40">
                  Stage 1: Theme
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Theme Studio
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Extract balanced 10-color palettes from company logos or dashboard snapshots. Live preview on native charts and export official schema-compliant Power BI themes.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>K-Means clustering with WCAG contrast ratio badges</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>Auto-derived structural colors (background, table accents)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>100% compliant with Microsoft reportThemeSchema</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('theme-generator')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Open Theme Studio</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Workspace 2: Palette Harmony Generator */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Wand2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/40">
                  New Feature
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Palette Harmony
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Generate color theory harmonies (Analogous, Triadic, Split-Comp, Golden Spiral) with automatic 9-step shade scales (50-900) and live visual testing.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span>Color wheel geometry (Triadic, Split-Comp, Monochromatic)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span>9-step luminance ladder (50 to 900) for each color</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span>1-click export to theme.json and push to Theme Studio</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('palette-harmony')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Explore Palette Harmony</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Workspace 3: Dash Canvas & Layout Planner */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Layout className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#F472B6]/20 text-[#EC4899] dark:text-[#F472B6] border border-[#F472B6]/40">
                  Stage 2: Canvas
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Dash Canvas & Layout
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Build pixel-perfect Power BI wallpaper backgrounds in SVG format. Use Tab 4 Layout Planner with curated presets that automatically respect header and navigation clearances.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] flex-shrink-0 mt-0.5" />
                  <span>1920×1080 and 1280×720 aspect ratio presets</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] flex-shrink-0 mt-0.5" />
                  <span>Side & Top navigation ribbons with custom icons</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] flex-shrink-0 mt-0.5" />
                  <span>Integrated 4th Tab Layout Planner: 8px snap grid & card sync</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('dash-generator')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Open Dash Canvas</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Workspace 4: SVG Visual Maker */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#38BDF8] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#38BDF8]/20 text-[#0284C7] dark:text-[#38BDF8] border border-[#38BDF8]/40">
                  Stage 3: Micro-Visuals
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  SVG Visual Maker
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Generate dozens of error-free Power BI DAX micro-charts for table and matrix cells: sparklines, gauges, progress rings, and IBCS variance bars.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <span>Gauges with track, outline & needle (40%, 55%, 80%)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <span>Traffic-light progress rings and IBCS variance data bars</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <span>1-click DAX measures with Image URL data category</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('svg-visual-maker')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Launch Visual Maker</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Workspace 5: Icon Library & SVG Picker */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#10B981] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Image className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] border border-[#10B981]/40">
                  120+ Icons
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Icon Library & SVG Picker
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Searchable library of 120+ business icons. Customize stroke colors, sizes, and badge backgrounds, then copy 1-click DAX ImageUrl measures or download .svg.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span>5 categories: Navigation, Finance, Analytics, Status, Logistics</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span>Live color customizer, stroke widths, and badge containers</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span>Outputs clean data:image/svg+xml;utf8,... DAX strings</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('icon-library')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#10B981] hover:bg-[#059669] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Browse Icon Library</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Workspace 6: DAX Measure Toolkit */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#6366F1] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Terminal className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#6366F1]/20 text-[#4F46E5] dark:text-[#818CF8] border border-[#6366F1]/40">
                  56 DAX Measures
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  DAX Measure Toolkit
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  56 production-grade DAX measures. Live placeholder substitution, performance tips, and 1-click copy for conditional formatting colors, dynamic titles, Pareto, CAGR, and retention.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                  <span>Conditional formatting hex rules for backgrounds & font contrast</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                  <span>Dynamic titles (single/multi slicers, date breadcrumbs)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics: CAGR, Pareto ABC, Churn, Moving Medians</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('dax-toolkit')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Explore 56 DAX Measures</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Palette, Layout, ArrowRight, CheckCircle2, Sparkles, Grid } from 'lucide-react';
import { AppPage } from '../core/types';

interface FeatureGridProps {
  onNavigate: (page: AppPage) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onNavigate }) => {
  return (
    <div className="w-full space-y-16 py-6">
      {/* 4 Core Tools Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/20 text-[#0284C7] dark:text-[#38BDF8] text-xs font-heading font-black border border-[#38BDF8]/30">
            <span>FOUR SPECIALIZED WORKSPACES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white">
            Everything You Need to Style Power BI
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Switch effortlessly between color harmonization, canvas wallpaper building, SVG DAX micro-visuals, and pixel-accurate visual layout planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
          {/* Spotlight 1: Theme Studio */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Palette className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] border border-[#34D399]/40">
                  Ready to Use
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Theme Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Extract balanced 10-color palettes from company logos or dashboard snapshots. Test instantly on live charts and export official schema-compliant Power BI themes.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>K-Means clustering with WCAG 2.1 contrast ratio badges</span>
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

          {/* Spotlight 2: Dash Generator */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Layout className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#FBBF24]/20 text-[#D97706] dark:text-[#FBBF24] border border-[#FBBF24]/40">
                  SVG Wallpaper
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Dash Canvas
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Start from an empty canvas and build pixel-perfect Power BI wallpaper backgrounds in SVG format. Configure navigation ribbons, branding logos, and visual shape slots.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] flex-shrink-0 mt-0.5" />
                  <span>1920×1080 and 1280×720 aspect ratio presets</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] flex-shrink-0 mt-0.5" />
                  <span>Top & Left navigation ribbons with custom icons</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] flex-shrink-0 mt-0.5" />
                  <span>Card and chart container slots with title / subtitle toggles</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('dash-generator')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Explore Dash Canvas</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Spotlight 3: SVG Visual Maker */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#38BDF8] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/40">
                  New v3.0
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  SVG Visual Maker
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Generate dozens of error-free Power BI DAX micro-visuals for table and matrix cells. Gauges, progress rings, bullet bars, and custom SVG converters.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <span>Gauges with track, outline & needle (40%, 55%, 80%)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <span>Traffic-light progress rings and 100% checkmarks</span>
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

          {/* Spotlight 4: Report Layout Planner */}
          <div className="pop-card bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]">
                  <Grid className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/40">
                  New v4.0
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
                  Layout Planner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Design pixel-accurate visual placements with snap-to-grid alignment. Export exact X, Y, Width, and Height coordinates for Power BI Desktop.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>Interactive canvas with 8px Power BI snap grid</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>1-click export to Markdown table, CSV, and PBIR</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <span>Curated layouts: Executive, Finance, Mobile</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('layout-planner')}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer group"
            >
              <span>Launch Layout Planner</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 3-Step Walkthrough */}
      <section className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24]/20 text-[#D97706] dark:text-[#FBBF24] text-xs font-heading font-black border border-[#FBBF24]/30">
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl font-heading font-black text-[#1E293B] dark:text-white">
            From Idea to Power BI in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="pop-card bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[4px_4px_0px_0px_#1E293B] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center font-heading font-black text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
              1
            </div>
            <h4 className="text-lg font-heading font-black text-[#1E293B] dark:text-white">
              Upload or Select Preset
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Drop brand logo, upload screenshot, or choose from tailored presets like Modern Tech, Corporate Blue, or Energetic Warm.
            </p>
          </div>

          <div className="pop-card bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[4px_4px_0px_0px_#1E293B] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#34D399] border-2 border-[#1E293B] flex items-center justify-center font-heading font-black text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
              2
            </div>
            <h4 className="text-lg font-heading font-black text-[#1E293B] dark:text-white">
              Harmonize & Preview Live
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Fine-tune swatches, inspect real-time WCAG contrast ratios, lock favorite shades, and preview metrics on the mock canvas.
            </p>
          </div>

          <div className="pop-card bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[4px_4px_0px_0px_#1E293B] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center font-heading font-black text-white shadow-[2px_2px_0px_0px_#1E293B]">
              3
            </div>
            <h4 className="text-lg font-heading font-black text-[#1E293B] dark:text-white">
              Export to Power BI
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Download the official schema-verified theme JSON or canvas SVG wallpaper. Import in 1 click into Power BI Desktop.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pt-6">
        <div className="pop-card relative bg-[#8B5CF6] text-white p-8 sm:p-12 rounded-3xl border-3 border-[#1E293B] shadow-[6px_6px_0px_0px_#1E293B] text-center space-y-5 overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black border border-[#1E293B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>START CREATING NOW</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-heading font-black tracking-tight leading-tight">
              Ready to Upgrade Your Power BI Reports?
            </h3>
            <p className="text-white/90 text-sm sm:text-base font-medium">
              Join report designers using PowerLab to create branded, high-contrast dashboards with zero effort.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('theme-generator')}
                className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-heading font-black bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
              >
                <Palette className="w-4 h-4 stroke-[2.5]" />
                <span>Launch Theme Studio</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dash-generator')}
                className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-heading font-black bg-white hover:bg-slate-100 text-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
              >
                <Layout className="w-4 h-4 stroke-[2.5]" />
                <span>Build Canvas Background</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

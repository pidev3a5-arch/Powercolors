import React from 'react';
import { Palette, Layout, Sparkles, ArrowRight, ShieldCheck, Zap, Download } from 'lucide-react';
import { AppPage } from '../core/types';

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <div className="relative text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B]">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>The Playful Power BI Companion</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white leading-[1.1]">
          Design Stunning <span className="text-[#8B5CF6]">Power BI Reports</span> in Seconds
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
          Extract 10-color themes with official schema validation, or build custom SVG canvas layouts with navigation ribbons and card slots — 100% free and client-side private.
        </p>

        {/* Dual CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={() => onNavigate('theme-generator')}
            className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[4px_4px_0px_0px_#1E293B] transition-all cursor-pointer"
          >
            <Palette className="w-5 h-5 stroke-[2.5]" />
            <span>Launch Theme Studio</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dash-generator')}
            className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white shadow-[4px_4px_0px_0px_#1E293B] transition-all cursor-pointer"
          >
            <Layout className="w-5 h-5 stroke-[2.5]" />
            <span>Build Canvas SVG</span>
          </button>
        </div>

        {/* Value Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#1E293B]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>100% In-Browser Privacy</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#1E293B]/20">
            <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Sub-100ms Quantization</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#1E293B]/20">
            <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Official Power BI Schema</span>
          </span>
        </div>
      </div>

      {/* Two Core Workspaces Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Card 1: Theme Generator */}
        <div className="pop-card bg-white dark:bg-slate-900 p-7 sm:p-8 rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1E293B]">
              <Palette className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
              Theme Studio
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Drop brand assets or screenshots to extract 10 balanced data colors using fast K-Means. Test on live visuals and export verified Power BI theme JSON files.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 font-bold">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <span>10-swatch palette with WCAG contrast scoring</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <span>Real-time mock canvas with charts, cards & tables</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <span>Guaranteed Microsoft schema compliance</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('theme-generator')}
            className="pop-btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
          >
            <span>Open Theme Studio</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Card 2: Dash Generator */}
        <div className="pop-card bg-white dark:bg-slate-900 p-7 sm:p-8 rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1E293B]">
              <Layout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white">
              Dash Canvas Generator
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Create clean dashboard background layouts for Power BI Desktop. Configure canvas resolution, dock navigation ribbons, embed logos, and export vector SVG wallpapers.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 font-bold">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F472B6]" />
                <span>1280×720 & 1920×1080 canvas resolution presets</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F472B6]" />
                <span>Top or Left navigation bar with logo & report title</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F472B6]" />
                <span>1-click crisp vector SVG wallpaper export</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('dash-generator')}
            className="pop-btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
          >
            <span>Explore Dash Canvas</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </main>
  );
};

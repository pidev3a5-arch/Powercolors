import React, { useState } from 'react';
import {
  Palette,
  Layout,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Download,
  Layers,
  BarChart2,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { AppPage } from '../core/types';

interface LandingHeroProps {
  onNavigate: (page: AppPage) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
  const [activeMockup, setActiveMockup] = useState<'dash' | 'theme'>('dash');

  return (
    <section className="relative w-full max-w-5xl mx-auto text-center pt-2 sm:pt-6 pb-6 sm:pb-12">
      {/* Decorative Memphis Confetti (Hidden on mobile) */}
      <div className="absolute top-2 left-6 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] -rotate-6 select-none pointer-events-none">
        <span>✨ 100% In-Browser</span>
      </div>

      <div className="absolute top-6 right-6 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34D399] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] rotate-6 select-none pointer-events-none">
        <span>⚡ Zero Cloud Latency</span>
      </div>

      <div className="space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs sm:text-sm font-heading font-black border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>The Playful Power BI Design Studio</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white leading-[1.08] max-w-4xl mx-auto">
          Design Gorgeous <span className="text-[#8B5CF6] underline decoration-wavy decoration-[#FBBF24] decoration-2">Power BI Reports</span> in Seconds
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Generate official 10-color themes with verified schema compliance, or craft pixel-perfect SVG canvas layouts with navigation ribbons and card containers.
        </p>

        {/* Tactile Dual CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => onNavigate('theme-generator')}
            className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[4px_4px_0px_0px_#1E293B] transition-all cursor-pointer group"
          >
            <Palette className="w-5 h-5 stroke-[2.5]" />
            <span>Launch Theme Studio</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dash-generator')}
            className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white shadow-[4px_4px_0px_0px_#1E293B] transition-all cursor-pointer group"
          >
            <Layout className="w-5 h-5 stroke-[2.5]" />
            <span>Build Canvas SVG</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/25 border border-white/40">New</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>100% In-Browser Privacy</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Sub-100ms Quantization</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Microsoft Schema Compliant</span>
          </div>
        </div>

        {/* Interactive Teaser Mockup Switcher & Preview */}
        <div className="pt-6 sm:pt-8 max-w-4xl mx-auto space-y-4">
          {/* Mockup Switcher Tabs */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMockup('dash')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading font-black border-2 border-[#1E293B] cursor-pointer transition-all ${
                activeMockup === 'dash'
                  ? 'bg-[#F472B6] text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#FBBF24] hover:text-[#1E293B]'
              }`}
            >
              <Layout className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dash Canvas SVG</span>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-white/30 text-white font-extrabold uppercase">
                New
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMockup('theme')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading font-black border-2 border-[#1E293B] cursor-pointer transition-all ${
                activeMockup === 'theme'
                  ? 'bg-[#8B5CF6] text-white shadow-[2.5px_2.5px_0px_0px_#1E293B]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#FBBF24] hover:text-[#1E293B]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Theme Studio (.pbix)</span>
            </button>
          </div>

          {/* Dash Canvas SVG Mockup Card */}
          {activeMockup === 'dash' && (
            <div className="pop-card relative bg-[#F8FAFC] dark:bg-slate-950 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[8px_8px_0px_0px_#1E293B] overflow-hidden text-left">
              {/* Header Ribbon */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border-2 border-[#1E293B]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24] border-2 border-[#1E293B]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#34D399] border-2 border-[#1E293B]" />
                  <span className="text-xs font-mono font-bold text-slate-500 ml-2">
                    powerbi-wallpaper-canvas.svg
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F472B6]/15 text-[#EC4899] dark:text-[#F472B6] text-[11px] font-heading font-black border border-[#F472B6]/30">
                  <Layout className="w-3 h-3" />
                  <span>Pixel-Perfect Vector Wallpaper</span>
                </div>
              </div>

              {/* Mock Canvas Body with Left Sidebar Ribbon & Visual Containers */}
              <div className="flex min-h-[300px] sm:min-h-[360px]">
                {/* Left Navigation Ribbon */}
                <div className="w-28 sm:w-44 bg-[#1B2432] p-2.5 sm:p-4 text-white flex flex-col justify-between border-r-2 border-[#1E293B] flex-shrink-0">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2 pt-1 pb-2 border-b border-white/10">
                      <div className="w-6 h-6 rounded-lg bg-[#8B5CF6] flex items-center justify-center font-heading font-black text-xs text-white">
                        P
                      </div>
                      <span className="hidden sm:inline font-heading font-black text-xs tracking-tight truncate">
                        Executive Sales
                      </span>
                    </div>

                    {/* Nav Items */}
                    <div className="space-y-1.5">
                      <div className="px-2 py-1.5 rounded-lg bg-[#8B5CF6] text-white flex items-center gap-2 text-[11px] font-heading font-bold shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                        <BarChart2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline">Overview</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 flex items-center gap-2 text-[11px] font-heading font-bold">
                        <TrendingUp className="w-3.5 h-3.5 stroke-[2]" />
                        <span className="hidden sm:inline">Analytics</span>
                      </div>
                      <div className="px-2 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 flex items-center gap-2 text-[11px] font-heading font-bold">
                        <Layers className="w-3.5 h-3.5 stroke-[2]" />
                        <span className="hidden sm:inline">Segments</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <div className="px-2 py-1.5 rounded-lg text-slate-400 hover:bg-white/10 flex items-center gap-2 text-[11px] font-heading font-bold">
                        <Filter className="w-3.5 h-3.5 stroke-[2]" />
                        <span className="hidden sm:inline">Filters</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block text-[9px] font-mono text-slate-400">
                    Auto-Fit 16:9 HD
                  </div>
                </div>

                {/* Right Workspace with Metric Cards and Visual Containers */}
                <div className="flex-1 p-3 sm:p-5 space-y-3 sm:space-y-4 bg-[#F1F5F9] dark:bg-slate-900/60 overflow-hidden">
                  {/* Canvas Header Stamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                    <div>
                      <h4 className="text-xs sm:text-sm font-heading font-black text-[#1E293B] dark:text-white">
                        Performance Overview By Segment & Customer
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        kUSD • Oct'24 - Dec'24 • Applied Filters: Business Line
                      </p>
                    </div>
                    <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                      <span>1920 × 1080</span>
                    </div>
                  </div>

                  {/* 3 Metric Slots */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                      <div className="text-[9px] sm:text-[10px] font-heading font-bold text-slate-500 uppercase truncate">
                        Revenue
                      </div>
                      <div className="text-sm sm:text-lg font-heading font-black text-[#1E293B] dark:text-white">
                        $7,290k
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-emerald-600 truncate">
                        ▲ +23.0%
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                      <div className="text-[9px] sm:text-[10px] font-heading font-bold text-slate-500 uppercase truncate">
                        Gross Profit
                      </div>
                      <div className="text-sm sm:text-lg font-heading font-black text-[#1E293B] dark:text-white">
                        $2,410k
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-emerald-600 truncate">
                        ▲ +22.6%
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                      <div className="text-[9px] sm:text-[10px] font-heading font-bold text-slate-500 uppercase truncate">
                        Gross Margin
                      </div>
                      <div className="text-sm sm:text-lg font-heading font-black text-[#1E293B] dark:text-white">
                        33.1%
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-amber-600 truncate">
                        ▼ -0.1pp
                      </div>
                    </div>
                  </div>

                  {/* 2 Analytics Visual Containers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {/* Pareto Analysis Container */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-2">
                      <div className="text-[10px] font-heading font-black text-slate-700 dark:text-slate-300">
                        Pareto Breakdown (80/20 Rule)
                      </div>
                      <div className="h-16 sm:h-20 flex items-end justify-between gap-1 sm:gap-1.5 px-1 pb-1 border-b border-slate-200 dark:border-slate-700">
                        <div className="w-full bg-[#2563EB] rounded-t-sm h-[85%]" />
                        <div className="w-full bg-[#3B82F6] rounded-t-sm h-[70%]" />
                        <div className="w-full bg-[#60A5FA] rounded-t-sm h-[52%]" />
                        <div className="w-full bg-[#93C5FD] rounded-t-sm h-[38%]" />
                        <div className="w-full bg-[#BFDBFE] rounded-t-sm h-[22%]" />
                        <div className="w-full bg-[#DBEAFE] rounded-t-sm h-[14%]" />
                      </div>
                    </div>

                    {/* Variance by Business Unit */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-2">
                      <div className="text-[10px] font-heading font-black text-slate-700 dark:text-slate-300">
                        Variance vs Prior Year
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-600 dark:text-slate-400 truncate">Cloud Services</span>
                          <span className="text-emerald-600 font-bold">+28%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full w-[78%]" />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-600 dark:text-slate-400 truncate">Cybersecurity</span>
                          <span className="text-emerald-600 font-bold">+19%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full w-[64%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch Dash Canvas Button */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigate('dash-generator')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer transition-all"
                    >
                      <span>Open in Dash Canvas</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme Studio Mockup Card */}
          {activeMockup === 'theme' && (
            <div className="pop-card relative bg-white dark:bg-slate-900 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[8px_8px_0px_0px_#1E293B] p-4 sm:p-6 overflow-hidden text-left">
              {/* Header Ribbon */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border-2 border-[#1E293B]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24] border-2 border-[#1E293B]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#34D399] border-2 border-[#1E293B]" />
                  <span className="text-xs font-mono font-bold text-slate-500 ml-2">
                    powerbi-executive-overview.pbix
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] text-[11px] font-heading font-black border border-[#8B5CF6]/30">
                  <Layers className="w-3 h-3" />
                  <span>Live Canvas & Swatch Sync</span>
                </div>
              </div>

              {/* Simulated Live Palette Strip */}
              <div className="pt-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[
                  { hex: '#8B5CF6', label: '#1' },
                  { hex: '#F472B6', label: '#2' },
                  { hex: '#38BDF8', label: '#3' },
                  { hex: '#34D399', label: '#4' },
                  { hex: '#FBBF24', label: '#5' },
                  { hex: '#F97316', label: '#6' },
                  { hex: '#A855F7', label: '#7' },
                  { hex: '#06B6D4', label: '#8' },
                  { hex: '#EC4899', label: '#9' },
                  { hex: '#1E293B', label: '#10' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-2 border-[#1E293B] p-1.5 flex flex-col items-center justify-between h-14 sm:h-16 shadow-[2px_2px_0px_0px_#1E293B] transition-transform hover:-translate-y-1"
                    style={{ backgroundColor: item.hex }}
                  >
                    <span className="text-[10px] font-mono font-black px-1 rounded bg-black/40 text-white">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1 rounded bg-white/90 text-[#1E293B]">
                      {item.hex}
                    </span>
                  </div>
                ))}
              </div>

              {/* Simulated Mock Visuals inside Teaser */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <div className="text-[10px] font-heading font-black text-slate-500 uppercase">
                    Gross Revenue
                  </div>
                  <div className="text-xl font-heading font-black text-[#1E293B] dark:text-white">
                    $1,482,900
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600">▲ +18.4% vs target</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <div className="text-[10px] font-heading font-black text-slate-500 uppercase">
                    Active Subscribers
                  </div>
                  <div className="text-xl font-heading font-black text-[#1E293B] dark:text-white">
                    42,850
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600">▲ +9.2% MoM</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <div className="text-[10px] font-heading font-black text-slate-500 uppercase">
                    NPS Score
                  </div>
                  <div className="text-xl font-heading font-black text-[#1E293B] dark:text-white">
                    74 / 100
                  </div>
                  <div className="text-[10px] font-bold text-[#8B5CF6]">Top 5% quartile</div>
                </div>
              </div>

              {/* Launch Theme Studio Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('theme-generator')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer transition-all"
                >
                  <span>Open in Theme Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

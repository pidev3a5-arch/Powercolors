import React from 'react';
import { Palette, Layout, Sparkles, ArrowRight, ShieldCheck, Zap, Download, Layers } from 'lucide-react';
import { AppPage } from '../core/types';

interface LandingHeroProps {
  onNavigate: (page: AppPage) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
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

        {/* Interactive Teaser Mockup Preview */}
        <div className="pt-8 sm:pt-10 max-w-4xl mx-auto">
          <div className="pop-card relative bg-white dark:bg-slate-900 rounded-3xl border-3 border-[#1E293B] dark:border-slate-700 shadow-[8px_8px_0px_0px_#1E293B] p-4 sm:p-6 overflow-hidden">
            {/* Header Ribbon */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border-2 border-[#1E293B]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24] border-2 border-[#1E293B]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#34D399] border-2 border-[#1E293B]" />
                <span className="text-xs font-mono font-bold text-slate-500 ml-2">powerbi-executive-overview.pbix</span>
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
                <div className="text-[10px] font-heading font-black text-slate-500 uppercase">Gross Revenue</div>
                <div className="text-xl font-heading font-black text-[#1E293B] dark:text-white">$1,482,900</div>
                <div className="text-[10px] font-bold text-emerald-600">▲ +18.4% vs target</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                <div className="text-[10px] font-heading font-black text-slate-500 uppercase">Active Subscribers</div>
                <div className="text-xl font-heading font-black text-[#1E293B] dark:text-white">42,850</div>
                <div className="text-[10px] font-bold text-emerald-600">▲ +9.2% MoM</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                <div className="text-[10px] font-heading font-black text-slate-500 uppercase">NPS Score</div>
                <div className="text-xl font-heading font-black text-[#1E293B] dark:text-white">74 / 100</div>
                <div className="text-[10px] font-bold text-[#8B5CF6]">Top 5% quartile</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

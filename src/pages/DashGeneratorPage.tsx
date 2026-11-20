import React from 'react';
import { Layout, Palette, ArrowRight, Sparkles, Monitor, Navigation, Image as ImageIcon, Sliders, CheckCircle2, Download } from 'lucide-react';
import { AppPage } from '../core/types';

interface DashGeneratorPageProps {
  onNavigate: (page: AppPage) => void;
}

export const DashGeneratorPage: React.FC<DashGeneratorPageProps> = ({ onNavigate }) => {
  const plannedFeatures = [
    {
      icon: Monitor,
      title: 'Canvas Resolution & Background',
      desc: '1280×720 (16:9 standard), 1920×1080 (Full HD), or custom dimensions with custom solid or gradient canvas colors.',
      color: '#8B5CF6',
    },
    {
      icon: Navigation,
      title: 'Left & Top Navigation Bars',
      desc: 'Dockable navigation ribbons with customizable thickness, accent fills, and clean separator borders.',
      color: '#F472B6',
    },
    {
      icon: ImageIcon,
      title: 'Brand Logo & Report Title',
      desc: 'Direct brand logo asset embedding and typography formatting right inside the header ribbon.',
      color: '#FBBF24',
    },
    {
      icon: Sliders,
      title: 'Interactive Button Pack with Icons',
      desc: 'Configure page navigation pills with custom labels and icons selected from the Lucide icon pack.',
      color: '#34D399',
    },
    {
      icon: Layout,
      title: 'Visual Grid & Card Slots',
      desc: 'Pre-calculate card slots for KPI metric cards, chart containers, and matrix tables with optional titles and subtitles.',
      color: '#38BDF8',
    },
    {
      icon: Download,
      title: 'Power BI Background SVG Export',
      desc: '1-click export of razor-sharp .svg wallpaper ready to set under Canvas Background → Image in Power BI Desktop.',
      color: '#EC4899',
    },
  ];

  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10 sm:space-y-12">
      {/* Hero Header */}
      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34D399] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Coming in Phase 7 • Dashboard SVG Generator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white leading-[1.1]">
          Dash <span className="text-[#F472B6]">Generator</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
          Build pixel-perfect SVG canvas background layouts for Power BI Desktop. Customize navigation ribbons, embed logos, generate page buttons, and configure visual containers with 1-click SVG download.
        </p>
      </div>

      {/* Feature Preview Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plannedFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="pop-card bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[4px_4px_0px_0px_#1E293B] space-y-3"
            >
              <div
                className="w-10 h-10 rounded-xl border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]"
                style={{ backgroundColor: feat.color }}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-heading font-extrabold text-[#1E293B] dark:text-white">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {feat.desc}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                <span>Specified for Phase 7</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Cross-Link Callout to Theme Studio */}
      <section className="rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-heading font-black text-[#1E293B] dark:text-white">
            Need a color palette right now?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Extract 10 official Power BI data colors from your brand logo and download a schema-compliant theme JSON in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('theme-generator')}
          className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer flex-shrink-0"
        >
          <Palette className="w-4 h-4 stroke-[2.5]" />
          <span>Open Theme Studio</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </section>
    </main>
  );
};

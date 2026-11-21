import React from 'react';
import { Sun, Moon, Download, Copy, Check, Code2, Sparkles, Home, Palette, Layout } from 'lucide-react';
import { AppPage } from '../core/types';

interface NavigationHeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isDarkSite: boolean;
  onToggleSiteTheme: () => void;
  // Theme studio action handlers (active when on theme-generator)
  onOpenModal?: () => void;
  onCopyJson?: () => void;
  jsonCopied?: boolean;
  onDownloadJson?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentPage,
  onNavigate,
  isDarkSite,
  onToggleSiteTheme,
  onOpenModal,
  onCopyJson,
  jsonCopied,
  onDownloadJson,
}) => {
  const navItems: Array<{ id: AppPage; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'theme-generator', label: 'Theme Studio', icon: Palette },
    { id: 'dash-generator', label: 'Dash Canvas', icon: Layout },
  ];

  return (
    <header className={`border-b-2 border-[#1E293B] dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
      isDarkSite ? 'bg-[#0F172A]/90' : 'bg-[#FFFDF5]/90'
    }`}>
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logo, Wordmark & Home Click */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0 cursor-pointer group"
          title="Go to PowerLab Home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center p-1 sm:p-1.5 hover-wiggle">
            <img
              src="/logo.png"
              alt="PowerLab Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-heading font-black text-base sm:text-2xl tracking-tight text-[#1E293B] dark:text-white truncate">
            Power<span className="text-[#8B5CF6]">Lab</span>
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[10.5px] font-heading font-extrabold border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
            <Sparkles className="w-3 h-3 fill-white stroke-none" />
            <span>Power BI Studio</span>
          </span>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                    : 'text-[#1E293B] dark:text-slate-300 hover:bg-[#FBBF24] hover:text-[#1E293B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Site Dark/Light Switcher */}
          <button
            type="button"
            onClick={onToggleSiteTheme}
            className="pop-btn p-1.5 sm:p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer"
            title={isDarkSite ? 'Switch to Warm Cream Paper Mode' : 'Switch to Playful Dark Mode'}
          >
            {isDarkSite ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
          </button>

          {/* Theme Studio-specific Actions */}
          {currentPage === 'theme-generator' ? (
            <>
              {onOpenModal && (
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="pop-btn inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-heading font-extrabold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#F472B6] hover:text-white transition-all cursor-pointer"
                  title="Inspect Theme JSON with Schema Verification"
                >
                  <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Inspect JSON</span>
                </button>
              )}

              {onCopyJson && (
                <button
                  type="button"
                  onClick={onCopyJson}
                  className="pop-btn inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-heading font-extrabold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] transition-all cursor-pointer"
                  title="Copy theme JSON to clipboard"
                >
                  {jsonCopied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
                  <span className="hidden sm:inline">{jsonCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}

              {onDownloadJson && (
                <button
                  type="button"
                  onClick={onDownloadJson}
                  className="pop-btn inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all cursor-pointer shadow-[2.5px_2.5px_0px_0px_#1E293B]"
                  title="Download theme JSON file for Power BI Desktop"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">Download Theme</span>
                  <span className="sm:hidden font-extrabold">Theme</span>
                </button>
              )}
            </>
          ) : currentPage === 'landing' ? (
            /* Quick CTA when on Landing */
            <button
              type="button"
              onClick={() => onNavigate('theme-generator')}
              className="pop-btn inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all cursor-pointer shadow-[2.5px_2.5px_0px_0px_#1E293B]"
            >
              <Palette className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Theme Studio</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar: Always visible on mobile, smooth horizontal pill strip */}
      <div className="md:hidden border-t border-[#1E293B]/20 dark:border-slate-800 px-3 py-1.5 bg-[#FFFDF5]/95 dark:bg-[#0F172A]/95 overflow-x-auto flex items-center justify-around gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border border-[#1E293B]'
                  : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-slate-300 border border-[#1E293B]/20'
              }`}
            >
              <Icon className="w-3 h-3 stroke-[2.5]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

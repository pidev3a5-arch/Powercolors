import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Home, Palette, Layout, Menu, X, Grid } from 'lucide-react';
import { AppPage } from '../core/types';

interface NavigationHeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isDarkSite: boolean;
  onToggleSiteTheme: () => void;
  // Optional action handlers retained for backward-compatibility
  onOpenModal?: () => void;
  onCopyJson?: () => void;
  jsonCopied?: boolean;
  onDownloadJson?: () => void;
  onCopySvg?: () => void;
  svgCopied?: boolean;
  onDownloadSvg?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentPage,
  onNavigate,
  isDarkSite,
  onToggleSiteTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: AppPage; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'theme-generator', label: 'Theme Studio', icon: Palette },
    { id: 'dash-generator', label: 'Dash Canvas', icon: Layout },
    { id: 'svg-visual-maker', label: 'SVG Visual Maker', icon: Sparkles },
    { id: 'layout-planner', label: 'Layout Planner', icon: Grid },
  ];

  const renderNavTabs = (className?: string) => (
    <nav
      aria-label="Main Navigation"
      className={`items-center gap-1.5 p-1 rounded-full bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] ${
        className || ''
      }`}
    >
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
  );

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

        {/* Right: Desktop Navigation Tabs placed beside the mode button across all pages */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {renderNavTabs('hidden md:flex mr-1 sm:mr-2')}

          {/* Site Dark/Light Switcher */}
          <button
            type="button"
            onClick={onToggleSiteTheme}
            className="pop-btn p-1.5 sm:p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer"
            title={isDarkSite ? 'Switch to Warm Cream Paper Mode' : 'Switch to Playful Dark Mode'}
          >
            {isDarkSite ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
          </button>

          {/* Mobile Hamburger Menu Button (Always the first button on the right edge on mobile) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden pop-btn p-1.5 sm:p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
            title="Toggle Menu"
            aria-label="Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Menu className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer: Opened via Hamburger menu button */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#1E293B] dark:border-slate-800 px-4 py-3 bg-[#FFFDF5] dark:bg-[#0F172A] space-y-2 shadow-[0px_4px_0px_0px_#1E293B]">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border-2 border-[#1E293B]'
                      : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-slate-200 border-2 border-[#1E293B]/20 hover:bg-[#FBBF24] hover:text-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Download,
  Sparkles,
  Info,
  Code,
  X,
} from 'lucide-react';
import { AppPage } from '../core/types';
import { copyToClipboard } from '../core/clipboard';
import { IconCategory, SvgIconItem, IconCustomization, IconBadgeStyle } from '../core/iconLibrary/types';
import { SVG_ICONS_COLLECTION, ICON_CATEGORIES } from '../core/iconLibrary/icons';
import {
  DEFAULT_ICON_CUSTOMIZATION,
  generateRawSvg,
  generateDaxIconMeasure,
  downloadSvgFile,
} from '../core/iconLibrary/daxIconEngine';

interface IconLibraryPageProps {
  onNavigate?: (page: AppPage) => void;
}

export const IconLibraryPage: React.FC<IconLibraryPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all');
  const [customization, setCustomization] = useState<IconCustomization>(DEFAULT_ICON_CUSTOMIZATION);
  const [activeModalIcon, setActiveModalIcon] = useState<SvgIconItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'dax' | 'raw' | null>(null);

  // Quick seed colors
  const quickColors = ['#8B5CF6', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#1E293B', '#64748B'];

  // Filtered icons
  const filteredIcons = useMemo(() => {
    return SVG_ICONS_COLLECTION.filter((icon) => {
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        icon.name.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyDax = async (icon: SvgIconItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const dax = generateDaxIconMeasure(icon, customization);
    const success = await copyToClipboard(dax);
    if (success) {
      setCopiedId(icon.id);
      setCopiedType('dax');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    }
  };

  const handleCopyRawSvg = async (icon: SvgIconItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const svg = generateRawSvg(icon, customization);
    const success = await copyToClipboard(svg);
    if (success) {
      setCopiedId(icon.id);
      setCopiedType('raw');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    }
  };

  const handleDownload = (icon: SvgIconItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    downloadSvgFile(icon, customization);
  };

  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#1E293B] dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/20 text-[#0284C7] dark:text-[#38BDF8] text-xs font-heading font-black border border-[#38BDF8]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>POWER BI SVG ICON SYSTEM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white">
            Icon Library & SVG Picker
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Browse 120+ curated business vector icons. Customize colors and badges, then copy 1-click DAX ImageUrl measures or download SVGs.
          </p>
        </div>

        {/* Header Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] text-center">
            <span className="text-xs font-heading font-black text-[#8B5CF6] block">{SVG_ICONS_COLLECTION.length}</span>
            <span className="text-[10px] font-bold text-slate-500">Vector Icons</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] text-center">
            <span className="text-xs font-heading font-black text-[#34D399] block">100%</span>
            <span className="text-[10px] font-bold text-slate-500">ImageUrl DAX</span>
          </div>
        </div>
      </div>

      {/* Customization Toolbar & Filter Bar */}
      <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
        {/* Controls Row: Search + Color + Size + Stroke + Badge */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons by name or tag (e.g. dollar, chart, filter)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B] text-xs font-heading font-bold text-[#1E293B] dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Quick Customizer Knobs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Color Swatch & Custom Hex */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B]">
              <input
                type="color"
                value={customization.color}
                onChange={(e) => setCustomization((prev) => ({ ...prev, color: e.target.value }))}
                className="w-7 h-7 rounded-lg border border-[#1E293B] cursor-pointer p-0"
                title="Custom Icon Color"
              />
              <div className="flex items-center gap-1 px-1">
                {quickColors.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setCustomization((prev) => ({ ...prev, color: hex }))}
                    className={`w-4 h-4 rounded-full border border-[#1E293B] transition-transform ${
                      customization.color.toUpperCase() === hex.toUpperCase() ? 'scale-125 ring-2 ring-[#8B5CF6]' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B]">
              <span className="text-[10.5px] font-heading font-black text-slate-500 px-1.5">Size</span>
              {[16, 20, 24, 32, 48].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCustomization((prev) => ({ ...prev, size }))}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    customization.size === size
                      ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Stroke Width Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B]">
              <span className="text-[10.5px] font-heading font-black text-slate-500 px-1.5">Stroke</span>
              {[1.5, 2, 2.5].map((stroke) => (
                <button
                  key={stroke}
                  type="button"
                  onClick={() => setCustomization((prev) => ({ ...prev, strokeWidth: stroke }))}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    customization.strokeWidth === stroke
                      ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black'
                  }`}
                >
                  {stroke}px
                </button>
              ))}
            </div>

            {/* Badge Container Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-[#1E293B]">
              <span className="text-[10.5px] font-heading font-black text-slate-500 px-1.5">Badge</span>
              {(['none', 'soft-rounded', 'circle', 'square-outline'] as IconBadgeStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setCustomization((prev) => ({ ...prev, badgeStyle: style }))}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-heading font-black capitalize transition-all cursor-pointer ${
                    customization.badgeStyle === style
                      ? 'bg-[#8B5CF6] text-white shadow-[1px_1px_0px_0px_#1E293B]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black'
                  }`}
                >
                  {style === 'soft-rounded' ? 'Rounded' : style === 'square-outline' ? 'Outline' : style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1E293B] dark:bg-white text-white dark:text-[#1E293B] shadow-[2px_2px_0px_0px_#8B5CF6]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Icons ({SVG_ICONS_COLLECTION.length})
          </button>

          {ICON_CATEGORIES.map((cat) => {
            const count = SVG_ICONS_COLLECTION.filter((i) => i.category === cat.id).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredIcons.map((icon) => {
          const rawSvg = generateRawSvg(icon, { ...customization, size: 28 });
          const isCopied = copiedId === icon.id;

          return (
            <div
              key={icon.id}
              onClick={() => setActiveModalIcon(icon)}
              className="pop-card group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] hover:-translate-y-1 transition-all flex flex-col items-center justify-between gap-3 text-center cursor-pointer"
            >
              {/* Quick Action Badges (Top Right Hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => handleCopyDax(icon, e)}
                  className="p-1 rounded-md bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow"
                  title="Copy DAX Measure"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDownload(icon, e)}
                  className="p-1 rounded-md bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border border-[#1E293B] shadow"
                  title="Download .SVG"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>

              {/* Icon Visual Preview */}
              <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-[#1E293B]/20 flex items-center justify-center p-2 group-hover:border-[#8B5CF6] transition-colors">
                <div dangerouslySetInnerHTML={{ __html: rawSvg }} />
              </div>

              {/* Name & Tag */}
              <div className="w-full">
                <h3 className="text-xs font-heading font-black text-[#1E293B] dark:text-white truncate">
                  {icon.name}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 block truncate mt-0.5">
                  #{icon.tags[0]}
                </span>
              </div>

              {/* Status Indicator */}
              {isCopied && (
                <div className="absolute inset-0 bg-[#34D399] rounded-2xl flex items-center justify-center gap-1.5 text-xs font-heading font-black text-[#1E293B] animate-fade-in z-10">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{copiedType === 'dax' ? 'DAX Copied!' : 'SVG Copied!'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredIcons.length === 0 && (
        <div className="text-center py-16 pop-card bg-white dark:bg-slate-900 rounded-3xl border-3 border-[#1E293B] p-8 max-w-lg mx-auto">
          <Info className="w-8 h-8 text-[#8B5CF6] mx-auto mb-2" />
          <h3 className="text-lg font-heading font-black text-[#1E293B] dark:text-white">
            No Icons Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            No vector icons match "{searchQuery}". Try searching for generic keywords like "chart", "money", or "user".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modal: Icon Detail & 1-Click DAX Measure Export */}
      {activeModalIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-3 border-[#1E293B] shadow-[8px_8px_0px_0px_#1E293B] p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E293B] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-[#1E293B] flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: generateRawSvg(activeModalIcon, { ...customization, size: 24 }),
                  }}
                />
                <div>
                  <h3 className="text-lg font-heading font-black text-[#1E293B] dark:text-white">
                    {activeModalIcon.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.2 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]">
                      {activeModalIcon.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {customization.size}x{customization.size}px • {customization.color}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalIcon(null)}
                className="pop-btn p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-black border-2 border-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Dual Previews (Light vs Dark) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex flex-col items-center justify-center gap-2 text-center">
                <span className="text-[10px] font-heading font-black text-slate-400 uppercase">
                  Light Canvas
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateRawSvg(activeModalIcon, { ...customization, size: 48 }),
                  }}
                />
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex flex-col items-center justify-center gap-2 text-center">
                <span className="text-[10px] font-heading font-black text-slate-400 uppercase">
                  Dark Canvas
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateRawSvg(activeModalIcon, {
                      ...customization,
                      size: 48,
                      color: customization.color === '#1E293B' ? '#FFFFFF' : customization.color,
                    }),
                  }}
                />
              </div>
            </div>

            {/* DAX Measure Preview Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Power BI DAX Measure Formula</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Data Category: Image URL
                </span>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border-2 border-[#1E293B] leading-relaxed">
                {generateDaxIconMeasure(activeModalIcon, customization)}
              </pre>
            </div>

            {/* Power BI Quick Implementation Steps */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-[#1E293B] text-xs font-medium text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-heading font-black flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>How to use in Power BI Desktop:</span>
              </div>
              <ol className="list-decimal pl-5 space-y-0.5 text-[11px]">
                <li>Paste the DAX measure code into your semantic model.</li>
                <li>Select the measure, open <strong>Measure Tools &gt; Data Category</strong>, and select <strong>Image URL</strong>.</li>
                <li>Drop the measure into any Table, Matrix, or New Card visual.</li>
              </ol>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t-2 border-[#1E293B] dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleCopyRawSvg(activeModalIcon)}
                className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Copy Raw SVG</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(activeModalIcon)}
                className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .SVG</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyDax(activeModalIcon)}
                className="pop-btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy DAX Measure (ImageUrl)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

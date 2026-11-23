import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Copy,
  Check,
  Download,
  Sliders,
  Sparkles,
  FileUp,
  LayoutGrid,
  Info,
  Code2,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { AppPage } from '../core/types';
import { VisualCategory, SvgVisualDefinition } from '../core/svgVisuals/types';
import { SVG_VISUALS_CATALOG, SVG_CATEGORIES } from '../core/svgVisuals/catalog';
import { convertRawSvgToDax } from '../core/svgVisuals/svgToDaxConverter';
import { getPaginationRange } from '../core/svgVisuals/pagination';

interface SvgVisualMakerPageProps {
  onNavigate: (page: AppPage) => void;
}

export const SvgVisualMakerPage: React.FC<SvgVisualMakerPageProps> = ({ onNavigate }) => {
  // Navigation tabs within this page
  const [activeTab, setActiveTab] = useState<'gallery' | 'converter'>('gallery');

  // Search & category filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VisualCategory | 'all'>('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Pagination state (8 visuals per page to prevent a long scrollable page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const galleryTopRef = useRef<HTMLDivElement>(null);

  // Customizer state
  const [selectedVisual, setSelectedVisual] = useState<SvgVisualDefinition | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customParams, setCustomParams] = useState<Record<string, any>>({});
  const [measureNameInput, setMeasureNameInput] = useState('');
  const [previewBg, setPreviewBg] = useState<'white' | 'slate' | 'cream'>('cream');
  const [copiedDaxId, setCopiedDaxId] = useState<string | null>(null);
  const [copiedSvgId, setCopiedSvgId] = useState<string | null>(null);

  // Converter state
  const [customSvgInput, setCustomSvgInput] = useState('');
  const [converterMeasureName, setConverterMeasureName] = useState('My_Custom_SVG_Measure');
  const [extractColors, setExtractColors] = useState(true);
  const [converterCopiedDax, setConverterCopiedDax] = useState(false);

  // Filtered visuals
  const filteredVisuals = useMemo(() => {
    return SVG_VISUALS_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close category dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Selected category object
  const selectedCategoryObj = useMemo(() => {
    return SVG_CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredVisuals.length / itemsPerPage));

  // Reset or clamp current page if filtered results shrink
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Paginated visuals slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredVisuals.length);
  const paginatedVisuals = useMemo(() => {
    return filteredVisuals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVisuals, startIndex, itemsPerPage]);

  // Pagination range array (e.g. [1, 2, 3, 4, 5, 6] or [1, '...', 8, 9, 10, '...', 25])
  const paginationRange = useMemo(() => {
    return getPaginationRange(currentPage, totalPages);
  }, [currentPage, totalPages]);

  // Handle page navigation with smooth scroll
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    galleryTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Open customizer for a specific visual
  const handleOpenCustomizer = (visual: SvgVisualDefinition) => {
    setSelectedVisual(visual);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initial: Record<string, any> = {};
    visual.params.forEach((p) => {
      initial[p.id] = p.defaultValue;
    });
    setCustomParams(initial);
    setMeasureNameInput(`SVG_${visual.name.replace(/[^a-zA-Z0-9]/g, '_')}`);
  };

  // Close customizer
  const handleCloseCustomizer = () => {
    setSelectedVisual(null);
  };

  // Handle parameter value change in customizer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleParamChange = (paramId: string, value: any) => {
    setCustomParams((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  // Live SVG & DAX for customized visual
  const currentRenderedSvg = useMemo(() => {
    if (!selectedVisual) return '';
    return selectedVisual.renderSvg(customParams);
  }, [selectedVisual, customParams]);

  const currentGeneratedDax = useMemo(() => {
    if (!selectedVisual) return '';
    const mName = measureNameInput.trim() || `SVG_${selectedVisual.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return selectedVisual.generateDax(customParams, mName);
  }, [selectedVisual, customParams, measureNameInput]);

  // Copy DAX to clipboard
  const handleCopyDax = (dax: string, id: string) => {
    navigator.clipboard.writeText(dax);
    setCopiedDaxId(id);
    setTimeout(() => {
      setCopiedDaxId(null);
    }, 2500);
  };

  // Copy raw SVG to clipboard
  const handleCopySvg = (svg: string, id: string) => {
    navigator.clipboard.writeText(svg);
    setCopiedSvgId(id);
    setTimeout(() => {
      setCopiedSvgId(null);
    }, 2500);
  };

  // Download SVG file
  const handleDownloadSvgFile = (svg: string, filename: string) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download DAX file
  const handleDownloadDaxFile = (dax: string, filename: string) => {
    const blob = new Blob([dax], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.dax`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // File drop/upload for custom SVG converter
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
    setConverterMeasureName(`SVG_${baseName}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomSvgInput(content);
      }
    };
    reader.readAsText(file);
  };

  // Converted result for custom SVG
  const converterResult = useMemo(() => {
    if (!customSvgInput.trim()) return null;
    return convertRawSvgToDax(customSvgInput, {
      measureName: converterMeasureName,
      extractColors,
    });
  }, [customSvgInput, converterMeasureName, extractColors]);

  return (
    <>
      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-24">
        {/* Top Banner & Header - Left-aligned matching other pages */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b-2 border-[#1E293B] dark:border-slate-800">
          <div className="space-y-2 text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 text-xs font-heading font-black border border-[#8B5CF6]/30 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POWER BI MICRO-VISUALS & DAX STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight">
              SVG Visual Maker & <span className="text-[#8B5CF6]">DAX Generator</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Generate error-free Power BI DAX measures for matrix and table micro-charts.
              Pick from dozens of curated visuals or convert any custom SVG into a copyable measure with Image URL data category.
            </p>

            {/* Value Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                ✓ Matrix & Table Ready
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#BBF7D0] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                ✓ 100% In-Browser Privacy
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#BAE6FD] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                ✓ Data Category: Image URL
              </span>
            </div>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border-2 border-[#1E293B]'
                  : 'text-[#1E293B] dark:text-slate-200 hover:bg-[#FBBF24] hover:text-[#1E293B]'
              }`}
            >
              <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
              <span>Visuals Gallery ({SVG_VISUALS_CATALOG.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('converter')}
              className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
                activeTab === 'converter'
                  ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B] border-2 border-[#1E293B]'
                  : 'text-[#1E293B] dark:text-slate-200 hover:bg-[#FBBF24] hover:text-[#1E293B]'
              }`}
            >
              <FileUp className="w-4 h-4 stroke-[2.5]" />
              <span>Import & Convert SVG to DAX</span>
            </button>
          </div>
        </div>

        {/* Main Workspace Content */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Search and Category Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search visuals (gauge, ring, sparkline, bullet, ibcs)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-[#1E293B] dark:hover:text-white cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative min-w-[220px] sm:min-w-[260px]" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                  className="w-full pop-btn flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] font-heading font-black text-xs sm:text-sm text-[#1E293B] dark:text-white cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryDropdownOpen}
                  title="Filter visuals by category"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Filter className="w-4 h-4 text-[#8B5CF6] shrink-0 stroke-[2.5]" />
                    <span className="truncate">
                      {selectedCategoryObj?.label || 'All Visuals'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6] text-white">
                      {selectedCategory === 'all'
                        ? SVG_VISUALS_CATALOG.length
                        : SVG_VISUALS_CATALOG.filter((v) => v.category === selectedCategory).length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 stroke-[2.5] ${
                        isCategoryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu Popover */}
                {isCategoryDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full sm:w-72 bg-white dark:bg-slate-900 border-2 border-[#1E293B] rounded-2xl shadow-[4px_4px_0px_0px_#1E293B] p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2.5 py-1 text-[10px] font-heading font-black text-slate-400 uppercase tracking-wider">
                      Filter by Category
                    </div>
                    {SVG_CATEGORIES.map((cat) => {
                      const count =
                        cat.id === 'all'
                          ? SVG_VISUALS_CATALOG.length
                          : SVG_VISUALS_CATALOG.filter((v) => v.category === cat.id).length;
                      const isSelected = selectedCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id as VisualCategory | 'all');
                            setCurrentPage(1);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5CF6] text-white shadow-sm'
                              : 'text-[#1E293B] dark:text-slate-200 hover:bg-[#FBBF24]/30 dark:hover:bg-slate-800'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600" />
                            )}
                            <span>{cat.label}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Scroll Anchor for smooth pagination transition */}
            <div ref={galleryTopRef} className="scroll-mt-6" />

            {/* Gallery Info Bar (Count & Per Page selector) */}
            {filteredVisuals.length > 0 && (
              <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                <div>
                  Showing{' '}
                  <span className="font-heading font-black text-[#1E293B] dark:text-white">
                    {startIndex + 1}–{endIndex}
                  </span>{' '}
                  of{' '}
                  <span className="font-heading font-black text-[#1E293B] dark:text-white">
                    {filteredVisuals.length}
                  </span>{' '}
                  visuals
                  {totalPages > 1 && (
                    <span className="hidden sm:inline">
                      {' '}
                      · Page{' '}
                      <span className="font-heading font-black text-[#1E293B] dark:text-white">
                        {currentPage}
                      </span>{' '}
                      of {totalPages}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-[11px] font-heading font-black text-[#1E293B] dark:text-white cursor-pointer shadow-[1px_1px_0px_0px_#1E293B] focus:outline-none"
                    title="Change visuals per page"
                  >
                    <option value={8}>8 per page</option>
                    <option value={12}>12 per page</option>
                    <option value={16}>16 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>All ({filteredVisuals.length})</option>
                  </select>
                </div>
              </div>
            )}

            {/* Visuals Gallery Grid */}
            {filteredVisuals.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-[#1E293B]/40 space-y-3">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-heading font-black text-lg text-[#1E293B] dark:text-white">
                  No SVG visuals match your search
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for keywords like "gauge", "ring", "sparkline", or select another category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="pop-btn px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedVisuals.map((visual) => {
                  // Generate default SVG preview
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const defaultParams: Record<string, any> = {};
                  visual.params.forEach((p) => {
                    defaultParams[p.id] = p.defaultValue;
                  });
                  const defaultSvg = visual.renderSvg(defaultParams);
                  const defaultDax = visual.generateDax(
                    defaultParams,
                    `SVG_${visual.name.replace(/[^a-zA-Z0-9]/g, '_')}`
                  );
                  const isDaxCopied = copiedDaxId === visual.id;
                  const isSvgCopied = copiedSvgId === visual.id;

                  return (
                    <div
                      key={visual.id}
                      className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] hover:shadow-[5px_5px_0px_0px_#8B5CF6] hover:-translate-y-1 transition-all overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-3.5 pb-2 flex items-center justify-between gap-2 border-b-2 border-[#1E293B]/10">
                        <span className="text-[10px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/30">
                          {visual.category}
                        </span>
                        <span className="text-[10.5px] font-bold text-slate-400">
                          {visual.recommendedDimensions.width}×{visual.recommendedDimensions.height}px
                        </span>
                      </div>

                      {/* Visual SVG Preview Canvas */}
                      <div
                        onClick={() => handleOpenCustomizer(visual)}
                        className="p-6 flex items-center justify-center min-h-[140px] bg-[#FFFDF5] dark:bg-slate-900/70 border-b-2 border-[#1E293B]/10 cursor-pointer group-hover:bg-purple-50/30 dark:group-hover:bg-purple-950/20 transition-colors relative"
                        title="Click to customize and view DAX measure"
                      >
                        <div
                          className="w-full max-w-[140px] h-[90px] flex items-center justify-center transition-transform group-hover:scale-105 duration-200 [&>svg]:max-h-[85px] [&>svg]:max-w-[140px] [&>svg]:w-auto [&>svg]:h-auto"
                          dangerouslySetInnerHTML={{ __html: defaultSvg }}
                        />
                        <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-md bg-[#1E293B] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                          <Sliders className="w-3 h-3" />
                          <span>Customize</span>
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading font-black text-sm text-[#1E293B] dark:text-white line-clamp-1">
                            {visual.name}
                          </h4>
                          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                            {visual.description}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyDax(defaultDax, visual.id)}
                            className={`flex-1 pop-btn py-1.5 px-2.5 rounded-xl text-xs font-heading font-black text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] ${
                              isDaxCopied
                                ? 'bg-[#047857]'
                                : 'bg-[#10B981] hover:bg-[#059669]'
                            }`}
                            title="Copy ready-to-run Power BI DAX Measure"
                          >
                            {isDaxCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Copy DAX</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenCustomizer(visual)}
                            className="pop-btn p-1.5 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                            title="Open interactive customizer & preview"
                          >
                            <Sliders className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopySvg(defaultSvg, visual.id)}
                            className="pop-btn p-1.5 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                            title="Copy raw SVG markup"
                          >
                            {isSvgCopied ? (
                              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                            ) : (
                              <Code2 className="w-4 h-4 stroke-[2.5]" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadSvgFile(defaultSvg, visual.id)}
                            className="pop-btn p-1.5 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#38BDF8] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                            title="Download .svg file"
                          >
                            <Download className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Navigation Menu Number Buttons (Pagination matching reference design) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]">
                {/* Left Page Summary */}
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Page <span className="font-heading font-black text-[#1E293B] dark:text-white">{currentPage}</span> of{' '}
                  <span className="font-heading font-black text-[#1E293B] dark:text-white">{totalPages}</span>
                </div>

                {/* Number Navigation Buttons (matching uploaded reference) */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Previous Button (<) */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-sm text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-all border-2 border-transparent hover:border-[#1E293B]"
                    title="Previous page"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Numbered Page Buttons */}
                  {paginationRange.map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-black text-slate-400 tracking-wider select-none"
                        >
                          ...
                        </span>
                      );
                    }

                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={`page-${page}`}
                        type="button"
                        onClick={() => handlePageChange(page as number)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-heading font-black text-xs sm:text-sm transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#F43F5E] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] scale-105'
                            : 'text-[#1E293B] dark:text-slate-200 hover:bg-[#FBBF24] hover:text-[#1E293B] hover:border-2 hover:border-[#1E293B]'
                        }`}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next Button (>) */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-sm text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-all border-2 border-transparent hover:border-[#1E293B]"
                    title="Next page"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Right Side Quick Jump */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>Go to:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] text-[11px] font-heading font-black text-[#1E293B] dark:text-white cursor-pointer shadow-[1px_1px_0px_0px_#1E293B]"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <option key={p} value={p}>
                        Page {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: IMPORT & CONVERT SVG TO DAX
           ========================================================================= */}
        {activeTab === 'converter' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Upload / Paste SVG Input */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-base text-[#1E293B] dark:text-white flex items-center gap-2">
                      <FileUp className="w-4 h-4 text-[#8B5CF6]" />
                      <span>Input Custom SVG</span>
                    </h3>
                    <label className="pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] text-xs font-heading font-black cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                      <FileUp className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Upload .svg File</span>
                      <input
                        type="file"
                        accept=".svg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Paste any SVG markup below or upload a file. PowerLab converts it into an error-free,
                    properly quoted and concatenated Power BI DAX measure.
                  </p>

                  {/* Measure Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-heading font-black text-[#1E293B] dark:text-slate-300">
                      Power BI Measure Name
                    </label>
                    <input
                      type="text"
                      value={converterMeasureName}
                      onChange={(e) => setConverterMeasureName(e.target.value)}
                      placeholder="e.g. SVG_Executive_Kpi"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] text-xs font-bold text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                  </div>

                  {/* Color extraction checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#1E293B] dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={extractColors}
                      onChange={(e) => setExtractColors(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-[#1E293B] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span>Extract hex colors as top-level VAR parameters in DAX</span>
                  </label>

                  {/* SVG Code Textarea */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Raw SVG Markup</span>
                      {customSvgInput && (
                        <button
                          type="button"
                          onClick={() => setCustomSvgInput('')}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={10}
                      value={customSvgInput}
                      onChange={(e) => setCustomSvgInput(e.target.value)}
                      placeholder={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="#8B5CF6" />\n  <text x="50" y="55" text-anchor="middle" fill="#FFFFFF">85%</text>\n</svg>`}
                      className="w-full p-3.5 rounded-2xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] font-mono text-xs text-[#1E293B] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] resize-y"
                    />
                  </div>

                  {/* Quick Preset Buttons to Try */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-400">Or try a sample:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setConverterMeasureName('SVG_Sample_Badge');
                          setCustomSvgInput(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
  <rect x="2" y="2" width="116" height="36" rx="18" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
  <circle cx="20" cy="20" r="6" fill="#8B5CF6"/>
  <text x="34" y="24" font-family="Segoe UI, sans-serif" font-size="13" font-weight="800" fill="#8B5CF6">Approved ✓</text>
</svg>`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#FBBF24] hover:text-[#1E293B] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Sample Badge
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setConverterMeasureName('SVG_Sample_Target_Gauge');
                          setCustomSvgInput(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 65">
  <path d="M 14,48 A 36 36 0 0 1 86,48" fill="none" stroke="#E2E8F0" stroke-width="10" stroke-linecap="round"/>
  <path d="M 14,48 A 36 36 0 0 1 86,48" fill="none" stroke="#2563EB" stroke-width="10" stroke-dasharray="113.1" stroke-dashoffset="22.6" stroke-linecap="round"/>
  <text x="50" y="60" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="16" font-weight="900" fill="#1E293B">80%</text>
</svg>`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#FBBF24] hover:text-[#1E293B] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Sample Semicircle Gauge
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Output & Power BI DAX */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-base text-[#1E293B] dark:text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#10B981]" />
                      <span>Generated Power BI DAX Measure</span>
                    </h3>
                    {converterResult && !converterResult.error && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(converterResult.daxCode);
                            setConverterCopiedDax(true);
                            setTimeout(() => setConverterCopiedDax(false), 2500);
                          }}
                          className={`pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-heading font-black cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] ${
                            converterCopiedDax
                              ? 'bg-[#047857]'
                              : 'bg-[#10B981] hover:bg-[#059669]'
                          }`}
                        >
                          {converterCopiedDax ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Copied DAX!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Copy DAX</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadDaxFile(
                              converterResult.daxCode,
                              converterResult.measureName
                            )
                          }
                          className="pop-btn p-1.5 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                          title="Download .dax file"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Live SVG Preview Box */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] flex flex-col items-center justify-center min-h-[140px] space-y-2">
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Live Preview
                    </span>
                    {converterResult?.sanitizedSvg ? (
                      <div
                        className="w-full max-w-[180px] max-h-[100px] flex items-center justify-center [&>svg]:max-h-[100px] [&>svg]:max-w-[180px] [&>svg]:w-auto [&>svg]:h-auto"
                        dangerouslySetInnerHTML={{
                          __html: converterResult.sanitizedSvg,
                        }}
                      />
                    ) : (
                      <div className="text-center text-xs text-slate-400">
                        Paste or upload an SVG to preview
                      </div>
                    )}
                  </div>

                  {/* Error State */}
                  {converterResult?.error && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-red-700 dark:text-red-300 text-xs font-bold">
                      ⚠️ {converterResult.error}
                    </div>
                  )}

                  {/* DAX Code Output Box */}
                  {converterResult && !converterResult.error && (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-[11.5px] text-purple-900 dark:text-purple-200 font-semibold flex items-start gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 text-[#8B5CF6] mt-0.5" />
                        <div>
                          <strong>Power BI Desktop Tip:</strong> In Power BI, click <em>New Measure</em>, select all in the formula bar (<kbd className="font-mono px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-[10px]">Ctrl+A</kbd>), and paste (<kbd className="font-mono px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-[10px]">Ctrl+V</kbd>).
                          Then go to <strong>Measure Tools</strong> and set <strong>Data Category = Image URL</strong>.
                        </div>
                      </div>

                      <div className="relative">
                        <pre className="p-4 rounded-2xl bg-[#1E293B] text-slate-100 font-mono text-xs overflow-x-auto max-h-[340px] leading-relaxed border-2 border-[#1E293B] select-all">
                          <code>{converterResult.daxCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cross-workspace quick switcher */}
        <div className="mt-12 p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              Need a matching 10-color theme or canvas wallpaper for your report?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('theme-generator')}
              className="pop-btn px-3.5 py-1.5 rounded-xl bg-[#8B5CF6] text-white font-heading font-black cursor-pointer hover:bg-[#7C3AED]"
            >
              Theme Studio
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dash-generator')}
              className="pop-btn px-3.5 py-1.5 rounded-xl bg-[#F472B6] text-white font-heading font-black cursor-pointer hover:bg-[#EC4899]"
            >
              Dash Canvas
            </button>
          </div>
        </div>
      </main>

      {/* =========================================================================
          INTERACTIVE CUSTOMIZER MODAL / DRAWER
         ========================================================================= */}
      {selectedVisual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-800 border-3 border-[#1E293B] shadow-[8px_8px_0px_0px_#1E293B] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b-2 border-[#1E293B] flex items-center justify-between gap-3 bg-[#FFFDF5] dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                  <Sliders className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#1E293B] dark:text-white leading-tight">
                    {selectedVisual.name}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Category: <span className="font-black text-[#8B5CF6]">{selectedVisual.category}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseCustomizer}
                className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#EF4444] hover:text-white transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: Live Visual Preview and Background selector */}
                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                        Live Preview
                      </span>
                      {/* Background switcher */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewBg('cream')}
                          className={`w-5 h-5 rounded-full border-2 border-[#1E293B] cursor-pointer ${
                            previewBg === 'cream' ? 'ring-2 ring-[#8B5CF6]' : ''
                          } bg-[#FFFDF5]`}
                          title="Paper Cream Background"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewBg('white')}
                          className={`w-5 h-5 rounded-full border-2 border-[#1E293B] cursor-pointer ${
                            previewBg === 'white' ? 'ring-2 ring-[#8B5CF6]' : ''
                          } bg-white`}
                          title="White Background"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewBg('slate')}
                          className={`w-5 h-5 rounded-full border-2 border-[#1E293B] cursor-pointer ${
                            previewBg === 'slate' ? 'ring-2 ring-[#8B5CF6]' : ''
                          } bg-[#0F172A]`}
                          title="Dark Slate Background"
                        />
                      </div>
                    </div>

                    <div
                      className={`p-8 rounded-2xl border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-center min-h-[180px] transition-colors ${
                        previewBg === 'cream'
                          ? 'bg-[#FFFDF5]'
                          : previewBg === 'white'
                          ? 'bg-white'
                          : 'bg-[#0F172A]'
                      }`}
                    >
                      <div
                        className="w-full max-w-[220px] h-[140px] flex items-center justify-center [&>svg]:max-h-[130px] [&>svg]:max-w-[220px] [&>svg]:w-auto [&>svg]:h-auto"
                        dangerouslySetInnerHTML={{ __html: currentRenderedSvg }}
                      />
                    </div>
                  </div>

                  {/* Power BI Tips Box */}
                  {selectedVisual.pbiTips && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400/60 text-amber-900 dark:text-amber-200 text-xs font-semibold space-y-1">
                      <div className="font-heading font-black text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Power BI Recommendation</span>
                      </div>
                      <p className="leading-relaxed">{selectedVisual.pbiTips.notes}</p>
                    </div>
                  )}

                  {/* Actions for SVG export */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopySvg(currentRenderedSvg, 'modal')}
                      className="flex-1 pop-btn py-2 px-3 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] text-xs font-heading font-black transition-all cursor-pointer border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center gap-1.5"
                    >
                      {copiedSvgId === 'modal' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          <span>Copied SVG!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copy Raw SVG</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadSvgFile(currentRenderedSvg, selectedVisual.id)}
                      className="pop-btn p-2 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#38BDF8] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]"
                      title="Download SVG file"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Right: Parameter Controls & DAX Code View */}
                <div className="md:col-span-7 space-y-5">
                  {/* Parameter Controls */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] space-y-3.5 shadow-[2px_2px_0px_0px_#1E293B]">
                    <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-2">
                      <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                        Tune Parameters
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const reset: Record<string, any> = {};
                          selectedVisual.params.forEach((p) => {
                            reset[p.id] = p.defaultValue;
                          });
                          setCustomParams(reset);
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedVisual.params.map((param) => {
                        const val = customParams[param.id] ?? param.defaultValue;

                        if (param.type === 'number') {
                          return (
                            <div key={param.id} className="space-y-1">
                              <div className="flex justify-between text-xs font-bold">
                                <span>{param.label}</span>
                                <span className="font-mono text-[#8B5CF6]">{val}</span>
                              </div>
                              <input
                                type="range"
                                min={param.min ?? 0}
                                max={param.max ?? 100}
                                step={param.step ?? 1}
                                value={val}
                                onChange={(e) =>
                                  handleParamChange(param.id, parseFloat(e.target.value))
                                }
                                className="w-full accent-[#8B5CF6] cursor-pointer"
                              />
                            </div>
                          );
                        }

                        if (param.type === 'color') {
                          return (
                            <div key={param.id} className="space-y-1">
                              <label className="text-xs font-bold block">{param.label}</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={val}
                                  onChange={(e) => handleParamChange(param.id, e.target.value)}
                                  className="w-8 h-8 rounded-lg border-2 border-[#1E293B] cursor-pointer p-0 bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleParamChange(param.id, e.target.value)}
                                  className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-xs font-mono font-bold uppercase"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (param.type === 'text') {
                          return (
                            <div key={param.id} className="space-y-1">
                              <label className="text-xs font-bold block">{param.label}</label>
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => handleParamChange(param.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border-2 border-[#1E293B] text-xs font-bold"
                              />
                            </div>
                          );
                        }

                        if (param.type === 'boolean') {
                          return (
                            <div key={param.id} className="flex items-center gap-2 pt-3">
                              <input
                                type="checkbox"
                                id={param.id}
                                checked={Boolean(val)}
                                onChange={(e) => handleParamChange(param.id, e.target.checked)}
                                className="w-4 h-4 rounded border-2 border-[#1E293B] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                              />
                              <label
                                htmlFor={param.id}
                                className="text-xs font-bold cursor-pointer select-none"
                              >
                                {param.label}
                              </label>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  </div>

                  {/* Power BI Measure Name & DAX Code Block */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <label className="text-xs font-heading font-black text-[#1E293B] dark:text-slate-200 whitespace-nowrap">
                          Measure Name:
                        </label>
                        <input
                          type="text"
                          value={measureNameInput}
                          onChange={(e) => setMeasureNameInput(e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] text-xs font-mono font-bold text-[#1E293B] dark:text-white flex-1"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyDax(currentGeneratedDax, 'modal')}
                          className={`pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-heading font-black cursor-pointer border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] ${
                            copiedDaxId === 'modal'
                              ? 'bg-[#047857]'
                              : 'bg-[#10B981] hover:bg-[#059669]'
                          }`}
                        >
                          {copiedDaxId === 'modal' ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Copied DAX!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Copy DAX</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadDaxFile(currentGeneratedDax, measureNameInput)
                          }
                          className="pop-btn p-1.5 rounded-xl bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]"
                          title="Download .dax file"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Power BI Formula Bar Paste Tip */}
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] font-medium text-purple-950 dark:text-purple-200 flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>
                        <strong>In Power BI Desktop:</strong> Click <em>New Measure</em>, select all in the formula bar (<kbd className="font-mono px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-[10px]">Ctrl+A</kbd>), then paste (<kbd className="font-mono px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-[10px]">Ctrl+V</kbd>).
                      </span>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[#1E293B] text-slate-100 font-mono text-[11.5px] overflow-x-auto max-h-[250px] leading-relaxed border-2 border-[#1E293B] select-all">
                      <code>{currentGeneratedDax}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-900 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Ready to paste directly into Power BI Desktop</span>
              </span>
              <button
                type="button"
                onClick={handleCloseCustomizer}
                className="pop-btn px-4 py-2 rounded-xl bg-[#1E293B] text-white hover:bg-slate-700 text-xs font-heading font-black cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

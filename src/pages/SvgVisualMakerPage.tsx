import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { AppPage } from '../core/types';
import { VisualCategory, SvgVisualDefinition } from '../core/svgVisuals/types';
import { SVG_VISUALS_CATALOG, SVG_CATEGORIES } from '../core/svgVisuals/catalog';
import { convertRawSvgToDax } from '../core/svgVisuals/svgToDaxConverter';

interface SvgVisualMakerPageProps {
  onNavigate: (page: AppPage) => void;
}

export const SvgVisualMakerPage: React.FC<SvgVisualMakerPageProps> = ({ onNavigate }) => {
  // Navigation tabs within this page
  const [activeTab, setActiveTab] = useState<'gallery' | 'converter'>('gallery');

  // Search & category filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VisualCategory | 'all'>('all');

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
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#0F172A] text-[#1E293B] dark:text-slate-100 transition-colors pb-24">
      {/* Hero Header */}
      <section className="border-b-2 border-[#1E293B] dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6] text-white text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>Power BI Micro-Visuals & DAX Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white">
            SVG Visual Maker & <span className="text-[#8B5CF6]">DAX Generator</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
            Generate error-free Power BI DAX measures for matrix and table micro-charts.
            Pick from dozens of curated visuals or convert any custom SVG into a copyable measure with Image URL data category.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-[#FEF08A] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ Matrix & Table Ready
            </span>
            <span className="px-3 py-1 rounded-full bg-[#BBF7D0] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ 100% In-Browser Privacy
            </span>
            <span className="px-3 py-1 rounded-full bg-[#BAE6FD] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ Data Category: Image URL
            </span>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]">
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
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
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
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
        </div>
      </section>

      {/* Main Workspace Content */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Search and Category Filters Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search visuals (gauge, ring, sparkline, bullet, ibcs)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-[#1E293B] dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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
                      onClick={() => setSelectedCategory(cat.id as VisualCategory | 'all')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-black whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                          : 'bg-[#FFFDF5] dark:bg-slate-900 text-[#1E293B] dark:text-slate-300 border-2 border-[#1E293B]/20 hover:bg-[#FBBF24] hover:text-[#1E293B]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                {filteredVisuals.map((visual) => {
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
                          className="w-full max-w-[140px] max-h-[90px] flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
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
                            className="flex-1 pop-btn py-1.5 px-2.5 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#1E293B]"
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
                          className="pop-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-heading font-black cursor-pointer shadow-[1.5px_1.5px_0px_0px_#1E293B]"
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
                        className="w-full max-w-[180px] max-h-[100px] flex items-center justify-center"
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
                          <strong>Power BI Desktop Tip:</strong> Paste this DAX expression into a new measure.
                          Select the measure, go to <strong>Measure Tools</strong>, and set{' '}
                          <strong>Data Category = Image URL</strong>.
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
                        className="w-full max-w-[180px] flex items-center justify-center"
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
                          className="pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-heading font-black cursor-pointer shadow-[2px_2px_0px_0px_#1E293B]"
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
    </div>
  );
};

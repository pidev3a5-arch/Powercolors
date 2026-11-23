import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Check,
  Download,
  Code,
  Sliders,
  X,
  CheckCircle2,
  FileCode,
  Eye,
} from 'lucide-react';
import { AppPage } from '../core/types';
import { DenebCategory, DenebSpecTemplate } from '../core/deneb/types';
import { DENEB_CATALOG, DENEB_CATEGORIES } from '../core/deneb/catalog';
import {
  injectThemePaletteIntoSpec,
  generatePbirDenebVisualJson,
  downloadDenebSpecFile,
} from '../core/deneb/denebEngine';

interface DenebStudioPageProps {
  onNavigate: (page: AppPage) => void;
  paletteHexes?: string[];
}

const DEFAULT_PALETTE = ['#8B5CF6', '#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#F97316'];

export const DenebStudioPage: React.FC<DenebStudioPageProps> = ({
  onNavigate,
  paletteHexes = DEFAULT_PALETTE,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DenebCategory | 'all'>('all');
  const [activeModalTemplate, setActiveModalTemplate] = useState<DenebSpecTemplate | null>(null);
  const [modalTab, setModalTab] = useState<'editor' | 'bindings' | 'pbir'>('editor');
  const [editedSpecStr, setEditedSpecStr] = useState<string>('');
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'spec' | 'pbir' | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return DENEB_CATALOG.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchBadge = item.badge.toLowerCase().includes(q);
      const matchRoles = item.dataRoles.some((r) => r.name.toLowerCase().includes(q));

      return matchName || matchDesc || matchBadge || matchRoles;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopySpec = (template: DenebSpecTemplate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const finalSpec = injectThemePaletteIntoSpec(template.spec, paletteHexes);
    navigator.clipboard.writeText(JSON.stringify(finalSpec, null, 2));
    setCopiedId(template.id);
    setCopiedType('spec');
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopyPbirJson = (template: DenebSpecTemplate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pbirJson = generatePbirDenebVisualJson(template, {
      palette: paletteHexes,
    });
    navigator.clipboard.writeText(pbirJson);
    setCopiedId(template.id);
    setCopiedType('pbir');
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const handleOpenCustomizer = (template: DenebSpecTemplate) => {
    const finalSpec = injectThemePaletteIntoSpec(template.spec, paletteHexes);
    setActiveModalTemplate(template);
    setEditedSpecStr(JSON.stringify(finalSpec, null, 2));
    setJsonParseError(null);
    setModalTab('editor');
  };

  const handleSpecChange = (newVal: string) => {
    setEditedSpecStr(newVal);
    try {
      JSON.parse(newVal);
      setJsonParseError(null);
    } catch (err: any) {
      setJsonParseError(err.message || 'Invalid JSON syntax');
    }
  };

  return (
    <>
      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-24">
        {/* Top Banner & Header - Left-aligned neo-brutalist pop header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b-2 border-[#1E293B] dark:border-slate-800">
          <div className="space-y-2 text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 text-xs font-heading font-black border border-[#8B5CF6]/30 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CERTIFIED POWER BI CUSTOM VISUAL STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight">
              Deneb & <span className="text-[#8B5CF6]">Vega-Lite Visual Studio</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Author, customize, and export certified Deneb Vega-Lite declarative visualization specs directly integrated with your active PowerLab color palettes and ready for PBIR visual.json insertion.
            </p>

            {/* Value Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                ✓ Vega-Lite 5+ Ready
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#BBF7D0] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                ✓ Auto-Palette Binding
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#BAE6FD] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                ✓ PBIR Visual Container JSON
              </span>
            </div>
          </div>

          {/* Quick Context Switchers */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('pbip-studio')}
              className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer hover:bg-slate-50"
            >
              <FileCode className="w-4 h-4 text-[#8B5CF6]" />
              <span>Fabric PBIP Studio</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('theme-generator')}
              className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8B5CF6] text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer hover:bg-[#7C3AED]"
            >
              <Sliders className="w-4 h-4" />
              <span>Theme Studio</span>
            </button>
          </div>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B]">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Deneb specs (bullet, lollipop, waterfall, boxplot, heatmap)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFDF5] dark:bg-slate-900 border-2 border-[#1E293B] text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-[#1E293B] dark:hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {DENEB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`pop-btn px-3 py-1.5 rounded-xl text-xs font-heading font-black cursor-pointer transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-[#1E293B] hover:bg-purple-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 text-inherit">
                  {cat.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const previewSvg = template.renderPreviewSvg(paletteHexes);
            const isCopiedSpec = copiedId === template.id && copiedType === 'spec';
            const isCopiedPbir = copiedId === template.id && copiedType === 'pbir';

            return (
              <div
                key={template.id}
                className="pop-card p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] flex flex-col justify-between space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-black bg-[#FEF08A] text-[#1E293B] border border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]">
                        {template.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-black text-[#1E293B] dark:text-white mt-1.5 leading-tight">
                        {template.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                      {template.provider}
                    </span>
                  </div>

                  {/* SVG Live Mock Preview */}
                  <div
                    onClick={() => handleOpenCustomizer(template)}
                    className="w-full h-36 rounded-2xl bg-[#FFFDF5] dark:bg-slate-950 border-2 border-[#1E293B] flex items-center justify-center p-3 shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer hover:border-[#8B5CF6] transition-colors relative group"
                    title="Click to customize and view spec"
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: previewSvg }}
                    />
                    <div className="absolute inset-0 bg-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <span className="px-3 py-1 rounded-xl bg-[#1E293B] text-white text-xs font-heading font-black shadow-[2px_2px_0px_0px_#8B5CF6] inline-flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Spec</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Data Roles summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-heading font-black text-slate-400 uppercase tracking-wider block">
                      Required Dataset Fields:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {template.dataRoles.map((role) => (
                        <span
                          key={role.name}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {role.name} ({role.type === 'Measure' ? 'Meas' : 'Col'})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="pt-2 border-t-2 border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleCopySpec(template, e)}
                    className="pop-btn flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer hover:bg-purple-50"
                    title="Copy Vega-Lite JSON specification"
                  >
                    {isCopiedSpec ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Copy Spec</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopyPbirJson(template, e)}
                    className="pop-btn flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer hover:bg-[#7C3AED]"
                    title="Copy official PBIR visual.json container for Deneb"
                  >
                    {isCopiedPbir ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        <span>Copied PBIR!</span>
                      </>
                    ) : (
                      <>
                        <FileCode className="w-3.5 h-3.5" />
                        <span>PBIR JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadDenebSpecFile(template.spec, template.id)}
                    className="pop-btn p-2 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer hover:bg-slate-100"
                    title="Download .vl.json file"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* =========================================================================
          INTERACTIVE SPEC INSPECTOR & PBIR MODAL
         ========================================================================= */}
      {activeModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] shadow-[8px_8px_0px_0px_#1E293B] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b-2 border-[#1E293B] flex items-center justify-between gap-3 bg-[#FFFDF5] dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1E293B]">
                  <Sliders className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#1E293B] dark:text-white leading-tight">
                    {activeModalTemplate.name}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Category: <span className="font-black text-[#8B5CF6]">{activeModalTemplate.category}</span> • Provider: <span className="font-mono">{activeModalTemplate.provider}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalTemplate(null)}
                className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#EF4444] hover:text-white transition-all cursor-pointer border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Subnav */}
            <div className="px-4 py-2 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalTab('editor')}
                className={`pop-btn px-3 py-1.5 rounded-xl text-xs font-heading font-black cursor-pointer ${
                  modalTab === 'editor'
                    ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B]'
                }`}
              >
                Vega-Lite Spec (JSON)
              </button>
              <button
                type="button"
                onClick={() => setModalTab('bindings')}
                className={`pop-btn px-3 py-1.5 rounded-xl text-xs font-heading font-black cursor-pointer ${
                  modalTab === 'bindings'
                    ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B]'
                }`}
              >
                Power BI Data Bindings
              </button>
              <button
                type="button"
                onClick={() => setModalTab('pbir')}
                className={`pop-btn px-3 py-1.5 rounded-xl text-xs font-heading font-black cursor-pointer ${
                  modalTab === 'pbir'
                    ? 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B]'
                }`}
              >
                PBIR Container JSON
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Preview Box */}
              <div className="p-4 rounded-2xl bg-[#FFFDF5] dark:bg-slate-950 border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-center">
                <div
                  className="w-full max-w-sm h-36 flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: activeModalTemplate.renderPreviewSvg(paletteHexes),
                  }}
                />
              </div>

              {/* Tab 1: JSON Spec Editor */}
              {modalTab === 'editor' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-black text-slate-500 uppercase">
                      Vega-Lite Specification JSON
                    </span>
                    {jsonParseError && (
                      <span className="text-xs font-bold text-red-500">
                        Syntax Error: {jsonParseError}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={editedSpecStr}
                    onChange={(e) => handleSpecChange(e.target.value)}
                    rows={12}
                    className="w-full p-3.5 rounded-xl bg-[#1E293B] text-slate-100 font-mono text-xs border-2 border-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] resize-y leading-relaxed"
                  />
                </div>
              )}

              {/* Tab 2: Power BI Data Bindings */}
              {modalTab === 'bindings' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200">
                    <strong>In Power BI Desktop:</strong> Add the certified <strong>Deneb</strong> visual to your page, then drag the following columns and measures into the <strong>Values</strong> well.
                  </div>
                  <div className="space-y-2">
                    {activeModalTemplate.dataRoles.map((role) => (
                      <div
                        key={role.name}
                        className="p-3 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-heading font-black text-slate-800 dark:text-slate-100">
                            {role.name}
                          </span>
                          <p className="text-slate-500">{role.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-[#FEF08A] text-[#1E293B] border border-[#1E293B]">
                            {role.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-md font-mono text-slate-500 bg-white dark:bg-slate-700 border border-slate-300">
                            {role.dataType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: PBIR Visual Container JSON */}
              {modalTab === 'pbir' && (
                <div className="space-y-2">
                  <span className="text-xs font-heading font-black text-slate-500 uppercase block">
                    PBIR visual.json Drop-in Snippet (Includes Deneb GUID & Escaped Spec)
                  </span>
                  <pre className="p-3.5 rounded-xl bg-[#1E293B] text-slate-100 font-mono text-xs border-2 border-[#1E293B] overflow-x-auto max-h-[300px] leading-relaxed">
                    <code>
                      {generatePbirDenebVisualJson(activeModalTemplate, {
                        palette: paletteHexes,
                      })}
                    </code>
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Theme colors automatically bound to visual color scales</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopySpec(activeModalTemplate)}
                  className="pop-btn px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] text-xs font-heading font-black cursor-pointer hover:bg-slate-50"
                >
                  Copy Spec
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyPbirJson(activeModalTemplate)}
                  className="pop-btn px-4 py-2 rounded-xl bg-[#8B5CF6] text-white border-2 border-[#1E293B] text-xs font-heading font-black cursor-pointer hover:bg-[#7C3AED]"
                >
                  Copy PBIR JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

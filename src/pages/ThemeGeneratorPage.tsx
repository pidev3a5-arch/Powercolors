import React, { useState } from 'react';
import { Sparkles, Download, Code2, Copy, Check, Wand2, Palette } from 'lucide-react';
import { ColorSwatch, StructuralColors, PowerBITheme, ThemeCustomizationOptions, AppPage } from '../core/types';
import { serializePowerBITheme } from '../core/powerBiTheme';
import { ImageUploader } from '../components/ImageUploader';
import { PaletteStrip } from '../components/PaletteStrip';
import { ThemeControls } from '../components/ThemeControls';
import { ReportCanvas } from '../components/ReportCanvas';
import { JsonThemeModal } from '../components/JsonThemeModal';
import { PaletteHarmonyPage } from './PaletteHarmonyPage';

interface ThemeGeneratorPageProps {
  onNavigate?: (page: AppPage) => void;
  activeTab?: 'theme-generator' | 'palette-harmony';
  onTabChange?: (tab: 'theme-generator' | 'palette-harmony') => void;
  onApplyHarmony?: (hexes: string[]) => void;
  swatches: ColorSwatch[];
  structural: StructuralColors;
  themeName: string;
  setThemeName: (name: string) => void;
  isDarkCanvas: boolean;
  isDarkSite: boolean;
  customizationOptions: ThemeCustomizationOptions;
  onCustomizationOptionsChange: (options: ThemeCustomizationOptions) => void;
  handleUpdateStructuralColor: (key: keyof StructuralColors, hex: string) => void;
  handleUpdateHex: (index: number, newHex: string) => void;
  handleToggleLock: (index: number) => void;
  handleMoveLeft: (index: number) => void;
  handleMoveRight: (index: number) => void;
  handleReversePalette: () => void;
  handleToggleLockAll: () => void;
  handleShuffleUnlocked: () => void;
  handleImageSelected: (source: string | File, fileName?: string) => Promise<void>;
  handleClearImage: () => void;
  currentImagePreview: string | null;
  currentImageName: string | null;
  isLoading: boolean;
  handleToggleCanvasMode: () => void;
  handleDownloadJson: () => void;
  handleCopyJson?: () => void;
  jsonCopied?: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  currentTheme: PowerBITheme;
}

export const ThemeGeneratorPage: React.FC<ThemeGeneratorPageProps> = ({
  onNavigate,
  activeTab,
  onTabChange,
  onApplyHarmony,
  swatches,
  structural,
  themeName,
  setThemeName,
  isDarkCanvas,
  isDarkSite,
  customizationOptions,
  onCustomizationOptionsChange,
  handleUpdateStructuralColor,
  handleUpdateHex,
  handleToggleLock,
  handleMoveLeft,
  handleMoveRight,
  handleReversePalette,
  handleToggleLockAll,
  handleShuffleUnlocked,
  handleImageSelected,
  handleClearImage,
  currentImagePreview,
  currentImageName,
  isLoading,
  handleToggleCanvasMode,
  handleDownloadJson,
  handleCopyJson,
  jsonCopied,
  isModalOpen,
  setIsModalOpen,
  currentTheme,
}) => {
  const [internalTab, setInternalTab] = useState<'theme-generator' | 'palette-harmony'>('theme-generator');
  const currentTab = activeTab !== undefined ? activeTab : internalTab;

  const handleTabClick = (tab: 'theme-generator' | 'palette-harmony') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [localCopied, setLocalCopied] = useState(false);
  const isCopied = jsonCopied !== undefined ? jsonCopied : localCopied;

  const onCopy = () => {
    if (handleCopyJson) {
      handleCopyJson();
    } else {
      const jsonString = serializePowerBITheme(currentTheme);
      navigator.clipboard.writeText(jsonString);
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 2000);
    }
  };

  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10 sm:space-y-14">
      {/* Studio Top Navigation: 2 Tabs (Theme Generator & Palette Harmony) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B]">
          <button
            type="button"
            onClick={() => handleTabClick('theme-generator')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer border-2 ${
              currentTab === 'theme-generator'
                ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme Generator</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('palette-harmony')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer border-2 ${
              currentTab === 'palette-harmony'
                ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Palette Harmony</span>
          </button>
        </div>

        {currentTab === 'theme-generator' && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onCopy}
              className="pop-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] hover:bg-slate-50 transition-all cursor-pointer"
              title="Copy theme JSON to clipboard"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500 stroke-[2.5]" />
              )}
              <span>{isCopied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="pop-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
              title="Download theme JSON file for Power BI Desktop"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Theme</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: PALETTE HARMONY */}
      {currentTab === 'palette-harmony' && (
        <div className="pt-2">
          <PaletteHarmonyPage
            onNavigate={onNavigate || (() => {})}
            onApplyToThemeStudio={(harmonyHexes) => {
              if (onApplyHarmony) {
                onApplyHarmony(harmonyHexes);
              }
              handleTabClick('theme-generator');
            }}
          />
        </div>
      )}

      {/* TAB 2: THEME GENERATOR */}
      {currentTab === 'theme-generator' && (
        <>
          {/* Playful Geometric Hero Section */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
            {/* Decorative Background Shapes */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FBBF24]/20 -z-10 blur-xl pointer-events-none" />
            <div className="absolute top-12 -left-8 w-20 h-20 rounded-full bg-[#F472B6]/20 -z-10 blur-xl pointer-events-none" />

            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#1E293B] animate-pulse" />
                <span>Stable Grid, Wild Decoration</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white leading-[1.1]">
                Playful Geometric <span className="text-[#8B5CF6]">Theme Studio</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                A friendly, tactile, and energetic palette generator for Microsoft Power BI. Drop a brand logo or paste a screenshot (<kbd className="px-1.5 py-0.5 text-xs font-mono font-bold bg-[#FBBF24] text-[#1E293B] border border-[#1E293B] rounded shadow-[1px_1px_0px_0px_#1E293B]">Ctrl+V</kbd>) to quantize 10 vivid data colors with official schema compliance.
              </p>
            </div>
          </div>

      {/* Section 1: Ingestion Zone */}
      <section aria-label="Image and Preset Ingestion">
        <ImageUploader
          onImageSelected={handleImageSelected}
          onClearImage={handleClearImage}
          currentImagePreview={currentImagePreview}
          currentImageName={currentImageName}
          isLoading={isLoading}
          isDarkSite={isDarkSite}
        />
      </section>

      {/* Section 2: 10-Color Palette Swatch Management */}
      <section aria-label="Color Palette Strip" className="space-y-4">
        <PaletteStrip
          swatches={swatches}
          isDarkCanvas={isDarkCanvas}
          isDarkSite={isDarkSite}
          onUpdateHex={handleUpdateHex}
          onToggleLock={handleToggleLock}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          onReversePalette={handleReversePalette}
          onToggleLockAll={handleToggleLockAll}
          onShuffleUnlocked={handleShuffleUnlocked}
        />
      </section>

      {/* Section 2.5: Report Theme Customization Controls */}
      <section aria-label="Theme Customization Controls">
        <ThemeControls
          themeName={themeName}
          onThemeNameChange={setThemeName}
          isDarkCanvas={isDarkCanvas}
          onToggleCanvasMode={handleToggleCanvasMode}
          structural={structural}
          onUpdateStructuralColor={handleUpdateStructuralColor}
          customizationOptions={customizationOptions}
          onCustomizationOptionsChange={onCustomizationOptionsChange}
          isDarkSite={isDarkSite}
        />
      </section>

      {/* Section 3: Live Power BI Visuals Mock Canvas */}
      <section aria-label="Power BI Live Canvas Simulation" className="space-y-4">
        <ReportCanvas
          swatches={swatches}
          structural={structural}
          isDarkCanvas={isDarkCanvas}
          themeName={themeName}
          fontFamily={customizationOptions.fontFamily}
        />
      </section>

      {/* Section 4: Secondary Download Action Below Canvas */}
      <section aria-label="Export Theme Callout" className="pt-2">
        <div className="rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1E293B] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-heading font-black text-[#1E293B] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#FBBF24] stroke-[2.5]" />
              <span>Ready to apply this theme in Power BI?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Download the verified JSON theme and import it directly into Power BI Desktop under <em>View → Themes → Browse for themes</em>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto flex-shrink-0">
            {/* Inspect JSON Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] hover:text-[#1E293B] border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
              title="Inspect raw JSON theme schema with verification"
            >
              <Code2 className="w-4 h-4 stroke-[2.5]" />
              <span>Inspect JSON</span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={onCopy}
              className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] transition-all cursor-pointer"
              title="Copy theme JSON to clipboard"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{isCopied ? 'Copied JSON!' : 'Copy'}</span>
            </button>

            {/* Download Theme Button */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white border-2 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] transition-all cursor-pointer flex-shrink-0"
              title="Download theme JSON file for Power BI Desktop"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download Theme</span>
            </button>
          </div>
        </div>
      </section>
        </>
      )}

      {/* JSON Inspection Modal */}
      <JsonThemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={currentTheme}
        themeName={themeName}
        isDarkCanvas={isDarkCanvas}
      />
    </main>
  );
};

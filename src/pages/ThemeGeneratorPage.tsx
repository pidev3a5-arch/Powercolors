import React from 'react';
import { Sparkles, Download } from 'lucide-react';
import { ColorSwatch, StructuralColors, PowerBITheme, ThemeCustomizationOptions, AppPage } from '../core/types';
import { ImageUploader } from '../components/ImageUploader';
import { PaletteStrip } from '../components/PaletteStrip';
import { ThemeControls } from '../components/ThemeControls';
import { ReportCanvas } from '../components/ReportCanvas';
import { JsonThemeModal } from '../components/JsonThemeModal';

interface ThemeGeneratorPageProps {
  onNavigate?: (page: AppPage) => void;
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
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  currentTheme: PowerBITheme;
}

export const ThemeGeneratorPage: React.FC<ThemeGeneratorPageProps> = ({
  onNavigate: _onNavigate,
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
  isModalOpen,
  setIsModalOpen,
  currentTheme,
}) => {
  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10 sm:space-y-14">
      {/* Playful Geometric Hero Section */}
      <div className="relative space-y-3">
        {/* Decorative Background Shapes */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FBBF24]/20 -z-10 blur-xl pointer-events-none" />
        <div className="absolute top-12 -left-8 w-20 h-20 rounded-full bg-[#F472B6]/20 -z-10 blur-xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
          <span className="w-2 h-2 rounded-full bg-[#1E293B] animate-pulse" />
          <span>Stable Grid, Wild Decoration</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white leading-[1.1]">
          Playful Geometric <span className="text-[#8B5CF6]">Theme Studio</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
          A friendly, tactile, and energetic palette generator for Microsoft Power BI. Drop a brand logo or paste a screenshot (<kbd className="px-1.5 py-0.5 text-xs font-mono font-bold bg-[#FBBF24] text-[#1E293B] border border-[#1E293B] rounded shadow-[1px_1px_0px_0px_#1E293B]">Ctrl+V</kbd>) to quantize 10 vivid data colors with official schema compliance.
        </p>
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

          <button
            type="button"
            onClick={handleDownloadJson}
            className="pop-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-heading font-black bg-[#F472B6] hover:bg-[#EC4899] text-white shadow-[4px_4px_0px_0px_#1E293B] transition-all cursor-pointer flex-shrink-0"
            title="Download theme JSON file for Power BI Desktop"
          >
            <Download className="w-5 h-5 stroke-[3]" />
            <span>Download Theme</span>
          </button>
        </div>
      </section>

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

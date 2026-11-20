import { useState, useCallback, useEffect } from 'react';
import { Sun, Moon, Download, Copy, Check, Code2, Sparkles } from 'lucide-react';
import { ColorSwatch, StructuralColors, PowerBITheme, ThemeCustomizationOptions } from './core/types';
import { ImageUploader } from './components/ImageUploader';
import { PaletteStrip } from './components/PaletteStrip';
import { ThemeControls } from './components/ThemeControls';
import { ReportCanvas } from './components/ReportCanvas';
import { JsonThemeModal } from './components/JsonThemeModal';
import { LinkedInIcon, FacebookIcon, YouTubeIcon, GitHubIcon } from './components/SocialIcons';
import { extractThemeFromImage } from './core/colorEngine';
import { createColorSwatch, deriveStructuralColors } from './core/colorHarmonics';
import { buildPowerBITheme, serializePowerBITheme } from './core/powerBiTheme';
import { SAMPLE_PRESETS } from './data/samplePresets';

// Initial default corporate palette
const DEFAULT_PALETTE_HEXES = [
  '#8B5CF6', '#F472B6', '#FBBF24', '#34D399', '#38BDF8',
  '#EC4899', '#10B981', '#6366F1', '#F97316', '#A855F7',
];

export default function App() {
  // Site Theme: Light mode by default (Warm Cream Paper Feel)
  const [isDarkSite, setIsDarkSite] = useState<boolean>(() => {
    const saved = localStorage.getItem('powerlab_site_theme');
    return saved === 'dark';
  });

  // Power BI Canvas theme & Report settings
  const [themeName, setThemeName] = useState('Playful Geometric Theme');
  const [isDarkCanvas, setIsDarkCanvas] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [currentImageName, setCurrentImageName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Customization options for Power BI JSON
  const [customizationOptions, setCustomizationOptions] = useState<ThemeCustomizationOptions>({
    fontFamily: 'Segoe UI',
    showVisualBorders: true,
    showVisualDropShadow: true,
  });

  // Sync site theme to document class
  useEffect(() => {
    if (isDarkSite) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('powerlab_site_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('powerlab_site_theme', 'light');
    }
  }, [isDarkSite]);

  const toggleSiteTheme = () => {
    setIsDarkSite((prev) => !prev);
  };

  // Initialize 10 default swatches
  const [swatches, setSwatches] = useState<ColorSwatch[]>(() =>
    DEFAULT_PALETTE_HEXES.map((hex, idx) => createColorSwatch(hex, `swatch-${idx + 1}`))
  );

  // Initialize structural colors derived from first swatch
  const [structural, setStructural] = useState<StructuralColors>(() =>
    deriveStructuralColors(DEFAULT_PALETTE_HEXES[0], false)
  );

  // Update structural colors when report canvas mode changes
  const handleToggleCanvasMode = useCallback(() => {
    setIsDarkCanvas((prev) => {
      const nextMode = !prev;
      setStructural((curr) => deriveStructuralColors(curr.tableAccent, nextMode));
      return nextMode;
    });
  }, []);

  // Update single swatch hex
  const handleUpdateHex = useCallback((index: number, newHex: string) => {
    setSwatches((prev) => {
      const next = [...prev];
      next[index] = {
        ...createColorSwatch(newHex, next[index].id),
        isLocked: next[index].isLocked,
      };
      return next;
    });
  }, []);

  // Toggle swatch lock
  const handleToggleLock = useCallback((index: number) => {
    setSwatches((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isLocked: !next[index].isLocked };
      return next;
    });
  }, []);

  // Move swatch earlier
  const handleMoveLeft = useCallback((index: number) => {
    if (index <= 0) return;
    setSwatches((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  }, []);

  // Move swatch later
  const handleMoveRight = useCallback((index: number) => {
    setSwatches((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  }, []);

  // Reverse palette order
  const handleReversePalette = useCallback(() => {
    setSwatches((prev) => [...prev].reverse());
  }, []);

  // Toggle lock all
  const handleToggleLockAll = useCallback(() => {
    setSwatches((prev) => {
      const allLocked = prev.every((s) => s.isLocked);
      return prev.map((s) => ({ ...s, isLocked: !allLocked }));
    });
  }, []);

  // Shuffle only unlocked swatches
  const handleShuffleUnlocked = useCallback(() => {
    setSwatches((prev) => {
      const unlockedIndices = prev
        .map((s, idx) => (!s.isLocked ? idx : -1))
        .filter((idx) => idx !== -1);

      const unlockedValues = unlockedIndices.map((idx) => prev[idx]);
      for (let i = unlockedValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unlockedValues[i], unlockedValues[j]] = [unlockedValues[j], unlockedValues[i]];
      }

      const next = [...prev];
      unlockedIndices.forEach((origIdx, i) => {
        next[origIdx] = unlockedValues[i];
      });
      return next;
    });
  }, []);

  // Handle custom structural color change
  const handleUpdateStructuralColor = useCallback((key: keyof StructuralColors, hex: string) => {
    setStructural((prev) => ({ ...prev, [key]: hex }));
  }, []);

  // Extract from image, respecting locked swatches
  const handleImageSelected = useCallback(async (source: File | string, displayName: string) => {
    setIsLoading(true);

    try {
      if (typeof source === 'string') {
        setCurrentImagePreview(source);
      } else {
        const url = URL.createObjectURL(source);
        setCurrentImagePreview(url);
      }
      setCurrentImageName(displayName);

      const cleanName = displayName
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim();
      if (cleanName) {
        setThemeName(`${cleanName} Theme`);
      }

      const { result, theme } = await extractThemeFromImage(source, `${cleanName} Theme`, isDarkCanvas);

      setSwatches((prevSwatches) => {
        const extracted = result.dataColors;
        const next = [...prevSwatches];
        let extractedIdx = 0;

        for (let i = 0; i < 10; i++) {
          if (!next[i]?.isLocked) {
            if (extracted[extractedIdx]) {
              next[i] = extracted[extractedIdx];
              extractedIdx++;
            }
          }
        }
        return next;
      });

      // Update structural colors
      setStructural(theme ? {
        background: theme.background,
        foreground: theme.foreground,
        tableAccent: theme.tableAccent,
        good: theme.good,
        bad: theme.bad,
        neutral: theme.neutral,
      } : deriveStructuralColors(result.dominantColor, isDarkCanvas));

    } catch (err) {
      console.error('Extraction failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isDarkCanvas]);

  const handleClearImage = useCallback(() => {
    setCurrentImagePreview(null);
    setCurrentImageName(null);
  }, []);

  // Current compiled theme JSON
  const currentTheme: PowerBITheme = buildPowerBITheme(
    themeName,
    swatches.map((s) => s.hex),
    structural,
    customizationOptions
  );

  const handleDownloadJson = () => {
    const jsonString = serializePowerBITheme(currentTheme);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'power-bi-theme';
    a.download = `${slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    const jsonString = serializePowerBITheme(currentTheme);
    navigator.clipboard.writeText(jsonString);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  // Load first sample preset on initial mount
  useEffect(() => {
    if (SAMPLE_PRESETS[0]) {
      handleImageSelected(SAMPLE_PRESETS[0].dataUri, SAMPLE_PRESETS[0].name);
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 bg-dot-grid ${
      isDarkSite ? 'bg-[#0F172A] text-slate-100' : 'bg-[#FFFDF5] text-[#1E293B]'
    }`}>
      {/* Top Navigation Bar: Chunky 2px Border, Responsive Mobile Layout */}
      <header className={`border-b-2 border-[#1E293B] dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
        isDarkSite ? 'bg-[#0F172A]/90' : 'bg-[#FFFDF5]/90'
      }`}>
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo, Wordmark & Playful Pill Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center p-1 sm:p-1.5 hover-wiggle cursor-pointer">
              <img
                src="/logo.png"
                alt="PowerLab Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 min-w-0">
              <span className="font-heading font-black text-base sm:text-2xl tracking-tight text-[#1E293B] dark:text-white truncate">
                Power<span className="text-[#8B5CF6]">Lab</span>
              </span>
              {/* Playful Geometric Pill Badge (hidden on mobile, visible on desktop) */}
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-heading font-extrabold border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] hover:-translate-y-0.5 transition-transform">
                <Sparkles className="w-3.5 h-3.5 fill-white stroke-none" />
                <span>Design System</span>
              </span>
            </div>
          </div>

          {/* Action Toolbar with Responsive Candy Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2.5 flex-shrink-0">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleSiteTheme}
              className="pop-btn p-1.5 sm:p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all cursor-pointer"
              title={isDarkSite ? 'Switch to Warm Cream Paper Mode' : 'Switch to Playful Dark Mode'}
            >
              {isDarkSite ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
            </button>

            {/* Inspect JSON Modal Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pop-btn inline-flex items-center gap-1.5 p-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-heading font-extrabold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#F472B6] hover:text-white transition-all cursor-pointer"
              title="Inspect Theme JSON with Schema Verification"
            >
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Inspect JSON</span>
            </button>

            {/* Copy JSON Button */}
            <button
              type="button"
              onClick={handleCopyJson}
              className="pop-btn inline-flex items-center gap-1.5 p-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-heading font-extrabold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#34D399] hover:text-[#1E293B] transition-all cursor-pointer"
              title="Copy theme JSON to clipboard"
            >
              {jsonCopied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
              <span className="hidden sm:inline">{jsonCopied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Download Theme (Primary Candy Button in Vivid Violet, Compact on Mobile) */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="pop-btn inline-flex items-center gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all cursor-pointer shadow-[2.5px_2.5px_0px_0px_#1E293B]"
              title="Download theme JSON file for Power BI Desktop"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Download Theme</span>
              <span className="sm:hidden font-extrabold">Theme</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10 sm:space-y-14">
        {/* Playful Geometric Hero Section */}
        <div className="relative space-y-3">
          {/* Decorative Background Shapes */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FBBF24]/20 -z-10 blur-xl pointer-events-none" />
          <div className="absolute top-12 -left-8 w-20 h-20 rounded-full bg-[#F472B6]/20 -z-10 blur-xl pointer-events-none" />

          {/* Section Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBBF24] text-[#1E293B] text-xs font-heading font-black border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5 fill-[#1E293B] stroke-none" />
            <span>Stable Grid, Wild Decoration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-[#1E293B] dark:text-white leading-[1.15]">
            Playful Geometric <span className="text-[#8B5CF6]">Theme Studio</span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            A friendly, tactile, and energetic palette generator for Microsoft Power BI. Drop a brand logo or paste a screenshot (<kbd className="font-mono font-bold bg-[#FBBF24] text-[#1E293B] px-1.5 py-0.5 rounded border border-[#1E293B]">Ctrl+V</kbd>) to quantize 10 vivid data colors with official schema compliance.
          </p>
        </div>

        {/* Section 1: Image Ingestion Dropzone */}
        <section className="space-y-4">
          <ImageUploader
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
            currentImagePreview={currentImagePreview}
            currentImageName={currentImageName}
            onClearImage={handleClearImage}
            isDarkSite={isDarkSite}
          />
        </section>

        {/* Section 2: Interactive 10-Swatch Palette Strip */}
        <section className="space-y-4">
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

        {/* Section 3: Theme Settings & Typography Controls */}
        <section className="space-y-4">
          <ThemeControls
            themeName={themeName}
            onThemeNameChange={setThemeName}
            isDarkCanvas={isDarkCanvas}
            onToggleCanvasMode={handleToggleCanvasMode}
            structural={structural}
            onUpdateStructuralColor={handleUpdateStructuralColor}
            customizationOptions={customizationOptions}
            onCustomizationOptionsChange={setCustomizationOptions}
            isDarkSite={isDarkSite}
          />
        </section>

        {/* Section 4: Live Power BI Visuals Mock Canvas */}
        <section className="space-y-6">
          <ReportCanvas
            swatches={swatches}
            structural={structural}
            isDarkCanvas={isDarkCanvas}
            themeName={themeName}
            fontFamily={customizationOptions.fontFamily}
          />

          {/* Download Theme Action Bar with Different Color (Hot Pink Pop) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[6px_6px_0px_0px_#1E293B] dark:shadow-[6px_6px_0px_0px_#020617]">
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
      </main>

      {/* JSON Inspection Modal */}
      <JsonThemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={currentTheme}
        themeName={themeName}
        isDarkCanvas={isDarkCanvas}
      />

      {/* Playful Footer */}
      <footer className={`border-t-2 border-[#1E293B] dark:border-slate-800 py-8 transition-colors ${
        isDarkSite ? 'bg-[#0B1120] text-slate-300' : 'bg-[#FFFDF5] text-[#1E293B]'
      }`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-center sm:text-left">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center p-0.5 shadow-[1px_1px_0px_0px_#1E293B]">
              <img src="/logo.png" alt="PowerLab Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading font-black text-sm text-[#1E293B] dark:text-white">
              Power<span className="text-[#8B5CF6]">Lab</span>
            </span>
            <span className="text-slate-500 font-medium">• 100% Client-Side Privacy • Playful Geometric</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3">
            {/* Social Media Candy Buttons */}
            <a
              href="https://www.linkedin.com/in/rachwen-mosbehi-792440120/"
              target="_blank"
              rel="noopener noreferrer"
              className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#0A66C2] hover:text-white transition-colors cursor-pointer"
              title="LinkedIn"
            >
              <LinkedInIcon size={16} />
            </a>

            <span
              className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#1877F2] hover:text-white transition-colors cursor-default"
              title="Facebook"
            >
              <FacebookIcon size={16} />
            </span>

            <span
              className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FF0000] hover:text-white transition-colors cursor-default"
              title="YouTube"
            >
              <YouTubeIcon size={16} />
            </span>

            <span
              className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#8B5CF6] hover:text-white transition-colors cursor-default"
              title="GitHub"
            >
              <GitHubIcon size={16} />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

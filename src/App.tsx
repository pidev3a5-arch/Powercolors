import { useState, useCallback, useEffect } from 'react';
import { Sun, Moon, Download, Copy, Check, Code2, ExternalLink } from 'lucide-react';
import { ColorSwatch, StructuralColors, PowerBITheme, ThemeCustomizationOptions } from './core/types';
import { ImageUploader } from './components/ImageUploader';
import { PaletteStrip } from './components/PaletteStrip';
import { ThemeControls } from './components/ThemeControls';
import { ReportCanvas } from './components/ReportCanvas';
import { JsonThemeModal } from './components/JsonThemeModal';
import { extractThemeFromImage } from './core/colorEngine';
import { createColorSwatch, deriveStructuralColors } from './core/colorHarmonics';
import { buildPowerBITheme, serializePowerBITheme } from './core/powerBiTheme';
import { SAMPLE_PRESETS } from './data/samplePresets';

// Initial default corporate palette
const DEFAULT_PALETTE_HEXES = [
  '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#D97706',
  '#059669', '#0D9488', '#0284C7', '#4F46E5', '#9333EA',
];

export default function App() {
  // 1. Site Theme: Light mode by default!
  const [isDarkSite, setIsDarkSite] = useState<boolean>(() => {
    const saved = localStorage.getItem('powercolors_site_theme');
    return saved === 'dark'; // Defaults to false (Light Mode)
  });

  // Power BI Canvas theme & Report settings
  const [themeName, setThemeName] = useState('PowerColors Corporate Theme');
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
    showVisualDropShadow: false,
  });

  // Sync site theme to document class
  useEffect(() => {
    if (isDarkSite) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('powercolors_site_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('powercolors_site_theme', 'light');
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
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkSite ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar with Borderless Logo & Site Theme Switcher */}
      <header className={`border-b sticky top-0 z-40 transition-colors backdrop-blur-md ${
        isDarkSite ? 'border-slate-800/80 bg-slate-900/85' : 'border-slate-200/90 bg-white/90 shadow-2xs'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo without grey border or white box & Site Title with #EC9700 */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="PowerColors Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`font-extrabold text-base sm:text-lg tracking-tight truncate ${isDarkSite ? 'text-white' : 'text-slate-900'}`}>
                  Power<span style={{ color: '#EC9700' }}>Colors</span>
                </span>
                <span className={`hidden md:inline-block text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isDarkSite ? 'bg-slate-800 text-amber-400 border-slate-700' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  Power BI Theme Lab
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Site Theme Toggle + JSON Modal + Export (Mobile Optimized) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
            {/* Site Light/Dark Mode Switcher */}
            <button
              type="button"
              onClick={toggleSiteTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkSite
                  ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 border-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title={isDarkSite ? 'Switch to Site Light Mode' : 'Switch to Site Dark Mode'}
            >
              {isDarkSite ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Inspect JSON Modal Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shadow-xs ${
                isDarkSite
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Inspect Theme JSON with Schema Verification"
            >
              <Code2 className="w-3.5 h-3.5 text-[#EC9700]" />
              <span className="hidden sm:inline">Inspect JSON</span>
            </button>

            {/* Copy JSON */}
            <button
              type="button"
              onClick={handleCopyJson}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shadow-xs ${
                isDarkSite
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Copy theme JSON to clipboard"
            >
              {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{jsonCopied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Download Theme Button */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#EC9700] hover:bg-[#d68800] text-slate-950 shadow-md hover:shadow-lg transition-all cursor-pointer font-sans"
              title="Download theme JSON file for Power BI Desktop"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Theme</span>
              <span className="sm:hidden">Theme</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area (Mobile Responsive Layout) */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Banner Section */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-500/10 border-amber-500/20 text-[#EC9700]">
            <span>Client-Side Palette Extractor & Power BI Themer</span>
          </div>
          <h1 className={`text-xl sm:text-3xl font-extrabold tracking-tight ${isDarkSite ? 'text-white' : 'text-slate-900'}`}>
            Generate 10-Color Power BI Palettes from Any Image
          </h1>
          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDarkSite ? 'text-slate-400' : 'text-slate-600'}`}>
            Drop a brand guideline, logo, or paste a screenshot (<kbd className="font-mono font-bold">Ctrl+V</kbd>). We quantize 10 distinct data colors, derive structural styles, and format an official Power BI theme file.
          </p>
        </div>

        {/* Section 1: Image Ingestion */}
        <section className="space-y-3">
          <ImageUploader
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
            currentImagePreview={currentImagePreview}
            currentImageName={currentImageName}
            onClearImage={handleClearImage}
            isDarkSite={isDarkSite}
          />
        </section>

        {/* Section 2: Theme Settings, Typography & Canvas Controls */}
        <section>
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

        {/* Section 3: Interactive 10-Swatch Palette Strip */}
        <section className={`border rounded-2xl p-3.5 sm:p-6 shadow-xs space-y-4 transition-colors ${
          isDarkSite ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
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

        {/* Section 4: Live Power BI Visuals Mock Canvas (Wired with Font Family!) */}
        <section>
          <ReportCanvas
            swatches={swatches}
            structural={structural}
            isDarkCanvas={isDarkCanvas}
            themeName={themeName}
            fontFamily={customizationOptions.fontFamily}
          />
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

      {/* Footer with Creator & Reviewer Attribution (Responsive) */}
      <footer className={`border-t py-6 sm:py-8 transition-colors ${
        isDarkSite ? 'border-slate-800/80 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="PowerColors Logo" className="w-5 h-5 object-contain" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Power<span style={{ color: '#EC9700' }}>Colors</span>
            </span>
            <span>• 100% In-Browser Privacy • Power BI JSON</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span>Created and reviewed by</span>
            <a
              href="https://www.linkedin.com/in/rachwen-mosbehi-792440120/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#EC9700] hover:underline"
            >
              <span>Rachwen Mosbehi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

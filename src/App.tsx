import { useState, useCallback, useEffect } from 'react';
import { Palette, Sparkles, Download, Copy, Check } from 'lucide-react';
import { ColorSwatch, StructuralColors, PowerBITheme } from './core/types';
import { ImageUploader } from './components/ImageUploader';
import { PaletteStrip } from './components/PaletteStrip';
import { ThemeControls } from './components/ThemeControls';
import { ReportCanvas } from './components/ReportCanvas';
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
  const [themeName, setThemeName] = useState('PowerColors Corporate Theme');
  const [isDarkCanvas, setIsDarkCanvas] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [currentImageName, setCurrentImageName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  // Initialize 10 default swatches
  const [swatches, setSwatches] = useState<ColorSwatch[]>(() =>
    DEFAULT_PALETTE_HEXES.map((hex, idx) => createColorSwatch(hex, `swatch-${idx + 1}`))
  );

  // Initialize structural colors derived from first swatch
  const [structural, setStructural] = useState<StructuralColors>(() =>
    deriveStructuralColors(DEFAULT_PALETTE_HEXES[0], false)
  );

  // Update structural colors when canvas mode changes
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
      // Fisher-Yates shuffle
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
      // Create preview URL if File
      if (typeof source === 'string') {
        setCurrentImagePreview(source);
      } else {
        const url = URL.createObjectURL(source);
        setCurrentImagePreview(url);
      }
      setCurrentImageName(displayName);

      // Derive clean theme name from display name
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
        // Merge with existing locked swatches
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

  // Clear current image and reset
  const handleClearImage = useCallback(() => {
    setCurrentImagePreview(null);
    setCurrentImageName(null);
  }, []);

  // Quick export Power BI Theme JSON
  const currentTheme: PowerBITheme = buildPowerBITheme(
    themeName,
    swatches.map((s) => s.hex),
    structural
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

  // Load first sample preset on initial mount for instant feedback
  useEffect(() => {
    if (SAMPLE_PRESETS[0]) {
      handleImageSelected(SAMPLE_PRESETS[0].dataUri, SAMPLE_PRESETS[0].name);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Power<span className="text-amber-400">Colors</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                  Power BI Theme Lab
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer shadow-xs"
              title="Copy theme JSON to clipboard"
            >
              {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{jsonCopied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-lg transition-all cursor-pointer font-sans"
              title="Download theme JSON file for Power BI Desktop"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Theme</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Banner Section */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Client-Side Palette Extractor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generate 10-Color Power BI Palettes from Any Image
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Drop an image or paste a screenshot (<kbd className="font-mono text-slate-300">Ctrl+V</kbd>). We quantize 10 distinct data colors, derive structural styles, and format an official Power BI theme file.
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
          />
        </section>

        {/* Section 2: Theme Settings & Canvas Controls */}
        <section>
          <ThemeControls
            themeName={themeName}
            onThemeNameChange={setThemeName}
            isDarkCanvas={isDarkCanvas}
            onToggleCanvasMode={handleToggleCanvasMode}
            structural={structural}
            onUpdateStructuralColor={handleUpdateStructuralColor}
          />
        </section>

        {/* Section 3: Interactive 10-Swatch Palette Strip */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <PaletteStrip
            swatches={swatches}
            isDarkCanvas={isDarkCanvas}
            onUpdateHex={handleUpdateHex}
            onToggleLock={handleToggleLock}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            onReversePalette={handleReversePalette}
            onToggleLockAll={handleToggleLockAll}
            onShuffleUnlocked={handleShuffleUnlocked}
          />
        </section>

        {/* Section 4: Live Power BI Visuals Mock Canvas */}
        <section>
          <ReportCanvas
            swatches={swatches}
            structural={structural}
            isDarkCanvas={isDarkCanvas}
            themeName={themeName}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>PowerColors • 100% Client-Side Power BI Report Theme Generator • Zero Cloud Uploads</p>
      </footer>
    </div>
  );
}

import { useState, useCallback, useEffect } from 'react';
import { ColorSwatch, StructuralColors, PowerBITheme, ThemeCustomizationOptions, AppPage } from './core/types';
import { NavigationHeader } from './components/NavigationHeader';
import { LandingPage } from './pages/LandingPage';
import { ThemeGeneratorPage } from './pages/ThemeGeneratorPage';
import { DashGeneratorPage } from './pages/DashGeneratorPage';
import { SvgVisualMakerPage } from './pages/SvgVisualMakerPage';
import { PaletteHarmonyPage } from './pages/PaletteHarmonyPage';
import { IconLibraryPage } from './pages/IconLibraryPage';
import { DaxToolkitPage } from './pages/DaxToolkitPage';
import { DenebStudioPage } from './pages/DenebStudioPage';
import { PbipStudioPage } from './pages/PbipStudioPage';
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
  // Helper to parse hash route
  const getPageFromHash = (): AppPage | null => {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const hash = rawHash.split('?')[0];
    if (
      hash === 'theme-generator' ||
      hash === 'palette-harmony' ||
      hash === 'dash-generator' ||
      hash === 'svg-visual-maker' ||
      hash === 'icon-library' ||
      hash === 'dax-toolkit' ||
      hash === 'deneb-studio' ||
      hash === 'pbip-studio' ||
      hash === 'landing'
    ) {
      return hash as AppPage;
    }
    return null;
  };

  // Navigation Page State
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    const fromHash = typeof window !== 'undefined' ? getPageFromHash() : null;
    if (fromHash) return fromHash;
    const saved = localStorage.getItem('powerlab_current_page');
    if (
      saved === 'theme-generator' ||
      saved === 'palette-harmony' ||
      saved === 'dash-generator' ||
      saved === 'svg-visual-maker' ||
      saved === 'icon-library' ||
      saved === 'dax-toolkit' ||
      saved === 'deneb-studio' ||
      saved === 'pbip-studio' ||
      saved === 'landing'
    ) {
      return saved as AppPage;
    }
    return 'landing';
  });

  const handleNavigate = useCallback((page: AppPage) => {
    setCurrentPage(page);
    window.location.hash = page;
    localStorage.setItem('powerlab_current_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser back/forward or hash changes
  useEffect(() => {
    const onHashChange = () => {
      const fromHash = getPageFromHash();
      if (fromHash && fromHash !== currentPage) {
        setCurrentPage(fromHash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [currentPage]);

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

  const handleUpdateStructuralColor = useCallback((key: keyof StructuralColors, hex: string) => {
    setStructural((prev) => ({ ...prev, [key]: hex }));
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

      if (unlockedIndices.length <= 1) return prev;

      const shuffledValues = unlockedIndices
        .map((idx) => prev[idx])
        .sort(() => Math.random() - 0.5);

      const next = [...prev];
      unlockedIndices.forEach((origIdx, i) => {
        next[origIdx] = shuffledValues[i];
      });
      return next;
    });
  }, []);

  // Handle image selected for extraction
  const handleImageSelected = useCallback(async (source: string | File, fileName?: string) => {
    setIsLoading(true);
    try {
      const displayName = fileName || (typeof source === 'string' ? 'Imported Preset' : source.name);
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

  const handleApplyHarmonyToThemeStudio = useCallback((harmonyHexes: string[]) => {
    setSwatches((prev) => {
      const next = [...prev];
      harmonyHexes.slice(0, 10).forEach((hex, idx) => {
        next[idx] = createColorSwatch(hex, `swatch-${idx + 1}`);
      });
      return next;
    });
    if (harmonyHexes[0]) {
      setStructural(deriveStructuralColors(harmonyHexes[0], isDarkCanvas));
    }
  }, [isDarkCanvas]);

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

  // Dash Canvas actions from top navigation header
  const [svgCopied, setSvgCopied] = useState(false);
  const handleCopyDashSvg = useCallback(() => {
    window.dispatchEvent(new CustomEvent('powerlab:copy-dash-svg'));
  }, []);

  const handleDownloadDashSvg = useCallback(() => {
    window.dispatchEvent(new CustomEvent('powerlab:download-dash-svg'));
  }, []);

  // Sync SVG copied state across header and page
  useEffect(() => {
    const onCopied = () => {
      setSvgCopied(true);
      setTimeout(() => setSvgCopied(false), 2000);
    };
    window.addEventListener('powerlab:dash-svg-copied', onCopied);
    return () => window.removeEventListener('powerlab:dash-svg-copied', onCopied);
  }, []);

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
      {/* Top Navigation Bar: Multi-Page Tabs & Contextual Actions */}
      <NavigationHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkSite={isDarkSite}
        onToggleSiteTheme={toggleSiteTheme}
        onOpenModal={() => setIsModalOpen(true)}
        onCopyJson={handleCopyJson}
        jsonCopied={jsonCopied}
        onDownloadJson={handleDownloadJson}
        onCopySvg={handleCopyDashSvg}
        svgCopied={svgCopied}
        onDownloadSvg={handleDownloadDashSvg}
      />

      {/* Main Dynamic View */}
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'theme-generator' && (
        <ThemeGeneratorPage
          onNavigate={handleNavigate}
          swatches={swatches}
          structural={structural}
          themeName={themeName}
          setThemeName={setThemeName}
          isDarkCanvas={isDarkCanvas}
          isDarkSite={isDarkSite}
          customizationOptions={customizationOptions}
          onCustomizationOptionsChange={setCustomizationOptions}
          handleUpdateStructuralColor={handleUpdateStructuralColor}
          handleUpdateHex={handleUpdateHex}
          handleToggleLock={handleToggleLock}
          handleMoveLeft={handleMoveLeft}
          handleMoveRight={handleMoveRight}
          handleReversePalette={handleReversePalette}
          handleToggleLockAll={handleToggleLockAll}
          handleShuffleUnlocked={handleShuffleUnlocked}
          handleImageSelected={handleImageSelected}
          handleClearImage={handleClearImage}
          currentImagePreview={currentImagePreview}
          currentImageName={currentImageName}
          isLoading={isLoading}
          handleToggleCanvasMode={handleToggleCanvasMode}
          handleDownloadJson={handleDownloadJson}
          handleCopyJson={handleCopyJson}
          jsonCopied={jsonCopied}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          currentTheme={currentTheme}
        />
      )}

      {currentPage === 'palette-harmony' && (
        <PaletteHarmonyPage
          onNavigate={handleNavigate}
          onApplyToThemeStudio={handleApplyHarmonyToThemeStudio}
        />
      )}

      {currentPage === 'dash-generator' && (
        <DashGeneratorPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'svg-visual-maker' && (
        <SvgVisualMakerPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'icon-library' && (
        <IconLibraryPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'dax-toolkit' && (
        <DaxToolkitPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'deneb-studio' && (
        <DenebStudioPage
          onNavigate={handleNavigate}
          paletteHexes={swatches.map((s) => s.hex)}
        />
      )}

      {currentPage === 'pbip-studio' && (
        <PbipStudioPage
          onNavigate={handleNavigate}
          activeThemeJson={currentTheme}
          themeName={themeName}
        />
      )}

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

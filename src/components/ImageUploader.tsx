import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, RefreshCw, X, ClipboardPaste } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';

interface ImageUploaderProps {
  onImageSelected: (source: File | string, displayName: string) => void;
  isLoading: boolean;
  currentImagePreview: string | null;
  currentImageName: string | null;
  onClearImage: () => void;
  isDarkSite?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoading,
  currentImagePreview,
  currentImageName,
  onClearImage,
  isDarkSite = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process a File object
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setDragError('Please upload an image file (PNG, JPG, WebP, SVG)');
      return;
    }
    setDragError(null);
    onImageSelected(file, file.name);
  }, [onImageSelected]);

  // Global clipboard paste listener (Ctrl+V anywhere)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            onImageSelected(file, `Pasted Screenshot (${timestamp})`);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset: SamplePreset) => {
    onImageSelected(preset.dataUri, preset.name);
  };

  const activeCardBg = isDarkSite
    ? 'bg-slate-900 border-slate-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const dropzoneBg = isDragging
    ? 'border-amber-500 bg-amber-500/5 ring-4 ring-amber-500/10'
    : isDarkSite
    ? 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80'
    : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/80 shadow-xs';

  const presetBtnClass = isDarkSite
    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
    : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-xs';

  return (
    <div className="w-full space-y-4">
      {/* Upload Dropzone or Current Image View */}
      {currentImagePreview ? (
        <div className={`relative flex items-center justify-between p-4 rounded-2xl border shadow-md overflow-hidden group ${activeCardBg}`}>
          <div className="flex items-center space-x-4 min-w-0">
            <div className={`relative w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0 flex items-center justify-center ${
              isDarkSite ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <img
                src={currentImagePreview}
                alt="Source preview"
                className="w-full h-full object-contain"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Active Image
                </span>
                {isLoading && (
                  <span className="text-xs text-amber-500 animate-pulse font-medium">
                    Extracting palette...
                  </span>
                )}
              </div>
              <h3 className={`text-sm font-bold truncate max-w-xs sm:max-w-md mt-1 ${
                isDarkSite ? 'text-white' : 'text-slate-800'
              }`}>
                {currentImageName || 'Custom Upload'}
              </h3>
              <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${
                isDarkSite ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>Press</span>
                <kbd className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${
                  isDarkSite ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  Ctrl+V
                </kbd>
                <span>anywhere to paste a new screenshot</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDarkSite
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
              <span>Change</span>
            </button>
            <button
              type="button"
              onClick={onClearImage}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${dropzoneBg}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`p-4 rounded-2xl transition-all ${
              isDragging
                ? 'bg-amber-500/20 text-amber-500 scale-110'
                : isDarkSite
                ? 'bg-slate-800 text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10'
                : 'bg-slate-100 text-slate-500 group-hover:text-amber-600 group-hover:bg-amber-50'
            }`}>
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className={`text-sm font-medium ${isDarkSite ? 'text-slate-200' : 'text-slate-700'}`}>
                <span className="text-amber-500 font-semibold underline underline-offset-2">Click to browse</span> or drag & drop an image here
              </p>
              <p className={`text-xs ${isDarkSite ? 'text-slate-400' : 'text-slate-500'}`}>
                Supports PNG, JPEG, WebP, SVG • 100% private in-browser processing
              </p>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] ${
              isDarkSite ? 'bg-slate-800/60 border-slate-700/60 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <ClipboardPaste className="w-3 h-3 text-amber-500" />
              <span>Tip: Take a screenshot with <kbd className="font-mono font-bold">Win+Shift+S</kbd> then press <kbd className="font-mono font-bold">Ctrl+V</kbd></span>
            </div>

            {dragError && (
              <p className="text-xs text-rose-500 font-medium bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20">
                {dragError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Sample Presets Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className={`text-xs font-semibold flex items-center gap-1 mr-1 ${
          isDarkSite ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Or try a preset:</span>
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${presetBtnClass}`}
          >
            <ImageIcon className="w-3 h-3 text-slate-400" />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

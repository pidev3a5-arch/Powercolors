import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, RefreshCw, X, ClipboardPaste } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';

interface ImageUploaderProps {
  onImageSelected: (source: File | string, displayName: string) => void;
  isLoading: boolean;
  currentImagePreview: string | null;
  currentImageName: string | null;
  onClearImage: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoading,
  currentImagePreview,
  currentImageName,
  onClearImage,
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

  return (
    <div className="w-full space-y-4">
      {/* Upload Dropzone or Current Image View */}
      {currentImagePreview ? (
        <div className="relative flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden group">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
              <img
                src={currentImagePreview}
                alt="Source preview"
                className="w-full h-full object-contain"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Image
                </span>
                {isLoading && (
                  <span className="text-xs text-amber-400 animate-pulse font-medium">
                    Extracting palette...
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md mt-1">
                {currentImageName || 'Custom Upload'}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
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
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
              <span>Change</span>
            </button>
            <button
              type="button"
              onClick={onClearImage}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
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
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-amber-400 bg-amber-500/5 ring-4 ring-amber-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
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
                ? 'bg-amber-400/20 text-amber-300 scale-110'
                : 'bg-slate-800/80 text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/10'
            }`}>
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-200">
                <span className="text-amber-400 font-semibold underline underline-offset-2">Click to browse</span> or drag & drop an image here
              </p>
              <p className="text-xs text-slate-400">
                Supports PNG, JPEG, WebP, SVG • 100% private in-browser processing
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
              <ClipboardPaste className="w-3 h-3 text-amber-400" />
              <span>Tip: Take a screenshot with <kbd className="font-mono text-slate-300">Win+Shift+S</kbd> then press <kbd className="font-mono text-slate-300">Ctrl+V</kbd></span>
            </div>

            {dragError && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20">
                {dragError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input for when image is active but user wants to change */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Sample Presets Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Or try a preset:</span>
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-xs hover:shadow-sm"
          >
            <ImageIcon className="w-3 h-3 text-slate-400" />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

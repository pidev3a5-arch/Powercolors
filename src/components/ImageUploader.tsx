import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Sparkles, RefreshCw, X, ClipboardPaste } from 'lucide-react';
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
  isDarkSite: _isDarkSite = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const presetColors = ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'];

  return (
    <div className="w-full space-y-4">
      {/* Upload Dropzone or Current Image Active Card */}
      {currentImagePreview ? (
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border-2 border-[#1E293B] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[6px_6px_0px_0px_#1E293B] dark:shadow-[6px_6px_0px_0px_#020617] gap-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 flex-shrink-0 flex items-center justify-center shadow-[3px_3px_0px_0px_#1E293B]">
              <img
                src={currentImagePreview}
                alt="Source preview"
                className="w-full h-full object-contain p-1"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-[#FBBF24] animate-spin stroke-[2.5]" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#34D399]/25 text-emerald-900 dark:text-emerald-300 border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] border border-[#1E293B]" />
                  Active Ingestion
                </span>
                {isLoading && (
                  <span className="text-xs font-bold text-[#8B5CF6] animate-pulse">
                    Quantizing 10 palette swatches...
                  </span>
                )}
              </div>
              <h3
                className="text-base sm:text-lg font-heading font-extrabold text-[#1E293B] dark:text-white truncate mt-1"
                title={currentImageName || 'Custom Upload'}
              >
                {currentImageName || 'Custom Upload'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                <span>Paste new screenshot with</span>
                <kbd className="px-2 py-0.5 rounded-md border-2 border-[#1E293B] dark:border-slate-700 bg-[#FBBF24] text-[#1E293B] font-mono font-black text-[11px] shadow-[1px_1px_0px_0px_#1E293B]">
                  Ctrl+V
                </kbd>
                <span>anywhere</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2.5 flex-shrink-0 pt-3 sm:pt-0 border-t-2 sm:border-t-0 border-dashed border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="pop-btn px-4 py-2 rounded-full text-xs font-extrabold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
              <span>Change Image</span>
            </button>
            <button
              type="button"
              onClick={onClearImage}
              className="pop-btn p-2 rounded-full bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer group bg-white dark:bg-slate-900 border-[#1E293B] dark:border-slate-700 shadow-[6px_6px_0px_0px_#1E293B] dark:shadow-[6px_6px_0px_0px_#020617] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#1E293B] ${
            isDragging ? 'bg-[#FFFDF5] ring-4 ring-[#8B5CF6]' : ''
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Pop Circle Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-center text-[#1E293B] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <UploadCloud className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <p className="text-base sm:text-lg font-heading font-extrabold text-[#1E293B] dark:text-white">
                <span className="text-[#8B5CF6] underline decoration-wavy decoration-2 underline-offset-4">Click to browse</span> or drag & drop brand image
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                PNG, JPEG, WebP, SVG • 100% In-Browser Privacy
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF5] dark:bg-slate-950 border-2 border-[#1E293B] dark:border-slate-700 text-xs font-bold text-[#1E293B] dark:text-slate-200 shadow-[2px_2px_0px_0px_#1E293B]">
              <ClipboardPaste className="w-4 h-4 text-[#8B5CF6] stroke-[2.5]" />
              <span>Or take a screenshot (<kbd className="font-mono bg-[#FBBF24] text-[#1E293B] px-1.5 py-0.5 rounded border border-[#1E293B]">Win+Shift+S</kbd>) and press <kbd className="font-mono bg-[#FBBF24] text-[#1E293B] px-1.5 py-0.5 rounded border border-[#1E293B]">Ctrl+V</kbd></span>
            </div>

            {dragError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-100 border-2 border-rose-500 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#EF4444]">
                {dragError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Preset Pill Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <span className="text-xs font-heading font-extrabold text-[#1E293B] dark:text-white flex items-center gap-1.5 mr-1">
          <Sparkles className="w-4 h-4 text-[#FBBF24] stroke-[2.5]" />
          <span>Quick Presets:</span>
        </span>
        {SAMPLE_PRESETS.map((preset, idx) => {
          const accentColor = presetColors[idx % presetColors.length];
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="pop-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white hover:bg-[#FFFDF5] dark:hover:bg-slate-700 cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-[#1E293B]"
                style={{ backgroundColor: accentColor }}
              />
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

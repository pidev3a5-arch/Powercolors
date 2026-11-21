import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Check,
  Compass,
  Bold,
  Italic,
  Type,
} from 'lucide-react';
import {
  NavBarConfig,
  NavButtonConfig,
  NavButtonSection,
  getNavIconPath,
} from '../../core/dashTypes';
import { IconPickerModal } from './IconPickerModal';

interface DashNavControlsProps {
  navBar: NavBarConfig;
  onUpdateNavBar: (updates: Partial<NavBarConfig>) => void;
  onAddButton: (section?: NavButtonSection) => void;
  onRemoveButton: (id: string) => void;
  onUpdateButton: (id: string, updates: Partial<NavButtonConfig>) => void;
  onReorderButtons: (fromIndex: number, toIndex: number) => void;
}

export const DashNavControls: React.FC<DashNavControlsProps> = ({
  navBar,
  onUpdateNavBar,
  onAddButton,
  onRemoveButton,
  onUpdateButton,
  onReorderButtons,
}) => {
  const [editingIconBtnId, setEditingIconBtnId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, or JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpdateNavBar({ logoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onUpdateNavBar({ logoUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentEditingButton = navBar.buttons.find((b) => b.id === editingIconBtnId);

  const menuButtons = navBar.buttons
    .map((btn, index) => ({ btn, index }))
    .filter(({ btn }) => btn.section !== 'general');

  const generalButtons = navBar.buttons
    .map((btn, index) => ({ btn, index }))
    .filter(({ btn }) => btn.section === 'general');

  return (
    <div className="space-y-6">
      {/* Enable / Disable Nav Bar Switch */}
      <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-between">
        <div>
          <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white">
            Navigation Ribbon
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Add a branded navigation bar to your canvas
          </p>
        </div>
        <button
          type="button"
          onClick={() => onUpdateNavBar({ show: !navBar.show })}
          className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 border-[#1E293B] transition-colors cursor-pointer ${
            navBar.show ? 'bg-[#34D399]' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white border border-[#1E293B] shadow-xs transition-transform ${
              navBar.show ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {navBar.show && (
        <>
          {/* Orientation & Sizing */}
          <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
            <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#8B5CF6]" />
              <span>Position & Sizing</span>
            </h4>

            {/* Orientation Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateNavBar({
                    orientation: 'left',
                    size: navBar.orientation === 'left' ? navBar.size : 210,
                  })
                }
                className={`py-2 px-3 rounded-xl border-2 border-[#1E293B] text-xs font-heading font-black transition-all cursor-pointer ${
                  navBar.orientation === 'left'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Left Sidebar
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateNavBar({
                    orientation: 'top',
                    size: navBar.orientation === 'top' ? navBar.size : 75,
                  })
                }
                className={`py-2 px-3 rounded-xl border-2 border-[#1E293B] text-xs font-heading font-black transition-all cursor-pointer ${
                  navBar.orientation === 'top'
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Top Header
              </button>
            </div>

            {/* Thickness / Size Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>{navBar.orientation === 'left' ? 'Sidebar Width' : 'Header Height'}</span>
                <span className="font-mono text-[#8B5CF6]">{navBar.size} px</span>
              </div>
              <input
                type="range"
                min={navBar.orientation === 'left' ? 150 : 55}
                max={navBar.orientation === 'left' ? 280 : 120}
                step={5}
                value={navBar.size}
                onChange={(e) => onUpdateNavBar({ size: Number(e.target.value) })}
                className="w-full accent-[#8B5CF6] cursor-pointer"
              />
            </div>

            {/* Colors Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[10px] font-heading font-black text-slate-500 uppercase">
                  Background
                </label>
                <div className="flex items-center gap-1.5 p-1 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
                  <input
                    type="color"
                    value={navBar.backgroundColor}
                    onChange={(e) => onUpdateNavBar({ backgroundColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#1E293B] cursor-pointer"
                  />
                  <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 truncate">
                    {navBar.backgroundColor}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-heading font-black text-slate-500 uppercase">
                  Text & Icon
                </label>
                <div className="flex items-center gap-1.5 p-1 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
                  <input
                    type="color"
                    value={navBar.textColor}
                    onChange={(e) => onUpdateNavBar({ textColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#1E293B] cursor-pointer"
                  />
                  <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 truncate">
                    {navBar.textColor}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-heading font-black text-slate-500 uppercase">
                  Active Tab
                </label>
                <div className="flex items-center gap-1.5 p-1 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
                  <input
                    type="color"
                    value={navBar.accentColor}
                    onChange={(e) => onUpdateNavBar({ accentColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#1E293B] cursor-pointer"
                  />
                  <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 truncate">
                    {navBar.accentColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Branding: Logo & Title */}
          <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
            <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#F472B6]" />
              <span>Report Branding</span>
            </h4>

            {/* Report Title Input & Font Size (Requirement 7) */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-heading font-black text-slate-600 dark:text-slate-400">
                  Report Title
                </label>
                <input
                  type="text"
                  value={navBar.reportTitle}
                  maxLength={40}
                  onChange={(e) => onUpdateNavBar({ reportTitle: e.target.value })}
                  placeholder="e.g. Executive Sales Performance"
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-950 text-xs sm:text-sm font-bold text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6] focus:shadow-[2px_2px_0px_0px_#8B5CF6] transition-all"
                />
              </div>

              {/* Title Font Size */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Title Font Size</span>
                  <span className="font-mono text-[#8B5CF6]">
                    {navBar.reportTitleSize || (navBar.orientation === 'left' ? 14 : 15)} px
                  </span>
                </div>
                <input
                  type="range"
                  min={11}
                  max={24}
                  step={1}
                  value={navBar.reportTitleSize || (navBar.orientation === 'left' ? 14 : 15)}
                  onChange={(e) => onUpdateNavBar({ reportTitleSize: Number(e.target.value) })}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-black text-slate-600 dark:text-slate-400">
                Brand Logo
              </label>

              {navBar.logoUrl ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl border-2 border-[#1E293B] bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={navBar.logoUrl}
                      alt="Brand Logo"
                      className="w-8 h-8 object-contain rounded-lg border border-slate-200 bg-white p-0.5"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Custom Logo Uploaded
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-rose-600 hover:bg-rose-50 shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-xl border-2 border-dashed border-[#1E293B] dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-[#FBBF24]/10 flex items-center justify-center gap-2 text-xs font-heading font-black text-[#1E293B] dark:text-white cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Upload Logo (PNG, SVG, JPG)</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Button Icons Global Switcher (Requirement 8) */}
          <div className="pop-card bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-between">
            <div>
              <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white block">
                Navigation Button Icons
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Show or hide vector icons across all navigation tabs
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateNavBar({
                  showButtonIcons: navBar.showButtonIcons === false ? true : false,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full border border-[#1E293B] transition-colors cursor-pointer ${
                navBar.showButtonIcons !== false ? 'bg-[#34D399]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white border border-[#1E293B] shadow-xs transition-transform ${
                  navBar.showButtonIcons !== false ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Section 1: MENU Tabs */}
          <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white">
                  Menu Pages ({menuButtons.length})
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Primary report navigation buttons
                </p>
              </div>

              <button
                type="button"
                onClick={() => onAddButton('menu')}
                className="pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-black bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Menu Tab</span>
              </button>
            </div>

            {/* Primary Navigation Buttons Typography Controls */}
            <div className="p-3.5 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span className="text-xs font-heading font-black text-[#1E293B] dark:text-white">
                    Primary Buttons Typography
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Font & Style
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Font Size slider */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-heading font-black text-slate-600 dark:text-slate-300">
                    Font Size
                  </span>
                  <input
                    type="range"
                    min={9}
                    max={18}
                    step={0.5}
                    value={navBar.buttonFontSize ?? (navBar.orientation === 'left' ? 12 : 11.5)}
                    onChange={(e) =>
                      onUpdateNavBar({ buttonFontSize: parseFloat(e.target.value) })
                    }
                    className="w-24 sm:w-28 accent-[#8B5CF6] cursor-pointer"
                    title="Adjust button text font size"
                  />
                  <span className="font-mono text-xs font-black text-[#1E293B] dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-[#1E293B]">
                    {navBar.buttonFontSize ?? (navBar.orientation === 'left' ? 12 : 11.5)}px
                  </span>
                </div>

                {/* Bold & Italic Style Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateNavBar({
                        buttonFontBold: navBar.buttonFontBold === false ? true : false,
                      })
                    }
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-[#1E293B] text-xs font-heading font-black transition-all cursor-pointer ${
                      navBar.buttonFontBold !== false
                        ? 'bg-[#8B5CF6] text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                    title={navBar.buttonFontBold !== false ? 'Bold: Enabled' : 'Bold: Disabled'}
                  >
                    <Bold className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Bold</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateNavBar({
                        buttonFontItalic: !navBar.buttonFontItalic,
                      })
                    }
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-[#1E293B] text-xs font-heading font-black transition-all cursor-pointer ${
                      navBar.buttonFontItalic
                        ? 'bg-[#8B5CF6] text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                    title={navBar.buttonFontItalic ? 'Italic: Enabled' : 'Italic: Disabled'}
                  >
                    <Italic className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Italic</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {menuButtons.map(({ btn, index }) => {
                const iconPath = getNavIconPath(btn.icon);
                const isBtnBold = btn.bold !== undefined ? btn.bold : navBar.buttonFontBold !== false;
                const isBtnItalic = btn.italic !== undefined ? btn.italic : !!navBar.buttonFontItalic;
                return (
                  <div
                    key={btn.id}
                    className="p-2 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setEditingIconBtnId(btn.id)}
                      className="p-1.5 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer flex-shrink-0"
                      title="Change Icon"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d={iconPath} />
                      </svg>
                    </button>

                    <input
                      type="text"
                      value={btn.label}
                      onChange={(e) => onUpdateButton(btn.id, { label: e.target.value })}
                      className={`flex-1 min-w-0 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6] ${
                        isBtnBold ? 'font-bold' : 'font-normal'
                      } ${isBtnItalic ? 'italic' : ''}`}
                      placeholder="Page label"
                    />

                    {/* Per-button Bold & Italic Style Toggles */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateButton(btn.id, {
                            bold: !isBtnBold,
                          })
                        }
                        className={`p-1.5 rounded-lg border text-[11px] font-black cursor-pointer transition-all ${
                          isBtnBold
                            ? 'bg-[#8B5CF6] text-white border-[#1E293B]'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                        title={isBtnBold ? 'Bold: Enabled' : 'Bold: Disabled'}
                      >
                        <Bold className="w-3 h-3 stroke-[3]" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateButton(btn.id, {
                            italic: !isBtnItalic,
                          })
                        }
                        className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                          isBtnItalic
                            ? 'bg-[#8B5CF6] text-white border-[#1E293B]'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                        title={isBtnItalic ? 'Italic: Enabled' : 'Italic: Disabled'}
                      >
                        <Italic className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navBar.buttons.forEach((b) => {
                          onUpdateButton(b.id, { isActive: b.id === btn.id });
                        });
                      }}
                      className={`p-1.5 rounded-lg border border-[#1E293B] text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                        btn.isActive
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-400'
                      }`}
                      title={btn.isActive ? 'Active Tab' : 'Set as Active'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onReorderButtons(index, index - 1)}
                        className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === navBar.buttons.length - 1}
                        onClick={() => onReorderButtons(index, index + 1)}
                        className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveButton(btn.id)}
                      className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 cursor-pointer flex-shrink-0"
                      title="Delete Tab"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: GENERAL Tabs (Settings, Help, etc.) */}
          <div className="pop-card bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#1E293B] dark:border-slate-700 shadow-[3px_3px_0px_0px_#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-heading font-black text-[#1E293B] dark:text-white">
                  General Section ({generalButtons.length})
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Settings, Help & utility buttons
                </p>
              </div>

              <button
                type="button"
                onClick={() => onAddButton('general')}
                className="pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-black bg-[#34D399] hover:bg-[#10B981] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add General Tab</span>
              </button>
            </div>

            <div className="space-y-2">
              {generalButtons.map(({ btn, index }) => {
                const iconPath = getNavIconPath(btn.icon);
                const isBtnBold = btn.bold !== undefined ? btn.bold : navBar.buttonFontBold !== false;
                const isBtnItalic = btn.italic !== undefined ? btn.italic : !!navBar.buttonFontItalic;
                return (
                  <div
                    key={btn.id}
                    className="p-2 rounded-xl border-2 border-[#1E293B] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setEditingIconBtnId(btn.id)}
                      className="p-1.5 rounded-lg border-2 border-[#1E293B] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-white hover:bg-[#FBBF24] shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer flex-shrink-0"
                      title="Change Icon"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d={iconPath} />
                      </svg>
                    </button>

                    <input
                      type="text"
                      value={btn.label}
                      onChange={(e) => onUpdateButton(btn.id, { label: e.target.value })}
                      className={`flex-1 min-w-0 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-white outline-none focus:border-[#8B5CF6] ${
                        isBtnBold ? 'font-bold' : 'font-normal'
                      } ${isBtnItalic ? 'italic' : ''}`}
                      placeholder="Utility label"
                    />

                    {/* Per-button Bold & Italic Style Toggles */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateButton(btn.id, {
                            bold: !isBtnBold,
                          })
                        }
                        className={`p-1.5 rounded-lg border text-[11px] font-black cursor-pointer transition-all ${
                          isBtnBold
                            ? 'bg-[#8B5CF6] text-white border-[#1E293B]'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                        title={isBtnBold ? 'Bold: Enabled' : 'Bold: Disabled'}
                      >
                        <Bold className="w-3 h-3 stroke-[3]" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateButton(btn.id, {
                            italic: !isBtnItalic,
                          })
                        }
                        className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                          isBtnItalic
                            ? 'bg-[#8B5CF6] text-white border-[#1E293B]'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                        title={isBtnItalic ? 'Italic: Enabled' : 'Italic: Disabled'}
                      >
                        <Italic className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navBar.buttons.forEach((b) => {
                          onUpdateButton(b.id, { isActive: b.id === btn.id });
                        });
                      }}
                      className={`p-1.5 rounded-lg border border-[#1E293B] text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                        btn.isActive
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-400'
                      }`}
                      title={btn.isActive ? 'Active Tab' : 'Set as Active'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onReorderButtons(index, index - 1)}
                        className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === navBar.buttons.length - 1}
                        onClick={() => onReorderButtons(index, index + 1)}
                        className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveButton(btn.id)}
                      className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 cursor-pointer flex-shrink-0"
                      title="Delete Tab"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={editingIconBtnId !== null}
        currentIcon={currentEditingButton?.icon || 'home'}
        onSelectIcon={(iconName) => {
          if (editingIconBtnId) {
            onUpdateButton(editingIconBtnId, { icon: iconName });
          }
        }}
        onClose={() => setEditingIconBtnId(null)}
      />
    </div>
  );
};

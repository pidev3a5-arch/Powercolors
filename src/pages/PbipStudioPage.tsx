import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  FileCode,
  Download,
  Copy,
  Check,
  Sparkles,
  Folder,
  ChevronRight,
  ChevronDown,
  Settings,
  Database,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { AppPage } from '../core/types';
import {
  PbipConfig,
  PbipConnectionType,
  PbipFileItem,
  PbipPackage,
  PbipTreeNode,
  PbipVisualItem,
} from '../core/pbip/types';
import {
  buildPbipPackage,
  exportPbipZipBlob,
  downloadPbipZip,
} from '../core/pbip/pbipEngine';

interface PbipStudioPageProps {
  onNavigate: (page: AppPage) => void;
  activeThemeJson?: any;
  themeName?: string;
  wallpaperSvg?: string;
}

export const PbipStudioPage: React.FC<PbipStudioPageProps> = ({
  onNavigate,
  activeThemeJson,
  themeName = 'PowerLab Theme',
  wallpaperSvg,
}) => {
  const [projectName, setProjectName] = useState<string>('ExecutiveAnalytics');
  const [reportDisplayName, setReportDisplayName] = useState<string>('Executive Revenue & KPI Dashboard');
  const [pageDisplayName, setPageDisplayName] = useState<string>('Executive Summary');
  const [connectionType, setConnectionType] = useState<PbipConnectionType>('byConnection');
  const [resolution, setResolution] = useState<'1280x720' | '1920x1080'>('1280x720');
  const [embedTheme, setEmbedTheme] = useState<boolean>(true);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'ExecutiveAnalytics.Report': true,
    'ExecutiveAnalytics.Report/definition': true,
    'ExecutiveAnalytics.Report/definition/pages': true,
  });

  // Sample default visual layout for new PBIP projects
  const defaultVisuals: PbipVisualItem[] = useMemo(() => [
    { id: 'v_header', name: 'Executive Header Ribbon', type: 'shape-text', x: 24, y: 24, width: 440, height: 48, zIndex: 1 },
    { id: 'v_kpi1', name: 'Total Revenue BAN', type: 'kpi', x: 24, y: 88, width: 290, height: 112, zIndex: 2 },
    { id: 'v_kpi2', name: 'Gross Margin % BAN', type: 'kpi', x: 330, y: 88, width: 290, height: 112, zIndex: 3 },
    { id: 'v_kpi3', name: 'Active Customers BAN', type: 'kpi', x: 636, y: 88, width: 290, height: 112, zIndex: 4 },
    { id: 'v_kpi4', name: 'Net Retention Rate BAN', type: 'kpi', x: 942, y: 88, width: 314, height: 112, zIndex: 5 },
    { id: 'v_trend', name: 'Monthly Trend vs Target', type: 'line-chart', x: 24, y: 216, width: 760, height: 264, zIndex: 6 },
    { id: 'v_mix', name: 'Product Revenue Mix', type: 'donut-chart', x: 800, y: 216, width: 456, height: 264, zIndex: 7 },
    { id: 'v_matrix', name: 'Financial Statement Matrix', type: 'matrix', x: 24, y: 496, width: 1232, height: 200, zIndex: 8 },
  ], []);

  // Compute live PBIP package
  const pbipPackage: PbipPackage = useMemo(() => {
    const isFullHd = resolution === '1920x1080';
    const config: PbipConfig = {
      projectName: projectName.trim() || 'PowerLab_Report',
      reportName: reportDisplayName.trim() || 'PowerLab Executive Report',
      pageName: 'Executive_Summary',
      pageDisplayName: pageDisplayName.trim() || 'Executive Summary',
      connectionType,
      canvasWidth: isFullHd ? 1920 : 1280,
      canvasHeight: isFullHd ? 1080 : 720,
      themeName: embedTheme ? themeName : undefined,
      themeJson: embedTheme ? activeThemeJson : undefined,
      wallpaperSvg,
      visuals: defaultVisuals,
    };

    return buildPbipPackage(config);
  }, [projectName, reportDisplayName, pageDisplayName, connectionType, resolution, embedTheme, themeName, activeThemeJson, wallpaperSvg, defaultVisuals]);

  // Selected file content
  const activeFile = useMemo(() => {
    if (!selectedFilePath) {
      return pbipPackage.files[0] || null;
    }
    return pbipPackage.files.find((f: PbipFileItem) => f.path === selectedFilePath) || pbipPackage.files[0] || null;
  }, [pbipPackage, selectedFilePath]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCopyFileContent = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const blob = await exportPbipZipBlob(pbipPackage);
      downloadPbipZip(blob, pbipPackage.projectName);
    } finally {
      setIsExporting(false);
    }
  };

  // Render tree node recursive
  const renderTreeNode = (node: PbipTreeNode, depth = 0) => {
    if (node.type === 'folder') {
      const isOpen = expandedFolders[node.path] !== false;
      return (
        <div key={node.id} className="space-y-0.5">
          <div
            onClick={() => toggleFolder(node.path)}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
            className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer select-none text-xs font-heading font-black text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            <Folder className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]/30" />
            <span className="truncate">{node.name}</span>
          </div>

          {isOpen && node.children && (
            <div>
              {node.children.map((child) => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isSelected = activeFile?.path === node.path;
    return (
      <div
        key={node.id}
        onClick={() => setSelectedFilePath(node.path)}
        style={{ paddingLeft: `${depth * 14 + 20}px` }}
        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg cursor-pointer text-xs font-mono font-bold transition-all ${
          isSelected
            ? 'bg-[#8B5CF6] text-white shadow-[1.5px_1.5px_0px_0px_#1E293B]'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <FileCode className="w-3.5 h-3.5 opacity-80" />
        <span className="truncate">{node.name}</span>
      </div>
    );
  };

  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-24">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b-2 border-[#1E293B] dark:border-slate-800">
        <div className="space-y-2 text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-purple-300 text-xs font-heading font-black border border-[#8B5CF6]/30 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MICROSOFT FABRIC & DEVELOPER MODE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight">
            Fabric PBIP & <span className="text-[#8B5CF6]">Report Automation Studio</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Scaffold, inspect, and export complete Power BI Project (.pbip) folder structures. Open directly in Power BI Desktop or sync to Fabric Git repositories with zero manual setup.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ PBIP & PBIR v2.0
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#BBF7D0] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ Fabric Git Integration Ready
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#BAE6FD] text-[#1E293B] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B]">
              ✓ 1-Click ZIP Download
            </span>
          </div>
        </div>

        {/* Quick Jump & Download Action */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('dash-generator')}
            className="pop-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white font-heading font-black text-xs border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer hover:bg-slate-50"
          >
            <span>Dash Canvas</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="pop-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white font-heading font-black text-xs sm:text-sm border-2 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] cursor-pointer hover:bg-[#7C3AED] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Packaging ZIP...' : `Download ${pbipPackage.projectName}.pbip.zip`}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Configurator (Left) + File Tree & Code Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project Configurator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="pop-card p-5 rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="text-sm font-heading font-black text-[#1E293B] dark:text-white uppercase tracking-wider">
                  Project Configuration
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {pbipPackage.totalFiles} Files
              </span>
            </div>

            {/* Project Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                Project File Name (.pbip)
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Sales_Analytics"
                className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-950 text-xs font-mono font-bold text-[#1E293B] dark:text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

            {/* Report & Page Display Names */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                Report Display Title
              </label>
              <input
                type="text"
                value={reportDisplayName}
                onChange={(e) => setReportDisplayName(e.target.value)}
                placeholder="e.g. Executive Sales Summary"
                className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-950 text-xs font-bold text-[#1E293B] dark:text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300">
                Page Tab Name
              </label>
              <input
                type="text"
                value={pageDisplayName}
                onChange={(e) => setPageDisplayName(e.target.value)}
                placeholder="e.g. Summary"
                className="w-full px-3 py-2 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] dark:bg-slate-950 text-xs font-bold text-[#1E293B] dark:text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

            {/* Connection Mode (Thin vs Thick) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Semantic Model Connection</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConnectionType('byConnection')}
                  className={`pop-btn p-2.5 rounded-xl text-left border-2 cursor-pointer transition-all ${
                    connectionType === 'byConnection'
                      ? 'border-[#8B5CF6] bg-purple-50 dark:bg-purple-950/40 text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#8B5CF6]'
                      : 'border-[#1E293B] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-heading font-black block">byConnection</span>
                  <span className="text-[10px] text-slate-500 font-medium">Remote Fabric / Service</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConnectionType('byPath')}
                  className={`pop-btn p-2.5 rounded-xl text-left border-2 cursor-pointer transition-all ${
                    connectionType === 'byPath'
                      ? 'border-[#8B5CF6] bg-purple-50 dark:bg-purple-950/40 text-[#1E293B] dark:text-white shadow-[2px_2px_0px_0px_#8B5CF6]'
                      : 'border-[#1E293B] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-heading font-black block">byPath</span>
                  <span className="text-[10px] text-slate-500 font-medium">Bundled local model</span>
                </button>
              </div>
            </div>

            {/* Canvas Dimensions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-heading font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Canvas Size</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResolution('1280x720')}
                  className={`pop-btn py-2 px-3 rounded-xl text-xs font-heading font-black border-2 cursor-pointer ${
                    resolution === '1280x720'
                      ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                      : 'border-[#1E293B] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  1280 × 720 (16:9)
                </button>

                <button
                  type="button"
                  onClick={() => setResolution('1920x1080')}
                  className={`pop-btn py-2 px-3 rounded-xl text-xs font-heading font-black border-2 cursor-pointer ${
                    resolution === '1920x1080'
                      ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1E293B]'
                      : 'border-[#1E293B] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  1920 × 1080 (FHD)
                </button>
              </div>
            </div>

            {/* Theme Embedding Checkbox */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="checkbox"
                id="embedTheme"
                checked={embedTheme}
                onChange={(e) => setEmbedTheme(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-[#1E293B] text-[#8B5CF6] focus:ring-[#8B5CF6] cursor-pointer"
              />
              <label htmlFor="embedTheme" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Embed Active PowerLab Theme JSON into StaticResources
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: File Tree Visualizer & Code Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="pop-card rounded-3xl bg-white dark:bg-slate-900 border-3 border-[#1E293B] dark:border-slate-700 shadow-[5px_5px_0px_0px_#1E293B] overflow-hidden flex flex-col min-h-[560px]">
            {/* Split Top Header */}
            <div className="p-4 border-b-2 border-[#1E293B] dark:border-slate-800 bg-[#FFFDF5] dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-heading font-black text-xs sm:text-sm text-[#1E293B] dark:text-white">
                  PBIP File System Inspector
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold truncate max-w-xs">
                  {activeFile?.path}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyFileContent}
                className="pop-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white border-2 border-[#1E293B] text-xs font-heading font-black shadow-[1.5px_1.5px_0px_0px_#1E293B] cursor-pointer hover:bg-purple-50"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'Copied File!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Split Content Body: File Tree (35%) + Code Preview (65%) */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
              {/* File Tree Left Pane */}
              <div className="md:col-span-5 p-3 border-r-2 border-[#1E293B] dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto max-h-[480px]">
                <div className="space-y-1">
                  {pbipPackage.fileTree.map((node: PbipTreeNode) => renderTreeNode(node))}
                </div>
              </div>

              {/* Code Preview Right Pane */}
              <div className="md:col-span-7 p-4 bg-[#1E293B] overflow-auto max-h-[480px] flex flex-col">
                <pre className="text-slate-100 font-mono text-xs leading-relaxed select-all">
                  <code>{activeFile?.content || '// No file selected'}</code>
                </pre>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="p-3 border-t-2 border-[#1E293B] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Compatible with Power BI Desktop (March 2024+ PBIR Enhanced Format)</span>
              </span>
              <span className="font-mono text-[11px]">
                {activeFile ? `${(activeFile.content.length / 1024).toFixed(1)} KB` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

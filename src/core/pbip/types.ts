export type PbipConnectionType = 'byConnection' | 'byPath';

export interface PbipVisualItem {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  color?: string;
  denebSpec?: any;
}

export interface PbipConfig {
  projectName: string;
  reportName: string;
  pageName: string;
  pageDisplayName: string;
  connectionType: PbipConnectionType;
  modelPath?: string;
  canvasWidth: number;
  canvasHeight: number;
  wallpaperSvg?: string;
  themeName?: string;
  themeJson?: any;
  visuals: PbipVisualItem[];
}

export interface PbipFileItem {
  path: string;
  content: string;
  isBinary?: boolean;
}

export interface PbipPackage {
  projectName: string;
  files: PbipFileItem[];
  fileTree: PbipTreeNode[];
  totalFiles: number;
}

export interface PbipTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  size?: number;
  children?: PbipTreeNode[];
}

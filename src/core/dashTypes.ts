export type CanvasResolutionPreset = '1280x720' | '1920x1080' | 'custom';

export interface CanvasDimension {
  width: number;
  height: number;
  preset: CanvasResolutionPreset;
}

export type NavBarOrientation = 'left' | 'top';

export type NavButtonSection = 'menu' | 'general';

export interface NavButtonConfig {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  section?: NavButtonSection;
}

export interface NavBarConfig {
  show: boolean;
  orientation: NavBarOrientation;
  size: number; // width in px for 'left', height in px for 'top'
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  reportTitle: string;
  logoUrl: string | null;
  buttons: NavButtonConfig[];
}

export interface VisualContainerConfig {
  id: string;
  title: string;
  subtitle: string;
  showTitle: boolean;
  showSubtitle: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  showBorder?: boolean;
}

export interface DashCanvasContainerStyle {
  cornerRadius: number;
  showBorder: boolean;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  showDropShadow: boolean;
  shadowColor: string;
}

export interface DashTypographyConfig {
  fontFamily: string; // 'Segoe UI' | 'Aptos' | 'DIN' | 'Arial' | 'Calibri' | 'Plus Jakarta Sans' | 'Outfit' | 'Inter'
  titleSize: number; // e.g. 13
  titleColor: string; // e.g. '#1E293B'
  subtitleSize: number; // e.g. 10.5
  subtitleColor: string; // e.g. '#64748B'
}

export type PageTitlePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface PageTitleItem {
  id: string;
  title: string;
  subtitle: string;
  position: PageTitlePosition;
  fontFamily?: string;
  titleSize?: number;
  titleColor?: string;
  subtitleSize?: number;
  subtitleColor?: string;
}

export type LayoutPresetType =
  | 'executive-overview'
  | 'grid-2x2'
  | 'three-column'
  | 'dense-analytics'
  | 'single-hero'
  | 'kpi-ribbon-grid'
  | 'left-focus-split'
  | 'top-storyline'
  | 'multi-tier-matrix';

export interface DashCanvasState {
  dimensions: CanvasDimension;
  backgroundColor: string;
  navBar: NavBarConfig;
  containerStyle: DashCanvasContainerStyle;
  typography: DashTypographyConfig;
  pageTitles: PageTitleItem[];
  layoutPreset: LayoutPresetType;
  containers: VisualContainerConfig[];
}

export interface NavIconDefinition {
  name: string;
  label: string;
  category: 'analytics' | 'general' | 'navigation' | 'commerce';
  // SVG path definition for 24x24 viewBox
  path: string;
}

// Curated collection of vector icon paths (viewBox 0 0 24 24, stroke 2, fill none, stroke-linecap round, stroke-linejoin round)
export const AVAILABLE_NAV_ICONS: NavIconDefinition[] = [
  {
    name: 'home',
    label: 'Home',
    category: 'navigation',
    path: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  },
  {
    name: 'bar-chart',
    label: 'Bar Chart',
    category: 'analytics',
    path: 'M18 20V10 M12 20V4 M6 20v-6',
  },
  {
    name: 'line-chart',
    label: 'Line Chart',
    category: 'analytics',
    path: 'M3 3v18h18 M19 9l-5 5-4-4-3 3',
  },
  {
    name: 'pie-chart',
    label: 'Pie Chart',
    category: 'analytics',
    path: 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z',
  },
  {
    name: 'trending-up',
    label: 'Trends',
    category: 'analytics',
    path: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  },
  {
    name: 'layout-grid',
    label: 'Dashboard',
    category: 'navigation',
    path: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  },
  {
    name: 'table',
    label: 'Table',
    category: 'analytics',
    path: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18',
  },
  {
    name: 'users',
    label: 'Customers',
    category: 'general',
    path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    name: 'dollar-sign',
    label: 'Revenue',
    category: 'commerce',
    path: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
  {
    name: 'shopping-bag',
    label: 'Orders',
    category: 'commerce',
    path: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0',
  },
  {
    name: 'calendar',
    label: 'Calendar',
    category: 'general',
    path: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18',
  },
  {
    name: 'filter',
    label: 'Filter',
    category: 'general',
    path: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  },
  {
    name: 'layers',
    label: 'Layers',
    category: 'general',
    path: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  },
  {
    name: 'database',
    label: 'Data Source',
    category: 'analytics',
    path: 'M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4z M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4 M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4',
  },
  {
    name: 'activity',
    label: 'Activity',
    category: 'analytics',
    path: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
  {
    name: 'target',
    label: 'Targets',
    category: 'analytics',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-14a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z',
  },
  {
    name: 'briefcase',
    label: 'Operations',
    category: 'general',
    path: 'M16 4h-8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a2 2 0 0 0-2-2zm-6 2h4v2h-4V6zm-6 4h16v3.25L13.7 17.5a2 2 0 0 1-2.4 0L4 13.25V10z',
  },
  {
    name: 'globe',
    label: 'Regional',
    category: 'general',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-8-8c0-1.35.34-2.62.94-3.74L8 11v1a2 2 0 0 0 2 2h4v2a2 2 0 0 0 2 2v.94A7.95 7.95 0 0 1 12 20zm5.91-3.1a2.02 2.02 0 0 0-.91-1.4V14a2 2 0 0 0-2-2h-1v-2a2 2 0 0 0-2-2h-2V7a2 2 0 0 0-2-2h-.08A7.98 7.98 0 0 1 19.92 10c0 2.58-1.22 4.88-3.01 6.36z',
  },
  {
    name: 'file-text',
    label: 'Reports',
    category: 'general',
    path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  },
  {
    name: 'bell',
    label: 'Alerts',
    category: 'general',
    path: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  },
  {
    name: 'settings',
    label: 'Settings',
    category: 'general',
    path: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
  },
  {
    name: 'help-circle',
    label: 'Help & Docs',
    category: 'general',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-.05-4.25a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zM12 6.5a2.5 2.5 0 0 0-2.45 2h1.5a1 1 0 1 1 1.9 0c0 .67-.4 1.05-.8 1.4-.48.42-.9.85-.9 1.6h1.5c0-.44.25-.7.62-1.02.43-.37.98-.85.98-1.98A2.5 2.5 0 0 0 12 6.5z',
  },
];

// Helper to look up an icon's SVG path
export function getNavIconPath(name: string): string {
  const found = AVAILABLE_NAV_ICONS.find((icon) => icon.name === name);
  return found ? found.path : AVAILABLE_NAV_ICONS[0].path;
}

// Initial default state for Dash Canvas
export const DEFAULT_DASH_CANVAS_STATE: DashCanvasState = {
  dimensions: {
    width: 1280,
    height: 720,
    preset: '1280x720',
  },
  backgroundColor: '#F8FAFC',
  navBar: {
    show: true,
    orientation: 'left',
    size: 210,
    backgroundColor: '#0F172A',
    textColor: '#FFFFFF',
    accentColor: '#8B5CF6',
    reportTitle: 'Executive Sales',
    logoUrl: null,
    buttons: [
      { id: 'btn-1', label: 'Overview', icon: 'home', isActive: true, section: 'menu' },
      { id: 'btn-2', label: 'Analytics', icon: 'bar-chart', isActive: false, section: 'menu' },
      { id: 'btn-3', label: 'Customers', icon: 'users', isActive: false, section: 'menu' },
      { id: 'btn-4', label: 'Revenue', icon: 'dollar-sign', isActive: false, section: 'menu' },
      { id: 'btn-gen-1', label: 'Settings', icon: 'settings', isActive: false, section: 'general' },
      { id: 'btn-gen-2', label: 'Help & Docs', icon: 'help-circle', isActive: false, section: 'general' },
    ],
  },
  containerStyle: {
    cornerRadius: 14,
    showBorder: true,
    borderWidth: 2,
    borderColor: '#1E293B',
    backgroundColor: '#FFFFFF',
    showDropShadow: true,
    shadowColor: '#1E293B',
  },
  typography: {
    fontFamily: 'Segoe UI',
    titleSize: 13,
    titleColor: '#1E293B',
    subtitleSize: 10.5,
    subtitleColor: '#64748B',
  },
  pageTitles: [
    {
      id: 'title-main',
      title: 'Monthly Executive Overview',
      subtitle: 'Live Fabric Data • Real-Time KPIs',
      position: 'top-right',
      titleSize: 15,
      titleColor: '#1E293B',
      subtitleSize: 11,
      subtitleColor: '#64748B',
    },
  ],
  layoutPreset: 'executive-overview',
  containers: [], // calculated dynamically by layout presets
};

import { BackgroundPreset } from './types';

export interface AccessiblePalettePreset {
  id: string;
  name: string;
  author: string;
  description: string;
  colors: string[];
}

export const ACCESSIBLE_PALETTE_PRESETS: AccessiblePalettePreset[] = [
  {
    id: 'bang-wong',
    name: 'Bang Wong Colorblind Safe',
    author: 'Nature Methods (2011)',
    description: 'The global benchmark for scientific and financial dashboards. 100% distinguishable under all CVD types.',
    colors: [
      '#0072B2', // Blue
      '#E69F00', // Orange
      '#009E73', // Bluish Green
      '#D55E00', // Vermilion
      '#CC79A7', // Reddish Purple
      '#56B4E9', // Sky Blue
      '#F0E442', // Yellow
      '#332288', // Dark Blue
      '#44AA99', // Cyan/Green
      '#882255', // Wine
    ],
  },
  {
    id: 'blue-orange-executive',
    name: 'Executive Blue & Amber',
    author: 'Stephen Few / PowerLab',
    description: 'High non-text contrast ratio (>= 4.5:1) optimized for KPI cards, line charts, and dual-axis visuals.',
    colors: [
      '#1E40AF', // Deep Blue
      '#D97706', // Warm Amber
      '#047857', // Emerald
      '#9333EA', // Purple
      '#0284C7', // Sky Blue
      '#C2410C', // Rust Orange
      '#4F46E5', // Indigo
      '#0F766E', // Deep Teal
      '#B45309', // Dark Bronze
      '#6D28D9', // Deep Violet
    ],
  },
  {
    id: 'ibm-design',
    name: 'IBM Design Carbon Accessible',
    author: 'IBM Design System',
    description: 'Engineered by IBM for maximum contrast clarity and compliance with WCAG AAA data visualizations.',
    colors: [
      '#0F62FE', // IBM Blue 60
      '#1192E8', // Cyan 50
      '#005D5D', // Teal 70
      '#9F1853', // Magenta 70
      '#FA4D56', // Red 50
      '#570408', // Red 90
      '#198038', // Green 60
      '#002D9C', // Blue 80
      '#EE538B', // Magenta 50
      '#B28600', // Yellow 50
    ],
  },
  {
    id: 'paul-tol-muted',
    name: 'Paul Tol Muted Palette',
    author: 'SRON Netherlands',
    description: 'Smooth, elegant tones formulated to remain fully distinct across Deuteranopia, Protanopia, and Tritanopia.',
    colors: [
      '#332288', // Indigo
      '#88CCEE', // Cyan
      '#44AA99', // Teal
      '#117733', // Green
      '#999933', // Olive
      '#DDCC77', // Sand
      '#CC6677', // Rose
      '#882255', // Wine
      '#AA4499', // Purple
      '#661100', // Brown
    ],
  },
  {
    id: 'viridis-turbo',
    name: 'Viridis Scientific Contrast',
    author: 'Matplotlib / Stefan van der Walt',
    description: 'Perceptually uniform color progression designed so that lightness and chroma increase monotonically.',
    colors: [
      '#440154', // Dark Purple
      '#482878', // Violet
      '#3E4A89', // Slate Blue
      '#31688E', // Blue
      '#26828E', // Teal
      '#1F9E89', // Green-Teal
      '#35B779', // Green
      '#6DCD59', // Lime Green
      '#B4DE2C', // Chartreuse
      '#FDE725', // Bright Yellow
    ],
  },
  {
    id: 'dark-neon-high-contrast',
    name: 'Dark Canvas Ultra-Vivid',
    author: 'PowerLab Studio',
    description: 'High contrast against dark navy and charcoal canvas backgrounds (#0F172A, #1E293B).',
    colors: [
      '#38BDF8', // Sky 400
      '#F43F5E', // Rose 500
      '#34D399', // Emerald 400
      '#FBBF24', // Amber 400
      '#A78BFA', // Violet 400
      '#FB923C', // Orange 400
      '#2DD4BF', // Teal 400
      '#F472B6', // Pink 400
      '#60A5FA', // Blue 400
      '#E879F9', // Fuchsia 400
    ],
  },
];

export const DEFAULT_BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'canvas-white',
    name: 'Pure White Canvas',
    hex: '#FFFFFF',
    isDark: false,
    category: 'canvas',
  },
  {
    id: 'card-offwhite',
    name: 'Off-White Card',
    hex: '#F8FAFC',
    isDark: false,
    category: 'card',
  },
  {
    id: 'card-slate',
    name: 'Slate Light Card',
    hex: '#F1F5F9',
    isDark: false,
    category: 'card',
  },
  {
    id: 'canvas-dark-navy',
    name: 'Dark Navy Canvas',
    hex: '#0F172A',
    isDark: true,
    category: 'canvas',
  },
  {
    id: 'card-dark-slate',
    name: 'Dark Slate Card',
    hex: '#1E293B',
    isDark: true,
    category: 'card',
  },
];

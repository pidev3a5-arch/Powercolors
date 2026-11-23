export type ButtonType =
  | 'nav'
  | 'filter'
  | 'action'
  | 'info'
  | 'kpi'
  | 'icon-only'
  | 'pill-tag';

export type ButtonState = 'default' | 'inactive' | 'hover' | 'pressed' | 'disabled';

export type ButtonStyleVariant =
  | 'neo-pop'
  | 'flat-solid'
  | 'glass-dark'
  | 'outline-ghost'
  | 'gradient';

export type ButtonIconPosition = 'left' | 'right' | 'top' | 'icon-only';

export type ButtonCornerRadius = 'square' | 'subtle' | 'smooth' | 'rounded' | 'pill';

export interface ButtonStateOverrides {
  fillColor?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
  opacity?: number;
  offsetY?: number;
  shadowOffset?: number;
}

export interface ButtonConfig {
  id: string;
  name: string;
  type: ButtonType;
  styleVariant: ButtonStyleVariant;
  
  // Dimensions
  width: number;
  height: number;
  cornerRadius: ButtonCornerRadius;
  customRadius?: number;

  // Typography
  showTitle: boolean;
  title: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'black';
  textAlign: 'center' | 'left' | 'right';

  // Subtitle / Badge
  showBadge: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;

  // Icon
  showIcon: boolean;
  iconName: string;
  iconPosition: ButtonIconPosition;
  iconSize: number;

  // Base Colors (Default state)
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  iconColor: string;

  // Neo-pop shadow
  hasShadow: boolean;
  shadowColor: string;
  shadowOffset: number;

  // Gradient
  gradientEndColor?: string;

  // State-specific color / transform overrides
  stateOverrides?: {
    [key in ButtonState]?: ButtonStateOverrides;
  };
}

export interface ButtonPreset {
  id: string;
  name: string;
  type: ButtonType;
  description: string;
  badge: string;
  config: ButtonConfig;
}

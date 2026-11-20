import { DashCanvasState } from './dashTypes';

export interface ReadyDesignPreset {
  id: string;
  name: string;
  category: 'dark' | 'light' | 'vibrant' | 'minimal';
  description: string;
  accentColor: string;
  backgroundColor: string;
  navColor: string;
  cardColor: string;
  borderColor: string;
  apply: (currentState: DashCanvasState) => DashCanvasState;
}

export const READY_DESIGN_PRESETS: ReadyDesignPreset[] = [
  {
    id: 'modern-midnight',
    name: 'Modern Midnight',
    category: 'dark',
    description: 'Deep obsidian theme with electric violet accents and high-contrast dark cards',
    accentColor: '#8B5CF6',
    backgroundColor: '#0B0F19',
    navColor: '#111827',
    cardColor: '#1F2937',
    borderColor: '#374151',
    apply: (curr) => ({
      ...curr,
      backgroundColor: '#0B0F19',
      navBar: {
        ...curr.navBar,
        backgroundColor: '#111827',
        textColor: '#F8FAFC',
        accentColor: '#8B5CF6',
      },
      containerStyle: {
        ...curr.containerStyle,
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        showBorder: true,
        borderWidth: 1.5,
        showDropShadow: true,
        shadowColor: '#030712',
      },
      typography: {
        ...curr.typography,
        fontFamily: 'Segoe UI',
        titleColor: '#F8FAFC',
        subtitleColor: '#9CA3AF',
      },
      pageTitles: curr.pageTitles.map((t) => ({
        ...t,
        titleColor: '#F8FAFC',
        subtitleColor: '#9CA3AF',
      })),
    }),
  },
  {
    id: 'enterprise-ice',
    name: 'Enterprise Blue',
    category: 'light',
    description: 'Crisp corporate executive palette with navy ribbon and polished white card containers',
    accentColor: '#0284C7',
    backgroundColor: '#F1F5F9',
    navColor: '#0F172A',
    cardColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    apply: (curr) => ({
      ...curr,
      backgroundColor: '#F1F5F9',
      navBar: {
        ...curr.navBar,
        backgroundColor: '#0F172A',
        textColor: '#FFFFFF',
        accentColor: '#0284C7',
      },
      containerStyle: {
        ...curr.containerStyle,
        backgroundColor: '#FFFFFF',
        borderColor: '#CBD5E1',
        showBorder: true,
        borderWidth: 2,
        showDropShadow: true,
        shadowColor: '#0F172A',
      },
      typography: {
        ...curr.typography,
        fontFamily: 'DIN',
        titleColor: '#0F172A',
        subtitleColor: '#64748B',
      },
      pageTitles: curr.pageTitles.map((t) => ({
        ...t,
        titleColor: '#0F172A',
        subtitleColor: '#64748B',
      })),
    }),
  },
  {
    id: 'warm-minimalist',
    name: 'Warm Paper & Gold',
    category: 'vibrant',
    description: 'Playful cream background with dark slate borders and amber gold accents',
    accentColor: '#FBBF24',
    backgroundColor: '#FFFDF5',
    navColor: '#1E293B',
    cardColor: '#FFFFFF',
    borderColor: '#1E293B',
    apply: (curr) => ({
      ...curr,
      backgroundColor: '#FFFDF5',
      navBar: {
        ...curr.navBar,
        backgroundColor: '#1E293B',
        textColor: '#FFFFFF',
        accentColor: '#FBBF24',
      },
      containerStyle: {
        ...curr.containerStyle,
        backgroundColor: '#FFFFFF',
        borderColor: '#1E293B',
        showBorder: true,
        borderWidth: 2,
        showDropShadow: true,
        shadowColor: '#1E293B',
      },
      typography: {
        ...curr.typography,
        fontFamily: 'Outfit',
        titleColor: '#1E293B',
        subtitleColor: '#64748B',
      },
      pageTitles: curr.pageTitles.map((t) => ({
        ...t,
        titleColor: '#1E293B',
        subtitleColor: '#64748B',
      })),
    }),
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Growth',
    category: 'light',
    description: 'Fresh mint aesthetic with deep forest green ribbon and energetic emerald accents',
    accentColor: '#10B981',
    backgroundColor: '#F0FDF4',
    navColor: '#064E3B',
    cardColor: '#FFFFFF',
    borderColor: '#064E3B',
    apply: (curr) => ({
      ...curr,
      backgroundColor: '#F0FDF4',
      navBar: {
        ...curr.navBar,
        backgroundColor: '#064E3B',
        textColor: '#ECFDF5',
        accentColor: '#10B981',
      },
      containerStyle: {
        ...curr.containerStyle,
        backgroundColor: '#FFFFFF',
        borderColor: '#064E3B',
        showBorder: true,
        borderWidth: 2,
        showDropShadow: true,
        shadowColor: '#064E3B',
      },
      typography: {
        ...curr.typography,
        fontFamily: 'Plus Jakarta Sans',
        titleColor: '#064E3B',
        subtitleColor: '#047857',
      },
      pageTitles: curr.pageTitles.map((t) => ({
        ...t,
        titleColor: '#064E3B',
        subtitleColor: '#047857',
      })),
    }),
  },
];

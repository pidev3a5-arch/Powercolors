export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  dataUri: string;
}

// Inline SVG Data URIs so presets load instantly with zero external network requests
const createSvgDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'tech-modern',
    name: 'Modern Tech',
    description: 'Vibrant blues, purple, and electric cyan',
    dataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A" />
            <stop offset="100%" stop-color="#1E1B4B" />
          </linearGradient>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#2563EB" />
            <stop offset="100%" stop-color="#38BDF8" />
          </linearGradient>
          <linearGradient id="g2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7C3AED" />
            <stop offset="100%" stop-color="#F43F5E" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg)" />
        <circle cx="120" cy="140" r="80" fill="url(#g1)" opacity="0.9" />
        <circle cx="260" cy="160" r="90" fill="url(#g2)" opacity="0.85" />
        <rect x="180" y="70" width="100" height="100" rx="20" fill="#06B6D4" opacity="0.8" />
        <circle cx="210" cy="220" r="45" fill="#3B82F6" opacity="0.9" />
        <circle cx="310" cy="80" r="30" fill="#EC4899" />
      </svg>
    `),
  },
  {
    id: 'corporate-fintech',
    name: 'Corporate FinTech',
    description: 'Deep navy, emerald green, and gold',
    dataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0A192F" />
            <stop offset="100%" stop-color="#172A45" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#cbg)" />
        <rect x="50" y="60" width="120" height="180" rx="12" fill="#047857" opacity="0.9" />
        <rect x="190" y="100" width="150" height="140" rx="12" fill="#D97706" opacity="0.85" />
        <circle cx="170" cy="80" r="50" fill="#10B981" />
        <circle cx="290" cy="70" r="35" fill="#FBBF24" />
        <rect x="110" y="150" width="130" height="80" rx="8" fill="#1E40AF" opacity="0.9" />
      </svg>
    `),
  },
  {
    id: 'sunset-analytics',
    name: 'Sunset Analytics',
    description: 'Warm coral, amber, and deep plum',
    dataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="sbg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4C1D95" />
            <stop offset="50%" stop-color="#BE185D" />
            <stop offset="100%" stop-color="#F97316" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#sbg)" />
        <circle cx="200" cy="180" r="70" fill="#FBBF24" opacity="0.9" />
        <path d="M 0 240 Q 150 180 400 250 L 400 300 L 0 300 Z" fill="#831843" />
        <circle cx="80" cy="100" r="40" fill="#FB7185" />
        <circle cx="320" cy="120" r="45" fill="#C084FC" />
      </svg>
    `),
  },
  {
    id: 'eco-forest',
    name: 'Eco Forest',
    description: 'Earthy greens, sage, and dark teal',
    dataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <rect width="400" height="300" fill="#064E3B" />
        <circle cx="100" cy="120" r="75" fill="#059669" opacity="0.9" />
        <circle cx="250" cy="150" r="95" fill="#10B981" opacity="0.85" />
        <rect x="70" y="160" width="140" height="100" rx="16" fill="#0D9488" opacity="0.9" />
        <circle cx="310" cy="90" r="50" fill="#6EE7B7" />
        <rect x="220" y="80" width="90" height="90" rx="10" fill="#047857" />
      </svg>
    `),
  },
];

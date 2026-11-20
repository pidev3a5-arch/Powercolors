import { PowerBITheme, StructuralColors, ThemeCustomizationOptions } from './types';

export const POWER_BI_THEME_SCHEMA_URL =
  'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-2.159.json';

/**
 * Generates an official, schema-compliant Microsoft Power BI Report Theme object.
 */
export function buildPowerBITheme(
  themeName: string,
  dataColors: string[],
  structural: StructuralColors,
  options?: Partial<ThemeCustomizationOptions>
): PowerBITheme {
  const safeName = themeName.trim() || 'PowerLab Custom Theme';
  const ensuredDataColors = dataColors.slice(0, 10);
  const fontFamily = options?.fontFamily || 'Segoe UI';
  const showBorders = options?.showVisualBorders ?? true;
  const showDropShadow = options?.showVisualDropShadow ?? false;

  return {
    $schema: POWER_BI_THEME_SCHEMA_URL,
    name: safeName,
    dataColors: ensuredDataColors,
    background: structural.background,
    foreground: structural.foreground,
    tableAccent: structural.tableAccent,
    good: structural.good,
    bad: structural.bad,
    neutral: structural.neutral,
    textClasses: {
      title: {
        fontFace: fontFamily,
        fontSize: 12,
        color: structural.foreground,
      },
      label: {
        fontFace: fontFamily,
        fontSize: 10,
        color: structural.foreground,
      },
      callout: {
        fontFace: fontFamily,
        fontSize: 24,
        color: structural.foreground,
      },
      header: {
        fontFace: fontFamily.includes('Segoe UI') ? 'Segoe UI Semibold' : fontFamily,
        fontSize: 11,
        color: structural.foreground,
      },
    },
    visualStyles: {
      '*': {
        '*': {
          border: [
            {
              show: showBorders,
              color: { solid: { color: structural.background === '#FFFFFF' ? '#E2E8F0' : '#334155' } },
            },
          ],
          dropShadow: [
            {
              show: showDropShadow,
            },
          ],
        },
      },
      card: {
        '*': {
          labels: [
            {
              fontSize: 24,
              color: { solid: { color: structural.foreground } },
            },
          ],
        },
      },
      tableEx: {
        '*': {
          grid: [
            {
              outlineColor: { solid: { color: structural.tableAccent } },
              gridVertical: true,
              gridHorizontal: true,
            },
          ],
          columnHeaders: [
            {
              fontColor: { solid: { color: '#FFFFFF' } },
              backColor: { solid: { color: structural.tableAccent } },
            },
          ],
        },
      },
    },
  };
}

/**
 * Validates a Power BI Theme JSON object according to Microsoft's core expectations
 */
export function validatePowerBITheme(theme: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!theme || typeof theme !== 'object') {
    return { isValid: false, errors: ['Theme must be an object'] };
  }

  const t = theme as Partial<PowerBITheme>;

  if (!t.name || typeof t.name !== 'string' || t.name.trim() === '') {
    errors.push('Theme "name" property is required');
  }

  if (!Array.isArray(t.dataColors)) {
    errors.push('"dataColors" must be an array');
  } else {
    if (t.dataColors.length === 0) {
      errors.push('"dataColors" array cannot be empty');
    }
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    t.dataColors.forEach((color, idx) => {
      if (typeof color !== 'string' || !hexRegex.test(color)) {
        errors.push(`Invalid hex color at dataColors[${idx}]: "${color}"`);
      }
    });
  }

  if (!t.background || typeof t.background !== 'string') {
    errors.push('"background" color string is required');
  }

  if (!t.foreground || typeof t.foreground !== 'string') {
    errors.push('"foreground" color string is required');
  }

  if (!t.tableAccent || typeof t.tableAccent !== 'string') {
    errors.push('"tableAccent" color string is required');
  }

  // Check textClasses schema compliance
  if (t.textClasses && typeof t.textClasses === 'object') {
    const classes = t.textClasses as Record<string, unknown>;
    for (const [key, val] of Object.entries(classes)) {
      if (val && typeof val === 'object') {
        const item = val as Record<string, unknown>;
        if ('fontFamily' in item) {
          errors.push(`textClasses.${key} must use "fontFace", not "fontFamily"`);
        }
        if (!item.fontFace || typeof item.fontFace !== 'string') {
          errors.push(`textClasses.${key} missing valid "fontFace" string`);
        }
      }
    }
  }

  // Check visualStyles schema compliance (avoid invalid visualContainer wrapper)
  if (t.visualStyles && typeof t.visualStyles === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vs = t.visualStyles as Record<string, any>;
    if (vs['*']?.['*']?.visualContainer) {
      errors.push('visualStyles.*.* must not contain "visualContainer"; use direct "border" or "dropShadow" cards');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formats a Power BI Theme object into a formatted JSON string
 */
export function serializePowerBITheme(theme: PowerBITheme): string {
  return JSON.stringify(theme, null, 2);
}

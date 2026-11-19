import { PowerBITheme, StructuralColors } from './types';

export const POWER_BI_THEME_SCHEMA_URL =
  'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-latest.json';

/**
 * Generates an official, schema-compliant Microsoft Power BI Report Theme object.
 */
export function buildPowerBITheme(
  themeName: string,
  dataColors: string[],
  structural: StructuralColors
): PowerBITheme {
  const safeName = themeName.trim() || 'PowerColors Custom Theme';
  const ensuredDataColors = dataColors.slice(0, 10);

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
        fontFamily: 'Segoe UI',
        fontSize: 12,
        color: structural.foreground,
      },
      label: {
        fontFamily: 'Segoe UI',
        fontSize: 10,
        color: structural.foreground,
      },
      callout: {
        fontFamily: 'Segoe UI',
        fontSize: 24,
        color: structural.foreground,
      },
      header: {
        fontFamily: 'Segoe UI Semibold',
        fontSize: 11,
        color: structural.foreground,
      },
    },
    visualStyles: {
      '*': {
        '*': {
          visualContainer: [
            {
              dropShadow: { show: false },
              border: {
                show: true,
                color: { solid: { color: structural.background === '#FFFFFF' ? '#E2E8F0' : '#334155' } },
              },
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

import { DenebSpecTemplate } from './types';

export const DENEB_CUSTOM_VISUAL_GUID = 'deneb7E15AEF80B9E4D4F8E12924291ECE89A';

/**
 * Injects PowerLab's active theme palette into a Vega-Lite spec's color scales
 */
export function injectThemePaletteIntoSpec(
  spec: Record<string, any>,
  paletteHexes: string[]
): Record<string, any> {
  if (!paletteHexes || paletteHexes.length === 0) return spec;

  const cloned = JSON.parse(JSON.stringify(spec));

  // If spec has config.range.category, update it
  if (!cloned.config) cloned.config = {};
  if (!cloned.config.range) cloned.config.range = {};
  cloned.config.range.category = paletteHexes.slice(0, 10);

  // If encoding has color.scale.range, update it
  if (cloned.encoding && cloned.encoding.color && typeof cloned.encoding.color === 'object') {
    if (cloned.encoding.color.scale) {
      cloned.encoding.color.scale.range = paletteHexes.slice(0, 10);
    }
  }

  // If layer exists, check layers
  if (Array.isArray(cloned.layer)) {
    cloned.layer.forEach((l: any) => {
      if (l.encoding && l.encoding.color && typeof l.encoding.color === 'object') {
        if (l.encoding.color.scale) {
          l.encoding.color.scale.range = paletteHexes.slice(0, 10);
        }
      }
    });
  }

  return cloned;
}

/**
 * Generates an official Power BI Enhanced Report (PBIR) visual.json for the Deneb visual
 */
export function generatePbirDenebVisualJson(
  template: DenebSpecTemplate,
  options: {
    visualName?: string;
    position?: { x: number; y: number; width: number; height: number; z?: number };
    palette?: string[];
  }
): string {
  const finalSpec = options.palette
    ? injectThemePaletteIntoSpec(template.spec, options.palette)
    : template.spec;

  const specString = JSON.stringify(finalSpec);
  // Power BI expressions escape single quotes by doubling them ''
  const escapedSpec = specString.replace(/'/g, "''");

  const pos = options.position || { x: 24, y: 24, width: 600, height: 400, z: 1 };
  const safeName = (options.visualName || template.name)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

  const pbirObject = {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/1.1.0/schema.json',
    name: safeName,
    position: {
      x: Math.round(pos.x),
      y: Math.round(pos.y),
      width: Math.round(pos.width),
      height: Math.round(pos.height),
      z: pos.z || 1,
    },
    visual: {
      visualType: DENEB_CUSTOM_VISUAL_GUID,
      objects: {
        developer: [
          {
            properties: {
              spec: {
                expr: {
                  Literal: {
                    Value: `'${escapedSpec}'`,
                  },
                },
              },
              provider: {
                expr: {
                  Literal: {
                    Value: `'${template.provider}'`,
                  },
                },
              },
            },
          },
        ],
      },
      visualContainerObjects: {
        title: [
          {
            properties: {
              text: {
                expr: {
                  Literal: {
                    Value: `'${template.name}'`,
                  },
                },
              },
              visible: {
                expr: {
                  Literal: {
                    Value: 'true',
                  },
                },
              },
            },
          },
        ],
      },
    },
  };

  return JSON.stringify(pbirObject, null, 2);
}

/**
 * Download Vega-Lite JSON file
 */
export function downloadDenebSpecFile(spec: Record<string, any>, templateId: string): void {
  const jsonStr = JSON.stringify(spec, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${templateId}.vl.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

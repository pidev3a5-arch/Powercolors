import { SvgIconItem, IconCustomization } from './types';

export const DEFAULT_ICON_CUSTOMIZATION: IconCustomization = {
  color: '#8B5CF6',
  size: 24,
  strokeWidth: 2,
  badgeStyle: 'none',
  badgeBgColor: '#EDE9FE',
};

/**
 * Generates raw SVG markup with optional container badge
 */
export function generateRawSvg(icon: SvgIconItem, custom: IconCustomization): string {
  const { color, size, strokeWidth, badgeStyle, badgeBgColor = '#EDE9FE' } = custom;
  const viewBox = icon.viewBox || '0 0 24 24';

  let containerElements = '';
  let contentTransform = '';

  if (badgeStyle === 'soft-rounded') {
    containerElements = `<rect x="0" y="0" width="24" height="24" rx="6" fill="${badgeBgColor}"/>`;
    contentTransform = 'transform="scale(0.7) translate(5.14, 5.14)"';
  } else if (badgeStyle === 'circle') {
    containerElements = `<circle cx="12" cy="12" r="11.5" fill="${badgeBgColor}"/>`;
    contentTransform = 'transform="scale(0.7) translate(5.14, 5.14)"';
  } else if (badgeStyle === 'square-outline') {
    containerElements = `<rect x="1" y="1" width="22" height="22" rx="5" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    contentTransform = 'transform="scale(0.75) translate(4, 4)"';
  }

  const innerBody = contentTransform ? `<g ${contentTransform}>${icon.body}</g>` : icon.body;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${containerElements}${innerBody}</svg>`;
}

/**
 * Generates ready-to-paste Power BI DAX Measure with ImageUrl Data Category
 */
export function generateDaxIconMeasure(
  icon: SvgIconItem,
  custom: IconCustomization,
  measureName?: string
): string {
  const rawSvg = generateRawSvg(icon, custom);
  // Power BI inline DAX requires '#' to be replaced with '%23' for browser rendering
  const urlSafeSvg = rawSvg.replace(/#/g, '%23').replace(/"/g, "'");
  const cleanName = measureName || `Icon ${icon.name.replace(/[^a-zA-Z0-9 ]/g, '')}`;

  return `${cleanName} = 
VAR _Svg = "data:image/svg+xml;utf8,${urlSafeSvg}"
RETURN
    _Svg

/*
-------------------------------------------------------------------------
POWER BI USAGE INSTRUCTIONS:
1. Copy this DAX formula and paste it as a New Measure in Power BI Desktop.
2. Select the measure in the Data pane.
3. In the top ribbon, open the "Measure tools" or "Modeling" tab.
4. Set "Data category" to "Image URL".
5. Add to a Table, Matrix, or New Card visual for pixel-perfect inline icons.
-------------------------------------------------------------------------
*/`;
}

/**
 * Downloads standalone .svg file
 */
export function downloadSvgFile(icon: SvgIconItem, custom: IconCustomization) {
  const rawSvg = generateRawSvg(icon, custom);
  const blob = new Blob([rawSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${icon.id}-${custom.size}px.svg`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

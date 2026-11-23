import JSZip from 'jszip';
import {
  ButtonConfig,
  ButtonState,
  ButtonCornerRadius,
  ButtonStateOverrides,
} from './types';
import { SVG_ICONS_COLLECTION } from '../iconLibrary/icons';

/**
 * Resolve pixel corner radius from named preset or custom number
 */
export function resolveCornerRadius(
  radiusType: ButtonCornerRadius,
  height: number,
  customRadius?: number
): number {
  if (customRadius !== undefined && customRadius >= 0) {
    return customRadius;
  }
  switch (radiusType) {
    case 'square':
      return 0;
    case 'subtle':
      return 6;
    case 'smooth':
      return 12;
    case 'rounded':
      return 18;
    case 'pill':
      return Math.round(height / 2);
    default:
      return 8;
  }
}

/**
 * Compute effective styles for any state (default, inactive, hover, pressed, disabled)
 */
export function resolveEffectiveStyles(
  config: ButtonConfig,
  state: ButtonState
): {
  fillColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  opacity: number;
  offsetY: number;
  shadowOffset: number;
} {
  const baseShadow = config.hasShadow ? config.shadowOffset : 0;
  const overrides: ButtonStateOverrides = config.stateOverrides?.[state] || {};

  switch (state) {
    case 'hover':
      return {
        fillColor: overrides.fillColor || config.fillColor,
        borderColor: overrides.borderColor || config.borderColor,
        textColor: overrides.textColor || config.textColor,
        iconColor: overrides.iconColor || config.iconColor,
        opacity: overrides.opacity ?? 1,
        offsetY: overrides.offsetY ?? -1,
        shadowOffset: overrides.shadowOffset ?? (baseShadow > 0 ? baseShadow + 1 : 0),
      };

    case 'pressed':
      return {
        fillColor: overrides.fillColor || (config.styleVariant === 'outline-ghost' ? config.borderColor : config.fillColor),
        borderColor: overrides.borderColor || config.borderColor,
        textColor: overrides.textColor || (config.styleVariant === 'outline-ghost' ? '#FFFFFF' : config.textColor),
        iconColor: overrides.iconColor || (config.styleVariant === 'outline-ghost' ? '#FFFFFF' : config.iconColor),
        opacity: overrides.opacity ?? 1,
        offsetY: overrides.offsetY ?? 2,
        shadowOffset: overrides.shadowOffset ?? (baseShadow > 1 ? 1 : 0),
      };

    case 'inactive':
      return {
        fillColor: overrides.fillColor || '#F8FAFC',
        borderColor: overrides.borderColor || '#CBD5E1',
        textColor: overrides.textColor || '#64748B',
        iconColor: overrides.iconColor || '#94A3B8',
        opacity: overrides.opacity ?? 1,
        offsetY: overrides.offsetY ?? 0,
        shadowOffset: overrides.shadowOffset ?? (baseShadow > 0 ? 1 : 0),
      };

    case 'disabled':
      return {
        fillColor: overrides.fillColor || '#E2E8F0',
        borderColor: overrides.borderColor || '#94A3B8',
        textColor: overrides.textColor || '#94A3B8',
        iconColor: overrides.iconColor || '#94A3B8',
        opacity: overrides.opacity ?? 0.55,
        offsetY: overrides.offsetY ?? 0,
        shadowOffset: 0,
      };

    case 'default':
    default:
      return {
        fillColor: config.fillColor,
        borderColor: config.borderColor,
        textColor: config.textColor,
        iconColor: config.iconColor,
        opacity: 1,
        offsetY: 0,
        shadowOffset: baseShadow,
      };
  }
}

/**
 * Extract or sanitize SVG inner elements from a custom SVG string
 */
export function sanitizeCustomSvg(svgStr: string): string {
  if (!svgStr || !svgStr.trim()) return '';
  const trimmed = svgStr.trim();
  const match = trimmed.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return trimmed;
}

/**
 * Find icon SVG inner body from icon library or custom imported SVG
 */
export function getButtonIconBody(config: { iconName: string; customIconSvg?: string } | string): string {
  if (typeof config === 'object' && config.customIconSvg && config.customIconSvg.trim()) {
    return sanitizeCustomSvg(config.customIconSvg);
  }
  const name = typeof config === 'string' ? config : config.iconName;
  const found = SVG_ICONS_COLLECTION.find(
    (i) => i.id === name || i.name.toLowerCase() === name.toLowerCase()
  );
  if (found) {
    return found.body;
  }
  // Default fallback check icon
  return '<polyline points="20 6 9 17 4 12"/>';
}

/**
 * Generate pure SVG markup string for a ButtonConfig at a specific state
 */
export function generateButtonSvg(
  config: ButtonConfig,
  state: ButtonState = 'default'
): string {
  const styles = resolveEffectiveStyles(config, state);
  const rx = resolveCornerRadius(config.cornerRadius, config.height, config.customRadius);

  // SVG canvas dimensions (including space for pop shadow offset)
  const maxShadow = Math.max(config.shadowOffset, styles.shadowOffset, 4);
  const paddingMargin = config.hasShadow ? maxShadow + 2 : 2;
  const svgWidth = config.width + paddingMargin * 2;
  const svgHeight = config.height + paddingMargin * 2;

  // Button box position
  const btnX = paddingMargin;
  const btnY = paddingMargin + styles.offsetY;
  const btnW = config.width;
  const btnH = config.height;

  // Shadow position
  const shadowX = btnX + styles.shadowOffset;
  const shadowY = btnY + styles.shadowOffset;

  // Gradient ID
  const gradId = `btn-grad-${config.id}-${state}`;

  // Build Gradient Def if variant is gradient
  const defs =
    config.styleVariant === 'gradient'
      ? `<defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${styles.fillColor}" />
      <stop offset="100%" stop-color="${config.gradientEndColor || styles.fillColor}" />
    </linearGradient>
  </defs>`
      : '';

  const activeFill =
    config.styleVariant === 'gradient'
      ? `url(#${gradId})`
      : styles.fillColor;

  // Build Neo-Pop Hard Shadow
  const shadowElem =
    config.hasShadow && styles.shadowOffset > 0
      ? `<rect x="${shadowX}" y="${shadowY}" width="${btnW}" height="${btnH}" rx="${rx}" fill="${config.shadowColor}" opacity="0.95" />`
      : '';

  // Calculate internal layout: icon + text + badge
  const iconBody = config.showIcon ? getButtonIconBody(config) : '';
  const iconSz = config.iconSize;
  const fontSize = config.fontSize;
  const fontWeightVal =
    config.fontWeight === 'black' ? '900' : config.fontWeight === 'bold' ? '700' : '500';

  let contentElements = '';

  if (config.type === 'icon-only' || config.iconPosition === 'icon-only') {
    // Center icon inside button
    const icX = btnX + (btnW - iconSz) / 2;
    const icY = btnY + (btnH - iconSz) / 2;
    contentElements = `
      <g transform="translate(${icX}, ${icY})" fill="none" stroke="${styles.iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <svg viewBox="0 0 24 24" width="${iconSz}" height="${iconSz}">
          ${iconBody}
        </svg>
      </g>
    `;
  } else if (config.iconPosition === 'top') {
    // Icon on top, text below
    const edgeMargin = Math.max(14, Math.round(rx * 0.35) + 6);
    let icX = btnX + (btnW - iconSz) / 2;
    let txtX = btnX + btnW / 2;
    let textAnchor: 'start' | 'middle' | 'end' = 'middle';

    if (config.textAlign === 'left') {
      icX = btnX + edgeMargin;
      txtX = btnX + edgeMargin;
      textAnchor = 'start';
    } else if (config.textAlign === 'right') {
      icX = btnX + btnW - iconSz - edgeMargin;
      txtX = btnX + btnW - edgeMargin;
      textAnchor = 'end';
    }

    const icY = btnY + (btnH - iconSz - fontSize - 6) / 2;
    const txtY = icY + iconSz + 12;

    contentElements = `
      ${
        config.showIcon
          ? `<g transform="translate(${icX}, ${icY})" fill="none" stroke="${styles.iconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <svg viewBox="0 0 24 24" width="${iconSz}" height="${iconSz}">
                ${iconBody}
              </svg>
            </g>`
          : ''
      }
      ${
        config.showTitle
          ? `<text x="${txtX}" y="${txtY}" text-anchor="${textAnchor}" dominant-baseline="central" font-family="${config.fontFamily}, sans-serif" font-size="${fontSize}px" font-weight="${fontWeightVal}" fill="${styles.textColor}">
              ${escapeXml(config.title)}
            </text>`
          : ''
      }
    `;
  } else {
    // Horizontal row: [Icon] [Title] [Badge]
    // Calculate total estimated content width to center or align properly
    const approxCharWidth = fontSize * 0.58;
    const textWidth = config.showTitle ? config.title.length * approxCharWidth : 0;
    const badgeWidth = config.showBadge ? config.badgeText.length * (fontSize * 0.5) + 16 : 0;
    const spacing = 8;

    let totalContentWidth = 0;
    if (config.showIcon) totalContentWidth += iconSz;
    if (config.showTitle) totalContentWidth += (totalContentWidth > 0 ? spacing : 0) + textWidth;
    if (config.showBadge) totalContentWidth += (totalContentWidth > 0 ? spacing : 0) + badgeWidth;

    const edgeMargin = Math.max(14, Math.round(rx * 0.35) + 6);
    let startX = btnX + (btnW - totalContentWidth) / 2;
    if (config.textAlign === 'left') {
      startX = btnX + edgeMargin;
    } else if (config.textAlign === 'right') {
      startX = btnX + btnW - totalContentWidth - edgeMargin;
    }

    const centerY = btnY + btnH / 2;
    let currX = startX;

    let iconSvg = '';
    if (config.showIcon && config.iconPosition === 'left') {
      iconSvg = `
        <g transform="translate(${currX}, ${centerY - iconSz / 2})" fill="none" stroke="${styles.iconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <svg viewBox="0 0 24 24" width="${iconSz}" height="${iconSz}">
            ${iconBody}
          </svg>
        </g>
      `;
      currX += iconSz + spacing;
    }

    let textSvg = '';
    if (config.showTitle) {
      const textAnchor = 'start';
      textSvg = `
        <text x="${currX}" y="${centerY}" text-anchor="${textAnchor}" dominant-baseline="central" font-family="${config.fontFamily}, sans-serif" font-size="${fontSize}px" font-weight="${fontWeightVal}" fill="${styles.textColor}">
          ${escapeXml(config.title)}
        </text>
      `;
      currX += textWidth + spacing;
    }

    let rightIconSvg = '';
    if (config.showIcon && config.iconPosition === 'right') {
      rightIconSvg = `
        <g transform="translate(${currX}, ${centerY - iconSz / 2})" fill="none" stroke="${styles.iconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <svg viewBox="0 0 24 24" width="${iconSz}" height="${iconSz}">
            ${iconBody}
          </svg>
        </g>
      `;
      currX += iconSz + spacing;
    }

    let badgeSvg = '';
    if (config.showBadge && config.badgeText.trim()) {
      const bH = fontSize + 4;
      const bW = badgeWidth;
      const bY = centerY - bH / 2;
      badgeSvg = `
        <g transform="translate(${currX}, ${bY})">
          <rect width="${bW}" height="${bH}" rx="${Math.round(bH / 2)}" fill="${config.badgeBgColor}" />
          <text x="${bW / 2}" y="${bH / 2}" text-anchor="middle" dominant-baseline="central" font-family="${config.fontFamily}, sans-serif" font-size="${Math.max(9, fontSize - 2)}px" font-weight="800" fill="${config.badgeTextColor}">
            ${escapeXml(config.badgeText)}
          </text>
        </g>
      `;
    }

    contentElements = `${iconSvg}${textSvg}${rightIconSvg}${badgeSvg}`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  ${defs}
  <g opacity="${styles.opacity}">
    ${shadowElem}
    <rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="${rx}" fill="${activeFill}" stroke="${styles.borderColor}" stroke-width="${config.borderWidth}" />
    ${contentElements}
  </g>
</svg>`.trim();
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Download SVG file in browser
 */
export function downloadButtonSvg(
  config: ButtonConfig,
  state: ButtonState = 'default',
  filename?: string
): void {
  const svg = generateButtonSvg(config, state);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (filename || `${config.name.toLowerCase().replace(/\s+/g, '_')}_${state}`).replace(/[^a-z0-9_-]/gi, '');
  a.href = url;
  a.download = `${safeName}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Convert SVG string to high-resolution PNG Blob via HTML5 Canvas
 */
export async function exportButtonPngBlob(
  config: ButtonConfig,
  state: ButtonState = 'default',
  scale: number = 2
): Promise<Blob> {
  const svg = generateButtonSvg(config, state);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => {
          URL.revokeObjectURL(url);
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Failed to generate PNG blob'));
          }
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into image: ' + e));
    };
    img.src = url;
  });
}

/**
 * Download PNG file in browser
 */
export async function downloadButtonPng(
  config: ButtonConfig,
  state: ButtonState = 'default',
  filename?: string
): Promise<void> {
  const blob = await exportButtonPngBlob(config, state, 2);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (filename || `${config.name.toLowerCase().replace(/\s+/g, '_')}_${state}`).replace(/[^a-z0-9_-]/gi, '');
  a.href = url;
  a.download = `${safeName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export complete 4-State Button Package (.zip) for Power BI Desktop
 * Contains default, hover, pressed, and disabled states in SVG & PNG!
 */
export async function exportButtonBundleZip(
  config: ButtonConfig,
  states: ButtonState[] = ['default', 'hover', 'pressed', 'disabled']
): Promise<Blob> {
  const zip = new JSZip();
  const folderName = `${config.name.toLowerCase().replace(/\s+/g, '_')}_pbi_bundle`;
  const root = zip.folder(folderName) || zip;

  for (const st of states) {
    // 1. Add SVG
    const svgContent = generateButtonSvg(config, st);
    root.file(`${config.name.toLowerCase().replace(/\s+/g, '_')}_${st}.svg`, svgContent);

    // 2. Add high-res PNG (if in browser environment with canvas support)
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const pngBlob = await exportButtonPngBlob(config, st, 2);
        const pngBuffer = await pngBlob.arrayBuffer();
        root.file(`${config.name.toLowerCase().replace(/\s+/g, '_')}_${st}.png`, pngBuffer);
      }
    } catch {
      // Graceful fallback: SVG is always included
    }
  }

  // Add README instructions for Power BI Desktop
  const readme = `# Power BI Button State Assets
Button: ${config.name}
Type: ${config.type}
Dimensions: ${config.width} x ${config.height} px

## How to use in Power BI Desktop:
1. In Power BI Desktop, insert a **Blank Button** (Insert > Buttons > Blank).
2. With the button selected, open the **Format** pane on the right.
3. Expand **Button Style**:
   - Set **Apply settings to**: "Default" -> Expand **Fill** / **Image**, click **Browse**, select:
     \`${config.name.toLowerCase().replace(/\s+/g, '_')}_default.svg\` (or .png)
   - Set **Image Fit**: "Fit".
   - Switch **Apply settings to**: "On hover" -> Browse & select:
     \`${config.name.toLowerCase().replace(/\s+/g, '_')}_hover.svg\`
   - Switch **Apply settings to**: "On press" -> Browse & select:
     \`${config.name.toLowerCase().replace(/\s+/g, '_')}_pressed.svg\`
   - Switch **Apply settings to**: "Disabled" -> Browse & select:
     \`${config.name.toLowerCase().replace(/\s+/g, '_')}_disabled.svg\`
4. Turn off default button text/border in Power BI since the custom vector asset already contains styling!
`;
  root.file('README_POWER_BI_SETUP.txt', readme);

  return zip.generateAsync({ type: 'blob' });
}

/**
 * Trigger download of the 4-State ZIP package
 */
export function downloadButtonBundleZip(blob: Blob, buttonName: string): void {
  const safeName = buttonName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/gi, '');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}_powerbi_buttons.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate DAX measure expression with data:image/svg+xml
 */
export function generateButtonDaxExpression(
  config: ButtonConfig,
  state: ButtonState = 'default'
): string {
  const svg = generateButtonSvg(config, state);
  const minified = svg
    .replace(/\r?\n|\r/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/"/g, '""');

  return `// Power BI Button Measure (Set Data Category to "Image URL")
Button_${config.name.replace(/\s+/g, '_')}_${state} = 
"data:image/svg+xml;utf8," & 
"${minified}"`;
}

import { DashCanvasState, getNavIconPath } from './dashTypes';

/**
 * Escapes characters for XML compliance
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates standalone, valid XML SVG markup for Power BI canvas wallpaper background.
 */
export function generateDashSvg(state: DashCanvasState, forPreview = false): string {
  const { width, height } = state.dimensions;
  const { navBar, containerStyle, containers, typography, pageTitles } = state;

  const font = typography?.fontFamily || 'Segoe UI';
  const defaultTitleSize = typography?.titleSize || 13;
  const defaultTitleColor = typography?.titleColor || '#1E293B';
  const defaultSubtitleSize = typography?.subtitleSize || 10.5;
  const defaultSubtitleColor = typography?.subtitleColor || '#64748B';

  const parts: string[] = [];

  // SVG Root with XML namespace and dimensions
  const styleAttr = forPreview ? ` style="width: 100%; height: 100%; display: block;"` : '';
  const preserveAttr = forPreview ? ` preserveAspectRatio="none"` : '';
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"${preserveAttr}${styleAttr}>`
  );

  // Embedded Typography and CSS Styles
  parts.push(`  <defs>
    <style>
      text {
        font-family: '${font}', -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif;
        user-select: none;
      }
    </style>
  </defs>`);

  // 1. Canvas Background
  parts.push(
    `  <!-- Canvas Background -->`,
    `  <rect width="${width}" height="${height}" fill="${state.backgroundColor}" />`
  );

  // 2. Visual Container Slots
  parts.push(`  <!-- Visual Container Slots -->`);
  for (const c of containers) {
    const rx = containerStyle.cornerRadius;
    const showBorder = c.showBorder !== undefined ? c.showBorder : containerStyle.showBorder !== false;
    const strokeW = showBorder ? (c.borderWidth ?? containerStyle.borderWidth ?? 2) : 0;
    const strokeColor = showBorder ? (c.borderColor ?? containerStyle.borderColor ?? '#1E293B') : 'none';
    const fill = c.backgroundColor || containerStyle.backgroundColor;

    // Hard offset shadow if enabled
    if (containerStyle.showDropShadow) {
      parts.push(
        `  <rect x="${Math.round(c.x + 3)}" y="${Math.round(c.y + 3)}" width="${Math.round(
          c.width
        )}" height="${Math.round(c.height)}" rx="${rx}" fill="${
          containerStyle.shadowColor
        }" opacity="0.3" />`
      );
    }

    // Main Card Shape
    parts.push(
      `  <rect x="${Math.round(c.x)}" y="${Math.round(c.y)}" width="${Math.round(
        c.width
      )}" height="${Math.round(c.height)}" rx="${rx}" fill="${fill}" stroke="${strokeColor}" stroke-width="${strokeW}" />`
    );

    // Card Header: Title & Subtitle
    const hasTitle = c.showTitle && c.title.trim().length > 0;
    const hasSubtitle = c.showSubtitle && c.subtitle.trim().length > 0;

    const slotTitleSize = c.titleSize || defaultTitleSize;
    const slotTitleColor = c.titleColor || defaultTitleColor;
    const slotSubtitleSize = c.subtitleSize || defaultSubtitleSize;
    const slotSubtitleColor = c.subtitleColor || defaultSubtitleColor;

    if (hasTitle || hasSubtitle) {
      let textY = Math.round(c.y + 24);

      if (hasTitle) {
        parts.push(
          `  <text x="${Math.round(c.x + 16)}" y="${textY}" font-size="${slotTitleSize}" font-weight="700" fill="${slotTitleColor}">${escapeXml(
            c.title
          )}</text>`
        );
        textY += slotTitleSize + 4;
      }

      if (hasSubtitle) {
        parts.push(
          `  <text x="${Math.round(c.x + 16)}" y="${textY}" font-size="${slotSubtitleSize}" font-weight="500" fill="${slotSubtitleColor}">${escapeXml(
            c.subtitle
          )}</text>`
        );
        textY += slotSubtitleSize + 2;
      }

      // Divider line (per-slot custom color, thickness, and toggle)
      const showDivider = c.showDivider !== false;
      const dividerColor = c.dividerColor || '#E2E8F0';
      const dividerThickness = c.dividerThickness || 1;
      const dividerY = textY + 6;

      if (showDivider && dividerY < c.y + c.height) {
        parts.push(
          `  <line x1="${Math.round(c.x)}" y1="${Math.round(dividerY)}" x2="${Math.round(
            c.x + c.width
          )}" y2="${Math.round(dividerY)}" stroke="${dividerColor}" stroke-width="${dividerThickness}" stroke-dasharray="4 2" />`
        );
      }
    }
  }

  // 4. Navigation Ribbon (if enabled)
  if (navBar.show) {
    parts.push(`  <!-- Navigation Bar (${navBar.orientation}) -->`);

    const menuButtons = navBar.buttons.filter((b) => b.section !== 'general');
    const generalButtons = navBar.buttons.filter((b) => b.section === 'general');

    if (navBar.orientation === 'left') {
      // Left Sidebar Background
      parts.push(
        `  <rect x="0" y="0" width="${navBar.size}" height="${height}" fill="${navBar.backgroundColor}" />`,
        `  <line x1="${navBar.size}" y1="0" x2="${navBar.size}" y2="${height}" stroke="#1E293B" stroke-width="2" />`
      );

      // Logo & Title
      let titleX = 20;
      const titleY = 44;

      if (navBar.logoUrl) {
        parts.push(
          `  <image x="18" y="20" width="34" height="34" href="${escapeXml(
            navBar.logoUrl
          )}" preserveAspectRatio="xMidYMid meet" />`
        );
        titleX = 58;
      }

      const reportTitleSizeLeft = navBar.reportTitleSize || 14;

      if (navBar.reportTitle) {
        parts.push(
          `  <text x="${titleX}" y="${titleY}" font-size="${reportTitleSizeLeft}" font-weight="800" fill="${
            navBar.textColor
          }">${escapeXml(navBar.reportTitle)}</text>`
        );
      }

      // Divider below brand header
      parts.push(
        `  <line x1="16" y1="70" x2="${navBar.size - 16}" y2="70" stroke="${
          navBar.textColor
        }" opacity="0.15" stroke-width="1" />`
      );

      const btnH = 38;
      const btnW = navBar.size - 28;
      const globalShowIcons = navBar.showButtonIcons !== false;

      // Section 1: MENU
      let btnY = 94;
      if (menuButtons.length > 0) {
        parts.push(
          `  <text x="18" y="${btnY - 8}" font-size="9" font-weight="800" letter-spacing="1" fill="${
            navBar.textColor
          }" opacity="0.5">MENU</text>`
        );

        for (const btn of menuButtons) {
          const isActive = !!btn.isActive;
          const showIcon = btn.showIcon !== undefined ? btn.showIcon : globalShowIcons;
          const iconPath = getNavIconPath(btn.icon);

          if (isActive) {
            parts.push(
              `  <rect x="14" y="${btnY}" width="${btnW}" height="${btnH}" rx="8" fill="${navBar.accentColor}" />`
            );
          }

          const textColor = isActive ? '#FFFFFF' : navBar.textColor;
          const iconColor = isActive ? '#FFFFFF' : navBar.textColor;
          const textOpacity = isActive ? '1' : '0.85';

          if (showIcon) {
            parts.push(
              `  <g transform="translate(24, ${btnY + 9}) scale(0.83)" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${textOpacity}">`,
              `    <path d="${iconPath}" />`,
              `  </g>`,
              `  <text x="52" y="${btnY + 24}" font-size="12" font-weight="${
                isActive ? '700' : '600'
              }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
            );
          } else {
            parts.push(
              `  <text x="24" y="${btnY + 24}" font-size="12" font-weight="${
                isActive ? '700' : '600'
              }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
            );
          }

          btnY += btnH + 6;
        }
      }

      // Section 2: GENERAL
      if (generalButtons.length > 0) {
        btnY += 12;
        parts.push(
          `  <line x1="16" y1="${btnY - 8}" x2="${navBar.size - 16}" y2="${btnY - 8}" stroke="${
            navBar.textColor
          }" opacity="0.15" stroke-width="1" />`,
          `  <text x="18" y="${btnY + 4}" font-size="9" font-weight="800" letter-spacing="1" fill="${
            navBar.textColor
          }" opacity="0.5">GENERAL</text>`
        );
        btnY += 14;

        for (const btn of generalButtons) {
          const isActive = !!btn.isActive;
          const showIcon = btn.showIcon !== undefined ? btn.showIcon : globalShowIcons;
          const iconPath = getNavIconPath(btn.icon);

          if (isActive) {
            parts.push(
              `  <rect x="14" y="${btnY}" width="${btnW}" height="${btnH}" rx="8" fill="${navBar.accentColor}" />`
            );
          }

          const textColor = isActive ? '#FFFFFF' : navBar.textColor;
          const iconColor = isActive ? '#FFFFFF' : navBar.textColor;
          const textOpacity = isActive ? '1' : '0.85';

          if (showIcon) {
            parts.push(
              `  <g transform="translate(24, ${btnY + 9}) scale(0.83)" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${textOpacity}">`,
              `    <path d="${iconPath}" />`,
              `  </g>`,
              `  <text x="52" y="${btnY + 24}" font-size="12" font-weight="${
                isActive ? '700' : '600'
              }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
            );
          } else {
            parts.push(
              `  <text x="24" y="${btnY + 24}" font-size="12" font-weight="${
                isActive ? '700' : '600'
              }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
            );
          }

          btnY += btnH + 6;
        }
      }
    } else {
      // Top Header Background
      parts.push(
        `  <rect x="0" y="0" width="${width}" height="${navBar.size}" fill="${navBar.backgroundColor}" />`,
        `  <line x1="0" y1="${navBar.size}" x2="${width}" y2="${navBar.size}" stroke="#1E293B" stroke-width="2" />`
      );

      // Logo & Title
      let titleX = 24;
      const centerY = Math.round(navBar.size / 2);

      if (navBar.logoUrl) {
        const logoH = Math.min(36, navBar.size - 20);
        parts.push(
          `  <image x="20" y="${centerY - logoH / 2}" width="${logoH}" height="${logoH}" href="${escapeXml(
            navBar.logoUrl
          )}" preserveAspectRatio="xMidYMid meet" />`
        );
        titleX = 20 + logoH + 12;
      }

      const reportTitleSizeTop = navBar.reportTitleSize || 15;

      if (navBar.reportTitle) {
        parts.push(
          `  <text x="${titleX}" y="${centerY + 5}" font-size="${reportTitleSizeTop}" font-weight="800" fill="${
            navBar.textColor
          }">${escapeXml(navBar.reportTitle)}</text>`
        );
      }

      // Buttons horizontally placed on the right
      const btnH = 34;
      const btnW = 115;
      const btnGap = 8;
      const totalBtnsCount = navBar.buttons.length;
      const hasGeneral = generalButtons.length > 0;
      const totalWidthNeeded = totalBtnsCount * (btnW + btnGap) + (hasGeneral ? 16 : 0);
      let btnX = width - totalWidthNeeded - 24;
      const btnY = centerY - btnH / 2;
      const globalShowIcons = navBar.showButtonIcons !== false;

      // Menu Buttons
      for (const btn of menuButtons) {
        const isActive = !!btn.isActive;
        const showIcon = btn.showIcon !== undefined ? btn.showIcon : globalShowIcons;
        const iconPath = getNavIconPath(btn.icon);

        if (isActive) {
          parts.push(
            `  <rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="7" fill="${navBar.accentColor}" />`
          );
        }

        const textColor = isActive ? '#FFFFFF' : navBar.textColor;
        const iconColor = isActive ? '#FFFFFF' : navBar.textColor;
        const textOpacity = isActive ? '1' : '0.85';

        if (showIcon) {
          parts.push(
            `  <g transform="translate(${btnX + 10}, ${btnY + 8}) scale(0.75)" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${textOpacity}">`,
            `    <path d="${iconPath}" />`,
            `  </g>`,
            `  <text x="${btnX + 34}" y="${btnY + 22}" font-size="11.5" font-weight="${
              isActive ? '700' : '600'
            }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
          );
        } else {
          parts.push(
            `  <text x="${Math.round(btnX + btnW / 2)}" y="${btnY + 22}" font-size="11.5" font-weight="${
              isActive ? '700' : '600'
            }" text-anchor="middle" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
          );
        }

        btnX += btnW + btnGap;
      }

      // General Buttons
      if (hasGeneral) {
        parts.push(
          `  <line x1="${btnX}" y1="${centerY - 12}" x2="${btnX}" y2="${centerY + 12}" stroke="${
            navBar.textColor
          }" opacity="0.3" stroke-width="1.5" />`
        );
        btnX += 14;

        for (const btn of generalButtons) {
          const isActive = !!btn.isActive;
          const showIcon = btn.showIcon !== undefined ? btn.showIcon : globalShowIcons;
          const iconPath = getNavIconPath(btn.icon);

          if (isActive) {
            parts.push(
              `  <rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="7" fill="${navBar.accentColor}" />`
            );
          }

          const textColor = isActive ? '#FFFFFF' : navBar.textColor;
          const iconColor = isActive ? '#FFFFFF' : navBar.textColor;
          const textOpacity = isActive ? '1' : '0.85';

          if (showIcon) {
            parts.push(
              `  <g transform="translate(${btnX + 10}, ${btnY + 8}) scale(0.75)" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${textOpacity}">`,
              `    <path d="${iconPath}" />`,
              `  </g>`,
              `  <text x="${btnX + 34}" y="${btnY + 22}" font-size="11.5" font-weight="${
                isActive ? '700' : '600'
              }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
            );
          } else {
            parts.push(
              `  <text x="${Math.round(btnX + btnW / 2)}" y="${btnY + 22}" font-size="11.5" font-weight="${
                isActive ? '700' : '600'
              }" text-anchor="middle" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
            );
          }

          btnX += btnW + btnGap;
        }
      }
    }
  }

  // 4. Page Header Titles (Rendered on top layer above visual slots and navigation)
  if (pageTitles && pageTitles.length > 0) {
    parts.push(`  <!-- Page Titles -->`);

    // Determine usable bounds taking nav bar into account
    let usableX = 0;
    let usableY = 0;
    if (navBar.show) {
      if (navBar.orientation === 'left') {
        usableX = navBar.size;
      } else {
        usableY = navBar.size;
      }
    }

    const isHighRes = width >= 1920;
    const padding = isHighRes ? 28 : 20;

    for (const pt of pageTitles) {
      const hasTitle = pt.title && pt.title.trim().length > 0;
      const hasSubtitle = pt.subtitle && pt.subtitle.trim().length > 0;
      if (!hasTitle && !hasSubtitle) continue;

      let titleX = width - padding;
      let titleY = usableY + padding + (isHighRes ? 22 : 18);
      let anchor = 'end';

      if (pt.position === 'top-left') {
        titleX = usableX + padding;
        titleY = usableY + padding + (isHighRes ? 22 : 18);
        anchor = 'start';
      } else if (pt.position === 'top-right') {
        titleX = width - padding;
        titleY = usableY + padding + (isHighRes ? 22 : 18);
        anchor = 'end';
      } else if (pt.position === 'bottom-left') {
        titleX = usableX + padding;
        titleY = height - padding - (isHighRes ? 26 : 22);
        anchor = 'start';
      } else if (pt.position === 'bottom-right') {
        titleX = width - padding;
        titleY = height - padding - (isHighRes ? 26 : 22);
        anchor = 'end';
      }

      const pTitleSize = pt.titleSize || (isHighRes ? 20 : 16);
      const pTitleColor = pt.titleColor || defaultTitleColor;
      const pSubtitleSize = pt.subtitleSize || (isHighRes ? 12 : 11);
      const pSubtitleColor = pt.subtitleColor || defaultSubtitleColor;

      if (hasTitle) {
        parts.push(
          `  <text x="${Math.round(titleX)}" y="${Math.round(
            titleY
          )}" font-size="${pTitleSize}" font-weight="800" text-anchor="${anchor}" fill="${pTitleColor}">${escapeXml(
            pt.title
          )}</text>`
        );
      }

      if (hasSubtitle) {
        const subY = hasTitle ? titleY + pSubtitleSize + 4 : titleY;
        parts.push(
          `  <text x="${Math.round(titleX)}" y="${Math.round(
            subY
          )}" font-size="${pSubtitleSize}" font-weight="500" text-anchor="${anchor}" fill="${pSubtitleColor}">${escapeXml(
            pt.subtitle
          )}</text>`
        );
      }
    }
  }

  parts.push(`</svg>`);

  return parts.join('\n');
}

/**
 * Downloads generated SVG as a file in the browser
 */
export function downloadDashSvg(state: DashCanvasState, filename?: string): void {
  const svg = generateDashSvg(state, false);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanName = filename
    ? filename.endsWith('.svg')
      ? filename
      : `${filename}.svg`
    : `powerbi-canvas-${state.dimensions.width}x${state.dimensions.height}.svg`;

  const link = document.createElement('a');
  link.href = url;
  link.download = cleanName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

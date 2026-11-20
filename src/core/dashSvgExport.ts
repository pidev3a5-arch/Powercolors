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
export function generateDashSvg(state: DashCanvasState): string {
  const { width, height } = state.dimensions;
  const { navBar, containerStyle, containers } = state;

  const parts: string[] = [];

  // SVG Root with XML namespace and dimensions
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`
  );

  // Embedded Typography and CSS Styles
  parts.push(`  <defs>
    <style>
      text {
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif;
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
    const strokeW = containerStyle.borderWidth;
    const strokeColor = containerStyle.borderColor;
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

    if (hasTitle || hasSubtitle) {
      let textY = Math.round(c.y + 24);

      if (hasTitle) {
        parts.push(
          `  <text x="${Math.round(c.x + 16)}" y="${textY}" font-size="13" font-weight="700" fill="#1E293B">${escapeXml(
            c.title
          )}</text>`
        );
        textY += 16;
      }

      if (hasSubtitle) {
        parts.push(
          `  <text x="${Math.round(c.x + 16)}" y="${textY}" font-size="10.5" font-weight="500" fill="#64748B">${escapeXml(
            c.subtitle
          )}</text>`
        );
        textY += 10;
      }

      // Subtle Divider
      const dividerY = textY + 6;
      if (dividerY < c.y + c.height) {
        parts.push(
          `  <line x1="${Math.round(c.x)}" y1="${Math.round(dividerY)}" x2="${Math.round(
            c.x + c.width
          )}" y2="${Math.round(dividerY)}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 2" />`
        );
      }
    }
  }

  // 3. Navigation Ribbon (if enabled)
  if (navBar.show) {
    parts.push(`  <!-- Navigation Bar (${navBar.orientation}) -->`);

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

      if (navBar.reportTitle) {
        parts.push(
          `  <text x="${titleX}" y="${titleY}" font-size="14" font-weight="800" fill="${
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

      // Navigation Buttons
      let btnY = 88;
      const btnH = 38;
      const btnW = navBar.size - 28;

      for (const btn of navBar.buttons) {
        const isActive = !!btn.isActive;
        const iconPath = getNavIconPath(btn.icon);

        if (isActive) {
          parts.push(
            `  <rect x="14" y="${btnY}" width="${btnW}" height="${btnH}" rx="8" fill="${navBar.accentColor}" />`
          );
        }

        const textColor = isActive ? '#FFFFFF' : navBar.textColor;
        const iconColor = isActive ? '#FFFFFF' : navBar.textColor;
        const textOpacity = isActive ? '1' : '0.85';

        // Render Vector Icon
        parts.push(
          `  <g transform="translate(24, ${btnY + 9}) scale(0.83)" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${textOpacity}">`,
          `    <path d="${iconPath}" />`,
          `  </g>`
        );

        // Render Button Label
        parts.push(
          `  <text x="52" y="${btnY + 24}" font-size="12" font-weight="${
            isActive ? '700' : '600'
          }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
        );

        btnY += btnH + 8;
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

      if (navBar.reportTitle) {
        parts.push(
          `  <text x="${titleX}" y="${centerY + 5}" font-size="15" font-weight="800" fill="${
            navBar.textColor
          }">${escapeXml(navBar.reportTitle)}</text>`
        );
      }

      // Navigation Buttons horizontally placed on the right
      const btnH = 34;
      const btnW = 120;
      const btnGap = 8;
      const totalBtnsW = navBar.buttons.length * (btnW + btnGap);
      let btnX = width - totalBtnsW - 24;
      const btnY = centerY - btnH / 2;

      for (const btn of navBar.buttons) {
        const isActive = !!btn.isActive;
        const iconPath = getNavIconPath(btn.icon);

        if (isActive) {
          parts.push(
            `  <rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="7" fill="${navBar.accentColor}" />`
          );
        }

        const textColor = isActive ? '#FFFFFF' : navBar.textColor;
        const iconColor = isActive ? '#FFFFFF' : navBar.textColor;
        const textOpacity = isActive ? '1' : '0.85';

        // Render Vector Icon
        parts.push(
          `  <g transform="translate(${btnX + 10}, ${btnY + 8}) scale(0.75)" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${textOpacity}">`,
          `    <path d="${iconPath}" />`,
          `  </g>`
        );

        // Render Button Label
        parts.push(
          `  <text x="${btnX + 34}" y="${btnY + 22}" font-size="11.5" font-weight="${
            isActive ? '700' : '600'
          }" fill="${textColor}" opacity="${textOpacity}">${escapeXml(btn.label)}</text>`
        );

        btnX += btnW + btnGap;
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
  const svg = generateDashSvg(state);
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

import { DashCanvasState, VisualContainerConfig } from './dashTypes';
import { LayoutPresetDefinition } from './layoutPresets';
import { snapToGrid } from './layoutTypes';

/**
 * Adapts a layout preset to fit seamlessly into any canvas configuration,
 * respecting the navigation ribbon (left/top), header titles, and canvas resolution.
 */
export function adaptLayoutPresetToCanvas(
  preset: LayoutPresetDefinition,
  state: DashCanvasState
): VisualContainerConfig[] {
  const targetW = state.dimensions.width;
  const targetH = state.dimensions.height;

  // 1. Calculate usable bounds after navigation bar
  let usableX = 0;
  let usableY = 0;
  let usableWidth = targetW;
  let usableHeight = targetH;

  if (state.navBar.show) {
    if (state.navBar.orientation === 'left') {
      usableX = state.navBar.size;
      usableWidth = targetW - state.navBar.size;
    } else if (state.navBar.orientation === 'top') {
      usableY = state.navBar.size;
      usableHeight = targetH - state.navBar.size;
    }
  }

  // 2. Margin & gap scaling based on resolution
  const isHighRes = targetW >= 1920;
  const padding = isHighRes ? 28 : 20;

  // 3. Detect if wallpaper already has active page header title(s)
  const hasTopTitle =
    state.pageTitles &&
    state.pageTitles.some(
      (pt) =>
        (pt.position === 'top-right' || pt.position === 'top-left') &&
        ((pt.title && pt.title.trim().length > 0) || (pt.subtitle && pt.subtitle.trim().length > 0))
    );

  const hasBottomTitle =
    state.pageTitles &&
    state.pageTitles.some(
      (pt) =>
        (pt.position === 'bottom-right' || pt.position === 'bottom-left') &&
        ((pt.title && pt.title.trim().length > 0) || (pt.subtitle && pt.subtitle.trim().length > 0))
    );

  const topHeaderH = hasTopTitle ? (isHighRes ? 72 : 56) : 0;
  const bottomHeaderH = hasBottomTitle ? (isHighRes ? 44 : 36) : 0;

  const contentX = usableX + padding;
  const contentY = usableY + padding + topHeaderH;
  const contentW = Math.max(200, usableWidth - 2 * padding);
  const contentH = Math.max(200, usableHeight - 2 * padding - topHeaderH - bottomHeaderH);

  // 4. If wallpaper already has a top page title, omit redundant "Header/Title" text box cards
  let sourceVisuals = preset.visuals;
  if (hasTopTitle) {
    const nonHeaderVisuals = sourceVisuals.filter(
      (v) =>
        !(
          v.type === 'shape-text' &&
          (v.name.toLowerCase().includes('header') || v.name.toLowerCase().includes('title'))
        )
    );
    if (nonHeaderVisuals.length > 0) {
      sourceVisuals = nonHeaderVisuals;
    }
  }

  // 5. Compute original bounding box of preset visuals
  const minX = Math.min(...sourceVisuals.map((v) => v.x));
  const minY = Math.min(...sourceVisuals.map((v) => v.y));
  const maxX = Math.max(...sourceVisuals.map((v) => v.x + v.width));
  const maxY = Math.max(...sourceVisuals.map((v) => v.y + v.height));
  const origW = Math.max(1, maxX - minX);
  const origH = Math.max(1, maxY - minY);

  // 6. Scale and translate into the usable content area with 8px grid snapping
  return sourceVisuals.map((v, i) => {
    const relX = (v.x - minX) / origW;
    const relY = (v.y - minY) / origH;
    const relW = v.width / origW;
    const relH = v.height / origH;

    const rawX = contentX + relX * contentW;
    const rawY = contentY + relY * contentH;
    const rawW = relW * contentW;
    const rawH = relH * contentH;

    const isKpi = v.type === 'kpi' || v.type === 'card' || v.type === 'gauge';

    return {
      id: `slot-preset-${Date.now().toString(36)}-${i + 1}`,
      title: v.name,
      subtitle: '',
      showTitle: true,
      showSubtitle: false,
      x: snapToGrid(rawX, 8, true),
      y: snapToGrid(rawY, 8, true),
      width: Math.max(100, snapToGrid(rawW, 8, true)),
      height: Math.max(60, snapToGrid(rawH, 8, true)),
      visualType: v.type,
      zIndex: v.zIndex || i + 1,
      color: v.color || '#8B5CF6',
      showKpiIcon: isKpi,
      kpiIconType: v.type === 'kpi' ? 'trending-up' : v.type === 'gauge' ? 'activity' : 'dollar',
      kpiIconPosition: 'top-right',
    };
  });
}

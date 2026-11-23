import { describe, it, expect } from 'vitest';
import {
  buildPbipPackage,
  mapToPbirVisualType,
  sanitizeName,
  exportPbipZipBlob,
} from '../core/pbip/pbipEngine';
import { PbipConfig } from '../core/pbip/types';

describe('Fabric PBIP Core Engine & Scaffolder', () => {
  it('correctly maps friendly visual types to PBIR visual types', () => {
    expect(mapToPbirVisualType('card')).toBe('card');
    expect(mapToPbirVisualType('kpi')).toBe('kpi');
    expect(mapToPbirVisualType('matrix')).toBe('pivotTable');
    expect(mapToPbirVisualType('table')).toBe('tableEx');
    expect(mapToPbirVisualType('bar-chart')).toBe('barChart');
    expect(mapToPbirVisualType('deneb')).toBe('deneb7E15AEF80B9E4D4F8E12924291ECE89A');
  });

  it('sanitizes project, page, and visual names', () => {
    expect(sanitizeName('My Report 2026!')).toBe('My_Report_2026_');
    expect(sanitizeName('Sales/Profit & Loss')).toBe('Sales_Profit_Loss');
  });

  it('scaffolds complete, compliant PBIP project structure', () => {
    const config: PbipConfig = {
      projectName: 'ExecutiveDashboard',
      reportName: 'Executive Sales & Operations',
      pageName: 'OverviewPage',
      pageDisplayName: 'Executive Summary',
      connectionType: 'byConnection',
      canvasWidth: 1920,
      canvasHeight: 1080,
      themeName: 'PowerLab_Theme',
      themeJson: {
        name: 'PowerLab_Theme',
        dataColors: ['#8B5CF6', '#FBBF24', '#34D399'],
      },
      wallpaperSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"></svg>',
      visuals: [
        {
          id: 'v_header',
          name: 'Summary Title',
          type: 'shape-text',
          x: 24,
          y: 24,
          width: 500,
          height: 60,
          zIndex: 1,
        },
        {
          id: 'v_kpi',
          name: 'Total Revenue',
          type: 'kpi',
          x: 24,
          y: 100,
          width: 300,
          height: 120,
          zIndex: 2,
        },
        {
          id: 'v_matrix',
          name: 'Channel Breakdown',
          type: 'matrix',
          x: 24,
          y: 240,
          width: 1872,
          height: 800,
          zIndex: 3,
        },
      ],
    };

    const pkg = buildPbipPackage(config);

    expect(pkg.projectName).toBe('ExecutiveDashboard');
    expect(pkg.totalFiles).toBeGreaterThanOrEqual(10);

    const paths = pkg.files.map((f) => f.path);

    // Root items
    expect(paths).toContain('ExecutiveDashboard.pbip');
    expect(paths).toContain('.gitignore');

    // Report items
    expect(paths).toContain('ExecutiveDashboard.Report/.platform');
    expect(paths).toContain('ExecutiveDashboard.Report/definition.pbir');
    expect(paths).toContain('ExecutiveDashboard.Report/definition/version.json');
    expect(paths).toContain('ExecutiveDashboard.Report/definition/report.json');
    expect(paths).toContain('ExecutiveDashboard.Report/definition/pages/pages.json');
    expect(paths).toContain('ExecutiveDashboard.Report/definition/pages/OverviewPage/page.json');

    // Visual items
    expect(paths).toContain('ExecutiveDashboard.Report/definition/pages/OverviewPage/visuals/v_header/visual.json');
    expect(paths).toContain('ExecutiveDashboard.Report/definition/pages/OverviewPage/visuals/v_kpi/visual.json');
    expect(paths).toContain('ExecutiveDashboard.Report/definition/pages/OverviewPage/visuals/v_matrix/visual.json');

    // Resources
    expect(paths).toContain('ExecutiveDashboard.Report/StaticResources/RegisteredResources/PowerLab_Theme.json');
    expect(paths).toContain('ExecutiveDashboard.Report/StaticResources/RegisteredResources/wallpaper.svg');

    // Validate page.json contents
    const pageFile = pkg.files.find((f) => f.path.endsWith('OverviewPage/page.json'))!;
    const pageObj = JSON.parse(pageFile.content);
    expect(pageObj.width).toBe(1920);
    expect(pageObj.height).toBe(1080);
    expect(pageObj.displayName).toBe('Executive Summary');

    // Validate matrix visual.json contents
    const matrixFile = pkg.files.find((f) => f.path.endsWith('v_matrix/visual.json'))!;
    const matrixObj = JSON.parse(matrixFile.content);
    expect(matrixObj.position.x).toBe(24);
    expect(matrixObj.position.width).toBe(1872);
    expect(matrixObj.visual.visualType).toBe('pivotTable');

    // Validate hierarchical tree
    expect(pkg.fileTree.length).toBeGreaterThan(0);
    const reportDir = pkg.fileTree.find((n) => n.name === 'ExecutiveDashboard.Report');
    expect(reportDir).toBeDefined();
    expect(reportDir?.type).toBe('folder');
  });

  it('generates a valid, non-empty ZIP blob', async () => {
    const config: PbipConfig = {
      projectName: 'TestZipProject',
      reportName: 'Test Report',
      pageName: 'Page1',
      pageDisplayName: 'Page 1',
      connectionType: 'byPath',
      canvasWidth: 1280,
      canvasHeight: 720,
      visuals: [
        { id: 'v1', name: 'Card 1', type: 'card', x: 20, y: 20, width: 200, height: 100 },
      ],
    };

    const pkg = buildPbipPackage(config);
    const blob = await exportPbipZipBlob(pkg);

    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(500);
    expect(blob.type).toBe('application/zip');
  });
});

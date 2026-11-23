import JSZip from 'jszip';
import {
  PbipConfig,
  PbipPackage,
  PbipFileItem,
  PbipTreeNode,
} from './types';

/**
 * Standard Power BI PBIR Visual Type Map
 */
export function mapToPbirVisualType(type: string): string {
  switch (type.toLowerCase()) {
    case 'kpi':
      return 'kpi';
    case 'card':
      return 'card';
    case 'bar-chart':
    case 'barchart':
      return 'barChart';
    case 'column-chart':
    case 'columnchart':
      return 'columnChart';
    case 'line-chart':
    case 'linechart':
      return 'lineChart';
    case 'area-chart':
    case 'areachart':
      return 'areaChart';
    case 'donut-chart':
    case 'donutchart':
      return 'donutChart';
    case 'pie-chart':
    case 'piechart':
      return 'pieChart';
    case 'table':
      return 'tableEx';
    case 'matrix':
      return 'pivotTable';
    case 'slicer':
      return 'slicer';
    case 'gauge':
      return 'gauge';
    case 'waterfall':
      return 'waterfallChart';
    case 'funnel':
      return 'funnel';
    case 'scatter':
      return 'scatterChart';
    case 'treemap':
      return 'treemap';
    case 'map':
      return 'map';
    case 'shape-text':
      return 'shape';
    case 'deneb':
      return 'deneb7E15AEF80B9E4D4F8E12924291ECE89A';
    default:
      return type;
  }
}

/**
 * Sanitize strings for valid folder and file names
 */
export function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
}

/**
 * Scaffolds an official, compliant Microsoft Fabric & Power BI Project (.pbip)
 */
export function buildPbipPackage(config: PbipConfig): PbipPackage {
  const safeProject = sanitizeName(config.projectName) || 'PowerLab_Report';
  const safePage = sanitizeName(config.pageName) || 'ReportPage_1';
  const reportFolder = `${safeProject}.Report`;
  const files: PbipFileItem[] = [];

  // 1. Root .pbip entry file
  const pbipRootJson = {
    version: '1.0',
    artifacts: [
      {
        report: {
          path: reportFolder,
        },
      },
    ],
  };
  files.push({
    path: `${safeProject}.pbip`,
    content: JSON.stringify(pbipRootJson, null, 2),
  });

  // 2. Recommended .gitignore
  files.push({
    path: '.gitignore',
    content: `# Power BI Project (.pbip) ignore list\n.pbi/localSettings.json\n.pbi/cache.abf\n*.tmp\n`,
  });

  // 3. Fabric platform identity metadata
  const platformJson = {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json',
    metadata: {
      type: 'Report',
      displayName: config.reportName || safeProject,
    },
    config: {
      version: '2.0',
      logicalId: '00000000-0000-0000-0000-000000000000',
    },
  };
  files.push({
    path: `${reportFolder}/.platform`,
    content: JSON.stringify(platformJson, null, 2),
  });

  // 4. definition.pbir (Semantic Model Binding)
  const isByPath = config.connectionType === 'byPath';
  const pbirJson = {
    version: '4.0',
    datasetReference: {
      byPath: isByPath
        ? { path: `../${config.modelPath || `${safeProject}.SemanticModel`}` }
        : null,
      byConnection: !isByPath
        ? {
            connectionString: null,
            pbiService: {
              connectionType: 'pbiServiceXmlaStyleLive',
            },
          }
        : null,
    },
  };
  files.push({
    path: `${reportFolder}/definition.pbir`,
    content: JSON.stringify(pbirJson, null, 2),
  });

  // 5. definition/version.json
  files.push({
    path: `${reportFolder}/definition/version.json`,
    content: JSON.stringify({ version: '2.0.0' }, null, 2),
  });

  // 6. definition/report.json
  const reportJson: any = {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/1.0.0/schema.json',
    themeCollection: {
      baseTheme: {
        name: 'CY24SU10',
        version: '5.60',
        type: 'SharedResources',
      },
    },
    activePageIndex: 0,
    language: 'en-US',
  };

  const safeThemeName = config.themeName ? sanitizeName(config.themeName) : null;
  if (safeThemeName && config.themeJson) {
    reportJson.themeCollection.customTheme = {
      name: safeThemeName,
      reportVersionAtImport: '5.60',
      type: 'RegisteredResources',
    };
  }
  files.push({
    path: `${reportFolder}/definition/report.json`,
    content: JSON.stringify(reportJson, null, 2),
  });

  // 7. definition/pages/pages.json
  files.push({
    path: `${reportFolder}/definition/pages/pages.json`,
    content: JSON.stringify([safePage], null, 2),
  });

  // 8. definition/pages/[PageName]/page.json
  const pageJson: any = {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/1.0.0/schema.json',
    name: safePage,
    displayName: config.pageDisplayName || 'Executive Overview',
    displayOption: 'FitToPage',
    width: config.canvasWidth || 1280,
    height: config.canvasHeight || 720,
  };
  files.push({
    path: `${reportFolder}/definition/pages/${safePage}/page.json`,
    content: JSON.stringify(pageJson, null, 2),
  });

  // 9. definition/pages/[PageName]/visuals/[VisualName]/visual.json for each visual
  const visualsList = config.visuals && config.visuals.length > 0
    ? config.visuals
    : [
        {
          id: 'v1',
          name: 'Executive Overview Banner',
          type: 'card',
          x: 24,
          y: 24,
          width: 1232,
          height: 120,
          zIndex: 1,
        },
      ];

  visualsList.forEach((vis, idx) => {
    const safeVisId = sanitizeName(vis.id) || `visual_${idx + 1}`;
    const pbirType = mapToPbirVisualType(vis.type);

    const visualConfig: any = {
      $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/1.1.0/schema.json',
      name: safeVisId,
      position: {
        x: Math.round(vis.x),
        y: Math.round(vis.y),
        width: Math.round(vis.width),
        height: Math.round(vis.height),
        z: vis.zIndex || idx + 1,
      },
      visual: {
        visualType: pbirType,
        title: [
          {
            properties: {
              text: {
                expr: {
                  Literal: {
                    Value: `'${vis.name || `Visual ${idx + 1}`}'`,
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
    };

    // If visual is Deneb, embed custom visual settings
    if (pbirType === 'deneb7E15AEF80B9E4D4F8E12924291ECE89A' && vis.denebSpec) {
      visualConfig.visual.objects = {
        developer: [
          {
            properties: {
              spec: {
                expr: {
                  Literal: {
                    Value: `'${JSON.stringify(vis.denebSpec).replace(/'/g, "''")}'`,
                  },
                },
              },
            },
          },
        ],
      };
    }

    files.push({
      path: `${reportFolder}/definition/pages/${safePage}/visuals/${safeVisId}/visual.json`,
      content: JSON.stringify(visualConfig, null, 2),
    });
  });

  // 10. Registered Custom Theme JSON
  if (safeThemeName && config.themeJson) {
    files.push({
      path: `${reportFolder}/StaticResources/RegisteredResources/${safeThemeName}.json`,
      content: typeof config.themeJson === 'string'
        ? config.themeJson
        : JSON.stringify(config.themeJson, null, 2),
    });
  }

  // 11. Optional Canvas Wallpaper SVG (StaticResources)
  if (config.wallpaperSvg && config.wallpaperSvg.trim().length > 0) {
    files.push({
      path: `${reportFolder}/StaticResources/RegisteredResources/wallpaper.svg`,
      content: config.wallpaperSvg,
    });
  }

  // Build tree representation
  const fileTree = buildPbipTree(files);

  return {
    projectName: safeProject,
    files,
    fileTree,
    totalFiles: files.length,
  };
}

/**
 * Builds a hierarchical tree from flat file paths for interactive tree viewers
 */
export function buildPbipTree(files: PbipFileItem[]): PbipTreeNode[] {
  const rootNodes: Record<string, PbipTreeNode> = {};

  files.forEach((file) => {
    const parts = file.path.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const previousPath = currentPath;
      currentPath = previousPath ? `${previousPath}/${part}` : part;

      if (!rootNodes[currentPath]) {
        rootNodes[currentPath] = {
          id: currentPath,
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          size: isFile ? file.content.length : undefined,
          children: isFile ? undefined : [],
        };

        if (previousPath && rootNodes[previousPath] && rootNodes[previousPath].children) {
          rootNodes[previousPath].children!.push(rootNodes[currentPath]);
        }
      }
    });
  });

  // Return only top-level roots
  return Object.values(rootNodes).filter((n) => !n.path.includes('/'));
}

/**
 * Compresses the entire PBIP folder structure into a standard downloadable .zip file
 */
export async function exportPbipZipBlob(pkg: PbipPackage): Promise<Blob> {
  const zip = new JSZip();

  pkg.files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Triggers a browser download of the PBIP project zip
 */
export function downloadPbipZip(blob: Blob, projectName: string): void {
  const cleanName = sanitizeName(projectName) || 'PowerLab_Report';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanName}.pbip.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

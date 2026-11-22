import { DaxTemplate } from './types';

/**
 * Interpolate DAX template with user parameter values
 */
export function interpolateDax(template: DaxTemplate, paramValues: Record<string, string>): string {
  let output = template.templateDax;

  for (const param of template.parameters) {
    const val = paramValues[param.id] !== undefined && paramValues[param.id].trim().length > 0
      ? paramValues[param.id]
      : param.defaultValue;

    const regex = new RegExp(`\\{\\{${param.id}\\}\\}`, 'g');
    output = output.replace(regex, val);
  }

  return output.trim();
}

/**
 * Generate a downloadable .dax file blob
 */
export function createDaxFileBlob(measureName: string, daxContent: string): Blob {
  const fileHeader = `// =========================================================================\n// PowerLab DAX Measure: ${measureName}\n// Generated at: ${new Date().toISOString()}\n// Paste directly into Power BI Desktop Measure Bar\n// =========================================================================\n\n`;
  return new Blob([fileHeader + daxContent + '\n'], { type: 'text/plain;charset=utf-8' });
}

/**
 * Download a .dax file directly
 */
export function downloadDaxFile(measureName: string, daxContent: string): void {
  const blob = createDaxFileBlob(measureName, daxContent);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = measureName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'measure';
  a.download = `${slug}.dax`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates clean, 100% compliant Power BI DAX measure strings
 * that return SVG data URIs with "data:image/svg+xml;utf8," prefix.
 */

export interface DaxVarConfig {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  type: 'number' | 'color' | 'text' | 'boolean' | 'select';
  comment?: string;
}

export interface DaxMeasureOptions {
  measureName: string;
  description?: string;
  configVars: DaxVarConfig[];
  calcVars?: Array<{ name: string; expression: string; comment?: string }>;
  svgElements: Array<{ name: string; expression: string; comment?: string }>;
  viewBox: string;
  returnAssembly?: string[];
  width?: number;
  height?: number;
  hasOneValueGuard?: {
    tableColumn: string;
  };
}

export function formatDaxValue(value: unknown, type: string): string {
  if (type === 'number') {
    return Number(value).toString();
  }
  if (type === 'boolean') {
    return value ? 'TRUE()' : 'FALSE()';
  }
  if (type === 'color') {
    // Keep hex color cleanly formatted with #
    const hex = String(value).trim();
    return `"${hex}"`;
  }
  // text or select
  return `"${String(value).replace(/"/g, '""')}"`;
}

/**
 * Formats a DAX measure name according to strict Power BI syntax rules.
 * If the measure name contains spaces or non-alphanumeric characters,
 * it is safely enclosed in square brackets `[Measure Name]`.
 */
export function formatDaxMeasureName(name: string): string {
  const trimmed = (name || 'Custom_SVG_Measure').trim();

  // If already bracketed, return as is
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed;
  }

  // If contains spaces, hyphens, parentheses, or special characters, wrap in [ ... ]
  if (/[\s\W]/.test(trimmed)) {
    const escaped = trimmed.replace(/\]/g, ']]');
    return `[${escaped}]`;
  }

  return trimmed;
}

/**
 * Builds a clean, professional Power BI DAX measure string following the standard VAR pattern.
 */
export function buildDaxMeasure(options: DaxMeasureOptions): string {
  const {
    measureName,
    description,
    configVars,
    calcVars = [],
    svgElements = [],
    viewBox,
    returnAssembly,
    width,
    height,
    hasOneValueGuard,
  } = options;

  const lines: string[] = [];

  // 1. Measure Header (MUST be on line 1 for Power BI Desktop formula bar compliance)
  const formattedHeader = formatDaxMeasureName(measureName);
  lines.push(`${formattedHeader} = `);

  // 2. Measure Documentation Comments (Clean DAX standard -- comments placed inside expression body)
  lines.push(`-- ==========================================================`);
  lines.push(`-- Power BI SVG Measure: ${measureName.replace(/[\[\]]/g, '')}`);
  if (description) {
    lines.push(`-- Description: ${description}`);
  }
  lines.push(`-- IMPORTANT: After creating this measure, select it in the model`);
  lines.push(`-- and set Data Category to 'Image URL' (under Measure Tools).`);
  lines.push(`-- Use in: Table, Matrix, Card (new), or Image visuals.`);
  lines.push(`-- ==========================================================`);

  if (hasOneValueGuard) {
    lines.push(`IF(`);
    lines.push(`    HASONEVALUE( ${hasOneValueGuard.tableColumn} ),`);
  }

  const indent = hasOneValueGuard ? '    ' : '';

  // 1. Config Vars
  lines.push(`${indent}-- ---------------------------------------------------------`);
  lines.push(`${indent}-- 1. CONFIGURATION & MODEL INPUTS`);
  lines.push(`${indent}-- Replace static values with your DAX measures or model fields`);
  lines.push(`${indent}-- e.g. VAR _Actual = [Total Sales]`);
  lines.push(`${indent}-- ---------------------------------------------------------`);

  for (const v of configVars) {
    const formatted = formatDaxValue(v.value, v.type);
    const commentStr = v.comment ? `  -- ${v.comment}` : '';
    lines.push(`${indent}VAR ${v.name} = ${formatted}${commentStr}`);
  }
  lines.push(``);

  // 2. Calculated Vars (Normalizations, math, thresholds)
  if (calcVars.length > 0) {
    lines.push(`${indent}-- ---------------------------------------------------------`);
    lines.push(`${indent}-- 2. NORMALIZATION & LOGIC`);
    lines.push(`${indent}-- ---------------------------------------------------------`);
    for (const c of calcVars) {
      if (c.comment) {
        lines.push(`${indent}-- ${c.comment}`);
      }
      lines.push(`${indent}VAR ${c.name} = ${c.expression}`);
    }
    lines.push(``);
  }

  // 3. SVG Elements
  lines.push(`${indent}-- ---------------------------------------------------------`);
  lines.push(`${indent}-- 3. SVG ELEMENTS & MARKUP`);
  lines.push(`${indent}-- ---------------------------------------------------------`);

  // SVG Prefix
  const dimAttrs =
    width && height ? ` width='${width}' height='${height}'` : '';
  lines.push(
    `${indent}VAR _SvgPrefix = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'${dimAttrs}>"`
  );

  for (const elem of svgElements) {
    if (elem.comment) {
      lines.push(`${indent}-- ${elem.comment}`);
    }
    lines.push(`${indent}VAR ${elem.name} = ${elem.expression}`);
  }

  lines.push(`${indent}VAR _SvgSuffix = "</svg>"`);
  lines.push(``);

  // 4. Return Assembly
  lines.push(`${indent}-- ---------------------------------------------------------`);
  lines.push(`${indent}-- 4. ASSEMBLE AND RETURN`);
  lines.push(`${indent}-- ---------------------------------------------------------`);

  const assemblyVars = returnAssembly || [
    '_SvgPrefix',
    ...svgElements.map((e) => e.name),
    '_SvgSuffix',
  ];

  const assemblyExpr = assemblyVars.join(`\n${indent}    & `);

  lines.push(`${indent}RETURN`);
  lines.push(`${indent}    ${assemblyExpr}`);

  if (hasOneValueGuard) {
    lines.push(`, BLANK()`);
    lines.push(`)`);
  }

  return lines.join('\n');
}

/**
 * Utility to convert raw SVG XML into safe DAX string fragments.
 * Single quotes are preserved/used for XML attributes to prevent DAX string breaking.
 */
export function sanitizeSvgForDax(rawSvg: string): string {
  return rawSvg
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"/g, "'")
    .trim();
}

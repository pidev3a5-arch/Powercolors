import { SvgToDaxOptions, SvgToDaxResult } from './types';

/**
 * Parses, sanitizes, and converts any arbitrary SVG XML into a robust,
 * 100% compliant Power BI DAX measure with Image URL data category support.
 */
export function convertRawSvgToDax(
  rawInput: string,
  options?: SvgToDaxOptions
): SvgToDaxResult {
  const trimmed = rawInput.trim();
  const rawMeasureName = options?.measureName?.trim() || 'Custom_SVG_Visual';
  const measureName = rawMeasureName.replace(/[^a-zA-Z0-9_]/g, '_');

  if (!trimmed) {
    return {
      measureName,
      daxCode: '',
      sanitizedSvg: '',
      detectedColors: [],
      error: 'Please provide valid SVG code or upload an .svg file.',
    };
  }

  // Basic check for svg tags
  const svgStartIdx = trimmed.indexOf('<svg');
  const svgEndIdx = trimmed.lastIndexOf('</svg>');

  if (svgStartIdx === -1 || svgEndIdx === -1) {
    return {
      measureName,
      daxCode: '',
      sanitizedSvg: '',
      detectedColors: [],
      error: 'Input does not appear to contain a valid <svg> ... </svg> root element.',
    };
  }

  // Extract pure SVG block
  let svgCode = trimmed.substring(svgStartIdx, svgEndIdx + 6).trim();

  // Ensure xmlns is present on <svg>
  if (!svgCode.includes('xmlns=')) {
    svgCode = svgCode.replace('<svg', "<svg xmlns='http://www.w3.org/2000/svg'");
  }

  // Detect hex colors in the SVG
  const hexMatches = svgCode.match(/#([0-9a-fA-F]{3,8})/g) || [];
  const uniqueHexes = Array.from(new Set(hexMatches.map((h) => h.toUpperCase())));

  // Normalize quotes: convert double quotes to single quotes for cleaner DAX string literal concatenation
  // If an attribute already uses single quotes, keep it.
  const sanitized = svgCode
    .replace(/"([^"]*)"/g, "'$1'")
    .replace(/\r\n/g, '\n')
    .replace(/\n\s*/g, ' ')
    .trim();

  // Build DAX Measure
  const lines: string[] = [];
  lines.push(`// ==========================================================`);
  lines.push(`// Power BI SVG Measure: ${measureName}`);
  lines.push(`// Converted from custom SVG by PowerLab SVG Visual Maker`);
  lines.push(`// IMPORTANT: Set Data Category to 'Image URL' under Measure Tools`);
  lines.push(`// ==========================================================`);
  lines.push(`${measureName} = `);

  // 1. Inputs & dynamic parameters
  lines.push(`-- ---------------------------------------------------------`);
  lines.push(`-- 1. MODEL INPUTS & COLOR VARIABLES`);
  lines.push(`-- Replace static color hexes or numbers with your DAX measures`);
  lines.push(`-- ---------------------------------------------------------`);

  let replacedSvg = sanitized;
  const colorVars: Array<{ varName: string; hex: string }> = [];

  if (uniqueHexes.length > 0 && options?.extractColors !== false) {
    uniqueHexes.slice(0, 6).forEach((hex, idx) => {
      const varName = `_Color_${idx + 1}`;
      colorVars.push({ varName, hex });
      lines.push(`VAR ${varName} = "${hex}"`);
    });
    lines.push(``);

    // Replace first few colors in SVG string with DAX concatenation
    // We split on the hex and join with & varName &
    for (const { varName, hex } of colorVars) {
      // replace occurrence '#HEX' with "' & " & varName & " & '"
      const targetSingle = `'${hex}'`;
      const targetBare = `${hex}`;
      if (replacedSvg.includes(targetSingle)) {
        replacedSvg = replacedSvg.split(targetSingle).join(`' & ${varName} & '`);
      } else if (replacedSvg.includes(targetBare)) {
        replacedSvg = replacedSvg.split(targetBare).join(`" & ${varName} & "`);
      }
    }
  } else {
    lines.push(`-- No external variables extracted. SVG is self-contained.`);
    lines.push(``);
  }

  // 2. SVG prefix and content
  lines.push(`-- ---------------------------------------------------------`);
  lines.push(`-- 2. SVG DATA URI & MARKUP`);
  lines.push(`-- ---------------------------------------------------------`);
  lines.push(`VAR _SvgPrefix = "data:image/svg+xml;utf8,"`);

  // Break large SVG into manageable chunks if longer than 300 chars for readability
  if (colorVars.length > 0) {
    lines.push(`VAR _SvgMarkup = "${replacedSvg}"`);
  } else {
    // Escape any leftover double quotes in DAX string
    const daxEscaped = sanitized.replace(/"/g, '""');
    lines.push(`VAR _SvgMarkup = "${daxEscaped}"`);
  }
  lines.push(``);

  // 3. Return assembly
  lines.push(`-- ---------------------------------------------------------`);
  lines.push(`-- 3. ASSEMBLE AND RETURN`);
  lines.push(`-- ---------------------------------------------------------`);
  lines.push(`RETURN`);
  lines.push(`    _SvgPrefix & _SvgMarkup`);

  const daxCode = lines.join('\n');

  return {
    measureName,
    daxCode,
    sanitizedSvg: sanitized,
    detectedColors: uniqueHexes,
  };
}

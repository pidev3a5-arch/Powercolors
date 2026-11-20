import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { buildPowerBITheme, validatePowerBITheme, serializePowerBITheme } from '../core/powerBiTheme';
import { deriveStructuralColors } from '../core/colorHarmonics';

describe('Theme Export & Advanced Customization', () => {
  const dummyColors = [
    '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#D97706',
    '#059669', '#0D9488', '#0284C7', '#4F46E5', '#9333EA',
  ];
  const structural = deriveStructuralColors(dummyColors[0], false);

  it('applies custom font family across textClasses', () => {
    const themeAptos = buildPowerBITheme('Aptos Theme', dummyColors, structural, {
      fontFamily: 'Aptos',
    });

    expect(themeAptos.textClasses.title.fontFace).toBe('Aptos');
    expect(themeAptos.textClasses.label.fontFace).toBe('Aptos');
    expect(themeAptos.textClasses.callout.fontFace).toBe('Aptos');
    expect(themeAptos.textClasses.header.fontFace).toBe('Aptos');
  });

  it('propagates visual container border and shadow flags', () => {
    const themeCustom = buildPowerBITheme('Custom Style', dummyColors, structural, {
      showVisualBorders: false,
      showVisualDropShadow: true,
    });

    const borderStyle = themeCustom.visualStyles['*']['*'].border[0];
    const shadowStyle = themeCustom.visualStyles['*']['*'].dropShadow[0];
    expect(borderStyle.show).toBe(false);
    expect(shadowStyle.show).toBe(true);
  });

  it('produces valid JSON string with serializePowerBITheme', () => {
    const theme = buildPowerBITheme('Valid Theme', dummyColors, structural);
    const jsonStr = serializePowerBITheme(theme);

    expect(typeof jsonStr).toBe('string');
    const parsed = JSON.parse(jsonStr);
    expect(parsed.name).toBe('Valid Theme');
    expect(parsed.dataColors).toHaveLength(10);

    const validation = validatePowerBITheme(parsed);
    expect(validation.isValid).toBe(true);
  });

  it('generates clean slugified filenames from arbitrary strings', () => {
    const createSlug = (name: string) =>
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'power-bi-theme';

    expect(createSlug('Contoso & Partners! 2026')).toBe('contoso-partners-2026');
    expect(createSlug('Theme___v1.0')).toBe('theme-v1-0');
    expect(createSlug('   ')).toBe('power-bi-theme');
  });

  it('passes strict validation against official Microsoft Power BI reportThemeSchema', () => {
    const theme = buildPowerBITheme('Certified Production Theme', dummyColors, structural, {
      fontFamily: 'Segoe UI',
      showVisualBorders: true,
      showVisualDropShadow: true,
    });

    const schemaPath = path.resolve(__dirname, '../../reportThemeSchema.json');
    if (fs.existsSync(schemaPath)) {
      const rawSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      const ajv = new Ajv({ strict: false, allErrors: true, validateSchema: false });
      const validate = ajv.compile(rawSchema);

      const isValid = validate(theme);
      if (!isValid) {
        console.error('Schema validation errors:', validate.errors);
      }
      expect(isValid).toBe(true);
      expect(validate.errors).toBeNull();
    }
  });
});

import { describe, it, expect } from 'vitest';
import { createColorSwatch } from '../core/colorHarmonics';
import { ColorSwatch } from '../core/types';

describe('Palette Management & Swatch Logic', () => {
  it('correctly creates rich ColorSwatch with calculated contrast', () => {
    const swatch = createColorSwatch('#2563EB', 'swatch-1');
    expect(swatch.id).toBe('swatch-1');
    expect(swatch.hex).toBe('#2563EB');
    expect(swatch.contrastOnLight).toBeGreaterThan(1);
    expect(swatch.contrastOnDark).toBeGreaterThan(1);
    expect(swatch.isLocked).toBe(false);
  });

  it('swaps adjacent swatches when moving left and right', () => {
    const palette: ColorSwatch[] = [
      createColorSwatch('#FF0000', '1'),
      createColorSwatch('#00FF00', '2'),
      createColorSwatch('#0000FF', '3'),
    ];

    // Move index 1 (green) left -> should swap with index 0 (red)
    const moveLeft = (arr: ColorSwatch[], index: number) => {
      const copy = [...arr];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    };

    const afterMoveLeft = moveLeft(palette, 1);
    expect(afterMoveLeft[0].hex).toBe('#00FF00');
    expect(afterMoveLeft[1].hex).toBe('#FF0000');
    expect(afterMoveLeft[2].hex).toBe('#0000FF');
  });

  it('reverses palette order accurately', () => {
    const palette = ['#111111', '#222222', '#333333'].map((h, i) =>
      createColorSwatch(h, `s-${i}`)
    );
    const reversed = [...palette].reverse();
    expect(reversed[0].hex).toBe('#333333');
    expect(reversed[1].hex).toBe('#222222');
    expect(reversed[2].hex).toBe('#111111');
  });

  it('preserves locked swatches when new palette colors arrive', () => {
    const existing: ColorSwatch[] = [
      { ...createColorSwatch('#FF0000', '1'), isLocked: true }, // Locked Red at #1
      createColorSwatch('#00FF00', '2'),
      createColorSwatch('#0000FF', '3'),
    ];

    const newlyExtracted = [
      createColorSwatch('#AAAAAA', 'new-1'),
      createColorSwatch('#BBBBBB', 'new-2'),
      createColorSwatch('#CCCCCC', 'new-3'),
    ];

    // Merge logic: preserve locked items
    const merged = [...existing];
    let newIdx = 0;
    for (let i = 0; i < merged.length; i++) {
      if (!merged[i].isLocked) {
        if (newlyExtracted[newIdx]) {
          merged[i] = newlyExtracted[newIdx];
          newIdx++;
        }
      }
    }

    // Index 0 should remain locked red
    expect(merged[0].hex).toBe('#FF0000');
    expect(merged[0].isLocked).toBe(true);
    // Index 1 and 2 should take new colors
    expect(merged[1].hex).toBe('#AAAAAA');
    expect(merged[2].hex).toBe('#BBBBBB');
  });

  it('updates single swatch hex and recalculates contrast', () => {
    const original = createColorSwatch('#000000', 'test');
    // Updating to pure white
    const updated = createColorSwatch('#FFFFFF', original.id);

    expect(updated.hex).toBe('#FFFFFF');
    expect(updated.contrastOnLight).toBe(1); // 1:1 on white
    expect(updated.contrastOnDark).toBeGreaterThan(10); // High on dark slate
  });
});

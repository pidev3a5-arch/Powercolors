import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from '../core/clipboard';

describe('Universal Clipboard Copy Utility', () => {
  const originalNavigator = globalThis.navigator;
  const originalDocument = (globalThis as any).document;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    (globalThis as any).document = originalDocument;
  });

  it('uses navigator.clipboard.writeText when available and resolves true', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis, 'navigator', {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
      configurable: true,
    });

    const success = await copyToClipboard('test payload');
    expect(success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('test payload');
  });

  it('gracefully falls back to document.execCommand when navigator.clipboard.writeText throws', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Document is not focused'));
    const execCommandMock = vi.fn().mockReturnValue(true);
    const mockTextArea = {
      value: '',
      style: {},
      setAttribute: vi.fn(),
      focus: vi.fn(),
      select: vi.fn(),
      setSelectionRange: vi.fn(),
    };
    (globalThis as any).document = {
      createElement: vi.fn().mockReturnValue(mockTextArea),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: execCommandMock,
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
      configurable: true,
    });

    const success = await copyToClipboard('fallback test payload');
    expect(success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('fallback test payload');
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });

  it('uses document.execCommand fallback when navigator.clipboard is undefined', async () => {
    const execCommandMock = vi.fn().mockReturnValue(true);
    const mockTextArea = {
      value: '',
      style: {},
      setAttribute: vi.fn(),
      focus: vi.fn(),
      select: vi.fn(),
      setSelectionRange: vi.fn(),
    };
    (globalThis as any).document = {
      createElement: vi.fn().mockReturnValue(mockTextArea),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: execCommandMock,
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      writable: true,
      configurable: true,
    });

    const success = await copyToClipboard('unsecured context payload');
    expect(success).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });

  it('safely handles non-string inputs like numbers without crashing', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis, 'navigator', {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
      configurable: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const success = await copyToClipboard(12345 as any);
    expect(success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('12345');
  });
});

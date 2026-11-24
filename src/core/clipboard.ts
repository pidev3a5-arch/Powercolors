/**
 * Universal, cross-browser clipboard copy utility with automatic fallback.
 * 
 * Works in:
 * 1. Secure (HTTPS) and local contexts via navigator.clipboard.writeText.
 * 2. Insecure contexts (HTTP / LAN IPs), iframe embeddings, webviews, and unfocused tabs
 *    via a hidden textarea element + document.execCommand('copy').
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof text !== 'string') {
    text = String(text ?? '');
  }

  // 1. Try modern navigator.clipboard API if available
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, attempting execCommand fallback:', err);
    }
  }

  // 2. Reliable universal fallback: document.execCommand('copy') with hidden textarea
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Keep textarea completely out of view without causing page scroll or layout shifts
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('aria-hidden', 'true');

      document.body.appendChild(textArea);

      // Select content
      textArea.focus({ preventScroll: true });
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        return true;
      }
    } catch (fallbackErr) {
      console.error('execCommand copy fallback failed:', fallbackErr);
    }
  }

  return false;
}

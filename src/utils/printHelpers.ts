/**
 * Print & Formatting Helpers for Ninos Design Garment Production
 */

export function formatRupiah(num: number): string {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generate a clean SVG barcode for documents
 */
export function generateBarcodeSvg(text: string, height: number = 38): string {
  // Simple deterministic Code 128 style bar pattern generator
  const clean = text.replace(/[^A-Za-z0-9_-]/g, '');
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }

  const widths = [1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 2];
  let x = 10;
  const bars: string[] = [];

  // Start quiet zone
  bars.push(`<rect x="0" y="0" width="10" height="${height}" fill="#fff"/>`);

  for (let i = 0; i < clean.length; i++) {
    const charCode = clean.charCodeAt(i);
    const pattern = (charCode ^ Math.abs(hash)) % 16;
    const w1 = widths[pattern % widths.length];
    const w2 = widths[(pattern + 3) % widths.length];
    const w3 = widths[(pattern + 7) % widths.length];

    bars.push(`<rect x="${x}" y="0" width="${w1}" height="${height}" fill="#0f172a"/>`);
    x += w1 + 1;
    bars.push(`<rect x="${x}" y="0" width="${w2}" height="${height}" fill="#0f172a"/>`);
    x += w2 + 2;
    bars.push(`<rect x="${x}" y="0" width="${w3}" height="${height}" fill="#0f172a"/>`);
    x += w3 + 1;
  }

  // End guard
  bars.push(`<rect x="${x}" y="0" width="2" height="${height}" fill="#0f172a"/>`);
  x += 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} ${height}" class="h-9 w-auto max-w-[220px]">
    ${bars.join('')}
  </svg>`;
}

/**
 * Generate a sharp, clean QR code-like SVG representation
 */
export function generateQrCodeSvg(text: string, size: number = 72): string {
  // Generate a 21x21 QR matrix visually representative of document token
  const n = 21;
  const matrix: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  // Finder patterns at top-left, top-right, bottom-left
  const addFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[r0 + r][c0 + c] = true;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, n - 7);
  addFinder(n - 7, 0);

  // Timing patterns
  for (let i = 8; i < n - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Pseudo data based on text hash
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) + text.charCodeAt(i);
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      // Don't overwrite finders or timing
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= n - 8;
      const inBL = r >= n - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      if (!inTL && !inTR && !inBL && !inTiming) {
        const val = ((h ^ (r * 31 + c * 17)) >>> 0) % 7;
        matrix[r][c] = val < 3;
      }
    }
  }

  const cellSize = size / n;
  const rects: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        rects.push(`<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#1e293b"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="w-16 h-16 border border-slate-200 bg-white p-0.5 rounded shadow-xs">
    ${rects.join('')}
  </svg>`;
}

/**
 * Trigger clean browser print dialog with page isolation
 */
export function triggerPrintWindow() {
  window.print();
}

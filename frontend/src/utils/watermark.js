// Shared Niyansh Pharma diagonal tiled watermark utility (Canvas + SVG Data URI)

const STAMP_GROUP_SVG = (cx, cy) =>
  `<g transform="translate(${cx}, ${cy}) rotate(-28)">` +
    `<g transform="translate(-76, -15) scale(0.3)">` +
      `<circle cx="50" cy="50" r="44" fill="#0c3d6c"/>` +
      `<circle cx="50" cy="50" r="38" fill="#ffffff"/>` +
      `<path d="M30 70C30 45 45 30 60 30C63.5 30 67 32 67 36C67 47 47 47 47 70C47 73.5 44 76 40 76C36 76 33 73.5 30 70Z" fill="#0c3d6c"/>` +
      `<path d="M47 70C47 47 62 38 75 38C78.5 38 82 41.5 82 45C82 56 62 56 62 76C62 79.5 58.5 83 55 83C51.5 83 47 79.5 47 70Z" fill="#16a34a"/>` +
      `<circle cx="50" cy="50" r="8" fill="#ffffff" stroke="#1b75bc" stroke-width="2.5"/>` +
    `</g>` +
    `<text x="-40" y="5" font-size="14" font-weight="800" font-family="Arial, Helvetica, sans-serif" letter-spacing="0.5" fill="#0f172a" stroke="#ffffff" stroke-width="2.5" paint-order="stroke">NIYANSH PHARMA</text>` +
  `</g>`;

export const WATERMARK_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220" viewBox="0 0 340 220">` +
    `<g opacity="0.24">${STAMP_GROUP_SVG(85, 55)}${STAMP_GROUP_SVG(255, 165)}</g>` +
  `</svg>`
)}")`;

export function hasBakedNiyanshWatermark(url) {
  if (!url || typeof url !== 'string') return false;
  return /(?:[?&]npwm=1|#npwm)(?:&|$)/.test(url);
}

export function markUrlAsWatermarked(url) {
  if (!url || typeof url !== 'string') return url;
  if (hasBakedNiyanshWatermark(url)) return url;
  if (url.startsWith('data:')) {
    return `${url}#npwm`;
  }
  return `${url}${url.includes('?') ? '&' : '?'}npwm=1`;
}

/**
 * Draws a staggered diagonal tiled "NIYANSH PHARMA" brand emblem + text watermark
 * directly onto a 2D Canvas context (used both at upload time and for live photo baking).
 */
export function applyNiyanshWatermark(ctx, width, height) {
  if (!ctx || !width || !height) return;

  const refDim = Math.max(width, height, 400);
  const scale = Math.max(0.35, Math.min(1, refDim / 1200));
  const iconSize = Math.round(48 * scale);
  const fontSize = Math.round(25 * scale);
  const gap = Math.round(10 * scale);
  const labelText = 'NIYANSH PHARMA';

  const stampCanvas = document.createElement('canvas');
  const measureCtx = stampCanvas.getContext('2d');
  if (!measureCtx) return;

  const fontSpec = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  measureCtx.font = fontSpec;
  const textWidth = Math.ceil(measureCtx.measureText(labelText).width);
  const pad = Math.round(8 * scale);
  const stampW = pad * 2 + iconSize + gap + textWidth;
  const stampH = Math.max(iconSize, fontSize) + pad * 2;
  stampCanvas.width = stampW;
  stampCanvas.height = stampH;

  const sCtx = stampCanvas.getContext('2d');
  if (!sCtx) return;

  sCtx.globalAlpha = 0.24;

  // Draw Niyansh Pharma circular emblem on left
  const iconY = (stampH - iconSize) / 2;
  sCtx.save();
  sCtx.translate(pad, iconY);
  sCtx.scale(iconSize / 100, iconSize / 100);

  sCtx.beginPath();
  sCtx.arc(50, 50, 44, 0, Math.PI * 2);
  sCtx.fillStyle = '#0c3d6c';
  sCtx.fill();

  sCtx.beginPath();
  sCtx.arc(50, 50, 38, 0, Math.PI * 2);
  sCtx.fillStyle = '#ffffff';
  sCtx.fill();

  sCtx.beginPath();
  sCtx.moveTo(30, 70);
  sCtx.bezierCurveTo(30, 45, 45, 30, 60, 30);
  sCtx.bezierCurveTo(63.5, 30, 67, 32, 67, 36);
  sCtx.bezierCurveTo(67, 47, 47, 47, 47, 70);
  sCtx.bezierCurveTo(47, 73.5, 44, 76, 40, 76);
  sCtx.bezierCurveTo(36, 76, 33, 73.5, 30, 70);
  sCtx.closePath();
  sCtx.fillStyle = '#0c3d6c';
  sCtx.fill();

  sCtx.beginPath();
  sCtx.moveTo(47, 70);
  sCtx.bezierCurveTo(47, 47, 62, 38, 75, 38);
  sCtx.bezierCurveTo(78.5, 38, 82, 41.5, 82, 45);
  sCtx.bezierCurveTo(82, 56, 62, 56, 62, 76);
  sCtx.bezierCurveTo(62, 79.5, 58.5, 83, 55, 83);
  sCtx.bezierCurveTo(51.5, 83, 47, 79.5, 47, 70);
  sCtx.closePath();
  sCtx.fillStyle = '#16a34a';
  sCtx.fill();

  sCtx.beginPath();
  sCtx.arc(50, 50, 8, 0, Math.PI * 2);
  sCtx.fillStyle = '#ffffff';
  sCtx.fill();
  sCtx.lineWidth = 2.5;
  sCtx.strokeStyle = '#1b75bc';
  sCtx.stroke();
  sCtx.restore();

  // Draw "NIYANSH PHARMA" label next to emblem
  const textX = pad + iconSize + gap;
  const textY = stampH / 2;
  sCtx.font = fontSpec;
  sCtx.textBaseline = 'middle';
  sCtx.textAlign = 'left';
  sCtx.lineWidth = Math.max(1.5, 2.5 * scale);
  sCtx.strokeStyle = '#ffffff';
  sCtx.strokeText(labelText, textX, textY);
  sCtx.fillStyle = '#0f172a';
  sCtx.fillText(labelText, textX, textY);

  // Tile across rotated grid
  const stepX = stampW + Math.round(75 * scale);
  const stepY = stampH + Math.round(95 * scale);
  const diag = Math.ceil(Math.hypot(width, height));

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-28 * Math.PI) / 180);

  let rowIdx = 0;
  for (let y = -diag * 0.75; y <= diag * 0.75; y += stepY) {
    const rowOffset = (rowIdx % 2) * (stepX / 2);
    for (let x = -diag * 0.75 - stepX; x <= diag * 0.75 + stepX; x += stepX) {
      ctx.drawImage(stampCanvas, x + rowOffset - stampW / 2, y - stampH / 2);
    }
    rowIdx += 1;
  }
  ctx.restore();
}

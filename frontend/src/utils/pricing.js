/**
 * Shared pharmaceutical text cleanup and wholesale PTR/MRP pricing helpers.
 */

const DIRTY_TEXT_VALUES = new Set(['null', 'undefined', 'none', '#n/a', 'nil', 'na', '']);

export function cleanPharmaText(val, fallback = '') {
  if (val === undefined || val === null) return fallback;
  const s = String(val).trim();
  return DIRTY_TEXT_VALUES.has(s.toLowerCase()) ? fallback : s;
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Resolve effective Retail MRP (falls back to PTR if MRP is missing).
 */
export function getEffectiveMrp(product) {
  if (!product || typeof product !== 'object') return 0;
  const mrp = Number(product.mrp);
  if (Number.isFinite(mrp) && mrp > 0) return roundCurrency(mrp);
  const ptr = Number(product.price ?? product.ptr);
  if (Number.isFinite(ptr) && ptr > 0) return roundCurrency(ptr);
  return 0;
}

/**
 * Resolve effective Wholesale PTR price.
 * When DB PTR is 0/missing and MRP > 0, derives wholesale PTR at standard 30% trade margin (70% of MRP).
 */
export function getEffectivePtr(product) {
  if (!product || typeof product !== 'object') return 0;
  const rawPtr = Number(product.price ?? product.ptr);
  if (Number.isFinite(rawPtr) && rawPtr > 0) return roundCurrency(rawPtr);
  const mrp = Number(product.mrp);
  if (Number.isFinite(mrp) && mrp > 0) return roundCurrency(mrp * 0.70);
  return 0;
}

/**
 * Resolve chemist retail margin percentage (0..99). Returns 0 if unpriced or no margin.
 */
export function getMarginPercent(product) {
  const mrp = getEffectiveMrp(product);
  const ptr = getEffectivePtr(product);
  if (mrp <= 0 || ptr <= 0 || mrp <= ptr) return 0;
  return Math.round(((mrp - ptr) / mrp) * 100);
}

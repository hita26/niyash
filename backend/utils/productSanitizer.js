/**
 * Shared product field & wholesale pricing sanitizer.
 * Ensures dirty spreadsheet strings ('NULL', 'undefined', '#N/A') are cleaned
 * and wholesale PTR price is derived from MRP (70% of MRP) when PTR is missing/0.
 */

const DIRTY_VALUES = new Set(['null', 'undefined', 'none', '#n/a', 'nil', '']);

function cleanStringField(val, fallback = '') {
  if (val === undefined || val === null) return fallback;
  const s = String(val).trim();
  return DIRTY_VALUES.has(s.toLowerCase()) ? fallback : s;
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function sanitizeProduct(product, options = {}) {
  if (!product || typeof product !== 'object') return product;
  const { preserveRawPrice = false } = options;

  const rawPrice = Number(product.price);
  const rawMrp = Number(product.mrp);

  const effectiveMrp = rawMrp > 0
    ? roundCurrency(rawMrp)
    : (rawPrice > 0 ? roundCurrency(rawPrice) : 0);

  const effectivePrice = preserveRawPrice
    ? (rawPrice > 0 ? roundCurrency(rawPrice) : 0)
    : (rawPrice > 0
      ? roundCurrency(rawPrice)
      : (effectiveMrp > 0 ? roundCurrency(effectiveMrp * 0.70) : 0));

  const fallbackCompany = cleanStringField(product.brand, 'Daxia Healthcare');

  return {
    ...product,
    category: cleanStringField(product.category, 'Pharma Products'),
    company: cleanStringField(product.company, fallbackCompany),
    brand: cleanStringField(product.brand, fallbackCompany),
    composition: cleanStringField(product.composition, ''),
    form: cleanStringField(product.form, 'Tablet'),
    packing: cleanStringField(product.packing, '10 x 10 Tablets'),
    price: effectivePrice,
    mrp: effectiveMrp,
  };
}

module.exports = {
  cleanStringField,
  sanitizeProduct,
};

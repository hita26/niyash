const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Company = require('../models/Company');

const BASE_URL = 'https://niyanshpharma.com';

/**
 * Format a Date object to W3C datetime (YYYY-MM-DD)
 */
function formatDate(date) {
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// @desc    Dynamic Google XML Sitemap
// @route   GET /sitemap.xml
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Static Priority Routes
    const staticRoutes = [
      { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/products`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/our-products`, priority: '0.9', changefreq: 'weekly', lastmod: today },
      { loc: `${BASE_URL}/companies`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${BASE_URL}/about`, priority: '0.7', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/contact`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/partner`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/supplier`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/manufacturing`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/career`, priority: '0.6', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/news`, priority: '0.7', changefreq: 'daily', lastmod: today },
    ];

    // Dynamic Product Routes (Published products)
    let productRoutes = [];
    try {
      const products = await Product.find({ isPublic: { $ne: false } })
        .select('_id updatedAt createdAt')
        .sort({ updatedAt: -1 })
        .limit(5000)
        .lean();

      productRoutes = products.map((p) => ({
        loc: `${BASE_URL}/products/${p._id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: formatDate(p.updatedAt || p.createdAt || new Date())
      }));
    } catch (e) {
      console.error('Error fetching products for sitemap:', e.message);
    }

    // Dynamic Company Routes (Active manufacturers/brands)
    let companyRoutes = [];
    try {
      const companies = await Company.find({ status: { $ne: 'Draft' } })
        .select('_id updatedAt createdAt')
        .sort({ updatedAt: -1 })
        .limit(500)
        .lean();

      companyRoutes = companies.map((c) => ({
        loc: `${BASE_URL}/companies/${c._id}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: formatDate(c.updatedAt || c.createdAt || new Date())
      }));
    } catch (e) {
      console.error('Error fetching companies for sitemap:', e.message);
    }

    const allUrls = [...staticRoutes, ...productRoutes, ...companyRoutes];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
    xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

    for (const item of allUrls) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(item.loc)}</loc>\n`;
      xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// @desc    robots.txt for Search Engine Crawlers
// @route   GET /robots.txt
// @access  Public
router.get('/robots.txt', (req, res) => {
  const content = `# Niyansh Pharma robots.txt
User-agent: *
Allow: /
Allow: /products
Allow: /companies
Allow: /about
Allow: /contact
Allow: /partner
Allow: /supplier
Allow: /manufacturing
Allow: /news
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard
Disallow: /portal
Disallow: /retailer-dashboard
Disallow: /quick-order
Disallow: /order
Disallow: /ledger
Disallow: /outstanding

Sitemap: ${BASE_URL}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.header('Cache-Control', 'public, max-age=86400');
  res.send(content);
});

module.exports = router;

const router = require('express').Router();

const SITE_URL = process.env.SITE_URL || 'https://neptunetherapy.com';

const pages = [
  { path: '/',        changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',   changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/apply',   changefreq: 'weekly',  priority: '0.9' },
];

router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const urls = pages.map(p => `
  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;

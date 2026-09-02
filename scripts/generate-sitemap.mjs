import { writeFile } from 'node:fs/promises';

const SITE = 'https://kinsengs.com';
const response = await fetch(`${SITE}/wp-json/wc/store/v1/products?per_page=100`);
if (!response.ok) throw new Error(`WooCommerce API returned ${response.status}`);
const products = await response.json();
const urls = [
  { loc: `${SITE}/`, frequency: 'weekly', priority: '1.0' },
  { loc: `${SITE}/products`, frequency: 'daily', priority: '0.9' },
  ...products.map((product) => ({ loc: `${SITE}/products/${product.slug}`, frequency: 'weekly', priority: '0.8' })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((item) => `  <url><loc>${item.loc}</loc><changefreq>${item.frequency}</changefreq><priority>${item.priority}</priority></url>`).join('\n')}
</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml, 'utf8');
console.log(`Generated sitemap with ${urls.length} URLs.`);

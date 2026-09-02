import { useEffect } from 'react';

const SITE = 'https://kinsengs.com';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export function SEO({ title, description, path = '/', image, schema }) {
  useEffect(() => {
    const fullTitle = title.includes('Kinsengs') ? title : `${title} | Kinsengs`;
    const canonicalUrl = `${SITE}${path}`;
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image || `${SITE}/wp-content/uploads/2026/09/ChatGPT-Image-Aug-28-2026-05_04_38-AM.png` });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
    document.querySelectorAll('script[data-kinsengs-schema]').forEach((node) => node.remove());
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.kinsengsSchema = 'true';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, schema]);
  return null;
}

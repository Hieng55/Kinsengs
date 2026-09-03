import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../data';

export function categoryName(product) {
  const name = product.categories?.[0]?.name || 'Kinsengs Selection';
  return translations[name] || name.replaceAll('&#8211;', '–').replaceAll('&#038;', '&');
}

const displayCategoryName = (category) => translations[category?.name] || category?.name?.replaceAll('&#8211;', '–').replaceAll('&#038;', '&');

export function productTaxonomy(product) {
  const categories = product.categories || [];
  const slugs = new Set(categories.map((category) => category.slug));
  if (slugs.has('health-tolip')) {
    const detail = categories.find((category) => category.slug !== 'health-tolip');
    return { brand: 'Tolip', collection: 'Health', detail: displayCategoryName(detail) };
  }
  if (slugs.has('beauty') || slugs.has('health')) {
    const collectionSlug = slugs.has('beauty') ? 'beauty' : 'health';
    const collection = collectionSlug === 'beauty' ? 'Beauty' : 'Health';
    const detail = categories.find((category) => category.slug !== collectionSlug);
    return { brand: 'Hearbal', collection, detail: displayCategoryName(detail) };
  }
  return { brand: 'Kinsengs', collection: categoryName(product) };
}

export function cleanName(name = '') {
  const el = document.createElement('textarea');
  el.innerHTML = name;
  return el.value;
}

export function handleProductImageError(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.classList.add('product-image-fallback');
  image.src = 'https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png';
}

export function getProductPriceAmount(product, field = 'price') {
  const storePrice = product.prices?.[field];
  const rawPrice = storePrice ?? product[field];
  if (rawPrice === undefined || rawPrice === null || rawPrice === '') return null;

  const minorUnit = storePrice !== undefined ? Number(product.prices.currency_minor_unit ?? 2) : 0;
  const amount = Number(rawPrice) / (10 ** minorUnit);
  return Number.isFinite(amount) ? amount : null;
}

export function formatProductPrice(product, field = 'price') {
  const amount = getProductPriceAmount(product, field);
  if (amount === null || amount <= 0) return null;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.prices?.currency_code || 'USD',
  }).format(amount);
}

export function ProductCard({ product, featured = false }) {
  const price = formatProductPrice(product);
  const regularPrice = product.on_sale ? formatProductPrice(product, 'regular_price') : null;
  const taxonomy = productTaxonomy(product);
  const taxonomyPath = [taxonomy.brand, taxonomy.collection, taxonomy.detail].filter(Boolean).join(' / ');
  return (
    <article className={`product-card ${featured ? 'featured' : ''}`}>
      <Link to={`/products/${product.slug}`} className="product-image-wrap" aria-label={`View ${cleanName(product.name)}`}>
        <span className="product-badge">{taxonomy.brand}</span>
        <img loading="lazy" src={product.images?.[0]?.src} alt={cleanName(product.name)} onError={handleProductImageError} />
        <span className="circle-link"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="product-meta">
        <span className="product-taxonomy">{taxonomyPath}</span>
        <Link to={`/products/${product.slug}`}><h3>{cleanName(product.name)}</h3></Link>
        <div className="product-meta-footer">
          {price && <div className="product-price">{regularPrice && <del>{regularPrice}</del>}<strong>{price}</strong></div>}
          <Link className="text-link" to={`/products/${product.slug}`}>Discover <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </article>
  );
}

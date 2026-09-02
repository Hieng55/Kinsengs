import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../data';

export function categoryName(product) {
  const name = product.categories?.[0]?.name || 'Kinsengs Selection';
  return translations[name] || name.replaceAll('&#8211;', '–').replaceAll('&#038;', '&');
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

export function ProductCard({ product, featured = false }) {
  return (
    <article className={`product-card ${featured ? 'featured' : ''}`}>
      <Link to={`/products/${product.slug}`} className="product-image-wrap" aria-label={`View ${cleanName(product.name)}`}>
        <span className="product-badge">Curated</span>
        <img loading="lazy" src={product.images?.[0]?.src} alt={cleanName(product.name)} onError={handleProductImageError} />
        <span className="circle-link"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="product-meta">
        <span>{categoryName(product)}</span>
        <Link to={`/products/${product.slug}`}><h3>{cleanName(product.name)}</h3></Link>
        <Link className="text-link" to={`/products/${product.slug}`}>Discover product <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  );
}

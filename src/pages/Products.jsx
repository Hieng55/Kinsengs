import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ProductCard, cleanName } from '../components/ProductCard';
import { categoryMenu, translations } from '../data';
import { useProducts } from '../useProducts';
import { SEO } from '../components/SEO';

const catalogSchema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Kinsengs Wellness Collection', url: 'https://kinsengs.com/products', description: 'A curated collection of dietary supplements and wellness products available with personal guidance.', inLanguage: 'en-US', isPartOf: { '@type': 'WebSite', name: 'Kinsengs', url: 'https://kinsengs.com/' } };

export function Products({ onConsult }) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const category = params.get('category') || params.get('nhom') || 'all';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const perPage = 12;
  const { products, loading, isFallback } = useProducts();
  const root = useRef(null);
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => p.categories?.forEach((c) => map.set(c.slug, translations[c.name] || c.name)));
    const known = new Map(categoryMenu.map(([slug, name]) => [slug, name]));
    map.forEach((name, slug) => known.set(slug, name));
    return [...known.entries()];
  }, [products]);
  const filtered = useMemo(() => products.filter((p) => {
    const matchesCategory = category === 'all' || p.categories?.some((c) => c.slug === category);
    const matchesQuery = cleanName(p.name).toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [products, category, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visibleProducts = filtered.slice((Math.min(page, totalPages) - 1) * perPage, Math.min(page, totalPages) * perPage);
  const goToPage = (nextPage) => {
    const next = {};
    if (category !== 'all') next.category = category;
    if (nextPage > 1) next.page = String(nextPage);
    setParams(next);
    document.querySelector('.catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useEffect(() => {
    if (page > totalPages) goToPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => {
    if (!loading) gsap.fromTo('.catalog-grid .product-card', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .035, ease: 'power3.out' });
  }, [category, query, loading]);
  return (
    <div className="catalog-page" ref={root}>
      <SEO title="Wellness Products" description="Browse Kinsengs dietary supplements by wellness need. Explore ingredients, directions, and call (346) 347-5571 for personal product guidance." path="/products" schema={catalogSchema} />
      <section className="catalog-hero"><div className="shell"><span className="eyebrow light">Kinsengs Collection</span><h1>Curated for a life well lived.</h1><p>Explore by need. Understand every choice. Call us for personal guidance.</p></div></section>
      <section className="catalog shell">
        <div className="catalog-tools">
          <div className="catalog-title"><span>{loading ? 'Loading' : `${filtered.length} products`}</span><h2>The collection</h2></div>
          <label className="search-field"><Search size={18} /><input value={query} onChange={(e) => { setQuery(e.target.value); if (page > 1) goToPage(1); }} placeholder="Search by product name..." />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}</label>
        </div>
        <div className="filter-row" aria-label="Filter by category">
          <SlidersHorizontal size={17} /><button className={category === 'all' ? 'active' : ''} onClick={() => setParams({})}>All</button>
          {categories.map(([slug, name]) => <button key={slug} className={category === slug ? 'active' : ''} onClick={() => setParams({ category: slug })}>{name}</button>)}
        </div>
        {isFallback && <p className="api-notice">The live catalog is temporarily unavailable. A selection of featured products is shown below.</p>}
        <div className="product-grid catalog-grid">
          {loading ? [...Array(12)].map((_, i) => <div className="product-skeleton" key={i} />) : visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {!loading && totalPages > 1 && <nav className="pagination" aria-label="Product pagination"><button onClick={() => goToPage(page - 1)} disabled={page <= 1} aria-label="Previous page"><ChevronLeft /></button>{[...Array(totalPages)].map((_, i) => <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => goToPage(i + 1)} aria-label={`Page ${i + 1}`} aria-current={page === i + 1 ? 'page' : undefined}>{String(i + 1).padStart(2, '0')}</button>)}<button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} aria-label="Next page"><ChevronRight /></button></nav>}
        {!loading && !filtered.length && <div className="empty-state"><Sparkles /><h3>No matching products found</h3><p>Try another search or let Kinsengs guide you.</p><button className="button" onClick={onConsult}>Request guidance</button></div>}
      </section>
    </div>
  );
}

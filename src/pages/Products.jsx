import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ProductCard, cleanName, formatProductPrice, getProductPriceAmount, handleProductImageError, productTaxonomy } from '../components/ProductCard';
import { categoryDescendants, categoryMenu, translations } from '../data';
import { useProducts } from '../useProducts';
import { SEO } from '../components/SEO';

const catalogSchema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Kinsengs Wellness Collection', url: 'https://kinsengs.com/products', description: 'A curated collection of dietary supplements and wellness products available with personal guidance.', inLanguage: 'en-US', isPartOf: { '@type': 'WebSite', name: 'Kinsengs', url: 'https://kinsengs.com/' } };

function productMatchesQuery(product, query) {
  if (!query) return true;
  const searchable = [
    cleanName(product.name),
    product.sku,
    product.categories?.map((item) => translations[item.name] || item.name).join(' '),
    formatProductPrice(product),
  ].filter(Boolean).join(' ').toLowerCase();
  return searchable.includes(query.toLowerCase());
}

export function Products() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchPending, setSearchPending] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('all');
  const [saleOnly, setSaleOnly] = useState(false);
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.get('category') || params.get('nhom') || 'all';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const perPage = 12;
  const { products, loading, isFallback } = useProducts(category);
  const root = useRef(null);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((product) => product.categories?.forEach((item) => map.set(item.slug, translations[item.name] || item.name)));
    const known = new Map(categoryMenu.map(([slug, name]) => [slug, name]));
    map.forEach((name, slug) => { if (!known.has(slug)) known.set(slug, name); });
    return [...known.entries()];
  }, [products]);
  const categoryLabels = new Map(categories);
  const tolipCategorySlugs = ['tolip', ...categoryDescendants['health-tolip']];
  const hearbalCategorySlugs = ['hearbal', 'beauty', 'health'];
  const groupedCategorySlugs = new Set([...tolipCategorySlugs, ...hearbalCategorySlugs]);
  const tolipCategoryOptions = tolipCategorySlugs.map((slug) => [slug, categoryLabels.get(slug)]).filter(([, name]) => name);
  const hearbalCategoryOptions = hearbalCategorySlugs.map((slug) => [slug, categoryLabels.get(slug)]).filter(([, name]) => name);
  const otherCategoryOptions = categories.filter(([slug]) => !groupedCategorySlugs.has(slug));
  const activeCategoryLabel = categoryLabels.get(category) || category.replaceAll('-', ' ');
  const activeCategoryPath = category === 'all' ? ['All products']
    : category === 'tolip' ? ['Tolip']
      : category === 'health-tolip' ? ['Tolip', 'Health']
        : categoryDescendants['health-tolip'].includes(category) ? ['Tolip', 'Health', activeCategoryLabel]
          : category === 'hearbal' ? ['Hearbal']
            : category === 'beauty' ? ['Hearbal', 'Beauty']
              : category === 'health' ? ['Hearbal', 'Health']
                : ['Wellness', activeCategoryLabel];
  const activeCollectionTitle = category === 'all' ? 'The complete collection' : `${activeCategoryPath.at(-1)} collection`;

  const priceRange = useMemo(() => {
    const values = products.map((product) => getProductPriceAmount(product)).filter((value) => value !== null);
    return { min: values.length ? Math.floor(Math.min(...values)) : 0, max: values.length ? Math.ceil(Math.max(...values)) : 0 };
  }, [products]);

  useEffect(() => {
    const nextQuery = query.trim();
    if (!nextQuery) {
      setDebouncedQuery('');
      setSearchPending(false);
      return undefined;
    }
    setSearchPending(true);
    const timer = window.setTimeout(() => {
      setDebouncedQuery(nextQuery);
      setSearchPending(false);
    }, 320);
    return () => window.clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return [];
    return products
      .filter((product) => productMatchesQuery(product, debouncedQuery))
      .sort((a, b) => {
        const aStarts = cleanName(a.name).toLowerCase().startsWith(debouncedQuery.toLowerCase());
        const bStarts = cleanName(b.name).toLowerCase().startsWith(debouncedQuery.toLowerCase());
        return Number(bStarts) - Number(aStarts);
      })
      .slice(0, 6);
  }, [products, debouncedQuery]);

  const filtered = useMemo(() => {
    const minimum = minPrice === '' ? -Infinity : Number(minPrice);
    const maximum = maxPrice === '' ? Infinity : Number(maxPrice);
    const selectedCategorySlugs = categoryDescendants[category] || [category];
    const matches = products.filter((product) => {
      const price = getProductPriceAmount(product);
      const matchesCategory = category === 'all' || product.categories?.some((item) => selectedCategorySlugs.includes(item.slug));
      const matchesPrice = price === null ? minPrice === '' && maxPrice === '' : price >= minimum && price <= maximum;
      const matchesAvailability = availability === 'all' || (availability === 'in-stock' ? product.is_in_stock !== false : product.is_in_stock === false);
      return matchesCategory && matchesPrice && matchesAvailability && (!saleOnly || product.on_sale) && productMatchesQuery(product, debouncedQuery);
    });
    return matches.sort((a, b) => {
      if (sort === 'name-asc') return cleanName(a.name).localeCompare(cleanName(b.name));
      if (sort === 'price-asc') return getProductPriceAmount(a) - getProductPriceAmount(b);
      if (sort === 'price-desc') return getProductPriceAmount(b) - getProductPriceAmount(a);
      if (sort === 'latest') return Number(b.id) - Number(a.id);
      return 0;
    });
  }, [products, category, debouncedQuery, minPrice, maxPrice, availability, saleOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const activeFilterCount = Number(category !== 'all') + Number(minPrice !== '') + Number(maxPrice !== '') + Number(availability !== 'all') + Number(saleOnly);

  const pageItems = useMemo(() => {
    const items = [];
    const push = (value) => { if (!items.includes(value) && value >= 1 && value <= totalPages) items.push(value); };
    push(1);
    if (totalPages <= 7) { for (let i = 2; i <= totalPages; i++) push(i); }
    else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      if (start > 2) push('start-ellipsis');
      for (let i = start; i <= end; i++) push(i);
      if (end < totalPages - 1) push('end-ellipsis');
      push(totalPages);
    }
    return items;
  }, [totalPages, currentPage]);

  const goToPage = (nextPage) => {
    const next = {};
    if (category !== 'all') next.category = category;
    if (nextPage > 1) next.page = String(nextPage);
    setParams(next);
    document.querySelector('.catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const chooseCategory = (nextCategory) => setParams(nextCategory === 'all' ? {} : { category: nextCategory });
  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    setSearchPending(false);
    setSearchOpen(false);
  };
  const clearFilters = () => {
    setParams({});
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSaleOnly(false);
  };

  useEffect(() => {
    if (page > totalPages) goToPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => {
    setQuery('');
    setDebouncedQuery('');
    setSearchPending(false);
    setSearchOpen(false);
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSaleOnly(false);
    setFiltersOpen(false);
  }, [category]);
  useEffect(() => {
    if (page > 1) setParams(category === 'all' ? {} : { category }, { replace: true });
  }, [debouncedQuery, minPrice, maxPrice, availability, saleOnly, sort]);
  useEffect(() => {
    if (!loading) gsap.fromTo('.catalog-grid .product-card', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .035, ease: 'power3.out' });
  }, [category, debouncedQuery, minPrice, maxPrice, availability, saleOnly, sort, loading]);

  return (
    <div className="catalog-page" ref={root}>
      <SEO title="Wellness Products" description="Browse Kinsengs dietary supplements by wellness need. Explore ingredients, directions, and call (346) 347-5571 for personal product guidance." path="/products" schema={catalogSchema} />
      <section className="catalog-hero"><div className="shell"><span className="eyebrow light">Kinsengs Collection</span><h1>Curated for a life well lived.</h1><p>Explore by need. Understand every choice. Call us for personal guidance.</p></div></section>
      <section className="catalog shell">
        <div className="catalog-tools">
          <div className="catalog-title"><span>{loading ? 'Loading collection' : 'Currently viewing'}</span><div className="catalog-category-path">{activeCategoryPath.map((item) => <strong key={item}>{item}</strong>)}</div><h2>{activeCollectionTitle}</h2>{!loading && <p>{filtered.length} carefully presented {filtered.length === 1 ? 'product' : 'products'}</p>}</div>
          <div className="catalog-search" onFocus={() => setSearchOpen(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false); }}>
            <label className="search-field"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, category, SKU or price..." />{query && <button type="button" onClick={clearSearch} aria-label="Clear search"><X size={16} /></button>}</label>
            {searchPending && <span className="search-pending" aria-live="polite">Finding products...</span>}
            {searchOpen && !searchPending && debouncedQuery && <div className="search-suggestions">
              <div className="suggestions-heading"><span>Suggested products</span><small>{suggestions.length} matches</small></div>
              {suggestions.map((product) => {
                const productPrice = formatProductPrice(product);
                const taxonomy = productTaxonomy(product);
                const taxonomyPath = [taxonomy.brand, taxonomy.collection, taxonomy.detail].filter(Boolean).join(' / ');
                return <Link key={product.id} to={`/products/${product.slug}`} onClick={() => setSearchOpen(false)}>
                  <span className="suggestion-image"><img src={product.images?.[0]?.thumbnail || product.images?.[0]?.src} alt="" onError={handleProductImageError} /></span>
                  <span className="suggestion-copy"><strong>{cleanName(product.name)}</strong><small>{taxonomyPath}</small></span>
                  {productPrice && <span className="suggestion-price">{productPrice}</span>}
                </Link>;
              })}
              {!suggestions.length && <div className="suggestions-empty">No product matches “{debouncedQuery}”. Try another name, category, SKU, or price.</div>}
            </div>}
          </div>
        </div>

        <div className="catalog-toolbar">
          <button className="filter-toggle" type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="catalog-filters"><SlidersHorizontal size={17} /> Filters {activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
          <label className="sort-field"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="latest">Newest</option><option value="name-asc">Name A–Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
        </div>

        {isFallback && <p className="api-notice">The live catalog is temporarily unavailable. A selection of featured products is shown below.</p>}
        <div className="catalog-layout">
          <aside id="catalog-filters" className={`catalog-filters ${filtersOpen ? 'is-open' : ''}`}>
            <div className="filters-heading"><div><SlidersHorizontal size={17} /><strong>Refine selection</strong></div>{activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Clear all</button>}</div>
            <div className="filter-group"><label htmlFor="category-filter">Brand & category</label><select id="category-filter" value={category} onChange={(event) => chooseCategory(event.target.value)}><option value="all">All products</option><optgroup label="Tolip">{tolipCategoryOptions.map(([slug, name]) => <option key={slug} value={slug}>{slug === 'tolip' ? 'All Tolip' : slug === 'health-tolip' ? 'All Health' : name}</option>)}</optgroup><optgroup label="Hearbal">{hearbalCategoryOptions.map(([slug, name]) => <option key={slug} value={slug}>{slug === 'hearbal' ? 'All Hearbal' : name.replace('Hearbal / ', '')}</option>)}</optgroup>{otherCategoryOptions.length > 0 && <optgroup label="Other wellness categories">{otherCategoryOptions.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</optgroup>}</select></div>
            <fieldset className="filter-group price-filter"><legend>Price range</legend><div><label><span>Min</span><input type="number" min={priceRange.min} max={priceRange.max} step="1" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder={`$${priceRange.min}`} /></label><i>—</i><label><span>Max</span><input type="number" min={priceRange.min} max={priceRange.max} step="1" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder={`$${priceRange.max}`} /></label></div></fieldset>
            <fieldset className="filter-group option-filter"><legend>Availability</legend><label><input type="radio" name="availability" value="all" checked={availability === 'all'} onChange={(event) => setAvailability(event.target.value)} /><span>All products</span></label><label><input type="radio" name="availability" value="in-stock" checked={availability === 'in-stock'} onChange={(event) => setAvailability(event.target.value)} /><span>In stock</span></label><label><input type="radio" name="availability" value="out-of-stock" checked={availability === 'out-of-stock'} onChange={(event) => setAvailability(event.target.value)} /><span>Out of stock</span></label></fieldset>
            <fieldset className="filter-group option-filter"><legend>Offers</legend><label><input type="checkbox" checked={saleOnly} onChange={(event) => setSaleOnly(event.target.checked)} /><span>On sale only</span></label></fieldset>
          </aside>

          <div className="catalog-results">
            <div className="results-summary"><span>Showing <strong>{visibleProducts.length}</strong> of <strong>{filtered.length}</strong> products in <strong>{activeCategoryPath.join(' / ')}</strong></span>{debouncedQuery && <button type="button" onClick={clearSearch}>Search: “{debouncedQuery}” <X size={13} /></button>}</div>
            <div className="product-grid catalog-grid">
              {loading ? [...Array(12)].map((_, index) => <div className="product-skeleton" key={index} />) : visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {!loading && totalPages > 1 && <nav className="pagination" aria-label="Product pagination"><button onClick={() => goToPage(page - 1)} disabled={page <= 1} aria-label="Previous page"><ChevronLeft /></button>{pageItems.map((item) => typeof item === 'string' ? <span className="pagination-ellipsis" key={item} aria-hidden="true">…</span> : <button key={item} className={page === item ? 'active' : ''} onClick={() => goToPage(item)} aria-label={`Page ${item}`} aria-current={page === item ? 'page' : undefined}>{String(item).padStart(2, '0')}</button>)}<button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} aria-label="Next page"><ChevronRight /></button></nav>}
            {!loading && !filtered.length && <div className="empty-state"><Sparkles /><h3>No matching products found</h3><p>Adjust your filters, try another search, or call Kinsengs for guidance.</p><button className="outline-button" type="button" onClick={() => { clearFilters(); clearSearch(); }}>Clear search & filters</button></div>}
          </div>
        </div>
      </section>
    </div>
  );
}

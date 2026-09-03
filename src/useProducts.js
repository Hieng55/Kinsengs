import { useEffect, useState } from 'react';
import { API_URL, englishProductOverrides, fallbackProducts } from './data';

const cache = new Map();
const pendingRequests = new Map();

const applyEnglishOverrides = (items) => items.map((product) => ({
  ...product,
  ...(englishProductOverrides[product.id] || {}),
}));

function loadProducts(category) {
  if (!pendingRequests.has(category)) {
    const categoryQuery = category === 'all' ? '' : `&category=${encodeURIComponent(category)}`;
    const pendingRequest = fetch(`${API_URL}?per_page=100${categoryQuery}`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load products');
        return response.json();
      })
      .then((data) => ({ products: applyEnglishOverrides(data), isFallback: false }))
      .catch(() => ({ products: applyEnglishOverrides(fallbackProducts), isFallback: true }))
      .then((result) => {
        cache.set(category, result);
        return result;
      })
      .finally(() => { pendingRequests.delete(category); });
    pendingRequests.set(category, pendingRequest);
  }
  return pendingRequests.get(category);
}

export function useProducts(category = 'all') {
  const categoryKey = category || 'all';
  const initial = cache.get(categoryKey);
  const [products, setProducts] = useState(initial?.products || []);
  const [loading, setLoading] = useState(!initial);
  const [isFallback, setIsFallback] = useState(initial?.isFallback || false);

  useEffect(() => {
    const cached = cache.get(categoryKey);
    if (cached) {
      setProducts(cached.products);
      setIsFallback(cached.isFallback);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    loadProducts(categoryKey).then((result) => {
      if (!active) return;
      setProducts(result.products);
      setIsFallback(result.isFallback);
      setLoading(false);
    });
    return () => { active = false; };
  }, [categoryKey]);

  return { products, loading, isFallback };
}

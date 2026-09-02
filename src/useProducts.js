import { useEffect, useState } from 'react';
import { API_URL, englishProductOverrides, fallbackProducts } from './data';

let cache;
let pendingRequest;

const applyEnglishOverrides = (items) => items.map((product) => ({
  ...product,
  ...(englishProductOverrides[product.id] || {}),
}));

function loadProducts() {
  if (!pendingRequest) {
    pendingRequest = fetch(`${API_URL}?per_page=100`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load products');
        return response.json();
      })
      .then((data) => ({ products: applyEnglishOverrides(data), isFallback: false }))
      .catch(() => ({ products: applyEnglishOverrides(fallbackProducts), isFallback: true }))
      .then((result) => {
        cache = result;
        return result;
      })
      .finally(() => { pendingRequest = undefined; });
  }
  return pendingRequest;
}

export function useProducts() {
  const [products, setProducts] = useState(cache?.products || []);
  const [loading, setLoading] = useState(!cache);
  const [isFallback, setIsFallback] = useState(cache?.isFallback || false);

  useEffect(() => {
    if (cache) {
      setProducts(cache.products);
      setIsFallback(cache.isFallback);
      setLoading(false);
      return;
    }
    let active = true;
    loadProducts().then((result) => {
      if (!active) return;
      setProducts(result.products);
      setIsFallback(result.isFallback);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { products, loading, isFallback };
}

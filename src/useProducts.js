import { useEffect, useState } from 'react';
import { API_URL, englishProductOverrides, fallbackProducts } from './data';

let cache;

const applyEnglishOverrides = (items) => items.map((product) => ({
  ...product,
  ...(englishProductOverrides[product.id] || {}),
}));

export function useProducts() {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();
    fetch(`${API_URL}?per_page=100`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load products');
        return response.json();
      })
      .then((data) => {
        cache = applyEnglishOverrides(data);
        setProducts(cache);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setProducts(applyEnglishOverrides(fallbackProducts));
          setIsFallback(true);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return { products, loading, isFallback };
}

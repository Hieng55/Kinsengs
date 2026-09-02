import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Headphones, Leaf, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import gsap from 'gsap';
import { ProductCard, categoryName, cleanName, handleProductImageError } from '../components/ProductCard';
import { useProducts } from '../useProducts';
import { SEO } from '../components/SEO';

export function ProductDetail({ onConsult }) {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const root = useRef(null);
  const [tab, setTab] = useState('detail');
  useEffect(() => {
    if (product) {
      const ctx = gsap.context(() => {
        gsap.from('.detail-gallery', { x: -45, opacity: 0, duration: 1, ease: 'power3.out' });
        gsap.from('.detail-summary > *', { y: 30, opacity: 0, duration: .85, stagger: .08, ease: 'power3.out' });
        gsap.from('.detail-highlights article', { y: 35, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.detail-highlights', start: 'top 80%' } });
        gsap.fromTo('.detail-editorial-image img', { scale: 1.12, yPercent: -3 }, { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.detail-editorial', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.detail-editorial-copy > *', { y: 45, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.detail-editorial-copy', start: 'top 75%' } });
      }, root);
      return () => ctx.revert();
    }
  }, [product]);
  const safeDescription = useMemo(() => product ? DOMPurify.sanitize(product.description || '<p>Detailed information is being updated. Please call Kinsengs for guidance on ingredients and labeled directions.</p>', { FORBID_ATTR: ['style'], FORBID_TAGS: ['script', 'iframe'] }) : '', [product]);
  const productSchema = useMemo(() => product ? {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Product', '@id': `https://kinsengs.com/products/${product.slug}#product`, name: cleanName(product.name), image: product.images?.map((item) => item.src), description: (product.description || 'A selected wellness product from Kinsengs.').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500), sku: product.sku || undefined, category: categoryName(product), brand: { '@type': 'Brand', name: 'Kinsengs' }, url: `https://kinsengs.com/products/${product.slug}` },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kinsengs.com/' }, { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://kinsengs.com/products' }, { '@type': 'ListItem', position: 3, name: cleanName(product.name), item: `https://kinsengs.com/products/${product.slug}` }] },
    ],
  } : null, [product]);
  if (loading) return <div className="detail-loading"><span /><p>Opening the collection...</p></div>;
  if (!product) return <section className="not-found shell"><Sparkles /><h1>Product unavailable</h1><p>This link may have changed or the product may be receiving an update.</p><Link className="button" to="/products"><ArrowLeft size={17} /> Back to collection</Link></section>;
  const related = products.filter((p) => p.id !== product.id && p.categories?.[0]?.slug === product.categories?.[0]?.slug).slice(0, 3);
  return (
    <div className="detail-page" ref={root}>
      <SEO title={cleanName(product.name)} description={`Explore ${cleanName(product.name)} from the Kinsengs wellness collection. Review product information and call (346) 347-5571 for personal guidance.`} path={`/products/${product.slug}`} image={product.images?.[0]?.src} schema={productSchema} />
      <div className="breadcrumbs shell"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><strong>{cleanName(product.name)}</strong></div>
      <section className="product-detail shell">
        <div className="detail-gallery"><div className="gallery-stage"><span className="gallery-note">Kinsengs curated selection</span><img src={product.images?.[0]?.src} alt={cleanName(product.name)} onError={handleProductImageError} /><div className="gallery-index"><span>01</span><i /><small>Product view</small></div></div></div>
        <div className="detail-summary">
          <span className="eyebrow">{categoryName(product)}</span>
          <h1>{cleanName(product.name)}</h1>
          {product.sku && <span className="sku">Product code · {product.sku}</span>}
          <p className="detail-lead">Part of the Kinsengs wellness collection. Explore the ingredients and speak with us to better understand whether this product fits your needs.</p>
          <div className="detail-points"><span><Check /> Clear product information</span><span><Check /> Personal product guidance</span><span><Check /> No online checkout</span></div>
          <a className="button detail-cta" href="tel:+13463475571"><Phone size={18} /> Call us: (346) 347-5571</a>
          <p className="micro-note"><ShieldCheck /> Consult a healthcare professional before use, especially if you take medication or have a health condition that requires monitoring.</p>
          <div className="detail-concierge-card"><span><Headphones /></span><div><small>Prefer a personal conversation?</small><strong>Speak directly with Kinsengs</strong><button onClick={onConsult}>Request a callback <ArrowRight size={14} /></button></div></div>
        </div>
      </section>

      <section className="detail-highlights"><div className="shell"><article><Leaf /><span>Information</span><h3>Selected ingredients</h3></article><article><ShieldCheck /><span>Choice</span><h3>Responsible guidance</h3></article><article><Sparkles /><span>Experience</span><h3>Thoughtful care</h3></article></div></section>

      <section className="detail-information shell">
        <div className="detail-tabs"><button className={tab === 'detail' ? 'active' : ''} onClick={() => setTab('detail')}>Product information</button><button className={tab === 'guide' ? 'active' : ''} onClick={() => setTab('guide')}>Directions & cautions</button></div>
        {tab === 'detail' ? <div className="wp-content" dangerouslySetInnerHTML={{ __html: safeDescription }} /> : <div className="guide-content"><h2>Use with understanding</h2><p>Follow the directions on the label or published product information. Do not exceed the recommended serving. Stop use and seek professional advice if you experience an unwanted reaction.</p><ul><li>Review all ingredients carefully if you have known allergies.</li><li>Consult a professional if you are pregnant, nursing, receiving treatment, or taking medication.</li><li>Store as directed on the packaging and keep out of reach of children.</li></ul></div>}
        <div className="health-disclaimer"><strong>These products are not medicines and are not intended to replace medical treatment.</strong><p>Individual results may vary. Website content is provided for educational purposes only and is not intended to diagnose, treat, cure, or prevent disease.</p></div>
      </section>

      <section className="detail-editorial"><div className="detail-editorial-image"><img src="/images/botanical-editorial.jpg" alt="Selected ginseng, reishi and botanical ingredients" loading="lazy" /></div><div className="detail-editorial-copy"><BadgeCheck /><span className="eyebrow">Clarity before choice</span><h2>Know what belongs in your ritual.</h2><p>Every Kinsengs conversation starts with the same principle: understand the label, consider your individual needs, and make room for professional advice when it matters.</p><a href="tel:+13463475571" className="text-link"><Phone size={15} /> Call our concierge</a></div></section>

      <section className="detail-consult"><div><span className="eyebrow light">Kinsengs Concierge</span><h2>Would you like to learn more about {cleanName(product.name)}?</h2><p>We are here to answer questions about ingredients, labeled use, and important considerations.</p></div><a className="button button-light" href="tel:+13463475571"><Phone size={17} /> Call (346) 347-5571</a></section>

      {!!related.length && <section className="related shell"><div className="section-heading"><div><span className="eyebrow">You may also like</span><h2>Explore similar choices</h2></div></div><div className="product-grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Leaf, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import gsap from 'gsap';
import { ProductCard, categoryName, cleanName, formatProductPrice, handleProductImageError } from '../components/ProductCard';
import { useProducts } from '../useProducts';
import { SEO } from '../components/SEO';

export function ProductDetail() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const root = useRef(null);
  const zoomLens = useRef(null);
  const [tab, setTab] = useState('detail');
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => {
    if (product) {
      const ctx = gsap.context(() => {
        gsap.from('.detail-gallery', { x: -45, opacity: 0, duration: 1, ease: 'power3.out' });
        gsap.fromTo('.detail-summary > *:not(.detail-cta):not(.detail-contact-button)', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .85, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform' });
        gsap.from('.detail-highlights article', { y: 35, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.detail-highlights', start: 'top 80%' } });
        gsap.fromTo('.detail-editorial-image img', { scale: 1.12, yPercent: -3 }, { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.detail-editorial', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.detail-editorial-copy > *', { y: 45, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.detail-editorial-copy', start: 'top 75%' } });
      }, root);
      return () => ctx.revert();
    }
  }, [product]);
  useEffect(() => {
    setActiveImage(0);
    zoomLens.current?.classList.remove('is-visible');
  }, [product?.id]);
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
  const price = formatProductPrice(product);
  const regularPrice = product.on_sale ? formatProductPrice(product, 'regular_price') : null;
  const images = product.images?.filter((image) => image?.src) || [];
  const selectedImage = images[activeImage] || images[0];
  const selectImage = (index) => {
    setActiveImage(index);
    zoomLens.current?.classList.remove('is-visible');
  };
  const moveZoomLens = (event) => {
    const lens = zoomLens.current;
    if (!lens || !selectedImage) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    lens.style.left = `${event.clientX - bounds.left}px`;
    lens.style.top = `${event.clientY - bounds.top}px`;
    lens.style.backgroundPosition = `${x}% ${y}%`;
  };
  return (
    <div className="detail-page" ref={root}>
      <SEO title={cleanName(product.name)} description={`Explore ${cleanName(product.name)} from the Kinsengs wellness collection. Review product information and call (346) 347-5571 for personal guidance.`} path={`/products/${product.slug}`} image={product.images?.[0]?.src} schema={productSchema} />
      <div className="breadcrumbs shell"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><strong>{cleanName(product.name)}</strong></div>
      <section className="product-detail shell">
        <div className="detail-gallery">
          <div
            className="gallery-stage"
            onMouseEnter={() => zoomLens.current?.classList.add('is-visible')}
            onMouseMove={moveZoomLens}
            onMouseLeave={() => zoomLens.current?.classList.remove('is-visible')}
          >
            <span className="gallery-note">Kinsengs curated selection</span>
            <img key={selectedImage?.src} src={selectedImage?.src} alt={`${cleanName(product.name)} — view ${activeImage + 1}`} onError={handleProductImageError} />
            {selectedImage && <div ref={zoomLens} className="gallery-zoom-lens" style={{ backgroundImage: `url(${selectedImage.src})` }} aria-hidden="true" />}
            <div className="gallery-index"><span>{String(activeImage + 1).padStart(2, '0')}</span><i /><small>{String(images.length || 1).padStart(2, '0')} product views</small></div>
          </div>
          {images.length > 1 && <div className="gallery-thumbnails" aria-label="Product images">
            {images.map((image, index) => <button key={`${image.id || image.src}-${index}`} type="button" className={activeImage === index ? 'active' : ''} onMouseEnter={() => selectImage(index)} onFocus={() => selectImage(index)} onClick={() => selectImage(index)} aria-label={`Show product view ${index + 1}`} aria-pressed={activeImage === index}><img src={image.thumbnail || image.src} alt="" onError={handleProductImageError} /></button>)}
          </div>}
        </div>
        <div className="detail-summary">
          <span className="eyebrow">{categoryName(product)}</span>
          <h1>{cleanName(product.name)}</h1>
          {product.sku && <span className="sku">Product code · {product.sku}</span>}
          {price && <div className="detail-price">{regularPrice && <del>{regularPrice}</del>}<strong>{price}</strong></div>}
          <p className="detail-lead">Part of the Kinsengs wellness collection. Explore the ingredients and speak with us to better understand whether this product fits your needs.</p>
          <div className="detail-points"><span><Check /> Clear product information</span><span><Check /> Personal product guidance</span><span><Check /> No online checkout</span></div>
          <a className="button detail-cta" href="tel:+13463475571"><Phone size={18} /> Call us: (346) 347-5571</a>
          <a className="detail-contact-button" href="tel:+13463475571">Contact Kinsengs <ArrowRight size={17} /></a>
          <p className="micro-note"><ShieldCheck /> Consult a healthcare professional before use, especially if you take medication or have a health condition that requires monitoring.</p>
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

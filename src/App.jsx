import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUp, ChevronDown, ChevronRight, Flower2, HeartPulse, Leaf, Menu, Phone, Search, Sparkles, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { productMegaMenu } from './data';

gsap.registerPlugin(ScrollTrigger);

function SiteLoader() {
  return (
    <div className="site-loader" role="status" aria-live="polite" aria-label="Kinsengs is preparing your wellness experience">
      <div className="site-loader-content">
        <img className="site-loader-logo" src="/images/logo-kinsengs.png" alt="Kinsengs" />
        <p>The art of mindful wellness</p>
        <div className="site-loader-botanical" aria-hidden="true"><Leaf /><span /><Leaf /></div>
        <span className="site-loader-preparing">Preparing your experience</span>
      </div>
    </div>
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    const updateProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="site-scroll-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Page reading progress">
      <div className="site-scroll-progress-bar" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function ProductMegaMenu({ active = false }) {
  const [activeBrandSlug, setActiveBrandSlug] = useState(null);
  const activeBrand = productMegaMenu.find((brand) => brand.slug === activeBrandSlug);

  return (
    <div className="products-nav desktop-products-nav" onMouseLeave={() => setActiveBrandSlug(null)}>
      <Link className={active ? 'is-active' : ''} to="/products" aria-current={active ? 'page' : undefined}>Products</Link>
      <div className="mega-menu catalog-mega">
        <div className="catalog-mega-head">
          <span><Leaf size={14} /> Product houses</span>
          <Link to="/products">View complete collection <ArrowRight size={14} /></Link>
        </div>
        <div className="catalog-mega-layout">
          <div className="catalog-mega-pane catalog-mega-brands">
            <span className="catalog-mega-kicker">01 / Choose a house</span>
            <div className="catalog-brand-list">
              {productMegaMenu.map((brand, index) => (
                <button
                  className={activeBrandSlug === brand.slug ? 'is-active' : ''}
                  type="button"
                  key={brand.slug}
                  onMouseEnter={() => setActiveBrandSlug(brand.slug)}
                  onFocus={() => setActiveBrandSlug(brand.slug)}
                  onClick={() => setActiveBrandSlug(brand.slug)}
                  aria-pressed={activeBrandSlug === brand.slug}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{brand.name}</strong>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-mega-pane catalog-mega-collections">
            <span className="catalog-mega-kicker">02 / Choose a collection</span>
            {activeBrand ? <>
              <div className="catalog-mega-title"><span>{activeBrand.name}</span></div>
              <div className="catalog-collection-list">
                {activeBrand.collections.map((collection) => {
                  const Icon = collection.slug === 'beauty' ? Flower2 : HeartPulse;
                  return (
                    <Link
                      key={collection.slug}
                      to={`/products?category=${collection.slug}`}
                    >
                      <Icon size={20} />
                      <strong>{collection.name}</strong>
                      <ChevronRight size={17} />
                    </Link>
                  );
                })}
              </div>
            </> : <div className="catalog-mega-prompt"><span>01</span><p>Hover Tolip or Hearbal.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileBrandSlug, setMobileBrandSlug] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeHomeSection, setActiveHomeSection] = useState('home');
  const mobileBrand = productMegaMenu.find((brand) => brand.slug === mobileBrandSlug);
  const productsActive = location.pathname.startsWith('/products') || location.pathname.startsWith('/san-pham');
  const homeActive = location.pathname === '/' && activeHomeSection === 'home';
  const storyActive = location.pathname === '/' && activeHomeSection === 'our-story';
  const journalActive = location.pathname === '/' && activeHomeSection === 'journal';
  const closeMenu = () => {
    setOpen(false);
    setMobileProductsOpen(false);
    setMobileBrandSlug(null);
  };
  useEffect(() => {
    setOpen(false);
    setMobileProductsOpen(false);
    setMobileBrandSlug(null);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveHomeSection('home');
      return undefined;
    }
    let frame;
    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * .32;
      const storyTop = document.querySelector('#our-story')?.offsetTop ?? Infinity;
      const journalTop = document.querySelector('#journal')?.offsetTop ?? Infinity;
      setActiveHomeSection(marker >= journalTop ? 'journal' : marker >= storyTop ? 'our-story' : 'home');
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (open) document.documentElement.style.overflow = 'hidden';
    else document.documentElement.style.overflow = '';
    return () => {
      document.body.classList.remove('menu-open');
      document.documentElement.style.overflow = '';
    };
  }, [open]);
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link className="brand" to="/" aria-label="Kinsengs - Home">
        <img src="https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png" alt="Kinsengs" />
      </Link>
      <nav className={open ? 'nav-open' : ''} aria-label="Main navigation" aria-expanded={open}>
        <button className="nav-close" onClick={closeMenu} aria-label="Close menu"><X /></button>
        <Link className={homeActive ? 'is-active' : ''} to="/" onClick={closeMenu} aria-current={homeActive ? 'page' : undefined}>Home</Link>
        <ProductMegaMenu active={productsActive} />
        <div className={`mobile-products-menu ${mobileProductsOpen ? 'is-open' : ''} ${productsActive ? 'nav-active' : ''}`}>
          <button
            className="mobile-products-trigger"
            type="button"
            onClick={() => {
              setMobileProductsOpen(!mobileProductsOpen);
              if (mobileProductsOpen) setMobileBrandSlug(null);
            }}
            aria-expanded={mobileProductsOpen}
            aria-controls="mobile-products-dropdown"
          >
            <span>Products</span><ChevronDown size={22} />
          </button>
          <div className="mobile-products-dropdown" id="mobile-products-dropdown">
            <span className="mobile-products-label">Choose a house</span>
            <div className="mobile-product-brands">
              {productMegaMenu.map((brand) => (
                <button
                  className={mobileBrandSlug === brand.slug ? 'is-active' : ''}
                  type="button"
                  key={brand.slug}
                  onClick={() => setMobileBrandSlug(mobileBrandSlug === brand.slug ? null : brand.slug)}
                  aria-pressed={mobileBrandSlug === brand.slug}
                >
                  <strong>{brand.name}</strong><ChevronRight size={17} />
                </button>
              ))}
            </div>
            {mobileBrand && <div className="mobile-product-collections">
              <span>{mobileBrand.name}</span>
              {mobileBrand.collections.map((collection) => {
                const Icon = collection.slug === 'beauty' ? Flower2 : HeartPulse;
                return <Link key={collection.slug} to={`/products?category=${collection.slug}`} onClick={closeMenu}><Icon size={18} /><strong>{collection.name}</strong><ArrowRight size={15} /></Link>;
              })}
            </div>}
            <Link className="mobile-products-all" to="/products" onClick={closeMenu}>View all products <ArrowRight size={14} /></Link>
          </div>
        </div>
        <a className={storyActive ? 'is-active' : ''} href="/#our-story" onClick={closeMenu} aria-current={storyActive ? 'page' : undefined}>Our Story</a>
        <a className={journalActive ? 'is-active' : ''} href="/#journal" onClick={closeMenu} aria-current={journalActive ? 'page' : undefined}>Journal</a>
      </nav>
      <div className="header-actions">
        <Link className="icon-button" to="/products" aria-label="Search products"><Search size={19} /></Link>
        <a className="button button-small" href="tel:+13463475571"><Phone size={15} /> Call us</a>
        <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>
    </header>
  );
}

function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="floating-actions" aria-label="Quick actions">
      <a className="floating-action floating-call-action" href="tel:+13463475571" aria-label="Call Kinsengs at 346 347 5571">
        <span className="floating-action-label">Call Kinsengs</span>
        <Phone size={21} />
      </a>
      {showScrollTop && <button className="floating-action floating-scroll-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll back to top">
        <span className="floating-action-label">Back to top</span>
        <ArrowUp size={20} />
      </button>}
    </div>
  );
}

function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-call shell">
        <div className="footer-call-copy">
          <span className="eyebrow light">Kinsengs concierge</span>
          <h2>A thoughtful choice can begin with one conversation.</h2>
          <p>Ask about ingredients, labeled directions, or where to begin. Our team is here to listen and help you understand your options.</p>
        </div>
        <div className="footer-call-card">
          <div className="footer-call-card-head"><span>Personal guidance</span><Sparkles size={18} /></div>
          <a className="footer-call-number" href="tel:+13463475571" aria-label="Call Kinsengs at 346 347 5571">
            <span><small>Speak directly with us</small><strong>(346) 347-5571</strong></span>
            <span className="footer-call-icon"><Phone size={21} /></span>
          </a>
          <div className="footer-call-actions">
            <a href="tel:+13463475571">Call now <ArrowRight size={15} /></a>
            <a href="tel:+13463475571">Call for guidance</a>
          </div>
        </div>
      </div>
      <div className="footer-word" aria-hidden="true">KINSENGS</div>
      <div className="footer-top shell">
        <div className="footer-brand">
          <img src="https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png" alt="Kinsengs" />
          <p>Thoughtfully curated wellness essentials, presented with clarity and supported by personal guidance.</p>
        </div>
        <nav aria-label="Footer products">
          <h4>Explore</h4>
          <Link to="/products">All products</Link>
          <a href="/#shop-by-need">Shop by need</a>
          <a href="/#journal">Wellness journal</a>
        </nav>
        <nav aria-label="Footer company">
          <h4>Discover</h4>
          <a href="/#our-story">Our philosophy</a>
          <a href="/#testimonials">The experience</a>
          <a href="/#faq">Frequently asked questions</a>
        </nav>
        <div className="footer-contact">
          <h4>Contact & Guidance</h4>
          <a className="footer-phone-direct" href="tel:+13463475571" aria-label="Call Kinsengs at 346 347 5571">
            <span className="footer-phone-icon"><Phone size={18} /></span>
            <div className="footer-phone-info">
              <span className="footer-phone-label">Personal Concierge</span>
              <strong>(346) 347-5571</strong>
            </div>
          </a>
          <p className="footer-contact-note">We welcome all questions about ingredients and labeled directions before you choose.</p>
        </div>
      </div>
      <div className="legal shell">
        <strong>These products are not medicines and are not intended to replace medical treatment.</strong>
        <span>© {new Date().getFullYear()} Kinsengs. All rights reserved. Design by Tdtransactionsllc.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [siteLoading, setSiteLoading] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    document.body.classList.add('site-loading');
    root.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      document.body.classList.remove('site-loading');
      root.style.overflow = previousOverflow;
      setSiteLoading(false);
    }, 2000);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove('site-loading');
      root.style.overflow = previousOverflow;
    };
  }, []);
  useEffect(() => {
    const footerTween = gsap.fromTo('.footer-word', { xPercent: 4 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    return () => { footerTween.scrollTrigger?.kill(); footerTween.kill(); };
  }, []);
  return (
    <>
      {siteLoading && <SiteLoader />}
      <div className="site-view" aria-hidden={siteLoading}>
        <ScrollProgressBar />
        <ScrollManager />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/san-pham" element={<Products />} />
            <Route path="/san-pham/:slug" element={<ProductDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </>
  );
}

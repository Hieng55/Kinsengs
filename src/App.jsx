import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, ArrowRight, Bone, Eye, Flower2, HeartPulse, Leaf, Menu, MoonStar, Phone, Scale, Search, Sparkles, Wind, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { categoryMenu } from './data';

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

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
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
        <button className="nav-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <div className="products-nav desktop-products-nav">
          <Link to="/products">Products</Link>
          <div className="mega-menu">
            <div className="mega-intro"><span className="eyebrow">The collection</span><h3>Explore wellness<br />with intention.</h3><p>Begin with a need, then discover the ingredients and guidance behind every choice.</p><Link to="/products">View all products <ArrowRight size={15} /></Link></div>
            <div className="mega-categories">
              {categoryMenu.map(([slug, name, copy], index) => {
                const Icon = [Activity, Bone, Flower2, HeartPulse, Leaf, Scale, MoonStar, Eye, Wind, Leaf, Sparkles][index];
                return <Link key={slug} to={`/products?category=${slug}`}><Icon /><span><strong>{name}</strong><small>{copy}</small></span></Link>;
              })}
            </div>
          </div>
        </div>
        <Link className="mobile-products-link" to="/products" onClick={() => setOpen(false)}>Products</Link>
        <a href="/#our-story" onClick={() => setOpen(false)}>Our Story</a>
        <a href="/#journal" onClick={() => setOpen(false)}>Journal</a>
      </nav>
      <div className="header-actions">
        <Link className="icon-button" to="/products" aria-label="Search products"><Search size={19} /></Link>
        <a className="button button-small" href="tel:+13463475571"><Phone size={15} /> Call us</a>
        <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>
    </header>
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
        <nav aria-label="Footer products"><h4>Explore</h4><Link to="/products">All products</Link><a href="/#shop-by-need">Shop by need</a><a href="/#journal">Wellness journal</a></nav>
        <nav aria-label="Footer company"><h4>Discover</h4><a href="/#our-story">Our philosophy</a><a href="/#testimonials">The experience</a><a href="/#faq">Frequently asked questions</a></nav>
        <div className="footer-contact"><h4>Contact</h4><a href="tel:+13463475571">Call for personal guidance</a><small>We welcome questions before you choose.</small></div>
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
        <a className="mobile-call" href="tel:+13463475571" aria-label="Call Kinsengs"><Phone size={18} /><span>Call for guidance</span></a>
      </div>
    </>
  );
}

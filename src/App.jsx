import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, ArrowRight, Bone, Eye, Flower2, HeartPulse, Leaf, Menu, MoonStar, Phone, Scale, Search, Sparkles, Wind, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { categoryMenu } from './data';

gsap.registerPlugin(ScrollTrigger);

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      ScrollTrigger.refresh();
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

function Header({ onConsult }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link className="brand" to="/" aria-label="Kinsengs - Home">
        <img src="https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png" alt="Kinsengs" />
      </Link>
      <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">
        <button className="nav-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <div className="products-nav">
          <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
          <div className="mega-menu">
            <div className="mega-intro"><span className="eyebrow">The collection</span><h3>Explore wellness<br />with intention.</h3><p>Begin with a need, then discover the ingredients and guidance behind every choice.</p><Link to="/products">View all products <ArrowRight size={15} /></Link></div>
            <div className="mega-categories">
              {categoryMenu.map(([slug, name, copy], index) => {
                const Icon = [Activity, Bone, Flower2, HeartPulse, Leaf, Scale, MoonStar, Eye, Wind, Leaf, Sparkles][index];
                return <Link key={slug} to={`/products?category=${slug}`} onClick={() => setOpen(false)}><Icon /><span><strong>{name}</strong><small>{copy}</small></span></Link>;
              })}
            </div>
          </div>
        </div>
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

function Footer({ onConsult }) {
  return (
    <footer id="footer" className="footer">
      <div className="footer-call shell"><div><span className="eyebrow light">A conversation can bring clarity</span><h2>Wellness feels more personal when someone listens.</h2></div><a href="tel:+13463475571"><span>Call our concierge</span><strong>(346) 347-5571</strong><Phone /></a></div>
      <div className="footer-word" aria-hidden="true">KINSENGS</div>
      <div className="footer-top shell">
        <div className="footer-brand">
          <img src="https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png" alt="Kinsengs" />
          <p>Wellness is an art. Kinsengs curates thoughtful essentials for a life of lasting vitality.</p>
        </div>
        <div><h4>Explore</h4><Link to="/products">All products</Link><a href="/#shop-by-need">Shop by need</a><a href="/#our-story">About Kinsengs</a></div>
        <div><h4>Support</h4><a className="footer-phone" href="tel:+13463475571">(346) 347-5571</a><button onClick={onConsult}>Request a callback</button><a href="mailto:info@kinsengs.com">info@kinsengs.com</a><a href="/#faq">Frequently asked questions</a></div>
        <div className="footer-note"><Sparkles size={22} /><p>Information on this website is for educational purposes and does not replace professional medical advice.</p></div>
      </div>
      <div className="legal shell">
        <strong>These products are not medicines and are not intended to replace medical treatment.</strong>
        <span>© {new Date().getFullYear()} Kinsengs. All rights reserved.</span>
      </div>
    </footer>
  );
}

function ConsultPanel({ open, onClose }) {
  const panel = useRef(null);
  useEffect(() => {
    if (open) gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: .65, ease: 'power4.out' });
  }, [open]);
  if (!open) return null;
  return (
    <div className="consult-layer" role="dialog" aria-modal="true" aria-label="Request personal guidance">
      <button className="consult-backdrop" onClick={onClose} aria-label="Close" />
      <aside className="consult-panel" ref={panel}>
        <button className="panel-close" onClick={onClose} aria-label="Close"><X /></button>
        <span className="eyebrow">Personal guidance</span>
        <h2>Begin with a conversation.</h2>
        <p>Tell us what you are looking for. The Kinsengs team will help you understand suitable products and their labeled directions.</p>
        <a className="call-primary" href="tel:+13463475571"><span><Phone /></span><div><small>Call for guidance</small><strong>(346) 347-5571</strong></div><ArrowRight /></a>
        <div className="contact-divider"><span>or request a callback</span></div>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:info@kinsengs.com?subject=${encodeURIComponent('Consultation request from Kinsengs website')}&body=${encodeURIComponent(`Name: ${e.currentTarget.name.value}\nPhone: ${e.currentTarget.phone.value}\nWhat I am interested in: ${e.currentTarget.need.value}`)}`; }}>
          <label>Full name<input name="name" required placeholder="Your name" /></label>
          <label>Phone number<input name="phone" required inputMode="tel" placeholder="(000) 000-0000" /></label>
          <label>What are you interested in?<textarea name="need" required placeholder="A product or wellness need you would like to discuss..." /></label>
          <button className="button" type="submit">Send request <ArrowRight size={17} /></button>
        </form>
        <p className="privacy-note">By submitting, you agree that Kinsengs may contact you for product guidance.</p>
      </aside>
    </div>
  );
}

export default function App() {
  const [consultOpen, setConsultOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = consultOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [consultOpen]);
  useEffect(() => {
    const footerTween = gsap.fromTo('.footer-word', { xPercent: 4 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    return () => { footerTween.scrollTrigger?.kill(); footerTween.kill(); };
  }, []);
  return (
    <>
      <ScrollManager />
      <Header onConsult={() => setConsultOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home onConsult={() => setConsultOpen(true)} />} />
          <Route path="/products" element={<Products onConsult={() => setConsultOpen(true)} />} />
          <Route path="/products/:slug" element={<ProductDetail onConsult={() => setConsultOpen(true)} />} />
          <Route path="/san-pham" element={<Products onConsult={() => setConsultOpen(true)} />} />
          <Route path="/san-pham/:slug" element={<ProductDetail onConsult={() => setConsultOpen(true)} />} />
          <Route path="*" element={<Home onConsult={() => setConsultOpen(true)} />} />
        </Routes>
      </main>
      <Footer onConsult={() => setConsultOpen(true)} />
      <a className="mobile-call" href="tel:+13463475571" aria-label="Call Kinsengs"><Phone size={18} /><span>Call for guidance</span></a>
      <ConsultPanel open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}

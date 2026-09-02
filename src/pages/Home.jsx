import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowDown, ArrowRight, BadgeCheck, Bone, ChevronLeft, ChevronRight, Flower2, Leaf, Microscope, MoonStar, Phone, Quote, ShieldCheck, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { heroSlides, needMap, testimonialPreviews } from '../data';
import { useProducts } from '../useProducts';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': 'https://kinsengs.com/#organization', name: 'Kinsengs', url: 'https://kinsengs.com/', logo: 'https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png', telephone: '+1-346-347-5571', email: 'info@kinsengs.com' },
    { '@type': 'WebSite', '@id': 'https://kinsengs.com/#website', url: 'https://kinsengs.com/', name: 'Kinsengs', publisher: { '@id': 'https://kinsengs.com/#organization' }, inLanguage: 'en-US' },
    { '@type': 'WebPage', '@id': 'https://kinsengs.com/#webpage', url: 'https://kinsengs.com/', name: 'Kinsengs — The Art of Mindful Wellness', isPartOf: { '@id': 'https://kinsengs.com/#website' }, about: { '@id': 'https://kinsengs.com/#organization' }, inLanguage: 'en-US' },
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'Can I purchase directly from this website?', acceptedAnswer: { '@type': 'Answer', text: 'This website is designed for product discovery and personal guidance. Call Kinsengs before making a decision.' } },
      { '@type': 'Question', name: 'How do I choose the right product?', acceptedAnswer: { '@type': 'Answer', text: 'Begin with a wellness need and consult a healthcare professional if you are receiving treatment, pregnant, nursing, or taking medication.' } },
      { '@type': 'Question', name: 'Can a dietary supplement replace medicine?', acceptedAnswer: { '@type': 'Answer', text: 'No. Dietary supplements are not medicines and are not intended to replace medical treatment.' } },
    ] },
  ],
};

const faq = [
  ['Can I purchase directly from this website?', 'This website is designed to help you explore and understand each product. When something interests you, call Kinsengs for personal guidance before making a decision.'],
  ['How do I choose the right product?', 'Begin with a wellness need or tell us about your goals and current routine. Consult a healthcare professional if you are receiving treatment, pregnant, nursing, or taking medication.'],
  ['Where does the product information come from?', 'Names, images, ingredients, and directions are synchronized from the official Kinsengs catalog. Benefits are presented only within the scope of published product information.'],
  ['Can a dietary supplement replace medicine?', 'No. Dietary supplements are not medicines and are not intended to replace medical treatment.'],
];

export function Home({ onConsult }) {
  const root = useRef(null);
  const [slide, setSlide] = useState(0);
  const { products, loading } = useProducts();
  useEffect(() => {
    const timer = setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6500);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => gsap.from(el, { y: 48, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
      gsap.utils.toArray('.need-card').forEach((el, i) => gsap.from(el, { y: 32, duration: .75, delay: i * .045, scrollTrigger: { trigger: el, start: 'top 90%' } }));
      gsap.to('.story-orbit', { rotate: 140, ease: 'none', scrollTrigger: { trigger: '.story-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.editorial-frame', { clipPath: 'inset(12% 12% 12% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.editorial-section', start: 'top 85%', end: 'center 35%', scrub: 1 } });
      gsap.fromTo('.editorial-image', { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.editorial-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.ritual-photo img', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.ritual-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.from('.intro-index', { rotate: -25, scale: .7, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.intro-section', start: 'top 78%' } });
      gsap.fromTo('.story-visual img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.story-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.consult-banner', { backgroundPosition: '50% 15%' }, { backgroundPosition: '50% 70%', ease: 'none', scrollTrigger: { trigger: '.consult-banner', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.intro-section', { backgroundPosition: '50% 0%' }, { backgroundPosition: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.intro-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.consult-phone', { rotate: -12, scale: .78 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.consult-banner', start: 'top 85%', end: 'center 45%', scrub: 1 } });
      gsap.to('.standards-particle', { ease: 'none', motionPath: { path: '#standards-path', align: '#standards-path', alignOrigin: [.5, .5], autoRotate: true }, scrollTrigger: { trigger: '.standards-section', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      const splitInstances = gsap.utils.toArray('.split-title').map((element) => {
        const split = new SplitText(element, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
        gsap.from(split.words, { yPercent: 115, duration: 1, stagger: .025, ease: 'power4.out', scrollTrigger: { trigger: element, start: 'top 82%' } });
        return split;
      });
      root.current._splitInstances = splitInstances;
    }, root);
    media.add('(min-width: 901px)', () => {
      const track = root.current?.querySelector('.testimonial-track');
      const viewport = root.current?.querySelector('.testimonial-viewport');
      if (!track || !viewport) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * .12);
      gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: '.testimonials', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      gsap.utils.toArray('.layered-entry').forEach((panel) => gsap.fromTo(panel,
        { clipPath: 'inset(0 2.5% 0 2.5% round 52px 52px 0 0)' },
        { clipPath: 'inset(0 0% 0 0% round 0px)', ease: 'none', scrollTrigger: { trigger: panel, start: 'top 96%', end: 'top 52%', scrub: .7 } },
      ));
    });
    return () => { root.current?._splitInstances?.forEach((split) => split.revert()); media.revert(); ctx.revert(); };
  }, []);
  useEffect(() => {
    if (loading || !root.current) return;
    const cards = root.current.querySelectorAll('.home-products .product-card');
    if (!cards.length) return;
    const animation = gsap.from(cards, { y: 80, opacity: 0, rotate: 1.5, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.home-products', start: 'top 83%' } });
    ScrollTrigger.refresh();
    return () => { animation.scrollTrigger?.kill(); animation.kill(); };
  }, [loading]);
  return (
    <div ref={root}>
      <SEO title="Kinsengs — The Art of Mindful Wellness" description="Explore Kinsengs' curated wellness collection by need, understand every ingredient, and call for personal product guidance." path="/" schema={homeSchema} />
      <section className="hero">
        <div className="hero-slides">
          {heroSlides.map((item, index) => (
            <picture key={item.desktop} className={`hero-picture ${slide === index ? 'active' : ''}`}>
              <source media="(max-width: 720px)" srcSet={item.mobile} />
              <img src={item.desktop} alt="The Kinsengs wellness experience" />
            </picture>
          ))}
        </div>
        <div className="hero-shade" />
        <div className="hero-copy shell">
          <span className="eyebrow light">{heroSlides[slide].eyebrow}</span>
          <h1 key={`title-${slide}`}>{heroSlides[slide].title}</h1>
          <p>{heroSlides[slide].copy}</p>
          <div className="hero-buttons">
            <Link className="button button-light" to="/products">Explore the collection <ArrowRight size={17} /></Link>
            <a className="button button-ghost" href="tel:+13463475571"><Phone size={17} /> Call Kinsengs</a>
          </div>
        </div>
        <div className="hero-controls">
          <button onClick={() => setSlide((slide - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide"><ChevronLeft /></button>
          <span>0{slide + 1}<i /><small>0{heroSlides.length}</small></span>
          <button onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Next slide"><ChevronRight /></button>
        </div>
        <a href="#shop-by-need" className="scroll-cue">Discover <ArrowDown size={15} /></a>
      </section>

      <div className="stack-sequence">
      <section className="editorial-section stack-panel">
        <div className="editorial-frame"><img className="editorial-image" src="/images/botanical-editorial.jpg" alt="Ginseng, red reishi, cordyceps and selected botanicals in the Kinsengs collection" loading="lazy" /></div>
        <div className="editorial-content shell" data-reveal><div className="editorial-number">01 — ORIGIN</div><div><span className="eyebrow light">The intelligence of nature</span><h2>Ancient botanicals,<br />seen with modern clarity.</h2><p>We look beyond beautiful packaging. Ingredient identity, serving information, origin, and responsible use all shape how a product earns its place in the Kinsengs collection.</p><Link className="button button-light" to="/products">Explore ingredients <ArrowRight size={17} /></Link></div></div>
      </section>

      <section id="approach" className="intro-section stack-panel layered-entry">
        <div className="shell intro-inner"><div className="intro-index"><span>02</span><small>Our point<br />of view</small></div><div className="intro-body"><span className="eyebrow light">Understand before you choose</span><div className="intro-grid"><h2 className="split-title">Wellness is never<br />one-size-fits-all.</h2><div><p>Kinsengs believes a good choice begins with understanding. We organize products by need, present information clearly, and remain available for every question along the way.</p><div className="intro-values"><span>Clarity</span><span>Intention</span><span>Individuality</span></div><Link className="text-link" to="/products">Find your selection <ArrowRight size={16} /></Link></div></div></div></div>
      </section>

      <section id="shop-by-need" className="needs-section stack-panel layered-entry">
        <div className="shell">
          <div className="section-heading" data-reveal><div><span className="eyebrow">An intuitive approach</span><h2>Begin with what matters to you</h2></div><p>Explore the collection by wellness goal and narrow your choices with clarity and ease.</p></div>
          <div className="needs-grid">
            {needMap.map(([slug, title, copy, image], index) => { const Icon = [Activity, Bone, Flower2, MoonStar][index]; return <Link key={slug} to={`/products?category=${slug}`} className="need-card" style={{ '--need-image': `url("${image}")` }}><div className="need-top"><span>0{index + 1}</span><Icon /></div><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight /></Link>; })}
          </div>
        </div>
      </section>
      </div>

      <section className="products-section shell">
        <div className="section-heading" data-reveal><div><span className="eyebrow">Featured collection</span><h2>Curated for your wellness ritual</h2></div><Link className="outline-button" to="/products">View all <ArrowRight size={16} /></Link></div>
        <div className="product-grid home-products">
          {loading ? [...Array(4)].map((_, i) => <div className="product-skeleton" key={i} />) : products.slice(0, 4).map((product, i) => <ProductCard key={product.id} product={product} featured={i === 0} />)}
        </div>
      </section>

      <section id="our-story" className="story-section">
        <div className="story-visual" data-reveal>
          <img src="https://kinsengs.com/wp-content/uploads/2026/09/tolip-scaled.png" alt="The Kinsengs philosophy" />
          <span className="story-caption">Rooted in nature · Guided by clarity</span>
          <div className="story-orbit"><span>MINDFUL WELLNESS • KINSENGS • </span></div>
        </div>
        <div className="story-copy" data-reveal><span className="eyebrow light">The Kinsengs philosophy</span><h2 className="split-title">Honor nature's wisdom. Choose with understanding.</h2><p>We seek a thoughtful balance between time-honored ingredients and the clarity expected of modern wellness—so every product is not only beautiful on the shelf, but easier to understand and choose.</p><div className="story-facts"><span><strong>01</strong> Clear information</span><span><strong>02</strong> Personal guidance</span></div><button className="button button-light" onClick={onConsult}>Speak with us <ArrowRight size={17} /></button></div>
      </section>

      <section id="standards" className="standards-section">
        <div className="shell standards-inner"><div className="section-heading centered standards-heading" data-reveal><span className="eyebrow">Our standard of selection</span><h2>Three principles. One considered choice.</h2><p>Simple standards that keep every conversation clear.</p><div className="standards-orbit"><svg viewBox="0 0 240 120" aria-hidden="true"><path id="standards-path" d="M18,78 C55,8 178,4 222,66 C190,116 75,128 18,78" /></svg><Sparkles className="standards-particle" /><div><strong>3</strong><span>selection<br />principles</span></div></div></div>
        <div className="standards-grid">
          <article data-reveal><Leaf /><span>01</span><h3>Clear provenance</h3><p>We prioritize transparent information about ingredients, amounts, and origin.</p></article>
          <article data-reveal><Microscope /><span>02</span><h3>Grounded information</h3><p>Product information remains within its published scope, without exaggerated promises.</p></article>
          <article data-reveal><ShieldCheck /><span>03</span><h3>Responsible guidance</h3><p>We encourage choices that respect individual needs and professional advice.</p></article>
        </div></div>
      </section>

      <section className="ritual-section">
        <div className="ritual-art ritual-photo"><img src="/images/wellness-ritual.jpg" alt="A mindful morning wellness ritual" loading="lazy" /><div className="ritual-seal"><BadgeCheck /><span>Guidance before choice</span></div></div>
        <div className="ritual-copy" data-reveal><span className="eyebrow">A three-step journey</span><h2>A ritual shaped around you.</h2><ol><li><span>01</span><div><h3>Share your needs</h3><p>Tell us what matters to you and about your current routine.</p></div></li><li><span>02</span><div><h3>Understand your options</h3><p>Explore ingredients, labeled directions, and important considerations.</p></div></li><li><span>03</span><div><h3>Continue with intention</h3><p>Observe how a product fits and seek professional advice when needed.</p></div></li></ol><button className="button" onClick={onConsult}>Request guidance <ArrowRight size={17} /></button></div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="shell testimonial-heading" data-reveal><div><span className="eyebrow light">The Kinsengs experience</span><h2 className="split-title">Considered choices.<br />Personal conversations.</h2></div><p>We value clarity, calm, and guidance that never feels rushed.</p></div>
        <div className="testimonial-viewport"><div className="testimonial-track">
          {testimonialPreviews.map((item, index) => <article key={item.quote} className="testimonial-card"><div className="review-top"><Quote /><div aria-label="Five stars">{[...Array(5)].map((_, i) => <Star key={i} />)}</div></div><blockquote>“{item.quote}”</blockquote><footer><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.name}</strong><small>{item.context}</small></div></footer><em>Preview content — replace with verified customer feedback before publication.</em></article>)}
        </div></div>
      </section>

      <section id="journal" className="journal shell">
        <div className="section-heading" data-reveal><div><span className="eyebrow">The Kinsengs Journal</span><h2>Understand more. Live well.</h2></div><span className="journal-mark">K.</span></div>
        <div className="journal-grid">
          <article className="journal-main" data-reveal><div className="journal-image"><img src="https://kinsengs.com/wp-content/uploads/2026/09/mv-scaled.png" alt="A mindful wellness ritual" /></div><span>Wellness guide · 6 min read</span><h3>Where does a sustainable wellness ritual begin?</h3><p>You do not need to change everything in one day. One well-considered choice, practiced consistently, can be a more meaningful beginning.</p></article>
          <div className="journal-list"><article data-reveal><span>Ingredient knowledge</span><h3>Reading a supplement label: five details worth noticing</h3><ArrowRight /></article><article data-reveal><span>Living in balance</span><h3>Why nutritional needs change throughout different stages of life</h3><ArrowRight /></article><article data-reveal><span>Proactive care</span><h3>When should you consult a professional before use?</h3><ArrowRight /></article></div>
        </div>
      </section>

      <section id="concierge" className="consult-banner" data-reveal><div className="consult-number">05</div><div className="consult-copy"><Sparkles /><span className="eyebrow light">Kinsengs Concierge</span><h2 className="split-title">Not sure where<br />to begin?</h2><p>A brief conversation can bring clarity to your next choice.</p></div><a className="consult-phone" href="tel:+13463475571"><span>Speak with us</span><strong>(346)<br />347-5571</strong><Phone /></a></section>

      <section id="faq" className="faq shell"><div data-reveal><span className="eyebrow">Good to know</span><h2>Frequently asked questions</h2><p>If your question is not answered here, the Kinsengs team is always ready to listen.</p></div><div className="faq-list">{faq.map(([q, a]) => <FaqItem key={q} question={q} answer={a} />)}</div></section>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return <article className={open ? 'open' : ''}><button onClick={() => setOpen(!open)}><span>{question}</span><span>{open ? '−' : '+'}</span></button><div className="faq-answer"><p>{answer}</p></div></article>;
}

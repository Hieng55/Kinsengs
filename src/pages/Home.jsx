import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowDown, ArrowRight, BadgeCheck, Bone, ChevronLeft, ChevronRight, Flower2, MoonStar, Phone, Quote, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { heroSlides, needMap, testimonialPreviews } from '../data';
import { useProducts } from '../useProducts';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger, SplitText);

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': 'https://kinsengs.com/#organization', name: 'Kinsengs', url: 'https://kinsengs.com/', logo: 'https://kinsengs.com/wp-content/uploads/2026/09/logo-Kinsengs-1.png', telephone: '+1-346-347-5571' },
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

export function Home() {
  const root = useRef(null);
  const [slide, setSlide] = useState(0);
  const [mobileCarousel, setMobileCarousel] = useState(() => window.innerWidth <= 900 || window.matchMedia('(hover: none), (pointer: coarse)').matches);
  const { products, loading } = useProducts();
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setMobileCarousel(window.innerWidth <= 900 || mq.matches);
    const listener = () => update();
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else mq.addListener(listener);
    window.addEventListener('resize', update);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', listener); else mq.removeListener(listener); window.removeEventListener('resize', update); };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6500);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { duration: 1, ease: 'power4.out' } })
          .from('.hero-copy > *', { y: 45, autoAlpha: 0, stagger: .09 })
          .from('.hero-controls, .scroll-cue', { y: 20, autoAlpha: 0, stagger: .08 }, '-=.6');
        gsap.utils.toArray('[data-reveal]').filter((el) => !el.closest('.story-section, .ritual-section, .journal-grid')).forEach((el) => gsap.from(el, { y: 48, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', fastScrollEnd: true } }));
        gsap.from('.need-card', { y: 38, duration: .85, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.needs-grid', start: 'top 90%', fastScrollEnd: true } });
        gsap.fromTo('.editorial-frame', { clipPath: 'inset(12% 12% 12% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.editorial-section', start: 'top 85%', end: 'center 35%', scrub: 1 } });
        gsap.fromTo('.editorial-image', { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.editorial-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.intro-index', { rotate: -25, scale: .7, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.intro-section', start: 'top 78%', fastScrollEnd: true } });
        gsap.fromTo('.intro-section', { backgroundPosition: '50% 0%' }, { backgroundPosition: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.intro-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });

        gsap.timeline({ scrollTrigger: { trigger: '.story-section', start: 'top 82%', fastScrollEnd: true } })
          .from('.story-heading > *', { y: 28, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' })
          .from('.story-visual', { y: 55, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=.55')
          .from('.story-narrative > *', { y: 24, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out' }, '-=.72')
          .from('.story-principle', { y: 28, opacity: 0, duration: .7, stagger: .09, ease: 'power3.out' }, '-=.35')
          .from('.story-promise > *', { y: 24, opacity: 0, duration: .75, stagger: .08, ease: 'power3.out' }, '-=.3');
        gsap.fromTo('.story-visual img', { scale: 1.1, yPercent: -2 }, { scale: 1.04, yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.story-section', start: 'top bottom', end: 'bottom top', scrub: .8 } });

        gsap.timeline({ scrollTrigger: { trigger: '.ritual-section', start: 'top 82%', end: 'bottom 42%', scrub: .65 } })
          .fromTo('.ritual-photo img', { scale: 1.18, yPercent: -4 }, { scale: 1.08, yPercent: 4, ease: 'none' }, 0)
          .from('.ritual-seal', { scale: .55, rotate: -24, autoAlpha: 0, ease: 'back.out(1.5)' }, .05)
          .from('.ritual-copy > .eyebrow, .ritual-copy > h2', { x: 55, autoAlpha: 0, stagger: .08, ease: 'power3.out' }, .08)
          .from('.ritual-copy li', { x: 65, autoAlpha: 0, stagger: .12, ease: 'power3.out' }, .16)
          .from('.ritual-copy > .button', { y: 16, ease: 'power3.out' }, .16);

        gsap.fromTo('.journal-image', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'power4.inOut', scrollTrigger: { trigger: '.journal-image', start: 'top 88%', fastScrollEnd: true } });
        gsap.fromTo('.journal-image img', { scale: 1.18, yPercent: -5 }, { scale: 1.06, yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.journal', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from('.journal-list article', { x: 70, autoAlpha: 0, stagger: .14, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.journal-list', start: 'top 82%', fastScrollEnd: true } });
        gsap.fromTo('.consult-banner', { backgroundPosition: '50% 15%' }, { backgroundPosition: '50% 70%', ease: 'none', scrollTrigger: { trigger: '.consult-banner', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.consult-phone', { rotate: -12, scale: .78 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.consult-banner', start: 'top 85%', end: 'center 45%', scrub: 1 } });

        const splitInstances = gsap.utils.toArray('.split-title').map((element) => {
          const split = new SplitText(element, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
          gsap.from(split.words, { yPercent: 115, duration: 1, stagger: .025, ease: 'power4.out', scrollTrigger: { trigger: element, start: 'top 82%', fastScrollEnd: true } });
          return split;
        });
        root.current._splitInstances = splitInstances;
      });
    }, root);
    media.add('(min-width: 1001px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const track = root.current?.querySelector('.testimonial-track');
      const viewport = root.current?.querySelector('.testimonial-viewport');
      if (!track || !viewport) return;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const horizontal = gsap.timeline({ scrollTrigger: { trigger: '.testimonials', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: true, invalidateOnRefresh: true } });
      horizontal.to(track, { x: () => -distance(), duration: 1, ease: 'none' }, 0)
        .fromTo('.testimonial-card', { y: (i) => i % 2 ? 35 : 0, rotate: (i) => i % 2 ? 1.8 : -1.2 }, { y: 0, rotate: 0, stagger: .08, ease: 'none' }, 0);
      gsap.utils.toArray('.layered-entry').forEach((panel) => gsap.fromTo(panel,
        { clipPath: 'inset(0 2.5% 0 2.5% round 52px 52px 0 0)' },
        { clipPath: 'inset(0 0% 0 0% round 0px)', ease: 'none', scrollTrigger: { trigger: panel, start: 'top 96%', end: 'top 52%', scrub: .7 } },
      ));
    });
    return () => { root.current?._splitInstances?.forEach((split) => split.revert()); media.revert(); ctx.revert(); };
  }, []);
  useEffect(() => {
    if (loading || !root.current) return;
    const viewport = root.current.querySelector('.home-product-viewport');
    const track = root.current.querySelector('.home-products');
    const cards = root.current.querySelectorAll('.home-products .product-card');
    if (!viewport || !track) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mobileCarousel) {
      gsap.set(cards, { clearProps: 'opacity,transform' });
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
      return () => { window.removeEventListener('resize', onResize); ScrollTrigger.refresh(); };
    }
    let animation;
    const revealTrigger = cards.length && !reducedMotion ? ScrollTrigger.create({
      trigger: track,
      start: 'top 86%',
      once: true,
      onEnter: () => {
        animation = gsap.fromTo(cards, { y: 70, opacity: .15, rotateY: 8, scale: .96, transformPerspective: 1000 }, { y: 0, opacity: 1, rotateY: 0, scale: 1, stagger: .08, duration: 1, ease: 'power4.out', clearProps: 'opacity,transform' });
      },
    }) : null;
    let slideTween;
    let slideIndex = 0;
    let direction = 1;
    let pointerPaused = false;
    let focusPaused = false;
    const moveTrack = () => {
      const maxDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (!maxDistance) return;
      let lastIndex = [...cards].findIndex((card) => card.offsetLeft >= maxDistance - 1);
      if (lastIndex < 0) lastIndex = cards.length - 1;
      if (slideIndex >= lastIndex) direction = -1;
      else if (slideIndex <= 0) direction = 1;
      slideIndex += direction;
      const target = Math.min(cards[slideIndex]?.offsetLeft || 0, maxDistance);
      slideTween?.kill();
      slideTween = gsap.to(track, { x: -target, duration: .9, ease: 'power3.inOut', overwrite: 'auto' });
    };
    const autoSlide = !reducedMotion && cards.length > 1 ? window.setInterval(() => {
      if (!pointerPaused && !focusPaused && !document.hidden) moveTrack();
    }, 3800) : null;
    const pauseForPointer = () => { pointerPaused = true; };
    const resumeForPointer = () => { pointerPaused = false; };
    const revealFocusedCard = (event) => {
      focusPaused = true;
      const card = event.target.closest('.product-card');
      if (!card) return;
      const cardIndex = [...cards].indexOf(card);
      const maxDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      slideIndex = Math.max(0, cardIndex);
      slideTween?.kill();
      gsap.set(track, { x: -Math.min(card.offsetLeft, maxDistance) });
    };
    const resumeAfterFocus = (event) => { if (!viewport.contains(event.relatedTarget)) focusPaused = false; };
    const resetTrack = () => {
      slideIndex = 0;
      direction = 1;
      slideTween?.kill();
      gsap.set(track, { x: 0 });
    };
    viewport.addEventListener('mouseenter', pauseForPointer);
    viewport.addEventListener('mouseleave', resumeForPointer);
    viewport.addEventListener('focusin', revealFocusedCard);
    viewport.addEventListener('focusout', resumeAfterFocus);
    window.addEventListener('resize', resetTrack);
    let refreshTimer;
    const refreshWhenIdle = () => {
      if (ScrollTrigger.isScrolling()) {
        refreshTimer = window.setTimeout(refreshWhenIdle, 100);
        return;
      }
      ScrollTrigger.refresh();
    };
    refreshTimer = window.setTimeout(refreshWhenIdle, 0);
    return () => {
      window.clearTimeout(refreshTimer);
      if (autoSlide) window.clearInterval(autoSlide);
      viewport.removeEventListener('mouseenter', pauseForPointer);
      viewport.removeEventListener('mouseleave', resumeForPointer);
      viewport.removeEventListener('focusin', revealFocusedCard);
      viewport.removeEventListener('focusout', resumeAfterFocus);
      window.removeEventListener('resize', resetTrack);
      slideTween?.kill();
      revealTrigger?.kill();
      animation?.kill();
      gsap.set(cards, { clearProps: 'opacity,transform' });
    };
  }, [loading, products.length, mobileCarousel]);
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
          <div className="section-heading" data-reveal><div><span className="eyebrow">Popular categories</span><h2>Explore popular wellness categories</h2></div><p>Browse a focused selection for everyday vitality, comfortable movement, beauty, and restorative rest.</p></div>
          <div className="needs-grid">
            {needMap.map(([slug, title, copy, image], index) => { const Icon = [Activity, Bone, Flower2, MoonStar][index]; return <Link key={slug} to={`/products?category=${slug}`} className="need-card" style={{ '--need-image': `url("${image}")` }}><div className="need-top"><span>0{index + 1}</span><Icon /></div><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight /></Link>; })}
          </div>
        </div>
      </section>
      </div>

      <section className="products-section">
        <div className="shell">
          <div className="section-heading" data-reveal><div><span className="eyebrow">Featured collection</span><h2>Curated for your wellness ritual</h2></div><Link className="outline-button" to="/products">View all <ArrowRight size={16} /></Link></div>
          <div className="home-product-viewport" role="region" aria-label="Featured products carousel">
            <div className="product-grid home-products">
              {loading ? [...Array(4)].map((_, i) => <div className="product-skeleton" key={i} />) : products.slice(0, 8).map((product, i) => <ProductCard key={product.id} product={product} featured={i === 0} />)}
            </div>
          </div>
        </div>
      </section>

      <section id="our-story" className="story-section">
        <div className="story-layout shell">
          <div className="story-heading">
            <div className="story-heading-mark">
              <span className="eyebrow light">03 / Our story</span>
              <span>Rooted in nature<br />Made clear for today</span>
            </div>
            <h2 className="split-title">Nature holds the wisdom.<br /><em>We bring the clarity.</em></h2>
            <p>Our role is not to make wellness louder. It is to make each choice more thoughtful, transparent, and personal.</p>
          </div>

          <div className="story-composition">
            <figure className="story-visual">
              <img src="https://kinsengs.com/wp-content/uploads/2026/09/tolip-scaled.png" alt="Reishi products and selected botanicals from the Kinsengs collection" />
              <figcaption><span>01</span> Selected botanicals, presented with intention</figcaption>
              <span className="story-monogram" aria-hidden="true">K.</span>
            </figure>

            <article className="story-narrative">
              <span className="story-kicker">Our belief</span>
              <h3>Wellness should feel considered, never complicated.</h3>
              <p className="story-lead">Kinsengs was shaped around a simple idea: respect the intelligence of traditional botanicals while giving people the clarity they expect from modern wellness.</p>
              <p>That means looking beyond appearance. We consider ingredient identity, labeled directions, intended use, and the questions a real person may have before bringing a product into their routine.</p>
              <p>We do not believe in rushed decisions or one answer for everyone. We believe in useful information, honest conversation, and choices made with care.</p>
              <a className="story-cta" href="tel:+13463475571">Discover our approach <ArrowRight size={17} /></a>
            </article>
          </div>

          <div className="story-principles-heading">
            <span>What guides us</span>
            <h3>Three principles behind every considered choice.</h3>
          </div>

          <div className="story-principles">
            <article className="story-principle">
              <span>01</span>
              <div><h4>Respect the ingredient</h4><p>We begin with what a product contains, how it is intended to be used, and the tradition behind its key botanicals.</p></div>
            </article>
            <article className="story-principle">
              <span>02</span>
              <div><h4>Explain without the noise</h4><p>Information should help you understand and compare, not overwhelm you with promises or unnecessary complexity.</p></div>
            </article>
            <article className="story-principle">
              <span>03</span>
              <div><h4>Keep the choice personal</h4><p>Your goals, routine, and circumstances matter. When questions remain, a real conversation should always be available.</p></div>
            </article>
          </div>

          <div className="story-promise">
            <div className="story-promise-label"><Quote /><span>Our promise</span></div>
            <blockquote>“Not more products.<br />More confidence in the one you choose.”</blockquote>
            <div className="story-promise-copy">
              <p>We are here to help you move from curiosity to understanding, and from understanding to a ritual that feels right for you.</p>
              <a href="tel:+13463475571">Speak with Kinsengs <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="ritual-section">
        <div className="ritual-art ritual-photo"><img src="/images/wellness-ritual.jpg" alt="A mindful morning wellness ritual" loading="lazy" /><div className="ritual-seal"><BadgeCheck /><span>Guidance before choice</span></div></div>
        <div className="ritual-copy" data-reveal>
          <span className="eyebrow">A five-step journey</span>
          <h2>Your ritual.<br /><em>Considered at every step.</em></h2>
          <a className="button ritual-cta" href="tel:+13463475571">Begin with guidance <ArrowRight size={17} /></a>
          <ol>
            <li><span>01</span><div><h3>Share what matters</h3><p>Tell us about your goals, current routine, and questions.</p></div></li>
            <li><span>02</span><div><h3>Understand your options</h3><p>Explore ingredients, labeled directions, and key considerations.</p></div></li>
            <li><span>03</span><div><h3>Choose with clarity</h3><p>Compare the details and make a more informed selection.</p></div></li>
            <li><span>04</span><div><h3>Begin with intention</h3><p>Follow labeled directions and keep your new ritual simple.</p></div></li>
            <li><span>05</span><div><h3>Observe and refine</h3><p>Notice how it fits and seek professional advice when needed.</p></div></li>
          </ol>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="shell testimonial-heading" data-reveal><div><span className="eyebrow light">The Kinsengs experience</span><h2 id="testimonial-title" className="split-title">Considered choices.<br />Personal conversations.</h2></div><p>We value clarity, calm, and guidance that never feels rushed.</p></div>
        <div className="testimonial-viewport" role="region" aria-labelledby="testimonial-title" tabIndex={0}><div className="testimonial-track">
          {testimonialPreviews.map((item, index) => <article key={item.quote} className="testimonial-card"><div className="review-top"><Quote /><div role="img" aria-label="Five stars">{[...Array(5)].map((_, i) => <Star key={i} />)}</div></div><blockquote>“{item.quote}”</blockquote><footer><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.name}</strong><small>{item.context}</small></div></footer></article>)}
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

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const slideRef = useRef(0);
  const isAnimating = useRef(false);
  const isFirstRender = useRef(true);
  const progressTween = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const [mobileCarousel, setMobileCarousel] = useState(() => window.innerWidth <= 900 || window.matchMedia('(hover: none), (pointer: coarse)').matches);
  const { products, loading } = useProducts();
  const inCategory = (product, slug) => product.categories?.some((category) => category.slug === slug);
  const tolipProducts = products.filter((product) => inCategory(product, 'health-tolip'));
  const hearbalBeautyProducts = products.filter((product) => inCategory(product, 'beauty'));
  const hearbalHealthProducts = products.filter((product) => inCategory(product, 'health'));
  const hearbalProducts = [...hearbalBeautyProducts.slice(0, 2), ...hearbalHealthProducts.slice(0, 2)];

  const goToSlide = useCallback((targetIndex) => {
    if (isAnimating.current || targetIndex === slideRef.current) return;
    isAnimating.current = true;

    if (progressTween.current) {
      progressTween.current.kill();
      gsap.set('.hero-progress-fill', { width: '0%' });
    }

    gsap.to(['.hero-eyebrow', '.hero-title', '.hero-copy-desc'], {
      y: -18,
      autoAlpha: 0,
      duration: 0.28,
      stagger: 0.025,
      ease: 'power2.in',
      onComplete: () => {
        setSlide(targetIndex);
      },
    });
  }, []);

  const nextSlide = useCallback(() => {
    const next = (slideRef.current + 1) % heroSlides.length;
    goToSlide(next);
  }, [goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (slideRef.current - 1 + heroSlides.length) % heroSlides.length;
    goToSlide(prev);
  }, [goToSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    progressTween.current?.pause();
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      progressTween.current?.resume();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const startProgressBar = useCallback(() => {
    if (progressTween.current) progressTween.current.kill();
    gsap.set('.hero-progress-fill', { width: '0%' });
    progressTween.current = gsap.to('.hero-progress-fill', {
      width: '100%',
      duration: 6.5,
      ease: 'linear',
      onComplete: () => {
        const next = (slideRef.current + 1) % heroSlides.length;
        goToSlide(next);
      },
    });
  }, [goToSlide]);

  useEffect(() => {
    slideRef.current = slide;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      startProgressBar();
      return;
    }

    gsap.fromTo(
      ['.hero-eyebrow', '.hero-title', '.hero-copy-desc'],
      { y: 26, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform',
        onComplete: () => {
          isAnimating.current = false;
        },
      }
    );

    startProgressBar();
  }, [slide, startProgressBar]);

  useEffect(() => {
    return () => {
      progressTween.current?.kill();
    };
  }, []);

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
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ delay: 0.4, defaults: { ease: 'power3.out' } })
          .from('.hero-eyebrow', { y: 24, autoAlpha: 0, duration: 0.8, clearProps: 'opacity,visibility,transform' })
          .from('.hero-title', { y: 38, autoAlpha: 0, duration: 0.95, clearProps: 'opacity,visibility,transform' }, '-=0.6')
          .from('.hero-copy-desc', { y: 24, autoAlpha: 0, duration: 0.8, clearProps: 'opacity,visibility,transform' }, '-=0.65')
          .from('.hero-buttons > *', { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.08, clearProps: 'opacity,visibility,transform' }, '-=0.55')
          .from('.hero-controls, .scroll-cue', { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08, clearProps: 'opacity,visibility,transform' }, '-=0.5');

        gsap.utils.toArray('[data-reveal]').filter((el) => !el.closest('.story-section, .ritual-section, .journal-grid')).forEach((el) => gsap.from(el, { y: 48, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', fastScrollEnd: true } }));
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
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray(root.current?.querySelectorAll('.need-card'));
      if (!cards.length) return;
      const content = cards.flatMap((card) => [...card.children]);
      gsap.timeline({ scrollTrigger: { trigger: '.needs-grid', start: 'top 84%', once: true } })
        .from(cards, { y: (index) => index % 2 ? 96 : 68, autoAlpha: 0, scale: .96, rotate: (index) => [-1.2, .8, -.7, 1.1][index] || 0, transformOrigin: '50% 100%', duration: 1.05, stagger: .11, ease: 'power4.out', clearProps: 'opacity,visibility,transform' })
        .from(content, { y: 18, autoAlpha: 0, duration: .55, stagger: .035, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, '-=.72');
      cards.forEach((card) => {
        const basePosition = parseFloat(getComputedStyle(card).backgroundPositionY) || 50;
        gsap.fromTo(card, { backgroundPositionY: `${basePosition - 5}%` }, { backgroundPositionY: `${basePosition + 5}%`, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      });
    });
    media.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray(root.current?.querySelectorAll('.need-card')).forEach((card) => {
        gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
          .from(card, { y: 52, autoAlpha: 0, scale: .98, duration: .8, ease: 'power3.out', clearProps: 'opacity,visibility,transform' })
          .from(card.children, { y: 14, autoAlpha: 0, duration: .48, stagger: .06, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, '-=.42');
      });
    });
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
      <section
        className="hero"
        onMouseEnter={() => progressTween.current?.pause()}
        onMouseLeave={() => progressTween.current?.resume()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
          <div className="hero-copy-inner">
            <span className="eyebrow light hero-eyebrow">{heroSlides[slide].eyebrow}</span>
            <h1 className="hero-title">{heroSlides[slide].title}</h1>
            <p className="hero-copy-desc">{heroSlides[slide].copy}</p>
          </div>
          <div className="hero-buttons">
            <Link className="button button-light" to="/products">Explore the collection <ArrowRight size={17} /></Link>
            <a className="button button-ghost" href="tel:+13463475571"><Phone size={17} /> Call Kinsengs</a>
          </div>
        </div>
        <div className="hero-controls">
          <button onClick={prevSlide} aria-label="Previous slide"><ChevronLeft size={18} /></button>
          <span>
            0{slide + 1}
            <i><span className="hero-progress-fill" /></i>
            <small>0{heroSlides.length}</small>
          </span>
          <button onClick={nextSlide} aria-label="Next slide"><ChevronRight size={18} /></button>
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
            {needMap.map(([slug, title, copy, image, focus], index) => { const Icon = [Activity, Bone, Flower2, MoonStar][index]; return <Link key={slug} to={`/products?category=${slug}`} className="need-card" style={{ '--need-image': `url("${image}")` }}><div className="need-top"><span className="need-index">0{index + 1} / 04</span><span className="need-icon"><Icon /></span></div><div className="need-card-content"><span className="need-card-focus">{focus}</span><h3>{title}</h3><p>{copy}</p></div><div className="need-card-footer"><span>Explore this focus</span><ArrowRight /></div></Link>; })}
          </div>
        </div>
      </section>
      </div>

      <section className="products-section brand-products brand-products-tolip">
        <div className="shell">
          <div className="brand-products-head" data-reveal><div><span className="eyebrow">Tolip / Health</span><h2>Focused support for everyday wellbeing.</h2><p>Explore Tolip formulas across vitality, immunity, movement, rest, and more.</p></div><Link className="outline-button" to="/products?category=health-tolip">View Tolip Health <ArrowRight size={16} /></Link></div>
          <div className="product-grid home-collection-products" data-reveal>{loading ? [...Array(4)].map((_, index) => <div className="product-skeleton" key={index} />) : tolipProducts.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="products-section brand-products brand-products-hearbal">
        <div className="shell">
          <div className="brand-products-head" data-reveal><div><span className="eyebrow">Hearbal / Beauty & Health</span><h2>Botanical choices for beauty and vitality.</h2><p>A clear introduction to both Hearbal collections, with every product labeled by its place.</p></div><div className="brand-products-links"><Link to="/products?category=beauty">Beauty</Link><Link to="/products?category=health">Health</Link><Link className="outline-button" to="/products?category=hearbal">View all <ArrowRight size={16} /></Link></div></div>
          <div className="product-grid home-collection-products" data-reveal>{loading ? [...Array(4)].map((_, index) => <div className="product-skeleton" key={index} />) : hearbalProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
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
        <div className="section-heading" data-reveal><div><span className="eyebrow">The Kinsengs Journal</span><h2>Understand more. Live well.</h2></div><p>Editorial reflections on botanical wisdom, thoughtful nutrition, and living well.</p></div>
        <div className="journal-grid">
          <article className="journal-main" data-reveal><div className="journal-image beauty-journal-image"><img src="https://kinsengs.com/wp-content/uploads/2026/09/beauty-girl-with-long-shiny-wavy-hair-beautiful-woman-model-with-curly-hairstyle-scaled.jpg" alt="A woman with long, radiant hair representing a considered beauty and wellness ritual" loading="lazy" /></div><span>Beauty & nutrition · 5 min read</span><h3>What does beauty from within mean in a balanced wellness ritual?</h3><p>Radiance is shaped by the whole routine: thoughtful nutrition, hydration, rest, and choices considered around your individual needs.</p></article>
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

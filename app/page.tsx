'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Shield,
  ArrowUpRight,
  Truck,
  RefreshCw,
  ShieldCheck,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';
import { db } from '@/lib/db/store';
import { useStoreSettings } from '@/lib/store/settings-store';
import { toast } from 'sonner';

export default function HomePage() {
  const { settings } = useStoreSettings();
  const categories = db.getCategories();
  const allProducts = db.getProducts();
  const featuredProducts = allProducts.filter((p) => p.is_featured).slice(0, 4);
  const newArrivals = allProducts.slice(0, 4);

  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterDone, setNewsletterDone] = React.useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setNewsletterDone(true);
    toast.success(`Thank you for subscribing to ${settings.brand_name || 'STITCH BD'}.`);
    setNewsletterEmail('');
  };

  // Active Banners from database
  const activeBanners = React.useMemo(() => {
    const all = db.getBanners();
    const filtered = all.filter((b) => b.is_active);
    return filtered.length > 0 ? filtered : all;
  }, []);

  // Construct slides list combining storefront settings & CMS banners
  const slides = React.useMemo(() => {
    if (activeBanners.length === 0) {
      return [
        {
          id: 'slide-default',
          title: settings.hero_title || 'Autumn/Winter Horizon',
          subtitle:
            settings.hero_subtitle ||
            'Structural silhouettes cut from virgin wool, water-repellent Japanese gabardine, and heritage leather.',
          badge: settings.hero_badge || 'New Season 2026',
          cta_label: settings.hero_cta_label || 'Explore The Collection',
          cta_link: settings.hero_cta_link || '/products',
          secondary_cta_label: settings.hero_secondary_cta_label || 'Explore Footwear',
          secondary_cta_link: settings.hero_secondary_cta_link || '/category/footwear',
          image_url:
            settings.hero_image_url ||
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85',
        },
      ];
    }

    return activeBanners.map((b, idx) => {
      if (idx === 0) {
        return {
          id: b.id,
          title: settings.hero_title || b.title,
          subtitle:
            settings.hero_subtitle ||
            b.subtitle ||
            'Structural silhouettes cut from virgin wool, water-repellent Japanese gabardine, and heritage leather.',
          badge: settings.hero_badge || b.badge || 'New Season 2026',
          cta_label: settings.hero_cta_label || b.cta_label || 'Explore The Collection',
          cta_link: settings.hero_cta_link || b.cta_link || '/products',
          secondary_cta_label: settings.hero_secondary_cta_label || 'Explore Footwear',
          secondary_cta_link: settings.hero_secondary_cta_link || '/category/footwear',
          image_url: settings.hero_image_url || b.image_url,
        };
      }
      return {
        id: b.id,
        title: b.title,
        subtitle:
          b.subtitle ||
          'Small-batch editorial capsule celebrating master mill weaving, full-grain leathers, and functional tailoring.',
        badge: b.badge || 'Curated Capsule',
        cta_label: b.cta_label || 'Explore Drop',
        cta_link: b.cta_link || '/products',
        secondary_cta_label: settings.hero_secondary_cta_label || 'Explore Footwear',
        secondary_cta_link: settings.hero_secondary_cta_link || '/category/footwear',
        image_url: b.image_url,
      };
    });
  }, [activeBanners, settings]);

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const safeSlideIndex = currentSlideIndex >= slides.length ? 0 : currentSlideIndex;
  const currentSlide = slides[safeSlideIndex];

  // Auto-play carousel rotation with pause on hover
  React.useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, safeSlideIndex]);

  const handlePrevSlide = React.useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleNextSlide = React.useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handleGoToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
  };

  // Keyboard navigation (Left / Right Arrow)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;

      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevSlide, handleNextSlide]);

  // Touch swipe support for mobile devices
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNextSlide();
    } else if (distance < -45) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION (Custom Layout & Direct Uploaded Imagery with Functional Carousel) */}
        {settings.sections_visibility.hero && (
          <>
            {/* VARIANT A: Cinematic Full-Width */}
            {settings.hero_layout === 'cinematic_full' && (
              <section
                id="hero-cinematic-carousel"
                aria-label="Editorial Hero Carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="relative w-full h-[84vh] max-h-[880px] min-h-[580px] bg-stone-950 overflow-hidden select-none"
              >
                {/* 1. Background image layers (crossfading) */}
                <div className="absolute inset-0">
                  {slides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === safeSlideIndex ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <SafeImage
                        src={slide.image_url}
                        alt={slide.title}
                        fill
                        priority={idx === 0}
                        sizes="100vw"
                        className="object-cover object-center transform scale-100 transition-transform duration-1000"
                      />
                    </div>
                  ))}
                  <div
                    className="absolute inset-0 bg-stone-950 transition-opacity z-2"
                    style={{ opacity: (settings.hero_overlay_opacity ?? 45) / 100 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/25 to-transparent z-2" />
                </div>

                {/* 2. Content container (div:nth-of-type(2) matching CSS selector) */}
                <div
                  id="hero-carousel-content"
                  className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20"
                >
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    {/* Active Slide Text Narrative */}
                    <div
                      key={currentSlide.id}
                      className="max-w-2xl space-y-4 animate-in fade-in duration-500"
                    >
                      {currentSlide.badge && (
                        <Badge
                          variant="outline"
                          className="text-white border-white/40 bg-white/10 backdrop-blur-xs text-xs px-3 py-1 font-semibold uppercase tracking-widest"
                        >
                          {currentSlide.badge}
                        </Badge>
                      )}

                      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-50 leading-[1.1]">
                        {currentSlide.title}
                      </h1>

                      <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed font-normal">
                        {currentSlide.subtitle}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-3">
                        <Link href={currentSlide.cta_link}>
                          <Button
                            size="lg"
                            className="bg-white text-stone-950 hover:bg-stone-100 shadow-xl text-xs uppercase tracking-wider font-bold"
                          >
                            <span>{currentSlide.cta_label}</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>

                        {currentSlide.secondary_cta_label && (
                          <Link href={currentSlide.secondary_cta_link || '/products'}>
                            <Button
                              variant="outline"
                              size="lg"
                              className="text-stone-100 border-white/40 hover:bg-white/10 text-xs uppercase tracking-wider font-semibold"
                            >
                              {currentSlide.secondary_cta_label}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Carousel Interactive Controls (Counter, Indicators, Next/Prev Arrows, Pause/Play) */}
                    {slides.length > 1 && (
                      <div
                        id="hero-carousel-controls"
                        className="flex items-center gap-3 sm:gap-4 bg-stone-950/65 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/15 shadow-2xl self-start lg:self-end"
                      >
                        {/* Slide index: 01 / 03 */}
                        <div className="text-xs font-mono tracking-wider text-stone-300 px-2 flex items-center space-x-1">
                          <span className="text-white font-bold">
                            {String(safeSlideIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="text-stone-500">/</span>
                          <span className="text-stone-400">
                            {String(slides.length).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Pagination Indicator Bars / Tabs */}
                        <div className="flex items-center gap-1.5 px-1" role="tablist" aria-label="Slide indicators">
                          {slides.map((s, idx) => (
                            <button
                              key={s.id}
                              id={`hero-slide-indicator-${idx}`}
                              type="button"
                              role="tab"
                              aria-selected={idx === safeSlideIndex}
                              aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                              onClick={() => handleGoToSlide(idx)}
                              className={`h-2 transition-all rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 ${
                                idx === safeSlideIndex
                                  ? 'w-7 sm:w-8 bg-white shadow-sm'
                                  : 'w-2 bg-white/40 hover:bg-white/70'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Navigation Arrows & Pause */}
                        <div className="flex items-center gap-1 pl-1 border-l border-white/15">
                          <button
                            id="hero-prev-btn"
                            type="button"
                            aria-label="Previous slide"
                            onClick={handlePrevSlide}
                            className="h-8 w-8 rounded-full border border-white/25 hover:border-white text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            id="hero-next-btn"
                            type="button"
                            aria-label="Next slide"
                            onClick={handleNextSlide}
                            className="h-8 w-8 rounded-full border border-white/25 hover:border-white text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>

                          <button
                            id="hero-pause-btn"
                            type="button"
                            aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                            onClick={() => setIsPaused(!isPaused)}
                            className="h-8 w-8 rounded-full text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
                            title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                          >
                            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* VARIANT B: Split Editorial (50/50 Architecture with Carousel) */}
            {settings.hero_layout === 'split_editorial' && (
              <section
                id="hero-split-carousel"
                aria-label="Editorial Hero Carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="bg-stone-900 text-stone-100 border-b border-stone-800 select-none"
              >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[78vh] max-h-[820px]">
                  {/* Left Editorial Narrative */}
                  <div className="lg:col-span-6 p-8 sm:p-14 lg:p-18 flex flex-col justify-between space-y-6">
                    <div
                      key={currentSlide.id}
                      className="space-y-6 animate-in fade-in duration-500"
                    >
                      {currentSlide.badge && (
                        <div>
                          <Badge
                            variant="outline"
                            className="text-amber-400 border-amber-500/40 bg-amber-500/10 text-xs px-3 py-1 font-semibold uppercase tracking-widest"
                          >
                            {currentSlide.badge}
                          </Badge>
                        </div>
                      )}

                      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                        {currentSlide.title}
                      </h1>

                      <p className="text-sm sm:text-base text-stone-300 max-w-md leading-relaxed">
                        {currentSlide.subtitle}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-3">
                        <Link href={currentSlide.cta_link}>
                          <Button
                            size="lg"
                            className="bg-white text-stone-950 hover:bg-stone-100 shadow-xl text-xs uppercase tracking-wider font-bold"
                          >
                            <span>{currentSlide.cta_label}</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>

                        {currentSlide.secondary_cta_label && (
                          <Link href={currentSlide.secondary_cta_link || '/products'}>
                            <Button
                              variant="outline"
                              size="lg"
                              className="text-stone-200 border-stone-700 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
                            >
                              {currentSlide.secondary_cta_label}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Bottom controls & Artisan Callout */}
                    <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-6 text-xs text-stone-400">
                        <div>
                          <span className="font-serif text-lg font-bold text-white block">100%</span>
                          <span>Direct Artisan Sourced</span>
                        </div>
                        <div className="h-8 w-px bg-stone-800" />
                        <div>
                          <span className="font-serif text-lg font-bold text-white block">Biella & Kyoto</span>
                          <span>Master Mill Partnerships</span>
                        </div>
                      </div>

                      {slides.length > 1 && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-stone-400">
                            {String(safeSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              id="hero-split-prev-btn"
                              type="button"
                              aria-label="Previous slide"
                              onClick={handlePrevSlide}
                              className="h-7 w-7 rounded-md border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                              id="hero-split-next-btn"
                              type="button"
                              aria-label="Next slide"
                              onClick={handleNextSlide}
                              className="h-7 w-7 rounded-md border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Image Stage with Crossfade */}
                  <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-full overflow-hidden bg-stone-950">
                    {slides.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          idx === safeSlideIndex ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <SafeImage
                          src={s.image_url}
                          alt={s.title}
                          fill
                          priority={idx === 0}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-center"
                        />
                      </div>
                    ))}
                    <div
                      className="absolute inset-0 bg-stone-950 z-2"
                      style={{ opacity: Math.max(0.1, (settings.hero_overlay_opacity ?? 30) / 100 - 0.15) }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* VARIANT C: Minimalist Centered with Carousel */}
            {settings.hero_layout === 'minimalist_centered' && (
              <section
                id="hero-minimal-carousel"
                aria-label="Editorial Hero Carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="relative w-full py-24 sm:py-32 bg-stone-950 text-white overflow-hidden flex items-center justify-center text-center select-none"
              >
                <div className="absolute inset-0">
                  {slides.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === safeSlideIndex ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <SafeImage
                        src={s.image_url}
                        alt={s.title}
                        fill
                        priority={idx === 0}
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                  <div
                    className="absolute inset-0 bg-stone-950 z-2"
                    style={{ opacity: Math.max(0.55, (settings.hero_overlay_opacity ?? 60) / 100) }}
                  />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div
                    key={currentSlide.id}
                    className="space-y-6 animate-in fade-in duration-500"
                  >
                    {currentSlide.badge && (
                      <Badge
                        variant="outline"
                        className="text-white border-white/40 bg-white/10 backdrop-blur-xs text-xs px-3.5 py-1 font-semibold uppercase tracking-widest"
                      >
                        {currentSlide.badge}
                      </Badge>
                    )}

                    <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                      {currentSlide.title}
                    </h1>

                    <p className="text-base sm:text-lg text-stone-200 max-w-2xl mx-auto leading-relaxed font-light">
                      {currentSlide.subtitle}
                    </p>

                    <div className="pt-3 flex justify-center flex-wrap gap-3">
                      <Link href={currentSlide.cta_link}>
                        <Button
                          size="lg"
                          className="bg-white text-stone-950 hover:bg-stone-100 shadow-xl text-xs uppercase tracking-wider font-bold px-8"
                        >
                          <span>{currentSlide.cta_label}</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      {currentSlide.secondary_cta_label && (
                        <Link href={currentSlide.secondary_cta_link || '/products'}>
                          <Button
                            variant="outline"
                            size="lg"
                            className="text-stone-100 border-white/40 hover:bg-white/10 text-xs uppercase tracking-wider font-semibold"
                          >
                            {currentSlide.secondary_cta_label}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {slides.length > 1 && (
                    <div className="pt-6 flex items-center justify-center gap-3">
                      <button
                        id="hero-minimal-prev-btn"
                        type="button"
                        aria-label="Previous slide"
                        onClick={handlePrevSlide}
                        className="h-8 w-8 rounded-full border border-white/30 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1.5 px-2">
                        {slides.map((s, idx) => (
                          <button
                            key={s.id}
                            type="button"
                            aria-label={`Go to slide ${idx + 1}`}
                            onClick={() => handleGoToSlide(idx)}
                            className={`h-2 transition-all rounded-full cursor-pointer ${
                              idx === safeSlideIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        id="hero-minimal-next-btn"
                        type="button"
                        aria-label="Next slide"
                        onClick={handleNextSlide}
                        className="h-8 w-8 rounded-full border border-white/30 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {/* 2. VALUE PROPS / TRUST BADGES */}
        {settings.sections_visibility.value_props && (
          <section className="bg-stone-900 text-stone-200 py-6 border-b border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2.5 py-2">
                  <Truck className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold">Complimentary Insured Shipping ৳1,500+</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2.5 py-2">
                  <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold">Hand-Crafted Italian & Japanese Textiles</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2.5 py-2">
                  <RefreshCw className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold">30-Day Effortless Domestic Returns</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2.5 py-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold">Encrypted PCI-DSS Level 1 Checkout</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. CATEGORIES GRID */}
        {settings.sections_visibility.categories && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Archival Divisions</p>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-950 mt-1">
                  Curated Categories
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-stone-950 flex items-center space-x-1 group"
              >
                <span>View All 5 Categories</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group relative h-80 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs flex flex-col justify-end p-5"
                >
                  <SafeImage
                    src={category.image_url || 'https://picsum.photos/seed/cat/600/800'}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-[0.85] group-hover:brightness-[0.75]"
                  />
                  <div className="relative z-10 space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:underline">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-stone-200 line-clamp-1 font-normal opacity-90">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. FEATURED PRODUCTS (Signature Pieces) */}
        {settings.sections_visibility.featured_products && (
          <section className="bg-white py-20 border-y border-stone-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Signature Works</p>
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-950 mt-1">
                    The Permanent Collection
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-stone-950 flex items-center space-x-1 group"
                >
                  <span>Browse Full Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. EDITORIAL CRAFTSMANSHIP STORY BANNER */}
        {settings.sections_visibility.editorial_story && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-stone-100 grid grid-cols-1 lg:grid-cols-2 shadow-xl border border-stone-800">
              <div className="p-8 sm:p-14 lg:p-16 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  {settings.story_banner_badge && (
                    <Badge
                      variant="outline"
                      className="text-amber-300 border-amber-500/40 bg-amber-500/10 text-xs uppercase tracking-widest font-semibold"
                    >
                      {settings.story_banner_badge}
                    </Badge>
                  )}
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    {settings.story_banner_title || 'Crafted With Architectural Precision'}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                    {settings.story_banner_subtitle ||
                      'Every garment and leather object is manufactured in small batches, honoring generational heritage, double-faced wool weaving, and vegetable tanning.'}
                  </p>
                </div>

                <div>
                  <Link href={settings.story_banner_cta_link || '/products'}>
                    <Button
                      size="lg"
                      className="bg-white text-stone-950 hover:bg-stone-100 text-xs font-bold uppercase tracking-wider shadow-lg"
                    >
                      <span>{settings.story_banner_cta_label || 'Discover Our Craft'}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[340px] lg:min-h-[480px]">
                <SafeImage
                  src={
                    settings.story_banner_image_url ||
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80'
                  }
                  alt={settings.story_banner_title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* 6. NEW ARRIVALS GRID */}
        {settings.sections_visibility.new_arrivals && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Recent Additions</p>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-950 mt-1">
                  New Studio Arrivals
                </h2>
              </div>
              <Link
                href="/products?sort=newest"
                className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-stone-950 flex items-center space-x-1 group"
              >
                <span>View All Releases</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* 7. THE DISPATCH NEWSLETTER BOX */}
        {settings.sections_visibility.newsletter && (
          <section className="bg-stone-100 border-t border-stone-200 py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500">
                The STITCH BD Dispatch
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
                Join the Private Capsule Circle
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                Subscribers receive early access to seasonal allocations, invitations to archival sample sales, and STITCH BD studio notes.
              </p>

              {newsletterDone ? (
                <div className="flex items-center justify-center space-x-2 text-emerald-800 text-xs font-semibold py-3">
                  <Check className="h-4 w-4" />
                  <span>You have successfully been registered for private dispatch alerts.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 pt-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-xs focus:outline-none focus:border-stone-900"
                    required
                  />
                  <Button type="submit" className="text-xs font-bold uppercase tracking-wider px-5">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

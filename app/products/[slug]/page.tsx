'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeImage } from '@/components/ui/safe-image';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  MessageSquare,
} from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { db } from '@/lib/db/store';
import { ProductVariant, Review } from '@/lib/types';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const product = db.getProductBySlug(resolvedParams.slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'returns'>('description');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  // Review Form State
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [newReviewTitle, setNewReviewTitle] = useState<string>('');
  const [newReviewBody, setNewReviewBody] = useState<string>('');

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold font-serif">Product Not Found</h1>
          <p className="text-sm text-stone-500">The product you are looking for has been archived or does not exist.</p>
          <Link href="/products">
            <Button>Return to Collection</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const reviews = db.getReviews(product.id, 'approved');
  const relatedProducts = db.getProducts({ category_slug: product.category?.slug }).filter((p) => p.id !== product.id).slice(0, 4);

  // Rating Distribution Calculation
  const totalReviews = reviews.length;
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select an option');
      return;
    }
    if (selectedVariant.stock_quantity <= 0) {
      toast.error('Selected variant is currently out of stock');
      return;
    }
    setIsAdding(true);
    addItem(product, selectedVariant, quantity);
    toast.success(`Added ${quantity} × ${product.name} to cart`);
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 400);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewTitle.trim() || !newReviewBody.trim()) {
      toast.error('Please complete all review fields');
      return;
    }
    db.createReview({
      product_id: product.id,
      author_name: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: newReviewTitle.trim(),
      body: newReviewBody.trim(),
      is_verified_purchase: true,
    });
    toast.success('Thank you! Your review has been recorded.');
    setReviewModalOpen(false);
    setNewReviewTitle('');
    setNewReviewBody('');
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: selectedVariant?.price || product.base_price,
      availability:
        selectedVariant && selectedVariant.stock_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 5.0,
      reviewCount: product.reviews_count || 1,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-stone-900">Catalog</Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold truncate">{product.name}</span>
        </div>

        {/* Product Hero Stage: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b border-stone-200">
          {/* Gallery Area (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-stone-100 ${
                    selectedImageIndex === idx ? 'border-stone-900 shadow-sm ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <SafeImage
                    src={img.url}
                    alt={img.alt_text || product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image with Zoom feel */}
            <div className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs group">
              <SafeImage
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
              />
              {selectedVariant && selectedVariant.stock_quantity <= 5 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="font-bold text-xs uppercase tracking-wider">
                    Low Stock: Only {selectedVariant.stock_quantity} Remaining
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Details & Purchase Form (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-stone-400">
                    {product.brand}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 mt-1">
                    {product.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      toggleItem(product);
                      toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
                    }}
                    className="p-2.5 rounded-full border border-stone-200 bg-white text-stone-700 hover:text-red-600 hover:border-stone-400 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart className={`h-5 w-5 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full border border-stone-200 bg-white text-stone-700 hover:text-stone-950 hover:border-stone-400 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl sm:text-3xl font-bold text-stone-950">
                    ${(selectedVariant?.price || product.base_price).toFixed(2)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-base text-stone-400 line-through">
                      ${product.compare_at_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="h-4 w-px bg-stone-200" />

                <div className="flex items-center space-x-1.5 text-xs text-stone-700">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s <= Math.round(product.rating || 5) ? 'fill-amber-400' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{product.rating || 5.0}</span>
                  <span className="text-stone-400">({reviews.length} reviews)</span>
                </div>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Variant Selectors */}
              <div className="space-y-4 pt-4 border-t border-stone-200/80">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-stone-900 uppercase tracking-wider">Select Option / Variant</span>
                  <span className="text-stone-500 font-mono text-[11px]">SKU: {selectedVariant?.sku}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const optionLabel = [v.option_values.size, v.option_values.color]
                      .filter(Boolean)
                      .join(' / ');

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock_quantity <= 0}
                        className={`p-3 text-left rounded-xl border text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                            : v.stock_quantity <= 0
                            ? 'border-stone-200 bg-stone-100/60 text-stone-400 cursor-not-allowed line-through'
                            : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <span className="font-semibold">{optionLabel || v.sku}</span>
                        <div className="flex justify-between items-center mt-2">
                          <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                            ${v.price.toFixed(2)}
                          </span>
                          <span className={`text-[10px] font-medium ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                            {v.stock_quantity > 0 ? `${v.stock_quantity} left` : 'Sold out'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1 shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    isLoading={isAdding}
                    disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
                    className="flex-1 h-12 text-sm font-bold uppercase tracking-wider shadow-md"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>
                      {selectedVariant && selectedVariant.stock_quantity <= 0
                        ? 'Sold Out'
                        : `Add To Bag • $${((selectedVariant?.price || product.base_price) * quantity).toFixed(2)}`}
                    </span>
                  </Button>
                </div>

                {/* Buy Now Button */}
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
                  className="w-full h-11 text-xs font-bold uppercase tracking-wider border-stone-300 hover:bg-stone-100"
                >
                  Buy Now with Express Checkout
                </Button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-stone-400" />
                  <span>Free insured shipping on orders ৳1,500+</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-stone-400" />
                  <span>Complimentary 30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Content */}
        <div className="py-14 border-b border-stone-200">
          <div className="flex space-x-8 border-b border-stone-200 pb-3 text-sm font-semibold uppercase tracking-wider">
            {(['description', 'specs', 'shipping', 'returns'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 relative transition-colors ${
                  activeTab === tab ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                {tab === 'description' && 'Overview & Design Notes'}
                {tab === 'specs' && 'Materials & Craft'}
                {tab === 'shipping' && 'Global Freight'}
                {tab === 'returns' && 'Guaranteed Returns'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm text-stone-600 leading-relaxed max-w-3xl">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>
                  Every seam is reinforced using custom tension machinery designed to drape with sculptural balance. Built for daily utility and lifetime longevity.
                </p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-900">Origin</span>
                  <span>Handcrafted in Tuscany, Italy</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-900">Hardware</span>
                  <span>Solid custom-molded antique brass</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-900">Care</span>
                  <span>Specialist dry clean only; conditioner recommended yearly</span>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>We provide insured domestic and express dispatch across Bangladesh:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Standard Courier:</strong> 2-4 business days (Free over ৳1,500, otherwise ৳120).</li>
                  <li><strong>Priority Express:</strong> 1-2 business days (৳250).</li>
                  <li><strong>Cash on Delivery (COD):</strong> Available nationwide with doorstep verification.</li>
                </ul>
              </div>
            )}
            {activeTab === 'returns' && (
              <div className="space-y-3">
                <p>
                  STITCH BD offers a 30-day risk-free inspection window. Items must be unworn in original condition with security tags intact. Each delivery includes a pre-printed, pre-paid return shipping label.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section & Rating Summary */}
        <section className="py-14 border-b border-stone-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-950">Client Appraisals</h3>
              <p className="text-xs text-stone-500 mt-1">
                Verified feedback from collectors and patrons
              </p>
            </div>
            <Button onClick={() => setReviewModalOpen(true)} variant="outline" size="sm" className="text-xs">
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              <span>Write An Appraisal</span>
            </Button>
          </div>

          {/* Rating Summary Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white rounded-2xl border border-stone-200/80 mb-10 shadow-xs">
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-100 pb-6 md:pb-0">
              <span className="font-serif text-5xl font-bold text-stone-950">{product.rating || 5.0}</span>
              <div className="flex text-amber-400 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-stone-400">Based on {reviews.length} appraisals</span>
            </div>

            <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center space-x-3 text-xs">
                    <span className="w-12 text-stone-600 font-medium">{stars} stars</span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-900 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-6 text-right text-stone-400 font-mono text-[11px]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 bg-white rounded-xl border border-stone-200/80 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-stone-900">{r.author_name}</span>
                      {r.is_verified_purchase && (
                        <Badge variant="success" className="text-[10px] px-2 py-0">
                          <Check className="h-2.5 w-2.5 mr-1" /> Verified Buyer
                        </Badge>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-amber-400' : 'text-stone-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h5 className="text-sm font-semibold text-stone-900">{r.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed">{r.body}</p>

                {r.admin_reply && (
                  <div className="bg-stone-50 border-l-2 border-stone-900 p-3 rounded-r-lg text-xs space-y-1 mt-2">
                    <span className="font-bold text-stone-900">STITCH BD Concierge Response:</span>
                    <p className="text-stone-600">{r.admin_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Products ("Customers Also Acquired") */}
        {relatedProducts.length > 0 && (
          <section className="py-14">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Pairings</p>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-1">
                  Customers Also Acquired
                </h3>
              </div>
              <Link href="/products" className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-stone-950">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Review Submission Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Submit an Appraisal"
        description="Share your observations regarding fabric drape, sizing, and tactile quality."
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewReviewRating(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`h-6 w-6 ${s <= newReviewRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={newReviewAuthor}
              onChange={(e) => setNewReviewAuthor(e.target.value)}
              placeholder="e.g. Julian Montgomery"
              className="w-full text-sm p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Review Title
            </label>
            <input
              type="text"
              required
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
              placeholder="e.g. Exceptional tailoring and thermal retention"
              className="w-full text-sm p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Detailed Experience
            </label>
            <textarea
              required
              rows={4}
              value={newReviewBody}
              onChange={(e) => setNewReviewBody(e.target.value)}
              placeholder="Describe the tactile weight, fit over layers, and finish..."
              className="w-full text-sm p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}

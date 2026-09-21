'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const primaryImage = product.images[0]?.url || 'https://picsum.photos/seed/fashion/800/1000';
  const secondaryImage = product.images[1]?.url || primaryImage;

  const defaultVariant = product.variants[0];
  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.base_price) / product.compare_at_price) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) {
      toast.error('Product variant unavailable');
      return;
    }

    setIsAdding(true);
    addItem(product, defaultVariant, 1);
    toast.success(`Added ${product.name} to cart`);

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!wishlisted) {
      toast.success('Saved to your wishlist');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Stage */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 block">
        {/* Primary Image */}
        <SafeImage
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <Badge variant="destructive" className="font-bold text-[11px] px-2 py-0.5">
              -{discountPercent}%
            </Badge>
          )}
          {product.is_featured && !discountPercent && (
            <Badge variant="default" className="font-semibold text-[10px] px-2 py-0.5 uppercase tracking-wider">
              Signature
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-red-600 hover:bg-white transition-all shadow-xs"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || (defaultVariant && defaultVariant.stock_quantity <= 0)}
            className="w-full h-10 bg-stone-900/95 hover:bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-lg backdrop-blur-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Added!</span>
              </>
            ) : defaultVariant && defaultVariant.stock_quantity <= 0 ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium tracking-wider uppercase text-[10px] text-stone-400">{product.brand}</span>
            {product.rating && (
              <div className="flex items-center space-x-1 text-stone-700">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-semibold">{product.rating}</span>
                <span className="text-[10px] text-stone-400">({product.reviews_count})</span>
              </div>
            )}
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-stone-900 hover:text-stone-700 line-clamp-1 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price and Variant Info */}
        <div className="flex items-baseline justify-between pt-1 border-t border-stone-100">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-stone-950">${product.base_price.toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-xs text-stone-400 line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
          {product.variants.length > 1 && (
            <span className="text-[11px] text-stone-500 font-medium">
              {product.variants.length} options
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

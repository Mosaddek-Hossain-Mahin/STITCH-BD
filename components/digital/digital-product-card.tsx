'use client';

import React from 'react';
import Link from 'next/link';
import { DigitalProduct } from '@/lib/digital/types';
import { useDigitalCartStore } from '@/lib/digital/cart-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/safe-image';
import { FileCode, Clock, Download, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalProductCardProps {
  product: DigitalProduct;
}

export function DigitalProductCard({ product }: DigitalProductCardProps) {
  const { addItem, items } = useDigitalCartStore();
  const isInCart = items.some((it) => it.digital_product_id === product.id);

  const formatColor: Record<string, string> = {
    PDF: 'bg-rose-100 text-rose-800 border-rose-200',
    ZIP: 'bg-amber-100 text-amber-900 border-amber-200',
    DXF: 'bg-sky-100 text-sky-800 border-sky-200',
    CLO3D: 'bg-purple-100 text-purple-900 border-purple-200',
    MP4: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    AI: 'bg-orange-100 text-orange-900 border-orange-200',
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`"${product.title}" added to Digital Cart`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      {/* Visual Thumbnail */}
      <Link href={`/digital/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-stone-100">
        <SafeImage
          src={product.cover_image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider border shadow-xs ${
              formatColor[product.file_format] || 'bg-stone-100 text-stone-800 border-stone-200'
            }`}
          >
            {product.file_format} • {product.file_size_mb} MB
          </span>
          {product.is_featured && (
            <Badge variant="default" className="bg-stone-900 text-white text-[10px] uppercase font-bold tracking-wider">
              Studio Signature
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 right-3 z-10 bg-stone-950/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1.5">
          <Clock className="h-3 w-3 text-amber-400" />
          <span>{product.expiry_hours}h Expiry Link</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-wider">
            <span>{product.license_type}</span>
            <span className="flex items-center text-stone-600 font-semibold">
              <Download className="h-3 w-3 mr-1 text-stone-400" />
              Max {product.max_downloads} Uses
            </span>
          </div>

          <Link href={`/digital/${product.slug}`}>
            <h3 className="font-serif font-bold text-base text-stone-950 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.summary}
          </p>
        </div>

        {/* Compatibility Pills */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
          {product.software_compatibility.slice(0, 2).map((soft) => (
            <span
              key={soft}
              className="text-[10px] bg-stone-50 text-stone-600 px-2 py-0.5 rounded border border-stone-200/60 truncate max-w-[140px]"
            >
              {soft}
            </span>
          ))}
          {product.software_compatibility.length > 2 && (
            <span className="text-[10px] bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded border border-stone-200/60">
              +{product.software_compatibility.length - 2}
            </span>
          )}
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold font-serif text-stone-950">
                ৳{product.price.toLocaleString()}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-stone-400 line-through">
                  ৳{product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium flex items-center mt-0.5">
              <Zap className="h-2.5 w-2.5 mr-0.5" /> Instant Delivery
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            variant={isInCart ? 'secondary' : 'default'}
            className="text-xs"
          >
            {isInCart ? 'In Digital Cart' : 'Acquire Asset'}
          </Button>
        </div>
      </div>
    </div>
  );
}

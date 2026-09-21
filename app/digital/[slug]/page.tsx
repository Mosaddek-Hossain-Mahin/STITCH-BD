'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { digitalDb } from '@/lib/digital/db';
import { useDigitalCartStore } from '@/lib/digital/cart-store';
import { DigitalCartDrawer } from '@/components/digital/digital-cart-drawer';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';
import {
  Download,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  ArrowLeft,
  CheckCircle2,
  FileCode,
  FileArchive,
  Info,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DigitalProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const product = digitalDb.getProductBySlug(slug);
  const { addItem, items, openDrawer } = useDigitalCartStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 max-w-md space-y-4">
          <Layers className="h-10 w-10 text-stone-400 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-stone-900">Digital Asset Not Found</h2>
          <p className="text-xs text-stone-500">
            The requested digital pattern, tech pack, or 3D asset could not be located in our digital archive.
          </p>
          <Link
            href="/digital"
            className={cn(buttonVariants({ size: 'sm' }), 'text-xs')}
          >
            Return to Digital Studio
          </Link>
        </div>
      </div>
    );
  }

  const isInCart = items.some((it) => it.digital_product_id === product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`"${product.title}" added to Digital Cart`);
  };

  const handleInstantBuy = () => {
    addItem(product);
    router.push('/digital/checkout');
  };

  const allImages = product.preview_images?.length ? product.preview_images : [product.cover_image];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-24">
      <DigitalCartDrawer />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center space-x-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
          <Link href="/digital" className="hover:text-stone-900 transition-colors">
            Digital Studio
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
          <span className="text-stone-900 font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Top Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Gallery & File Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-sm">
              <SafeImage
                src={allImages[activeImageIndex] || product.cover_image}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              {/* Format Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className="bg-stone-950/90 backdrop-blur-xs text-white text-xs font-mono font-bold px-3 py-1 rounded-lg border border-stone-700 shadow-xs">
                  {product.file_format} • {product.file_size_mb} MB
                </span>
                <span className="bg-amber-500/90 backdrop-blur-xs text-stone-950 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  Version {product.version}
                </span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {allImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-stone-950 shadow-md ring-2 ring-stone-950/20'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={img} alt="Preview" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* File Sample Preview Box */}
            <div className="bg-stone-900 text-stone-300 rounded-2xl p-6 border border-stone-800 space-y-3 font-mono text-xs shadow-xs">
              <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
                <span className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-amber-400">
                  <FileCode className="h-4 w-4" />
                  <span>Asset Manifest Sample</span>
                </span>
                <span className="text-[10px] text-stone-500">{product.sample_download_name}</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-stone-300 leading-relaxed bg-stone-950/50 p-4 rounded-xl border border-stone-800/80 overflow-x-auto">
                {product.sample_file_content}
              </pre>
            </div>
          </div>

          {/* Right: Asset Specification & Buy Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-amber-800 border-amber-300 bg-amber-50 text-[11px] uppercase tracking-wider font-bold">
                    {product.license_type}
                  </Badge>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center">
                    <Zap className="h-3 w-3 mr-1" /> Instant Email Delivery
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 leading-tight">
                  {product.title}
                </h1>

                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {product.summary}
                </p>
              </div>

              {/* Price & Guarantee */}
              <div className="pt-4 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block">
                    Prepaid License Fee
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-serif font-bold text-stone-950">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-sm text-stone-400 line-through">
                        ৳{product.compare_at_price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-stone-500">BDT</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Encrypted Package</span>
                  <span className="text-xs font-mono font-bold text-stone-800">
                    {product.file_size_mb} MB
                  </span>
                </div>
              </div>

              {/* Download Terms Summary */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center text-stone-500">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                    Access Token Lifespan:
                  </span>
                  <strong className="text-stone-900">{product.expiry_hours} Hours from purchase</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center text-stone-500">
                    <Download className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
                    Permitted Download Limit:
                  </span>
                  <strong className="text-stone-900">{product.max_downloads} Iterations</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center text-stone-500">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                    Delivery Channel:
                  </span>
                  <strong className="text-stone-900">Signed Cryptographic Email</strong>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full justify-center text-sm py-3.5 shadow-md"
                  onClick={handleInstantBuy}
                >
                  <Zap className="h-4 w-4 mr-2 text-amber-300" />
                  <span>Instant Prepaid Buy (৳{product.price.toLocaleString()} BDT)</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-center text-xs py-3"
                  onClick={handleAddToCart}
                >
                  <Download className="h-3.5 w-3.5 mr-2 text-stone-600" />
                  <span>{isInCart ? 'In Digital Cart (View)' : 'Add to Digital Cart'}</span>
                </Button>

                <p className="text-[11px] text-stone-400 text-center flex items-center justify-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                  <span>Cash on Delivery is disabled for instant digital goods.</span>
                </p>
              </div>

              {/* Includes checklist */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Package Contents:
                </h4>
                <ul className="space-y-2 text-xs text-stone-600">
                  {product.includes.map((inc, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compatibility Software */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Software Compatibility:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.software_compatibility.map((soft) => (
                    <span
                      key={soft}
                      className="text-xs bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg border border-stone-200/80 font-medium"
                    >
                      {soft}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6 shadow-xs max-w-4xl">
          <h2 className="font-serif text-xl font-bold text-stone-950 border-b border-stone-100 pb-3">
            Atelier Technical Specification & Engineering Notes
          </h2>
          <div className="prose prose-stone text-xs sm:text-sm text-stone-600 leading-relaxed space-y-4">
            <p>{product.description}</p>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2">
              <h4 className="font-bold text-stone-900">Licensing Terms: {product.license_type}</h4>
              <p className="text-xs text-stone-500">
                Grant of non-exclusive license. You may use this pattern or asset to construct individual garments or small boutique batches. Resale, sub-licensing, or redistribution of raw CAD vectors, PDF patterns, or 3D meshes is strictly prohibited under international copyright laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

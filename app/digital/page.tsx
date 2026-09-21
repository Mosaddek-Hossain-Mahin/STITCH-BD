'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { digitalDb } from '@/lib/digital/db';
import { DigitalCategory, DigitalFileFormat } from '@/lib/digital/types';
import { DigitalProductCard } from '@/components/digital/digital-product-card';
import { DigitalCartDrawer } from '@/components/digital/digital-cart-drawer';
import { useDigitalCartStore } from '@/lib/digital/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Download,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Clock,
  Layers,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

export default function DigitalStorefrontPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'downloads'>('featured');

  const { getItemCount, openDrawer } = useDigitalCartStore();
  const itemCount = getItemCount();

  const products = digitalDb.getActiveProducts();

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Digital Goods' },
    { id: 'tech_packs', label: 'Tech Packs' },
    { id: 'sewing_patterns', label: 'Sewing Patterns' },
    { id: 'cad_blueprints', label: 'CAD & Laser Files' },
    { id: 'garment_3d', label: '3D & CLO3D' },
    { id: 'masterclasses', label: 'Masterclasses' },
  ];

  const formats: DigitalFileFormat[] = ['PDF', 'ZIP', 'DXF', 'CLO3D', 'MP4'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedFormat !== 'all' && p.file_format !== selectedFormat) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFormat = p.file_format.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchFormat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'downloads') return b.downloads_count - a.downloads_count;
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedFormat, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      <DigitalCartDrawer />

      {/* Hero Announcement Banner */}
      <div className="bg-stone-950 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Zap className="h-3.5 w-3.5" />
              <span>Independent Digital Goods Architecture</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              STITCH BD Digital Studio
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              Industrial garment tech packs, multi-size Savile Row sewing patterns, laser CAD blueprints, and CLO3D simulations. Instant delivery via encrypted email with licensed usage tracking.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-300">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Prepaid & Verified Delivery</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>72h - 168h Signed Access</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
                <span>Commercial Atelier Licenses</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Cart Trigger on Bottom Right if items in digital cart */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={openDrawer}
            className="shadow-2xl bg-stone-900 text-white hover:bg-stone-800 px-5 py-3 rounded-full flex items-center space-x-2.5 border border-stone-700"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold">Digital Cart ({itemCount})</span>
            <span className="bg-amber-500 text-stone-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
              View
            </span>
          </Button>
        </div>
      )}

      {/* Main Catalog View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
          {/* Top Bar: Search & Sort */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech packs, sewing patterns, CAD files..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs text-stone-500">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-stone-900"
                >
                  <option value="featured">Featured First</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={openDrawer}
                className="text-xs relative"
              >
                <Download className="h-3.5 w-3.5 mr-1.5 text-stone-600" />
                <span>Digital Cart</span>
                {itemCount > 0 && (
                  <span className="ml-1.5 bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-t border-stone-100 pt-4 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Format Quick Filter Chips */}
          <div className="flex items-center space-x-2 text-xs text-stone-500 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
              Format:
            </span>
            <button
              onClick={() => setSelectedFormat('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                selectedFormat === 'all'
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Formats
            </button>
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase ${
                  selectedFormat === fmt
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> digital engineering assets
          </span>
          <span className="text-stone-400">
            All files cryptographically verified upon checkout
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
            <Layers className="h-10 w-10 text-stone-300 mx-auto" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              No digital goods matched your criteria
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your category filter, clearing your search query, or selecting another file format.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedFormat('all');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <DigitalProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Informational Feature Section: How Instant Digital Delivery Works */}
        <div className="mt-16 bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Secure Delivery Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              How STITCH BD Digital Delivery Operates
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Every digital asset purchase is protected with enterprise cryptographic signatures, time expirations, and device usage boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-800/60 rounded-2xl p-6 border border-stone-700/60 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-white">Prepaid Verification</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Pay securely via bKash, Nagad, Card, or Wire. Because digital goods transfer immediately, Cash on Delivery is strictly disabled.
              </p>
            </div>

            <div className="bg-stone-800/60 rounded-2xl p-6 border border-stone-700/60 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-white">Instant Email Dispatch</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                A cryptographically signed token is generated and sent immediately to your inbox with direct portal access.
              </p>
            </div>

            <div className="bg-stone-800/60 rounded-2xl p-6 border border-stone-700/60 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-serif text-base font-bold text-white">Expiry & Usage Limit</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Download your uncorrupted master bundle within the licensed window (72h–168h) for up to 3–5 download iterations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

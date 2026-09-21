'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { db } from '@/lib/db/store';
import { Product } from '@/lib/types';
import { Modal } from '@/components/ui/modal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results: Product[] = useMemo(() => {
    if (!query.trim()) return [];
    return db.getProducts({ search: query.trim() }).slice(0, 5);
  }, [query]);

  const popularTags = ['Wool Overcoat', 'Chelsea Boot', 'Cashmere', 'Tote Bag', 'Automatic Watch'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-0 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center space-x-3 bg-stone-50/50">
        <Search className="h-5 w-5 text-stone-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by title, material, silhouette, or SKU..."
          className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-base focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-stone-400 hover:text-stone-600 p-1"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-5 max-h-[60vh] overflow-y-auto">
        {/* Popular Tags */}
        {!query && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Popular Inquiries
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && results.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-stone-500 pb-1">
              <span>{results.length} results found</span>
              <Link
                href={`/products?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="font-medium text-stone-900 hover:underline flex items-center space-x-1"
              >
                <span>View all in catalog</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center space-x-3.5 py-3 px-2 rounded-xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                    <Image
                      src={product.images[0]?.url || 'https://picsum.photos/seed/placeholder/200/200'}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 truncate">
                      {product.name}
                    </h5>
                    <p className="text-xs text-stone-500 capitalize">{product.brand} • {product.sku}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-900">${product.base_price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="py-12 text-center text-stone-500 space-y-1">
            <p className="text-sm font-medium text-stone-800">No matching pieces found for &quot;{query}&quot;</p>
            <p className="text-xs text-stone-400">Try searching for broader keywords like coats, boots, cashmere, or leather.</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-[11px] text-stone-400">
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] font-mono">ESC</kbd>
          <span>to close</span>
        </span>
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] font-mono">
            <CornerDownLeft className="h-2.5 w-2.5 inline" />
          </kbd>
          <span>to select</span>
        </span>
      </div>
    </Modal>
  );
}

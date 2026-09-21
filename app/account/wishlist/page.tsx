'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { AccountNav } from '@/components/account/account-nav';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/lib/store/wishlist-store';

export default function AccountWishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-950">Client Account</h1>
          <p className="text-xs text-stone-500 mt-1">Saved pieces and personal wardrobe reservations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <AccountNav />

          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-stone-900">Saved Wishlist</h2>
                <p className="text-xs text-stone-500">{items.length} pieces bookmarked</p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-stone-200/80 text-center space-y-4 shadow-xs">
                <Heart className="h-10 w-10 text-stone-400 mx-auto" />
                <h3 className="text-sm font-bold text-stone-900">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Click the heart icon on any piece in the catalog to curate your private selection.
                </p>
                <Link href="/products">
                  <Button size="sm">Browse Archive</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { ProductCard } from '@/components/storefront/product-card';
import { db } from '@/lib/db/store';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const categories = db.getCategories();
  const category = categories.find((c) => c.slug === slug);
  const products = db.getProducts({ category_slug: slug });

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-stone-900">Category Not Found</h1>
          <p className="text-sm text-stone-500">The collection you requested does not exist.</p>
          <Link href="/products" className="inline-flex items-center text-sm font-semibold underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Catalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1">
        {/* Category Hero Banner */}
        <section className="relative w-full h-[360px] bg-stone-950 overflow-hidden flex items-end">
          <div className="absolute inset-0">
            <Image
              src={category.image_url || 'https://picsum.photos/seed/cat/1600/600'}
              alt={category.name}
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-[0.70]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex items-center space-x-2 text-xs text-stone-300 mb-2">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-white">Catalog</Link>
              <span>/</span>
              <span className="text-white font-semibold">{category.name}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {category.name}
            </h1>
            <p className="text-sm text-stone-300 max-w-xl mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>
        </section>

        {/* Products Listing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {products.length} Archival Styles Available
            </span>
            <Link href="/products" className="text-xs font-medium text-stone-700 hover:text-stone-950 underline">
              Browse All Categories
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              No products found in this category currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

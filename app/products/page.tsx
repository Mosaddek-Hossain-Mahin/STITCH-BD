'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Filter,
  Grid3X3,
  Rows3,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db/store';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'popularity';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories = db.getCategories();
  const allBrands = ['STITCH BD Studio', 'STITCH BD Artisan', 'STITCH BD Leathercraft', 'STITCH BD Chronometry'];
  const sizes = ['XS', 'S', 'M', 'L', 'US 9 / EU 42', 'US 10 / EU 43', 'One Size'];
  const colors = ['Camel', 'Charcoal', 'Espresso', 'Black', 'Oatmeal', 'Olive', 'Cognac', 'Ash Gray'];

  // Query DB with filters
  const filteredProducts = useMemo(() => {
    return db.getProducts({
      category_slug: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      max_price: priceRange,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      in_stock_only: inStockOnly,
      search: initialSearch || undefined,
      sort: sortOption,
    });
  }, [
    selectedCategory,
    selectedBrand,
    priceRange,
    selectedSize,
    selectedColor,
    inStockOnly,
    initialSearch,
    sortOption,
  ]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange < 1000 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange(1000);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb & Header */}
        <div className="border-b border-stone-200/80 pb-6 mb-8">
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-stone-900">Home</Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">Catalog</span>
            {initialSearch && (
              <>
                <span>/</span>
                <span className="text-stone-900">Search: &quot;{initialSearch}&quot;</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name || 'Collection'
                  : initialSearch
                  ? `Search Results for "${initialSearch}"`
                  : 'The Complete Archive'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Showing {filteredProducts.length} handcrafted garments and luxury objects
              </p>
            </div>

            {/* View Mode & Sorting */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-stone-200 rounded-lg px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Sorting Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-stone-900 shadow-xs"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              {/* Grid / List toggle */}
              <div className="hidden sm:flex items-center border border-stone-200 rounded-lg bg-white p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="List view"
                >
                  <Rows3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
              <span className="text-xs text-stone-400 font-medium mr-1">Active filters:</span>
              {selectedCategory && (
                <Badge variant="secondary" className="text-xs py-1 px-2.5 flex items-center space-x-1">
                  <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name}</span>
                  <button onClick={() => setSelectedCategory('')}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="text-xs py-1 px-2.5 flex items-center space-x-1">
                  <span>Brand: {selectedBrand}</span>
                  <button onClick={() => setSelectedBrand('')}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedSize && (
                <Badge variant="secondary" className="text-xs py-1 px-2.5 flex items-center space-x-1">
                  <span>Size: {selectedSize}</span>
                  <button onClick={() => setSelectedSize('')}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedColor && (
                <Badge variant="secondary" className="text-xs py-1 px-2.5 flex items-center space-x-1">
                  <span>Color: {selectedColor}</span>
                  <button onClick={() => setSelectedColor('')}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="secondary" className="text-xs py-1 px-2.5 flex items-center space-x-1">
                  <span>In Stock Only</span>
                  <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {priceRange < 1000 && (
                <Badge variant="secondary" className="text-xs py-1 px-2.5 flex items-center space-x-1">
                  <span>Under ${priceRange}</span>
                  <button onClick={() => setPriceRange(1000)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-stone-600 hover:text-stone-900 underline font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Filter Catalog
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center space-x-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Category
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex justify-between ${
                    !selectedCategory ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex justify-between ${
                      selectedCategory === cat.slug ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-stone-800 uppercase tracking-wider">Max Price</label>
                <span className="font-bold text-stone-900">৳{priceRange}</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>৳100</span>
                <span>৳1,000+</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Brand / STITCH BD
              </label>
              <div className="space-y-1">
                {allBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 text-xs text-stone-600 cursor-pointer py-1 hover:text-stone-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrand === brand}
                      onChange={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                      selectedSize === sz
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-stone-100">
              <label className="flex items-center space-x-2.5 text-xs text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 h-4 w-4"
                />
                <span className="font-semibold">In Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200/80 p-12 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Filter className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">No products match your selected filters</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting the price threshold, clearing specific colors or sizes, or removing the search query.
                </p>
                <Button onClick={clearAllFilters} variant="outline" size="sm">
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* List Mode */
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-stone-200/80 p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-44 w-full sm:w-40 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <Image
                        src={product.images[0]?.url || 'https://picsum.photos/seed/list/300/400'}
                        alt={product.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                            {product.brand} • {product.sku}
                          </span>
                          <span className="text-base font-bold text-stone-950">
                            ${product.base_price.toFixed(2)}
                          </span>
                        </div>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-base font-bold text-stone-900 hover:text-stone-700">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-2">
                        <span className="text-xs text-stone-500">
                          {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
                        </span>
                        <Link href={`/products/${product.slug}`}>
                          <Button size="sm" variant="default" className="text-xs">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

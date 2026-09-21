'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  MoreVertical,
  ArrowUpDown,
  ExternalLink,
  Check,
  X,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Product, ProductVariant, ProductImage } from '@/lib/types';
import { toast } from 'sonner';
import { ProductImageUploader } from '@/components/admin/product-image-uploader';
import { SafeImage } from '@/components/ui/safe-image';

function generateRandomSku(): string {
  return `ATL-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateTimestampId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export default function AdminProductsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [inventoryModalVariant, setInventoryModalVariant] = useState<{ id: string; name: string; sku: string; stock: number } | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  // Form states for create / edit
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBrand, setFormBrand] = useState('STITCH BD Studio');
  const [formBasePrice, setFormBasePrice] = useState('450');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImages, setFormImages] = useState<ProductImage[]>([]);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  const categories = db.getCategories();
  const allProducts = db.getProducts({
    search: search || undefined,
    category_slug: categoryFilter || undefined,
  });

  const filteredProducts = allProducts.filter((p) => {
    if (statusFilter === 'active') return p.status === 'active' || p.is_active === true;
    if (statusFilter === 'draft') return p.status === 'draft' || p.is_active === false;
    return true;
  });

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormBrand('STITCH BD Studio');
    setFormBasePrice('450');
    setFormComparePrice('');
    setFormCategoryId(categories[0]?.id || '');
    setFormImages([]);
    setFormIsFeatured(false);
    setFormIsActive(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setEditProduct(null);
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormDescription(p.description);
    setFormBrand(p.brand);
    setFormBasePrice(String(p.base_price));
    setFormComparePrice(p.compare_at_price ? String(p.compare_at_price) : '');
    setFormCategoryId(p.category_id || '');
    setFormImages(p.images ? [...p.images] : []);
    setFormIsFeatured(p.is_featured);
    setFormIsActive(p.status === 'active' || (p.is_active ?? true));
    setCreateModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBasePrice) {
      toast.error('Please specify a title and base price');
      return;
    }

    const slugGenerated = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const basePriceNum = parseFloat(formBasePrice) || 100;
    const comparePriceNum = formComparePrice ? parseFloat(formComparePrice) : undefined;

    // Use uploaded images, or provide a default if none were uploaded
    const finalImages: ProductImage[] =
      formImages.length > 0
        ? formImages.map((img, idx) => ({ ...img, sort_order: idx, alt_text: img.alt_text || formName.trim() }))
        : [
            {
              id: generateTimestampId('img'),
              url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
              alt_text: formName.trim(),
              sort_order: 0,
            },
          ];

    if (editProduct) {
      // Update existing
      db.updateProduct(editProduct.id, {
        name: formName.trim(),
        slug: slugGenerated,
        description: formDescription.trim(),
        brand: formBrand.trim(),
        base_price: basePriceNum,
        compare_at_price: comparePriceNum,
        category_id: formCategoryId,
        images: finalImages,
        is_featured: formIsFeatured,
        is_active: formIsActive,
        status: formIsActive ? 'active' : 'draft',
      });
      toast.success(`Updated "${formName}"`);
    } else {
      // Create new
      db.createProduct({
        name: formName.trim(),
        slug: slugGenerated,
        description: formDescription.trim(),
        brand: formBrand.trim(),
        sku: generateRandomSku(),
        status: formIsActive ? 'active' : 'draft',
        base_price: basePriceNum,
        compare_at_price: comparePriceNum,
        category_id: formCategoryId || categories[0]?.id || 'cat-1',
        is_featured: formIsFeatured,
        is_active: formIsActive,
        images: finalImages,
        variants: [
          {
            id: generateTimestampId('var'),
            product_id: '',
            sku: `${slugGenerated.toUpperCase()}-STD`,
            price: basePriceNum,
            stock_quantity: 20,
            option_values: { size: 'Regular', color: 'Default' },
          },
        ],
      });
      toast.success(`Created product "${formName}" with direct photo imagery`);
    }

    setCreateModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteProduct = (id: string) => {
    db.deleteProduct(id);
    toast.info('Product archived and deleted from catalog');
    setDeleteConfirmId(null);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryModalVariant) return;
    db.adjustInventory(inventoryModalVariant.id, newStockValue);
    toast.success(`Stock level for ${inventoryModalVariant.sku} updated to ${newStockValue}`);
    setInventoryModalVariant(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Products & Inventory Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Full CRUD lifecycle, variant matrix, price tiering, and stock management.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Product</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, SKU..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Storefront)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category & Brand</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Variants & Stock</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock_quantity, 0);
                const isLowStock = p.variants.some((v) => v.stock_quantity <= 5);

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                          <SafeImage
                            src={p.images[0]?.url || 'https://picsum.photos/seed/item/80/80'}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 hover:underline">
                            <Link href={`/products/${p.slug}`} target="_blank">
                              {p.name}
                            </Link>
                          </p>
                          <p className="text-[11px] text-stone-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-900">{p.category?.name || 'Uncategorized'}</p>
                      <p className="text-[11px] text-stone-500">{p.brand}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900">৳{p.base_price.toFixed(2)}</span>
                      {p.compare_at_price && (
                        <span className="text-[11px] text-stone-400 line-through ml-1.5">
                          ৳{p.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-stone-900">
                            {p.variants.length} variant{p.variants.length > 1 ? 's' : ''}
                          </span>
                          {isLowStock && (
                            <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => {
                                setInventoryModalVariant({
                                  id: v.id,
                                  name: p.name,
                                  sku: v.sku,
                                  stock: v.stock_quantity,
                                });
                                setNewStockValue(v.stock_quantity);
                              }}
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded px-1.5 py-0.5 border border-stone-200 transition-colors"
                              title="Click to adjust variant stock"
                            >
                              {v.option_values.size || v.option_values.color || 'Std'}:{' '}
                              <strong>{v.stock_quantity}</strong>
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          db.updateProduct(p.id, { is_active: !p.is_active });
                          toast.info(`Product set to ${!p.is_active ? 'Active' : 'Draft'}`);
                          setRefreshKey((k) => k + 1);
                        }}
                      >
                        <Badge
                          variant={p.is_active ? 'success' : 'secondary'}
                          className="text-[10px] uppercase font-bold cursor-pointer hover:opacity-80"
                        >
                          {p.is_active ? 'Active' : 'Draft'}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/products/${p.slug}`} target="_blank" className="p-1 text-stone-400 hover:text-stone-700" title="View in Storefront">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-stone-400 hover:text-stone-900"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1 text-stone-400 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={editProduct ? `Edit Product: ${editProduct.name}` : 'Create New Luxury Piece'}
        description="Configure product attributes, SKU, pricing, category allocation, and visibility."
        className="max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Double-Breasted Wool Overcoat"
            />
            <Input
              label="URL Slug (Optional)"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="e.g. double-breasted-wool-overcoat"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Brand / STITCH BD"
              required
              value={formBrand}
              onChange={(e) => setFormBrand(e.target.value)}
            />
            <Input
              label="Base Price (৳ BDT)"
              type="number"
              step="0.01"
              required
              value={formBasePrice}
              onChange={(e) => setFormBasePrice(e.target.value)}
            />
            <Input
              label="Compare-At Price (৳ BDT)"
              type="number"
              step="0.01"
              value={formComparePrice}
              onChange={(e) => setFormComparePrice(e.target.value)}
              placeholder="e.g. 580"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-900 font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Direct Product Photo Upload (No URL required) */}
          <div>
            <ProductImageUploader
              images={formImages}
              onChange={setFormImages}
              maxPhotos={8}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
              Detailed Description & STITCH BD Craft Notes
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Meticulously woven in Biella, Italy using double-faced melton wool..."
              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="rounded accent-stone-900"
              />
              <span className="font-semibold">Published to Storefront</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsFeatured}
                onChange={(e) => setFormIsFeatured(e.target.checked)}
                className="rounded accent-stone-900"
              />
              <span className="font-semibold">Feature on Homepage</span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Product Deletion"
        description="Are you certain you wish to delete this piece? This action cannot be reversed."
      >
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmId && handleDeleteProduct(deleteConfirmId)}
          >
            Delete Permanently
          </Button>
        </div>
      </Modal>

      {/* Inventory Stock Adjustment Modal */}
      <Modal
        isOpen={Boolean(inventoryModalVariant)}
        onClose={() => setInventoryModalVariant(null)}
        title="Adjust Variant Stock Quantity"
        description={inventoryModalVariant ? `${inventoryModalVariant.name} (${inventoryModalVariant.sku})` : ''}
      >
        <form onSubmit={handleUpdateStock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Current Available Units
            </label>
            <input
              type="number"
              min={0}
              required
              value={newStockValue}
              onChange={(e) => setNewStockValue(Number(e.target.value))}
              className="w-full text-base font-bold p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setNewStockValue((v) => v + 10)}
              className="text-xs px-2.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 font-semibold"
            >
              +10 Units
            </button>
            <button
              type="button"
              onClick={() => setNewStockValue((v) => v + 25)}
              className="text-xs px-2.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 font-semibold"
            >
              +25 Units
            </button>
            <button
              type="button"
              onClick={() => setNewStockValue(0)}
              className="text-xs px-2.5 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
            >
              Mark Sold Out (0)
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setInventoryModalVariant(null)}>
              Cancel
            </Button>
            <Button type="submit">Update Stock Level</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

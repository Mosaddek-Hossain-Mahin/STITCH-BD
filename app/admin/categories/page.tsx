'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, FolderTree, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Category } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const categories = db.getCategories();
  const products = db.getProducts();

  const handleOpenCreate = () => {
    setEditCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1544441893-675973e31985?w=800');
    setSortOrder(String(categories.length));
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setImageUrl(c.image_url || '');
    setSortOrder(String(c.sort_order));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editCategory) {
      db.updateCategory(editCategory.id, {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        image_url: imageUrl.trim(),
        sort_order: parseInt(sortOrder) || 0,
      });
      toast.success(`Updated category "${name}"`);
    } else {
      db.createCategory({
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        image_url: imageUrl.trim(),
        sort_order: parseInt(sortOrder) || 0,
      });
      toast.success(`Created category "${name}"`);
    }

    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    db.deleteCategory(id);
    toast.info('Category removed');
    setDeleteConfirmId(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Archival Categories & Taxonomies
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize collections, navigation hierarchies, and department hero headers.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Category</span>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug & URL</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Total Pieces</th>
                <th className="py-3 px-4">Display Rank</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((cat) => {
                const assignedCount = products.filter((p) => p.category_id === cat.id).length;

                return (
                  <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                          <Image
                            src={cat.image_url || 'https://picsum.photos/seed/cat/80/80'}
                            alt={cat.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="font-bold text-stone-900">{cat.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                      /category/{cat.slug}
                    </td>

                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {assignedCount} piece{assignedCount !== 1 ? 's' : ''}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-600 font-medium">
                      #{cat.sort_order}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1 text-stone-400 hover:text-stone-900"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-1 text-stone-400 hover:text-red-600"
                          title="Delete Category"
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

      {/* Create / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? `Edit Category: ${editCategory.name}` : 'Create New Collection Category'}
        description="Define division naming, storefront slug path, and promotional background imagery."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tailored Outerwear"
          />

          <Input
            label="URL Slug (Optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. outerwear"
          />

          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
              Description & Curatorial Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sculptural coats and weather-resistant capes..."
              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <Input
            label="Sort Order Rank (Integer)"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />

          <div className="pt-3 border-t border-stone-100 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editCategory ? 'Save Changes' : 'Create Category'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Category Deletion"
        description="Are you sure you wish to delete this category? Associated products will remain in the catalog."
      >
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
          >
            Delete Category
          </Button>
        </div>
      </Modal>
    </div>
  );
}

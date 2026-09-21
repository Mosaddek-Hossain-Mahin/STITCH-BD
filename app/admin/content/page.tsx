'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Layout, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Banner } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminContentPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const banners = db.getBanners();

  const handleOpenCreate = () => {
    setEditBanner(null);
    setTitle('');
    setSubtitle('');
    setBadge('Curated Capsule');
    setCtaLabel('Explore Drop');
    setCtaLink('/products');
    setImageUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600');
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setBadge(b.badge || '');
    setCtaLabel(b.cta_label || '');
    setCtaLink(b.cta_link || '');
    setImageUrl(b.image_url);
    setIsActive(b.is_active);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast.error('Headline and imagery are required');
      return;
    }

    if (editBanner) {
      db.updateBanner(editBanner.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim(),
        cta_label: ctaLabel.trim(),
        cta_link: ctaLink.trim(),
        image_url: imageUrl.trim(),
        is_active: isActive,
      });
      toast.success(`Banner updated: "${title}"`);
    } else {
      db.createBanner({
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim(),
        cta_label: ctaLabel.trim(),
        cta_link: ctaLink.trim(),
        image_url: imageUrl.trim(),
        is_active: isActive,
      });
      toast.success(`Banner deployed: "${title}"`);
    }

    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    db.deleteBanner(id);
    toast.info('Banner removed from editorial cycle');
    setDeleteConfirmId(null);
    setRefreshKey((k) => k + 1);
  };

  const handleToggle = (id: string, current: boolean) => {
    db.updateBanner(id, { is_active: !current });
    toast.info(`Banner set to ${!current ? 'Active' : 'Archived'}`);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            CMS Hero Slides & Campaign Banners
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage storefront editorial hero carousels, seasonal headlines, and call-to-actions.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Hero Banner</span>
        </Button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors"
          >
            {/* Banner Preview Frame */}
            <div className="relative h-48 sm:h-56 w-full bg-stone-900 text-white overflow-hidden">
              <Image
                src={b.image_url}
                alt={b.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                {b.badge && (
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-amber-300 border-amber-400/40">
                    {b.badge}
                  </Badge>
                )}
                <h3 className="font-serif text-lg font-bold text-white line-clamp-1">{b.title}</h3>
                {b.subtitle && <p className="text-xs text-stone-300 line-clamp-1">{b.subtitle}</p>}
              </div>
            </div>

            {/* Meta & Actions Bar */}
            <div className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-stone-700">Link target:</span>
                  <span className="font-mono text-stone-500">{b.cta_link || '/products'}</span>
                </div>
                <button onClick={() => handleToggle(b.id, b.is_active)}>
                  <Badge
                    variant={b.is_active ? 'success' : 'secondary'}
                    className="text-[9px] uppercase font-bold cursor-pointer hover:opacity-80"
                  >
                    {b.is_active ? 'Active' : 'Draft'}
                  </Badge>
                </button>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  CTA Label: <strong>{b.cta_label || 'Explore'}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 rounded"
                    title="Edit Banner"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(b.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                    title="Delete Banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Banner Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBanner ? 'Edit Editorial Banner' : 'Create Hero Slide Banner'}
        description="Configure seasonal headline, photography background, and storefront routing."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Hero Headline"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Winter 2026 Collection"
          />

          <Input
            label="Supporting Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Pure cashmere and structural melton wool tailoring"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Badge Tag"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Limited Edition"
            />
            <Input
              label="Call to Action Button Text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="e.g. Explore Drop"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target URL Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="/products or /category/outerwear"
            />
            <Input
              label="Image URL (Unsplash or CDN)"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <label className="flex items-center space-x-2 text-xs text-stone-800 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded accent-stone-900"
            />
            <span className="font-semibold">Publish to live storefront immediately</span>
          </label>

          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editBanner ? 'Save Changes' : 'Deploy Banner'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Banner Removal"
        description="Are you sure you want to remove this banner?"
      >
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
          >
            Delete Banner
          </Button>
        </div>
      </Modal>
    </div>
  );
}

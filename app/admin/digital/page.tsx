'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { digitalDb } from '@/lib/digital/db';
import { DigitalProduct, DigitalCategory, DigitalFileFormat, DigitalLicenseType } from '@/lib/digital/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  Download,
  Plus,
  Edit2,
  Trash2,
  Clock,
  ShieldCheck,
  Zap,
  HardDrive,
  Layers,
  FileCode,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDigitalProductsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>(() => digitalDb.getProducts());
  const [kpis, setKpis] = useState(() => digitalDb.getKPIs());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<DigitalCategory>('tech_packs');
  const [formPrice, setFormPrice] = useState('2500');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formFileFormat, setFormFileFormat] = useState<DigitalFileFormat>('PDF');
  const [formFileSizeMb, setFormFileSizeMb] = useState('25');
  const [formMaxDownloads, setFormMaxDownloads] = useState('3');
  const [formExpiryHours, setFormExpiryHours] = useState('72');
  const [formLicenseType, setFormLicenseType] = useState<DigitalLicenseType>('Commercial Atelier');
  const [formCoverImage, setFormCoverImage] = useState('https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80');
  const [formSampleDownloadName, setFormSampleDownloadName] = useState('STITCH-BD_Pattern.zip');
  const [formSampleContent, setFormSampleContent] = useState('STITCH BD SECURE DIGITAL ASSET\nVersion 1.0\nLicensed to verified digital buyer.');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormSlug('');
    setFormSummary('');
    setFormDescription('');
    setFormCategory('tech_packs');
    setFormPrice('2500');
    setFormComparePrice('');
    setFormFileFormat('PDF');
    setFormFileSizeMb('25');
    setFormMaxDownloads('3');
    setFormExpiryHours('72');
    setFormLicenseType('Commercial Atelier');
    setFormCoverImage('https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80');
    setFormSampleDownloadName('STITCH-BD_Pattern.zip');
    setFormSampleContent('STITCH BD SECURE DIGITAL ASSET\nVersion 1.0\nLicensed to verified digital buyer.');
    setFormIsActive(true);
    setFormIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (p: DigitalProduct) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormSummary(p.summary);
    setFormDescription(p.description);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormComparePrice(p.compare_at_price ? p.compare_at_price.toString() : '');
    setFormFileFormat(p.file_format);
    setFormFileSizeMb(p.file_size_mb.toString());
    setFormMaxDownloads(p.max_downloads.toString());
    setFormExpiryHours(p.expiry_hours.toString());
    setFormLicenseType(p.license_type);
    setFormCoverImage(p.cover_image);
    setFormSampleDownloadName(p.sample_download_name);
    setFormSampleContent(p.sample_file_content);
    setFormIsActive(p.is_active);
    setFormIsFeatured(p.is_featured);
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    const priceNum = parseFloat(formPrice) || 0;
    const compareNum = formComparePrice ? parseFloat(formComparePrice) : undefined;
    const sizeNum = parseFloat(formFileSizeMb) || 10;
    const maxDl = parseInt(formMaxDownloads, 10) || 3;
    const expHours = parseInt(formExpiryHours, 10) || 72;
    const slug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingProduct) {
      digitalDb.updateProduct(editingProduct.id, {
        title: formTitle.trim(),
        slug,
        summary: formSummary.trim(),
        description: formDescription.trim(),
        category: formCategory,
        price: priceNum,
        compare_at_price: compareNum,
        file_format: formFileFormat,
        file_size_mb: sizeNum,
        max_downloads: maxDl,
        expiry_hours: expHours,
        license_type: formLicenseType,
        cover_image: formCoverImage.trim(),
        sample_download_name: formSampleDownloadName.trim(),
        sample_file_content: formSampleContent,
        is_active: formIsActive,
        is_featured: formIsFeatured,
      });
      toast.success('Digital asset updated');
    } else {
      digitalDb.createProduct({
        title: formTitle.trim(),
        slug,
        summary: formSummary.trim(),
        description: formDescription.trim(),
        category: formCategory,
        price: priceNum,
        compare_at_price: compareNum,
        file_format: formFileFormat,
        file_size_mb: sizeNum,
        version: '1.0',
        software_compatibility: ['Illustrator', 'PDF Readers', 'CAD Standard'],
        includes: ['Master Asset Archive', 'License Certificate', 'Graded Specs'],
        max_downloads: maxDl,
        expiry_hours: expHours,
        license_type: formLicenseType,
        cover_image: formCoverImage.trim(),
        preview_images: [formCoverImage.trim()],
        sample_download_name: formSampleDownloadName.trim(),
        sample_file_content: formSampleContent,
        is_featured: formIsFeatured,
        is_active: formIsActive,
      });
      toast.success('Digital asset created');
    }

    setProducts([...digitalDb.getProducts()]);
    setKpis(digitalDb.getKPIs());
    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove "${title}" from digital products catalog?`)) {
      digitalDb.deleteProduct(id);
      setProducts([...digitalDb.getProducts()]);
      setKpis(digitalDb.getKPIs());
      toast.success('Digital asset removed');
    }
  };

  const handleToggleStatus = (p: DigitalProduct) => {
    digitalDb.updateProduct(p.id, { is_active: !p.is_active });
    setProducts([...digitalDb.getProducts()]);
    toast.success(`Asset marked as ${!p.is_active ? 'Active' : 'Inactive'}`);
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Digital Atelier Products & Master Files
            </h1>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[10px] uppercase font-bold">
              Independent Module
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage downloadable garment tech packs, sewing patterns, CAD vectors, and CLO3D simulations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/digital"
            target="_blank"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs')}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Storefront View
          </Link>

          <Button size="sm" onClick={openCreateModal} className="text-xs">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Digital Product
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Digital Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            ৳{kpis.total_revenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-stone-400">100% Prepaid Clearing</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Digital Orders</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {kpis.total_orders}
          </p>
          <span className="text-[10px] text-stone-400">Auto-dispatched to email</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Active Tokens</span>
            <Clock className="h-4 w-4 text-sky-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {kpis.active_downloads}
          </p>
          <span className="text-[10px] text-stone-400">Under 72h–168h window</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Downloads Served</span>
            <Download className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {kpis.downloads_served}
          </p>
          <span className="text-[10px] text-stone-400">Verified client downloads</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/50">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Catalog Manifest ({products.length} Items)
          </span>
          <span className="text-[11px] text-stone-500">
            Prepaid downloads with expiry & usage counters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200/80">
              <tr>
                <th className="p-4">Asset Details</th>
                <th className="p-4">Format / Size</th>
                <th className="p-4">Price</th>
                <th className="p-4">License / Limits</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-stone-900 line-clamp-1">{p.title}</div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                      {p.file_format}
                    </span>
                    <span className="text-stone-500 ml-1.5">{p.file_size_mb} MB</span>
                  </td>
                  <td className="p-4 font-serif font-bold text-stone-900">
                    ৳{p.price.toLocaleString()}
                  </td>
                  <td className="p-4 space-y-0.5">
                    <div className="font-semibold text-stone-800">{p.license_type}</div>
                    <div className="text-[10px] text-stone-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-amber-600" />
                      <span>{p.expiry_hours}h Expiry • Max {p.max_downloads} DLs</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-stone-900">{p.downloads_count}</span>
                    <span className="text-stone-400 text-[11px]"> ({p.sales_count} sales)</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => openEditModal(p)}
                    >
                      <Edit2 className="h-3.5 w-3.5 text-stone-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700"
                      onClick={() => handleDelete(p.id, p.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? `Edit Digital Asset: ${editingProduct.title}` : 'Add New Digital Asset'}
        description="Configure downloadable file specifications, licensing rules, download limits, and expiry periods."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <Input
            label="Product Title"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="e.g. Architectural Trench Coat Full Production Tech Pack"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="tech_packs">Tech Packs</option>
                <option value="sewing_patterns">Sewing Patterns</option>
                <option value="cad_blueprints">CAD & Laser Files</option>
                <option value="garment_3d">3D & CLO3D</option>
                <option value="masterclasses">Masterclasses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                File Format
              </label>
              <select
                value={formFileFormat}
                onChange={(e) => setFormFileFormat(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="PDF">PDF</option>
                <option value="ZIP">ZIP</option>
                <option value="DXF">DXF</option>
                <option value="CLO3D">CLO3D</option>
                <option value="MP4">MP4</option>
                <option value="AI">AI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price (BDT)"
              type="number"
              required
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
            />
            <Input
              label="Compare At Price"
              type="number"
              value={formComparePrice}
              onChange={(e) => setFormComparePrice(e.target.value)}
            />
            <Input
              label="File Size (MB)"
              type="number"
              step="0.1"
              required
              value={formFileSizeMb}
              onChange={(e) => setFormFileSizeMb(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Expiry Window (Hours)"
              type="number"
              required
              value={formExpiryHours}
              onChange={(e) => setFormExpiryHours(e.target.value)}
              placeholder="72"
            />
            <Input
              label="Max Downloads Per Order"
              type="number"
              required
              value={formMaxDownloads}
              onChange={(e) => setFormMaxDownloads(e.target.value)}
              placeholder="3"
            />
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                License Type
              </label>
              <select
                value={formLicenseType}
                onChange={(e) => setFormLicenseType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
              >
                <option value="Personal Maker">Personal Maker</option>
                <option value="Commercial Atelier">Commercial Atelier</option>
                <option value="Enterprise Studio">Enterprise Studio</option>
              </select>
            </div>
          </div>

          <Input
            label="Cover Image URL"
            value={formCoverImage}
            onChange={(e) => setFormCoverImage(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Brief Summary
            </label>
            <textarea
              rows={2}
              value={formSummary}
              onChange={(e) => setFormSummary(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900"
              placeholder="Industrial garment tech pack with graded specs..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Sample Download File Name & Content
            </label>
            <Input
              label=""
              value={formSampleDownloadName}
              onChange={(e) => setFormSampleDownloadName(e.target.value)}
              placeholder="STITCH-BD_Pack.zip"
            />
            <textarea
              rows={3}
              value={formSampleContent}
              onChange={(e) => setFormSampleContent(e.target.value)}
              className="mt-2 w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono text-[11px] text-stone-800"
              placeholder="File payload contents to be generated on download..."
            />
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-xs font-medium text-stone-800">Active & Published</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsFeatured}
                onChange={(e) => setFormIsFeatured(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-xs font-medium text-stone-800">Featured in Studio</span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingProduct ? 'Update Asset' : 'Publish Digital Asset'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

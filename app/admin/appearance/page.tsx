'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Palette,
  Upload,
  Image as ImageIcon,
  Layout,
  Sliders,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Megaphone,
  Store,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/safe-image';
import { useStoreSettings } from '@/lib/store/settings-store';
import { HomepageHeroLayout, StoreSettings } from '@/lib/types';
import { processImageFile } from '@/lib/utils/image-upload';
import { db } from '@/lib/db/store';
import { toast } from 'sonner';

export default function AdminAppearancePage() {
  const { settings, updateSettings, toggleSection, resetSettings } = useStoreSettings();

  // Local state for editing form
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'sections' | 'story' | 'announcement'>('branding');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Handle direct file upload for Logo
  const handleLogoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const processed = await processImageFile(file, 600, 0.95);
      setFormData((prev) => ({
        ...prev,
        logo_type: 'image',
        logo_image_url: processed.dataUrl,
      }));
      toast.success('Logo photo uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process logo file');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Handle direct file upload for Brand Icon / Crest
  const handleIconUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploadingIcon(true);
    try {
      const processed = await processImageFile(file, 300, 0.95);
      setFormData((prev) => ({
        ...prev,
        brand_icon_url: processed.dataUrl,
      }));
      toast.success('Brand icon / seal uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process icon');
    } finally {
      setIsUploadingIcon(false);
      if (iconInputRef.current) iconInputRef.current.value = '';
    }
  };

  // Handle direct file upload for Hero Background
  const handleHeroUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploadingHero(true);
    try {
      const processed = await processImageFile(file, 1920, 0.88);
      setFormData((prev) => ({
        ...prev,
        hero_image_url: processed.dataUrl,
      }));
      toast.success('Homepage hero photo uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process hero image');
    } finally {
      setIsUploadingHero(false);
      if (heroInputRef.current) heroInputRef.current.value = '';
    }
  };

  // Handle direct file upload for Story Banner
  const handleStoryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploadingStory(true);
    try {
      const processed = await processImageFile(file, 1600, 0.88);
      setFormData((prev) => ({
        ...prev,
        story_banner_image_url: processed.dataUrl,
      }));
      toast.success('Editorial story photo uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process story image');
    } finally {
      setIsUploadingStory(false);
      if (storyInputRef.current) storyInputRef.current.value = '';
    }
  };

  // Save all customizer changes
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    db.addAuditLog('Admin', 'UPDATE_STOREFRONT_APPEARANCE', 'APPEARANCE', 'global-appearance', {
      brand_name: formData.brand_name,
      hero_layout: formData.hero_layout,
      logo_type: formData.logo_type,
    });
    toast.success('Storefront layout and branding changes published live!');
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all storefront layout and branding customization to factory defaults?')) {
      resetSettings();
      setFormData(useStoreSettings.getState().settings);
      toast.info('Storefront reset to initial luxury defaults');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-6 w-6 rounded bg-amber-600 text-stone-950 flex items-center justify-center font-bold text-xs">
              <Palette className="h-3.5 w-3.5 text-white" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-950">
              Storefront Customizer & Layout Manager
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Directly upload your brand logo, adjust homepage layouts, change hero imagery, and configure section visibility.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetToDefaults}
            className="text-xs text-stone-600 hover:text-red-700"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset Defaults
          </Button>

          <Link href="/" target="_blank">
            <Button variant="secondary" size="sm" className="text-xs font-semibold">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Live Storefront
            </Button>
          </Link>

          <Button onClick={() => handleSaveAll()} size="sm" className="text-xs font-bold shadow-sm">
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Publish All Changes
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'branding'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Brand Logo & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'hero'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Layout className="h-3.5 w-3.5" />
          <span>Homepage Hero & Layout</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'sections'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Sections Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('story')}
          className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'story'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Editorial Story Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'announcement'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Megaphone className="h-3.5 w-3.5" />
          <span>Announcement Bar</span>
        </button>
      </div>

      {/* TAB 1: Brand Logo & Identity */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Logo Configuration Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
                  Brand Logo Style
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose between a direct uploaded image logo or an architectural monogram mark.
                </p>
              </div>

              {/* Logo Type Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, logo_type: 'image' })}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.logo_type === 'image'
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.logo_type === 'image'}
                      onChange={() => setFormData({ ...formData, logo_type: 'image' })}
                      className="accent-stone-900"
                    />
                    <span className="text-xs font-bold text-stone-900">Custom Image Logo</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 pl-5">
                    Direct photo upload (PNG, JPG, SVG with transparent background).
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, logo_type: 'monogram' })}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.logo_type === 'monogram'
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.logo_type === 'monogram'}
                      onChange={() => setFormData({ ...formData, logo_type: 'monogram' })}
                      className="accent-stone-900"
                    />
                    <span className="text-xs font-bold text-stone-900">Monogram & Typographic Mark</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 pl-5">
                    Clean minimalist seal badge + luxury serif typography.
                  </p>
                </div>
              </div>

              {/* Direct Photo Upload for Logo */}
              {formData.logo_type === 'image' ? (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Upload Logo File (From Computer)
                  </label>

                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-stone-50"
                  >
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => handleLogoUpload(e.target.files)}
                    />

                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
                        {isUploadingLogo ? (
                          <Loader2 className="h-5 w-5 animate-spin text-stone-900" />
                        ) : (
                          <Upload className="h-5 w-5 text-stone-700" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          {isUploadingLogo ? 'Uploading & processing...' : 'Click to upload your logo file'}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          PNG with transparent background recommended • Max 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.logo_image_url && (
                    <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-28 bg-white rounded border border-stone-200 flex items-center justify-center p-1 relative overflow-hidden">
                          <SafeImage
                            src={formData.logo_image_url}
                            alt="Uploaded Logo Preview"
                            fill
                            sizes="112px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-stone-900">Current Uploaded Logo</p>
                          <p className="text-[10px] text-stone-500">Active across navigation & footer</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo_image_url: '' })}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold p-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <Input
                    label="Monogram Letter / Abbreviation"
                    value={formData.logo_monogram_text}
                    onChange={(e) =>
                      setFormData({ ...formData, logo_monogram_text: e.target.value.slice(0, 3).toUpperCase() })
                    }
                    placeholder="e.g. A"
                    className="max-w-xs uppercase font-serif font-bold text-base tracking-wider"
                  />
                  <p className="text-[11px] text-stone-500">
                    Appears inside the luxury seal icon in header and footer.
                  </p>
                </div>
              )}

              {/* Brand Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                <Input
                  label="Brand Name"
                  required
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  placeholder="e.g. STITCH BD"
                />

                <Input
                  label="Tagline / Department"
                  value={formData.brand_tagline}
                  onChange={(e) => setFormData({ ...formData, brand_tagline: e.target.value })}
                  placeholder="e.g. Haute Menswear & Horlogerie"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                  Brand Narrative & Studio Description
                </label>
                <textarea
                  rows={3}
                  value={formData.brand_description}
                  onChange={(e) => setFormData({ ...formData, brand_description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                  placeholder="Short brand manifesto displayed in the footer..."
                />
              </div>

              {/* Direct Icon / Crest Upload */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Secondary Brand Crest / Seal (Optional)
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => iconInputRef.current?.click()}
                    className="px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 text-xs font-semibold hover:bg-stone-100 flex items-center space-x-2"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Crest Photo</span>
                  </button>
                  <input
                    ref={iconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleIconUpload(e.target.files)}
                  />
                  {formData.brand_icon_url && (
                    <div className="h-8 w-8 relative rounded-full border border-stone-300 overflow-hidden bg-white">
                      <SafeImage src={formData.brand_icon_url} alt="Crest" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 text-stone-100 rounded-xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Live Navigation Preview
                </span>
                <Badge variant="outline" className="text-[10px] text-stone-300 border-stone-700">
                  Real-time Render
                </Badge>
              </div>

              {/* Header Mockup */}
              <div className="bg-white text-stone-900 rounded-lg p-4 border border-stone-200 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {formData.logo_type === 'image' && formData.logo_image_url ? (
                      <div className="h-8 w-28 relative">
                        <SafeImage
                          src={formData.logo_image_url}
                          alt={formData.brand_name}
                          fill
                          sizes="112px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="h-8 w-8 bg-stone-950 text-white rounded-lg flex items-center justify-center font-serif text-base font-bold">
                          {formData.logo_monogram_text || 'S'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-base font-bold tracking-tight text-stone-950">
                            {formData.brand_name || 'STITCH BD'}
                          </span>
                          <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-semibold -mt-1">
                            {formData.brand_tagline || 'Modern Luxury'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center space-x-3 text-xs font-semibold text-stone-600">
                    <span>Products</span>
                    <span>Outerwear</span>
                    <span>Footwear</span>
                  </div>
                </div>
              </div>

              {/* Footer Mockup */}
              <div className="bg-stone-950 text-stone-300 rounded-lg p-4 border border-stone-800 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-stone-100 text-stone-950 rounded flex items-center justify-center font-serif text-xs font-bold">
                    {formData.logo_monogram_text || 'S'}
                  </div>
                  <span className="font-serif text-sm font-bold text-white tracking-tight">
                    {formData.brand_name || 'STITCH BD'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  {formData.brand_description || 'An architectural exploration in modern luxury.'}
                </p>
              </div>

              <Button
                onClick={() => handleSaveAll()}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold"
              >
                Apply Brand Changes Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Homepage Hero & Layout */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
                  Hero Layout Architecture
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select the structural presentation style for your primary storefront arrival.
                </p>
              </div>

              {/* 3 Layout Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cinematic Full */}
                <div
                  onClick={() => setFormData({ ...formData, hero_layout: 'cinematic_full' })}
                  className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all text-left flex flex-col justify-between ${
                    formData.hero_layout === 'cinematic_full'
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded bg-stone-900 flex flex-col justify-end p-2 border border-stone-800">
                      <div className="h-1.5 w-16 bg-white/80 rounded" />
                      <div className="h-1 w-24 bg-white/40 rounded mt-1" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 block">Cinematic Full-Width</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Immersive, dramatic full-bleed background imagery with bottom statement.
                  </p>
                </div>

                {/* Split Editorial */}
                <div
                  onClick={() => setFormData({ ...formData, hero_layout: 'split_editorial' })}
                  className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all text-left flex flex-col justify-between ${
                    formData.hero_layout === 'split_editorial'
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded bg-stone-100 flex p-1.5 gap-1 border border-stone-200">
                      <div className="w-1/2 flex flex-col justify-center gap-1 p-1">
                        <div className="h-2 w-12 bg-stone-800 rounded" />
                        <div className="h-1 w-16 bg-stone-400 rounded" />
                      </div>
                      <div className="w-1/2 bg-stone-900 rounded" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 block">Split Editorial</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Modern 50/50 dual composition pairing bold typography and feature photography.
                  </p>
                </div>

                {/* Minimalist Centered */}
                <div
                  onClick={() => setFormData({ ...formData, hero_layout: 'minimalist_centered' })}
                  className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all text-left flex flex-col justify-between ${
                    formData.hero_layout === 'minimalist_centered'
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded bg-stone-900 flex flex-col items-center justify-center p-2 border border-stone-800">
                      <div className="h-1.5 w-16 bg-white/90 rounded text-center" />
                      <div className="h-1 w-20 bg-white/40 rounded mt-1" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 block">Minimalist Centered</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Gallery-style centered alignment with spacious negative margins.
                  </p>
                </div>
              </div>

              {/* Direct Photo Upload for Hero Background */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Direct Hero Photo Upload (From Device)
                </label>

                <div
                  onClick={() => heroInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-stone-50"
                >
                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleHeroUpload(e.target.files)}
                  />

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
                      {isUploadingHero ? (
                        <Loader2 className="h-5 w-5 animate-spin text-stone-900" />
                      ) : (
                        <Upload className="h-5 w-5 text-stone-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {isUploadingHero ? 'Processing photo...' : 'Click to choose hero photo from computer'}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        High-resolution photo recommended (1920×1080) • Direct upload, no URL needed
                      </p>
                    </div>
                  </div>
                </div>

                {formData.hero_image_url && (
                  <div className="relative aspect-[16/6] rounded-xl overflow-hidden border border-stone-300 shadow-xs">
                    <SafeImage
                      src={formData.hero_image_url}
                      alt="Hero Preview"
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="text-[10px] bg-stone-950/80 backdrop-blur-xs">
                        Active Hero Photo
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Hero Copy & CTA settings */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Capsule Badge / Tag"
                    value={formData.hero_badge}
                    onChange={(e) => setFormData({ ...formData, hero_badge: e.target.value })}
                    placeholder="e.g. New Season 2026"
                  />

                  <Input
                    label="Headline Title"
                    required
                    value={formData.hero_title}
                    onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                    placeholder="e.g. Autumn/Winter Horizon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                    Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={formData.hero_subtitle}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                    placeholder="Brief architectural description of the collection..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Button Label"
                    value={formData.hero_cta_label}
                    onChange={(e) => setFormData({ ...formData, hero_cta_label: e.target.value })}
                    placeholder="Explore Collection"
                  />

                  <Input
                    label="Primary Button Link"
                    value={formData.hero_cta_link}
                    onChange={(e) => setFormData({ ...formData, hero_cta_link: e.target.value })}
                    placeholder="/products"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Secondary Button Label (Optional)"
                    value={formData.hero_secondary_cta_label || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_secondary_cta_label: e.target.value })
                    }
                    placeholder="Explore Footwear"
                  />

                  <Input
                    label="Secondary Button Link"
                    value={formData.hero_secondary_cta_link || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_secondary_cta_link: e.target.value })
                    }
                    placeholder="/category/footwear"
                  />
                </div>

                {/* Darkening Opacity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-stone-700 uppercase tracking-wider">
                      Background Darkening Overlay ({formData.hero_overlay_opacity}%)
                    </label>
                    <span className="text-[11px] text-stone-500">Improves typography contrast</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="85"
                    value={formData.hero_overlay_opacity}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_overlay_opacity: parseInt(e.target.value) })
                    }
                    className="w-full accent-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Live Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-950 text-stone-100 rounded-xl p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Live Hero Preview
                </span>
                <span className="text-[11px] text-stone-400 capitalize">
                  {formData.hero_layout.replace('_', ' ')}
                </span>
              </div>

              {/* Miniature Hero Simulation */}
              <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-stone-900 border border-stone-800 flex flex-col justify-end p-4">
                {formData.hero_image_url && (
                  <SafeImage
                    src={formData.hero_image_url}
                    alt="Hero Preview"
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 bg-stone-950 transition-opacity"
                  style={{ opacity: formData.hero_overlay_opacity / 100 }}
                />

                <div
                  className={`relative z-10 space-y-1.5 ${
                    formData.hero_layout === 'minimalist_centered' ? 'text-center items-center' : ''
                  }`}
                >
                  {formData.hero_badge && (
                    <span className="inline-block text-[9px] bg-white/20 text-white font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs uppercase tracking-wider">
                      {formData.hero_badge}
                    </span>
                  )}
                  <h4 className="font-serif text-base font-bold text-white leading-tight">
                    {formData.hero_title || 'Untitled Horizon'}
                  </h4>
                  <p className="text-[10px] text-stone-300 line-clamp-2 max-w-xs">
                    {formData.hero_subtitle}
                  </p>
                  <div className="pt-1 flex gap-2">
                    <span className="px-2.5 py-1 bg-white text-stone-950 rounded text-[10px] font-bold">
                      {formData.hero_cta_label || 'Shop'}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSaveAll()}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold"
              >
                Publish Hero Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Homepage Sections Manager */}
      {activeTab === 'sections' && (
        <div className="max-w-4xl space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
                Homepage Sections & Visual Hierarchy
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Toggle individual sections on or off to tailor your storefront narrative.
              </p>
            </div>

            <div className="divide-y divide-stone-100">
              {[
                {
                  key: 'hero' as const,
                  title: '1. Primary Hero Arrival',
                  desc: 'Full-width cinematic or split editorial showcase banner.',
                },
                {
                  key: 'categories' as const,
                  title: '2. Curated Departments & Categories Grid',
                  desc: 'Visual category gateways (Outerwear, Footwear, Leather Goods, Objects).',
                },
                {
                  key: 'featured_products' as const,
                  title: '3. Signature Pieces / Featured Collection',
                  desc: 'Curated 4-column product carousel of top STITCH BD signatures.',
                },
                {
                  key: 'editorial_story' as const,
                  title: '4. Editorial Craftsmanship Story Banner',
                  desc: 'High-impact full-width editorial narrative highlighting artisanal heritage.',
                },
                {
                  key: 'new_arrivals' as const,
                  title: '5. New Arrivals Catalog Grid',
                  desc: 'Fresh releases and latest seasonal drops.',
                },
                {
                  key: 'value_props' as const,
                  title: '6. Trust Badges & Service Guarantees',
                  desc: 'Complimentary Express Freight, Handcrafted Quality, 30-Day Returns, Encrypted Payments.',
                },
                {
                  key: 'newsletter' as const,
                  title: '7. The STITCH BD VIP Dispatch Box',
                  desc: 'Email subscription box for exclusive capsule releases and studio notes.',
                },
              ].map((sec) => {
                const isEnabled = formData.sections_visibility[sec.key];
                return (
                  <div key={sec.key} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-stone-900">{sec.title}</span>
                        <Badge variant={isEnabled ? 'success' : 'secondary'} className="text-[9px] uppercase font-bold">
                          {isEnabled ? 'Visible on Homepage' : 'Hidden'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{sec.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          sections_visibility: {
                            ...prev.sections_visibility,
                            [sec.key]: !prev.sections_visibility[sec.key],
                          },
                        }));
                      }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-stone-950' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <Button onClick={() => handleSaveAll()} className="text-xs font-bold">
                Save Section Layout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Editorial Story Banner */}
      {activeTab === 'story' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
                  Editorial Craftsmanship Banner
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Customize the brand story banner that showcases artisanal workshops and heritage.
                </p>
              </div>

              {/* Direct Photo Upload for Story Banner */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Direct Photo Upload (From Computer)
                </label>

                <div
                  onClick={() => storyInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-stone-50"
                >
                  <input
                    ref={storyInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleStoryUpload(e.target.files)}
                  />

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
                      {isUploadingStory ? (
                        <Loader2 className="h-5 w-5 animate-spin text-stone-900" />
                      ) : (
                        <Upload className="h-5 w-5 text-stone-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {isUploadingStory ? 'Processing image...' : 'Click to upload story photo from device'}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Wide panoramic photo recommended (1600×900)
                      </p>
                    </div>
                  </div>
                </div>

                {formData.story_banner_image_url && (
                  <div className="relative aspect-[16/7] rounded-xl overflow-hidden border border-stone-300 shadow-xs">
                    <SafeImage
                      src={formData.story_banner_image_url}
                      alt="Story Preview"
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2 border-t border-stone-100">
                <Input
                  label="Story Badge"
                  value={formData.story_banner_badge || ''}
                  onChange={(e) => setFormData({ ...formData, story_banner_badge: e.target.value })}
                  placeholder="e.g. The STITCH BD Story"
                />

                <Input
                  label="Story Headline"
                  required
                  value={formData.story_banner_title}
                  onChange={(e) => setFormData({ ...formData, story_banner_title: e.target.value })}
                  placeholder="e.g. Crafted With Architectural Precision"
                />

                <div>
                  <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                    Story Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={formData.story_banner_subtitle}
                    onChange={(e) => setFormData({ ...formData, story_banner_subtitle: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                    placeholder="Detailed narrative regarding provenance, materials, and ethical sourcing..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Button Label"
                    value={formData.story_banner_cta_label}
                    onChange={(e) => setFormData({ ...formData, story_banner_cta_label: e.target.value })}
                    placeholder="Discover Our Craft"
                  />

                  <Input
                    label="Button Destination Link"
                    value={formData.story_banner_cta_link}
                    onChange={(e) => setFormData({ ...formData, story_banner_cta_link: e.target.value })}
                    placeholder="/products"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <Button onClick={() => handleSaveAll()} className="text-xs font-bold">
                  Save Story Banner
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-950 text-stone-100 rounded-xl p-5 space-y-3 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block pb-2 border-b border-stone-800">
                Story Banner Mockup
              </span>

              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-900 border border-stone-800 flex flex-col justify-end p-4">
                {formData.story_banner_image_url && (
                  <SafeImage
                    src={formData.story_banner_image_url}
                    alt="Story Mockup"
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-stone-950/70" />

                <div className="relative z-10 space-y-1.5">
                  {formData.story_banner_badge && (
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                      {formData.story_banner_badge}
                    </span>
                  )}
                  <h4 className="font-serif text-sm font-bold text-white">
                    {formData.story_banner_title}
                  </h4>
                  <p className="text-[10px] text-stone-300 line-clamp-2">
                    {formData.story_banner_subtitle}
                  </p>
                  <span className="inline-block px-2 py-1 bg-white text-stone-950 rounded text-[10px] font-bold mt-1">
                    {formData.story_banner_cta_label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Announcement Bar */}
      {activeTab === 'announcement' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
                Storefront Top Announcement Bar
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Displays promotional messages, free freight thresholds, and coupon discount codes.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <span className="text-xs font-bold text-stone-900">Enable Announcement Bar</span>
                <p className="text-[11px] text-stone-500">Show/hide at the top of every storefront page</p>
              </div>

              <input
                type="checkbox"
                checked={formData.announcement_enabled}
                onChange={(e) => setFormData({ ...formData, announcement_enabled: e.target.checked })}
                className="h-5 w-5 rounded accent-stone-900 cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Primary Announcement Message"
                value={formData.announcement_text}
                onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
                placeholder="Complimentary Express Delivery on orders over ৳1,500 BDT"
              />

              <Input
                label="Promo Voucher Notice (Optional)"
                value={formData.announcement_code_text || ''}
                onChange={(e) => setFormData({ ...formData, announcement_code_text: e.target.value })}
                placeholder="Use code WELCOME10 for 10% off"
              />

              {/* Background Tone Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
                  Bar Color Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Onyx Black', value: '#0c0a09' },
                    { label: 'Deep Stone', value: '#1c1917' },
                    { label: 'Warm Bronze', value: '#451a03' },
                    { label: 'Midnight Navy', value: '#0f172a' },
                  ].map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, announcement_bg_color: c.value })}
                      className={`p-3 rounded-lg border text-left flex items-center space-x-2 transition-all ${
                        formData.announcement_bg_color === c.value
                          ? 'border-stone-900 ring-2 ring-stone-900/20 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: c.value }} />
                      <span className="text-xs font-semibold text-stone-900">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Bar Preview */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Live Announcement Bar Preview
              </label>
              <div
                className="py-2 px-4 rounded text-xs text-stone-200 text-center font-medium flex items-center justify-center space-x-2 shadow-xs"
                style={{ backgroundColor: formData.announcement_bg_color }}
              >
                <span>{formData.announcement_text || 'Announcement text goes here'}</span>
                {formData.announcement_code_text && (
                  <>
                    <span className="text-stone-500">•</span>
                    <strong className="text-stone-50">{formData.announcement_code_text}</strong>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <Button onClick={() => handleSaveAll()} className="text-xs font-bold">
                Save Announcement Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, Image as ImageIcon, Link2, Loader2, Check } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import { ProductImage } from '@/lib/types';
import { processImageFile } from '@/lib/utils/image-upload';
import { toast } from 'sonner';

interface ProductImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxPhotos?: number;
}

export function ProductImageUploader({
  images,
  onChange,
  maxPhotos = 8,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxPhotos) {
      toast.warning(`Maximum of ${maxPhotos} photos allowed per product.`);
    }

    setIsProcessing(true);
    const newImages: ProductImage[] = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= maxPhotos) break;
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" is not a supported image file.`);
          continue;
        }

        const processed = await processImageFile(file, 1400, 0.88);
        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url: processed.dataUrl,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          sort_order: newImages.length,
          created_at: new Date().toISOString(),
        });
      }

      onChange(newImages);
      toast.success(
        files.length === 1
          ? 'Product photo uploaded successfully'
          : `${files.length} product photos uploaded successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    // Re-index sort order
    const reindexed = updated.map((img, idx) => ({ ...img, sort_order: idx }));
    onChange(reindexed);
    toast.info('Photo removed');
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const without = images.filter((_, idx) => idx !== index);
    const updated = [item, ...without].map((img, idx) => ({ ...img, sort_order: idx }));
    onChange(updated);
    toast.success('Cover photo updated');
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    onChange(copy.map((img, idx) => ({ ...img, sort_order: idx })));
  };

  const handleAddFromUrl = () => {
    const url = urlInputValue.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
      toast.error('Please enter a valid image URL starting with https://');
      return;
    }

    const newImages = [
      ...images,
      {
        id: `img-url-${Date.now()}`,
        url,
        alt_text: 'Product photo',
        sort_order: images.length,
        created_at: new Date().toISOString(),
      },
    ];
    onChange(newImages);
    setUrlInputValue('');
    setShowUrlInput(false);
    toast.success('Photo added from URL');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
          Product Imagery & Gallery ({images.length}/{maxPhotos})
        </label>
        <span className="text-[11px] text-stone-500">
          First photo is used as primary storefront cover
        </span>
      </div>

      {/* Upload Zone (Drag & Drop + File Selector) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-stone-900 bg-stone-100/90 scale-[1.005]'
            : 'border-stone-300 hover:border-stone-400 bg-stone-50/60 hover:bg-stone-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-11 w-11 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-stone-900" />
            ) : (
              <Upload className="h-5 w-5 text-stone-700" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">
              {isProcessing
                ? 'Optimizing and preparing photos...'
                : 'Click to upload from device or drag photos here'}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Direct photo upload (PNG, JPG, WebP) • No external URL required
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((img, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={img.id || idx}
                className={`group relative rounded-lg overflow-hidden bg-stone-100 border text-left transition-all ${
                  isPrimary
                    ? 'border-stone-950 ring-2 ring-stone-950/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Image Preview */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200">
                  <SafeImage
                    src={img.url}
                    alt={img.alt_text || `Product photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {/* Primary Badge */}
                  {isPrimary ? (
                    <div className="absolute top-2 left-2 bg-stone-950 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      <span>Primary Cover</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMakePrimary(idx);
                      }}
                      className="absolute top-2 left-2 bg-white/95 text-stone-900 hover:bg-stone-950 hover:text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1"
                    >
                      <Star className="h-2.5 w-2.5" />
                      <span>Set as Cover</span>
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-stone-950/80 hover:bg-red-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all shadow-xs"
                    title="Remove Photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Move Left / Right Reorder Controls */}
                  <div className="absolute bottom-2 inset-x-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(idx, 'left');
                      }}
                      className="h-6 w-6 rounded bg-stone-950/80 text-white disabled:opacity-30 flex items-center justify-center hover:bg-stone-950 transition-colors"
                      title="Move Left"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(idx, 'right');
                      }}
                      className="h-6 w-6 rounded bg-stone-950/80 text-white disabled:opacity-30 flex items-center justify-center hover:bg-stone-950 transition-colors"
                      title="Move Right"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="p-1.5 bg-white flex items-center justify-between text-[11px] text-stone-600">
                  <span className="truncate max-w-[90px]">
                    Photo #{idx + 1}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {isPrimary ? 'Cover' : 'Gallery'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Secondary URL toggle */}
      <div className="pt-1">
        {!showUrlInput ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center space-x-1 font-medium underline"
          >
            <Link2 className="h-3 w-3" />
            <span>Or add photo from an external URL</span>
          </button>
        ) : (
          <div className="p-3 bg-stone-100/70 rounded-lg border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Paste Image URL</span>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 text-xs p-2 border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
              />
              <button
                type="button"
                onClick={handleAddFromUrl}
                className="px-3 py-2 bg-stone-900 text-white text-xs font-semibold rounded hover:bg-stone-800 transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

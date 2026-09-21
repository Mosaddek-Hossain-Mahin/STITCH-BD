'use client';

import React from 'react';
import Link from 'next/link';
import { useDigitalCartStore } from '@/lib/digital/cart-store';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Trash2, ArrowRight, ShieldCheck, Zap, Download, Clock } from 'lucide-react';

export function DigitalCartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, getTotal, getSubtotal } = useDigitalCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="font-serif text-lg font-bold text-stone-950">
                  Digital Asset Cart
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {items.length} {items.length === 1 ? 'licensed file' : 'licensed files'} ready for instant dispatch
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Prepaid Notice Alert */}
          <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-2.5 flex items-center space-x-2.5 text-xs text-amber-900">
            <Zap className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Prepaid Only:</strong> Downloads generate immediately upon payment and are sent to your verified email.
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Digital Cart is Empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Browse our architectural tech packs, multi-size sewing patterns, and 3D garment simulations.
                </p>
                <div className="pt-2">
                  <Link
                    href="/digital"
                    onClick={closeDrawer}
                    className={cn(buttonVariants({ size: 'sm' }), 'text-xs')}
                  >
                    Explore Digital Atelier
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">
                          {item.file_format}
                        </span>
                        <span className="text-[10px] text-stone-500">{item.file_size_mb} MB</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        License: <span className="font-medium text-stone-700">{item.license_type}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.digital_product_id)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-stone-400" />
                      Email Link with Expiry & Usage Cap
                    </span>
                    <span className="font-serif font-bold text-stone-950 text-sm">
                      ৳{item.price.toLocaleString()} BDT
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">৳{subtotal.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Method</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    Instant Secure Email (Free)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-950">
                  <span>Total Due</span>
                  <span className="font-serif text-base">৳{total.toLocaleString()} BDT</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/digital/checkout"
                  onClick={closeDrawer}
                  className={cn(buttonVariants(), 'w-full justify-center text-sm py-3 h-auto')}
                >
                  <span>Proceed to Prepaid Checkout</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
                <div className="flex items-center justify-center space-x-1 text-[11px] text-stone-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>256-Bit Encrypted Signed Download Links</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

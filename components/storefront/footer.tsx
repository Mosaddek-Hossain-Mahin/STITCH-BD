'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, ArrowRight, ShieldCheck, Sparkles, Truck, RefreshCw } from 'lucide-react';
import { useStoreSettings } from '@/lib/store/settings-store';
import { SafeImage } from '@/components/ui/safe-image';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useStoreSettings();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success(`Thank you for subscribing to the ${settings.brand_name || 'STITCH BD'} dispatch.`);
    setEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-stone-900 flex items-center justify-center text-stone-100 flex-shrink-0 border border-stone-800">
              <Truck className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Complimentary Insured Freight</h4>
              <p className="text-xs text-stone-400 mt-1">Free express delivery on all orders exceeding ৳1,500 BDT.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-stone-900 flex items-center justify-center text-stone-100 flex-shrink-0 border border-stone-800">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Artisanal Craftsmanship</h4>
              <p className="text-xs text-stone-400 mt-1">Hand-finished by master craftspeople in Italy and Japan.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-stone-900 flex items-center justify-center text-stone-100 flex-shrink-0 border border-stone-800">
              <RefreshCw className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">30-Day Effortless Returns</h4>
              <p className="text-xs text-stone-400 mt-1">Pre-paid insured return shipping on all domestic orders.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-stone-900 flex items-center justify-center text-stone-100 flex-shrink-0 border border-stone-800">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Encrypted Payments</h4>
              <p className="text-xs text-stone-400 mt-1">PCI-DSS Level 1 compliant checkout powered by Stripe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center space-x-2.5">
              {settings.logo_type === 'image' && settings.logo_image_url ? (
                <div className="relative h-9 w-32">
                  <SafeImage
                    src={settings.logo_image_url}
                    alt={settings.brand_name || 'Brand Logo'}
                    fill
                    sizes="128px"
                    className="object-contain object-left brightness-0 invert"
                  />
                </div>
              ) : (
                <>
                  <div className="h-8 w-8 bg-stone-100 text-stone-950 rounded-lg flex items-center justify-center font-serif text-lg font-bold">
                    {settings.logo_monogram_text || 'S'}
                  </div>
                  <span className="font-serif text-xl tracking-tight font-bold text-white">
                    {settings.brand_name || 'STITCH BD'}
                  </span>
                </>
              )}
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {settings.brand_description ||
                'An architectural exploration in modern menswear and design objects. Engineered for enduring form, timeless tactile materials, and ethical permanence.'}
            </p>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-semibold text-stone-200 uppercase tracking-wider">
                The STITCH BD Dispatch
              </h5>
              <p className="text-xs text-stone-400">
                Receive private access to limited capsule releases, runway previews, and STITCH BD studio notes.
              </p>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs py-2">
                  <Check className="h-4 w-4" />
                  <span>You have joined the dispatch list.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm space-x-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-stone-400 transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-100 hover:bg-white text-stone-950 px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-colors flex items-center"
                  >
                    <span>Join</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Catalog</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/products" className="hover:text-white transition-colors">All Pieces</Link></li>
              <li><Link href="/category/outerwear" className="hover:text-white transition-colors">Outerwear & Coats</Link></li>
              <li><Link href="/category/footwear" className="hover:text-white transition-colors">Footwear & Boots</Link></li>
              <li><Link href="/category/leather-goods" className="hover:text-white transition-colors">Leather Goods</Link></li>
              <li><Link href="/category/knitwear" className="hover:text-white transition-colors">Mongolian Cashmere</Link></li>
              <li><Link href="/category/accessories" className="hover:text-white transition-colors">Timepieces & Objects</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Client Services</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link href="/account/addresses" className="hover:text-white transition-colors">Address Book</Link></li>
              <li><Link href="/account/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/account/profile" className="hover:text-white transition-colors">Account Profile</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400 transition-colors">Admin Back-Office</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-200">The House</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><span className="cursor-default">Biella Wool Mills</span></li>
              <li><span className="cursor-default">Tuscan Leather Guild</span></li>
              <li><span className="cursor-default">Goodyear-Welt Workshop</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Accessibility Statement</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
        <div>
          © {new Date().getFullYear()} STITCH BD Inc. All rights reserved. Powered by Supabase, Next.js & Stripe.
        </div>
        <div className="flex items-center space-x-6">
          <span>Encrypted 256-Bit SSL</span>
          <span>•</span>
          <span>WCAG 2.1 AA Compliant</span>
          <span>•</span>
          <span className="text-stone-300 font-semibold">BDT (৳)</span>
        </div>
      </div>
    </footer>
  );
}

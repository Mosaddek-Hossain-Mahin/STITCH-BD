'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart-store';
import { db } from '@/lib/db/store';
import { toast } from 'sonner';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTaxAmount,
    getTotal,
    coupon,
    applyCoupon,
    shippingMethod,
    setShippingMethod,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const tax = getTaxAmount();
  const total = getTotal();

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = db.validateCoupon(couponInput.trim(), subtotal);
    if (!res.valid) {
      setCouponError(res.error || 'Invalid coupon code');
      toast.error(res.error || 'Invalid code');
    } else {
      setCouponError('');
      applyCoupon(res.coupon!);
      toast.success(`Coupon "${res.coupon!.code}" applied!`);
      setCouponInput('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 mb-8">
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-stone-900">Home</Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">Shopping Bag</span>
          </div>
          <div className="flex justify-between items-baseline">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
              Your Selection ({items.reduce((s, i) => s + i.quantity, 0)})
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-500 hover:text-red-600 underline transition-colors"
              >
                Empty Bag
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-16 text-center space-y-5 shadow-xs max-w-xl mx-auto my-12">
            <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-stone-900">Your shopping bag is currently empty</h2>
              <p className="text-xs text-stone-500">
                Begin exploring our permanent collection and seasonal capsules.
              </p>
            </div>
            <Link href="/products" className="inline-block">
              <Button size="lg" className="text-xs uppercase tracking-wider font-semibold">
                Explore Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress */}
              <div className="bg-white rounded-xl border border-stone-200/80 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-800">
                    {remainingForFreeShipping > 0
                      ? `Add $${remainingForFreeShipping.toFixed(2)} more for Complimentary Express Ground Shipping`
                      : 'Congratulations, your order qualifies for Complimentary Express Ground Delivery!'}
                  </span>
                  {remainingForFreeShipping === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-900 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-xl border border-stone-200/80 divide-y divide-stone-100 shadow-xs overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        <SafeImage
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                          {item.product.brand}
                        </span>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="text-sm font-bold text-stone-900 hover:underline">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="text-xs text-stone-500 space-x-2">
                          {item.variant.option_values.color && <span>Color: {item.variant.option_values.color}</span>}
                          {item.variant.option_values.size && <span>Size: {item.variant.option_values.size}</span>}
                        </div>
                        <div className="text-xs font-mono text-stone-400">
                          SKU: {item.variant.sku}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right">
                        <span className="text-base font-bold text-stone-950">
                          ${(item.variant.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-stone-400 font-medium">
                            ${item.variant.price.toFixed(2)} each
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping link */}
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-stone-950"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Continue Browsing Catalog</span>
                </Link>
              </div>
            </div>

            {/* Order Summary & Coupon (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-6">
                <h2 className="font-serif text-lg font-bold text-stone-950 border-b border-stone-100 pb-3">
                  Summary of Order
                </h2>

                {/* Shipping Method Option */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Delivery Speed
                  </label>
                  <div className="space-y-2">
                    <label
                      onClick={() => setShippingMethod('standard')}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        shippingMethod === 'standard'
                          ? 'border-stone-900 bg-stone-50 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="accent-stone-900"
                        />
                        <div>
                          <p className="font-medium text-stone-900">Complimentary Ground</p>
                          <p className="text-[11px] text-stone-500">3-5 business days</p>
                        </div>
                      </div>
                      <span>{subtotal >= 1500 ? 'FREE' : '৳120.00'}</span>
                    </label>

                    <label
                      onClick={() => setShippingMethod('express')}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        shippingMethod === 'express'
                          ? 'border-stone-900 bg-stone-50 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="accent-stone-900"
                        />
                        <div>
                          <p className="font-medium text-stone-900">Priority Courier Express</p>
                          <p className="text-[11px] text-stone-500">Fast nationwide courier delivery</p>
                        </div>
                      </div>
                      <span>৳250.00</span>
                    </label>
                  </div>
                </div>

                {/* Promo Code Entry */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Voucher or Promo Code
                  </label>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                      <div className="flex items-center space-x-2 text-emerald-800">
                        <Tag className="h-4 w-4" />
                        <span className="font-bold">{coupon.code}</span>
                        <span>({coupon.type === 'percentage' ? `${coupon.value}% off` : `৳${coupon.value} off`})</span>
                      </div>
                      <button
                        onClick={() => applyCoupon(null)}
                        className="text-emerald-700 hover:text-emerald-950 font-semibold underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="e.g. WELCOME10"
                          className="flex-1 uppercase text-xs px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                        />
                        <Button type="submit" variant="secondary" size="sm" className="text-xs">
                          Apply
                        </Button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                    </form>
                  )}
                </div>

                {/* Subtotals & Total */}
                <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({coupon?.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Estimated Sales Tax (7.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-950">
                    <span>Grand Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link href="/checkout" className="block w-full">
                  <Button size="lg" className="w-full h-12 text-sm font-bold uppercase tracking-wider shadow-md">
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
                  <span>Stripe PCI-DSS Encrypted 256-Bit SSL Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

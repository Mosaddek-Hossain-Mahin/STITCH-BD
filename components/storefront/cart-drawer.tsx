'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import { Minus, Plus, Trash2, ArrowRight, Tag, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db/store';
import { toast } from 'sonner';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTaxAmount,
    getTotal,
    coupon,
    applyCoupon,
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
      setCouponError(res.error || 'Invalid code');
      toast.error(res.error || 'Invalid coupon code');
    } else {
      setCouponError('');
      applyCoupon(res.coupon!);
      toast.success(`Coupon "${res.coupon!.code}" applied!`);
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    toast.info('Coupon removed');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title="Shopping Cart"
      description={items.length > 0 ? `${items.reduce((s, i) => s + i.quantity, 0)} items in your selection` : undefined}
      footer={
        items.length > 0 ? (
          <div className="space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center space-x-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Discount ({coupon?.code})</span>
                  </span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Tax (7.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-stone-200 pt-2.5 flex justify-between text-base font-bold text-stone-950">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <Link href="/checkout" onClick={closeCart} className="block w-full">
                <Button className="w-full h-12 text-base font-medium shadow-md">
                  <span>Checkout Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/cart" onClick={closeCart} className="block w-full text-center">
                <Button variant="outline" className="w-full text-xs font-semibold uppercase tracking-wider">
                  View Full Cart & Review
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
              <span>Encrypted 256-Bit SSL Checkout & Guaranteed Delivery</span>
            </div>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-stone-900">Your cart is empty</h3>
            <p className="text-xs text-stone-500 max-w-xs">
              Discover our latest collection of outerwear, footwear, and leather objects.
            </p>
          </div>
          <Link href="/products" onClick={closeCart}>
            <Button variant="default" size="sm">
              Explore Collection
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Free Shipping Progress Indicator */}
          <div className="rounded-xl bg-stone-100/80 p-3.5 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-800">
                {remainingForFreeShipping > 0
                  ? `Add $${remainingForFreeShipping.toFixed(2)} more for Free Express Shipping`
                  : 'You have unlocked Complimentary Express Shipping!'}
              </span>
              {remainingForFreeShipping === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </div>
            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex space-x-3.5 first:pt-0 last:pb-0">
                {/* Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100 border border-stone-200">
                  <SafeImage
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-stone-900 hover:underline line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-xs text-stone-500 mt-0.5 space-x-2">
                      {item.variant.option_values.color && <span>Color: {item.variant.option_values.color}</span>}
                      {item.variant.option_values.size && <span>Size: {item.variant.option_values.size}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-stone-900">
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

                    {/* Price */}
                    <span className="text-sm font-bold text-stone-900">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="pt-2">
            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="font-semibold">{coupon.code}</span>
                  <span>({coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`})</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-emerald-700 hover:text-emerald-950 font-medium underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs uppercase px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="text-xs h-9">
                    Apply
                  </Button>
                </div>
                {couponError && <p className="text-[11px] text-red-600 pl-1">{couponError}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}

'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db/store';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const order = db.getOrder(resolvedParams.id);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">Order Not Found</h1>
          <p className="text-sm text-stone-500">We could not locate this order reference.</p>
          <Link href="/products">
            <Button>Return to Collection</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { label: 'Payment Confirmed', status: 'completed', icon: CheckCircle2 },
    { label: 'Order Processing', status: 'active', icon: Clock },
    { label: 'Carrier Dispatch', status: 'upcoming', icon: Truck },
    { label: 'Delivered', status: 'upcoming', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-10 shadow-sm text-center space-y-4 mb-8">
          <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <Badge variant="outline" className="text-stone-500 border-stone-200 uppercase text-[10px] tracking-widest font-semibold">
              Confirmation Dispatch
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
              Thank you for your acquisition
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Order reference <strong className="text-stone-900 font-mono">{order.order_number}</strong> has been logged.
              A dispatch notice has been transmitted to your email.
            </p>
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-semibold"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              <span>Print Receipt</span>
            </Button>
            <Link href="/products">
              <Button size="sm" className="text-xs font-semibold">
                <span>Continue Shopping</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-sm mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
            Fulfillment Progression
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex flex-col items-center text-center space-y-2 relative">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step.status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : step.status === 'active'
                        ? 'bg-stone-900 text-white ring-4 ring-stone-200 shadow-sm'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-stone-800">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COD Doorstep Collection Alert */}
        {order.payment_method === 'cod' && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Cash on Delivery (COD) Order
              </span>
              <p className="text-xs text-amber-950 font-medium">
                Please keep exact cash of <strong className="font-bold">৳{(order.total_amount ?? order.total).toFixed(2)} BDT</strong> ready for our delivery courier upon parcel arrival.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-amber-200/60 text-amber-950 rounded-lg text-xs font-bold whitespace-nowrap">
              Payment Due on Delivery
            </div>
          </div>
        )}

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items Purchased (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif text-base font-bold text-stone-950">Acquired Items</h3>
              <div className="flex items-center space-x-2">
                {order.payment_method === 'cod' ? (
                  <Badge variant="warning" className="text-[10px] uppercase font-bold">
                    Cash on Delivery ({order.payment_status})
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[10px] uppercase font-bold">
                    Card ({order.payment_status})
                  </Badge>
                )}
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center space-x-4 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                    <Image
                      src={item.image_url || item.image_url_snapshot || 'https://picsum.photos/seed/order/100/100'}
                      alt={item.product_name || item.product_name_snapshot || 'Purchased item'}
                      fill
                      sizes="64px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">{item.product_name || item.product_name_snapshot || 'Item'}</h5>
                    <p className="text-[11px] text-stone-500">
                      SKU: {item.variant_sku || 'ATL-SKU'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-stone-900">
                      ৳{(((item.unit_price ?? item.price_snapshot) ?? 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toFixed(2)}</span>
              </div>
              {(order.discount_amount ?? order.discount_total ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Voucher Discount</span>
                  <span>-৳{((order.discount_amount ?? order.discount_total) ?? 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Insured Freight</span>
                <span>
                  {(order.shipping_cost ?? order.shipping_total ?? 0) === 0
                    ? 'FREE'
                    : `৳${((order.shipping_cost ?? order.shipping_total) ?? 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Sales Tax</span>
                <span>৳{(order.tax_amount ?? order.tax_total ?? 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-950">
                <span>{order.payment_method === 'cod' && order.payment_status === 'pending' ? 'Total Payable on Delivery' : 'Total Settled'}</span>
                <span>৳{(order.total_amount ?? order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Destination Meta (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-stone-900 font-serif font-bold text-base border-b border-stone-100 pb-3">
                <MapPin className="h-4 w-4 text-stone-500" />
                <span>Shipping Address</span>
              </div>
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-900">{order.shipping_address?.line1 || 'Primary Residence'}</p>
                {order.shipping_address?.line2 && <p>{order.shipping_address.line2}</p>}
                <p>
                  {order.shipping_address?.city || 'New York'}, {order.shipping_address?.state || 'NY'}{' '}
                  {order.shipping_address?.postal_code || '10013'}
                </p>
                <p>{order.shipping_address?.country || 'US'}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-stone-900 font-serif font-bold text-base border-b border-stone-100 pb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Concierge Assurance</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Should you require alterations, styling advice, or expedited carrier redirection, contact our private client team at concierge@stitchbd.com.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

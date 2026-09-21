'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ExternalLink, Calendar, Truck, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { AccountNav } from '@/components/account/account-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db/store';

export default function AccountOrdersPage() {
  const orders = db.getOrders();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-950">Client Account</h1>
          <p className="text-xs text-stone-500 mt-1">Review your recorded orders and track shipments in real time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <AccountNav />

          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-stone-900">Order Dispatches</h2>
                <p className="text-xs text-stone-500">Showing {orders.length} orders on file</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-stone-200/80 text-center space-y-4 shadow-xs">
                <Package className="h-10 w-10 text-stone-400 mx-auto" />
                <h3 className="text-sm font-bold text-stone-900">No orders placed yet</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  When you acquire pieces from the STITCH BD catalog, your delivery timeline will appear here.
                </p>
                <Link href="/products">
                  <Button size="sm">Explore Collection</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4 hover:border-stone-400 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm text-stone-950">
                            {order.order_number}
                          </span>
                          <Badge
                            variant={
                              order.status === 'delivered'
                                ? 'success'
                                : order.status === 'processing'
                                ? 'warning'
                                : 'default'
                            }
                            className="text-[10px] uppercase font-bold"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-500 flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Placed {new Date(order.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-base font-bold text-stone-950">
                            ${(order.total_amount ?? order.total).toFixed(2)}
                          </span>
                          <p className="text-[11px] text-stone-500">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} pieces
                          </p>
                        </div>

                        <Link href={`/order/${order.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            <span>Receipt</span>
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Items preview row */}
                    <div className="flex flex-wrap gap-3 items-center">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3 bg-stone-50 rounded-xl p-2 border border-stone-200/60 max-w-xs"
                        >
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                            <Image
                              src={item.image_url || item.image_url_snapshot || 'https://picsum.photos/seed/item/80/80'}
                              alt={item.product_name || item.product_name_snapshot || 'Purchased item'}
                              fill
                              sizes="48px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-semibold text-stone-900 truncate">
                              {item.product_name || item.product_name_snapshot}
                            </p>
                            <p className="text-[10px] text-stone-500">
                              Qty {item.quantity} • ${((item.unit_price ?? item.price_snapshot ?? 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details */}
                    {order.tracking_number && (
                      <div className="flex items-center justify-between text-xs bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                        <div className="flex items-center space-x-2 text-stone-700">
                          <Truck className="h-4 w-4 text-stone-500" />
                          <span>FedEx Express: <strong className="font-mono text-stone-900">{order.tracking_number}</strong></span>
                        </div>
                        <span className="text-emerald-700 font-semibold">In Transit</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

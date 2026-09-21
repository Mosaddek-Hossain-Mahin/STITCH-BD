'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Banknote,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Package,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db/store';
import { toast } from 'sonner';

export default function AdminOverviewPage() {
  const [, setRefreshKey] = useState(0);

  const orders = db.getOrders();
  const products = db.getProducts();
  const reviews = db.getReviews();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? (o.total_amount ?? o.total) : 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'pending').length;

  // Low stock variants
  const lowStockItems: { product_name: string; variant_id: string; sku: string; stock: number; price: number }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock_quantity <= 5) {
        lowStockItems.push({
          product_name: p.name,
          variant_id: v.id,
          sku: v.sku,
          stock: v.stock_quantity,
          price: v.price,
        });
      }
    });
  });

  const recentOrders = orders.slice(0, 5);
  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  const handleRestock = (variantId: string, currentStock: number) => {
    db.adjustInventory(variantId, currentStock + 15);
    toast.success('Inventory replenished (+15 units)');
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    db.updateOrderStatus(orderId, newStatus);
    toast.success(`Order status set to ${newStatus}`);
    setRefreshKey((k) => k + 1);
  };

  const handleApproveReview = (reviewId: string) => {
    db.updateReviewStatus(reviewId, 'approved');
    toast.success('Review approved and published on storefront');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
            Operations & Analytics Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time telemetry on revenue, fulfillment, customer acquisitions, and warehouse stocks.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/admin/products">
            <Button size="sm" className="text-xs font-semibold">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Settled Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              ৳{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-stone-400">Lifetime gross transactional volume</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Orders Logged</span>
            <div className="h-8 w-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              {totalOrdersCount}
            </span>
            <Badge variant="warning" className="text-[10px] px-1.5 py-0 font-bold">
              {pendingOrdersCount} to fulfill
            </Badge>
          </div>
          <p className="text-[11px] text-stone-400">Total client orders recorded</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Average Order Value</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              ৳{aov.toFixed(2)}
            </span>
            <span className="text-xs text-stone-500 font-medium">BDT</span>
          </div>
          <p className="text-[11px] text-stone-400">Basket size across settled orders</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Low Inventory Alerts</span>
            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              {lowStockItems.length}
            </span>
            {lowStockItems.length > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Action needed
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-stone-400">Variants with stock quantity ≤ 5</p>
        </div>
      </div>

      {/* Main Two-Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Section (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Recent Customer Orders</h2>
              <p className="text-xs text-stone-500">Manage fulfillment progression, carriers, and statuses</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 underline flex items-center"
            >
              <span>View All Orders</span>
              <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Recipient & City</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Fulfillment</th>
                  <th className="pb-3 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-stone-950">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-stone-900">{order.shipping_address?.city || 'New York'}, {order.shipping_address?.state || 'NY'}</p>
                      <p className="text-[11px] text-stone-500">{order.items.length} piece{order.items.length > 1 ? 's' : ''}</p>
                    </td>
                    <td className="py-3.5 font-bold text-stone-900">
                      ৳{(order.total_amount ?? order.total).toFixed(2)}
                    </td>
                    <td className="py-3.5">
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
                    </td>
                    <td className="py-3.5 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 focus:outline-none focus:border-stone-900 font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Rail: Low Stock Alerts + Pending Reviews (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Low Inventory ({lowStockItems.length})</span>
              </h3>
              <Link href="/admin/products" className="text-xs text-stone-500 hover:underline">
                Manage
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-stone-500 py-2">All product variants are sufficiently stocked.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {lowStockItems.map((item) => (
                  <div
                    key={item.variant_id}
                    className="p-3 bg-red-50/40 rounded-xl border border-red-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-stone-900 truncate max-w-[160px]">{item.product_name}</p>
                      <p className="text-[10px] text-stone-500 font-mono">SKU: {item.sku}</p>
                      <p className="text-[11px] text-red-700 font-bold mt-0.5">
                        {item.stock} unit{item.stock !== 1 ? 's' : ''} left
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestock(item.variant_id, item.stock)}
                      className="text-xs h-7 px-2.5 bg-white border-red-200 text-red-700 hover:bg-red-50"
                    >
                      +15 Restock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Appraisals Moderation */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Review Moderation ({pendingReviews.length})</span>
              </h3>
              <Link href="/admin/reviews" className="text-xs text-stone-500 hover:underline">
                All Reviews
              </Link>
            </div>

            {pendingReviews.length === 0 ? (
              <p className="text-xs text-stone-500 py-2">No pending reviews requiring moderation.</p>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map((r) => (
                  <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-stone-900">{r.author_name}</span>
                      <span className="text-amber-500 font-bold">{r.rating} ★</span>
                    </div>
                    <p className="text-stone-600 line-clamp-2 text-[11px]">&quot;{r.body}&quot;</p>
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleApproveReview(r.id)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        Approve & Publish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

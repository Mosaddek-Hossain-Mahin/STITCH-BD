'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  Truck,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  XCircle,
  Banknote,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Order, OrderStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  const orders = db.getOrders({
    status: statusFilter !== 'all' ? (statusFilter as OrderStatus) : undefined,
    search: search || undefined,
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    db.updateOrderStatus(orderId, status);
    toast.success(`Order status updated to ${status}`);
    setRefreshKey((k) => k + 1);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(db.getOrder(orderId) || null);
    }
  };

  const handleTogglePaymentStatus = (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    db.updateOrderPaymentStatus(orderId, nextStatus as 'paid' | 'pending');
    toast.success(`Payment status marked as ${nextStatus.toUpperCase()}`);
    setRefreshKey((k) => k + 1);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(db.getOrder(orderId) || null);
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    db.updateOrderStatus(selectedOrder.id, 'shipped', trackingNumberInput.trim());
    toast.success(`Carrier tracking assigned: ${trackingNumberInput}`);
    setRefreshKey((k) => k + 1);
    setSelectedOrder(db.getOrder(selectedOrder.id) || null);
  };

  const handleCancelOrder = (orderId: string) => {
    db.updateOrderStatus(orderId, 'cancelled');
    toast.info('Order marked as cancelled and inventory re-credited');
    setRefreshKey((k) => k + 1);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Order Fulfillment & Shipping Operations
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Process incoming acquisitions, assign tracking barcodes, and monitor delivery completions.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, city, or state..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900"
          >
            <option value="all">All Orders ({db.getOrders().length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-stone-400">
                    No orders matching criteria
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-950">
                      {o.order_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{o.shipping_address?.city || 'New York'}, {o.shipping_address?.state || 'NY'}</p>
                      <p className="text-[11px] text-stone-400 font-mono">{o.shipping_address?.postal_code || '10013'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900">{o.items.reduce((s, i) => s + i.quantity, 0)} pcs</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-950">
                      ৳{(o.total_amount ?? o.total).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-1.5">
                          {o.payment_method === 'cod' ? (
                            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              <Banknote className="h-3 w-3 mr-1" />
                              COD
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                              <CreditCard className="h-3 w-3 mr-1" />
                              Card
                            </span>
                          )}
                          <Badge
                            variant={o.payment_status === 'paid' ? 'success' : 'warning'}
                            className="text-[9px] uppercase font-bold"
                          >
                            {o.payment_status}
                          </Badge>
                        </div>
                        {o.payment_method === 'cod' && o.payment_status === 'pending' && (
                          <button
                            onClick={() => handleTogglePaymentStatus(o.id, o.payment_status)}
                            className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold underline text-left"
                            title="Click once cash is collected from rider"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                        className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 font-semibold focus:outline-none focus:border-stone-900"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setTrackingNumberInput(o.tracking_number || '');
                          }}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Fulfillment Inspector Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order: ${selectedOrder.order_number}` : ''}
        description="Fulfillment details, items manifest, freight destination, and carrier assignment."
        className="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Status</span>
                <p className="text-xs font-bold text-stone-900 uppercase">{selectedOrder.status}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-xs h-8"
                >
                  <Printer className="mr-1 h-3 w-3" />
                  <span>Packing Slip</span>
                </Button>
                {selectedOrder.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="text-xs h-8"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    <span>Cancel Order</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Carrier Tracking Assignment */}
            <form onSubmit={handleSaveTracking} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <Truck className="h-4 w-4 text-amber-700" />
                <span>Carrier Dispatch & Tracking Reference</span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="e.g. FDX-9028472910"
                  className="flex-1 text-xs px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-stone-900"
                />
                <Button type="submit" size="sm" className="text-xs">
                  Save & Mark Shipped
                </Button>
              </div>
            </form>

            {/* Line Items Manifest */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Items Manifest</h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        <Image
                          src={item.image_url || item.image_url_snapshot || 'https://picsum.photos/seed/item/60/60'}
                          alt={item.product_name || item.product_name_snapshot || 'Product'}
                          fill
                          sizes="40px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{item.product_name || item.product_name_snapshot}</p>
                        <p className="text-[11px] text-stone-500">SKU: {item.variant_sku || 'ATL-SKU'} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-950">৳{((item.unit_price ?? item.price_snapshot ?? 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Settlement Dossier */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-stone-400 text-[10px]">Payment Protocol</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTogglePaymentStatus(selectedOrder.id, selectedOrder.payment_status)}
                  className="text-[11px] h-7 px-2.5"
                >
                  Mark as {selectedOrder.payment_status === 'paid' ? 'Pending' : 'Paid'}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-800">Method:</span>
                <span className="font-bold text-stone-950">
                  {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Credit / Debit Card'}
                </span>
                <Badge variant={selectedOrder.payment_status === 'paid' ? 'success' : 'warning'} className="text-[10px] uppercase font-bold">
                  {selectedOrder.payment_status}
                </Badge>
              </div>
              {selectedOrder.notes && (
                <p className="text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-200/80 mt-1">
                  {selectedOrder.notes}
                </p>
              )}
            </div>

            {/* Destination Address */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px] mb-1">
                Destination Address
              </h4>
              <p className="font-semibold text-stone-900">{selectedOrder.shipping_address?.line1 || 'Primary Residence'}</p>
              {selectedOrder.shipping_address?.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
              <p>
                {selectedOrder.shipping_address?.city || 'Dhaka'}, {selectedOrder.shipping_address?.state || 'Dhaka'} {selectedOrder.shipping_address?.postal_code || '1212'}
              </p>
              <p>{selectedOrder.shipping_address?.country || 'Bangladesh'}</p>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>৳{selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {(selectedOrder.discount_amount ?? selectedOrder.discount_total ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount Applied</span>
                  <span>-৳{((selectedOrder.discount_amount ?? selectedOrder.discount_total) ?? 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>৳{(selectedOrder.shipping_cost ?? selectedOrder.shipping_total ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tax</span>
                <span>৳{(selectedOrder.tax_amount ?? selectedOrder.tax_total ?? 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-950 text-sm">
                <span>{selectedOrder.payment_method === 'cod' && selectedOrder.payment_status === 'pending' ? 'Total to Collect (COD)' : 'Total Settled'}</span>
                <span>৳{(selectedOrder.total_amount ?? selectedOrder.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

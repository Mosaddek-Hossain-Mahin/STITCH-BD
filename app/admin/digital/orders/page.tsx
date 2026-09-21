'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { digitalDb } from '@/lib/digital/db';
import { DigitalOrder, DigitalEmailDispatch } from '@/lib/digital/types';
import { DigitalEmailModal } from '@/components/digital/digital-email-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Mail,
  RefreshCw,
  ExternalLink,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDigitalOrdersPage() {
  const [orders, setOrders] = useState<DigitalOrder[]>(() => digitalDb.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<DigitalEmailDispatch | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      o.transaction_id.toLowerCase().includes(q)
    );
  });

  const handleInspectEmail = (orderId: string) => {
    const email = digitalDb.getEmailByOrderId(orderId);
    if (email) {
      setSelectedEmail(email);
      setEmailModalOpen(true);
    } else {
      toast.error('No dispatched email record found for this order');
    }
  };

  const handleResendEmail = (orderId: string) => {
    const resent = digitalDb.resendEmail(orderId);
    if (resent) {
      setSelectedEmail(resent);
      setEmailModalOpen(true);
      toast.success(`Delivery email re-sent to ${resent.recipient_email}`);
    } else {
      toast.error('Failed to re-send delivery email');
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DigitalEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        emailDispatch={selectedEmail}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Prepaid Digital Orders
            </h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] uppercase font-bold">
              100% Prepaid Clearing
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Orders placed for downloadable digital tech packs, CAD blueprints, and sewing patterns with instant delivery.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOrders([...digitalDb.getOrders()])}
            className="text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Orders
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, email, or transaction ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
          />
        </div>

        <span className="text-xs text-stone-500">
          Showing <strong>{filteredOrders.length}</strong> orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200/80">
              <tr>
                <th className="p-4">Order & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items / Licenses</th>
                <th className="p-4">Payment & Txn</th>
                <th className="p-4">Total</th>
                <th className="p-4">Tokens</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-stone-900">{ord.order_number}</div>
                    <div className="text-[10px] text-stone-400">
                      {new Date(ord.created_at).toLocaleString()}
                    </div>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <div className="font-semibold text-stone-900">{ord.customer_name}</div>
                    <div className="text-[11px] text-stone-500">{ord.customer_email}</div>
                    {ord.customer_phone && (
                      <div className="text-[10px] text-stone-400">{ord.customer_phone}</div>
                    )}
                  </td>

                  <td className="p-4 space-y-1">
                    {ord.items.map((it) => (
                      <div key={it.id} className="text-xs">
                        <span className="font-medium text-stone-800">{it.title}</span>
                        <span className="text-[10px] text-stone-400 ml-1">
                          ({it.file_format} • {it.license_type})
                        </span>
                      </div>
                    ))}
                  </td>

                  <td className="p-4 space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold uppercase text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                        {ord.payment_method}
                      </span>
                      <Badge variant="default" className="bg-emerald-100 text-emerald-800 text-[9px] uppercase px-1.5 py-0 border-emerald-200">
                        Paid
                      </Badge>
                    </div>
                    <div className="text-[10px] font-mono text-stone-400 truncate max-w-[150px]">
                      {ord.transaction_id}
                    </div>
                  </td>

                  <td className="p-4 font-serif font-bold text-stone-900 text-sm">
                    ৳{ord.total.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-xs font-mono font-bold">
                      {ord.token_ids.length} Active
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleInspectEmail(ord.id)}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Inspect Email
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                      onClick={() => handleResendEmail(ord.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

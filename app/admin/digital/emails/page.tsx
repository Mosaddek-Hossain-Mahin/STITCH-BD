'use client';

import React, { useState } from 'react';
import { digitalDb } from '@/lib/digital/db';
import { DigitalEmailDispatch } from '@/lib/digital/types';
import { DigitalEmailModal } from '@/components/digital/digital-email-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, RefreshCw, Eye, CheckCircle2, Clock, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDigitalEmailsPage() {
  const [emails, setEmails] = useState<DigitalEmailDispatch[]>(() => digitalDb.getEmailDispatches());
  const [selectedEmail, setSelectedEmail] = useState<DigitalEmailDispatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter((em) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      em.order_number.toLowerCase().includes(q) ||
      em.recipient_email.toLowerCase().includes(q) ||
      em.recipient_name.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q)
    );
  });

  const handleResend = (orderId: string) => {
    const resent = digitalDb.resendEmail(orderId);
    if (resent) {
      setEmails([...digitalDb.getEmailDispatches()]);
      setSelectedEmail(resent);
      toast.success(`Dispatched duplicate notification to ${resent.recipient_email}`);
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DigitalEmailModal
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        emailDispatch={selectedEmail}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Digital Delivery Email Outbox
            </h1>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[10px] uppercase font-bold">
              Signed Dispatch
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Audit log of all cryptographic emails delivered to customers with signed download tokens and license credentials.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEmails([...digitalDb.getEmailDispatches()])}
            className="text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Outbox
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
            placeholder="Search email, order #, or subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
          />
        </div>

        <span className="text-xs text-stone-500">
          Showing <strong>{filteredEmails.length}</strong> email dispatches
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200/80">
              <tr>
                <th className="p-4">Recipient</th>
                <th className="p-4">Order & Subject</th>
                <th className="p-4">Token Links Attached</th>
                <th className="p-4">Dispatched At</th>
                <th className="p-4">Delivery Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEmails.map((em) => (
                <tr key={em.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4 space-y-0.5">
                    <div className="font-semibold text-stone-900">{em.recipient_name}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{em.recipient_email}</div>
                  </td>

                  <td className="p-4 space-y-0.5 max-w-sm">
                    <div className="font-bold text-stone-800">#{em.order_number}</div>
                    <div className="text-[11px] text-stone-600 line-clamp-1">{em.subject}</div>
                  </td>

                  <td className="p-4">
                    <span className="bg-stone-100 text-stone-800 px-2 py-1 rounded text-xs font-mono font-bold">
                      {em.token_links.length} {em.token_links.length === 1 ? 'Token link' : 'Token links'}
                    </span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <div className="font-medium text-stone-800">
                      {new Date(em.sent_at).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {new Date(em.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="p-4">
                    <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] uppercase font-bold">
                      Delivered (TLS 1.3)
                    </Badge>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setSelectedEmail(em)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Email
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                      onClick={() => handleResend(em.order_id)}
                    >
                      <Send className="h-3 w-3 mr-1" />
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

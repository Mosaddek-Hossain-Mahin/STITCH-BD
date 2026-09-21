'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { digitalDb } from '@/lib/digital/db';
import { DigitalDownloadToken } from '@/lib/digital/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  Download,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Plus,
  Ban,
  Check,
  Copy,
  ExternalLink,
  Search,
  FileText,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDigitalDownloadsPage() {
  const [tokens, setTokens] = useState<DigitalDownloadToken[]>(() => digitalDb.getTokens());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokenLogs, setSelectedTokenLogs] = useState<DigitalDownloadToken | null>(null);

  const filteredTokens = tokens.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.token.toLowerCase().includes(q) ||
      t.order_number.toLowerCase().includes(q) ||
      t.customer_email.toLowerCase().includes(q) ||
      t.product_title.toLowerCase().includes(q)
    );
  });

  const handleAddDownloads = (token: DigitalDownloadToken) => {
    digitalDb.incrementTokenMaxDownloads(token.id, 3);
    setTokens([...digitalDb.getTokens()]);
    toast.success(`Added +3 downloads to token for "${token.product_title}"`);
  };

  const handleExtendExpiry = (token: DigitalDownloadToken) => {
    digitalDb.extendTokenExpiry(token.id, 48);
    setTokens([...digitalDb.getTokens()]);
    toast.success(`Extended expiry by +48 hours for "${token.product_title}"`);
  };

  const handleToggleRevoke = (token: DigitalDownloadToken) => {
    if (token.is_revoked) {
      digitalDb.unrevokeToken(token.id);
      toast.success('Token access restored');
    } else {
      digitalDb.revokeToken(token.id);
      toast.success('Token access revoked');
    }
    setTokens([...digitalDb.getTokens()]);
  };

  const handleCopyLink = (tokenStr: string) => {
    const url = `${window.location.origin}/digital/download/${tokenStr}`;
    navigator.clipboard.writeText(url);
    toast.success('Download terminal URL copied to clipboard');
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Download Tokens & Usage Limits
            </h1>
            <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-300 text-[10px] uppercase font-bold">
              Usage & Expiry Control
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time audit log of issued cryptographic download tokens, remaining allowances, and expirations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTokens([...digitalDb.getTokens()])}
            className="text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Audit
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
            placeholder="Search token, customer email, order #, or asset name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
          />
        </div>

        <span className="text-xs text-stone-500">
          Showing <strong>{filteredTokens.length}</strong> active tokens
        </span>
      </div>

      {/* Tokens Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200/80">
              <tr>
                <th className="p-4">Asset & Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Usage Limit</th>
                <th className="p-4">Expiry Window</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Overrides & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTokens.map((tok) => {
                const isRevoked = tok.is_revoked;
                const isExpired = new Date().getTime() > new Date(tok.expires_at).getTime();
                const isLimitReached = tok.downloaded_count >= tok.max_downloads;

                return (
                  <tr key={tok.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4 space-y-0.5 max-w-xs">
                      <div className="font-bold text-stone-900 truncate">
                        {tok.product_title}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-stone-500">
                        <span className="font-mono bg-stone-100 px-1 rounded text-stone-700">
                          #{tok.order_number}
                        </span>
                        <span>•</span>
                        <span>{tok.file_format} ({tok.file_size_mb} MB)</span>
                      </div>
                      <div className="font-mono text-[10px] text-stone-400 truncate">
                        {tok.token}
                      </div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <div className="font-semibold text-stone-900">{tok.customer_name}</div>
                      <div className="text-[11px] text-stone-500">{tok.customer_email}</div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-baseline space-x-1">
                        <span className="font-serif font-bold text-stone-900 text-sm">
                          {tok.downloaded_count}
                        </span>
                        <span className="text-stone-400">/ {tok.max_downloads} used</span>
                      </div>
                      <div className="w-24 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-stone-900 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (tok.downloaded_count / tok.max_downloads) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <div className="font-medium text-stone-800">
                        {new Date(tok.expires_at).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(tok.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="p-4">
                      {isRevoked ? (
                        <Badge variant="destructive" className="text-[10px] uppercase font-bold px-2 py-0.5 bg-rose-600 text-white">
                          Revoked
                        </Badge>
                      ) : isExpired ? (
                        <Badge variant="destructive" className="text-[10px] uppercase font-bold px-2 py-0.5 bg-rose-100 text-rose-800 border-rose-200">
                          Expired
                        </Badge>
                      ) : isLimitReached ? (
                        <Badge variant="outline" className="text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-100 text-amber-800 border-amber-300">
                          Limit Reached
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border-emerald-200">
                          Active
                        </Badge>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2"
                        title="Add +3 downloads limit"
                        onClick={() => handleAddDownloads(tok)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        +3 DLs
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2"
                        title="Extend validity +48 hours"
                        onClick={() => handleExtendExpiry(tok)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        +48h
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className={`text-[11px] h-7 px-2 ${
                          tok.is_revoked ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                        onClick={() => handleToggleRevoke(tok)}
                      >
                        <Ban className="h-3 w-3 mr-1" />
                        {tok.is_revoked ? 'Restore' : 'Revoke'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        title="Copy direct portal link"
                        onClick={() => handleCopyLink(tok.token)}
                      >
                        <Copy className="h-3.5 w-3.5 text-stone-500" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        title="View access logs"
                        onClick={() => setSelectedTokenLogs(tok)}
                      >
                        <FileText className="h-3.5 w-3.5 text-stone-500" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Logs Modal */}
      {selectedTokenLogs && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTokenLogs(null)}
          title={`Download Audit Logs — Token ${selectedTokenLogs.order_number}`}
          description={`Customer: ${selectedTokenLogs.customer_name} (${selectedTokenLogs.customer_email})`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
              <div><strong>Asset:</strong> {selectedTokenLogs.product_title}</div>
              <div><strong>Usage:</strong> {selectedTokenLogs.downloaded_count} of {selectedTokenLogs.max_downloads} iterations</div>
              <div><strong>Expires:</strong> {new Date(selectedTokenLogs.expires_at).toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-stone-900">Logged Client Connections</h4>
              {selectedTokenLogs.download_logs.length === 0 ? (
                <p className="text-stone-400 py-3">No downloads executed yet for this token.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedTokenLogs.download_logs.map((log) => (
                    <div key={log.id} className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                      <div className="flex justify-between font-medium text-stone-800">
                        <span>{new Date(log.downloaded_at).toLocaleString()}</span>
                        <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[11px] text-stone-700">
                          {log.ip_address}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 truncate">{log.user_agent}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setSelectedTokenLogs(null)}>
                Close Audit View
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

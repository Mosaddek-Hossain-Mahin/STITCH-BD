'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, XCircle, MessageSquare, Trash2, ShieldCheck, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { db } from '@/lib/db/store';
import { Review } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [replyReview, setReplyReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const reviews = db.getReviews();
  const products = db.getProducts();

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    db.updateReviewStatus(id, status);
    toast.success(`Review status changed to ${status}`);
    setRefreshKey((k) => k + 1);
  };

  const handleOpenReply = (r: Review) => {
    setReplyReview(r);
    setReplyText(r.admin_reply || '');
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyReview) return;

    db.addReviewReply(replyReview.id, replyText.trim());
    toast.success('Official STITCH BD response published');
    setReplyReview(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Client Appraisals & Review Moderation
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit testimonials, approve verified acquisitions, and append official STITCH BD replies.
          </p>
        </div>

        <div className="flex space-x-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {s} ({s === 'all' ? reviews.length : reviews.filter((r) => r.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Patron & Piece</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Testimonial Content</th>
                <th className="py-3 px-4">Moderation Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-stone-400">
                    No appraisals matching filter
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => {
                  const product = products.find((p) => p.id === r.product_id);

                  return (
                    <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <p className="font-bold text-stone-900">{r.author_name}</p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {product?.name || 'Archived piece'}
                        </p>
                        {r.is_verified_purchase && (
                          <span className="inline-flex items-center text-[10px] text-emerald-700 font-semibold mt-0.5">
                            <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified Acquisition
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < r.rating ? 'fill-current' : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400 mt-0.5 block">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="font-bold text-stone-900">{r.title}</p>
                        <p className="text-stone-600 line-clamp-2 mt-0.5 text-[11px]">{r.body}</p>

                        {r.admin_reply && (
                          <div className="mt-2 p-2 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-700">
                            <strong className="text-stone-900">STITCH BD Response:</strong> {r.admin_reply}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            r.status === 'approved'
                              ? 'success'
                              : r.status === 'rejected'
                              ? 'destructive'
                              : 'warning'
                          }
                          className="text-[9px] uppercase font-bold"
                        >
                          {r.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {r.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'approved')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold"
                              title="Approve Review"
                            >
                              Approve
                            </button>
                          )}
                          {r.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'rejected')}
                              className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[11px] font-bold"
                              title="Reject Review"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenReply(r)}
                            className="px-2 py-1 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded text-[11px] font-semibold flex items-center space-x-1"
                            title="Reply as Brand"
                          >
                            <Reply className="h-3 w-3" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Reply Modal */}
      <Modal
        isOpen={Boolean(replyReview)}
        onClose={() => setReplyReview(null)}
        title="Official Brand Response"
        description={replyReview ? `Replying to testimonial from ${replyReview.author_name}` : ''}
      >
        <form onSubmit={handleSaveReply} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Public Response
            </label>
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Thank you for taking the time to share your impression of this piece..."
              className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setReplyReview(null)}>
              Cancel
            </Button>
            <Button type="submit">Publish Official Reply</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

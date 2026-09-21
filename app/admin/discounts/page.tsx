'use client';

import React, { useState } from 'react';
import { Plus, Tag, Trash2, CheckCircle2, XCircle, Percent, Banknote, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Discount } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminDiscountsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [value, setValue] = useState('15');
  const [minOrder, setMinOrder] = useState('200');
  const [maxUses, setMaxUses] = useState('100');
  const [startsAt, setStartsAt] = useState(new Date().toISOString().split('T')[0]);
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const discounts = db.getDiscounts();

  const handleOpenCreate = () => {
    setCode('');
    setType('percentage');
    setValue('15');
    setMinOrder('200');
    setMaxUses('100');
    setStartsAt(new Date().toISOString().split('T')[0]);
    setExpiresAt('2026-12-31');
    setIsActive(true);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Promotional code is required');
      return;
    }

    db.createDiscount({
      code: code.trim().toUpperCase(),
      type,
      value: parseFloat(value) || 10,
      min_order_value: minOrder ? parseFloat(minOrder) : undefined,
      max_uses: maxUses ? parseInt(maxUses) : undefined,
      used_count: 0,
      starts_at: startsAt,
      expires_at: expiresAt || undefined,
      is_active: isActive,
    });

    toast.success(`Discount code "${code.toUpperCase()}" deployed`);
    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleToggleStatus = (id: string, current: boolean) => {
    db.updateDiscount(id, { is_active: !current });
    toast.info(`Discount code set to ${!current ? 'Active' : 'Disabled'}`);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    db.deleteDiscount(id);
    toast.info('Discount deleted');
    setDeleteConfirmId(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Promotional Vouchers & Coupons
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure private client privilege codes, percentage incentives, and order thresholds.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Voucher Code</span>
        </Button>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Voucher Code</th>
                <th className="py-3 px-4">Benefit Type</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Expiration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-950">
                    <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 text-stone-900">
                      {d.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 font-bold text-stone-900">
                      {d.type === 'percentage' ? (
                        <>
                          <Percent className="h-3.5 w-3.5 text-stone-500" />
                          <span>{d.value}% Off Basket</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="h-3.5 w-3.5 text-stone-500" />
                          <span>৳{d.value} Flat Off</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 font-medium">
                    {d.min_order_value ? `Min order ৳${d.min_order_value}` : 'No minimum'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-900">{d.used_count ?? 0}</span>
                    <span className="text-stone-400"> / {(d.max_uses ?? d.usage_limit) ? `${d.max_uses ?? d.usage_limit} max` : '∞'}</span>
                  </td>

                  <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                    {d.expires_at ? new Date(d.expires_at).toLocaleDateString() : 'Never'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button onClick={() => handleToggleStatus(d.id, d.is_active)}>
                      <Badge
                        variant={d.is_active ? 'success' : 'secondary'}
                        className="text-[9px] uppercase font-bold cursor-pointer hover:opacity-80"
                      >
                        {d.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setDeleteConfirmId(d.id)}
                      className="p-1 text-stone-400 hover:text-red-600"
                      title="Delete Voucher"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Promotional Voucher"
        description="Define customer discount percentage, validity window, and basket requirements."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Voucher Code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. PRIVILEGE20"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
                Discount Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-900"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed_amount">Fixed Amount Off (৳ BDT)</option>
              </select>
            </div>

            <Input
              label={type === 'percentage' ? 'Percentage (e.g. 15)' : 'Amount in BDT (e.g. 500)'}
              type="number"
              step="any"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Order Subtotal (৳ BDT)"
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="e.g. 200"
            />
            <Input
              label="Maximum Redemptions"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="e.g. 100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
            <Input
              label="Expiration Date (Optional)"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <label className="flex items-center space-x-2 text-xs text-stone-800 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded accent-stone-900"
            />
            <span className="font-semibold">Enable voucher code immediately</span>
          </label>

          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Deploy Voucher</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Voucher Removal"
        description="Are you sure you wish to permanently delete this discount code?"
      >
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
          >
            Delete Voucher
          </Button>
        </div>
      </Modal>
    </div>
  );
}

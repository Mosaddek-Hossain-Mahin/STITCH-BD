'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, UserCheck, Trash2, Edit, Lock, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Profile, UserRole } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminStaffPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<Profile | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [phone, setPhone] = useState('');

  const users = db.getUsers().filter((u) => u.role === 'admin' || u.role === 'staff');

  const handleOpenCreate = () => {
    setEditStaff(null);
    setName('');
    setRole('staff');
    setPhone('+1 (555) 019-2831');
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Profile) => {
    setEditStaff(s);
    setName(s.full_name || '');
    setRole(s.role);
    setPhone(s.phone || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Staff name is required');
      return;
    }

    if (editStaff) {
      db.updateUser(editStaff.id, {
        full_name: name.trim(),
        role,
        phone: phone.trim(),
      });
      toast.success(`Updated role permissions for ${name}`);
    } else {
      db.createUser({
        full_name: name.trim(),
        role,
        phone: phone.trim(),
      });
      toast.success(`Staff member ${name} invited as ${role.toUpperCase()}`);
    }

    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Staff & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Grant managerial clearances, assign fulfillment staff, and govern administrative privileges.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          <span>Invite Staff Member</span>
        </Button>
      </div>

      {/* Permissions Matrix Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-amber-700" />
            <span className="font-bold text-xs text-amber-900">Administrator Clearance</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Full read and write privileges: Products, Categories, Orders, Discounts, Customers, Appraisals, Content, and Staff governance.
          </p>
        </div>

        <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl space-y-1">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4 text-stone-700" />
            <span className="font-bold text-xs text-stone-900">Operations & Staff Clearance</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Operations permissions: Process and ship orders, adjust variant inventory levels, and moderate customer testimonials.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Clearance Role</th>
                <th className="py-3 px-4">Internal Telephone</th>
                <th className="py-3 px-4">Enrolled Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((staff) => (
                <tr key={staff.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-stone-900 text-stone-50 font-bold flex items-center justify-center text-xs">
                        {staff.full_name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{staff.full_name}</p>
                        <p className="text-[10px] text-stone-400 font-mono">UID: {staff.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={staff.role === 'admin' ? 'default' : 'secondary'}
                      className={`text-[10px] uppercase font-bold ${
                        staff.role === 'admin' ? 'bg-amber-900 text-amber-100 border-amber-700' : ''
                      }`}
                    >
                      {staff.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 font-medium">
                    {staff.phone || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-stone-500">
                    {new Date(staff.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(staff)}
                      className="p-1 text-stone-400 hover:text-stone-900"
                      title="Edit Staff Member"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite / Edit Staff Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editStaff ? `Update Clearances: ${editStaff.full_name}` : 'Enroll New STITCH BD Staff'}
        description="Designate operational responsibilities and dashboard access levels."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Marcus Vance"
          />

          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-1">
              Clearance Level
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-900 font-semibold"
            >
              <option value="staff">Staff (Fulfillment & Catalog Operations)</option>
              <option value="admin">Administrator (Complete System Access)</option>
              <option value="customer">Demote to Customer</option>
            </select>
          </div>

          <Input
            label="Concierge / Desk Extension"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 019-2831"
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editStaff ? 'Update Clearance' : 'Enroll Staff'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

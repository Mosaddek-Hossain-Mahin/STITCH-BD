'use client';

import React, { useState } from 'react';
import {
  Search,
  Users,
  Plus,
  Trash2,
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db/store';
import { Profile } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminCustomersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [inspectCustomer, setInspectCustomer] = useState<Profile | null>(null);
  const [editCustomer, setEditCustomer] = useState<Profile | null>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create form state
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('+880 ');
  const [createCity, setCreateCity] = useState('Dhaka');
  const [createCountry, setCreateCountry] = useState('Bangladesh');
  const [createStatus, setCreateStatus] = useState<'active' | 'vip' | 'inactive'>('active');
  const [createNotes, setCreateNotes] = useState('');

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'vip' | 'inactive'>('active');
  const [editNotes, setEditNotes] = useState('');

  // Re-fetch when refreshKey increments
  const users = db.getUsers().filter((u) => u.role === 'customer');
  const orders = db.getOrders();

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.city?.toLowerCase().includes(q) ||
      u.id.includes(q)
    );
  });

  const handleOpenEdit = (c: Profile) => {
    setEditCustomer(c);
    setEditName(c.full_name || '');
    setEditEmail(c.email || '');
    setEditPhone(c.phone || '');
    setEditCity(c.city || '');
    setEditCountry(c.country || 'Bangladesh');
    setEditStatus(c.status || 'active');
    setEditNotes(c.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;

    if (!editName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    db.updateUser(editCustomer.id, {
      full_name: editName.trim(),
      email: editEmail.trim() || undefined,
      phone: editPhone.trim() || undefined,
      city: editCity.trim() || undefined,
      country: editCountry.trim() || undefined,
      status: editStatus,
      notes: editNotes.trim() || undefined,
    });

    toast.success(`Updated dossier for ${editName.trim()}`);
    setEditCustomer(null);
    setRefreshKey((k) => k + 1);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!createName.trim()) {
      toast.error('Please enter the patron name');
      return;
    }

    const newUser = db.createUser({
      full_name: createName.trim(),
      email: createEmail.trim() || undefined,
      phone: createPhone.trim() || undefined,
      city: createCity.trim() || undefined,
      country: createCountry.trim() || undefined,
      status: createStatus,
      notes: createNotes.trim() || undefined,
      role: 'customer',
    });

    toast.success(`Patron ${newUser.full_name} successfully registered`);
    setIsCreateOpen(false);
    // Reset create form
    setCreateName('');
    setCreateEmail('');
    setCreatePhone('+880 ');
    setCreateCity('Dhaka');
    setCreateCountry('Bangladesh');
    setCreateStatus('active');
    setCreateNotes('');
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteConfirm = () => {
    if (!deleteCustomerId) return;
    const target = users.find((u) => u.id === deleteCustomerId);
    const targetName = target?.full_name || 'Customer';

    const success = db.deleteUser(deleteCustomerId);
    if (success) {
      toast.success(`Customer ${targetName} removed from registry`);
    } else {
      toast.error('Failed to remove customer');
    }

    setDeleteCustomerId(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-950">
            Patron & Customer Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Full client registry, lifetime BDT transaction volume, contact details, and account management.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs font-semibold"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>New Customer</span>
        </Button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-stone-100 text-stone-900">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Registered Patrons</p>
            <p className="text-lg font-bold text-stone-950">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500">VIP Clients</p>
            <p className="text-lg font-bold text-amber-900">
              {users.filter((u) => u.status === 'vip').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Active Shoppers</p>
            <p className="text-lg font-bold text-emerald-950">
              {users.filter((u) => u.status !== 'inactive').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or city..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-stone-900"
          />
        </div>
        <span className="text-xs text-stone-500 font-medium">
          Showing {filteredUsers.length} of {users.length} Patrons
        </span>
      </div>

      {/* Customer Registry Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Patron Details</th>
                <th className="py-3 px-4">Contact & Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Lifetime Spend (BDT)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500 text-xs">
                    No customers found matching &quot;{search}&quot;. Click &quot;New Customer&quot; to register one.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((client) => {
                  const clientOrders = orders.filter((o) => o.user_id === client.id);
                  const clientTotalSpend = clientOrders.reduce(
                    (s, o) => s + (o.total_amount ?? o.total),
                    0
                  );

                  return (
                    <tr key={client.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-stone-900 text-stone-50 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {client.full_name?.charAt(0) || 'C'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate">
                              {client.full_name || 'Client'}
                            </p>
                            <p className="text-[11px] text-stone-400 font-mono truncate">
                              {client.email || `ID: ${client.id.slice(0, 8)}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600">
                        <div className="space-y-0.5">
                          <p className="font-medium text-stone-800">{client.phone || '—'}</p>
                          <p className="text-[11px] text-stone-400">
                            {client.city ? `${client.city}, ${client.country || 'Bangladesh'}` : (client.country || 'Bangladesh')}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {client.status === 'vip' ? (
                          <Badge variant="warning" className="text-[10px] font-bold uppercase tracking-wider">
                            VIP Patron
                          </Badge>
                        ) : client.status === 'inactive' ? (
                          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Inactive
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {clientOrders.length} order{clientOrders.length !== 1 ? 's' : ''}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-950">
                        ৳{clientTotalSpend.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setInspectCustomer(client)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                            title="View Customer Dossier"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(client)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                            title="Edit Customer Profile"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCustomerId(client.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Inspect Customer Modal */}
      <Modal
        isOpen={Boolean(inspectCustomer)}
        onClose={() => setInspectCustomer(null)}
        title={inspectCustomer ? `Patron Dossier: ${inspectCustomer.full_name}` : ''}
        description="Client profile records, delivery coordinates, and historical acquisition ledger."
        className="max-w-2xl"
      >
        {inspectCustomer && (
          <div className="space-y-6">
            {/* Quick Profile Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px]">Email Address</span>
                <p className="font-semibold text-stone-800 mt-0.5 truncate">{inspectCustomer.email || 'Unregistered'}</p>
              </div>
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px]">Telephone</span>
                <p className="font-semibold text-stone-800 mt-0.5">{inspectCustomer.phone || 'Unlisted'}</p>
              </div>
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px]">Residence / Region</span>
                <p className="font-semibold text-stone-800 mt-0.5">
                  {inspectCustomer.city ? `${inspectCustomer.city}, ${inspectCustomer.country || 'BD'}` : (inspectCustomer.country || 'Bangladesh')}
                </p>
              </div>
            </div>

            {inspectCustomer.notes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                <span className="text-amber-800 font-bold text-[10px] uppercase tracking-wider">Client Notes & Concierge Directives:</span>
                <p className="text-amber-950 font-medium">{inspectCustomer.notes}</p>
              </div>
            )}

            {/* Orders by this customer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Acquisition History
                </h4>
                <span className="text-xs font-semibold text-stone-600">
                  Lifetime Total: ৳{orders
                    .filter((o) => o.user_id === inspectCustomer.id)
                    .reduce((s, o) => s + (o.total_amount ?? o.total), 0)
                    .toFixed(2)}
                </span>
              </div>

              {orders.filter((o) => o.user_id === inspectCustomer.id).length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center border border-dashed border-stone-200 rounded-xl">
                  No orders recorded for this patron yet.
                </p>
              ) : (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  {orders
                    .filter((o) => o.user_id === inspectCustomer.id)
                    .map((order) => (
                      <div key={order.id} className="p-3 bg-white flex items-center justify-between text-xs hover:bg-stone-50">
                        <div>
                          <p className="font-mono font-bold text-stone-900">{order.order_number}</p>
                          <p className="text-[11px] text-stone-500">
                            {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items •{' '}
                            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-950">৳{(order.total_amount ?? order.total).toFixed(2)}</span>
                          <p className="text-[10px] uppercase font-bold text-emerald-700">{order.status}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
              <Button
                variant="outline"
                onClick={() => {
                  setInspectCustomer(null);
                  handleOpenEdit(inspectCustomer);
                }}
              >
                Edit Patron Info
              </Button>
              <Button variant="default" onClick={() => setInspectCustomer(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create New Customer Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Register New Patron / Customer"
        description="Add a new customer profile into the STITCH BD database."
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <Input
            label="Full Legal / Patron Name"
            required
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="e.g., Tareq Rahman"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="client@stitchbd.com"
            />
            <Input
              label="Contact Telephone"
              value={createPhone}
              onChange={(e) => setCreatePhone(e.target.value)}
              placeholder="+880 1711-000000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              value={createCity}
              onChange={(e) => setCreateCity(e.target.value)}
              placeholder="Dhaka"
            />
            <Input
              label="Country"
              value={createCountry}
              onChange={(e) => setCreateCountry(e.target.value)}
              placeholder="Bangladesh"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Account Tier / Status</label>
            <select
              value={createStatus}
              onChange={(e) => setCreateStatus(e.target.value as 'active' | 'vip' | 'inactive')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
            >
              <option value="active">Active Shopper</option>
              <option value="vip">VIP Patron</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Concierge Notes (Optional)</label>
            <textarea
              rows={2}
              value={createNotes}
              onChange={(e) => setCreateNotes(e.target.value)}
              placeholder="e.g. Prefers Cash on Delivery; calls ahead before delivery."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Customer</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Customer Profile Modal */}
      <Modal
        isOpen={Boolean(editCustomer)}
        onClose={() => setEditCustomer(null)}
        title="Edit Customer Profile"
        description="Update contact information, account tier, and private concierge notes."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Full Legal Name"
            required
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <Input
              label="Contact Telephone"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
            />
            <Input
              label="Country"
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Account Tier / Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as 'active' | 'vip' | 'inactive')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
            >
              <option value="active">Active Shopper</option>
              <option value="vip">VIP Patron</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Concierge Notes</label>
            <textarea
              rows={2}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="e.g. VIP client, preferred courier contact time."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setEditCustomer(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCustomerId)}
        onClose={() => setDeleteCustomerId(null)}
        title="Confirm Customer Deletion"
        description="Are you sure you want to permanently remove this customer from the registry?"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start space-x-2.5">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">This action cannot be undone.</p>
              <p className="text-[11px] text-red-800 mt-0.5">
                The customer account will be removed from future marketing and active patron dossiers.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteCustomerId(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

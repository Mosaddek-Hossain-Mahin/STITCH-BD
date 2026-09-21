'use client';

import React, { useState } from 'react';
import { Plus, MapPin, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { AccountNav } from '@/components/account/account-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

export default function AccountAddressesPage() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAuthStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState('Primary Residence');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');
  const [isDefault, setIsDefault] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !city || !state || !postalCode) {
      toast.error('Please complete all required address fields');
      return;
    }

    addAddress({
      label,
      line1,
      line2,
      city,
      state,
      postal_code: postalCode,
      country,
      is_default: isDefault,
    });

    toast.success('New address added to book');
    setModalOpen(false);
    setLine1('');
    setLine2('');
    setCity('');
    setState('');
    setPostalCode('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-950">Client Account</h1>
          <p className="text-xs text-stone-500 mt-1">Manage verified freight destinations and default residences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <AccountNav />

          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-stone-900">Saved Address Book</h2>
                <p className="text-xs text-stone-500">{addresses.length} destinations registered</p>
              </div>
              <Button size="sm" onClick={() => setModalOpen(true)} className="text-xs font-semibold">
                <Plus className="mr-1.5 h-4 w-4" />
                <span>Add Destination</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-400 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-1.5">
                        <MapPin className="h-4 w-4 text-stone-400" />
                        <span>{addr.label || 'Saved Address'}</span>
                      </h3>
                      {addr.is_default && (
                        <Badge variant="success" className="text-[10px] uppercase font-bold">
                          Default
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 space-y-0.5 pt-1">
                      <p className="font-semibold text-stone-900">{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                      <p>{addr.country}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    {!addr.is_default ? (
                      <button
                        onClick={() => {
                          if (addr.id) setDefaultAddress(addr.id);
                          toast.success('Default address updated');
                        }}
                        className="text-stone-600 hover:text-stone-950 font-semibold underline"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Primary Dispatch Destination</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        if (addr.id) deleteAddress(addr.id);
                        toast.info('Address removed');
                      }}
                      className="text-stone-400 hover:text-red-600 p-1"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Shipping Address"
        description="Save a new destination for express checkout and insured delivery."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Location Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Tribeca Penthouse, Design Studio"
            required
          />
          <Input
            label="Street Address"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="482 Broome Street"
            required
          />
          <Input
            label="Apartment, Suite, Unit"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Suite 4B"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <Input
              label="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center space-x-2 text-xs text-stone-700 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="accent-stone-900 rounded"
            />
            <span>Set as default dispatch address</span>
          </label>

          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}

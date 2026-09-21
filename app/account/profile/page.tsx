'use client';

import React, { useState } from 'react';
import { User, ShieldCheck, Check, Save } from 'lucide-react';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';
import { AccountNav } from '@/components/account/account-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

export default function AccountProfilePage() {
  const { user, updateProfile, switchRole } = useAuthStore();

  const [name, setName] = useState(user?.full_name || 'Elena Rostova');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile({ full_name: name, phone });
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Account profile updated successfully');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-950">Client Account</h1>
          <p className="text-xs text-stone-500 mt-1">Manage private credentials, contact telephone, and access role</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <AccountNav />

          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Profile Information</h2>
                  <p className="text-xs text-stone-500">Update your primary identity settings</p>
                </div>
                <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-bold">
                  {user?.role}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Role Switcher Demo Box */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  <span className="text-xs font-bold text-stone-900">Active Workspace Role</span>
                </div>
                <p className="text-xs text-stone-500">
                  You can switch between Customer, Staff, and Admin roles to preview role-based access control and back-office management.
                </p>
                <div className="flex space-x-2 pt-1">
                  {(['customer', 'staff', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        toast.success(`Role switched to ${r}`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        user?.role === r
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isSaving} className="text-xs font-bold uppercase tracking-wider">
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  <span>Save Profile</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

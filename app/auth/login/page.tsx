'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const res = await login(email, password);

    if (res.success) {
      toast.success('Welcome back to STITCH BD');
      router.push(redirectTo);
    } else {
      toast.error(res.error || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  const handleQuickDemoLogin = async (role: 'customer' | 'staff' | 'admin') => {
    if (role === 'admin') {
      await login('admin@stitchbd.com');
      toast.success('Signed in as Administrator (Demo Mode)');
      router.push('/admin');
    } else if (role === 'staff') {
      await login('staff@stitchbd.com');
      toast.success('Signed in as STITCH BD Staff (Demo Mode)');
      router.push('/admin/orders');
    } else {
      await login('client@stitchbd.com');
      toast.success('Signed in as Private Client (Demo Mode)');
      router.push('/account/orders');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="h-9 w-9 bg-stone-900 text-stone-50 rounded-lg flex items-center justify-center font-serif text-lg font-bold">
            S
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            STITCH BD
          </span>
        </Link>
        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-stone-500">
          Access your private acquisitions, saved addresses, and order dispatch history.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-stone-200/80 shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 focus-visible:outline-none focus-visible:border-stone-900 focus-visible:ring-1 focus-visible:ring-stone-900"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

         

          <div className="text-center text-xs text-stone-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-stone-900 hover:underline">
               Create account
             </Link>
           </div>




          {/* Quick Demo Access Switchers */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center">
              Quick Demo Access (Local Dev)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="p-2 border border-stone-200 hover:border-stone-900 rounded-lg text-center text-xs transition-colors bg-stone-50 hover:bg-white"
              >
                <p className="font-bold text-stone-900">Customer</p>
                <p className="text-[10px] text-stone-500">Storefront</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('staff')}
                className="p-2 border border-stone-200 hover:border-stone-900 rounded-lg text-center text-xs transition-colors bg-stone-50 hover:bg-white"
              >
                <p className="font-bold text-stone-900">Staff</p>
                <p className="text-[10px] text-stone-500">Orders</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 border border-amber-300 hover:border-amber-600 bg-amber-50/50 rounded-lg text-center text-xs transition-colors"
              >
                <p className="font-bold text-amber-900">Admin</p>
                <p className="text-[10px] text-amber-700">Full Access</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

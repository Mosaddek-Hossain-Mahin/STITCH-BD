'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      email,
      password,
      fullName,
      role: 'customer',
    });

    if (res.success) {
      toast.success('Registration successful! Welcome to STITCH BD.');
      router.push('/account/orders');
    } else {
      toast.error(res.error || 'Failed to register');
    }
    setIsSubmitting(false);
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
          Create Your Client Account
        </h2>
        <p className="text-xs text-stone-500">
          Join our client registry for private viewings, order history, and express checkout.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-stone-200/80 shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Elena Rostova"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@example.com"
            />

            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 focus-visible:outline-none focus-visible:border-stone-900 focus-visible:ring-1 focus-visible:ring-stone-900"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <span>Register Account</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-stone-900 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


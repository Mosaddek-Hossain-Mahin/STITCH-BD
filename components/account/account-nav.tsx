'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, MapPin, Heart, User, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Badge } from '@/components/ui/badge';

export function AccountNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const links = [
    { label: 'Order History', href: '/account/orders', icon: Package },
    { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
    { label: 'Saved Wishlist', href: '/account/wishlist', icon: Heart },
    { label: 'Account Profile', href: '/account/profile', icon: User },
  ];

  return (
    <aside className="w-full lg:w-64 space-y-6">
      {/* User Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center space-x-3.5">
        <div className="h-11 w-11 rounded-full bg-stone-900 text-stone-50 font-bold flex items-center justify-center text-sm font-serif">
          {user?.full_name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-stone-900 text-sm truncate">{user?.full_name || 'Client'}</p>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 uppercase">
              {user?.role || 'Customer'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                active
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        {user && (user.role === 'admin' || user.role === 'staff') && (
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
          >
            <ShieldAlert className="h-4 w-4 text-amber-700" />
            <span>Admin Back-Office</span>
          </Link>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

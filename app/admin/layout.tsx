'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  MessageSquare,
  FileText,
  ShieldCheck,
  Store,
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
  Sparkles,
  Palette,
  Layers,
  Download,
  Mail,
  ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useStoreSettings } from '@/lib/store/settings-store';
import { SafeImage } from '@/components/ui/safe-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchRole, logout } = useAuthStore();
  const { settings } = useStoreSettings();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Overview & KPIs', href: '/admin', icon: LayoutDashboard },
    { label: 'Storefront & Branding', href: '/admin/appearance', icon: Palette },
    { label: 'Products & Variants', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons & Discounts', href: '/admin/discounts', icon: Tag },
    { label: 'Reviews & Appraisals', href: '/admin/reviews', icon: MessageSquare },
    { label: 'CMS & Content Blocks', href: '/admin/content', icon: FileText },
    { label: 'Staff & RBAC Access', href: '/admin/staff', icon: ShieldCheck },
  ];

  const digitalNavItems = [
    { label: 'Digital Products', href: '/admin/digital', icon: Layers },
    { label: 'Digital Orders', href: '/admin/digital/orders', icon: ShoppingBag },
    { label: 'Downloads & Expiry', href: '/admin/digital/downloads', icon: Download },
    { label: 'Delivery Emails', href: '/admin/digital/emails', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-stone-900 antialiased font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-stone-950 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="h-7 w-7 bg-amber-600 rounded flex items-center justify-center font-serif text-sm font-bold text-white">
            S
          </div>
          <span className="font-serif font-bold text-base tracking-tight">STITCH BD Back-Office</span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-stone-400 hover:text-white"
        >
          {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-stone-950 text-stone-300 flex flex-col justify-between border-r border-stone-800 transition-transform lg:translate-x-0 lg:static lg:h-screen ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Workspace Title */}
          <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2.5">
              {settings.logo_type === 'image' && settings.logo_image_url ? (
                <div className="h-8 w-24 relative overflow-hidden bg-white/10 rounded px-1 flex items-center justify-center">
                  <SafeImage
                    src={settings.logo_image_url}
                    alt={settings.brand_name}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 bg-amber-600 text-stone-950 rounded-lg flex items-center justify-center font-serif text-base font-bold shadow-sm">
                  {settings.logo_monogram_text || 'S'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-tight font-bold text-white truncate max-w-[140px]">
                  {settings.brand_name || 'STITCH BD'}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-semibold -mt-0.5">
                  Management Console
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Storefront Link */}
          <div className="px-4 pt-4">
            <Link
              href="/"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800/80 text-stone-200 text-xs font-semibold border border-stone-800 transition-colors group"
            >
              <span className="flex items-center space-x-2">
                <Store className="h-4 w-4 text-stone-400 group-hover:text-white transition-colors" />
                <span>View Storefront</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-500" />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Operations & Catalogs
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-600/15 text-amber-400 border border-amber-500/30'
                      : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Digital Atelier & Downloads Group */}
            <div className="pt-4 mt-3 border-t border-stone-800/80 space-y-1">
              <div className="flex items-center justify-between px-3 pb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Digital Goods & Licenses
                </p>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                  Prepaid
                </span>
              </div>
              {digitalNavItems.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === '/admin/digital'
                    ? pathname === '/admin/digital'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-amber-600/15 text-amber-400 border border-amber-500/30'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* User Info & Role Switcher */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950/60 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-9 w-9 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Admin User'}</p>
              <Badge variant="default" className="bg-amber-950 text-amber-400 border-amber-800 text-[9px] px-1.5 py-0 uppercase">
                {user?.role || 'admin'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone-400 font-mono">
              Role: <span className="text-amber-400 font-semibold uppercase">{user?.role || 'Guest'}</span>
            </span>

            <button
              onClick={logout}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-400 rounded-lg border border-stone-800 transition-colors flex items-center space-x-1 px-2.5 text-xs"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
            <Link href="/admin" className="hover:text-stone-900">Admin</Link>
            <span>/</span>
            <span className="text-stone-900 font-bold capitalize">
              {pathname === '/admin' ? 'Dashboard Overview' : pathname.replace('/admin/', '').replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Postgres & Storage Active</span>
            </div>

            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <Store className="mr-1.5 h-3.5 w-3.5" />
                <span>Live Store</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

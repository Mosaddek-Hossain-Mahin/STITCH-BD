'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useStoreSettings } from '@/lib/store/settings-store';
import { SafeImage } from '@/components/ui/safe-image';
import { Badge } from '@/components/ui/badge';
import { CartDrawer } from '@/components/storefront/cart-drawer';
import { SearchModal } from '@/components/storefront/search-modal';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { openCart, getItemCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { settings } = useStoreSettings();
  const wishlistItems = useWishlistStore((state) => state.items);

  const itemCount = getItemCount();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const navLinks = [
    { label: 'All Products', href: '/products' },
    { label: 'Outerwear', href: '/category/outerwear' },
    { label: 'Footwear', href: '/category/footwear' },
    { label: 'Leather Goods', href: '/category/leather-goods' },
    { label: 'Knitwear', href: '/category/knitwear' },
    { label: 'Objects', href: '/category/accessories' },
    { label: 'Digital Studio', href: '/digital' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        {/* Dynamic Announcement Bar */}
        {settings.announcement_enabled && (
          <div
            className="text-stone-200 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-3 transition-colors"
            style={{ backgroundColor: settings.announcement_bg_color || '#0c0a09' }}
          >
            <span>{settings.announcement_text || 'Complimentary Express Delivery on orders over ৳1,500 BDT'}</span>
            {settings.announcement_code_text && (
              <>
                <span className="text-stone-500">•</span>
                <span className="hidden sm:inline">
                  <strong className="text-stone-50">{settings.announcement_code_text}</strong>
                </span>
              </>
            )}
          </div>
        )}

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-stone-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Dynamic Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            {settings.logo_type === 'image' && settings.logo_image_url ? (
              <div className="relative h-10 w-32 sm:w-40 flex items-center">
                <SafeImage
                  src={settings.logo_image_url}
                  alt={settings.brand_name || 'Brand Logo'}
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            ) : (
              <>
                <div className="h-8 w-8 bg-stone-900 text-stone-50 rounded-lg flex items-center justify-center font-serif text-lg font-bold tracking-tighter shadow-sm group-hover:bg-stone-800 transition-colors">
                  {settings.logo_monogram_text || 'S'}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl tracking-tight font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {settings.brand_name || 'STITCH BD'}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-semibold -mt-1">
                    {settings.brand_tagline || 'Edition 2026'}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-tight transition-colors py-1 relative ${
                    active ? 'text-stone-950 font-semibold' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-stone-600 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Search catalog"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-stone-600 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-stone-900 text-stone-50 text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Account / User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1.5 p-2 text-stone-600 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="User account"
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-3.5 w-3.5 text-stone-400 hidden sm:inline" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl border border-stone-200 z-50 text-sm animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <p className="font-semibold text-stone-900 truncate">{user.full_name}</p>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <Badge variant={isAdminOrStaff ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 uppercase">
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      {isAdminOrStaff && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-900 hover:bg-amber-50 font-medium transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-amber-700" />
                          <span>Admin Back-Office</span>
                        </Link>
                      )}

                      <Link
                        href="/account/orders"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/account/addresses"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <span>Saved Addresses</span>
                      </Link>

                      <Link
                        href="/account/profile"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <span>Account Settings</span>
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-1 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <Link
                        href="/auth/login"
                        className="block w-full text-center bg-stone-900 text-stone-50 py-2 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center space-x-2 bg-stone-900 text-stone-50 px-3.5 py-2 rounded-lg hover:bg-stone-800 transition-all active:scale-95 shadow-xs"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-tight hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-600 text-white leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-5 space-y-3 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-100"
                >
                  {link.label}
                </Link>
              ))}
              {isAdminOrStaff && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-semibold text-amber-900 bg-amber-50"
                >
                  Admin Back-Office
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

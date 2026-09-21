'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant, CartItem, Coupon } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  coupon: Coupon | null;
  shippingMethod: 'standard' | 'express';
  
  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (coupon: Coupon | null) => void;
  setShippingMethod: (method: 'standard' | 'express') => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingCost: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,
      shippingMethod: 'standard',

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variant_id === variant.id
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isOpen: true };
          }

          const newItem: CartItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            cart_id: 'active-session-cart',
            variant_id: variant.id,
            quantity,
            variant,
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              brand: product.brand,
              base_price: variant.price || product.base_price,
              image_url: variant.image_url || product.images[0]?.url || '',
            },
          };

          return { items: [newItem, ...state.items], isOpen: true };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: (coupon) => set({ coupon }),
      setShippingMethod: (method) => set({ shippingMethod: method }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const { coupon } = get();
        if (!coupon || !coupon.is_active) return 0;
        if (subtotal < coupon.min_order_value) return 0;

        if (coupon.type === 'percentage') {
          return Number(((subtotal * coupon.value) / 100).toFixed(2));
        } else {
          return Math.min(subtotal, coupon.value);
        }
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        const { shippingMethod } = get();
        if (shippingMethod === 'express') return 250;
        return subtotal >= 1500 ? 0 : 120;
      },

      getTaxAmount: () => {
        const taxable = Math.max(0, get().getSubtotal() - get().getDiscountAmount());
        return Number((taxable * 0.0725).toFixed(2)); // Standard 7.25%
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingCost();
        const tax = get().getTaxAmount();
        return Number(Math.max(0, subtotal - discount + shipping + tax).toFixed(2));
      },
    }),
    {
      name: 'stitch-bd-commerce-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shippingMethod: state.shippingMethod,
      }),
    }
  )
);

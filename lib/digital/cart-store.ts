import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DigitalProduct, DigitalOrderItem } from './types';

interface DigitalCartState {
  items: DigitalOrderItem[];
  isOpen: boolean;
  appliedDiscount: number;
  promoCode: string | null;

  // Actions
  addItem: (product: DigitalProduct) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useDigitalCartStore = create<DigitalCartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedDiscount: 0,
      promoCode: null,

      addItem: (product: DigitalProduct) => {
        const { items } = get();
        // Since digital products are license-based, avoid duplicate quantities of identical digital items
        const exists = items.some((it) => it.digital_product_id === product.id);
        if (exists) {
          set({ isOpen: true });
          return;
        }

        const newItem: DigitalOrderItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          digital_product_id: product.id,
          title: product.title,
          price: product.price,
          file_format: product.file_format,
          license_type: product.license_type,
          file_size_mb: product.file_size_mb,
        };

        set({ items: [...items, newItem], isOpen: true });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((it) => it.digital_product_id !== productId),
        });
      },

      clearCart: () => {
        set({ items: [], appliedDiscount: 0, promoCode: null });
      },

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      applyPromo: (code: string, discount: number) => {
        set({ promoCode: code, appliedDiscount: discount });
      },

      removePromo: () => {
        set({ promoCode: null, appliedDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().appliedDiscount;
        return Math.max(0, subtotal - discount);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'stitch-bd-digital-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        appliedDiscount: state.appliedDiscount,
      }),
    }
  )
);

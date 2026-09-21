'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoreSettings } from '@/lib/types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  brand_name: 'STITCH BD',
  brand_tagline: 'Modern Luxury E-Commerce',
  brand_description:
    'An architectural exploration in modern menswear and design objects. Engineered for enduring form, timeless tactile materials, and ethical permanence.',
  logo_type: 'monogram',
  logo_image_url: '',
  logo_monogram_text: 'S',
  brand_icon_url: '',

  announcement_enabled: true,
  announcement_text: 'Complimentary Express Delivery on orders over $150',
  announcement_code_text: 'Use code WELCOME10 for 10% off your initial order',
  announcement_bg_color: '#0c0a09',

  hero_layout: 'cinematic_full',
  hero_title: 'Autumn/Winter Horizon',
  hero_subtitle:
    'Structural silhouettes cut from virgin wool, water-repellent Japanese gabardine, and heritage leather.',
  hero_badge: 'New Season 2026',
  hero_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85',
  hero_cta_label: 'Explore The Collection',
  hero_cta_link: '/products',
  hero_secondary_cta_label: 'Explore Footwear',
  hero_secondary_cta_link: '/category/footwear',
  hero_overlay_opacity: 40,

  story_banner_enabled: true,
  story_banner_badge: 'The STITCH BD Story',
  story_banner_title: 'Crafted With Architectural Precision',
  story_banner_subtitle:
    'Every garment is cut and sewn in small-batch family workshops across Biella, Italy and Kojima, Japan.',
  story_banner_image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
  story_banner_cta_label: 'Discover Our Craft',
  story_banner_cta_link: '/products',

  sections_visibility: {
    hero: true,
    categories: true,
    featured_products: true,
    editorial_story: true,
    new_arrivals: true,
    value_props: true,
    newsletter: true,
  },

  accent_theme: 'stone_luxury',
};

interface SettingsStore {
  settings: StoreSettings;
  updateSettings: (partial: Partial<StoreSettings>) => void;
  toggleSection: (sectionKey: keyof StoreSettings['sections_visibility']) => void;
  resetSettings: () => void;
}

export const useStoreSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_STORE_SETTINGS,

      updateSettings: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
            sections_visibility: {
              ...state.settings.sections_visibility,
              ...(partial.sections_visibility || {}),
            },
            updated_at: new Date().toISOString(),
          },
        }));
      },

      toggleSection: (sectionKey) => {
        set((state) => ({
          settings: {
            ...state.settings,
            sections_visibility: {
              ...state.settings.sections_visibility,
              [sectionKey]: !state.settings.sections_visibility[sectionKey],
            },
            updated_at: new Date().toISOString(),
          },
        }));
      },

      resetSettings: () => {
        set({ settings: { ...DEFAULT_STORE_SETTINGS, updated_at: new Date().toISOString() } });
      },
    }),
    {
      name: 'stitch_bd_store_settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

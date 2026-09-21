export type UserRole = 'customer' | 'staff' | 'admin';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type CouponType = 'percentage' | 'fixed';
export type CouponScope = 'all' | 'category' | 'product';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  city?: string;
  country?: string;
  status?: 'active' | 'inactive' | 'vip';
  notes?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Address {
  id?: string;
  user_id?: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  image_url?: string;
  description?: string;
  sort_order: number;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  option_values: {
    size?: string;
    color?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  price: number;
  stock_quantity: number;
  image_url?: string;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  compare_at_price?: number;
  sku: string;
  category_id?: string;
  category?: Category;
  brand: string;
  status: ProductStatus;
  is_featured: boolean;
  is_active?: boolean;
  seo_title?: string;
  seo_description?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  variant_id: string;
  product_name?: string;
  sku?: string;
  change: number;
  reason: string;
  created_by?: string;
  actor_name?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  variant: ProductVariant;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    base_price: number;
    image_url: string;
  };
  created_at?: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id: string;
  items: CartItem[];
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  coupon_code?: string;
  updated_at: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  variant_id?: string;
  product_name_snapshot?: string;
  price_snapshot?: number;
  quantity: number;
  options_snapshot?: Record<string, string>;
  image_url_snapshot?: string;
  // Aliases for convenience
  product_name?: string;
  unit_price?: number;
  image_url?: string;
  variant_sku?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string; // 'stripe' | 'elements'
  provider_payment_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount_total?: number;
  shipping_total?: number;
  tax_total?: number;
  total: number;
  currency?: string;
  shipping_status?: string;
  shipping_address_id?: string;
  shipping_address?: Address;
  billing_address?: Address;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  shipping_method?: string;
  tracking_number?: string;
  payment_method?: 'cod' | 'credit_card' | 'stripe' | string;
  payment_status: PaymentStatus;
  notes?: string;
  internal_notes?: string;
  items: OrderItem[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
  // Aliases for seamless UI rendering
  total_amount?: number;
  discount_amount?: number;
  shipping_cost?: number;
  tax_amount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_value: number;
  usage_limit?: number;
  max_uses?: number;
  used_count: number;
  starts_at: string;
  expires_at?: string;
  is_active: boolean;
  scope: CouponScope;
  category_id?: string;
  product_id?: string;
  created_at?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'fixed';
  value: number;
  min_order_value?: number;
  max_uses?: number;
  usage_limit?: number;
  used_count?: number;
  starts_at?: string;
  expires_at?: string;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  is_verified_purchase: boolean;
  status: ReviewStatus;
  admin_reply?: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
  created_at?: string;
}

export interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  price: number;
  min_order_subtotal: number;
  max_order_subtotal?: number;
  estimated_days: string;
}

export interface TaxRule {
  id: string;
  country: string;
  state?: string;
  rate_percentage: number;
  name: string;
  is_active: boolean;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  entity: string;
  entity_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ContentBlock {
  id: string;
  type: 'hero' | 'banner' | 'promo' | 'announcement';
  title: string;
  subtitle?: string;
  cta_label?: string;
  cta_link?: string;
  image_url?: string;
  badge?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  cta_label?: string;
  cta_link?: string;
  image_url: string;
  is_active: boolean;
  sort_order?: number;
}

export interface StoreAnalytics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  conversion_rate: number;
  new_customers: number;
  revenue_trend: { date: string; amount: number; orders: number }[];
  top_products: { id: string; name: string; sales_count: number; revenue: number; image_url: string }[];
  recent_orders: Order[];
  low_stock_variants: { id: string; product_name: string; sku: string; stock: number; price: number }[];
}

export type HomepageHeroLayout = 'cinematic_full' | 'split_editorial' | 'minimalist_centered';

export interface StoreSettings {
  // Brand Identity & Logo
  brand_name: string;
  brand_tagline: string;
  brand_description: string;
  logo_type: 'image' | 'monogram';
  logo_image_url?: string;
  logo_monogram_text: string;
  brand_icon_url?: string;

  // Announcement Bar
  announcement_enabled: boolean;
  announcement_text: string;
  announcement_code_text?: string;
  announcement_bg_color: string; // e.g. '#0c0a09' | '#1c1917' | '#451a03' | '#172554'

  // Homepage Hero
  hero_layout: HomepageHeroLayout;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_image_url: string;
  hero_cta_label: string;
  hero_cta_link: string;
  hero_secondary_cta_label?: string;
  hero_secondary_cta_link?: string;
  hero_overlay_opacity: number; // 0 - 100

  // Editorial / Story Banner
  story_banner_enabled: boolean;
  story_banner_badge?: string;
  story_banner_title: string;
  story_banner_subtitle: string;
  story_banner_image_url: string;
  story_banner_cta_label: string;
  story_banner_cta_link: string;

  // Sections Visibility
  sections_visibility: {
    hero: boolean;
    categories: boolean;
    featured_products: boolean;
    editorial_story: boolean;
    new_arrivals: boolean;
    value_props: boolean;
    newsletter: boolean;
  };

  // Aesthetic accents
  accent_theme: 'stone_luxury' | 'warm_amber' | 'noir_monochrome' | 'deep_navy';
  updated_at?: string;
}

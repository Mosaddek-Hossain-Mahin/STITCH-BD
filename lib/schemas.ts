import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  line1: z.string().min(3, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State or Province is required'),
  postal_code: z.string().min(3, 'Postal code is required'),
  country: z.string().default('US'),
  is_default: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  customer_email: z.string().email('Invalid email address'),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  customer_phone: z.string().min(7, 'Phone number is required'),
  line1: z.string().min(4, 'Street address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(4, 'Postal code is required'),
  country: z.string().default('US'),
  shipping_rate_id: z.string().min(1, 'Please select a delivery method'),
  payment_method: z.enum(['stripe_card', 'stripe_mock']).default('stripe_card'),
  card_number: z.string().optional(),
  card_exp: z.string().optional(),
  card_cvc: z.string().optional(),
  order_notes: z.string().optional(),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(2, 'Variant SKU is required'),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock_quantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'URL slug is required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  base_price: z.coerce.number().min(0.01, 'Base price must be positive'),
  compare_at_price: z.coerce.number().optional().nullable(),
  sku: z.string().min(2, 'Base SKU is required'),
  category_id: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  status: z.enum(['draft', 'active', 'archived']).default('active'),
  is_featured: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url('Must be a valid image URL'),
    alt_text: z.string().optional(),
  })).min(1, 'At least one image is required'),
  variants: z.array(productVariantSchema).min(1, 'At least one product variant is required'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  parent_id: z.string().optional().nullable(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0.01, 'Value must be positive'),
  min_order_value: z.coerce.number().min(0).default(0),
  usage_limit: z.coerce.number().int().positive().optional().nullable(),
  is_active: z.boolean().default(true),
  scope: z.enum(['all', 'category', 'product']).default('all'),
  category_id: z.string().optional().nullable(),
  product_id: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
});

export const stockAdjustmentSchema = z.object({
  variant_id: z.string().min(1, 'Variant is required'),
  change: z.coerce.number().int().refine((val) => val !== 0, 'Change cannot be zero'),
  reason: z.string().min(3, 'Please provide a reason for stock adjustment (e.g. inventory audit, damaged, restock)'),
});

export const reviewSchema = z.object({
  product_id: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(3, 'Review title must be at least 3 characters'),
  body: z.string().min(10, 'Review description must be at least 10 characters'),
  author_name: z.string().min(2, 'Your name is required'),
});

export const staffInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Full name is required'),
  role: z.enum(['admin', 'staff', 'customer']).default('staff'),
});

export const contentBlockSchema = z.object({
  type: z.enum(['hero', 'banner', 'promo', 'announcement']).default('hero'),
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().optional(),
  cta_label: z.string().optional(),
  cta_link: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  badge: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});

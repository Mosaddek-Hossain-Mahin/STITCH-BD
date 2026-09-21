-- =====================================================================
-- ATELIER COMMERCE — PRODUCTION DATABASE SCHEMA WITH ROW LEVEL SECURITY
-- PostgreSQL / Supabase Migration
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE coupon_scope AS ENUM ('all', 'category', 'product');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Shipping' NOT NULL,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'US' NOT NULL,
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    description TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    sku TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT NOT NULL,
    status product_status DEFAULT 'active' NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Product Variants
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    option_values JSONB DEFAULT '{}'::jsonb NOT NULL, -- e.g. {"size": "M", "color": "Navy"}
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0 NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Stock Movements
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
    change INT NOT NULL,
    reason TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Carts & Cart Items
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(cart_id, variant_id)
);

-- 9. Shipping Zones & Rates
CREATE TABLE IF NOT EXISTS public.shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    countries TEXT[] DEFAULT '{"US"}'::text[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES public.shipping_zones(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    min_order_subtotal NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    max_order_subtotal NUMERIC(10, 2),
    estimated_days TEXT DEFAULT '3-5 business days' NOT NULL
);

-- 10. Tax Rules
CREATE TABLE IF NOT EXISTS public.tax_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country TEXT NOT NULL,
    state TEXT,
    rate_percentage NUMERIC(5, 2) NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- 11. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_total NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    shipping_total NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    tax_total NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    shipping_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    billing_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    shipping_method TEXT DEFAULT 'Standard Delivery' NOT NULL,
    tracking_number TEXT,
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    price_snapshot NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    options_snapshot JSONB DEFAULT '{}'::jsonb NOT NULL,
    image_url_snapshot TEXT
);

-- 13. Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL, -- e.g. 'stripe', 'paypal'
    provider_payment_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status payment_status DEFAULT 'paid' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type coupon_type DEFAULT 'percentage' NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    usage_limit INT,
    used_count INT DEFAULT 0 NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    scope coupon_scope DEFAULT 'all' NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT false NOT NULL,
    status review_status DEFAULT 'approved' NOT NULL,
    admin_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Wishlists & Items
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(wishlist_id, product_id)
);

-- 17. Content Blocks (Hero Banners, Promos)
CREATE TABLE IF NOT EXISTS public.content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT DEFAULT 'hero' NOT NULL, -- 'hero', 'banner', 'promo', 'announcement'
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_label TEXT,
    cta_link TEXT,
    image_url TEXT,
    badge TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: is_admin_or_staff()
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL USING (public.is_admin());

-- Addresses Policies
CREATE POLICY "Users can view their own addresses"
ON public.addresses FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Users can manage their own addresses"
ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Categories Policies (Public read, Staff/Admin write)
CREATE POLICY "Categories are readable by everyone"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Staff and admin can manage categories"
ON public.categories FOR ALL USING (public.is_admin_or_staff());

-- Products & Variants Policies
CREATE POLICY "Active products are readable by everyone"
ON public.products FOR SELECT USING (status = 'active' OR public.is_admin_or_staff());

CREATE POLICY "Staff and admin can manage products"
ON public.products FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Product variants are readable by everyone"
ON public.product_variants FOR SELECT USING (true);

CREATE POLICY "Staff and admin can manage variants"
ON public.product_variants FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Product images are readable by everyone"
ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Staff and admin can manage product images"
ON public.product_images FOR ALL USING (public.is_admin_or_staff());

-- Stock Movements (Staff/Admin only)
CREATE POLICY "Staff and admin can view stock movements"
ON public.stock_movements FOR SELECT USING (public.is_admin_or_staff());

CREATE POLICY "Staff and admin can record stock movements"
ON public.stock_movements FOR INSERT WITH CHECK (public.is_admin_or_staff());

-- Carts Policies
CREATE POLICY "Users manage their own carts"
ON public.carts FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users manage their own cart items"
ON public.cart_items FOR ALL USING (true);

-- Shipping & Tax Policies (Public read, Staff/Admin write)
CREATE POLICY "Shipping zones are viewable by all"
ON public.shipping_zones FOR SELECT USING (true);

CREATE POLICY "Staff can manage shipping zones"
ON public.shipping_zones FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Shipping rates are viewable by all"
ON public.shipping_rates FOR SELECT USING (true);

CREATE POLICY "Staff can manage shipping rates"
ON public.shipping_rates FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Tax rules are viewable by all"
ON public.tax_rules FOR SELECT USING (true);

CREATE POLICY "Staff can manage tax rules"
ON public.tax_rules FOR ALL USING (public.is_admin_or_staff());

-- Orders Policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff and admins can update orders"
ON public.orders FOR UPDATE USING (public.is_admin_or_staff());

CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin_or_staff())
    )
);

CREATE POLICY "Order items insert on checkout"
ON public.order_items FOR INSERT WITH CHECK (true);

-- Payments Policies
CREATE POLICY "Payments viewable by order owner or staff"
ON public.payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = payments.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin_or_staff())
    )
);

CREATE POLICY "Staff can manage payments"
ON public.payments FOR ALL USING (public.is_admin_or_staff());

-- Coupons Policies
CREATE POLICY "Coupons are viewable when active"
ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin_or_staff());

CREATE POLICY "Staff can manage coupons"
ON public.coupons FOR ALL USING (public.is_admin_or_staff());

-- Reviews Policies
CREATE POLICY "Approved reviews are readable by everyone"
ON public.reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Authenticated customers can submit reviews"
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Staff and admin can moderate reviews"
ON public.reviews FOR ALL USING (public.is_admin_or_staff());

-- Wishlists Policies
CREATE POLICY "Users can view and manage their wishlist"
ON public.wishlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and manage their wishlist items"
ON public.wishlist_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.wishlists
        WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
);

-- Content Blocks Policies
CREATE POLICY "Content blocks are readable by everyone"
ON public.content_blocks FOR SELECT USING (true);

CREATE POLICY "Staff can manage content blocks"
ON public.content_blocks FOR ALL USING (public.is_admin_or_staff());

-- Audit Logs Policies (Staff/Admin read, system/admin insert)
CREATE POLICY "Staff and admins can read audit logs"
ON public.audit_logs FOR SELECT USING (public.is_admin_or_staff());

CREATE POLICY "Authenticated users or staff can insert audit logs"
ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Indexes for high performance & full-text search
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('english', name || ' ' || description || ' ' || brand));
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

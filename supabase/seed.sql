-- =====================================================================
-- ATELIER COMMERCE — SEED DATA
-- =====================================================================

-- 1. Profiles (Demo users)
INSERT INTO public.profiles (id, full_name, avatar_url, phone, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Elena Rostova', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1 (555) 234-5678', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+1 (555) 345-6789', 'staff'),
    ('00000000-0000-0000-0000-000000000003', 'Sophia Chen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+1 (555) 456-7890', 'customer')
ON CONFLICT (id) DO NOTHING;

-- 2. Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Outerwear & Coats', 'outerwear', 'Tailored coats, technical jackets, and minimalist layers designed for longevity.', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Footwear & Boots', 'footwear', 'Full-grain leather boots, architectural sneakers, and hand-finished loafers.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Leather Goods', 'leather-goods', 'Vegetable-tanned leather carryalls, crossbodies, and modular card wallets.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', 3),
    ('c4444444-4444-4444-4444-444444444444', 'Knitwear & Essentials', 'knitwear', 'Grade-A Mongolian cashmere, structured merino wool, and heavyweight organic cotton.', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', 4),
    ('c5555555-5555-5555-5555-555555555555', 'Timepieces & Objects', 'accessories', 'Chronographs, matte black desk sculptures, and hand-poured natural ceramics.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Shipping Zones & Rates
INSERT INTO public.shipping_zones (id, name, countries)
VALUES 
    ('z1111111-1111-1111-1111-111111111111', 'Domestic United States', '{"US"}'),
    ('z2222222-2222-2222-2222-222222222222', 'International Express', '{"CA", "GB", "DE", "FR", "JP", "AU"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.shipping_rates (id, zone_id, name, price, min_order_subtotal, max_order_subtotal, estimated_days)
VALUES
    ('r1111111-1111-1111-1111-111111111111', 'z1111111-1111-1111-1111-111111111111', 'Standard Ground', 9.00, 0, 150.00, '3-5 business days'),
    ('r2222222-2222-2222-2222-222222222222', 'z1111111-1111-1111-1111-111111111111', 'Complimentary Standard Ground', 0.00, 150.00, NULL, '3-5 business days'),
    ('r3333333-3333-3333-3333-333333333333', 'z1111111-1111-1111-1111-111111111111', 'Priority Air Express', 24.00, 0, NULL, '1-2 business days'),
    ('r4444444-4444-4444-4444-444444444444', 'z2222222-2222-2222-2222-222222222222', 'Global DHL Express', 45.00, 0, NULL, '4-7 business days')
ON CONFLICT (id) DO NOTHING;

-- 4. Tax Rules
INSERT INTO public.tax_rules (id, country, state, rate_percentage, name, is_active)
VALUES
    ('t1111111-1111-1111-1111-111111111111', 'US', 'CA', 7.25, 'California State Tax', true),
    ('t2222222-2222-2222-2222-222222222222', 'US', 'NY', 8.875, 'New York Combined Sales Tax', true),
    ('t3333333-3333-3333-3333-333333333333', 'US', 'TX', 6.25, 'Texas State Tax', true),
    ('t4444444-4444-4444-4444-444444444444', 'US', NULL, 5.00, 'US Standard Tax Estimate', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Coupons
INSERT INTO public.coupons (id, code, type, value, min_order_value, usage_limit, used_count, is_active, scope)
VALUES
    ('cp111111-1111-1111-1111-111111111111', 'ATELIER15', 'percentage', 15.00, 100.00, 500, 42, true, 'all'),
    ('cp222222-2222-2222-2222-222222222222', 'VIP50', 'fixed', 50.00, 250.00, 100, 18, true, 'all'),
    ('cp333333-3333-3333-3333-333333333333', 'WELCOME10', 'percentage', 10.00, 50.00, NULL, 120, true, 'all')
ON CONFLICT (id) DO NOTHING;

-- 6. Content Blocks (Hero carousel & banners)
INSERT INTO public.content_blocks (id, type, title, subtitle, cta_label, cta_link, image_url, badge, sort_order)
VALUES
    ('cb111111-1111-1111-1111-111111111111', 'hero', 'Autumn/Winter Horizon', 'Structural silhouettes cut from virgin wool, water-repellent Japanese gabardine, and heritage leather.', 'Explore The Collection', '/products', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80', 'New Season 2026', 1),
    ('cb222222-2222-2222-2222-222222222222', 'hero', 'The Architectural Footwear Lab', 'Zero-break-in Italian calfskin loafers and Goodyear-welted combat boots hand-buffed to a deep luster.', 'Discover Footwear', '/category/footwear', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80', 'Craftsmanship First', 2),
    ('cb333333-3333-3333-3333-333333333333', 'promo', 'Vegetable-Tanned Daily Objects', 'Tote bags and modular wallets engineered to age beautifully with your daily voyage.', 'Shop Leather Goods', '/category/leather-goods', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80', 'Limited Batch', 3)
ON CONFLICT (id) DO NOTHING;

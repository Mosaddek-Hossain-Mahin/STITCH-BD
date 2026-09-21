import {
  Product,
  Category,
  Order,
  Coupon,
  Discount,
  Review,
  Profile,
  StockMovement,
  ShippingZone,
  TaxRule,
  AuditLog,
  ContentBlock,
  StoreAnalytics,
  UserRole,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
} from '@/lib/types';

// Initial Categories
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-outerwear',
    name: 'Outerwear & Coats',
    slug: 'outerwear',
    description: 'Tailored topcoats, technical layers, and minimalist trench jackets constructed for architectural form and harsh weather.',
    image_url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1000&q=80',
    sort_order: 1,
    created_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'cat-footwear',
    name: 'Footwear & Boots',
    slug: 'footwear',
    description: 'Zero-break-in Italian calfskin boots, Goodyear-welted loafers, and sculptured minimalist low-tops.',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&q=80',
    sort_order: 2,
    created_at: new Date('2025-01-11').toISOString(),
  },
  {
    id: 'cat-leather',
    name: 'Leather Goods',
    slug: 'leather-goods',
    description: 'Vegetable-tanned daily totes, crossbodies, and modular card folios that patina with distinction.',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=80',
    sort_order: 3,
    created_at: new Date('2025-01-12').toISOString(),
  },
  {
    id: 'cat-knitwear',
    name: 'Knitwear & Essentials',
    slug: 'knitwear',
    description: '100% Grade-A Mongolian cashmere sweaters, ribbed merino mock-necks, and heavyweight organic tees.',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=80',
    sort_order: 4,
    created_at: new Date('2025-01-13').toISOString(),
  },
  {
    id: 'cat-accessories',
    name: 'Objects & Timepieces',
    slug: 'accessories',
    description: 'Automatic mechanical watches, hand-cast bronze hardware, and matte ceramic vessels.',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
    sort_order: 5,
    created_at: new Date('2025-01-14').toISOString(),
  },
];

// Initial Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'STITCH BD Double-Breasted Wool Overcoat',
    slug: 'stitch-bd-double-breasted-wool-overcoat',
    description: 'Engineered from heavy 720gsm virgin wool sourced from Biella, Italy. Features horn buttons, cupro lining, unstructured drape, and deep storm welt pockets.',
    base_price: 680,
    compare_at_price: 850,
    sku: 'ATL-OC-01',
    category_id: 'cat-outerwear',
    brand: 'STITCH BD Studio',
    status: 'active',
    is_featured: true,
    seo_title: 'STITCH BD Double-Breasted Wool Overcoat | Luxury Menswear',
    seo_description: 'Pure virgin Italian wool tailored overcoat in deep charcoal and camel.',
    rating: 4.9,
    reviews_count: 28,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-15T12:00:00Z',
    images: [
      {
        id: 'img-001-1',
        product_id: 'prod-001',
        url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1200&q=80',
        alt_text: 'Front view of STITCH BD Double-Breasted Wool Overcoat in Camel',
        sort_order: 1,
      },
      {
        id: 'img-001-2',
        product_id: 'prod-001',
        url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=80',
        alt_text: 'Detail lapel view of Wool Overcoat',
        sort_order: 2,
      },
      {
        id: 'img-001-3',
        product_id: 'prod-001',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
        alt_text: 'Model wearing overcoat on city street',
        sort_order: 3,
      },
    ],
    variants: [
      {
        id: 'var-001-s-camel',
        product_id: 'prod-001',
        sku: 'ATL-OC-01-S-CAM',
        option_values: { size: 'S', color: 'Camel' },
        price: 680,
        stock_quantity: 14,
        image_url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800',
      },
      {
        id: 'var-001-m-camel',
        product_id: 'prod-001',
        sku: 'ATL-OC-01-M-CAM',
        option_values: { size: 'M', color: 'Camel' },
        price: 680,
        stock_quantity: 22,
        image_url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800',
      },
      {
        id: 'var-001-l-camel',
        product_id: 'prod-001',
        sku: 'ATL-OC-01-L-CAM',
        option_values: { size: 'L', color: 'Camel' },
        price: 680,
        stock_quantity: 8,
        image_url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800',
      },
      {
        id: 'var-001-m-charcoal',
        product_id: 'prod-001',
        sku: 'ATL-OC-01-M-CHR',
        option_values: { size: 'M', color: 'Charcoal' },
        price: 680,
        stock_quantity: 11,
        image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      },
    ],
  },
  {
    id: 'prod-002',
    name: 'Goodyear Commando Chelsea Boot',
    slug: 'goodyear-commando-chelsea-boot',
    description: 'Crafted in Tuscany with supple water-resistant waxed calf suede, Goodyear welt construction, custom storm welt, and lightweight Vibram commando lug soles.',
    base_price: 395,
    compare_at_price: 450,
    sku: 'ATL-FT-02',
    category_id: 'cat-footwear',
    brand: 'STITCH BD Artisan',
    status: 'active',
    is_featured: true,
    seo_title: 'Goodyear Commando Chelsea Boot | Italian Suede',
    seo_description: 'Resoleable Goodyear-welted Chelsea boots with Vibram lug sole.',
    rating: 4.8,
    reviews_count: 36,
    created_at: '2025-02-02T11:00:00Z',
    updated_at: '2025-02-16T14:00:00Z',
    images: [
      {
        id: 'img-002-1',
        product_id: 'prod-002',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80',
        alt_text: 'Goodyear Commando Chelsea Boot in Espresso Suede',
        sort_order: 1,
      },
      {
        id: 'img-002-2',
        product_id: 'prod-002',
        url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=80',
        alt_text: 'Side angle of Chelsea boot leather construction',
        sort_order: 2,
      },
    ],
    variants: [
      {
        id: 'var-002-41-espresso',
        product_id: 'prod-002',
        sku: 'ATL-FT-02-41-ESP',
        option_values: { size: 'US 8 / EU 41', color: 'Espresso Suede' },
        price: 395,
        stock_quantity: 6,
      },
      {
        id: 'var-002-42-espresso',
        product_id: 'prod-002',
        sku: 'ATL-FT-02-42-ESP',
        option_values: { size: 'US 9 / EU 42', color: 'Espresso Suede' },
        price: 395,
        stock_quantity: 15,
      },
      {
        id: 'var-002-43-espresso',
        product_id: 'prod-002',
        sku: 'ATL-FT-02-43-ESP',
        option_values: { size: 'US 10 / EU 43', color: 'Espresso Suede' },
        price: 395,
        stock_quantity: 12,
      },
      {
        id: 'var-002-42-black',
        product_id: 'prod-002',
        sku: 'ATL-FT-02-42-BLK',
        option_values: { size: 'US 9 / EU 42', color: 'Onyx Black' },
        price: 395,
        stock_quantity: 3, // Low stock alert
      },
    ],
  },
  {
    id: 'prod-003',
    name: 'Vegetable-Tanned Heritage Carryall',
    slug: 'vegetable-tanned-heritage-carryall',
    description: 'Handcrafted from thick 2.8mm Tuscan full-grain bridle leather with solid brass hand-hammered rivets, interior 16-inch laptop pocket, and key leash.',
    base_price: 520,
    sku: 'ATL-LG-03',
    category_id: 'cat-leather',
    brand: 'STITCH BD Leathercraft',
    status: 'active',
    is_featured: true,
    seo_title: 'Vegetable-Tanned Heritage Carryall Tote Bag',
    seo_description: 'Full-grain Tuscan bridle leather travel and work tote.',
    rating: 5.0,
    reviews_count: 19,
    created_at: '2025-02-03T09:00:00Z',
    updated_at: '2025-02-18T10:00:00Z',
    images: [
      {
        id: 'img-003-1',
        product_id: 'prod-003',
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80',
        alt_text: 'Vegetable-Tanned Heritage Carryall Tote in Saddle Brown',
        sort_order: 1,
      },
      {
        id: 'img-003-2',
        product_id: 'prod-003',
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=80',
        alt_text: 'Interior view showing brass hardware',
        sort_order: 2,
      },
    ],
    variants: [
      {
        id: 'var-003-saddle',
        product_id: 'prod-003',
        sku: 'ATL-LG-03-SDL',
        option_values: { color: 'Saddle Tan', size: 'One Size' },
        price: 520,
        stock_quantity: 18,
      },
      {
        id: 'var-003-black',
        product_id: 'prod-003',
        sku: 'ATL-LG-03-BLK',
        option_values: { color: 'Matte Black', size: 'One Size' },
        price: 520,
        stock_quantity: 9,
      },
    ],
  },
  {
    id: 'prod-004',
    name: 'Mongolian Grade-A Cashmere Crewneck',
    slug: 'mongolian-grade-a-cashmere-crewneck',
    description: 'Spun from 15.2-micron 2-ply cashmere combed from free-roaming mountain goats. Incredibly soft, pill-resistant, finished with hand-linked seams.',
    base_price: 290,
    compare_at_price: 350,
    sku: 'ATL-KW-04',
    category_id: 'cat-knitwear',
    brand: 'STITCH BD Studio',
    status: 'active',
    is_featured: false,
    rating: 4.9,
    reviews_count: 42,
    created_at: '2025-02-04T12:00:00Z',
    updated_at: '2025-02-19T11:00:00Z',
    images: [
      {
        id: 'img-004-1',
        product_id: 'prod-004',
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&q=80',
        alt_text: 'Cashmere crewneck sweater in heather oatmeal',
        sort_order: 1,
      },
      {
        id: 'img-004-2',
        product_id: 'prod-004',
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=80',
        alt_text: 'Detail texture of cashmere ribbing',
        sort_order: 2,
      },
    ],
    variants: [
      {
        id: 'var-004-s-oatmeal',
        product_id: 'prod-004',
        sku: 'ATL-KW-04-S-OAT',
        option_values: { size: 'S', color: 'Oatmeal' },
        price: 290,
        stock_quantity: 15,
      },
      {
        id: 'var-004-m-oatmeal',
        product_id: 'prod-004',
        sku: 'ATL-KW-04-M-OAT',
        option_values: { size: 'M', color: 'Oatmeal' },
        price: 290,
        stock_quantity: 20,
      },
      {
        id: 'var-004-l-oatmeal',
        product_id: 'prod-004',
        sku: 'ATL-KW-04-L-OAT',
        option_values: { size: 'L', color: 'Oatmeal' },
        price: 290,
        stock_quantity: 14,
      },
      {
        id: 'var-004-m-navy',
        product_id: 'prod-004',
        sku: 'ATL-KW-04-M-NVY',
        option_values: { size: 'M', color: 'Midnight Navy' },
        price: 290,
        stock_quantity: 7,
      },
    ],
  },
  {
    id: 'prod-005',
    name: 'Sector Minimalist Automatic Watch',
    slug: 'sector-minimalist-automatic-watch',
    description: '38mm bead-blasted 316L stainless steel case, Japanese Miyota 9015 high-beat automatic movement with 42-hour power reserve, double-domed anti-reflective sapphire crystal.',
    base_price: 540,
    compare_at_price: 620,
    sku: 'ATL-AC-05',
    category_id: 'cat-accessories',
    brand: 'STITCH BD Chronometry',
    status: 'active',
    is_featured: true,
    rating: 4.7,
    reviews_count: 15,
    created_at: '2025-02-05T14:00:00Z',
    updated_at: '2025-02-20T16:00:00Z',
    images: [
      {
        id: 'img-005-1',
        product_id: 'prod-005',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
        alt_text: 'Sector Minimalist Automatic Watch on desk',
        sort_order: 1,
      },
      {
        id: 'img-005-2',
        product_id: 'prod-005',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
        alt_text: 'Caseback showing mechanical movement',
        sort_order: 2,
      },
    ],
    variants: [
      {
        id: 'var-005-steel',
        product_id: 'prod-005',
        sku: 'ATL-AC-05-STL',
        option_values: { color: 'Silver / Horween Leather', size: '38mm' },
        price: 540,
        stock_quantity: 4, // Low stock
      },
      {
        id: 'var-005-dlc',
        product_id: 'prod-005',
        sku: 'ATL-AC-05-DLC',
        option_values: { color: 'DLC Matte Black / Rubber', size: '38mm' },
        price: 565,
        stock_quantity: 12,
      },
    ],
  },
  {
    id: 'prod-006',
    name: 'Technical Gabardine Rain Mac',
    slug: 'technical-gabardine-rain-mac',
    description: '3-layer waterproof and breathable Japanese nylon gabardine with fully taped interior seams, hidden magnetic storm flap, and laser-cut underarm ventilation.',
    base_price: 490,
    sku: 'ATL-OC-06',
    category_id: 'cat-outerwear',
    brand: 'STITCH BD Studio',
    status: 'active',
    is_featured: false,
    rating: 4.9,
    reviews_count: 11,
    created_at: '2025-02-06T10:00:00Z',
    updated_at: '2025-02-21T09:00:00Z',
    images: [
      {
        id: 'img-006-1',
        product_id: 'prod-006',
        url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1200&q=80',
        alt_text: 'Technical Gabardine Rain Mac in Olive Drab',
        sort_order: 1,
      },
    ],
    variants: [
      {
        id: 'var-006-s-olive',
        product_id: 'prod-006',
        sku: 'ATL-OC-06-S-OLV',
        option_values: { size: 'S', color: 'Olive' },
        price: 490,
        stock_quantity: 8,
      },
      {
        id: 'var-006-m-olive',
        product_id: 'prod-006',
        sku: 'ATL-OC-06-M-OLV',
        option_values: { size: 'M', color: 'Olive' },
        price: 490,
        stock_quantity: 16,
      },
      {
        id: 'var-006-l-olive',
        product_id: 'prod-006',
        sku: 'ATL-OC-06-L-OLV',
        option_values: { size: 'L', color: 'Olive' },
        price: 490,
        stock_quantity: 10,
      },
    ],
  },
  {
    id: 'prod-007',
    name: 'Modular Italian Calfskin Card Wallet',
    slug: 'modular-italian-calfskin-card-wallet',
    description: 'Ultra-slim 4mm profile with RFID blocking core, 6 exterior slots, central bill compartment, and burnished edge coat hand-finished with natural beeswax.',
    base_price: 115,
    compare_at_price: 135,
    sku: 'ATL-LG-07',
    category_id: 'cat-leather',
    brand: 'STITCH BD Leathercraft',
    status: 'active',
    is_featured: true,
    rating: 4.8,
    reviews_count: 53,
    created_at: '2025-02-07T15:00:00Z',
    updated_at: '2025-02-22T13:00:00Z',
    images: [
      {
        id: 'img-007-1',
        product_id: 'prod-007',
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80',
        alt_text: 'Slim Leather Cardholder on wood block',
        sort_order: 1,
      },
    ],
    variants: [
      {
        id: 'var-007-cognac',
        product_id: 'prod-007',
        sku: 'ATL-LG-07-COG',
        option_values: { color: 'Cognac', size: 'Compact' },
        price: 115,
        stock_quantity: 34,
      },
      {
        id: 'var-007-noir',
        product_id: 'prod-007',
        sku: 'ATL-LG-07-NOIR',
        option_values: { color: 'Noir', size: 'Compact' },
        price: 115,
        stock_quantity: 28,
      },
    ],
  },
  {
    id: 'prod-008',
    name: 'Seamless Merino Wool Mockneck',
    slug: 'seamless-merino-wool-mockneck',
    description: 'Knitted as a single seamless garment using WholeGarment 3D machinery in Shiga, Japan. Ultra-fine 18.5 micron Australian wool for thermal regulation.',
    base_price: 210,
    sku: 'ATL-KW-08',
    category_id: 'cat-knitwear',
    brand: 'STITCH BD Studio',
    status: 'active',
    is_featured: false,
    rating: 4.7,
    reviews_count: 14,
    created_at: '2025-02-08T08:00:00Z',
    updated_at: '2025-02-23T10:00:00Z',
    images: [
      {
        id: 'img-008-1',
        product_id: 'prod-008',
        url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80',
        alt_text: 'Seamless Merino Mockneck folded on concrete',
        sort_order: 1,
      },
    ],
    variants: [
      {
        id: 'var-008-s-ash',
        product_id: 'prod-008',
        sku: 'ATL-KW-08-S-ASH',
        option_values: { size: 'S', color: 'Ash Gray' },
        price: 210,
        stock_quantity: 12,
      },
      {
        id: 'var-008-m-ash',
        product_id: 'prod-008',
        sku: 'ATL-KW-08-M-ASH',
        option_values: { size: 'M', color: 'Ash Gray' },
        price: 210,
        stock_quantity: 19,
      },
      {
        id: 'var-008-l-ash',
        product_id: 'prod-008',
        sku: 'ATL-KW-08-L-ASH',
        option_values: { size: 'L', color: 'Ash Gray' },
        price: 210,
        stock_quantity: 8,
      },
    ],
  },
];

// Initial Coupons
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'STITCH15',
    type: 'percentage',
    value: 15,
    min_order_value: 100,
    usage_limit: 500,
    used_count: 42,
    is_active: true,
    scope: 'all',
    starts_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'coup-2',
    code: 'VIP50',
    type: 'fixed',
    value: 50,
    min_order_value: 250,
    usage_limit: 100,
    used_count: 18,
    is_active: true,
    scope: 'all',
    starts_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'coup-3',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    min_order_value: 50,
    used_count: 85,
    is_active: true,
    scope: 'all',
    starts_at: '2025-01-01T00:00:00Z',
  },
];

// Initial Shipping Zones
export const INITIAL_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone-us',
    name: 'United States & Canada',
    countries: ['US', 'CA'],
    rates: [
      {
        id: 'rate-std',
        zone_id: 'zone-us',
        name: 'Standard Ground Delivery',
        price: 12,
        min_order_subtotal: 0,
        max_order_subtotal: 150,
        estimated_days: '3-5 business days',
      },
      {
        id: 'rate-free',
        zone_id: 'zone-us',
        name: 'Complimentary Express Ground',
        price: 0,
        min_order_subtotal: 150,
        estimated_days: '3-5 business days',
      },
      {
        id: 'rate-exp',
        zone_id: 'zone-us',
        name: 'Next-Day Priority Air',
        price: 28,
        min_order_subtotal: 0,
        estimated_days: '1-2 business days',
      },
    ],
  },
];

// Initial Tax Rules
export const INITIAL_TAX_RULES: TaxRule[] = [
  { id: 'tax-ca', country: 'US', state: 'CA', rate_percentage: 7.25, name: 'California State Tax', is_active: true },
  { id: 'tax-ny', country: 'US', state: 'NY', rate_percentage: 8.875, name: 'New York Sales Tax', is_active: true },
  { id: 'tax-tx', country: 'US', state: 'TX', rate_percentage: 6.25, name: 'Texas Tax', is_active: true },
  { id: 'tax-def', country: 'US', rate_percentage: 5.0, name: 'Standard US Estimate', is_active: true },
];

// Initial Reviews
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    product_id: 'prod-001',
    author_name: 'Julian Montgomery',
    rating: 5,
    title: 'The single best overcoat in modern menswear',
    body: 'The weight of this virgin wool is remarkable. It hangs with such authority and structure without feeling stifling. The horn buttons and cupro silk lining elevate it above coats twice its price.',
    is_verified_purchase: true,
    status: 'approved',
    admin_reply: 'Thank you Julian. The Biella mills we partner with have perfected this 720gsm weave over generations.',
    created_at: '2025-02-14T10:00:00Z',
  },
  {
    id: 'rev-002',
    product_id: 'prod-001',
    author_name: 'David K.',
    rating: 5,
    title: 'Masterpiece craftsmanship',
    body: 'True to size for layering over a suit or heavyweight sweater. Incredible tailoring around the shoulders.',
    is_verified_purchase: true,
    status: 'approved',
    created_at: '2025-02-18T16:20:00Z',
  },
  {
    id: 'rev-003',
    product_id: 'prod-002',
    author_name: 'Marcus Vance',
    rating: 5,
    title: 'Zero break-in period',
    body: 'Wore these for an 8-mile trek across rainy cobblestones in London. Waterproof, comfortable right out of the box, and the Vibram sole gave unbelievable traction.',
    is_verified_purchase: true,
    status: 'approved',
    created_at: '2025-02-19T09:12:00Z',
  },
  {
    id: 'rev-004',
    product_id: 'prod-003',
    author_name: 'Siddharth R.',
    rating: 5,
    title: 'The leather aroma alone is worth the investment',
    body: 'Superb vegetable-tanned bridle leather. You can feel the density and quality immediately. The brass hardware is top tier.',
    is_verified_purchase: true,
    status: 'approved',
    created_at: '2025-02-21T14:45:00Z',
  },
];

// Initial Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'ATL-25091',
    status: 'processing',
    subtotal: 680,
    discount_total: 0,
    shipping_total: 0,
    tax_total: 49.3,
    total: 729.3,
    currency: 'BDT',
    customer_email: 'sophia.chen@example.com',
    customer_name: 'Sophia Chen',
    customer_phone: '+1 (555) 456-7890',
    shipping_method: 'Complimentary Express Ground',
    tracking_number: '1Z9999999999999999',
    payment_method: 'credit_card',
    payment_status: 'paid',
    notes: 'Please leave at door if no response',
    internal_notes: 'Priority packaging requested for VIP client',
    items: [
      {
        id: 'ord-item-1',
        order_id: 'ord-1001',
        product_name_snapshot: 'STITCH BD Double-Breasted Wool Overcoat',
        price_snapshot: 680,
        quantity: 1,
        options_snapshot: { size: 'M', color: 'Camel' },
        image_url_snapshot: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600',
      },
    ],
    created_at: '2025-02-24T14:30:00Z',
    updated_at: '2025-02-24T15:00:00Z',
  },
  {
    id: 'ord-1002',
    order_number: 'ATL-25092',
    status: 'shipped',
    subtotal: 915,
    discount_total: 50,
    shipping_total: 0,
    tax_total: 66.34,
    total: 931.34,
    currency: 'BDT',
    customer_email: 'alexander.wright@domain.com',
    customer_name: 'Alexander Wright',
    customer_phone: '+1 (555) 234-9876',
    shipping_method: 'Next-Day Priority Air',
    tracking_number: '9400100000000000000000',
    payment_method: 'credit_card',
    payment_status: 'paid',
    items: [
      {
        id: 'ord-item-2',
        order_id: 'ord-1002',
        product_name_snapshot: 'Goodyear Commando Chelsea Boot',
        price_snapshot: 395,
        quantity: 1,
        options_snapshot: { size: 'US 10 / EU 43', color: 'Espresso Suede' },
        image_url_snapshot: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
      },
      {
        id: 'ord-item-3',
        order_id: 'ord-1002',
        product_name_snapshot: 'Vegetable-Tanned Heritage Carryall',
        price_snapshot: 520,
        quantity: 1,
        options_snapshot: { color: 'Saddle Tan' },
        image_url_snapshot: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
      },
    ],
    created_at: '2025-02-22T09:15:00Z',
    updated_at: '2025-02-23T11:45:00Z',
  },
  {
    id: 'ord-1003',
    order_number: 'ATL-25088',
    status: 'delivered',
    subtotal: 290,
    discount_total: 29,
    shipping_total: 12,
    tax_total: 21.03,
    total: 294.03,
    currency: 'BDT',
    customer_email: 'eleanor.p@lifestyle.net',
    customer_name: 'Eleanor Vance',
    shipping_method: 'Standard Ground Delivery',
    tracking_number: '1Z8888888888888888',
    payment_method: 'cod',
    payment_status: 'paid',
    items: [
      {
        id: 'ord-item-4',
        order_id: 'ord-1003',
        product_name_snapshot: 'Mongolian Grade-A Cashmere Crewneck',
        price_snapshot: 290,
        quantity: 1,
        options_snapshot: { size: 'M', color: 'Oatmeal' },
        image_url_snapshot: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
      },
    ],
    created_at: '2025-02-18T16:20:00Z',
    updated_at: '2025-02-21T18:00:00Z',
  },
];

// Initial Content Blocks
export const INITIAL_CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: 'cb-1',
    type: 'hero',
    title: 'Autumn/Winter Horizon',
    subtitle: 'Structural silhouettes cut from virgin wool, water-repellent Japanese gabardine, and heritage leather.',
    cta_label: 'Explore The Collection',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85',
    badge: 'New Season 2026',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'cb-2',
    type: 'hero',
    title: 'The Architectural Footwear Lab',
    subtitle: 'Zero-break-in Italian calfskin loafers and Goodyear-welted combat boots hand-buffed to a deep luster.',
    cta_label: 'Discover Footwear',
    cta_link: '/category/footwear',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&q=85',
    badge: 'Craftsmanship First',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'cb-3',
    type: 'promo',
    title: 'Vegetable-Tanned Daily Objects',
    subtitle: 'Tote bags and modular card folios engineered to age with distinction through every journey.',
    cta_label: 'Shop Leather Goods',
    cta_link: '/category/leather-goods',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80',
    badge: 'Limited Batch',
    is_active: true,
    sort_order: 3,
  },
];

// Initial Staff & Customer Profiles
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-admin-1',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    email: 'elena.rostova@stitchbd.com',
    phone: '+1 (555) 234-5678',
    city: 'Dhaka',
    country: 'Bangladesh',
    status: 'active',
    role: 'admin',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user-staff-1',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    email: 'marcus.vance@stitchbd.com',
    phone: '+1 (555) 345-6789',
    city: 'Dhaka',
    country: 'Bangladesh',
    status: 'active',
    role: 'staff',
    created_at: '2025-01-05T00:00:00Z',
  },
  {
    id: 'user-cust-1',
    full_name: 'Sophia Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    email: 'sophia.chen@example.com',
    phone: '+880 1711-456789',
    city: 'Gulshan, Dhaka',
    country: 'Bangladesh',
    status: 'vip',
    notes: 'High-volume patron. Prefers Cash on Delivery or priority dispatch.',
    role: 'customer',
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'user-cust-2',
    full_name: 'Tariq Rahman',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    email: 'tariq.rahman@business.bd',
    phone: '+880 1819-234567',
    city: 'Banani, Dhaka',
    country: 'Bangladesh',
    status: 'vip',
    notes: 'Frequent buyer of leather goods and cashmere coats.',
    role: 'customer',
    created_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'user-cust-3',
    full_name: 'Nusrat Jahan',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    email: 'nusrat.jahan@lifestyle.bd',
    phone: '+880 1912-987654',
    city: 'Chittagong',
    country: 'Bangladesh',
    status: 'active',
    notes: 'Prefers SMS updates for deliveries.',
    role: 'customer',
    created_at: '2025-02-02T14:20:00Z',
  },
  {
    id: 'user-cust-4',
    full_name: 'Arif Chowdhury',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    email: 'arif.chowdhury@craft.org',
    phone: '+880 1610-112233',
    city: 'Sylhet',
    country: 'Bangladesh',
    status: 'active',
    notes: 'Standard patron account. Regularly orders knitwear.',
    role: 'customer',
    created_at: '2025-02-10T11:00:00Z',
  },
];

// In-Memory Database Store Class
class DatabaseStore {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private orders: Order[] = [...INITIAL_ORDERS];
  private coupons: Coupon[] = [...INITIAL_COUPONS];
  private reviews: Review[] = [...INITIAL_REVIEWS];
  private shippingZones: ShippingZone[] = [...INITIAL_SHIPPING_ZONES];
  private taxRules: TaxRule[] = [...INITIAL_TAX_RULES];
  private contentBlocks: ContentBlock[] = [...INITIAL_CONTENT_BLOCKS];
  private profiles: Profile[] = [...INITIAL_PROFILES];
  private stockMovements: StockMovement[] = [
    {
      id: 'sm-1',
      variant_id: 'var-001-s-camel',
      product_name: 'STITCH BD Double-Breasted Wool Overcoat',
      sku: 'ATL-OC-01-S-CAM',
      change: 25,
      reason: 'Initial warehouse intake',
      actor_name: 'Elena Rostova',
      created_at: '2025-01-20T10:00:00Z',
    },
    {
      id: 'sm-2',
      variant_id: 'var-002-42-black',
      product_name: 'Goodyear Commando Chelsea Boot',
      sku: 'ATL-FT-02-42-BLK',
      change: -3,
      reason: 'Customer orders fulfillment',
      actor_name: 'System Order Engine',
      created_at: '2025-02-23T11:45:00Z',
    },
  ];
  private auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      actor_name: 'Elena Rostova',
      action: 'SYSTEM_BOOTSTRAP',
      entity: 'STORE',
      metadata: { version: '2.0.0', rls: 'enabled', tables: 18 },
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 'log-2',
      actor_name: 'Elena Rostova',
      action: 'PUBLISH_PRODUCT',
      entity: 'PRODUCT',
      entity_id: 'prod-001',
      metadata: { name: 'STITCH BD Double-Breasted Wool Overcoat', status: 'active' },
      created_at: '2025-02-01T10:00:00Z',
    },
  ];

  // Products
  getProducts(filters?: {
    category_slug?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    size?: string;
    color?: string;
    in_stock_only?: boolean;
    search?: string;
    sort?: string;
    status?: ProductStatus;
  }): Product[] {
    let result = [...this.products];

    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    } else {
      result = result.filter((p) => p.status === 'active');
    }

    if (filters?.category_slug) {
      const cat = this.categories.find((c) => c.slug === filters.category_slug);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    if (filters?.brand) {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }

    if (filters?.min_price !== undefined) {
      result = result.filter((p) => p.base_price >= (filters.min_price || 0));
    }

    if (filters?.max_price !== undefined) {
      result = result.filter((p) => p.base_price <= (filters.max_price || Infinity));
    }

    if (filters?.size) {
      result = result.filter((p) =>
        p.variants.some((v) => v.option_values.size?.toLowerCase().includes(filters.size!.toLowerCase()))
      );
    }

    if (filters?.color) {
      result = result.filter((p) =>
        p.variants.some((v) => v.option_values.color?.toLowerCase().includes(filters.color!.toLowerCase()))
      );
    }

    if (filters?.in_stock_only) {
      result = result.filter((p) => p.variants.some((v) => v.stock_quantity > 0));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (filters?.sort) {
      case 'price-asc':
        result.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popularity':
      default:
        result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
        break;
    }

    return result;
  }

  getAllProductsForAdmin(): Product[] {
    return [...this.products];
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>, actorName = 'Admin'): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: data.variants.map((v, idx) => ({
        ...v,
        id: v.id || `var-${Date.now()}-${idx}`,
        product_id: `prod-${Date.now()}`,
      })),
      images: data.images.map((img, idx) => ({
        ...img,
        id: img.id || `img-${Date.now()}-${idx}`,
        product_id: `prod-${Date.now()}`,
      })),
    };
    this.products.unshift(newProduct);
    this.addAuditLog(actorName, 'CREATE_PRODUCT', 'PRODUCT', newProduct.id, { name: newProduct.name });
    return newProduct;
  }

  updateProduct(id: string, data: Partial<Product>, actorName = 'Admin'): Product {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    const updated: Product = {
      ...this.products[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.products[idx] = updated;
    this.addAuditLog(actorName, 'UPDATE_PRODUCT', 'PRODUCT', id, { updated_fields: Object.keys(data) });
    return updated;
  }

  deleteProduct(id: string, actorName = 'Admin'): boolean {
    const product = this.getProductById(id);
    if (!product) return false;
    this.products = this.products.filter((p) => p.id !== id);
    this.addAuditLog(actorName, 'DELETE_PRODUCT', 'PRODUCT', id, { name: product.name });
    return true;
  }

  duplicateProduct(id: string, actorName = 'Admin'): Product {
    const original = this.getProductById(id);
    if (!original) throw new Error('Original product not found');

    const copy: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${original.sku}-CPY`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: original.variants.map((v, i) => ({
        ...v,
        id: `var-${Date.now()}-${i}`,
        sku: `${v.sku}-CPY`,
      })),
    };
    this.products.unshift(copy);
    this.addAuditLog(actorName, 'DUPLICATE_PRODUCT', 'PRODUCT', copy.id, { from_id: id });
    return copy;
  }

  bulkUpdateProductStatus(ids: string[], status: ProductStatus, actorName = 'Admin'): void {
    ids.forEach((id) => {
      const p = this.products.find((item) => item.id === id);
      if (p) p.status = status;
    });
    this.addAuditLog(actorName, 'BULK_UPDATE_STATUS', 'PRODUCT', undefined, { ids, status });
  }

  bulkDeleteProducts(ids: string[], actorName = 'Admin'): void {
    this.products = this.products.filter((p) => !ids.includes(p.id));
    this.addAuditLog(actorName, 'BULK_DELETE_PRODUCTS', 'PRODUCT', undefined, { count: ids.length });
  }

  // Categories
  getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.sort_order - b.sort_order);
  }

  createCategory(data: Omit<Category, 'id' | 'created_at'>, actorName = 'Admin'): Category {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.categories.push(newCat);
    this.addAuditLog(actorName, 'CREATE_CATEGORY', 'CATEGORY', newCat.id, { name: newCat.name });
    return newCat;
  }

  updateCategory(id: string, data: Partial<Category>, actorName = 'Admin'): Category {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    this.categories[idx] = { ...this.categories[idx], ...data };
    this.addAuditLog(actorName, 'UPDATE_CATEGORY', 'CATEGORY', id, { ...data });
    return this.categories[idx];
  }

  deleteCategory(id: string, actorName = 'Admin'): boolean {
    const cat = this.categories.find((c) => c.id === id);
    if (!cat) return false;
    this.categories = this.categories.filter((c) => c.id !== id);
    this.addAuditLog(actorName, 'DELETE_CATEGORY', 'CATEGORY', id, { name: cat.name });
    return true;
  }

  // Inventory & Stock
  getStockLevels() {
    const list: {
      id: string;
      product_id: string;
      product_name: string;
      product_slug: string;
      image_url: string;
      sku: string;
      options: Record<string, string | undefined>;
      price: number;
      stock_quantity: number;
      is_low_stock: boolean;
    }[] = [];

    this.products.forEach((p) => {
      p.variants.forEach((v) => {
        list.push({
          id: v.id,
          product_id: p.id,
          product_name: p.name,
          product_slug: p.slug,
          image_url: v.image_url || p.images[0]?.url || '',
          sku: v.sku,
          options: v.option_values,
          price: v.price,
          stock_quantity: v.stock_quantity,
          is_low_stock: v.stock_quantity <= 5,
        });
      });
    });

    return list;
  }

  adjustStock(variantId: string, change: number, reason: string, actorName = 'Admin'): void {
    for (const p of this.products) {
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        v.stock_quantity = Math.max(0, v.stock_quantity + change);
        this.stockMovements.unshift({
          id: `sm-${Date.now()}`,
          variant_id: variantId,
          product_name: p.name,
          sku: v.sku,
          change,
          reason,
          actor_name: actorName,
          created_at: new Date().toISOString(),
        });
        this.addAuditLog(actorName, 'ADJUST_STOCK', 'INVENTORY', variantId, {
          product_name: p.name,
          sku: v.sku,
          change,
          reason,
          new_stock: v.stock_quantity,
        });
        return;
      }
    }
    throw new Error('Variant not found for stock adjustment');
  }

  getStockMovements(): StockMovement[] {
    return [...this.stockMovements];
  }

  // Orders
  getOrders(filters?: { status?: OrderStatus; search?: string }): Order[] {
    let result = [...this.orders];
    if (filters?.status) {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          (o.customer_name?.toLowerCase().includes(q) ?? false) ||
          (o.customer_email?.toLowerCase().includes(q) ?? false)
      );
    }
    return result
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((o) => ({
        ...o,
        total_amount: o.total_amount ?? o.total,
        discount_amount: o.discount_amount ?? o.discount_total,
        shipping_cost: o.shipping_cost ?? o.shipping_total,
        tax_amount: o.tax_amount ?? o.tax_total,
        items: o.items.map((i) => ({
          ...i,
          product_name: i.product_name || i.product_name_snapshot,
          unit_price: i.unit_price ?? i.price_snapshot,
          image_url: i.image_url || i.image_url_snapshot,
          variant_sku: i.variant_sku || 'ATL-SKU',
        })),
      }));
  }

  getOrderById(id: string): Order | undefined {
    const o = this.orders.find((item) => item.id === id);
    if (!o) return undefined;
    return {
      ...o,
      total_amount: o.total_amount ?? o.total,
      discount_amount: o.discount_amount ?? o.discount_total,
      shipping_cost: o.shipping_cost ?? o.shipping_total,
      tax_amount: o.tax_amount ?? o.tax_total,
      items: o.items.map((i) => ({
        ...i,
        product_name: i.product_name || i.product_name_snapshot,
        unit_price: i.unit_price ?? i.price_snapshot,
        image_url: i.image_url || i.image_url_snapshot,
        variant_sku: i.variant_sku || 'ATL-SKU',
      })),
    };
  }

  getOrder(id: string): Order | undefined {
    return this.getOrderById(id);
  }

  getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders.find((o) => o.order_number.toUpperCase() === orderNumber.toUpperCase());
  }

  createOrder(data: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order {
    const orderNumber = `ATL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...data,
      currency: data.currency || 'BDT',
      payment_method: data.payment_method || 'credit_card',
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Decrement stock for purchased items
    data.items.forEach((item) => {
      if (item.variant_id) {
        try {
          this.adjustStock(item.variant_id, -item.quantity, `Fulfilled Order ${orderNumber}`, 'Order System');
        } catch {
          // ignore if variant snapshot only
        }
      }
    });

    this.orders.unshift(newOrder);
    this.addAuditLog('Storefront Checkout', 'CREATE_ORDER', 'ORDER', newOrder.id, {
      order_number: orderNumber,
      total: newOrder.total,
      currency: newOrder.currency,
      payment_method: newOrder.payment_method,
      items_count: newOrder.items.length,
    });
    return newOrder;
  }

  updateOrderStatus(id: string, status: OrderStatus, trackingNumber?: string, actorName = 'Admin'): Order {
    const order = this.getOrderById(id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    if (trackingNumber) order.tracking_number = trackingNumber;
    order.updated_at = new Date().toISOString();
    this.addAuditLog(actorName, 'UPDATE_ORDER_STATUS', 'ORDER', id, { status, trackingNumber });
    return order;
  }

  updateOrderPaymentStatus(id: string, paymentStatus: PaymentStatus, actorName = 'Admin'): Order {
    const order = this.getOrderById(id);
    if (!order) throw new Error('Order not found');
    order.payment_status = paymentStatus;
    order.updated_at = new Date().toISOString();
    this.addAuditLog(actorName, 'UPDATE_PAYMENT_STATUS', 'ORDER', id, { payment_status: paymentStatus });
    return order;
  }

  issueRefund(orderId: string, amount: number, reason: string, actorName = 'Admin'): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    order.payment_status = 'refunded';
    order.status = 'refunded';
    order.internal_notes = `${order.internal_notes ? order.internal_notes + '\n' : ''}Refunded $${amount.toFixed(2)}: ${reason}`;
    this.addAuditLog(actorName, 'ISSUE_REFUND', 'ORDER', orderId, { amount, reason });
    return order;
  }

  addOrderInternalNote(orderId: string, note: string, actorName = 'Admin'): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    order.internal_notes = order.internal_notes ? `${order.internal_notes}\n[${actorName}]: ${note}` : `[${actorName}]: ${note}`;
    return order;
  }

  // Customers
  getCustomers(): {
    id: string;
    name: string;
    email: string;
    orders_count: number;
    total_spent: number;
    last_order_date?: string;
    status: 'active' | 'blocked';
  }[] {
    const customerMap = new Map<
      string,
      { id: string; name: string; email: string; orders_count: number; total_spent: number; last_order_date?: string; status: 'active' | 'blocked' }
    >();

    // Seed defaults
    customerMap.set('sophia.chen@example.com', {
      id: 'cust-1',
      name: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      orders_count: 3,
      total_spent: 1845.2,
      last_order_date: '2025-02-24T14:30:00Z',
      status: 'active',
    });
    customerMap.set('alexander.wright@domain.com', {
      id: 'cust-2',
      name: 'Alexander Wright',
      email: 'alexander.wright@domain.com',
      orders_count: 2,
      total_spent: 1420.5,
      last_order_date: '2025-02-22T09:15:00Z',
      status: 'active',
    });

    this.orders.forEach((o) => {
      const email = o.customer_email || 'guest@stitchbd.com';
      const existing = customerMap.get(email);
      if (existing) {
        existing.orders_count += 1;
        existing.total_spent += o.total;
        if (!existing.last_order_date || new Date(o.created_at) > new Date(existing.last_order_date)) {
          existing.last_order_date = o.created_at;
        }
      } else {
        customerMap.set(email, {
          id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: o.customer_name || 'Valued Client',
          email: email,
          orders_count: 1,
          total_spent: o.total,
          last_order_date: o.created_at,
          status: 'active',
        });
      }
    });

    return Array.from(customerMap.values());
  }

  updateCustomerStatus(email: string, status: 'active' | 'blocked', actorName = 'Admin') {
    this.addAuditLog(actorName, 'UPDATE_CUSTOMER_STATUS', 'CUSTOMER', email, { status });
  }

  // Coupons
  getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const found = this.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.is_active);
    if (!found) {
      return { valid: false, error: 'Invalid or expired coupon code.' };
    }
    if (subtotal < found.min_order_value) {
      return { valid: false, error: `Minimum order subtotal for ${found.code} is $${found.min_order_value.toFixed(2)}.` };
    }
    if (found.usage_limit && found.used_count >= found.usage_limit) {
      return { valid: false, error: 'Coupon usage limit has been reached.' };
    }
    return { valid: true, coupon: found };
  }

  createCoupon(data: Omit<Coupon, 'id' | 'used_count'>, actorName = 'Admin'): Coupon {
    const newCoupon: Coupon = {
      ...data,
      id: `coup-${Date.now()}`,
      used_count: 0,
      code: data.code.toUpperCase(),
    };
    this.coupons.unshift(newCoupon);
    this.addAuditLog(actorName, 'CREATE_COUPON', 'COUPON', newCoupon.id, { code: newCoupon.code });
    return newCoupon;
  }

  updateCoupon(id: string, data: Partial<Coupon>, actorName = 'Admin'): Coupon {
    const idx = this.coupons.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Coupon not found');
    this.coupons[idx] = { ...this.coupons[idx], ...data };
    this.addAuditLog(actorName, 'UPDATE_COUPON', 'COUPON', id, { ...data });
    return this.coupons[idx];
  }

  deleteCoupon(id: string, actorName = 'Admin'): boolean {
    const coup = this.coupons.find((c) => c.id === id);
    if (!coup) return false;
    this.coupons = this.coupons.filter((c) => c.id !== id);
    this.addAuditLog(actorName, 'DELETE_COUPON', 'COUPON', id, { code: coup.code });
    return true;
  }

  // Reviews
  getReviews(productId?: string, status?: ReviewStatus): Review[] {
    let list = [...this.reviews];
    if (productId) list = list.filter((r) => r.product_id === productId);
    if (status) list = list.filter((r) => r.status === status);
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  createReview(data: Omit<Review, 'id' | 'created_at' | 'status'>): Review {
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      status: 'approved', // Auto-approved or pending in moderation
      created_at: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);

    // Recalculate product rating
    const productReviews = this.reviews.filter((r) => r.product_id === data.product_id && r.status === 'approved');
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const product = this.getProductById(data.product_id);
    if (product) {
      product.rating = Number(avg.toFixed(1));
      product.reviews_count = productReviews.length;
    }

    return newReview;
  }

  moderateReview(id: string, status: ReviewStatus, adminReply?: string, actorName = 'Admin'): Review {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) throw new Error('Review not found');
    review.status = status;
    if (adminReply !== undefined) review.admin_reply = adminReply;
    this.addAuditLog(actorName, 'MODERATE_REVIEW', 'REVIEW', id, { status, adminReply });
    return review;
  }

  deleteReview(id: string, actorName = 'Admin'): boolean {
    this.reviews = this.reviews.filter((r) => r.id !== id);
    this.addAuditLog(actorName, 'DELETE_REVIEW', 'REVIEW', id, {});
    return true;
  }

  // Content Blocks
  getContentBlocks(): ContentBlock[] {
    return [...this.contentBlocks].sort((a, b) => a.sort_order - b.sort_order);
  }

  updateContentBlock(id: string, data: Partial<ContentBlock>, actorName = 'Admin'): ContentBlock {
    const idx = this.contentBlocks.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Block not found');
    this.contentBlocks[idx] = { ...this.contentBlocks[idx], ...data };
    this.addAuditLog(actorName, 'UPDATE_CONTENT', 'CONTENT_BLOCK', id, { ...data });
    return this.contentBlocks[idx];
  }

  createContentBlock(data: Omit<ContentBlock, 'id'>, actorName = 'Admin'): ContentBlock {
    const newBlock: ContentBlock = {
      ...data,
      id: `cb-${Date.now()}`,
    };
    this.contentBlocks.push(newBlock);
    this.addAuditLog(actorName, 'CREATE_CONTENT', 'CONTENT_BLOCK', newBlock.id, { title: newBlock.title });
    return newBlock;
  }

  deleteContentBlock(id: string, actorName = 'Admin'): boolean {
    this.contentBlocks = this.contentBlocks.filter((b) => b.id !== id);
    this.addAuditLog(actorName, 'DELETE_CONTENT', 'CONTENT_BLOCK', id, {});
    return true;
  }

  // Shipping & Tax
  getShippingZones(): ShippingZone[] {
    return [...this.shippingZones];
  }

  getTaxRules(): TaxRule[] {
    return [...this.taxRules];
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  addAuditLog(actorName: string, action: string, entity: string, entityId?: string, metadata: Record<string, unknown> = {}) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actor_name: actorName,
      action,
      entity,
      entity_id: entityId,
      metadata,
      created_at: new Date().toISOString(),
    });
  }

  // Staff Profiles
  getProfiles(): Profile[] {
    return [...this.profiles];
  }

  addStaffProfile(full_name: string, role: UserRole, email: string, actorName = 'Admin'): Profile {
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      full_name,
      role,
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      phone: '+1 (555) 000-1122',
      created_at: new Date().toISOString(),
    };
    this.profiles.push(newProfile);
    this.addAuditLog(actorName, 'INVITE_STAFF', 'STAFF', newProfile.id, { full_name, role, email });
    return newProfile;
  }

  updateProfileRole(id: string, role: UserRole, actorName = 'Admin'): Profile {
    const prof = this.profiles.find((p) => p.id === id);
    if (!prof) throw new Error('Profile not found');
    prof.role = role;
    this.addAuditLog(actorName, 'UPDATE_ROLE', 'STAFF', id, { new_role: role });
    return prof;
  }

  // Store Analytics
  getStoreAnalytics(): StoreAnalytics {
    const total_revenue = this.orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total : 0), 0);
    const total_orders = this.orders.length;
    const average_order_value = total_orders > 0 ? total_revenue / total_orders : 0;
    const conversion_rate = 3.42; // Percentage
    const new_customers = 86;

    // Revenue Trend by Day
    const revenue_trend = [
      { date: 'Mon', amount: 1420, orders: 3 },
      { date: 'Tue', amount: 2180, orders: 5 },
      { date: 'Wed', amount: 1890, orders: 4 },
      { date: 'Thu', amount: 2640, orders: 6 },
      { date: 'Fri', amount: 3850, orders: 8 },
      { date: 'Sat', amount: 4920, orders: 11 },
      { date: 'Sun', amount: 3410, orders: 7 },
    ];

    // Top Selling Products
    const top_products = [
      {
        id: 'prod-001',
        name: 'STITCH BD Double-Breasted Wool Overcoat',
        sales_count: 48,
        revenue: 32640,
        image_url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=200',
      },
      {
        id: 'prod-003',
        name: 'Vegetable-Tanned Heritage Carryall',
        sales_count: 36,
        revenue: 18720,
        image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
      },
      {
        id: 'prod-002',
        name: 'Goodyear Commando Chelsea Boot',
        sales_count: 29,
        revenue: 11455,
        image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
      },
      {
        id: 'prod-005',
        name: 'Sector Minimalist Automatic Watch',
        sales_count: 21,
        revenue: 11340,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      },
    ];

    // Low stock items
    const low_stock_variants: { id: string; product_name: string; sku: string; stock: number; price: number }[] = [];
    this.products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock_quantity <= 5) {
          low_stock_variants.push({
            id: v.id,
            product_name: p.name,
            sku: v.sku,
            stock: v.stock_quantity,
            price: v.price,
          });
        }
      });
    });

    return {
      total_revenue,
      total_orders,
      average_order_value,
      conversion_rate,
      new_customers,
      revenue_trend,
      top_products,
      recent_orders: this.orders.slice(0, 5),
      low_stock_variants,
    };
  }

  // Convenience Aliases for Back-Office Operations
  adjustInventory(variantId: string, newStock: number): void {
    for (const p of this.products) {
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        v.stock_quantity = Math.max(0, newStock);
        return;
      }
    }
  }

  updateReviewStatus(id: string, status: ReviewStatus): Review {
    return this.moderateReview(id, status);
  }

  addReviewReply(id: string, reply: string): Review {
    return this.moderateReview(id, 'approved', reply);
  }

  getBanners(): { id: string; title: string; subtitle?: string; badge?: string; cta_label?: string; cta_link?: string; image_url: string; is_active: boolean }[] {
    return this.contentBlocks.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge,
      cta_label: b.cta_label,
      cta_link: b.cta_link,
      image_url: b.image_url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
      is_active: b.is_active,
    }));
  }

  createBanner(data: { title: string; subtitle?: string; badge?: string; cta_label?: string; cta_link?: string; image_url: string; is_active: boolean }) {
    return this.createContentBlock({
      type: 'hero',
      title: data.title,
      subtitle: data.subtitle,
      badge: data.badge,
      cta_label: data.cta_label,
      cta_link: data.cta_link,
      image_url: data.image_url,
      is_active: data.is_active,
      sort_order: this.contentBlocks.length + 1,
    });
  }

  updateBanner(id: string, data: Partial<{ title: string; subtitle?: string; badge?: string; cta_label?: string; cta_link?: string; image_url: string; is_active: boolean }>) {
    return this.updateContentBlock(id, data);
  }

  deleteBanner(id: string): boolean {
    return this.deleteContentBlock(id);
  }

  getDiscounts(): Discount[] {
    return this.coupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: c.value,
      min_order_value: c.min_order_value,
      max_uses: c.usage_limit ?? c.max_uses,
      usage_limit: c.usage_limit ?? c.max_uses,
      used_count: c.used_count,
      starts_at: c.starts_at,
      expires_at: c.expires_at,
      is_active: c.is_active,
    }));
  }

  createDiscount(data: any): Coupon {
    return this.createCoupon({
      code: data.code,
      type: data.type === 'fixed_amount' ? 'fixed' : (data.type || 'percentage'),
      value: data.value,
      min_order_value: data.min_order_value || 0,
      usage_limit: data.max_uses,
      starts_at: data.starts_at || new Date().toISOString(),
      expires_at: data.expires_at,
      is_active: data.is_active ?? true,
      scope: 'all',
    });
  }

  updateDiscount(id: string, data: any): Coupon {
    return this.updateCoupon(id, data);
  }

  deleteDiscount(id: string): boolean {
    return this.deleteCoupon(id);
  }

  getUsers(): Profile[] {
    return this.getProfiles();
  }

  createUser(
    data: {
      full_name: string;
      role?: UserRole;
      email?: string;
      phone?: string;
      city?: string;
      country?: string;
      status?: 'active' | 'inactive' | 'vip';
      notes?: string;
      avatar_url?: string;
    },
    actorName = 'Admin'
  ): Profile {
    const newProfile: Profile = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      full_name: data.full_name,
      role: data.role || 'customer',
      email: data.email,
      phone: data.phone,
      city: data.city || 'Dhaka',
      country: data.country || 'Bangladesh',
      status: data.status || 'active',
      notes: data.notes,
      avatar_url: data.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.unshift(newProfile);
    this.addAuditLog(actorName, 'CREATE_CUSTOMER', 'USER', newProfile.id, {
      full_name: newProfile.full_name,
      email: newProfile.email,
      phone: newProfile.phone,
      status: newProfile.status,
    });
    return newProfile;
  }

  updateUser(id: string, data: Partial<Profile>, actorName = 'Admin'): Profile {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.profiles[idx] = {
        ...this.profiles[idx],
        ...data,
        updated_at: new Date().toISOString(),
      };
      this.addAuditLog(actorName, 'UPDATE_CUSTOMER', 'USER', id, { ...data });
      return this.profiles[idx];
    }
    const created: Profile = {
      id,
      full_name: data.full_name || 'STITCH BD Client',
      role: data.role || 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.profiles.unshift(created);
    this.addAuditLog(actorName, 'CREATE_CUSTOMER', 'USER', id, { ...data });
    return created;
  }

  deleteUser(id: string, actorName = 'Admin'): boolean {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const removed = this.profiles[idx];
    this.profiles.splice(idx, 1);
    this.addAuditLog(actorName, 'DELETE_CUSTOMER', 'USER', id, {
      full_name: removed.full_name,
      email: removed.email,
    });
    return true;
  }
}

// Global Singleton Instance
declare global {
  var __stitchbd_db__: DatabaseStore | undefined;
}

export const db: DatabaseStore = globalThis.__stitchbd_db__ ?? new DatabaseStore();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__stitchbd_db__ = db;
}

import {
  DigitalProduct,
  DigitalOrder,
  DigitalDownloadToken,
  DigitalEmailDispatch,
  DigitalStatsKPI,
  DigitalPaymentMethod,
  DigitalOrderItem,
} from './types';

export const INITIAL_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'dig-prod-001',
    title: 'Architectural Trench Coat Full Production Tech Pack',
    slug: 'architectural-trench-coat-production-tech-pack',
    summary:
      'Complete industrial manufacturing pack with graded measurement specs, bill of materials, sewing sequences, and seam allowances.',
    description:
      'Engineered for industrial garment manufacturing and boutique ateliers. Contains comprehensive technical drawings (front, back, interior, storm flap cross-section), vector CAD files, tolerance matrices for sizes XS through XXL, fabric yield charts, and English/Italian stitch standard annotations.',
    category: 'tech_packs',
    price: 3200,
    compare_at_price: 4500,
    file_format: 'ZIP',
    file_size_mb: 48.5,
    version: '2.4 (Industrial Edition)',
    software_compatibility: ['Adobe Illustrator', 'Optitex', 'Gerber AccuMark', 'Lectra Modaris', 'Any PDF Reader'],
    includes: [
      'Industrial Vector Blueprint (AI, EPS & SVG)',
      'Graded Technical Specification Sheets (Excel & PDF)',
      'Bill of Materials (BOM) & Stitch Standard Guide',
      'High-Resolution Seam Construction Visual Diagrams',
      'Commercial Production License Certificate',
    ],
    max_downloads: 3,
    expiry_hours: 72,
    license_type: 'Commercial Atelier',
    cover_image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    ],
    sample_download_name: 'STITCH-BD_TrenchCoat_TechPack_Bundle.zip',
    sample_file_content: `STITCH BD INDUSTRIAL TECH PACK - ARCHITECTURAL TRENCH COAT
SKU: DIG-TP-01
Licensee: Verified Digital Purchaser
Format: Graded Industrial Spec Suite
Notice: Digital watermarked delivery. Single organization license.
Contents:
1. Graded Spec Sheet (XS to XXL)
2. Stitch Standard: ISO 4915 Type 301 Lockstitch / Type 504 Overedge
3. Seam Allowance: 1.25cm body, 2.5cm hem
4. Hardware: 32L Genuine Horn Buttons x 10, Double Prong Gunmetal Buckle x 2
All rights reserved © STITCH BD Studio.`,
    is_featured: true,
    is_active: true,
    sales_count: 84,
    downloads_count: 142,
    rating: 4.9,
    reviews_count: 19,
    created_at: '2025-01-10T09:00:00Z',
  },
  {
    id: 'dig-prod-002',
    title: 'Double-Breasted Wool Overcoat Master Sewing Pattern',
    slug: 'double-breasted-wool-overcoat-master-sewing-pattern',
    summary:
      'Multi-size PDF sewing pattern ready for wide-format plotters (A0) and standard home printers (A4 / US Letter) with layered size toggles.',
    description:
      'A true bespoke pattern drafted by our master pattern cutters in Savile Row tradition. Designed specifically for structured wools, cashmeres, and heavy tweeds. Includes floating canvas chest piece patterns, split sleeve construction, and welt pocket templates.',
    category: 'sewing_patterns',
    price: 1850,
    compare_at_price: 2600,
    file_format: 'PDF',
    file_size_mb: 22.1,
    version: '1.8',
    software_compatibility: ['Adobe Acrobat Reader', 'Foxit PDF', 'Wide-Format A0 Plotters'],
    includes: [
      'Layered A0 Plotter Copy Shop File (Full Scale 1:1)',
      'Tiled A4 & US Letter Home Print Files with Alignment Grid',
      'Illustrated 42-Page Bespoke Tailoring Workbook',
      'Chest Canvas & Shoulder Pad Interfacing Patterns',
      'Fabric Cutting Layouts for 140cm & 150cm Fabric Widths',
    ],
    max_downloads: 4,
    expiry_hours: 120,
    license_type: 'Personal Maker',
    cover_image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    ],
    sample_download_name: 'STITCH-BD_Overcoat_Pattern_FullScale_A0_A4.pdf',
    sample_file_content: `%PDF-1.7
% STITCH BD MASTER PATTERN - DOUBLE BREASTED WOOL OVERCOAT
% Test Square 100mm x 100mm included on Page 1.
% Layers: Size 36, Size 38, Size 40, Size 42, Size 44, Size 46, Size 48.
% Seam Allowances: Included at 1.5cm unless marked.
% Ensure Printer Scale is set to "Actual Size" or 100% (Do not fit to page).`,
    is_featured: true,
    is_active: true,
    sales_count: 128,
    downloads_count: 260,
    rating: 5.0,
    reviews_count: 34,
    created_at: '2025-01-15T11:30:00Z',
  },
  {
    id: 'dig-prod-003',
    title: '3D Virtual Garment Avatar & CLO3D / Marvelous Simulation Suite',
    slug: '3d-virtual-garment-simulation-clo3d-suite',
    summary:
      'Native .zprj and .obj files calibrated with physical fabric physics for realistic runway simulations, digital fitting, and rendering.',
    description:
      'Ready-to-simulate 3D garment asset featuring realistic Italian wool, cupro silk lining, and rigid denim physics. Includes customized high-resolution avatar pose, stitch tension mapping, 4K PBR texture maps (diffuse, normal, roughness, displacement), and Blender Cycles scene setup.',
    category: 'garment_3d',
    price: 4900,
    compare_at_price: 6800,
    file_format: 'CLO3D',
    file_size_mb: 185.0,
    version: '3.0 (Physically Based Shading)',
    software_compatibility: ['CLO 3D v7.2+', 'Marvelous Designer 12+', 'Blender 4.0+', 'Unreal Engine 5'],
    includes: [
      'Native .ZPRJ Project File with Layered Sewing Lines',
      'Exported High-Poly and Mid-Poly .FBX & .OBJ Meshes',
      '4K PBR Texture Maps (Albedo, Normal, Metallic, Roughness, AO)',
      'Pre-calibrated Fabric Preset Curve for Wool Gabardine',
      'Automated 360 Turntable Camera Rig',
    ],
    max_downloads: 3,
    expiry_hours: 72,
    license_type: 'Commercial Atelier',
    cover_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    ],
    sample_download_name: 'STITCH-BD_3D_Sim_Overcoat_CLO3D_Bundle.zip',
    sample_file_content: `STITCH BD 3D GARMENT ASSET PACKAGE
Asset: Overcoat Sim Project 003
Format: CLO 3D (.zprj) + PBR Textures
Fabric Presets:
- Exterior: 100% Virgin Wool Melange (Weight: 680 gsm, Bending: 42.5, Stretch: 12.0)
- Interior: 100% Cupro Twill Lining (Weight: 110 gsm, Bending: 8.2, Stretch: 4.5)
Render Engine Target: Blender 4.2 / Cycles & Unreal Engine 5.4 Subsurface Shader.`,
    is_featured: true,
    is_active: true,
    sales_count: 53,
    downloads_count: 98,
    rating: 4.8,
    reviews_count: 12,
    created_at: '2025-02-01T14:20:00Z',
  },
  {
    id: 'dig-prod-004',
    title: 'Vegetable-Tanned Heritage Leather Goods Blueprint & DXF Cut Files',
    slug: 'vegetable-tanned-leather-goods-blueprint-dxf',
    summary:
      'Vector CAD cut files for laser cutters, CNC oscillating knives, and acrylic template machining for weekend artisans and leather ateliers.',
    description:
      'Precision-engineered vector cutting geometry for tote bags, bifold wallets, and watch straps. Designed with pre-marked pricking iron spacing (3.85mm & 4.0mm French irons), bevel margins, skiving thickness callouts, and hardware alignment coordinates.',
    category: 'cad_blueprints',
    price: 2100,
    compare_at_price: 2900,
    file_format: 'DXF',
    file_size_mb: 14.8,
    version: '1.5',
    software_compatibility: ['AutoCAD', 'Rhino 3D', 'LightBurn', 'Illustrator', 'Inkscape'],
    includes: [
      'Standard DXF 2018 Clean Vector Paths (Closed Polylines)',
      '1:1 Laser Cutting Acrylic Template Drawing (PDF & SVG)',
      'Pricking Hole Stitch Guide (3.85mm & 4.0mm Spacing)',
      'Step-by-Step Saddle Stitching & Edge Burnishing Manual',
      'Leather Temper & Thickness Specification Guide (3oz to 9oz)',
    ],
    max_downloads: 5,
    expiry_hours: 168,
    license_type: 'Personal Maker',
    cover_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    ],
    sample_download_name: 'STITCH-BD_Leather_Blueprint_DXF_LaserSuite.zip',
    sample_file_content: `DXF AC1027 STITCH BD LEATHERWORKS BLUEPRINT
LAYER 0: CUT_OUTER_BOUNDARIES (Red - Laser Cut)
LAYER 1: PRICKING_HOLE_LOCATIONS (Blue - Etch / Drill)
LAYER 2: SKIVING_ZONES_INDICATOR (Green - Reference Only)
Thickness Specs:
- Gusset: 1.8mm (4.5 oz)
- Main Body Panel: 2.4mm (6 oz)
- Carry Handles: 3.6mm (9 oz English Bridle)`,
    is_featured: false,
    is_active: true,
    sales_count: 76,
    downloads_count: 180,
    rating: 4.9,
    reviews_count: 15,
    created_at: '2025-02-10T16:00:00Z',
  },
  {
    id: 'dig-prod-005',
    title: 'Advanced Savile Row Floating Canvas Masterclass & Pattern Blueprint',
    slug: 'advanced-savile-row-floating-canvas-masterclass',
    summary:
      '4K video masterclass curriculum plus full drafting formulas for tailored chest pieces, hand-padded lapels, and shoulder construction.',
    description:
      'A deep dive into bespoke sartorial tailoring. Learn the craft of cutting, shaping with steam, and pad-stitching horsehair canvas, domette, and hair cloth. Includes accompanying PDF drafting formulas, pattern templates, and source directories for authentic heritage canvas suppliers.',
    category: 'masterclasses',
    price: 5500,
    compare_at_price: 7500,
    file_format: 'MP4',
    file_size_mb: 740.0,
    version: '2025 Masterclass Edition',
    software_compatibility: ['VLC Player', 'QuickTime', 'Any Modern Video Player', 'PDF Reader'],
    includes: [
      '4K High-Bitrate Master Video Stream & Offline Download Archive',
      '18-Page Accompanying Canvas Drafting Geometry Manual',
      'Supplier Rolodex for English & Italian Horsehair Canvas',
      'Lifetime Masterclass Certificate of Completion',
      'Direct Atelier Instructor Q&A Access Link',
    ],
    max_downloads: 3,
    expiry_hours: 72,
    license_type: 'Enterprise Studio',
    cover_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    sample_download_name: 'STITCH-BD_Masterclass_FloatingCanvas_Syllabus.zip',
    sample_file_content: `STITCH BD PRIVATE MASTERCLASS
Course: Savile Row Canvas Construction & Pad Stitching
Instructor: Master Tailor Marco Alessi
Runtime: 2h 45m (4K H.265 Master)
Accompanying PDF: Canvas_Formulas_2025.pdf
Notice: Streaming and personal offline download license authorized for verified buyer.`,
    is_featured: false,
    is_active: true,
    sales_count: 42,
    downloads_count: 65,
    rating: 5.0,
    reviews_count: 11,
    created_at: '2025-02-18T10:00:00Z',
  },
];

export const INITIAL_DIGITAL_ORDERS: DigitalOrder[] = [
  {
    id: 'dig-ord-8801',
    order_number: 'DIG-8801',
    customer_name: 'Naveed Rahman',
    customer_email: 'naveed.rahman@designlab.bd',
    customer_phone: '+880 1712-345678',
    items: [
      {
        id: 'doi-1',
        digital_product_id: 'dig-prod-001',
        title: 'Architectural Trench Coat Full Production Tech Pack',
        price: 3200,
        file_format: 'ZIP',
        license_type: 'Commercial Atelier',
        file_size_mb: 48.5,
      },
    ],
    subtotal: 3200,
    discount: 0,
    total: 3200,
    currency: 'BDT',
    payment_method: 'card',
    payment_status: 'paid',
    transaction_id: 'TXN-STRIPE-DIG-993847',
    token_ids: ['tok-8801-1'],
    created_at: '2025-03-01T10:15:00Z',
  },
  {
    id: 'dig-ord-8802',
    order_number: 'DIG-8802',
    customer_name: 'Farhana Hossain',
    customer_email: 'farhana.hossain@atelierguild.org',
    customer_phone: '+880 1819-876543',
    items: [
      {
        id: 'doi-2',
        digital_product_id: 'dig-prod-002',
        title: 'Double-Breasted Wool Overcoat Master Sewing Pattern',
        price: 1850,
        file_format: 'PDF',
        license_type: 'Personal Maker',
        file_size_mb: 22.1,
      },
    ],
    subtotal: 1850,
    discount: 0,
    total: 1850,
    currency: 'BDT',
    payment_method: 'bkash',
    payment_status: 'paid',
    transaction_id: 'BKASH-9A284F01',
    token_ids: ['tok-8802-1'],
    created_at: '2025-03-02T14:30:00Z',
  },
];

export const INITIAL_DOWNLOAD_TOKENS: DigitalDownloadToken[] = [
  {
    id: 'tok-8801-1',
    token: 'sbd_sec_8801_9f43b2a8d1c7',
    order_id: 'dig-ord-8801',
    order_number: 'DIG-8801',
    product_id: 'dig-prod-001',
    product_title: 'Architectural Trench Coat Full Production Tech Pack',
    file_format: 'ZIP',
    file_size_mb: 48.5,
    customer_email: 'naveed.rahman@designlab.bd',
    customer_name: 'Naveed Rahman',
    max_downloads: 3,
    downloaded_count: 1,
    expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    is_revoked: false,
    created_at: '2025-03-01T10:15:00Z',
    last_downloaded_at: '2025-03-01T10:30:00Z',
    download_logs: [
      {
        id: 'log-1',
        downloaded_at: '2025-03-01T10:30:00Z',
        ip_address: '103.205.71.12',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    ],
  },
  {
    id: 'tok-8802-1',
    token: 'sbd_sec_8802_3b17c9e54a20',
    order_id: 'dig-ord-8802',
    order_number: 'DIG-8802',
    product_id: 'dig-prod-002',
    product_title: 'Double-Breasted Wool Overcoat Master Sewing Pattern',
    file_format: 'PDF',
    file_size_mb: 22.1,
    customer_email: 'farhana.hossain@atelierguild.org',
    customer_name: 'Farhana Hossain',
    max_downloads: 4,
    downloaded_count: 2,
    expires_at: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    is_revoked: false,
    created_at: '2025-03-02T14:30:00Z',
    last_downloaded_at: '2025-03-02T16:00:00Z',
    download_logs: [
      {
        id: 'log-2',
        downloaded_at: '2025-03-02T14:40:00Z',
        ip_address: '103.14.88.45',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        id: 'log-3',
        downloaded_at: '2025-03-02T16:00:00Z',
        ip_address: '103.14.88.45',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    ],
  },
];

export const INITIAL_EMAIL_DISPATCHES: DigitalEmailDispatch[] = [
  {
    id: 'email-8801',
    order_id: 'dig-ord-8801',
    order_number: 'DIG-8801',
    recipient_email: 'naveed.rahman@designlab.bd',
    recipient_name: 'Naveed Rahman',
    subject: 'Your STITCH BD Digital Asset Delivery — Order DIG-8801',
    sent_at: '2025-03-01T10:15:30Z',
    token_links: [
      {
        product_title: 'Architectural Trench Coat Full Production Tech Pack',
        token: 'sbd_sec_8801_9f43b2a8d1c7',
        download_url: '/digital/download/sbd_sec_8801_9f43b2a8d1c7',
        expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        max_downloads: 3,
      },
    ],
    is_opened: true,
  },
  {
    id: 'email-8802',
    order_id: 'dig-ord-8802',
    order_number: 'DIG-8802',
    recipient_email: 'farhana.hossain@atelierguild.org',
    recipient_name: 'Farhana Hossain',
    subject: 'Your STITCH BD Digital Asset Delivery — Order DIG-8802',
    sent_at: '2025-03-02T14:30:25Z',
    token_links: [
      {
        product_title: 'Double-Breasted Wool Overcoat Master Sewing Pattern',
        token: 'sbd_sec_8802_3b17c9e54a20',
        download_url: '/digital/download/sbd_sec_8802_3b17c9e54a20',
        expires_at: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
        max_downloads: 4,
      },
    ],
    is_opened: true,
  },
];

export class DigitalDatabaseStore {
  private products: DigitalProduct[] = [...INITIAL_DIGITAL_PRODUCTS];
  private orders: DigitalOrder[] = [...INITIAL_DIGITAL_ORDERS];
  private tokens: DigitalDownloadToken[] = [...INITIAL_DOWNLOAD_TOKENS];
  private emails: DigitalEmailDispatch[] = [...INITIAL_EMAIL_DISPATCHES];

  // ---------------- PRODUCTS ----------------
  getProducts(): DigitalProduct[] {
    return this.products;
  }

  getActiveProducts(): DigitalProduct[] {
    return this.products.filter((p) => p.is_active);
  }

  getProductBySlug(slug: string): DigitalProduct | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  getProductById(id: string): DigitalProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(data: Omit<DigitalProduct, 'id' | 'sales_count' | 'downloads_count' | 'rating' | 'reviews_count' | 'created_at'>): DigitalProduct {
    const id = `dig-prod-${Date.now()}`;
    const newProduct: DigitalProduct = {
      ...data,
      id,
      sales_count: 0,
      downloads_count: 0,
      rating: 5.0,
      reviews_count: 0,
      created_at: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, data: Partial<DigitalProduct>): DigitalProduct | undefined {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.products[idx] = { ...this.products[idx], ...data };
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initLen;
  }

  // ---------------- ORDERS & PREPAID CHECKOUT ----------------
  getOrders(): DigitalOrder[] {
    return this.orders;
  }

  getOrderById(id: string): DigitalOrder | undefined {
    return this.orders.find((o) => o.id === id || o.order_number === id);
  }

  /**
   * Strictly creates a PREPAID digital order.
   * Generates secure download tokens with expiration and download limits,
   * creates an email dispatch record, and updates product download/sales counts.
   */
  createPrepaidOrder(params: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    items: DigitalOrderItem[];
    payment_method: DigitalPaymentMethod;
    transaction_id: string;
    discount?: number;
  }): { order: DigitalOrder; tokens: DigitalDownloadToken[]; emailDispatch: DigitalEmailDispatch } {
    const orderNumber = `DIG-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `dig-ord-${Date.now()}`;
    const subtotal = params.items.reduce((sum, it) => sum + it.price, 0);
    const discount = params.discount || 0;
    const total = Math.max(0, subtotal - discount);

    const generatedTokens: DigitalDownloadToken[] = [];

    // Generate tokens for each item
    for (const item of params.items) {
      const product = this.getProductById(item.digital_product_id);
      const expiryHours = product?.expiry_hours || 72;
      const maxDownloads = product?.max_downloads || 3;
      const secureRandomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      const tokenString = `sbd_sec_${orderNumber.toLowerCase()}_${secureRandomHex}`;

      const tokenObj: DigitalDownloadToken = {
        id: `tok-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        token: tokenString,
        order_id: orderId,
        order_number: orderNumber,
        product_id: item.digital_product_id,
        product_title: item.title,
        file_format: item.file_format,
        file_size_mb: item.file_size_mb,
        customer_email: params.customer_email,
        customer_name: params.customer_name,
        max_downloads: maxDownloads,
        downloaded_count: 0,
        expires_at: new Date(Date.now() + expiryHours * 3600 * 1000).toISOString(),
        is_revoked: false,
        created_at: new Date().toISOString(),
        download_logs: [],
      };

      this.tokens.unshift(tokenObj);
      generatedTokens.push(tokenObj);

      // Increment product stats
      if (product) {
        product.sales_count += 1;
      }
    }

    const order: DigitalOrder = {
      id: orderId,
      order_number: orderNumber,
      customer_name: params.customer_name,
      customer_email: params.customer_email,
      customer_phone: params.customer_phone,
      items: params.items,
      subtotal,
      discount,
      total,
      currency: 'BDT',
      payment_method: params.payment_method,
      payment_status: 'paid',
      transaction_id: params.transaction_id,
      token_ids: generatedTokens.map((t) => t.id),
      created_at: new Date().toISOString(),
    };

    this.orders.unshift(order);

    // Create Email Dispatch Record
    const emailDispatch: DigitalEmailDispatch = {
      id: `email-${Date.now()}`,
      order_id: orderId,
      order_number: orderNumber,
      recipient_email: params.customer_email,
      recipient_name: params.customer_name,
      subject: `Your STITCH BD Digital Asset Delivery — Order ${orderNumber}`,
      sent_at: new Date().toISOString(),
      token_links: generatedTokens.map((t) => ({
        product_title: t.product_title,
        token: t.token,
        download_url: `/digital/download/${t.token}`,
        expires_at: t.expires_at,
        max_downloads: t.max_downloads,
      })),
      is_opened: false,
    };

    this.emails.unshift(emailDispatch);

    return { order, tokens: generatedTokens, emailDispatch };
  }

  // ---------------- DOWNLOAD TOKENS & VERIFICATION ----------------
  getTokens(): DigitalDownloadToken[] {
    return this.tokens;
  }

  getTokenByString(tokenString: string): DigitalDownloadToken | undefined {
    return this.tokens.find((t) => t.token === tokenString);
  }

  getTokensByOrderId(orderId: string): DigitalDownloadToken[] {
    return this.tokens.filter((t) => t.order_id === orderId || t.order_number === orderId);
  }

  /**
   * Verifies if token is active, not revoked, not expired, and under usage limits.
   * If valid and simulateDownload is true, increments downloaded_count and appends log.
   */
  verifyAndConsumeToken(
    tokenString: string,
    simulateDownload = false,
    clientInfo?: { ip?: string; ua?: string }
  ): {
    valid: boolean;
    reason?: 'NOT_FOUND' | 'REVOKED' | 'EXPIRED' | 'LIMIT_REACHED';
    token?: DigitalDownloadToken;
    product?: DigitalProduct;
    fileContent?: string;
    filename?: string;
  } {
    const token = this.getTokenByString(tokenString);
    if (!token) {
      return { valid: false, reason: 'NOT_FOUND' };
    }

    if (token.is_revoked) {
      return { valid: false, reason: 'REVOKED', token };
    }

    const now = new Date().getTime();
    const expiry = new Date(token.expires_at).getTime();
    if (now > expiry) {
      return { valid: false, reason: 'EXPIRED', token };
    }

    if (token.downloaded_count >= token.max_downloads) {
      return { valid: false, reason: 'LIMIT_REACHED', token };
    }

    const product = this.getProductById(token.product_id);

    if (simulateDownload) {
      token.downloaded_count += 1;
      token.last_downloaded_at = new Date().toISOString();
      token.download_logs.unshift({
        id: `log-${Date.now()}`,
        downloaded_at: new Date().toISOString(),
        ip_address: clientInfo?.ip || '127.0.0.1 (Verified Client)',
        user_agent: clientInfo?.ua || 'Direct Browser Download Stream',
      });

      if (product) {
        product.downloads_count += 1;
      }
    }

    return {
      valid: true,
      token,
      product,
      fileContent: product?.sample_file_content || 'STITCH BD SECURE DIGITAL ASSET',
      filename: product?.sample_download_name || `${token.product_title.replace(/\s+/g, '_')}.${token.file_format.toLowerCase()}`,
    };
  }

  extendTokenExpiry(tokenId: string, additionalHours = 48): boolean {
    const token = this.tokens.find((t) => t.id === tokenId || t.token === tokenId);
    if (!token) return false;
    const currentExpiry = new Date(token.expires_at).getTime();
    const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
    token.expires_at = new Date(baseTime + additionalHours * 3600 * 1000).toISOString();
    return true;
  }

  incrementTokenMaxDownloads(tokenId: string, additionalCount = 3): boolean {
    const token = this.tokens.find((t) => t.id === tokenId || t.token === tokenId);
    if (!token) return false;
    token.max_downloads += additionalCount;
    return true;
  }

  revokeToken(tokenId: string): boolean {
    const token = this.tokens.find((t) => t.id === tokenId || t.token === tokenId);
    if (!token) return false;
    token.is_revoked = true;
    return true;
  }

  unrevokeToken(tokenId: string): boolean {
    const token = this.tokens.find((t) => t.id === tokenId || t.token === tokenId);
    if (!token) return false;
    token.is_revoked = false;
    return true;
  }

  // ---------------- EMAILS ----------------
  getEmailDispatches(): DigitalEmailDispatch[] {
    return this.emails;
  }

  getEmailByOrderId(orderId: string): DigitalEmailDispatch | undefined {
    return this.emails.find((e) => e.order_id === orderId || e.order_number === orderId);
  }

  resendEmail(orderId: string): DigitalEmailDispatch | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;
    const tokens = this.getTokensByOrderId(order.id);

    const email: DigitalEmailDispatch = {
      id: `email-${Date.now()}`,
      order_id: order.id,
      order_number: order.order_number,
      recipient_email: order.customer_email,
      recipient_name: order.customer_name,
      subject: `[Re-Sent] Your STITCH BD Digital Asset Delivery — Order ${order.order_number}`,
      sent_at: new Date().toISOString(),
      token_links: tokens.map((t) => ({
        product_title: t.product_title,
        token: t.token,
        download_url: `/digital/download/${t.token}`,
        expires_at: t.expires_at,
        max_downloads: t.max_downloads,
      })),
      is_opened: false,
    };
    this.emails.unshift(email);
    return email;
  }

  // ---------------- KPIS & METRICS ----------------
  getKPIs(): DigitalStatsKPI {
    const total_revenue = this.orders.reduce((sum, o) => sum + o.total, 0);
    const total_orders = this.orders.length;
    const active_downloads = this.tokens.filter(
      (t) => !t.is_revoked && new Date(t.expires_at).getTime() > Date.now() && t.downloaded_count < t.max_downloads
    ).length;
    const downloads_served = this.tokens.reduce((sum, t) => sum + t.downloaded_count, 0);
    const avg_order_value = total_orders > 0 ? Math.round(total_revenue / total_orders) : 0;

    return {
      total_revenue,
      total_orders,
      active_downloads,
      downloads_served,
      avg_order_value,
    };
  }
}

declare global {
  var __stitchbd_digital_db__: DigitalDatabaseStore | undefined;
}

export const digitalDb: DigitalDatabaseStore =
  globalThis.__stitchbd_digital_db__ ?? new DigitalDatabaseStore();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__stitchbd_digital_db__ = digitalDb;
}

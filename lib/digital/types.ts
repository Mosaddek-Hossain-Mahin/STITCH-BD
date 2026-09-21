export type DigitalCategory =
  | 'sewing_patterns'
  | 'tech_packs'
  | 'cad_blueprints'
  | 'garment_3d'
  | 'masterclasses';

export type DigitalFileFormat = 'PDF' | 'ZIP' | 'DXF' | 'CLO3D' | 'AI' | 'MP4';

export type DigitalLicenseType =
  | 'Personal Maker'
  | 'Commercial Atelier'
  | 'Enterprise Studio';

export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: DigitalCategory;
  price: number;
  compare_at_price?: number;
  file_format: DigitalFileFormat;
  file_size_mb: number;
  version: string;
  software_compatibility: string[];
  includes: string[];
  max_downloads: number;
  expiry_hours: number;
  license_type: DigitalLicenseType;
  cover_image: string;
  preview_images: string[];
  sample_download_name: string;
  sample_file_content: string; // Simulated file payload for direct browser download
  is_featured: boolean;
  is_active: boolean;
  sales_count: number;
  downloads_count: number;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export type DigitalPaymentMethod = 'card' | 'bkash' | 'nagad' | 'bank_transfer';

export interface DigitalOrderItem {
  id: string;
  digital_product_id: string;
  title: string;
  price: number;
  file_format: DigitalFileFormat;
  license_type: DigitalLicenseType;
  file_size_mb: number;
}

export interface DigitalOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: DigitalOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: DigitalPaymentMethod;
  payment_status: 'paid' | 'refunded';
  transaction_id: string;
  token_ids: string[];
  created_at: string;
}

export interface DigitalDownloadLog {
  id: string;
  downloaded_at: string;
  ip_address: string;
  user_agent: string;
}

export interface DigitalDownloadToken {
  id: string;
  token: string;
  order_id: string;
  order_number: string;
  product_id: string;
  product_title: string;
  file_format: DigitalFileFormat;
  file_size_mb: number;
  customer_email: string;
  customer_name: string;
  max_downloads: number;
  downloaded_count: number;
  expires_at: string; // ISO date string
  is_revoked: boolean;
  created_at: string;
  last_downloaded_at?: string;
  download_logs: DigitalDownloadLog[];
}

export interface DigitalEmailDispatch {
  id: string;
  order_id: string;
  order_number: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  sent_at: string;
  token_links: {
    product_title: string;
    token: string;
    download_url: string;
    expires_at: string;
    max_downloads: number;
  }[];
  is_opened: boolean;
}

export interface DigitalStatsKPI {
  total_revenue: number;
  total_orders: number;
  active_downloads: number;
  downloads_served: number;
  avg_order_value: number;
}

import { createClient } from "./server";
import { db } from "../db/store";
import { Product, Order, Category } from "../types";

/**
 * dbService acts as the primary data interface.
 * If Supabase environment variables are present and client connects, it queries PostgreSQL.
 * Otherwise, it transparently falls back to the in-memory database store (db).
 */
export const dbService = {
  async getProducts(): Promise<Product[]> {
    const supabase = await createClient();
    if (!supabase) return db.getProducts();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_variants(*)");

    if (error || !data || data.length === 0) {
      return db.getProducts();
    }

    return data.map((item: any) => ({
      ...item,
      base_price: Number(item.base_price || item.price || 0),
      images: item.product_images || [],
      variants: item.product_variants || [],
      compare_at_price: item.compare_at_price
        ? Number(item.compare_at_price)
        : undefined,
    })) as Product[];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createClient();
    if (!supabase) return db.getProductBySlug(slug) || null;

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_variants(*)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return db.getProductBySlug(slug) || null;
    }

    return {
      ...data,
      base_price: Number(data.base_price || data.price || 0),
      images: data.product_images || [],
      variants: data.product_variants || [],
      compare_at_price: data.compare_at_price
        ? Number(data.compare_at_price)
        : undefined,
    } as Product;
  },

  async getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    if (!supabase) return db.getCategories();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return db.getCategories();
    }

    return data as Category[];
  },

  async getOrders(userId?: string): Promise<Order[]> {
    const supabase = await createClient();
    if (!supabase) {
      return userId
        ? db.getOrders().filter((o) => o.user_id === userId)
        : db.getOrders();
    }

    let query = supabase.from("orders").select("*, order_items(*)");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error || !data || data.length === 0) {
      return userId
        ? db.getOrders().filter((o) => o.user_id === userId)
        : db.getOrders();
    }

    return data.map((o: any) => ({
      ...o,
      subtotal: Number(o.subtotal || 0),
      total: Number(o.total || 0),
      discount_total: Number(o.discount_total || 0),
      shipping_total: Number(o.shipping_total || 0),
      tax_total: Number(o.tax_total || 0),
      items: (o.order_items || []).map((i: any) => ({
        ...i,
        unit_price: Number(i.unit_price || i.price || 0),
      })),
    })) as Order[];
  },

  async getOrderById(id: string): Promise<Order | null> {
    const supabase = await createClient();
    if (!supabase) return db.getOrderById(id) || null;

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .or(`id.eq.${id},order_number.eq.${id}`)
      .single();

    if (error || !data) {
      return db.getOrderById(id) || null;
    }

    return {
      ...data,
      subtotal: Number(data.subtotal || 0),
      total: Number(data.total || 0),
      discount_total: Number(data.discount_total || 0),
      shipping_total: Number(data.shipping_total || 0),
      tax_total: Number(data.tax_total || 0),
      items: (data.order_items || []).map((i: any) => ({
        ...i,
        unit_price: Number(i.unit_price || i.price || 0),
      })),
    } as Order;
  },
};

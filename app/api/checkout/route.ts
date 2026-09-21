import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/store";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Cart cannot be empty"),
  shippingAddress: z.object({
    line1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().min(1),
  }),
  shippingMethod: z.string().min(1),
  paymentMethod: z.enum(["cod", "credit_card", "stripe"]).default("cod"),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = checkoutSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid checkout payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      items,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      couponCode,
      customerNotes,
      customerEmail,
      customerName,
    } = parseResult.data;

    const supabase = await createClient();
    let user = null;
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    // SERVER-AUTHORITATIVE PRICE CALCULATION
    let subtotal = 0;
    const verifiedOrderItems: any[] = [];

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 },
        );
      }

      let price = product.base_price;
      let sku = product.sku;

      if (item.variantId) {
        const variant = product.variants?.find((v) => v.id === item.variantId);
        if (variant) {
          price = variant.price;
          sku = variant.sku;
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      verifiedOrderItems.push({
        product_id: product.id,
        variant_id: item.variantId,
        product_name: product.name,
        variant_sku: sku,
        quantity: item.quantity,
        unit_price: price,
        image_url: product.images?.[0]?.url || "",
      });
    }

    // Server-calculated shipping
    let shipping = 15;
    if (shippingMethod === "express") shipping = 35;
    if (subtotal >= 300) shipping = 0;

    // Server-calculated discount
    let discount = 0;
    if (couponCode) {
      const coupon = db
        .getCoupons()
        .find(
          (c) =>
            c.code.toUpperCase() === couponCode.toUpperCase() && c.is_active,
        );
      if (coupon) {
        if (coupon.type === "percentage") {
          discount = (subtotal * coupon.value) / 100;
        } else {
          discount = coupon.value;
        }
      }
    }

    const tax = Math.round((subtotal - discount) * 0.0725 * 100) / 100;
    const total = Math.max(0, subtotal - discount + shipping + tax);

    // Save order
    const newOrder = db.createOrder({
      user_id: user ? user.id : undefined,
      customer_email: customerEmail || user?.email || "guest@stitchbd.com",
      customer_name: customerName || "STITCH BD Client",
      status: "processing",
      payment_method: paymentMethod,
      payment_status: paymentMethod === "cod" ? "pending" : "paid",
      shipping_method: shippingMethod,
      notes: customerNotes,
      subtotal,
      discount_total: discount,
      shipping_total: shipping,
      tax_total: tax,
      total,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      items: verifiedOrderItems,
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      total: newOrder.total,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error processing order" },
      { status: 500 },
    );
  }
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Truck,
  CheckCircle2,
  ArrowRight,
  User,
  MapPin,
  Sparkles,
  Banknote,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { db } from '@/lib/db/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTaxAmount,
    getTotal,
    coupon,
    shippingMethod,
    setShippingMethod,
    clearCart,
  } = useCartStore();

  const { user, addresses } = useAuthStore();

  // Form State
  const [email, setEmail] = useState(user ? 'elena.rostova@stitchbd.com' : '');
  const [phone, setPhone] = useState('+880 1711-234567');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.is_default)?.id || addresses[0]?.id || 'custom'
  );

  // Address fields
  const [fullName, setFullName] = useState(user?.full_name || 'Sophia Chen');
  const [line1, setLine1] = useState('House 42, Road 11, Block D');
  const [line2, setLine2] = useState('Banani');
  const [city, setCity] = useState('Dhaka');
  const [state, setState] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('1213');
  const [country, setCountry] = useState('BD');

  // Payment method selection ('cod' = Cash on Delivery, 'card' = Card)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  // Payment fields (for card payment)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const tax = getTaxAmount();
  const total = getTotal();

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setLine1(addr.line1);
      setLine2(addr.line2 || '');
      setCity(addr.city);
      setState(addr.state);
      setPostalCode(addr.postal_code);
      setCountry(addr.country);
    }
  };

  const handleTestCardFill = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12/28');
    setCardCvc('883');
    toast.success('Filled with Stripe Test Card credentials');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/products');
      return;
    }

    if (!email || !line1 || !city || !state || !postalCode) {
      toast.error('Please complete all required shipping fields');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExp.trim() || !cardCvc.trim()) {
        toast.error('Please enter complete credit or debit card details');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create Order in DB
      const shippingAddressData = {
        line1,
        line2,
        city,
        state,
        postal_code: postalCode,
        country,
      };

      const orderItemsData = items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.variant.price,
        product_name: item.product.name,
        variant_sku: item.variant.sku,
        image_url: item.product.image_url,
      }));

      const newOrder = db.createOrder({
        user_id: user?.id,
        customer_email: email,
        customer_name: fullName.trim() || 'STITCH BD Client',
        customer_phone: phone,
        shipping_method: shippingMethod === 'express' ? 'Complimentary Priority Courier' : 'Complimentary White Glove Delivery',
        status: 'processing',
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        shipping_status: 'pending',
        currency: 'bdt',
        notes: paymentMethod === 'cod'
          ? `[Payment: Cash on Delivery] Collect ৳${total.toFixed(2)} cash from patron upon parcel handover.`
          : 'Payment settled via verified card transaction.',
        subtotal,
        total,
        discount_total: discount,
        shipping_total: shipping,
        tax_total: tax,
        discount_amount: discount,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        shipping_address: shippingAddressData,
        billing_address: shippingAddressData,
        items: orderItemsData,
      });

      // Clear cart
      clearCart();

      toast.success(
        paymentMethod === 'cod'
          ? `Order ${newOrder.order_number} placed! Pay with cash upon delivery.`
          : `Order ${newOrder.order_number} confirmed!`
      );

      // Route to confirmation receipt
      router.push(`/order/${newOrder.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing order';
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <header className="border-b border-stone-200 bg-white py-4 px-6 text-center">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">STITCH BD</Link>
        </header>
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <Link href="/products">
            <Button>Return to Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Secure Checkout Header */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 bg-stone-900 text-stone-50 rounded flex items-center justify-center font-serif text-base font-bold">
              S
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-stone-900">
              STITCH BD
            </span>
          </Link>

          <div className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Encrypted 256-Bit SSL Checkout</span>
          </div>

          <Link
            href="/cart"
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 underline"
          >
            Back to Bag
          </Link>
        </div>
      </header>

      {/* Main Checkout Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Checkout Steps Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-serif text-base font-bold text-stone-950">
                    Contact Information
                  </h3>
                </div>
                {user && (
                  <span className="text-xs text-stone-400 font-medium">
                    Signed in as {user.full_name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address for Dispatch Notices"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
                <Input
                  label="Mobile Phone for Freight SMS"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-serif text-base font-bold text-stone-950">
                    Destination Address
                  </h3>
                </div>
              </div>

              {/* Saved Addresses quick select */}
              {addresses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Select From Saved Addresses
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id || addr.line1}
                        type="button"
                        onClick={() => handleAddressSelect(addr.id || '')}
                        className={`p-3 text-left rounded-lg border text-xs transition-colors ${
                          selectedAddressId === addr.id
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 font-medium'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <p className="font-bold text-stone-900">{addr.label || 'Address'}</p>
                        <p className="text-stone-600">{addr.line1} {addr.line2}</p>
                        <p className="text-stone-500">{addr.city}, {addr.state} {addr.postal_code}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Form */}
              <div className="space-y-4 pt-2">
                <Input
                  label="Recipient Full Legal Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                  label="Street Address"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="e.g. 482 Broome Street"
                />

                <Input
                  label="Apartment, Suite, Unit (Optional)"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="e.g. Suite 4B"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    label="State / Province"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <Input
                    label="Postal Code"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Freight Method */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
                <div className="h-6 w-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="font-serif text-base font-bold text-stone-950">
                  Shipping Method
                </h3>
              </div>

              <div className="space-y-2">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-3.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    shippingMethod === 'standard'
                      ? 'border-stone-900 bg-stone-50 font-semibold'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="checkout-shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-stone-900"
                    />
                    <div>
                      <p className="font-bold text-stone-900">Complimentary Insured Ground</p>
                      <p className="text-[11px] text-stone-500">Delivered within 2-4 business days across Bangladesh</p>
                    </div>
                  </div>
                  <span className="font-bold">{subtotal >= 1500 ? 'FREE' : '৳120.00'}</span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-center justify-between p-3.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    shippingMethod === 'express'
                      ? 'border-stone-900 bg-stone-50 font-semibold'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="checkout-shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-stone-900"
                    />
                    <div>
                      <p className="font-bold text-stone-900">Priority Same-Day / Next-Day Courier</p>
                      <p className="text-[11px] text-stone-500">Fast delivery with direct phone dispatch verification</p>
                    </div>
                  </div>
                  <span className="font-bold">৳250.00</span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment Method (Cash on Delivery vs Card) */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </div>
                  <h3 className="font-serif text-base font-bold text-stone-950">
                    Payment Method
                  </h3>
                </div>
                {paymentMethod === 'card' && (
                  <button
                    type="button"
                    onClick={handleTestCardFill}
                    className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded border border-amber-200 font-semibold transition-colors"
                  >
                    ⚡ Use Test Card
                  </button>
                )}
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    paymentMethod === 'cod'
                      ? 'border-stone-950 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Banknote className={`h-4 w-4 ${paymentMethod === 'cod' ? 'text-amber-400' : 'text-stone-700'}`} />
                      <span className="font-bold text-xs">Cash on Delivery (COD)</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      paymentMethod === 'cod' ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Popular in BD
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${paymentMethod === 'cod' ? 'text-stone-300' : 'text-stone-500'}`}>
                    Pay in cash (BDT) directly to the delivery rider upon arrival at your doorstep.
                  </p>
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    paymentMethod === 'card'
                      ? 'border-stone-950 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className={`h-4 w-4 ${paymentMethod === 'card' ? 'text-amber-400' : 'text-stone-700'}`} />
                      <span className="font-bold text-xs">Credit / Debit Card</span>
                    </div>
                    <div className="flex space-x-1 text-[9px] font-bold">
                      <span className={paymentMethod === 'card' ? 'text-stone-300' : 'text-stone-400'}>VISA</span>
                      <span className={paymentMethod === 'card' ? 'text-stone-300' : 'text-stone-400'}>MC</span>
                    </div>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${paymentMethod === 'card' ? 'text-stone-300' : 'text-stone-500'}`}>
                    Instant encrypted payment via Visa, Mastercard, or American Express.
                  </p>
                </label>
              </div>

              {/* COD Explanatory Notice */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                    <Truck className="h-4 w-4 text-amber-700" />
                    <span>Doorstep Cash Collection Details</span>
                  </div>
                  <ul className="text-xs text-amber-900/90 space-y-1 pl-5 list-disc">
                    <li>Total payable upon handover: <strong className="font-bold text-amber-950">৳{total.toFixed(2)} BDT</strong></li>
                    <li>Please keep exact cash ready for the delivery courier.</li>
                    <li>You will receive an official STITCH BD printed bill and SMS verification upon delivery.</li>
                    <li>No advance online deposit or banking transaction required.</li>
                  </ul>
                </div>
              )}

              {/* Card Inputs if Card chosen */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <Input
                    label="Card Number"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiration Date (MM/YY)"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="12/28"
                    />
                    <Input
                      label="Security Code (CVC)"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="883"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Summary Column (5 cols on lg) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-5">
              <h3 className="font-serif text-lg font-bold text-stone-950 border-b border-stone-100 pb-3">
                Order Review ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              {/* Items List in review */}
              <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex space-x-3 items-center first:pt-0 last:pb-0">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                      <SafeImage
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {item.variant.option_values.size || item.variant.option_values.color || 'Standard'} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      ৳{(item.variant.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price calculation summary */}
              <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">৳{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Voucher Applied ({coupon?.code})</span>
                    <span>-৳{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Insured Freight</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `৳${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Estimated Sales Tax (7.25%)</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-stone-200 pt-3 flex justify-between text-lg font-bold text-stone-950">
                  <span>Total Amount Due</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full h-13 text-sm font-bold uppercase tracking-wider shadow-lg bg-stone-900 hover:bg-stone-800 text-stone-50"
              >
                {paymentMethod === 'cod' ? (
                  <>
                    <span>Confirm Order (Cash on Delivery) • ৳{total.toFixed(2)}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Authorize & Place Order • ৳{total.toFixed(2)}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="space-y-2 pt-2 text-[11px] text-stone-400 text-center">
                <div className="flex items-center justify-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-stone-600">30-Day Guaranteed Returns & Exchanges</span>
                </div>
                <p>
                  By placing your order, you agree to STITCH BD&apos;s Terms of Sale and Privacy Charter.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

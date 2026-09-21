'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDigitalCartStore } from '@/lib/digital/cart-store';
import { digitalDb } from '@/lib/digital/db';
import { DigitalPaymentMethod, DigitalOrder, DigitalDownloadToken, DigitalEmailDispatch } from '@/lib/digital/types';
import { DigitalEmailModal } from '@/components/digital/digital-email-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck,
  Zap,
  Mail,
  Download,
  CreditCard,
  Clock,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Lock,
  FileCheck,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DigitalCheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getSubtotal, clearCart, promoCode, appliedDiscount } = useDigitalCartStore();

  const [customerName, setCustomerName] = useState('Elena Rostova');
  const [customerEmail, setCustomerEmail] = useState('elena.rostova@designlab.bd');
  const [customerPhone, setCustomerPhone] = useState('+880 1712-889900');
  const [paymentMethod, setPaymentMethod] = useState<DigitalPaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Success State
  const [completedOrder, setCompletedOrder] = useState<DigitalOrder | null>(null);
  const [generatedTokens, setGeneratedTokens] = useState<DigitalDownloadToken[]>([]);
  const [dispatchedEmail, setDispatchedEmail] = useState<DigitalEmailDispatch | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      toast.error('A valid delivery email address is required for digital file dispatch');
      return;
    }

    if (items.length === 0) {
      toast.error('Your digital cart has no items to acquire');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Simulate real gateway transaction ID
      const txnPrefix =
        paymentMethod === 'bkash'
          ? 'BKASH'
          : paymentMethod === 'nagad'
          ? 'NAGAD'
          : paymentMethod === 'bank_transfer'
          ? 'WIRE'
          : 'TXN-CARD';
      const txnId = `${txnPrefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const { order, tokens, emailDispatch } = digitalDb.createPrepaidOrder({
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        items,
        payment_method: paymentMethod,
        transaction_id: txnId,
        discount: appliedDiscount,
      });

      setCompletedOrder(order);
      setGeneratedTokens(tokens);
      setDispatchedEmail(emailDispatch);
      clearCart();
      setIsProcessing(false);
      toast.success(`Payment verified! Digital package dispatched to ${customerEmail}`);
    }, 900);
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
        <DigitalEmailModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          emailDispatch={dispatchedEmail}
        />

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Top Success Banner */}
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6 text-center">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Prepaid Payment Confirmed • Instant Dispatch Active
              </span>
              <h1 className="font-serif text-3xl font-bold text-stone-950">
                Your Digital Assets Are Ready
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
                Order <strong className="text-stone-900">#{completedOrder.order_number}</strong> has been cleared. Cryptographically signed tokens have been dispatched to{' '}
                <strong className="text-stone-900">{completedOrder.customer_email}</strong>.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setEmailModalOpen(true)}
              >
                <Mail className="h-3.5 w-3.5 mr-1.5 text-stone-600" />
                Inspect Dispatched Email
              </Button>

              <Link
                href="/digital"
                className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'text-xs')}
              >
                Browse More Assets
              </Link>
            </div>
          </div>

          {/* Generated Tokens & Download Terminals */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-950">
                  Direct Download Access Tokens
                </h2>
                <p className="text-xs text-stone-500">
                  Each token is unique and subject to your licensed expiration window and download limits.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">
                TXN: {completedOrder.transaction_id}
              </span>
            </div>

            <div className="space-y-4">
              {generatedTokens.map((tok) => (
                <div
                  key={tok.id}
                  className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 hover:border-stone-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-bold mr-2">
                        {tok.file_format} • {tok.file_size_mb} MB
                      </span>
                      <h3 className="font-serif font-bold text-base text-stone-950 inline">
                        {tok.product_title}
                      </h3>
                    </div>

                    <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-medium flex items-center shrink-0">
                      <Clock className="h-3 w-3 mr-1 text-amber-600" />
                      Expires: {new Date(tok.expires_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                    <span className="flex items-center">
                      <Download className="h-3.5 w-3.5 mr-1 text-stone-400" />
                      Usage: <strong>{tok.downloaded_count} of {tok.max_downloads}</strong> downloads used
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-stone-400 truncate max-w-xs">
                      Token: {tok.token}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/digital/download/${tok.token}`}
                      className={cn(buttonVariants({ size: 'sm' }), 'text-xs flex-1 justify-center')}
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Open Download Terminal
                    </Link>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        const url = `${window.location.origin}/digital/download/${tok.token}`;
                        navigator.clipboard.writeText(url);
                        toast.success('Download portal URL copied');
                      }}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1 text-amber-700" />
                Customer Download Reminder
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Save downloaded archives to safe, backed-up storage. Once the {completedOrder.items.length > 0 ? '72h–168h' : 'allotted'} validity window expires or download caps are reached, re-authorization by studio administrators will be required.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 max-w-md space-y-5 shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Download className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              No Digital Items in Cart
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Explore our tech packs, Savile Row sewing patterns, and 3D simulation archives to acquire assets.
            </p>
          </div>
          <Link
            href="/digital"
            className={cn(buttonVariants({ size: 'sm' }), 'text-xs')}
          >
            Browse Digital Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-stone-500">
          <Link href="/digital" className="hover:text-stone-900 flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Digital Studio
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Prepaid Digital Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Prepaid Gateways */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Recipient & Delivery Email */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-stone-700" />
                    <h3 className="font-serif text-base font-bold text-stone-950">
                      Asset Delivery Email
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Instant Dispatch
                  </span>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Licensee Full Name"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                  />

                  <Input
                    label="Delivery Email (Where Signed Links Are Sent)"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@organization.com"
                  />

                  <Input
                    label="Contact Telephone (Optional for SMS receipt)"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                  />

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Double-check your email address. All cryptographic tokens, download access keys, and commercial license certificates will be transmitted immediately to this address.
                  </p>
                </div>
              </div>

              {/* Payment Method - PREPAID ONLY */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-stone-700" />
                    <h3 className="font-serif text-base font-bold text-stone-950">
                      Prepaid Payment Method
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    256-Bit SSL Encrypted
                  </span>
                </div>

                {/* Explicit Notice: Cash on Delivery Disabled */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 flex items-start space-x-2.5">
                  <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-stone-900">Prepaid Policy:</strong> Because digital software, CAD blueprints, and sewing patterns are delivered instantly upon receipt, <em>Cash on Delivery (COD) is strictly unavailable</em>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* bKash */}
                  <label
                    className={`cursor-pointer rounded-xl p-4 border flex flex-col justify-between space-y-2 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-600 bg-pink-50/50 ring-1 ring-pink-600 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="bkash"
                          checked={paymentMethod === 'bkash'}
                          onChange={() => setPaymentMethod('bkash')}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-xs font-bold text-pink-700">bKash Instant</span>
                      </div>
                      <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded font-mono">
                        Instant
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Mobile Financial Services via QR / OTP
                    </span>
                  </label>

                  {/* Card */}
                  <label
                    className={`cursor-pointer rounded-xl p-4 border flex flex-col justify-between space-y-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-stone-900 focus:ring-stone-900"
                        />
                        <span className="text-xs font-bold text-stone-900">Credit / Debit Card</span>
                      </div>
                      <CreditCard className="h-4 w-4 text-stone-500" />
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Visa, MasterCard, Amex, UnionPay
                    </span>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`cursor-pointer rounded-xl p-4 border flex flex-col justify-between space-y-2 transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="nagad"
                          checked={paymentMethod === 'nagad'}
                          onChange={() => setPaymentMethod('nagad')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-amber-800">Nagad Direct</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                        Fast
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Instant Post-Office Mobile Wallet
                    </span>
                  </label>

                  {/* Wire */}
                  <label
                    className={`cursor-pointer rounded-xl p-4 border flex flex-col justify-between space-y-2 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="text-stone-900 focus:ring-stone-900"
                        />
                        <span className="text-xs font-bold text-stone-900">Corporate Wire</span>
                      </div>
                      <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-mono">
                        B2B
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Standard Chartered / City Bank EFT
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full justify-center text-sm py-4 shadow-md bg-stone-900 hover:bg-stone-800 text-white"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Clearing Transaction & Generating Encrypted Tokens...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-amber-400" />
                    Pay ৳{total.toLocaleString()} BDT & Dispatch Digital Assets
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Right Column: Order Summary & Licensing Rules */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-stone-950">
                  Digital Asset Summary ({items.length})
                </h3>
                <Link href="/digital" className="text-xs text-amber-700 hover:underline">
                  Edit
                </Link>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100 space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-stone-500">
                          <span className="font-bold bg-stone-100 px-1 rounded text-stone-700">
                            {it.file_format}
                          </span>
                          <span>•</span>
                          <span>{it.file_size_mb} MB</span>
                        </div>
                        <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-2 mt-0.5">
                          {it.title}
                        </h4>
                      </div>
                      <span className="font-serif font-bold text-xs text-stone-950 shrink-0">
                        ৳{it.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 flex items-center justify-between">
                      <span>License: {it.license_type}</span>
                      <span className="text-emerald-700 font-medium">Auto-dispatched link</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">৳{subtotal.toLocaleString()} BDT</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount applied</span>
                    <span>-৳{appliedDiscount.toLocaleString()} BDT</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Method</span>
                  <span className="text-emerald-700 font-semibold">Immediate Secure Email (৳0)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-100">
                  <span>Total Due</span>
                  <span className="font-serif">৳{total.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>

            {/* Terms of Digital Sale */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200/80 p-5 space-y-3 text-xs text-stone-500">
              <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider">
                Digital Licensing Safeguards:
              </h4>
              <ul className="space-y-1.5 text-[11px] leading-relaxed">
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Immediate access: Download links activate upon verified transaction.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Expiration safety: Links remain valid for 72 to 168 hours.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Strict non-redistribution: Watermarked to your licensed organization.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

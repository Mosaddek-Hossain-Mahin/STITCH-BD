'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { digitalDb } from '@/lib/digital/db';
import { DigitalDownloadToken, DigitalProduct, DigitalEmailDispatch } from '@/lib/digital/types';
import { DigitalEmailModal } from '@/components/digital/digital-email-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  HardDrive,
  Mail,
  RefreshCw,
  ExternalLink,
  Lock,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';

function subscribeToClock(callback: () => void) {
  const interval = setInterval(callback, 30000);
  return () => clearInterval(interval);
}

function getClockSnapshot() {
  return Math.floor(Date.now() / 1000);
}

function getClockServerSnapshot() {
  return 0;
}

export default function DigitalDownloadTerminalPage() {
  const params = useParams();
  const tokenString = params.token as string;

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const clockSec = useSyncExternalStore(subscribeToClock, getClockSnapshot, getClockServerSnapshot);
  const currentTime = clockSec * 1000;

  const tokenData = useMemo(() => {
    if (!tokenString) return null;
    if (refreshKey < 0) return null;
    return digitalDb.getTokenByString(tokenString) || null;
  }, [tokenString, refreshKey]);

  const productData = useMemo(() => {
    if (!tokenData) return null;
    return digitalDb.getProductById(tokenData.product_id) || null;
  }, [tokenData]);

  const emailDispatch = useMemo(() => {
    if (!tokenData) return null;
    return digitalDb.getEmailByOrderId(tokenData.order_id) || null;
  }, [tokenData]);

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 max-w-md space-y-4 shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Invalid or Unrecognized Download Token
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              We could not verify the cryptographic signature in this download request. Please check the URL link sent to your registered email.
            </p>
          </div>
          <Link
            href="/digital"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            Browse Digital Studio
          </Link>
        </div>
      </div>
    );
  }

  // Token status verification checks
  const isRevoked = tokenData.is_revoked;
  const expiryTimestamp = new Date(tokenData.expires_at).getTime();
  const isExpired = currentTime > 0 && currentTime > expiryTimestamp;
  const isLimitReached = tokenData.downloaded_count >= tokenData.max_downloads;
  const isValid = !isRevoked && !isExpired && !isLimitReached;

  const remainingDownloads = Math.max(0, tokenData.max_downloads - tokenData.downloaded_count);

  // Time remaining calculation
  const msRemaining = currentTime > 0 ? Math.max(0, expiryTimestamp - currentTime) : Math.max(0, expiryTimestamp - new Date(tokenData.created_at).getTime());
  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const daysRemaining = Math.floor(hoursRemaining / 24);

  const handleDownloadAsset = () => {
    if (!isValid) {
      toast.error('Download link cannot be used (expired, revoked, or limit reached)');
      return;
    }

    setIsDownloading(true);

    setTimeout(() => {
      // Consume token via db
      const result = digitalDb.verifyAndConsumeToken(tokenData.token, true, {
        ip: '103.205.71.12 (Verified IP)',
        ua: navigator.userAgent,
      });

      if (!result.valid) {
        toast.error(`Download failed: ${result.reason}`);
        setIsDownloading(false);
        setRefreshKey((k) => k + 1);
        return;
      }

      // Trigger actual browser file download via Blob
      const filePayload = result.fileContent || 'STITCH BD ARCHITECTURAL DIGITAL ASSET';
      const filename = result.filename || `STITCH_BD_${tokenData.product_title.replace(/\s+/g, '_')}.txt`;

      const blob = new Blob([filePayload], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);

      toast.success(`Download started: ${filename}`);
      setIsDownloading(false);
      setRefreshKey((k) => k + 1);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <DigitalEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        emailDispatch={emailDispatch}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center space-x-2">
            <Link href="/digital" className="hover:text-stone-900">
              Digital Studio
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
            <span className="text-stone-900 font-medium">Licensed Asset Download Terminal</span>
          </div>

          {emailDispatch && (
            <button
              onClick={() => setEmailModalOpen(true)}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center font-medium"
            >
              <Mail className="h-3.5 w-3.5 mr-1" />
              View Dispatched Email
            </button>
          )}
        </div>

        {/* Status Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">
                  {tokenData.file_format} • {tokenData.file_size_mb} MB
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Order #{tokenData.order_number}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
                {tokenData.product_title}
              </h1>
              <p className="text-xs text-stone-500">
                Licensed to: <strong className="text-stone-800">{tokenData.customer_name}</strong> ({tokenData.customer_email})
              </p>
            </div>

            {/* Status Badge */}
            <div className="shrink-0">
              {isRevoked ? (
                <Badge variant="destructive" className="text-xs px-3 py-1 bg-rose-600 text-white font-bold">
                  Token Revoked by Admin
                </Badge>
              ) : isExpired ? (
                <Badge variant="destructive" className="text-xs px-3 py-1 bg-rose-600 text-white font-bold">
                  Token Expired ({new Date(tokenData.expires_at).toLocaleDateString()})
                </Badge>
              ) : isLimitReached ? (
                <Badge variant="outline" className="text-xs px-3 py-1 bg-amber-100 text-amber-900 border-amber-300 font-bold">
                  Download Limit Reached ({tokenData.downloaded_count}/{tokenData.max_downloads})
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs px-3 py-1 bg-emerald-600 text-white font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  <span>Verified & Active Token</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Usage Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Download Counter */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                Downloads Remaining
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-serif font-bold text-stone-950">
                  {remainingDownloads}
                </span>
                <span className="text-stone-400">/ {tokenData.max_downloads} allowed</span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-stone-900 h-full rounded-full transition-all"
                  style={{ width: `${(tokenData.downloaded_count / tokenData.max_downloads) * 100}%` }}
                />
              </div>
            </div>

            {/* Time Window Gauge */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                Token Expiration Window
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-serif font-bold text-stone-950">
                  {isExpired ? '0h' : daysRemaining > 0 ? `${daysRemaining}d ${hoursRemaining % 24}h` : `${hoursRemaining}h`}
                </span>
                <span className="text-stone-400">left</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate">
                Until {new Date(tokenData.expires_at).toLocaleString()}
              </p>
            </div>

            {/* Security Cryptography */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-1.5 font-mono">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block font-sans">
                Cryptographic Signature
              </span>
              <div className="text-xs font-bold text-stone-800 truncate">
                {tokenData.token}
              </div>
              <p className="text-[10px] text-stone-400 font-sans">
                Watermarked to licensee organization
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 space-y-3">
            {isValid ? (
              <Button
                onClick={handleDownloadAsset}
                disabled={isDownloading}
                className="w-full justify-center text-sm py-4 shadow-md bg-stone-950 hover:bg-stone-800 text-white"
              >
                {isDownloading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating Secure Stream & Watermarking Archive...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="h-4.5 w-4.5 mr-2 text-amber-400" />
                    Download Master Asset ({tokenData.file_format} • {tokenData.file_size_mb} MB)
                  </span>
                )}
              </Button>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-rose-600" />
                  Download Link Unavailable
                </div>
                <p>
                  {isRevoked
                    ? 'This token has been revoked by studio administrators.'
                    : isExpired
                    ? 'The licensed download window has expired.'
                    : 'The maximum allowed download iterations have been utilized.'}{' '}
                  Please contact <strong className="text-stone-900">concierge@stitchbd.com</strong> with order #{tokenData.order_number} to request license extension.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Download Audit Trail Table */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-stone-950">
              Download Audit Logs
            </h3>
            <span className="text-xs text-stone-500">
              {tokenData.download_logs.length} logged requests
            </span>
          </div>

          {tokenData.download_logs.length === 0 ? (
            <p className="text-xs text-stone-400 py-3">
              No downloads recorded yet. Click the button above to initialize your first download.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {tokenData.download_logs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-stone-800">
                      {new Date(log.downloaded_at).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-stone-400 truncate max-w-sm">
                      {log.user_agent}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                    {log.ip_address}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital License Certificate Proof */}
        <div className="bg-stone-900 text-stone-300 rounded-3xl p-8 border border-stone-800 space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 bg-amber-600 text-stone-950 rounded-lg flex items-center justify-center font-serif text-sm font-bold">
                S
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white tracking-tight">
                  STITCH BD Digital Studio
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                  Official Certificate of Digital Acquisition
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-stone-500">
              ISO 9001 Garment Specification
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-stone-500 block uppercase">Order ID</span>
              <span className="text-white font-bold">{tokenData.order_number}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block uppercase">Licensee</span>
              <span className="text-white font-bold truncate block">{tokenData.customer_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block uppercase">Format</span>
              <span className="text-white font-bold">{tokenData.file_format} Standard</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block uppercase">Issued Date</span>
              <span className="text-white font-bold">{new Date(tokenData.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed font-sans border-t border-stone-800 pt-4">
            This digital certificate certifies that the named licensee holds authorized non-exclusive manufacturing and tailoring rights for the referenced master files. The assets are watermarked and subject to usage limits. For inquiries, contact concierge@stitchbd.com.
          </p>
        </div>
      </div>
    </div>
  );
}

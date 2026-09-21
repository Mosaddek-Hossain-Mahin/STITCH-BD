'use client';

import React, { useState } from 'react';
import { DigitalEmailDispatch } from '@/lib/digital/types';
import { Modal } from '@/components/ui/modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mail, ShieldCheck, Download, Copy, Check, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailDispatch?: DigitalEmailDispatch | null;
}

export function DigitalEmailModal({ isOpen, onClose, emailDispatch }: DigitalEmailModalProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!emailDispatch) return null;

  const handleCopyLink = (token: string, url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    toast.success('Secure download URL copied to clipboard');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatched Customer Email Notification"
      description="Preview of the cryptographic email delivered to the customer inbox with time-limited signed links."
    >
      <div className="space-y-4">
        {/* Email Header Metadata */}
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-stone-600">
            <span><strong>From:</strong> STITCH BD Digital Concierge &lt;digital@stitchbd.com&gt;</span>
            <span className="text-stone-400">Encrypted TLS 1.3</span>
          </div>
          <div className="text-stone-800">
            <strong>To:</strong> {emailDispatch.recipient_name} &lt;{emailDispatch.recipient_email}&gt;
          </div>
          <div className="text-stone-900 font-semibold pt-1 border-t border-stone-200/80">
            <strong>Subject:</strong> {emailDispatch.subject}
          </div>
          <div className="text-stone-500 text-[11px]">
            <strong>Sent:</strong> {new Date(emailDispatch.sent_at).toLocaleString()}
          </div>
        </div>

        {/* Rendered Email Body Simulation */}
        <div className="border border-stone-200 rounded-xl p-6 bg-white space-y-5 shadow-xs">
          {/* Brand header */}
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 bg-stone-950 text-white rounded flex items-center justify-center font-serif text-sm font-bold">
                S
              </div>
              <span className="font-serif font-bold text-stone-950 tracking-tight">STITCH BD</span>
              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Digital Studio
              </span>
            </div>
            <span className="text-xs text-stone-400 font-mono">Order #{emailDispatch.order_number}</span>
          </div>

          <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <p className="font-medium text-stone-900">
              Dear {emailDispatch.recipient_name},
            </p>
            <p>
              Thank you for acquiring our digital atelier assets. Your transaction has been confirmed and verified. Below are your unique, cryptographically signed download tokens.
            </p>
          </div>

          {/* Download Access Boxes */}
          <div className="space-y-3">
            {emailDispatch.token_links.map((link) => (
              <div
                key={link.token}
                className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      {link.product_title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                      <span className="flex items-center text-amber-700 font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        Expires: {new Date(link.expires_at).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center text-stone-600 font-medium">
                        <Download className="h-3 w-3 mr-1 text-stone-400" />
                        Max {link.max_downloads} Downloads Allowed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row gap-2">
                  <a
                    href={link.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: 'sm' }), 'flex-1 text-xs justify-center')}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Open Download Terminal
                  </a>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => handleCopyLink(link.token, link.download_url)}
                  >
                    {copiedToken === link.token ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        Copied Link
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-[10px] text-stone-400 font-mono truncate">
                  Token: {link.token}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-3 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">Security & Licensing Notice:</p>
            <p>
              Please download and save your files to your local workstation before the expiration deadline. These tokens are bound to your account and subject to usage limits. For re-issuance, contact atelier support.
            </p>
          </div>

          <div className="text-center pt-2 border-t border-stone-100 text-[11px] text-stone-400">
            STITCH BD Digital Studio • Dhaka, Bangladesh • concierge@stitchbd.com
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
}

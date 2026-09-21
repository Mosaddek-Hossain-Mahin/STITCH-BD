'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  className?: string;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = 'right',
  className,
  footer,
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className={cn('fixed inset-y-0 flex max-w-full', side === 'right' ? 'right-0' : 'left-0')}>
        <div
          className={cn(
            'relative w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 transition-transform duration-300 ease-out',
            side === 'right'
              ? 'animate-in slide-in-from-right duration-300'
              : 'animate-in slide-in-from-left duration-300',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <div>
              {title && <h2 className="text-lg font-semibold tracking-tight text-stone-900">{title}</h2>}
              {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {/* Optional Footer */}
          {footer && <div className="border-t border-stone-200 p-6 bg-stone-50/70">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

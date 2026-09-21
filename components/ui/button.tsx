'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        default:
          'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm border border-stone-900',
        secondary:
          'bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200/80',
        outline:
          'border border-stone-300 bg-transparent text-stone-800 hover:bg-stone-100/80 hover:text-stone-900',
        ghost:
          'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        accent:
          'bg-amber-700 text-white hover:bg-amber-800 shadow-sm',
        link:
          'text-stone-900 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5 py-2 rounded-lg',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-12 px-7 text-base rounded-lg',
        icon: 'h-9 w-9 rounded-lg p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

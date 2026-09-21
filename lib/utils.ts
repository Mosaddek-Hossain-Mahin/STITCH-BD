import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CURRENCY_CODE = 'BDT';
export const CURRENCY_SYMBOL = '৳';

export function formatPrice(amount: number | undefined | null, options?: { showDecimals?: boolean }): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const showDecimals = options?.showDecimals ?? true;
  return `৳${val.toLocaleString('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatBDT(amount: number | undefined | null): string {
  return formatPrice(amount);
}

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'STITCH BD | Modern Luxury E-Commerce & Administrative Platform',
  description:
    'Production-grade full-stack e-commerce storefront and comprehensive administrative back-office system with real-time inventory, orders, customer management, and Stripe checkout.',
  openGraph: {
    title: 'STITCH BD | Modern Luxury E-Commerce & Administrative Platform',
    description:
      'Production-grade full-stack e-commerce storefront and comprehensive administrative back-office system with real-time inventory, orders, customer management, and Stripe checkout.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STITCH BD | Modern Luxury E-Commerce & Administrative Platform',
    description:
      'Production-grade full-stack e-commerce storefront and comprehensive administrative back-office system with real-time inventory, orders, customer management, and Stripe checkout.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-stone-50 text-stone-900 antialiased selection:bg-stone-900 selection:text-stone-50 font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


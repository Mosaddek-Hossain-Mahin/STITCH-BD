import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 px-4">
      <div className="max-w-md text-center space-y-6">
        <span className="font-mono text-sm tracking-widest text-stone-400 uppercase">Error 404</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
          Page Not Found
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          The editorial piece or collection you are seeking could not be found or has moved to another archive.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-stone-900 text-stone-50 hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider">
              <Home className="mr-2 h-4 w-4" />
              Return to STITCH BD
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold uppercase tracking-wider">
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

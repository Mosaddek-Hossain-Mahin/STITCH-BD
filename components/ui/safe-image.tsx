'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * SafeImage wraps Next.js Image to automatically apply unoptimized={true}
 * when rendering base64 data URLs or blob URLs (such as user-uploaded product photos and logos),
 * avoiding "Invalid src prop" server-side optimization crashes.
 */
export function SafeImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  const isDataOrBlob =
    typeof src === 'string' &&
    (src.startsWith('data:') || src.startsWith('blob:') || src.includes('data:image'));

  return (
    <Image
      src={src}
      alt={alt || 'Image'}
      unoptimized={unoptimized ?? isDataOrBlob}
      referrerPolicy="no-referrer"
      {...rest}
    />
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ScreenshotFrame } from '@/components/public/screenshot-frame';
import { resolveImageSrc } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export function PortfolioGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <ScreenshotFrame
        src={resolveImageSrc(images[activeIndex]?.imageUrl)}
        alt={`${title} — screenshot ${activeIndex + 1}`}
        chrome={false}
        aspect="aspect-[16/10]"
        sizes="(max-width: 1400px) 100vw, 1400px"
        priority={activeIndex === 0}
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'relative shrink-0 overflow-hidden border bg-black transition',
              i === activeIndex
                ? 'border-primary ring-1 ring-primary'
                : 'border-border opacity-60 hover:opacity-100'
            )}
          >
            <Image
              src={resolveImageSrc(img.imageUrl) || '/og-image.png'}
              alt={`Thumbnail ${i + 1}`}
              width={120}
              height={75}
              className="object-cover"
              style={{ width: 120, height: 75 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

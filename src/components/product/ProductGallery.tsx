'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { ShopifyImage } from '@/lib/types'

interface ProductGalleryProps {
  images: ShopifyImage[]
  productTitle: string
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div
        className="aspect-square flex items-center justify-center"
        style={{ backgroundColor: '#F7F7F7' }}
      >
        <span style={{ color: '#ccc', fontSize: '48px' }}>✦</span>
      </div>
    )
  }

  const mainImage = images[selectedIndex]

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '1 / 1', backgroundColor: '#F7F7F7' }}
      >
        <Image
          src={mainImage.url}
          alt={mainImage.altText ?? `${productTitle} — image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-contain p-6"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="flex-shrink-0 relative overflow-hidden transition-all"
              style={{
                width: '72px',
                height: '72px',
                border: index === selectedIndex ? '2px solid #C8102E' : '1px solid #E5E5E5',
                backgroundColor: '#F7F7F7',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${productTitle} thumbnail ${index + 1}`}
                fill
                sizes="72px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

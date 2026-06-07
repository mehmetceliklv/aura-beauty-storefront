'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import { formatPrice, getSalePercent } from '@/lib/shopify'
import { useWishlist } from '@/context/WishlistContext'

interface ProductCardProps {
  product: Product
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const firstVariant = product.variants?.nodes?.[0]
  const price = firstVariant?.price ?? product.priceRange.minVariantPrice
  const compareAt = firstVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice
  const salePercent = getSalePercent(price.amount, compareAt?.amount)

  const isNew = product.tags?.includes('new') || product.tags?.includes('NEW')
  const isBestseller = product.tags?.includes('bestseller') || product.tags?.includes('BESTSELLER')
  const hasDiscount = salePercent !== null && compareAt && parseFloat(compareAt.amount) > 0

  const vendor = product.vendor ?? null
  const wishlisted = isInWishlist(product.id)

  const images = product.images?.nodes ?? []
  const primaryImg = !imgError ? product.featuredImage : null
  const secondImg = images[1] ?? null

  return (
    <article
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-xl mb-4" style={{ aspectRatio: '3/4', background: '#FCEEF5' }}>
        <Link
          href={`/products/${product.handle}`}
          aria-label={`View ${product.title}`}
          className="block w-full h-full"
        >
          {primaryImg ? (
            <>
              <Image
                src={primaryImg.url}
                alt={primaryImg.altText ?? product.title}
                fill
                className={`object-cover transition-all duration-700 ease-out ${hovered && secondImg ? 'opacity-0' : 'opacity-100'} group-hover:scale-105`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
              />
              {secondImg && (
                <Image
                  src={secondImg.url}
                  alt={secondImg.altText ?? product.title}
                  fill
                  className={`object-cover transition-all duration-700 ease-out absolute inset-0 ${hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #FCEEF5, #F4C5DC)' }}>
              <span className="text-3xl" style={{ color: '#F4C5DC' }}>✦</span>
              {vendor && <span className="text-[10px] tracking-widest uppercase" style={{ color: '#9B6B85' }}>{vendor}</span>}
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {hasDiscount && (
            <span className="text-white text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 font-semibold rounded"
              style={{ background: '#C44B8A' }}>
              -{salePercent}%
            </span>
          )}
          {isNew && (
            <span className="bg-aura-charcoal text-white text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 font-medium rounded">
              NEW
            </span>
          )}
          {isBestseller && (
            <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 font-light rounded"
              style={{ background: 'rgba(255,255,255,0.85)', color: '#9B6B85', border: '1px solid #F0D5E5' }}>
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{
            background: wishlisted ? '#C44B8A' : 'rgba(255,255,255,0.9)',
            color: wishlisted ? '#fff' : '#C44B8A',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Quick add */}
        <div
          className="absolute bottom-0 left-0 right-0 py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          style={{ background: 'rgba(253,248,251,0.96)' }}
        >
          <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-aura-charcoal hover:text-aura-rose-gold transition-colors duration-300">
            Quick Add +
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-1 px-0.5">
        {vendor && (
          <p className="text-[10px] tracking-[0.12em] uppercase text-aura-stone font-light truncate">
            {vendor}
          </p>
        )}
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-[13px] font-light leading-snug line-clamp-2 font-display text-aura-charcoal hover:text-aura-rose-gold transition-colors duration-300">
            {product.title}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center gap-2 pt-1">
          {hasDiscount && compareAt && (
            <span className="text-[12px] text-aura-stone line-through">
              {formatPrice(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
          <span
            className="text-[14px] font-medium"
            style={{ color: hasDiscount ? '#C44B8A' : '#1C1C1C' }}
          >
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        </div>
      </div>
    </article>
  )
}

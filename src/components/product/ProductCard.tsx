import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { formatPrice, getSalePercent } from '@/lib/shopify'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.nodes?.[0]
  const price = firstVariant?.price ?? product.priceRange.minVariantPrice
  const compareAt =
    firstVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice
  const salePercent = getSalePercent(price.amount, compareAt?.amount)

  const isNew = product.tags?.includes('new') || product.tags?.includes('NEW')
  const isBestseller =
    product.tags?.includes('bestseller') ||
    product.tags?.includes('BESTSELLER')

  const hasDiscount =
    salePercent !== null && compareAt && parseFloat(compareAt.amount) > 0

  const vendor = product.vendor ?? null

  return (
    <article className="group cursor-pointer">
      {/* Image container */}
      <Link
        href={`/products/${product.handle}`}
        aria-label={`View ${product.title}`}
        className="relative block overflow-hidden bg-white aspect-[3/4] mb-4"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-aura-border-soft text-5xl select-none bg-aura-blush">
            ✦
          </div>
        )}

        {/* Badges — top left, stacked */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="bg-aura-charcoal text-white text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 font-medium">
              NEW
            </span>
          )}
          {isBestseller && (
            <span className="border border-aura-stone text-aura-stone text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 font-light bg-white/80">
              BESTSELLER
            </span>
          )}
          {hasDiscount && (
            <span className="bg-aura-rose-gold text-white text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 font-medium">
              -{salePercent}%
            </span>
          )}
        </div>

        {/* Quick add overlay — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-aura-charcoal hover:text-aura-rose-gold transition-colors duration-300">
            Quick Add
          </span>
        </div>
      </Link>

      {/* Product info */}
      <div className="space-y-1">
        {vendor && (
          <p className="text-[10px] tracking-[0.12em] uppercase text-aura-stone font-light truncate">
            {vendor}
          </p>
        )}
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-[14px] font-light leading-snug line-clamp-2 font-display hover:text-aura-stone transition-colors duration-300">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 pt-1">
          {hasDiscount && compareAt && (
            <span className="text-[12px] text-aura-stone line-through">
              {formatPrice(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
          <span className="text-[14px] font-medium">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        </div>
      </div>
    </article>
  )
}

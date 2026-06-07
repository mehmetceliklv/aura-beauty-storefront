'use client'

import React, { useState } from 'react'
import PriceDisplay from '@/components/ui/PriceDisplay'
import Badge from '@/components/ui/Badge'
import { getSalePercent } from '@/lib/shopify'
import { useCartContext } from '@/context/CartContext'
import type { Product, ProductVariant } from '@/lib/types'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, isLoading } = useCartContext()
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.nodes[0]?.id ?? ''
  )
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = product.variants.nodes.find(
    (v) => v.id === selectedVariantId
  ) ?? product.variants.nodes[0]

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice
  const compareAt = selectedVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice
  const salePercent = getSalePercent(price.amount, compareAt?.amount)

  const isNew = product.tags?.includes('new')
  const isBestseller = product.tags?.includes('bestseller')
  const isAvailable = selectedVariant?.availableForSale ?? false

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return
    await addToCart(selectedVariant.id, quantity)
  }

  // Group options from variants
  const hasMultipleVariants =
    product.variants.nodes.length > 1 &&
    product.variants.nodes[0]?.title !== 'Default Title'

  return (
    <div className="space-y-5">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {isNew && <Badge type="new" />}
        {isBestseller && <Badge type="bestseller" />}
        {salePercent && <Badge type="sale" salePercent={salePercent} />}
      </div>

      {/* Vendor + title */}
      <div>
        <p
          className="uppercase tracking-widest mb-1"
          style={{ fontSize: '11px', color: '#888' }}
        >
          {product.vendor}
        </p>
        <h1
          className="font-bold"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '26px',
            color: '#1B1F3B',
            lineHeight: '1.3',
          }}
        >
          {product.title}
        </h1>
      </div>

      {/* Price */}
      <PriceDisplay
        price={price.amount}
        compareAtPrice={compareAt?.amount}
        currencyCode={price.currencyCode}
      />

      {/* Variant selector */}
      {hasMultipleVariants && (
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
            Select Option
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.nodes.map((variant: ProductVariant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={!variant.availableForSale}
                className="px-3 py-1.5 text-sm transition-all"
                style={{
                  border: variant.id === selectedVariantId ? '2px solid #C8102E' : '1px solid #E5E5E5',
                  color: variant.availableForSale ? '#1a1a1a' : '#aaa',
                  backgroundColor: variant.id === selectedVariantId ? '#FFF5F5' : 'white',
                  cursor: variant.availableForSale ? 'pointer' : 'not-allowed',
                  textDecoration: !variant.availableForSale ? 'line-through' : 'none',
                  fontSize: '13px',
                }}
                aria-pressed={variant.id === selectedVariantId}
                aria-label={`Select ${variant.title}${!variant.availableForSale ? ' (out of stock)' : ''}`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Quantity</span>
        <div className="flex items-center" style={{ border: '1px solid #E5E5E5' }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center w-9 h-9 text-lg transition-colors hover:bg-gray-100"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span
            className="w-10 text-center text-sm font-medium"
            style={{ borderLeft: '1px solid #E5E5E5', borderRight: '1px solid #E5E5E5', padding: '8px 0' }}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center w-9 h-9 text-lg transition-colors hover:bg-gray-100"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!isAvailable || isLoading}
        className="w-full py-3 text-sm font-semibold uppercase tracking-wide transition-colors"
        style={{
          backgroundColor: isAvailable ? '#1B1F3B' : '#ccc',
          color: 'white',
          cursor: isAvailable && !isLoading ? 'pointer' : 'not-allowed',
          opacity: isLoading ? 0.7 : 1,
          letterSpacing: '0.1em',
          fontSize: '13px',
          border: 'none',
        }}
        aria-label={isAvailable ? 'Add to cart' : 'Out of stock'}
      >
        {isLoading ? 'Adding...' : isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
      </button>

      {/* Description */}
      {product.descriptionHtml ? (
        <div
          className="prose prose-sm text-gray-600 max-w-none pt-4"
          style={{ borderTop: '1px solid #E5E5E5' }}
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : product.description ? (
        <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '16px' }}>
          <p className="text-sm text-gray-600" style={{ lineHeight: '1.7' }}>
            {product.description}
          </p>
        </div>
      ) : null}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1"
              style={{ border: '1px solid #E5E5E5', color: '#666' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

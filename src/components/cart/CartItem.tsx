'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/shopify'
import type { CartLine } from '@/lib/types'

interface CartItemProps {
  line: CartLine
  onRemove: (lineId: string) => void
  onUpdateQuantity: (lineId: string, quantity: number) => void
}

function TrashIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export default function CartItem({ line, onRemove, onUpdateQuantity }: CartItemProps) {
  const { merchandise } = line
  const product = merchandise.product

  return (
    <div className="flex gap-3 py-4" style={{ borderBottom: '1px solid #E5E5E5' }}>
      {/* Image */}
      <Link href={`/products/${product.handle}`} className="flex-shrink-0">
        <div
          className="relative bg-gray-100"
          style={{ width: '72px', height: '72px' }}
        >
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              className="object-contain p-1"
              sizes="72px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
              ✦
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.handle}`}>
          <p className="text-sm font-medium line-clamp-2 hover:text-red-600 transition-colors" style={{ color: '#1a1a1a' }}>
            {product.title}
          </p>
        </Link>
        {merchandise.selectedOptions.filter((o) => o.value !== 'Default Title').map((option) => (
          <p key={option.name} className="text-xs mt-0.5" style={{ color: '#888' }}>
            {option.name}: {option.value}
          </p>
        ))}

        {/* Qty + price row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center" style={{ border: '1px solid #E5E5E5' }}>
            <button
              onClick={() => onUpdateQuantity(line.id, Math.max(1, line.quantity - 1))}
              className="flex items-center justify-center w-7 h-7 text-sm transition-colors hover:bg-gray-100"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="w-8 text-center text-sm" style={{ borderLeft: '1px solid #E5E5E5', borderRight: '1px solid #E5E5E5', padding: '4px 0' }}>
              {line.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
              className="flex items-center justify-center w-7 h-7 text-sm transition-colors hover:bg-gray-100"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: '#1a1a1a' }}>
              {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
            </span>
            <button
              onClick={() => onRemove(line.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              aria-label="Remove item"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

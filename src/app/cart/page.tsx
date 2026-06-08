'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartContext } from '@/context/CartContext'
import { formatPrice } from '@/lib/shopify'
import type { CartLine } from '@/lib/types'

function QuantityControl({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="flex items-center border border-aura-border-soft">
      <button
        onClick={onDecrement}
        className="w-8 h-8 flex items-center justify-center text-aura-stone hover:text-aura-charcoal hover:bg-aura-blush transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 h-8 flex items-center justify-center text-[13px] text-aura-charcoal border-x border-aura-border-soft">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center text-aura-stone hover:text-aura-charcoal hover:bg-aura-blush transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

function CartLineRow({
  line,
  onRemove,
  onUpdateQuantity,
  isLoading,
}: {
  line: CartLine
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, qty: number) => void
  isLoading: boolean
}) {
  const { merchandise } = line
  const product = merchandise.product
  const variantOptions = merchandise.selectedOptions.filter(
    (o) => o.value !== 'Default Title'
  )

  return (
    <div className="flex gap-5 py-6 border-b border-aura-border-soft">
      {/* Image */}
      <Link
        href={`/products/${product.handle}`}
        className="flex-shrink-0 w-24 h-24 bg-aura-blush flex items-center justify-center overflow-hidden"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-aura-rose-gold text-2xl">✦</span>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/products/${product.handle}`}
              className="text-[13px] font-medium text-aura-charcoal hover:text-aura-rose-gold transition-colors leading-snug"
            >
              {product.title}
            </Link>
            {variantOptions.length > 0 && (
              <p className="text-[11px] text-aura-stone mt-0.5">
                {variantOptions.map((o) => `${o.name}: ${o.value}`).join(' · ')}
              </p>
            )}
            <p className="text-[12px] text-aura-stone mt-0.5">
              {formatPrice(
                merchandise.price.amount,
                merchandise.price.currencyCode
              )}{' '}
              each
            </p>
          </div>
          <button
            onClick={() => onRemove(line.id)}
            disabled={isLoading}
            className="text-aura-stone hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
            aria-label="Remove item"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QuantityControl
            quantity={line.quantity}
            onDecrement={() =>
              onUpdateQuantity(line.id, Math.max(1, line.quantity - 1))
            }
            onIncrement={() => onUpdateQuantity(line.id, line.quantity + 1)}
          />
          <p className="text-[14px] font-medium text-aura-charcoal">
            {formatPrice(
              line.cost.totalAmount.amount,
              line.cost.totalAmount.currencyCode
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const { cart, isLoading, removeFromCart, updateQuantity } = useCartContext()
  const lines = cart?.lines.nodes ?? []

  if (lines.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="font-display text-4xl font-light text-aura-charcoal mb-6">
          Your Cart
        </h1>
        <div className="text-center py-20 border border-aura-border-soft">
          <span className="text-4xl text-aura-rose-gold block mb-4">✦</span>
          <p className="text-aura-stone text-[14px] mb-8">Your cart is empty.</p>
          <Link
            href="/collections"
            className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = cart?.cost.subtotalAmount
  const total = cart?.cost.totalAmount

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <h1 className="font-display text-2xl sm:text-4xl font-light text-aura-charcoal">
          Shopping Cart
        </h1>
        <p className="text-[12px] text-aura-stone tracking-wider uppercase">
          {cart?.totalQuantity ?? 0}{' '}
          {cart?.totalQuantity === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Cart Lines */}
        <div className="lg:col-span-2">
          <div className="border-t border-aura-border-soft">
            {lines.map((line) => (
              <CartLineRow
                key={line.id}
                line={line}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                isLoading={isLoading}
              />
            ))}
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 mt-6 text-[11px] tracking-[0.12em] uppercase text-aura-stone hover:text-aura-charcoal transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-aura-blush p-8">
          <h2 className="font-display text-2xl font-light text-aura-charcoal mb-6">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[13px] text-aura-stone">
              <span>Subtotal</span>
              <span>
                {subtotal
                  ? formatPrice(subtotal.amount, subtotal.currencyCode)
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between text-[13px] text-aura-stone">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t border-aura-border-soft pt-4 mb-8">
            <div className="flex justify-between text-[15px] font-medium text-aura-charcoal">
              <span>Total</span>
              <span>
                {total
                  ? formatPrice(total.amount, total.currencyCode)
                  : '—'}
              </span>
            </div>
          </div>

          {cart?.checkoutUrl && (
            <a
              href={cart.checkoutUrl}
              className="block w-full py-4 text-center text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300"
            >
              Proceed to Checkout →
            </a>
          )}

          <p className="text-center text-[11px] text-aura-stone mt-4 tracking-wide">
            Secure checkout powered by Shopify
          </p>

          {/* Trust badges */}
          <div className="flex justify-center gap-4 mt-6 text-[10px] text-aura-stone tracking-[0.1em] uppercase">
            <span>✦ SSL Secured</span>
            <span>✦ Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  )
}

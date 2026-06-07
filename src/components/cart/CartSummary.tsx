import React from 'react'
import { formatPrice } from '@/lib/shopify'

interface CartCost {
  subtotalAmount: { amount: string; currencyCode: string }
  totalAmount: { amount: string; currencyCode: string }
}

interface CartSummaryProps {
  cost: CartCost
  checkoutUrl?: string
}

export default function CartSummary({ cost, checkoutUrl }: CartSummaryProps) {
  return (
    <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '16px' }}>
      {/* Subtotal */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Subtotal</span>
        <span className="text-sm font-medium">
          {formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode)}
        </span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold" style={{ fontSize: '15px' }}>Total</span>
        <span className="font-bold" style={{ fontSize: '16px', color: '#1B1F3B' }}>
          {formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode)}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Taxes and shipping calculated at checkout.
      </p>

      {/* Checkout button */}
      {checkoutUrl ? (
        <a
          href={checkoutUrl}
          className="block w-full text-center text-white font-semibold uppercase tracking-wide py-3 transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#C8102E',
            fontSize: '13px',
            letterSpacing: '0.08em',
          }}
        >
          Proceed to Checkout
        </a>
      ) : (
        <button
          disabled
          className="block w-full text-center text-white font-semibold uppercase tracking-wide py-3"
          style={{
            backgroundColor: '#ccc',
            fontSize: '13px',
            letterSpacing: '0.08em',
            cursor: 'not-allowed',
            border: 'none',
          }}
        >
          Checkout
        </button>
      )}
    </div>
  )
}

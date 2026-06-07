'use client'

import React, { useEffect } from 'react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import type { CartLine } from '@/lib/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  lines?: CartLine[]
  cost?: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
  checkoutUrl?: string
  onRemove: (lineId: string) => void
  onUpdateQuantity: (lineId: string, quantity: number) => void
}

function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function CartDrawer({
  isOpen,
  onClose,
  lines = [],
  cost,
  checkoutUrl,
  onRemove,
  onUpdateQuantity,
}: CartDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid #E5E5E5' }}
        >
          <h2 className="font-semibold" style={{ fontSize: '16px', color: '#1B1F3B' }}>
            Cart ({lines.reduce((sum, l) => sum + l.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-4">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            lines.map((line) => (
              <CartItem
                key={line.id}
                line={line}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))
          )}
        </div>

        {/* Summary */}
        {lines.length > 0 && cost && (
          <div className="px-4 py-4" style={{ borderTop: '1px solid #E5E5E5' }}>
            <CartSummary cost={cost} checkoutUrl={checkoutUrl} />
          </div>
        )}
      </div>
    </>
  )
}

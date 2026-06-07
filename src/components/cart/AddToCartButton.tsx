'use client'

import { useState } from 'react'
import { useCartContext } from '@/context/CartContext'

interface AddToCartButtonProps {
  variantId: string
  availableForSale: boolean
  quantity?: number
}

export default function AddToCartButton({
  variantId,
  availableForSale,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addToCart, isLoading: cartLoading } = useCartContext()
  const [added, setAdded] = useState(false)

  if (!availableForSale) {
    return (
      <button
        type="button"
        disabled
        className="w-full bg-gray-200 text-gray-500 text-xs font-semibold tracking-widest uppercase py-3 cursor-not-allowed"
        aria-label="Out of stock"
      >
        OUT OF STOCK
      </button>
    )
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(variantId, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      // Error handled by cart context
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={cartLoading}
      className="w-full bg-aura-navy text-white text-xs font-semibold tracking-widest uppercase py-3 hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      aria-label={
        cartLoading ? 'Adding to cart…' : added ? 'Added to cart' : 'Add to cart'
      }
    >
      {cartLoading ? 'ADDING…' : added ? 'ADDED ✓' : 'ADD TO CART'}
    </button>
  )
}


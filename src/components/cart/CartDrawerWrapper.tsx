'use client'

import React from 'react'
import CartDrawer from './CartDrawer'
import { useCartContext } from '@/context/CartContext'

export default function CartDrawerWrapper() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity } = useCartContext()

  return (
    <CartDrawer
      isOpen={isOpen}
      onClose={closeCart}
      lines={cart?.lines.nodes ?? []}
      cost={cart?.cost}
      checkoutUrl={cart?.checkoutUrl}
      onRemove={removeFromCart}
      onUpdateQuantity={updateQuantity}
    />
  )
}

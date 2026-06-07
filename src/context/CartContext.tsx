'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Cart, CartLine } from '@/lib/types'

interface CartContextValue {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean
  totalQuantity: number
  openCart: () => void
  closeCart: () => void
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error('Shopify environment variables are not configured')
  }
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  )
  if (!res.ok) {
    throw new Error(`Shopify cart API error: ${res.status}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'Cart operation failed')
  }
  return json.data as T
}

const CART_FIELDS = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            selectedOptions { name value }
            product {
              id
              handle
              title
              featuredImage { url altText width height }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Restore cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem('aura_cart_id')
    if (cartId && SHOPIFY_DOMAIN && STOREFRONT_TOKEN) {
      storefrontFetch<{ cart: Cart }>(
        `${CART_FIELDS} query GetCart($id: ID!) { cart(id: $id) { ...CartFields } }`,
        { id: cartId }
      )
        .then(({ cart }) => { if (cart) setCart(cart) })
        .catch(() => {})
    }
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      if (!cart) {
        const data = await storefrontFetch<{ cartCreate: { cart: Cart } }>(
          `${CART_FIELDS}
          mutation CartCreate($variantId: ID!, $qty: Int!) {
            cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $qty }] }) {
              cart { ...CartFields }
            }
          }`,
          { variantId, qty: quantity }
        )
        setCart(data.cartCreate.cart)
        localStorage.setItem('aura_cart_id', data.cartCreate.cart.id)
      } else {
        const data = await storefrontFetch<{ cartLinesAdd: { cart: Cart } }>(
          `${CART_FIELDS}
          mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
          }`,
          { cartId: cart.id, lines: [{ merchandiseId: variantId, quantity }] }
        )
        setCart(data.cartLinesAdd.cart)
      }
      setIsOpen(true)
    } finally {
      setIsLoading(false)
    }
  }, [cart])

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!cart) return
    setIsLoading(true)
    try {
      const data = await storefrontFetch<{ cartLinesRemove: { cart: Cart } }>(
        `${CART_FIELDS}
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
        }`,
        { cartId: cart.id, lineIds: [lineId] }
      )
      setCart(data.cartLinesRemove.cart)
    } finally {
      setIsLoading(false)
    }
  }, [cart])

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return
    setIsLoading(true)
    try {
      const data = await storefrontFetch<{ cartLinesUpdate: { cart: Cart } }>(
        `${CART_FIELDS}
        mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
        }`,
        { cartId: cart.id, lines: [{ id: lineId, quantity }] }
      )
      setCart(data.cartLinesUpdate.cart)
    } finally {
      setIsLoading(false)
    }
  }, [cart])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        totalQuantity: cart?.totalQuantity ?? 0,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used inside CartProvider')
  return ctx
}

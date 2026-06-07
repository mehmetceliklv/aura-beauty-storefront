'use client'

import { useState, useCallback } from 'react'
import type { Cart, CartLine } from '@/lib/types'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

interface UseCartReturn extends CartState {
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  totalQuantity: number
}

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

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    totalQuantity
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
        }
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

export function useCart(): UseCartReturn {
  const [state, setState] = useState<CartState>({
    cart: null,
    isLoading: false,
    error: null,
  })

  const setLoading = (isLoading: boolean) =>
    setState((prev) => ({ ...prev, isLoading }))

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error }))

  const setCart = (cart: Cart | null) =>
    setState((prev) => ({ ...prev, cart, isLoading: false, error: null }))

  const createCart = useCallback(
    async (variantId: string, quantity: number): Promise<Cart> => {
      const mutation = `
        ${CART_FRAGMENT}
        mutation CartCreate($variantId: ID!, $quantity: Int!) {
          cartCreate(input: {
            lines: [{ merchandiseId: $variantId, quantity: $quantity }]
          }) {
            cart { ...CartFields }
          }
        }
      `
      const data = await storefrontFetch<{ cartCreate: { cart: Cart } }>(
        mutation,
        { variantId, quantity }
      )
      return data.cartCreate.cart
    },
    []
  )

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true)
      setError(null)
      try {
        if (!state.cart) {
          const cart = await createCart(variantId, quantity)
          setCart(cart)
          localStorage.setItem('cartId', cart.id)
          return
        }

        const mutation = `
          ${CART_FRAGMENT}
          mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart { ...CartFields }
            }
          }
        `
        const data = await storefrontFetch<{ cartLinesAdd: { cart: Cart } }>(
          mutation,
          {
            cartId: state.cart.id,
            lines: [{ merchandiseId: variantId, quantity }],
          }
        )
        setCart(data.cartLinesAdd.cart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add to cart')
        setLoading(false)
      }
    },
    [state.cart, createCart]
  )

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!state.cart) return
      setLoading(true)
      try {
        const mutation = `
          ${CART_FRAGMENT}
          mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
              cart { ...CartFields }
            }
          }
        `
        const data = await storefrontFetch<{
          cartLinesRemove: { cart: Cart }
        }>(mutation, { cartId: state.cart.id, lineIds: [lineId] })
        setCart(data.cartLinesRemove.cart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove item')
        setLoading(false)
      }
    },
    [state.cart]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cart) return
      setLoading(true)
      try {
        const mutation = `
          ${CART_FRAGMENT}
          mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
              cart { ...CartFields }
            }
          }
        `
        const data = await storefrontFetch<{
          cartLinesUpdate: { cart: Cart }
        }>(mutation, {
          cartId: state.cart.id,
          lines: [{ id: lineId, quantity }],
        })
        setCart(data.cartLinesUpdate.cart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update cart')
        setLoading(false)
      }
    },
    [state.cart]
  )

  return {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalQuantity: state.cart?.totalQuantity ?? 0,
  }
}

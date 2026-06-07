import { NextRequest, NextResponse } from 'next/server'

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

async function shopifyFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    }
  )
  return res.json()
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
              featuredImage { url altText }
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

export async function POST(req: NextRequest) {
  if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  const { action, cartId, variantId, lineId, quantity } = body

  try {
    if (action === 'create') {
      const data = await shopifyFetch(
        `${CART_FIELDS}
        mutation CartCreate($variantId: ID!, $qty: Int!) {
          cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $qty }] }) {
            cart { ...CartFields }
          }
        }`,
        { variantId, qty: quantity ?? 1 }
      )
      return NextResponse.json(data.data?.cartCreate?.cart ?? null)
    }

    if (action === 'addLine') {
      const data = await shopifyFetch(
        `${CART_FIELDS}
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
        }`,
        { cartId, lines: [{ merchandiseId: variantId, quantity: quantity ?? 1 }] }
      )
      return NextResponse.json(data.data?.cartLinesAdd?.cart ?? null)
    }

    if (action === 'removeLine') {
      const data = await shopifyFetch(
        `${CART_FIELDS}
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
        }`,
        { cartId, lineIds: [lineId] }
      )
      return NextResponse.json(data.data?.cartLinesRemove?.cart ?? null)
    }

    if (action === 'updateLine') {
      const data = await shopifyFetch(
        `${CART_FIELDS}
        mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
        }`,
        { cartId, lines: [{ id: lineId, quantity }] }
      )
      return NextResponse.json(data.data?.cartLinesUpdate?.cart ?? null)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Cart error' },
      { status: 500 }
    )
  }
}

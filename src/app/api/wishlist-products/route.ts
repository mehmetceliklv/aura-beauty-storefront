import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'
import type { Product } from '@/lib/types'

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id handle title vendor availableForSale
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    variants(first: 1) {
      nodes {
        id title availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        quantityAvailable
      }
    }
  }
`

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids')?.split(',').filter(Boolean) ?? []
  if (ids.length === 0) return NextResponse.json({ products: [] })

  try {
    const query = `
      ${PRODUCT_FRAGMENT}
      query GetProductsByIds($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product { ...ProductFields }
        }
      }
    `
    const data = await shopifyFetch<{ nodes: (Product | null)[] }>({
      query,
      variables: { ids },
    })
    const products = data.nodes.filter((n): n is Product => n !== null)
    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}

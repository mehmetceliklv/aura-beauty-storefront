interface ShopifyFetchOptions {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  revalidate?: number
}

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 60,
}: ShopifyFetchOptions): Promise<T> {
  const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

  if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error(
      'Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN'
    )
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
      next: { revalidate },
    }
  )

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  if (json.errors) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e: { message: string }) => e.message).join(', ')}`
    )
  }

  return json.data as T
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount))
}

export function getSalePercent(
  price: string,
  compareAtPrice: string | null | undefined
): number | null {
  if (!compareAtPrice) return null
  const original = parseFloat(compareAtPrice)
  const current = parseFloat(price)
  if (original <= current) return null
  return Math.round(((original - current) / original) * 100)
}

import type { Metadata } from 'next'
import { shopifyFetch } from '@/lib/shopify'
import type { Product } from '@/lib/types'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q ?? ''
  return {
    title: q ? `Search: "${q}"` : 'Search',
    description: `Search results for ${q} at AURA BEAUTY.`,
  }
}

const SEARCH_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          ... on Product {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            tags
            featuredImage { url altText width height }
            images(first: 1) { nodes { url altText width height } }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            variants(first: 1) {
              nodes {
                id
                title
                availableForSale
                quantityAvailable
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`

interface SearchResult {
  search: {
    edges: { node: Product }[]
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? ''
  let products: Product[] = []
  let error = false

  if (q) {
    try {
      const data = await shopifyFetch<SearchResult>({
        query: SEARCH_QUERY,
        variables: { query: q, first: 24 },
      })
      products = data.search.edges.map((e) => e.node)
    } catch {
      error = true
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-bold mb-2" style={{ fontSize: '28px', color: '#1B1F3B' }}>
          {q ? `Search results for "${q}"` : 'Search'}
        </h1>
        {q && !error && (
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>

      {!q && (
        <p className="text-gray-500 text-center py-20">
          Enter a search query to find products.
        </p>
      )}

      {q && error && (
        <p className="text-gray-500 text-center py-20">
          Search is not available. Please configure Shopify environment variables.
        </p>
      )}

      {q && !error && products.length === 0 && (
        <p className="text-gray-500 text-center py-20">
          No products found for &ldquo;{q}&rdquo;. Try a different search term.
        </p>
      )}

      {products.length > 0 && <ProductGrid products={products} />}
    </div>
  )
}

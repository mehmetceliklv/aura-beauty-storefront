'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Product } from '@/lib/types'

interface PredictiveSearchResult {
  products: Pick<Product, 'id' | 'title' | 'handle' | 'featuredImage' | 'priceRange'>[]
  collections: { id: string; title: string; handle: string }[]
}

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

const PREDICTIVE_QUERY = `
  query PredictiveSearch($query: String!) {
    predictiveSearch(query: $query, types: [PRODUCT, COLLECTION]) {
      products {
        id
        title
        handle
        featuredImage { url altText width height }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
      }
      collections {
        id
        title
        handle
      }
    }
  }
`

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PredictiveSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults(null)
      return
    }

    if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query: PREDICTIVE_QUERY, variables: { query: q } }),
        }
      )
      const { data } = await res.json()
      setResults(data?.predictiveSearch ?? null)
    } catch {
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleQueryChange = useCallback(
    (q: string) => {
      setQuery(q)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => search(q), 300)
    },
    [search]
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults(null)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return {
    query,
    results,
    isLoading,
    handleQueryChange,
    clearSearch,
  }
}

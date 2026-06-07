import { shopifyFetch } from '@/lib/shopify'
import type { Product, Collection } from '@/lib/types'

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 5) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        quantityAvailable
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
  }
`

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
        collections(first: 3) {
          nodes { handle title }
        }
      }
    }
  `
  const data = await shopifyFetch<{ product: Product | null }>({
    query,
    variables: { handle },
  })
  return data.product
}

export async function getProductsByCollection(
  collectionHandle: string,
  first = 24,
  after?: string,
  sortKey = 'RELEVANCE',
  reverse = false,
  filters?: Record<string, unknown>[]
): Promise<Collection | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetCollectionProducts(
      $handle: String!
      $first: Int!
      $after: String
      $sortKey: ProductCollectionSortKeys
      $reverse: Boolean
      $filters: [ProductFilter!]
    ) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image { url altText width height }
        products(
          first: $first
          after: $after
          sortKey: $sortKey
          reverse: $reverse
          filters: $filters
        ) {
          nodes { ...ProductFields }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          filters {
            id
            label
            type
            values {
              id
              label
              count
              input
            }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ collection: Collection | null }>({
    query,
    variables: {
      handle: collectionHandle,
      first,
      after,
      sortKey,
      reverse,
      filters: filters || [],
    },
  })
  return data.collection
}

export async function getFeaturedProducts(first = 8): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetFeaturedProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        nodes { ...ProductFields }
      }
    }
  `
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>({
    query,
    variables: { first },
  })
  return data.products.nodes
}

export async function getSaleProducts(first = 24): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetSaleProducts($first: Int!, $query: String!) {
      products(first: $first, query: $query, sortKey: BEST_SELLING) {
        nodes { ...ProductFields }
      }
    }
  `
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>({
    query,
    variables: { first, query: 'compare_at_price:>0 OR tag:sale' },
  })

  const saleProducts = data.products.nodes.filter((p) => {
    const compareAt = parseFloat(
      p.compareAtPriceRange?.minVariantPrice?.amount || '0'
    )
    const price = parseFloat(p.priceRange.minVariantPrice.amount)
    return compareAt > price
  })

  if (saleProducts.length > 0) return saleProducts

  // Fallback: return all products if no sale-specific products found
  return data.products.nodes
}

export async function getBestsellers(first = 24): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetBestsellers($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        nodes { ...ProductFields }
      }
    }
  `
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>({
    query,
    variables: { first },
  })
  return data.products.nodes
}

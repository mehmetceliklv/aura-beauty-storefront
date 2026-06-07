import { shopifyFetch } from '@/lib/shopify'
import type { Collection } from '@/lib/types'

export async function getAllCollections(): Promise<Collection[]> {
  const query = `
    query GetAllCollections {
      collections(first: 50) {
        nodes {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
          products(first: 1) {
            nodes {
              id
            }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ collections: { nodes: Collection[] } }>({
    query,
  })
  return data.collections.nodes
}

export async function getCollectionByHandle(
  handle: string
): Promise<Collection | null> {
  const query = `
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
        products(first: 24) {
          nodes {
            id
            handle
            title
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
            variants(first: 1) {
              nodes {
                id
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
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
    variables: { handle },
  })
  return data.collection
}
